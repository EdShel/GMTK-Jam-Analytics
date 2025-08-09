import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import fs from "node:fs";

const WAIT_ON_429_MS = 500;
const WAIT_FOR_NEXT_MS = 300;

function createThrottler() {
  let waitPromise = null;

  return {
    async wait() {
      if (waitPromise) {
        await waitPromise;
      } else {
        waitPromise = new Promise((resolve) =>
          setTimeout(() => {
            waitPromise = null;
            resolve();
          }, WAIT_FOR_NEXT_MS)
        );
      }
    },
    emitTooManyRequests() {
      waitPromise = new Promise((resolve) =>
        setTimeout(() => {
          waitPromise = null;
          resolve();
        }, WAIT_ON_429_MS)
      );
    },
  };
}
const throttler = createThrottler();
async function fetchWithRetry(...args) {
  let retries = 0;

  while (retries < 100) {
    await throttler.wait();
    const response = await fetch(...args);
    if (response.status === 429) {
      console.log(`Too many requests for ${args[0]}`);
      throttler.emitTooManyRequests();
      continue;
    }
    console.log(`${response.statusText} ${args[0]}`);
    return response;
  }

  throw new Error("Ran out of retries");
}

async function getHtml(url) {
  const response = await fetchWithRetry(url, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US;q=0.8,en;q=0.7,uk;q=0.6,ca;q=0.5",
      "sec-ch-ua":
        '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      Referer: "https://itch.io/jam/gmtk-2025/results/creativity",
    },
    body: null,
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      `Response failed: ${response.statusText} '${await response.text()}'.`
    );
  }

  const html = await response.text();
  return html;
}

async function parseResultsPage(pageNumber) {
  const html = await getHtml(
    `https://itch.io/jam/gmtk-2025/results/enjoyment?page=${pageNumber}`
  );
  const dom = new JSDOM(html);
  const gameDivs = dom.window.document.querySelectorAll(".game_rank");
  const games = Array.from(gameDivs).map(scrapeGame);

  const pagerLabel = dom.window.document.querySelector(".pager_label");
  if (!pagerLabel) {
    throw new Error(`Unable to find pager at page ${pageNumber}`);
  }
  const totalPages = Number(pagerLabel.textContent.split(" ").pop());
  return {
    games,
    totalPages,
  };
}

/**
 * @param {Element} element
 */
function scrapeGame(element) {
  const gameCoverLink = element.querySelector("a.game_cover");
  const gameUrl = gameCoverLink.href;

  const gameCoverImage = element.querySelector("a.game_cover img");
  const gameCoverSrc = gameCoverImage?.dataset.lazy_src;

  const gameName = element.querySelector("h2 a").textContent;

  const authorsH3 = element.querySelector("h3");
  const authorsLinks = authorsH3.querySelectorAll("a");
  const authors = Array.from(authorsLinks).map((l) => ({
    url: l.href,
    name: l.textContent,
  }));

  const ratingsCountParagraph = element.querySelector("h3:nth-child(3)");
  if (!ratingsCountParagraph) {
    throw new Error("No ratings count paragraph");
  }
  const ratingsCountMatch = ratingsCountParagraph.textContent.match(
    /with ([\d,.]+) ratings \(Score: /
  );
  if (!ratingsCountMatch) {
    throw new Error("Ratings count paragraph doesn't match regex");
  }
  const ratingsCount = Number(ratingsCountMatch[1].replaceAll(/[,.]/g, ""));

  const submissionLink = Array.from(element.querySelectorAll("a")).find((a) =>
    a.textContent.includes("View submission page")
  );
  if (!submissionLink) {
    throw new Error("No submission link");
  }
  const submissionUrl = submissionLink.href;

  const ranksTableRows = element.querySelectorAll(
    ".ranking_results_table tbody tr"
  );
  const ranks = Array.from(ranksTableRows).map((r) => {
    const cells = r.querySelectorAll("td");
    return {
      category: cells[0].textContent,
      place: Number(cells[1].textContent.substring(1)),
      score: Number(cells[2].textContent),
      rawScore: Number(cells[3].textContent),
    };
  });

  return {
    gameUrl,
    submissionUrl,
    coverUrl: gameCoverSrc,
    name: gameName,
    authors,
    ratingsCount,
    ranks,
  };
}

async function parseGamePage(url) {
  const html = await getHtml(url);
  const doc = new JSDOM(html).window.document;
  const moreInfoRows = Array.from(
    doc.querySelectorAll(".info_panel_wrapper tr")
  );
  const data = moreInfoRows
    .map((r) => {
      const cells = Array.from(r.querySelectorAll("td"));
      const label = cells[0].textContent;
      if (label === "Platforms") {
        return ["platforms", cells[1].textContent];
      }
      if (label === "Genre") {
        return [
          "genres",
          Array.from(cells[1].querySelectorAll("a")).map((a) => a.textContent),
        ];
      }
      if (label === "Made with") {
        return ["madeWith", cells[1].textContent];
      }
      if (label === "Tags") {
        return [
          "tags",
          Array.from(cells[1].querySelectorAll("a")).map((a) => a.textContent),
        ];
      }
      return null;
    })
    .filter(Boolean);
  return Object.fromEntries(data);
}

async function parseGameJam({ from, to }) {
  const result = [];

  let pageNumber = from;
  let totalPages = to;
  do {
    console.log(`Parsing page: ${pageNumber}/${totalPages}`);
    const listResult = await parseResultsPage(pageNumber);
    totalPages = Math.min(to, listResult.totalPages);

    const gameData = await Promise.all(
      listResult.games.map((game) => parseGamePage(game.gameUrl))
    );
    for (let i = 0; i < gameData.length; i++) {
      result.push({
        ...listResult.games[i],
        ...gameData[i],
      });
    }

    pageNumber++;
  } while (pageNumber < totalPages);

  return result;
}

async function main() {
  const jamData = await parseGameJam({ from: 1, to: 20 });
  fs.writeFileSync("./output.json", JSON.stringify(jamData));
  console.log("Done!");
}
main();

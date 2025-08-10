import { useEffect, useState } from "react";
import type { Game } from "./types/Game";
import { BASE_URL } from "./constants";
import HomePage from "./components/HomePage";
import Spinner from "./components/Spinner";
import Router from "crossroad";

function App() {
  const [data, setData] = useState<Game[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}data.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    };
    fetchData();
  }, []);

  return (
    <Router scrollUp>
      <main className="font-display mb-32">
        <h1 className="text-4xl font-bold mb-4 text-center mt-8">
          GMTK Game Jam 2025 Stats
        </h1>

        {error && (
          <p className="text-red-500 text-3xl text-center font-bold">{error}</p>
        )}

        {!data && !error && (
          <div className="flex justify-center mt-8 mb-4">
            <Spinner />
          </div>
        )}

        {data && <HomePage data={data} />}
      </main>
    </Router>
  );
}

export default App;

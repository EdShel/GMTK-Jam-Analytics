export const BASE_URL = makeSureUrlEndsWithSlash(
  import.meta.env.BASE_URL || "/"
);

function makeSureUrlEndsWithSlash(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

import { useEffect, useState } from "react";
import "./App.css";
import type { Game } from "./types/Game";
import Games from "./components/Games";

function App() {
  const [data, setData] = useState<Game[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data.json");
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
    <main className="font-display">
      <h1 className="text-4xl font-bold mb-4 text-center mt-8">
        GMTK Game Jam 2025 Stats
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      {data && <Games data={data} />}
      {!data && !error && <p className="text-gray-500">Loading...</p>}
    </main>
  );
}

export default App;

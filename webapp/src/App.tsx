import { useEffect, useState } from "react";
import "./App.css";
import type { Game } from "./types/Game";

function App() {
  const [data, setData] = useState<Game[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/output.json");
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

  return <pre>{JSON.stringify(data, undefined, 2)}</pre>;
}

export default App;

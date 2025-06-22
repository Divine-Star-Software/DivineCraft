import { useEffect, useRef, useState } from "react";
import { WorldMapComponent } from "Map/WorldMapComponent";
import StartGame from "StartGame";
import UI from "UI/UI";
import { GameContext } from "Game.context";
//import "@babylonjs/inspector";
import { Graph } from "@amodx/ncs";
export function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [graph, setGraph] = useState<Graph | null>(null);
  const [mapEnabled, setMapEnabled] = useState(
    new URL(location.href).searchParams.get("gen-map")
  );

  useEffect(() => {
    (async () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const graph = await StartGame(canvas);
      setGraph(graph);
    })();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {graph && mapEnabled && <WorldMapComponent graph={graph} />}
      {graph && <UI gameRoot={graph.root} />}

      <canvas
        style={{
          width: "100%",
          height: "100%",
          touchAction: "none",
        }}
        ref={canvasRef}
      ></canvas>
    </div>
  );
}

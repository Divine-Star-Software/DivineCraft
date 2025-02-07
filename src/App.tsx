import { useEffect, useRef, useState } from "react";
import { WorldMapComponent } from "Map/WorldMapComponent";
import StartGame from "StartGame";
import UI from "UI/UI";
import { GameComponent } from "Game.component";

export function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [game, setGraph] = useState<(typeof GameComponent)["default"] | null>(
    null
  );
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
      {game && mapEnabled && <WorldMapComponent graph={game.node.graph} />}
      {game && <UI gameRoot={game.node} />}
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

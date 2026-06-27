import {
  Engine,
  Scene,
  FreeCamera,
  Vector3,
  CreateSphere,
  HemisphericLight,
  CreateBox,
  GreasedLineTools,
  CreateGreasedLine,
  StandardMaterial,
  Color3,
  TransformNode,
  Quaternion,
  Axis,
  ArcRotateCamera,
} from "@babylonjs/core";
import { TopDownCamera } from "./TopDownCamera";
import { GenMap } from "./GenMap/GenMap";
import { TickInterval } from "Util/TickInterval";
import { BiomeMap } from "./BiomeMap/BiomeMap";
import { Graph } from "@amodx/ncs";
import { GameContext } from "Game/Game.context";
import { TransformComponent } from "@dvegames/vlox/Transform.component";
import { CameraProviderComponent } from "@dvegames/vlox/Babylon/Providers/CameraProvider.component";
import { GenMapTile } from "./GenMap/GenMapTile";
import { LocationData } from "@divinevoxel/vlox/Math";
import { elm } from "@amodx/elm";
import { GameManager } from "Game/GameManager";

enum MapModes {
  Biome,
  WorldGen,
}

export function WorldMap() {
  const canvas = elm("canvas", {
    style: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: "250",
      top: "0",
      left: "0",
      padding: "0",
      margin: "0",
    },
  });
  let currentMap: GenMap | BiomeMap = new GenMap();
  let isBig = false;
  let mode = MapModes.WorldGen;

  const game = GameContext.getRequired(GameManager.currentGameNode!);
  const playerTransform = TransformComponent.getRequired(
    game.data.activePlayer.node,
  );
  const playerCamera = CameraProviderComponent.getRequiredChild(
    playerTransform.node,
  );

  const engine = new Engine(canvas);
  const scene = new Scene(engine);
  const camera = new ArcRotateCamera(
    "",
    Math.PI,
    0,
    800,
    Vector3.Zero(),
    scene,
  );
  camera.attachControl(camera, true);
  camera.panningSensibility = 1;
  const light = new HemisphericLight("", new Vector3(0, 1, 0), scene);
  light.specular.set(0, 0, 0);
  scene.activeCamera = camera;

  const material = new StandardMaterial("", scene);
  material.diffuseColor.set(0, 1, 1);
  const follow = CreateSphere(
    "",
    {
      diameter: 16,
    },
    scene,
  );
  follow.material = material;

  let lastWidth = 0,
    lastHeight = 0;
  {
    const renderDistanceLines = CreateGreasedLine(
      "",
      {
        points: GreasedLineTools.GetCircleLinePoints(150, 400, 0, 150),
      },
      {
        width: 5,
        color: new Color3(0, 1, 1),
      },
      scene,
    );
    renderDistanceLines.rotation.x = Math.PI / 2;
    renderDistanceLines.parent = follow;
    renderDistanceLines.renderingGroupId = 3;
  }
  {
    const generateDistanceLines = CreateGreasedLine(
      "",
      {
        points: GreasedLineTools.GetCircleLinePoints(300, 400, 0, 300),
      },
      {
        width: 5,
        color: new Color3(0, 1, 0),
      },
      scene,
    );
    generateDistanceLines.rotation.x = Math.PI / 2;
    generateDistanceLines.parent = follow;
    generateDistanceLines.renderingGroupId = 3;
  }
  /*     {
      const generateLeadDistanceLines = CreateGreasedLine(
        "",
        {
          points: GreasedLineTools.GetCircleLinePoints(200, 400, 0, 200),
        },
        {
          width: 5,
          color: new Color3(0, 1, 0),
        },
        scene
      );
      generateLeadDistanceLines.rotation.x = Math.PI / 2;
      generateLeadDistanceLines.parent = follow;
      generateLeadDistanceLines.renderingGroupId = 3;
      generateLeadDistanceLines.position.z = 200;
    } */
  {
    const directionLine = CreateGreasedLine(
      "",
      {
        points: [new Vector3(0, 0, 0), new Vector3(150, 0, 0)],
      },
      {
        width: 5,
        color: new Color3(0, 1, 1),
      },
      scene,
    );
    //   directionLine.rotation.z = Math.PI / 2;
    // directionLine.rotation.x = -Math.PI / 2;
    directionLine.parent = follow;
    directionLine.renderingGroupId = 3;
  }

  const fixedParent = new TransformNode("", scene);
  {
    const parent = new TransformNode("", scene);
    const axisLine1 = CreateGreasedLine(
      "",
      {
        points: [new Vector3(0, 0, 0), new Vector3(0, 0, -100)],
      },
      {
        width: 5,
        color: new Color3(1, 0, 0),
      },
      scene,
    );
    axisLine1.parent = parent;
    axisLine1.renderingGroupId = 3;

    const axisLine2 = CreateGreasedLine(
      "",
      {
        points: [new Vector3(0, 0, 0), new Vector3(100, 0, 0)],
      },
      {
        width: 5,
        color: new Color3(1, 0, 0),
      },
      scene,
    );
    axisLine2.parent = parent;
    axisLine2.renderingGroupId = 3;

    parent.position.y = 10;
    parent.parent = fixedParent;
  }

  const resized = new ResizeObserver(() => {
    const { width, height } = canvas!.parentElement!.getBoundingClientRect();
    if (width != lastWidth || height != lastHeight) {
      engine.setSize(width, height);

      lastWidth = width;
      lastHeight = height;
      // camera._updateRatio();
    }
  });
  const startRotation = camera.rotation.clone();
  const startAlpha = camera.alpha;
  const startBeta = camera.beta;
  resized.observe(canvas!);
  engine.runRenderLoop(() => {
    if (!isBig) {
      const playerPosition = playerTransform.schema.position;
      follow.position.set(playerPosition.x, playerPosition.y, playerPosition.z);
      fixedParent.position.set(
        playerPosition.x,
        playerPosition.y,
        playerPosition.z,
      );

      const direction = playerCamera.data.camera
        .getDirection(new Vector3(0, 0, 1))
        .normalize();

      const normalized = new Vector3(direction.x, 0, direction.z).normalize();

      // Calculate rotation angle
      const angle = Math.atan2(normalized.x, normalized.z);

      // Create a quaternion for rotation
      const rotationQuaternion = Quaternion.RotationAxis(Axis.Y, angle);

      // Apply rotation quaternion to the follow object
      follow.rotationQuaternion = rotationQuaternion;

      follow.position.y = 10;

      fixedParent.position.y = 10;

      camera.radius = 800;

      camera.setTarget(follow.position.clone());

      camera.alpha = startAlpha;
      camera.beta = startBeta;
      camera.rotation.copyFrom(startRotation);
    }
    scene.render();
  });

  currentMap.init(scene);

  const location: LocationData = [
    0,
    playerTransform.schema.position.x,
    playerTransform.schema.position.y,
    playerTransform.schema.position.z,
  ];
  const inte = new TickInterval(() => {
    //   mapRef.current.updateTiles(["main", 0, 0, 0]);
    //   if (!props.nodes.player?.model?.model) return;
    location[1] = playerTransform.schema.position.x;
    location[2] = playerTransform.schema.position.y;
    location[3] = playerTransform.schema.position.z;

    currentMap.updateTiles(location);
  }, 50);
  inte.start();

  const renderCanvasContainer = document.getElementById(
    "render-canvas-container",
  )!;
  renderCanvasContainer.append(
    elm(
      "div",
      {
        ondblclick: (event) => {
          isBig = !isBig;
          const el = event.target as HTMLDivElement;
          el.style.width = !isBig ? "250px" : "100%";
          el.style.height = !isBig ? "250px" : "100%";
        },
        className: "world-map-container",
        style: {
          position: "absolute",
          zIndex: "200",
          width: "250px",
          height: "250px",
          top: "0",
          right: "0",
          padding: "0",
          margin: "0",
        },
      },

      elm(
        "div",
        {
          style: {
            position: "relative",
            zIndex: "300",
            top: "0",
            left: "0",
            padding: "0",
            margin: "0",
            width: "10%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          },
        },
        elm(
          "button",
          {
            onclick: () => {
              mode = MapModes.WorldGen;
              currentMap.dispose();
              currentMap = new GenMap();
              currentMap.init(scene);
            },
          },
          "World Gen",
        ),
        elm(
          "button",
          {
            onclick: () => {
              mode = MapModes.Biome;
              currentMap.dispose();
              currentMap = new BiomeMap();
              currentMap.init(scene);
            },
          },
          "Biome",
        ),
      ),
      canvas,
    ),
  );
}

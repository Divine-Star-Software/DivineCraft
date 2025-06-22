import { NCS } from "@amodx/ncs/";
import {
  CreatePlane,
  Mesh,
  Texture,
  Effect,
  ShaderMaterial,
} from "@babylonjs/core";
import { BabylonContext } from "@dvegames/vlox/Babylon/Babylon.context";
import { NoiseShaders } from "@divinevoxel/vlox-babylon/Shaders/Code/Shared/NoiseShader";
import { SkyShaders } from "@divinevoxel/vlox-babylon/Shaders/Code/Shared/SkyShader";
import { Vector3Like } from "@amodx/math";
import { SceneUBO } from "@divinevoxel/vlox-babylon/Scene/SceneUBO";
import { DVEBabylonRenderer } from "@divinevoxel/vlox-babylon/Renderer/DVEBabylonRenderer";
import { FogShaders } from "@divinevoxel/vlox-babylon/Shaders/Code/Shared/FogShader";

import { PositionDirectionProviderComponent } from "@dvegames/vlox/Providers/PositionDirectionProvider.component";

Effect.ShadersStore["sunVertexShader"] = /*glsl */ `#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;

uniform mat4 world;
uniform mat4 viewProjection;
uniform vec3 cameraPosition;

${SceneUBO.Define}

//varying
out vec2 vUV; 
out vec3 worldPOS;
out float vDistance;

void main(void) {
  vUV = uv;
  vec4 p = vec4( position, 1.0 );
  worldPOS = vec3( vec4(world * p).xyz);
  vDistance = distance(cameraPosition, worldPOS );
  gl_Position = viewProjection * world * p;
}
`;

Effect.ShadersStore["sunFragmentShader"] = /*glsl */ `#version 300 es
precision highp float;

uniform sampler2D sunTexture;
uniform vec3 cameraPosition;

${SceneUBO.Define}

in vec2 vUV; 
in vec3 worldPOS;
in float vDistance;


${NoiseShaders.FBMNoiseFunctions}
${FogShaders.Functions}
${SkyShaders.Functions}


out vec4 FragColor;  
void main(void) {
  vec4 sunColor = texture(sunTexture, vUV);
  if (sunColor.a < 0.1) {
      discard;
  }
  FragColor = blendFog( getFogColor(),sunColor);
}
`;

class Data {
  _sun: Mesh;
  _sunMaterial: ShaderMaterial;
  constructor(public renderer: DVEBabylonRenderer) {
    this._sun = CreatePlane("", { size: 100 }, renderer.scene);
    this._sun.rotation.y = Math.PI / 2;
    this._sun.bakeCurrentTransformIntoVertices();
    this._sun.alwaysSelectAsActiveMesh = true;
    this._sun.renderingGroupId = 1;

    const texture = new Texture("assets/sun.png", renderer.scene);
    texture.hasAlpha = true; // Enable alpha handling
    texture.getAlphaFromRGB = true;
    texture.onLoadObservable.addOnce(() => {
      texture.updateSamplingMode(Texture.NEAREST_NEAREST);
    });

    const sunMaterial = new ShaderMaterial(
      "sun",
      renderer.scene,
      {
        vertex: "sun",
        fragment: "sun",
      },
      {
        attributes: ["position", "normal", "uv"],
        uniforms: [
          "world",
          "viewProjection",
          "cameraPosition",
          "offset",
          "sunTexture",
        ],
        needAlphaBlending: true,
        uniformBuffers: ["SceneOptions"],
      }
    );
    sunMaterial.setUniformBuffer(
      "SceneOptions",
      renderer.voxelScene.options.ubo.buffer
    );
    this._sunMaterial = sunMaterial;
    sunMaterial.setTexture("sunTexture", texture);
    this._sun.material = sunMaterial;

    this._sun.position.y = 200;
    this._sun.billboardMode = 4;
  }

  setTimeOfDay(time: number) {}
}

export const SunComponent = NCS.registerComponent({
  type: "sun",
  schema: NCS.schema({}),
  data: NCS.data<Data>(),
  init(component) {
    const entityWatch = PositionDirectionProviderComponent.getRequired(
      component.node
    )!.data;

    const { renderer } = BabylonContext.getRequired(component.node).data;
    const data = new Data(renderer);
    component.data = data;
    const startX = 450;
    data._sun.registerBeforeRender(() => {
      data._sun.position.x = startX + entityWatch.position.x;
      data._sun.position.z = entityWatch.position.z;
    });
  },
});

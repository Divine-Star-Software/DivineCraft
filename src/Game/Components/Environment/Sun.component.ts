import { NCS } from "@amodx/ncs/";
import { CreatePlane } from "@babylonjs/core/Meshes/Builders/planeBuilder";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Effect } from "@babylonjs/core/Materials/effect";
import { ShaderMaterial } from "@babylonjs/core/Materials/shaderMaterial";
import { BabylonContext } from "@dvegames/vlox/Babylon/Babylon.context";
import { NoiseShaders } from "@divinevoxel/vlox-babylon/Shaders/Code/Shared/NoiseShader";
import { SkyShaders } from "@divinevoxel/vlox-babylon/Shaders/Code/Shared/SkyShader";
import { SceneUBO } from "@divinevoxel/vlox-babylon/Scene/SceneUBO";
import { DVEBabylonRenderer } from "@divinevoxel/vlox-babylon/Renderer/DVEBabylonRenderer";
import { FogShaders } from "@divinevoxel/vlox-babylon/Shaders/Code/Shared/FogShader";

import { PositionDirectionProviderComponent } from "@dvegames/vlox/Providers/PositionDirectionProvider.component";

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

    const uniforms: string[] = [
      "world",
      "viewProjection",
      "cameraPosition",
      "offset",
      "sunTexture",
    ];
    if (!renderer.sceneOptions.ubo.suppourtsUBO) {
      uniforms.push(...renderer.sceneOptions.ubo.allUniformsNames);
    }
    const sunMaterial = new ShaderMaterial(
      "sun",
      renderer.scene,
      {
        vertex: "sun",
        fragment: "sun",
      },
      {
        attributes: ["position", "normal", "uv"],
        uniforms,
        needAlphaBlending: true,
        ...(renderer.sceneOptions.ubo.suppourtsUBO
          ? {
              uniformBuffers: ["SceneOptions"],
            }
          : {}),
      }
    );
    if (renderer.sceneOptions.ubo.buffer) {
      sunMaterial.setUniformBuffer(
        "SceneOptions",
        renderer.sceneOptions.ubo.buffer
      );
    } else {
      renderer.sceneOptions.ubo.observers.beforeSync.add(() => {
        renderer.sceneOptions.ubo.syncToShaderMaterial(false, sunMaterial);
      });
    }
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
    Effect.ShadersStore["sunVertexShader"] = /*glsl */ `#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;

uniform mat4 world;
uniform mat4 viewProjection;
uniform vec3 cameraPosition;

${SceneUBO.UniformBufferSuppourted ? SceneUBO.Define : SceneUBO.BaseDefine}

//varying
out vec2 vUV; 
out vec3 vWorldPOS;
out float vDistance;

void main(void) {
  vUV = uv;
  vec4 p = vec4( position, 1.0 );
  vWorldPOS = vec3( vec4(world * p).xyz);
  vDistance = distance(cameraPosition, vWorldPOS );
  gl_Position = viewProjection * world * p;
}
`;

    Effect.ShadersStore["sunFragmentShader"] = /*glsl */ `#version 300 es
precision highp float;

uniform sampler2D sunTexture;
uniform vec3 cameraPosition;

${SceneUBO.UniformBufferSuppourted ? SceneUBO.Define : SceneUBO.BaseDefine}

in vec2 vUV; 
in vec3 vWorldPOS;
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

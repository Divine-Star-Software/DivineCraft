import { Distance2D, Vec2Array, Vector3Like } from "@amodx/math";
import { NCS } from "@amodx/ncs/";
import {
  CreatePlane,
  Effect,
  InstancedMesh,
  Mesh,
  ShaderMaterial,
} from "@babylonjs/core";

import { WorldSpaces } from "@divinevoxel/vlox/World/WorldSpaces";
import { BabylonContext } from "@dvegames/vlox/Babylon/Babylon.context";
import { createNoise2D, NoiseFunction2D } from "simplex-noise";
import { NoiseShaders } from "@divinevoxel/vlox-babylon/Shaders/Code/Shared/NoiseShader";
import { SkyShaders } from "@divinevoxel/vlox-babylon/Shaders/Code/Shared/SkyShader";
import { VoxelFaceNames } from "@divinevoxel/vlox/Math";
import { SceneUBO } from "@divinevoxel/vlox-babylon/Scene/SceneUBO";
import { DVEBabylonRenderer } from "@divinevoxel/vlox-babylon/Renderer/DVEBabylonRenderer";
import { FogShaders } from "@divinevoxel/vlox-babylon/Shaders/Code/Shared/FogShader";

import { PositionDirectionProviderComponent } from "@dvegames/vlox/Providers/PositionDirectionProvider.component";

Effect.ShadersStore["cloudVertexShader"] = /*glsl */ `#version 300 es
precision highp float;
in vec3 position;
in vec3 normal;

uniform mat4 world;
uniform mat4 viewProjection;

uniform vec3 cameraPosition;
uniform float offset;
${SceneUBO.Define}

#ifdef INSTANCES
  //matricies
  in vec4 world0;
  in vec4 world1;
  in vec4 world2;
  in vec4 world3;
  //custom attributes
#endif


//varying
out vec3 worldPOS;
out float vDistance;
out float brightness;

void main(void) {
  if(normal.x != 0. || normal.z != 0.) {
    brightness = .9;
  }
  if(normal.y > 0.) {
    brightness = 1.2;
  }
  if(normal.y < 0.) {
    brightness = .8;
  }
  #ifdef INSTANCES
  mat4 finalWorld = mat4(world0, world1, world2, world3);
  vec4 p = vec4( position, 1.0 );

  p.x -= offset;
  worldPOS = vec3( vec4(finalWorld * p).xyz);
  vDistance = distance(cameraPosition , worldPOS );
  gl_Position = viewProjection * finalWorld * p;
  #endif
  #ifndef INSTANCES
  #endif
}
`;

Effect.ShadersStore["cloudFragmentShader"] = /*glsl */ `#version 300 es
precision highp float;

uniform vec3 cameraPosition;
${SceneUBO.Define}

in vec3 worldPOS;
in float vDistance;
in float brightness;

${NoiseShaders.FBMNoiseFunctions}
${FogShaders.Functions}
${SkyShaders.Functions}

out vec4 FragColor;  
void main(void) {
  vec3 fogColor = getFogColor();
  vec4 cloudColor = blendFog(fogColor,vec4(vec3(1. * brightness), mix(0.9, 0.0, smoothstep(200., 300., vDistance))));
  FragColor =cloudColor;
}
`;

const checks = [
  [0, 0, 1],
  [0, 0, -1],
  [1, 0, 0],
  [-1, 0, 0],
];
const added: [boolean, boolean, boolean, boolean] = [
  false,
  false,
  false,
  false,
];
const queue: number[] = [];
const visited = new Set();

class Cloud {
  position: Vec2Array = [0, 0];
  instances: InstancedMesh[] = [];
}
const cloudPool: Cloud[] = [];

class Data {
  clouds = new Map<string, Cloud>();
  _noise: NoiseFunction2D;

  _planes: Record<VoxelFaceNames, Mesh>;
  _offset = 0;
  _offsetCloudSector = 0;
  constructor(
    public renderer: DVEBabylonRenderer,
    public watchPosition: Vector3Like
  ) {
    this._noise = createNoise2D();

    const cloudMaterial = new ShaderMaterial(
      "cloud",
      renderer.scene,
      {
        vertex: "cloud",
        fragment: "cloud",
      },
      {
        attributes: ["position", "normal", "uv"],
        uniforms: ["world", "viewProjection", "cameraPosition", "offset"],
        needAlphaBlending: true,
        uniformBuffers: ["SceneOptions"],
      }
    );
    cloudMaterial.setUniformBuffer(
      "SceneOptions",
      renderer.voxelScene.options.ubo.buffer
    );
    const size = 12;
    this._offset = 0;
    const speed = 0.01;

    renderer.scene.registerBeforeRender(() => {
      this._offset += speed;
      cloudMaterial.setFloat("offset", this._offset);
      const sector = Math.floor(this._offset / size) * size;
      if (sector != this._offsetCloudSector) {
        this.runUpdate();
        this._offsetCloudSector = sector;
      }
    });

    //   cloudMaterial.disableDepthWrite = true;

    {
      const up = CreatePlane("", { size: size }, renderer.scene);
      up.rotation.x = Math.PI / 2;
      up.bakeCurrentTransformIntoVertices();
      up.createNormals(false);
      const height = 4;
      const down = CreatePlane(
        "",
        { size: size, sideOrientation: 1 },
        renderer.scene
      );
      down.rotation.x = Math.PI / 2;
      down.bakeCurrentTransformIntoVertices();
      down.createNormals(false);
      const south = CreatePlane(
        "",
        { width: size, height: height },
        renderer.scene
      );
      south.bakeCurrentTransformIntoVertices();
      south.createNormals(false);
      const north = CreatePlane(
        "",
        { width: size, height: height, sideOrientation: 1 },
        renderer.scene
      );
      north.bakeCurrentTransformIntoVertices();
      north.createNormals(false);
      const east = CreatePlane(
        "",
        { width: size, height: height },
        renderer.scene
      );
      east.rotation.y = -Math.PI / 2;
      east.bakeCurrentTransformIntoVertices();
      east.createNormals(false);
      const west = CreatePlane(
        "",
        { width: size, height: height },
        renderer.scene
      );
      west.rotation.y = Math.PI / 2;
      west.bakeCurrentTransformIntoVertices();
      west.createNormals(false);
      this._planes = {
        up,
        down,
        north,
        south,
        east,
        west,
      };
      for (const key in this._planes) {
        const plane = this._planes[key as VoxelFaceNames];
        plane.isVisible = false;
        plane.material = cloudMaterial;
        plane.alwaysSelectAsActiveMesh = true;
        plane.renderingGroupId = 1;
      }
    }
  }

  _planePool: Record<VoxelFaceNames, InstancedMesh[]> = {
    up: [],
    down: [],
    north: [],
    south: [],
    east: [],
    west: [],
  };
  _getPlanePool(face: VoxelFaceNames) {
    if (!this._planePool[face].length) {
      const newInstance = this._planes[face].createInstance(face);
      newInstance.alwaysSelectAsActiveMesh = true;
      return newInstance;
    }
    const plane = this._planePool[face].shift()!;
    plane.setEnabled(true);
    return plane;
  }
  _isCloud(x: number, z: number) {
    const scale = 100;
    return this._noise(x / scale, z / scale) > 0.29;
  }

  runUpdate() {
    const originX = this.watchPosition.x + this._offset;
    const originZ = this.watchPosition.z;

    queue.length = 0;
    visited.clear();
    const maxDistance = 300;
    const size = 12;
    queue.push(
      Math.floor(originX / size) * size,
      Math.floor(originZ / size) * size
    );

    for (const [key, cloud] of this.clouds) {
      const distance = Distance2D(
        cloud.position[0] - this._offset,
        originX,
        cloud.position[1],
        originZ
      );
      if (distance < maxDistance) continue;
      this.clouds.delete(key);
      for (let i = 0; i < cloud.instances.length; i++) {
        cloud.instances[i].setEnabled(false);
        this._planePool[cloud.instances[i].name as VoxelFaceNames]!.push(
          cloud.instances[i]
        );
      }
      cloud.instances.length = 0;
      cloudPool.push(cloud);
    }
    while (queue.length) {
      const x = queue.shift()!;
      const z = queue.shift()!;
      const distance = Distance2D(x, originX, z, originZ);
      if (distance > maxDistance) continue;
      const key = WorldSpaces.hash.hashXYZ(x, 0, z);
      const isCloud = this._isCloud(x, z);
      if (visited.has(key)) continue;
      visited.add(key);
      let needAdd = false;
      if (isCloud) {
        if (!this.clouds.get(key)) {
          needAdd = true;
          added[0] = false;
          added[1] = false;
          added[2] = false;
          added[3] = false;
        }
      }

      for (let i = 0; i < 4; i++) {
        const nx = checks[i][0] * size + x;
        const nz = checks[i][2] * size + z;
        queue.push(nx, nz);
        if (needAdd) {
          added[i] = this._isCloud(nx, nz);
        }
      }
      if (needAdd) {
        const newCloud = cloudPool.length ? cloudPool.shift()! : new Cloud();
        newCloud.position[0] = x;
        newCloud.position[1] = z;
        const height = 128;
        const top = this._getPlanePool("up");
        top.position.set(x, height + 2, z);
        newCloud.instances.push(top);
        const bottom = this._getPlanePool("down");
        bottom.position.set(x, height - 2, z);
        newCloud.instances.push(bottom);
        if (!added[0]) {
          const north = this._getPlanePool("north");
          north.position.set(x, height, z + size / 2);
          newCloud.instances.push(north);
        }
        if (!added[1]) {
          const south = this._getPlanePool("south");
          south.position.set(x, height, z - size / 2);
          newCloud.instances.push(south);
        }
        if (!added[2]) {
          const east = this._getPlanePool("east");
          east.position.set(x + size / 2, height, z);
          newCloud.instances.push(east);
        }
        if (!added[3]) {
          const west = this._getPlanePool("west");
          west.position.set(x - size / 2, height, z);
          newCloud.instances.push(west);
        }

        this.clouds.set(key, newCloud);
      }
    }
  }
}

export const CloudsComponent = NCS.registerComponent({
  type: "clouds",
  schema: NCS.schema({}),
  data: NCS.data<Data>(),
  init(component) {
    const entityWatch = PositionDirectionProviderComponent.getRequired(
      component.node
    )!.data;

    const { scene, renderer } = BabylonContext.getRequired(component.node).data;

    const sectorPosition = WorldSpaces.sector.getPosition(
      entityWatch.position.x,
      entityWatch.position.y,
      entityWatch.position.z
    );
    const tempPosition = Vector3Like.Create();

    const data = new Data(renderer, sectorPosition);
    data.runUpdate();
    component.data = data;
    scene.registerBeforeRender(() => {
      WorldSpaces.sector.getPosition(
        entityWatch.position.x,
        entityWatch.position.y,
        entityWatch.position.z,
        tempPosition
      );
      let changed = false;
      if (
        sectorPosition.x != tempPosition.x ||
        sectorPosition.y != tempPosition.y ||
        sectorPosition.z != tempPosition.z
      ) {
        changed = true;
        sectorPosition.x = tempPosition.x;
        sectorPosition.y = tempPosition.y;
        sectorPosition.z = tempPosition.z;
      }
      if (changed) data.runUpdate();
    });
  },
});

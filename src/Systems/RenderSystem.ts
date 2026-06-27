import type { FreeCamera, Engine, Scene, TargetCamera } from "@babylonjs/core";
import { DVEBabylonRenderer } from "@divinevoxel/vlox-babylon/Renderer/DVEBabylonRenderer";
export class RenderSystem {
  static renderCanvas: HTMLCanvasElement;
  static _canvasVisible = false;
  static _canvasActive = false;
  static gameCamera: FreeCamera;
  static idleCamera: TargetCamera;
  static scene: Scene;
  static engine: Engine;
  static renderer: DVEBabylonRenderer;

  static get sceneTool() {
    return DVEBabylonRenderer.instance.sceneOptions;
  }
  static createRenderCanvas() {
    const canvas = document.createElement("canvas");
    canvas.id = "renderCanvas";
    document.body.append(canvas);
    this.renderCanvas = canvas;
    canvas.style.display = "block";

    return canvas;
  }

  static setPointerEnabled(enabled: boolean) {
    if (enabled) {
      document.body.classList.add("pointer-on");
    } else {
      document.body.classList.remove("pointer-on");
    }
  }

  static exitPointerLock() {
    try {
      document.exitPointerLock();
    } catch (error) {
      console.warn(error);
    }
  }

  static enterPointerLock() {
    try {
      this.renderCanvas.requestPointerLock();
    } catch (error) {
      console.warn(error);
    }
  }

  static setFullScreen(enable: boolean) {
    try {
      if (enable) {
        return document.documentElement.requestFullscreen();
      }
      if (document.fullscreenElement) document.exitFullscreen();
    } catch (error) {
      console.warn(error);
    }
  }

  static setCanvasVisability(visisble: boolean) {
    if (visisble) {
      this._canvasVisible = true;
      this.renderCanvas.style.display = "block";
    } else {
      this._canvasVisible = false;
      this.renderCanvas.style.display = "none";
    }
  }

  static setCanvasInteractive(interactive: boolean) {
    if (interactive) {
      this._canvasActive = true;
      this.renderCanvas.style.pointerEvents = "all";
    } else {
      this._canvasActive = false;
      this.renderCanvas.style.pointerEvents = "none";
    }
  }
}

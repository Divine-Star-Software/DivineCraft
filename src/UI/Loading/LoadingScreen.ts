import { elm } from "@amodx/elm";
import { LevelLoaderProgress } from "./LevelLoaderProgress";
import { ProgressBar } from "./ProgressBar";

export type LoadScreenShowOptions = {
  progressBar?: true;
};

export class LoadingScreen {
  static parent = document.createElement("div");

  static _show = false;

  static progress = new ProgressBar();
  static levelLoaderProgress = new LevelLoaderProgress();

  static init() {
    this.parent.className = "loading-screen";
    this.parent.append(elm("div", "game-title", elm("h1", "", "Divine Craft")));
    this.parent.append(this.levelLoaderProgress.container);
    this.parent.append(this.progress.container);
  }

  static show(options: LoadScreenShowOptions = {}) {
    return new Promise((resolve) => {
      this._show = true;
      document.body.append(this.parent);
      this.progress.show(options.progressBar || false);
      this.parent.animate([{ opacity: 0 }, { opacity: 1 }], 500).onfinish =
        () => resolve(true);
    });
  }

  static hide() {
    return new Promise((resolve) => {
      this._show = false;
      this.parent.animate([{ opacity: 1 }, { opacity: 0 }], 500).onfinish =
        () => {
          resolve(true);
          this.parent.remove();
        };
    });
  }
}

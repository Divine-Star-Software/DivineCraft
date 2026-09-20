import { LoadingScreen  } from "./LoadingScreen";
import "./LoaderScreen.css";
LoadingScreen.init();
LoadingScreen.progress.text("loading code");
await LoadingScreen.show({
  progressBar: true,
});

export default LoadingScreen;

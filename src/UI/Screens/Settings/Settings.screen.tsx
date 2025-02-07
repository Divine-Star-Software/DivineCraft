import { Button } from "UI/Components/Button/Button";
import { UIScreen, UIScreenComponent } from "../UIScreen";
import AudioSettings from "./AudioSettings";
import GameSettings from "./GameSettings";
import KeybindSettings from "./KeybindSettings";
import "./Settings.css";
import { useState } from "react";
import { UIScreensIds } from "Game.types";


function SettingsItem(props: {  title: string; action: Function }) {
  return (
    <div className="settings-item" onClick={() => props.action()}>
      <div className="settings-item-image">
{/*         <img src={props.img} /> */}
      </div>
      <div className="settings-item-title">
        <p>{props.title}</p>
      </div>
      <div className="settings-item-arrow">
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.6445 8.89453L30.7495 17.9995L21.6445 27.1045"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.25 18H30.495"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

enum SettingScreens {
  Home,
  Audio,
  Controls,
  Game,
}
const Screen: UIScreenComponent = () => {
  const [screen, setScreen] = useState(SettingScreens.Home);

  return (
    <div className="settings-screen">
      <div className="settings-title">
        {screen == SettingScreens.Home && <h1>Settings</h1>}
        {screen == SettingScreens.Controls && <h1>Keybind Settings</h1>}
        {screen == SettingScreens.Audio && <h1>Audio Settings</h1>}
        {screen == SettingScreens.Game && <h1>Game Settings</h1>}
        {screen != SettingScreens.Home && (
          <>
            <Button onClick={() => setScreen(SettingScreens.Home)}>
              Go Back
            </Button>
          </>
        )}
      </div>

      <div className="settings-items">
        {screen == SettingScreens.Home && (
          <>
            <SettingsItem

              title="Return To Game"
              action={() => {
                console.warn("return to game");
              }}
            />
            <SettingsItem

              title="Keybind Settings"
              action={() => {
                console.warn("keybind settings");
                setScreen(SettingScreens.Controls);
              }}
            />
            <SettingsItem

              title="Sound Settings"
              action={() => {
                console.warn("sound settings");
                setScreen(SettingScreens.Audio);
              }}
            />
            <SettingsItem
   
              title="Game Settings"
              action={() => {
                console.warn("game settings");
                setScreen(SettingScreens.Game);
              }}
            />
            <SettingsItem

              title="Leave Game"
              action={() => {
                console.warn("leave game");
              }}
            />
          </>
        )}
        {screen == SettingScreens.Audio && <AudioSettings />}
        {screen == SettingScreens.Controls && <KeybindSettings />}
        {screen == SettingScreens.Game && <GameSettings />}
      </div>
    </div>
  );
};

export default function () {
  return (
    <>
      <UIScreen id={UIScreensIds.Settings} screen={Screen} />
    </>
  );
}

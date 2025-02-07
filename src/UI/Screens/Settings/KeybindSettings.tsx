import { ControlAction, Controls } from "@amodx/controls";
import { Button } from "UI/Components/Button/Button";
import { ReactNode } from "react";

function ControlAction({ action }: { action: ControlAction }) {
  const mouse = action.input["mouse"]!;
  const keyboard = action.input["keyboard"]!;

  if (!mouse && !keyboard) return <></>;


  return (
    <div className="control-action">
      <div className="control-action-name">
        <p>{action.name}</p>
      </div>

      <div className="control-action-buttons">
        {mouse && (
          <div className="control-action-mouse control-action-button">
            <p>{mouse.button}</p>
          </div>
        )}
        {keyboard && (
          <div className="control-action-key control-action-button">
            <p>{keyboard.key}</p>
          </div>
        )}
        <div className="control-action-revert">
          <svg
            width="33"
            height="28"
            viewBox="0 0 33 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.6792 4.70883C10.7816 4.7903 10.8629 4.88708 10.9184 4.99363C10.9738 5.10018 11.0024 5.21441 11.0024 5.32977C11.0024 5.44513 10.9738 5.55935 10.9184 5.6659C10.8629 5.77245 10.7816 5.86923 10.6792 5.9507L8.1558 7.96085H19.8004C22.426 7.96085 24.9442 8.79245 26.8008 10.2727C28.6574 11.753 29.7004 13.7607 29.7004 15.8541C29.7004 17.9475 28.6574 19.9552 26.8008 21.4355C24.9442 22.9157 22.426 23.7473 19.8004 23.7473H11.0004C10.7087 23.7473 10.4289 23.6549 10.2226 23.4905C10.0163 23.326 9.9004 23.1029 9.9004 22.8703C9.9004 22.6377 10.0163 22.4146 10.2226 22.2502C10.4289 22.0857 10.7087 21.9933 11.0004 21.9933H19.8004C21.8426 21.9933 23.8011 21.3465 25.2451 20.1952C26.6892 19.0438 27.5004 17.4823 27.5004 15.8541C27.5004 14.2259 26.6892 12.6643 25.2451 11.513C23.8011 10.3617 21.8426 9.7149 19.8004 9.7149H8.1558L10.6792 11.725C10.7815 11.8066 10.8626 11.9034 10.918 12.0099C10.9733 12.1165 11.0018 12.2307 11.0018 12.346C11.0018 12.4613 10.9733 12.5755 10.918 12.682C10.8626 12.7886 10.7815 12.8854 10.6792 12.9669C10.5769 13.0485 10.4555 13.1131 10.3219 13.1573C10.1883 13.2014 10.045 13.2241 9.9004 13.2241C9.75577 13.2241 9.61255 13.2014 9.47892 13.1573C9.34529 13.1131 9.22388 13.0485 9.1216 12.9669L4.7216 9.45881C4.61916 9.37734 4.53789 9.28056 4.48244 9.17401C4.42698 9.06746 4.39844 8.95323 4.39844 8.83787C4.39844 8.72252 4.42698 8.60829 4.48244 8.50174C4.53789 8.39519 4.61916 8.29841 4.7216 8.21694L9.1216 4.70883C9.22378 4.62716 9.34517 4.56236 9.47881 4.51814C9.61245 4.47393 9.75572 4.45117 9.9004 4.45117C10.0451 4.45117 10.1884 4.47393 10.322 4.51814C10.4556 4.56236 10.577 4.62716 10.6792 4.70883Z"
              fill="black"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function () {
  const elms: ReactNode[] = [];
  let i = 0;
  for (const [key, group] of Controls.controls._controlGroups) {
    for (const control of group.controls) {
      elms.push(<ControlAction action={control} key={i} />);
      i++;
    }
  }

  return (
    <div className="keybind-settings">
      <div className="controls">{...elms}</div>
      <div className="keybind-buttons">
        <Button
          onClick={() => {
            console.warn("");
          }}
          mode="invert"
        >
          Reset Keys
        </Button>
        <Button
          onClick={() => {
            console.warn("");
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

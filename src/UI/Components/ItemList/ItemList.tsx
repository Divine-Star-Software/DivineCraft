import { useState } from "react";
import "./ItemList.css";
export function ItemList(props: {
  items: { text: string; actvie?: boolean; onClick: Function }[];
}) {
  const [active, setActive] = useState(props.items.find((_) => _.actvie)!.text);
  return (
    <div className="item-list">
      {props.items.map((_) => (
        <div
          key={_.text}
          onClick={() => {
            setActive(_.text);
            _.onClick();
          }}
          className={`item-list-item ${active == _.text ? "active" : ""}`}
        >
          <p>{_.text}</p>
          <div className={`item-list-check`}>
            <div className={`item-list-check-center`}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

import { UIScreen } from "../UIScreen";
import { UIScreensIds } from "../../ScreenIds";
import { usePlayer } from "UI/Hooks/usePlayer";
import { Inventory } from "../../Components/Inventory/Inventory";
import ItemSearch from "../../Components/ItemRegister/ItemSearch";
import { elm, frag, useRef } from "@amodx/elm";
import "./Building.css";

function OffHandInventory() {
  const {
    inventory: { data: inventory },
  } = usePlayer();
  return elm(
    "div",
    "off-hand",
    Inventory({ node: inventory.offHandInventoryNode }),
  );
}

function MainInventory() {
  const {
    inventory: { data: inventory },
  } = usePlayer();
  return elm("div", "main", Inventory({ node: inventory.inventoryNode }));
}

function PlayerItemLookUp() {
  const {
    controls: { data: controls },
  } = usePlayer();
  const ref = useRef<HTMLDivElement>(null);
  let active = false;

  controls.inventoryToggle.subscribe(PlayerItemLookUp, () => {
    active = !active;
    if (active) {
      if (!controls.menuOpen) {
        controls.pointerLockEnabled = false;
        controls.menuOpen = true;
        controls.exitLock();
      }
    } else {
      controls.pointerLockEnabled = true;
      controls.menuOpen = false;
      controls.enterLock();
    }
    active
      ? ref.current!.classList.add("active")
      : ref.current!.classList.remove("active");
  });

  return elm(
    "div",
    ".item-lookup-conatiner",
    elm(
      "div",
      {
        className: "item-lookup",
        ref,
      },
      ItemSearch(),
    ),
  );
}
export default function () {
  return UIScreen({
    id: UIScreensIds.Building,
    screen() {
      return frag(
        PlayerItemLookUp(),
        elm("div", "player-inventory", OffHandInventory(), MainInventory()),
      );
    },
  });
}

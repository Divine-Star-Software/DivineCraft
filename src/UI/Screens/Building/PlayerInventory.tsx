import { usePlayer } from "UI/Hooks";
import { Inventory } from "UI/Components/Inventory/Inventory";
import "./Building.css";
import { useEffect, useRef, useState } from "react";
import ItemSearch from "../../Components/ItemRegister/ItemSearch";
import { ItemComponent } from "Items/Components";

function OffHandInventory() {
  const {
    inventory: { data: inventory },
  } = usePlayer();

  return (
    <div className="off-hand">
      <Inventory node={inventory.offHandInventoryNode} />
    </div>
  );
}

function MainInventory() {
  const {
    inventory: { data: inventory },
    controls: { data: controls },
  } = usePlayer();

  useEffect(() => {
    controls.wheelDown.subscribe(MainInventory, () => {
      const index = inventory.inventory.schema.activeIndex;
      if (index - 1 < 0) {
        inventory.inventory.schema.activeIndex =
          inventory.inventory.data.index.size - 1;
      } else {
        inventory.inventory.schema.activeIndex = index - 1;
      }
    });

    controls.wheelUp.subscribe(MainInventory, () => {
      const index = inventory.inventory.schema.activeIndex;
      if (index + 1 >= inventory.inventory.data.index.size) {
        inventory.inventory.schema.activeIndex = 0;
      } else {
        inventory.inventory.schema.activeIndex = index + 1;
      }
    });

    return () => {
      controls.wheelDown.unsubscribe(MainInventory);
      controls.wheelUp.unsubscribe(MainInventory);
    };
  }, []);

  return (
    <div className="main">
      <Inventory node={inventory.inventoryNode} />
    </div>
  );
}



function PlayerItemLookUp() {
  const [active, setActive] = useState(false);
  const {
    controls: { data: controls },
  } = usePlayer();

  useEffect(() => {
    controls.inventoryToggle.subscribe(PlayerItemLookUp, () => {
      setActive((active) => {
        const newActive = !active;
        if (newActive) {
          if (controls.menuOpen) return active;
          controls.pointerLockEnabled = false;
          controls.menuOpen = true;
          controls.exitLock();
        } else {
          controls.pointerLockEnabled = true;
          controls.menuOpen = false;
          controls.enterLock();
        }

        return newActive;
      });
    });
    return () => {
      controls.inventoryToggle.unsubscribe(PlayerItemLookUp);
    };
  }, []);
  return (
    <div className={`item-lookup ${active ? "active" : "hidden"}`}>
      <ItemSearch />
    </div>
  );
}

export function PlayerInventory() {
  return (
    <>
      <PlayerItemLookUp />
      <div className="player-inventory">
       
        <MainInventory />
      
      </div>
    </>
  );
}

import { NCS, Node, NodeCursor } from "@amodx/ncs/";
import { Tools } from "@babylonjs/core";
import { FirstPersonCameraComponent } from "@dvegames/vlox/Babylon/Cameras/FirstPersonCamera.component";
import { NodeRefernceComponent } from "@dvegames/vlox/NodeRefernce.component";
import { PlayerInventoryComponent } from "./PlayerInventory.component";
import { EquipItemEvent } from "Items/Components";
import { InventoryEvents } from "Items/Components/Inventory/InventoryEvents";
import { TransformComponent } from "@dvegames/vlox/Transform.component";
import { TransformNodeComponent } from "@dvegames/vlox/Babylon/TransformNode.component";

export const PlayerHandsComponent = NCS.registerComponent({
  type: "player-hands",
  init(component) {
    const graph = component.node.graph;
    const cameraComponent = FirstPersonCameraComponent.getChild(
      component.node
    )!;

    const leftHandNode = graph
      .addNode(
        Node("Left Hands", [
          TransformComponent({
            position: { x: -1, y: -0.5, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          }),
          TransformNodeComponent({ mode: "none" }),
          NodeRefernceComponent(),
        ]),
        cameraComponent.node.index
      )
      .cloneCursor();

    const rightHandNode = graph
      .addNode(
        Node("Right Hands", [
          TransformComponent({
            position: { x: 1, y: -0.5, z: 0 },
            rotation: { x: 0, y: -Tools.ToRadians(45), z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          }),
          TransformNodeComponent({ mode: "none" }),
          NodeRefernceComponent(),
        ]),
        cameraComponent.node.index
      )
      .cloneCursor();

    const playerInventory = PlayerInventoryComponent.getRequired(
      component.node
    );

    const inventory = playerInventory.data.inventory;
    const offHandInventory = playerInventory.data.offHandInventory;

    const inventoryCursor = inventory.schema.getCursor();
    const inventoryIndex = inventory.schema.getSchemaIndex();
    inventoryCursor
      .getOrCreateObserver(inventoryIndex.activeIndex)
      .subscribe(() => {
        const item = playerInventory.data.getItem();
        leftHandNode.getChild(0)?.dispose();
        if (item) {
          const equipItemEvent = new EquipItemEvent(leftHandNode, item);
          equipItemEvent.item = item;
          equipItemEvent.origin = leftHandNode;
          item.events.dispatch(EquipItemEvent.Event, equipItemEvent);
        }
      });

    offHandInventory.node.events.addListener(
      InventoryEvents.ItemsUpdated,
      () => {
        const item = playerInventory.data.getOffHandItem();
        rightHandNode.getChild(0)?.dispose();
        if (item) {
          const equipItemEvent = new EquipItemEvent(rightHandNode, item);
          equipItemEvent.item = item;
          equipItemEvent.origin = rightHandNode;
          item.events.dispatch(EquipItemEvent.Event, equipItemEvent);
        }
      }
    );
  },
});

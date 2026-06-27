import { NCS, Node, NodeCursor } from "@amodx/ncs/";
import { FirstPersonCameraComponent } from "../Babylon";
import { NodeRefernceComponent } from "@dvegames/vlox/NodeRefernce.component";
import { PlayerInventoryComponent } from "./PlayerInventory.component";
import { EquipItemEvent ,ItemsUpdatedEvent} from "../Inventory";
import { TransformComponent } from "@dvegames/vlox/Transform.component";
import { TransformNodeComponent } from "@dvegames/vlox/Babylon/TransformNode.component";
class Data {
  constructor(
    public leftHand: NodeCursor,
    public rightHand: NodeCursor,
  ) {}
  clearHands() {
    const leftChild = this.leftHand.getChild(0);
    if (leftChild) {
      leftChild.dispose();
    }
    const rightChild = this.rightHand.getChild(0);
    if (rightChild) {
      rightChild.dispose();
    }
  }
}
export const PlayerHandsComponent = NCS.registerComponent({
  type: "player-hands",
  data: NCS.data<Data>(),
  init(component) {
    const graph = component.node.graph;
    const cameraComponent = FirstPersonCameraComponent.getChild(
      component.node,
    )!;

    const playerHeight = 1.7;
    const handYDistance = -playerHeight / 2;
    const handXDistance = 0.4;

    const leftHandNode = graph
      .addNode(
        Node("Left Hand", [
          TransformComponent({
            position: { x: -handXDistance, y: handYDistance, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          }),
          TransformNodeComponent({ mode: "none" }),
          NodeRefernceComponent(),
        ]),
        cameraComponent.node.index,
      )
      .cloneCursor();

    const rightHandNode = graph
      .addNode(
        Node("Right Hand", [
          TransformComponent({
            position: { x: handXDistance, y: handYDistance, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          }),
          TransformNodeComponent({ mode: "none" }),
          NodeRefernceComponent(),
        ]),
        cameraComponent.node.index,
      )
      .cloneCursor();

    const playerInventory = PlayerInventoryComponent.getRequired(
      component.node,
    );

    const inventory = playerInventory.data.inventory;
    const offHandInventory = playerInventory.data.offHandInventory;

    const inventoryCursor = inventory.schema.getCursor();
    const inventoryIndex = inventory.schema.getSchemaIndex();

    const updateMainHand = () => {
      const item = playerInventory.data.getItem();
      if (item) {
        leftHandNode.getChild(0)?.dispose();
        const equipItemEvent = new EquipItemEvent(
          leftHandNode,
          item,
          "primary",
        );
        equipItemEvent.item = item;
        equipItemEvent.origin = leftHandNode;
        item.events.dispatch(EquipItemEvent.Event, equipItemEvent);
      } else {
        const child = leftHandNode.getChild(0);
        if (child) child.dispose();
      }
    };
    const updateOffHand = () => {
      const item = playerInventory.data.getOffHandItem();
      if (item) {
        rightHandNode.getChild(0)?.dispose();

        const equipItemEvent = new EquipItemEvent(
          rightHandNode,
          item,
          "secondary",
        );
        equipItemEvent.item = item;
        equipItemEvent.origin = rightHandNode;
        item.events.dispatch(EquipItemEvent.Event, equipItemEvent);
      } else {
        const child = rightHandNode.getChild(0);
        if (child) child.dispose();
      }
    };
    inventoryCursor
      .getOrCreateObserver(inventoryIndex.activeIndex)
      .subscribe(() => {
        updateMainHand();
      });
    inventory.node.events.addListener(ItemsUpdatedEvent.Event, () => {
      updateMainHand();
    });
    offHandInventory.node.events.addListener(ItemsUpdatedEvent.Event, () => {
      updateOffHand();
    });

    component.data = new Data(leftHandNode, rightHandNode);
  },
});

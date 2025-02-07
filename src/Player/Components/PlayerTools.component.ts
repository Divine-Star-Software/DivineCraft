import { Observable } from "@amodx/core/Observers";
import { ComponentCursor, NCS, Node, NodeCursor } from "@amodx/ncs/";
import { ToolIds } from "Items";
import { HammerToolComponent } from "Items/Tools/HammertTool.component";
import { HandToolComponent } from "Items/Tools/HandTool.component";
import { ItemComponent, UseItemEvent } from "Items/Components";

class Data {
  public activeToolId = ToolIds.Hands;
  get activeTool() {
    return this.toolNodes[this.activeToolId];
  }
  toolUpdated = new Observable<ToolIds>();
  constructor(
    public component: (typeof PlayerToolsComponent)["default"],

    public toolNodes: Record<ToolIds, NodeCursor>,
    public toolComponents: Record<ToolIds, ComponentCursor>
  ) {}

  setActiveTool(tool: ToolIds) {
    if (this.activeToolId == tool) return;
    this.activeToolId = tool;
    this.toolUpdated.notify(tool);
  }

  useActive(actionButton: "primary" | "secondary") {
    this.activeTool.events.dispatch(
      UseItemEvent.Event,
      new UseItemEvent(this.component.node, this.activeTool, actionButton)
    );
  }
}

export const PlayerToolsComponent = NCS.registerComponent<Data>({
  type: "player-tools",
  init(component) {

    const graph = component.node.graph;

    const toolParent = graph.addNode(
      Node("Player Tools"),
      component.node.index
    );

    const toolNodes: Record<ToolIds, NodeCursor> = {

      [ToolIds.Hammer]: graph
        .addNode(
          Node(ToolIds.Hammer, [
            ItemComponent({
              name: "Hammer",
              textureSrc: "assets/textures/items/pvg_hammer/default.png",
            }),
            HammerToolComponent(),
          ]),
          toolParent.index
        )
        .cloneCursor(),


      [ToolIds.Hands]: graph
        .addNode(
          Node(ToolIds.Hands, [
            ItemComponent({
              name: "Hand",
              textureSrc: "assets/textures/items/pvg_wand/default.png",
            }),
            HandToolComponent(),
          ]),
          toolParent.index
        )
        .cloneCursor(),
    };
    const toolComponents: Record<ToolIds, ComponentCursor<any, any, any>> = {
      [ToolIds.Hands]: HandToolComponent.get(toolNodes[ToolIds.Hands])!,

      [ToolIds.Hammer]: HammerToolComponent.get(toolNodes[ToolIds.Hammer])!,

    };

    component.data = new Data(
      component.cloneCursor(),
      toolNodes,
      toolComponents
    );
  },
  dispose(component) {
      component.data.component.returnCursor();
  },
});

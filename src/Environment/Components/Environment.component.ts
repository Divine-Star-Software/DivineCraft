import { NCS, NodeCursor } from "@amodx/ncs/";
import { CloudsComponent } from "./Clouds.component";
import { SunComponent } from "./Sun.component";
import { PositionDirectionProviderComponent } from "@dvegames/vlox/Providers/PositionDirectionProvider.component";

export const EnvironmentComponent = NCS.registerComponent({
  type: "environment",
  schema: NCS.schema({}),
  data: NCS.data<{
    node: NodeCursor;
    clouds: (typeof CloudsComponent)["default"];
    positionAndDirection: (typeof PositionDirectionProviderComponent)["default"];
    sun: (typeof SunComponent)["default"];
  }>(),
  init(component) {
    component.data = {
      node: component.node.cloneCursor(),
      positionAndDirection: PositionDirectionProviderComponent.getRequired(
        component.node
      ),
      clouds: CloudsComponent.getRequired(component.node),
      sun: SunComponent.getRequired(component.node),
    };
  },
});

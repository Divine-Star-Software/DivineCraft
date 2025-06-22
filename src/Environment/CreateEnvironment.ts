import { Graph, Node } from "@amodx/ncs";
import { EnvironmentComponent } from "./Components/Environment.component";
import { CloudsComponent } from "./Components/Clouds.component";
import { SunComponent } from "./Components/Sun.component";
import { PositionDirectionProviderComponent } from "@dvegames/vlox/Providers/PositionDirectionProvider.component";

export function CreateEnvironment(graph: Graph) {
  const environmentNode = graph
    .addNode(
      Node([
        PositionDirectionProviderComponent(),
        CloudsComponent(),
        SunComponent(),
        EnvironmentComponent(),
      ])
    )
    .cloneCursor();

  return EnvironmentComponent.getRequired(environmentNode);
}

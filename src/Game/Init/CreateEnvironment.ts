import { Graph, Node } from "@amodx/ncs";
import { EnvironmentComponent } from "../Components/Environment/Environment.component";
import { CloudsComponent } from "../Components/Environment/Clouds.component";
import { SunComponent } from "../Components/Environment/Sun.component";
import { PositionDirectionProviderComponent } from "@dvegames/vlox/Providers/PositionDirectionProvider.component";

export function CreateEnvironment(graph: Graph) {
  const environmentNode = graph
    .addNode(
      Node([
        PositionDirectionProviderComponent(),
        CloudsComponent(),
        SunComponent(),
        EnvironmentComponent(),
      ]),
    )
    .cloneCursor();

  return EnvironmentComponent.getRequired(environmentNode);
}

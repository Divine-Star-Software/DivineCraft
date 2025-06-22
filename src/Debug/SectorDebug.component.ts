import { NCS } from "@amodx/ncs";
import { Threads } from "@amodx/threads";
import { WorldRegister } from "@divinevoxel/vlox/World/WorldRegister";
import { WorldSpaces } from "@divinevoxel/vlox/World/WorldSpaces";
import { TransformComponent } from "@dvegames/vlox/Transform.component";

export const SectorDebugComponent = NCS.registerComponent({
  type: "sector-debug",
  init(component) {
    const transform = TransformComponent.getRequired(component.node);

    const listener = ({ key }: KeyboardEvent) => {
      if (key == "F2") {
        const sector = WorldRegister.sectors.get(
          0,
          ...WorldSpaces.sector.getPositionVec3Array(
            transform.schema.position.x,
            transform.schema.position.y,
            transform.schema.position.z
          )
        );
        if (!sector)
          return console.error("NO SECTOR AT", transform.schema.position);

        Threads.getThread("world")!.runTask("log-sector", [
          0,
          ...sector.position,
        ]);
        console.log(sector);

        for (let i = 0; i < sector.sections.length; i++) {
          console.log(
            sector.sections[i].position,
            sector.sections[i].isInProgress(),
            sector.sections[i].getTick(0)
          );
        }
      }
    };
    window.addEventListener("keydown", listener);
  },
});

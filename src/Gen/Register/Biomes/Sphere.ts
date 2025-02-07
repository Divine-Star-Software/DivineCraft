import { Distance3D } from "@amodx/math";
import { BrushTool } from "@divinevoxel/vlox/Tools/Brush/Brush";

export function GenerateSphere(
  brush: BrushTool,
  voxel: string,
  sx: number,
  sy: number,
  sz: number,
  radius: number,
  skipFactor = -1,
  noDestroy = true
) {
  let rx = Math.floor(sx - radius);
  let ry = Math.floor(sy - radius);
  let rz = Math.floor(sz - radius);

  brush.setName(voxel);

  const dataTool = brush.dataCursor;

  for (let ix = rx; ix <= sx + radius; ix++) {
    for (let iz = rz; iz <= sz + radius; iz++) {
      for (let iy = ry; iy <= sy + radius; iy++) {
        if (skipFactor > -1 && Math.random() < skipFactor) continue;

        const v = dataTool.getVoxel(ix, iy, iz);
        if (noDestroy && v) {
          if (v.isAir() && v.getLevelState() == 1) continue;
          if (v.isRenderable()) continue;
        }
        if (Distance3D(ix, iy, iz, sx, sy, sz) <= radius) {
          brush.setXYZ(ix, iy, iz).paint();
        }
      }
    }
  }
}

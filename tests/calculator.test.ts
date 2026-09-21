import {describe,it,expect} from "vitest";
import {calculateFit,compareOrientations,resolveBagDimensions,validateInput,PRESETS} from "../src/lib/calculator";

describe("Calculator",()=>{
  it("resolves presets",()=>{
    expect(resolveBagDimensions("kid",0,0).length).toBe(PRESETS.kid.length);
    expect(resolveBagDimensions("adult",0,0).width).toBe(PRESETS.adult.width);
    expect(resolveBagDimensions("custom",7,3.5)).toEqual({length:7,width:3.5});
  });

  it("calculates portrait and landscape fit",()=>{
    const port=calculateFit({width:12,length:15},PRESETS.kid,"portrait");
    expect(port.valid).toBe(true);
    expect(port.cols).toBe(4);
    expect(port.rows).toBe(2);
    expect(port.totalBags).toBe(8);
    expect(port.leftoverArea).toBe(70);

    const land=calculateFit({width:12,length:15},PRESETS.kid,"landscape");
    expect(land.cols).toBe(2);
    expect(land.rows).toBe(6);
    expect(land.totalBags).toBe(12);
    expect(land.leftoverArea).toBe(15);
  });

  it("compares orientations",()=>{
    const comp=compareOrientations({width:12,length:15},PRESETS.kid,"portrait");
    expect(comp.best).toBe("landscape");
    expect(comp.diff).toBe(4);
  });

  it("handles validation guards",()=>{
    const small=calculateFit({width:2,length:4},PRESETS.kid,"portrait");
    expect(small.totalBags).toBe(0);
    expect(validateInput({width:0,length:10},PRESETS.kid).valid).toBe(false);
  });

  it("verifies centered placement coordinates",()=>{
    const res=calculateFit({width:10,length:10},{width:4,length:4},"portrait");
    expect(res.placements[0].x).toBe(1);
    expect(res.placements[0].y).toBe(1);
  });
});

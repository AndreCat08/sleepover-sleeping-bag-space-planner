export type PresetId="kid"|"adult"|"custom";
export type Orientation="portrait"|"landscape";
export interface Dimensions{length:number;width:number;}
export interface PresetDef{id:PresetId;name:string;length:number;width:number;}
export interface BagPlacement{id:number;col:number;row:number;x:number;y:number;w:number;h:number;}
export interface FitResult{
  valid:boolean;error?:string;roomArea:number;
  cols:number;rows:number;totalBags:number;usedArea:number;leftoverArea:number;
  leftoverPct:number;placements:BagPlacement[];
}
export interface ComparisonResult{
  current:FitResult;portrait:FitResult;landscape:FitResult;
  best:Orientation|"equal";diff:number;
}
export interface AppState{
  roomLength:number;roomWidth:number;preset:PresetId;
  customLength:number;customWidth:number;orientation:Orientation;
}

import {Dimensions,FitResult,Orientation,PresetDef,PresetId,ComparisonResult,BagPlacement} from "./types";

export const PRESETS:Record<Exclude<PresetId,"custom">,PresetDef>={
  kid:{id:"kid",name:"Standard Kid",length:5.5,width:2.5},
  adult:{id:"adult",name:"Adult Preset",length:6.5,width:2.8}
};
export const DEFAULT_ROOM:Dimensions={length:15,width:12};
export const MAX_DIM=100;

export function resolveBagDimensions(p:PresetId,cL:number,cW:number):Dimensions{
  return p==="custom"?{length:cL,width:cW}:{length:PRESETS[p].length,width:PRESETS[p].width};
}

export function validateInput(r:Dimensions,b:Dimensions):{valid:boolean;message?:string}{
  if(![r.length,r.width,b.length,b.width].every(Number.isFinite))return{valid:false,message:"Must be valid numbers."};
  if(r.length<=0||r.width<=0||b.length<=0||b.width<=0)return{valid:false,message:"Must be greater than zero."};
  if([r.length,r.width,b.length,b.width].some(v=>v>MAX_DIM))return{valid:false,message:`Cannot exceed ${MAX_DIM} ft.`};
  return{valid:true};
}

export function calculateFit(r:Dimensions,b:Dimensions,ori:Orientation):FitResult{
  const chk=validateInput(r,b);
  const roomArea=Math.round(r.length*r.width*100)/100;
  if(!chk.valid){
    return{valid:false,error:chk.message,roomArea:Math.max(0,roomArea||0),cols:0,rows:0,totalBags:0,usedArea:0,leftoverArea:Math.max(0,roomArea||0),leftoverPct:100,placements:[]};
  }
  const effW=ori==="portrait"?b.width:b.length, effL=ori==="portrait"?b.length:b.width;
  const cols=Math.floor(r.width/effW), rows=Math.floor(r.length/effL), totalBags=cols*rows;
  const usedArea=Math.round(totalBags*b.width*b.length*100)/100;
  const leftoverArea=Math.max(0,Math.round((roomArea-usedArea)*100)/100);
  const leftoverPct=roomArea>0?Math.round((leftoverArea/roomArea)*1000)/10:0;
  const placements:BagPlacement[]=[];
  if(totalBags>0){
    const offX=(r.width-cols*effW)/2, offY=(r.length-rows*effL)/2;
    let id=0;
    for(let row=0;row<rows;row++){
      for(let col=0;col<cols;col++){
        placements.push({id:++id,col:col+1,row:row+1,x:Math.round((offX+col*effW)*100)/100,y:Math.round((offY+row*effL)*100)/100,w:effW,h:effL});
      }
    }
  }
  return{valid:true,roomArea,cols,rows,totalBags,usedArea,leftoverArea,leftoverPct,placements};
}

export function compareOrientations(r:Dimensions,b:Dimensions,curOri:Orientation):ComparisonResult{
  const p=calculateFit(r,b,"portrait"), l=calculateFit(r,b,"landscape"), cur=curOri==="portrait"?p:l;
  let best:Orientation|"equal"="equal", diff=0;
  if(p.totalBags>l.totalBags){best="portrait";diff=p.totalBags-l.totalBags;}
  else if(l.totalBags>p.totalBags){best="landscape";diff=l.totalBags-p.totalBags;}
  return{current:cur,portrait:p,landscape:l,best,diff};
}

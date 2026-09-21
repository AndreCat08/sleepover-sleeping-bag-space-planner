import {store} from "./state";
import {compareOrientations,resolveBagDimensions,DEFAULT_ROOM} from "./lib/calculator";
import {ElementsMap,renderApp} from "./render";
import {AppState,Orientation,PresetId} from "./lib/types";
let els:ElementsMap;
const q=<T extends HTMLElement>(id:string)=>document.getElementById(id) as T;
const busy=()=>{els.resultsSection.setAttribute("aria-busy","true");q("computingIndicator")?.classList.add("is-computing");setTimeout(()=>{els.resultsSection.removeAttribute("aria-busy");q("computingIndicator")?.classList.remove("is-computing")},35)};
const dimensions=()=>{busy();const l=parseFloat(els.inputRoomLength.value),w=parseFloat(els.inputRoomWidth.value);store.update({roomLength:Number.isFinite(l)?l:0,roomWidth:Number.isFinite(w)?w:0})};
const custom=()=>{busy();const l=parseFloat(els.inputCustomLength.value),w=parseFloat(els.inputCustomWidth.value);store.update({customLength:Number.isFinite(l)&&l>0?l:1,customWidth:Number.isFinite(w)&&w>0?w:1})};
function init(){
  els={inputRoomLength:q("roomLength"),inputRoomWidth:q("roomWidth"),customBagFields:q("customBagFields"),inputCustomLength:q("customLength"),inputCustomWidth:q("customWidth"),presetRadios:document.querySelectorAll('input[name="preset"]'),orientationRadios:document.querySelectorAll('input[name="orientation"]'),errorBanner:q("errorBanner"),errorText:q("errorText"),emptyState:q("emptyState"),resultsSection:q("resultsSection"),metricBags:q("metricBags"),metricGrid:q("metricGrid"),metricLeftover:q("metricLeftover"),metricArea:q("metricArea"),comparisonBadge:q("comparisonBadge"),svgContainer:q("svgContainer"),liveAnnouncer:q("liveAnnouncer")};
  els.inputRoomLength.addEventListener("input",dimensions);els.inputRoomWidth.addEventListener("input",dimensions);els.inputCustomLength.addEventListener("input",custom);els.inputCustomWidth.addEventListener("input",custom);
  const change=(kind:"preset"|"orientation")=>(e:Event)=>{busy();const t=e.target as HTMLInputElement;if(t.checked)store.update({[kind]:t.value} as Partial<AppState>)};
  els.presetRadios.forEach(r=>r.addEventListener("change",change("preset")));els.orientationRadios.forEach(r=>r.addEventListener("change",change("orientation")));
  const sample=()=>{busy();store.update({roomLength:DEFAULT_ROOM.length,roomWidth:DEFAULT_ROOM.width,preset:"kid",orientation:"landscape"})};
  q("loadSampleBtn").addEventListener("click",sample);q("emptyLoadSampleBtn").addEventListener("click",sample);q("resetBtn").addEventListener("click",()=>{busy();store.reset()});q("clearBtn").addEventListener("click",()=>{busy();store.clear()});
  els.comparisonBadge.addEventListener("click",e=>{const next=(e.target as HTMLElement).closest("[data-switch-orientation]")?.getAttribute("data-switch-orientation") as Orientation;if(next){busy();store.update({orientation:next})}});
  store.subscribe(s=>renderApp(s,compareOrientations({length:s.roomLength,width:s.roomWidth},resolveBagDimensions(s.preset,s.customLength,s.customWidth),s.orientation),els));
}
document.addEventListener("DOMContentLoaded",init);

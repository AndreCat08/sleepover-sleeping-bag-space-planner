import {AppState,ComparisonResult,FitResult} from "./lib/types";

export interface ElementsMap{
  inputRoomLength:HTMLInputElement;inputRoomWidth:HTMLInputElement;
  customBagFields:HTMLElement;inputCustomLength:HTMLInputElement;inputCustomWidth:HTMLInputElement;
  presetRadios:NodeListOf<HTMLInputElement>;orientationRadios:NodeListOf<HTMLInputElement>;
  errorBanner:HTMLElement;errorText:HTMLElement;
  emptyState:HTMLElement;resultsSection:HTMLElement;
  metricBags:HTMLElement;metricGrid:HTMLElement;metricLeftover:HTMLElement;metricArea:HTMLElement;
  comparisonBadge:HTMLElement;svgContainer:HTMLElement;liveAnnouncer:HTMLElement;
}

const COLORS=["#6366f1","#ec4899","#06b6d4","#f59e0b","#10b981","#8b5cf6"];

export function renderApp(state:AppState,calc:ComparisonResult,els:ElementsMap):void{
  const ae=document.activeElement;
  if(ae!==els.inputRoomLength)els.inputRoomLength.value=state.roomLength>0?`${state.roomLength}`:"";
  if(ae!==els.inputRoomWidth)els.inputRoomWidth.value=state.roomWidth>0?`${state.roomWidth}`:"";
  if(ae!==els.inputCustomLength)els.inputCustomLength.value=`${state.customLength}`;
  if(ae!==els.inputCustomWidth)els.inputCustomWidth.value=`${state.customWidth}`;

  els.customBagFields.hidden=state.preset!=="custom";
  els.presetRadios.forEach(r=>{r.checked=r.value===state.preset;});
  els.orientationRadios.forEach(r=>{r.checked=r.value===state.orientation;});

  if(state.roomLength<=0||state.roomWidth<=0){
    els.emptyState.hidden=false;els.resultsSection.hidden=true;els.errorBanner.hidden=true;
    els.svgContainer.innerHTML="";els.liveAnnouncer.textContent="Dimensions empty.";return;
  }
  els.emptyState.hidden=true;

  if(!calc.current.valid&&calc.current.error){
    els.errorText.textContent=calc.current.error;
    els.errorBanner.hidden=false;els.resultsSection.hidden=true;
    els.svgContainer.innerHTML="";els.liveAnnouncer.textContent=`Error: ${calc.current.error}`;return;
  }
  els.errorBanner.hidden=true;

  const c=calc.current;
  els.metricBags.textContent=`${c.totalBags}`;
  els.metricGrid.textContent=c.totalBags>0?`${c.cols} cols × ${c.rows} rows`:"0 × 0";
  els.metricLeftover.textContent=`${c.leftoverArea} sq ft (${c.leftoverPct}%)`;
  els.metricArea.textContent=`Used ${c.usedArea} of ${c.roomArea} sq ft`;

  if(calc.best==="equal"){
    els.comparisonBadge.innerHTML=`<span class="pill pill-neutral">Landscape &amp; Portrait fit same count.</span>`;
  }else if(calc.best===state.orientation){
    els.comparisonBadge.innerHTML=`<span class="pill pill-success">Optimal! Fits +${calc.diff} more than ${state.orientation==="portrait"?"landscape":"portrait"}.</span>`;
  }else{
    els.comparisonBadge.innerHTML=`<button type="button" class="pill pill-recommendation" data-switch-orientation="${calc.best}">Tip: Switch to ${calc.best} (+${calc.diff} more)!</button>`;
  }

  renderSvg(state,c,els.svgContainer);
  els.liveAnnouncer.textContent=`Fit ${c.totalBags} bags. Leftover: ${c.leftoverArea} sq ft.`;
}

function renderSvg(state:AppState,fit:FitResult,container:HTMLElement):void{
  const rw=state.roomWidth, rl=state.roomLength;
  if(rw<=0||rl<=0){container.innerHTML="";return;}
  const isPort=state.orientation==="portrait";
  const bags=fit.placements.map((p,i)=>{
    const pw=isPort?p.w*0.7:p.w*0.22, ph=isPort?p.h*0.22:p.h*0.7;
    const px=isPort?p.x+(p.w-pw)/2:p.x+p.w*0.06, py=isPort?p.y+p.h*0.06:p.y+(p.h-ph)/2;
    return `<g class="svg-bag-group" tabindex="0" role="graphics-symbol" aria-label="Bag #${p.id}: Col ${p.col}, Row ${p.row}">
      <rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="0.25" fill="${COLORS[i%COLORS.length]}"/>
      <rect x="${px.toFixed(2)}" y="${py.toFixed(2)}" width="${pw.toFixed(2)}" height="${ph.toFixed(2)}" rx="0.15" fill="#fff" opacity="0.85"/>
      <text x="${(p.x+p.w/2).toFixed(2)}" y="${(p.y+p.h/2+0.12).toFixed(2)}" class="svg-bag-text" font-size="${(Math.min(p.w,p.h)*0.35).toFixed(2)}">#${p.id}</text>
    </g>`;
  }).join("");
  const fs=(Math.min(rw,rl)*0.04+0.28).toFixed(2);
  container.innerHTML=`<svg viewBox="0 0 ${rw} ${rl}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Floor plan: ${fit.totalBags} bags in ${rw}x${rl} room">
    <defs><pattern id="gp" width="1" height="1" patternUnits="userSpaceOnUse"><path d="M 1 0 L 0 0 0 1" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="0.03"/></pattern></defs>
    <rect x="0" y="0" width="${rw}" height="${rl}" rx="0.2" class="svg-floor"/><rect x="0" y="0" width="${rw}" height="${rl}" fill="url(#gp)"/>${bags}
    <text x="${(rw/2).toFixed(2)}" y="0.4" class="svg-dim-label" font-size="${fs}">${rw} ft Width</text>
    <text x="0.4" y="${(rl/2).toFixed(2)}" class="svg-dim-label" font-size="${fs}" transform="rotate(-90 0.4 ${(rl/2).toFixed(2)})">${rl} ft Length</text>
  </svg>`;
}

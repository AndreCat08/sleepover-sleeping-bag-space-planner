import {AppState} from "./lib/types";
import {DEFAULT_ROOM} from "./lib/calculator";
const initial:AppState={roomLength:DEFAULT_ROOM.length,roomWidth:DEFAULT_ROOM.width,preset:"kid",customLength:6,customWidth:3,orientation:"landscape"};
type Listener=(state:AppState)=>void;
let state=initial;
const listeners=new Set<Listener>();
export const store={
  getState:()=>state,
  subscribe:(listener:Listener)=>{listeners.add(listener);listener(state);return()=>listeners.delete(listener);},
  update:(patch:Partial<AppState>)=>{state={...state,...patch};listeners.forEach(listener=>listener(state));},
  reset:()=>store.update(initial),
  clear:()=>store.update({roomLength:0,roomWidth:0})
};

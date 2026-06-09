"use client";
import { useState, useEffect, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from "recharts";

const safeGet=k=>{try{return window.localStorage.getItem(k)}catch(e){return null}};
const safeSet=(k,v)=>{try{window.localStorage.setItem(k,v)}catch(e){}};
const safeSGet=k=>{try{return window.sessionStorage.getItem(k)}catch(e){return null}};
const safeSSet=(k,v)=>{try{window.sessionStorage.setItem(k,v)}catch(e){}};
const safeSRem=k=>{try{window.sessionStorage.removeItem(k)}catch(e){}};

const C={bg:"#f2f2f7",card:"#ffffff",border:"rgba(0,0,0,0.06)",text:"#1d1d1f",ts:"#6e6e73",tt:"#aeaeb2",red:"#e3000b",blk:"#1d1d1f",g:"#4285f4",m:"#0668E1",ml:"#5B8DEF",mc:"#0747A6",pos:"#34c759",neg:"#ff3b30",warn:"#ff9500",sh:"0 1px 3px rgba(0,0,0,0.04),0 1px 2px rgba(0,0,0,0.06)",shm:"0 4px 12px rgba(0,0,0,0.05),0 1px 3px rgba(0,0,0,0.06)"};
const F="-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',Arial,sans-serif";
const FM="-apple-system,BlinkMacSystemFont,'SF Mono',Menlo,monospace";
const SID="1HEykheeAndB-RXqKy4wehTzrZNZvuQxpv3WuUwSsUuM";
const SHEET_URL=`https://docs.google.com/spreadsheets/d/${SID}/edit`;
const SHEET_API_URL="https://script.google.com/macros/s/AKfycbyEv9HdrEudmj_U-0GmRaizgFNBOyqvJt_opjGBovnAqqeDz5zFbqE3cHyB0KVt_FI4/exec";
const MO=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const QL=["Trimestre 1","Trimestre 2","Trimestre 3","Trimestre 4"];
const SEGMENTS=[{id:"all",label:"Todas"},{id:"VN",label:"VN"},{id:"VO",label:"VO"},{id:"PV",label:"PV"}];
const SEGS=["vn","vo","pv"];
const PART_KEYS=["meta_leads","meta_conv","google"];
const BUDGET_KEYS=[];PART_KEYS.forEach(p=>SEGS.forEach(s=>BUDGET_KEYS.push(`${p}_${s}`)));
const PART_META={meta_leads:{label:"Meta Leads",color:C.ml},meta_conv:{label:"Meta Conversiones",color:C.mc},google:{label:"Google Ads",color:C.g}};
const emptyBudget=()=>{const o={};BUDGET_KEYS.forEach(k=>o[k]=Array(12).fill(0));return o};
const partidaOf=d=>d.plataforma==="Google Ads"?"google":(/LEAD/i.test(String(d.objetivo||""))?"meta_leads":"meta_conv");

const fmt=v=>{v=parseFloat(v||0);return v>=1e6?`${(v/1e6).toFixed(1)}M €`:v>=1000?`${(v/1000).toFixed(1)}K €`:`${v.toFixed(2)} €`};
const fN=v=>{v=parseInt(v||0);return v>=1e6?`${(v/1e6).toFixed(1)}M`:v>=1000?`${(v/1000).toFixed(1)}K`:String(v)};
const pCSV=t=>{const l=t.trim().split("\n");if(l.length<2)return[];const h=l[0].split(",").map(x=>x.trim().replace(/^"|"$/g,""));return l.slice(1).map(r=>{const v=[];let c="",q=false;for(let i=0;i<r.length;i++){if(r[i]==='"')q=!q;else if(r[i]===','&&!q){v.push(c.trim());c="";}else c+=r[i]}v.push(c.trim());const o={};h.forEach((x,i)=>{const s=(v[i]||"").replace(/^"|"$/g,"");o[x]=isNaN(s)||s===""?s:parseFloat(s)});return o})};
const matchSeg=(name,s)=>{const u=(name||"").toUpperCase();return u.includes("-"+s+"-")||u.includes("_"+s+"_")||u.includes("_"+s+"-")||u.includes("-"+s+"_")||u.includes(" "+s+" ")||u.includes("-"+s+" ")||u.includes(" "+s+"-")||u.startsWith(s+"-")||u.startsWith(s+"_")||u.startsWith(s+" ")};

function Login({onLogin}){const[e,sE]=useState("");const[p,sP]=useState("");const[err,sErr]=useState("");const[ld,sLd]=useState(false);const go=ev=>{ev.preventDefault();sLd(true);sErr("");setTimeout(()=>{if(e==="marketing@safamotor.com"&&p==="Marketing_26")onLogin();else{sErr("Credenciales incorrectas");sLd(false)}},500)};const is={width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,color:"#fff",fontFamily:F,fontSize:15,padding:"13px 16px",outline:"none",boxSizing:"border-box"};return(<div style={{minHeight:"100vh",background:"linear-gradient(180deg,#000,#1a1a1a)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F}}><div style={{width:"100%",maxWidth:380,padding:24}}><div style={{textAlign:"center",marginBottom:48}}><svg viewBox="0 0 200 45" style={{height:44,margin:"0 auto",display:"block"}} fill="none"><text x="22" y="33" style={{fontSize:36,fontFamily:F,fontWeight:800,letterSpacing:6,fill:"#fff"}}>SEAT</text><line x1="22" y1="41" x2="187" y2="41" stroke="#e3000b" strokeWidth="2.5"/></svg><div style={{color:"rgba(255,255,255,0.35)",fontSize:12,marginTop:16,letterSpacing:3,textTransform:"uppercase",fontWeight:500}}>Marketing Dashboard</div></div><div style={{background:"rgba(255,255,255,0.06)",backdropFilter:"blur(40px)",WebkitBackdropFilter:"blur(40px)",borderRadius:16,padding:32,border:"1px solid rgba(255,255,255,0.1)"}}><div style={{fontSize:20,fontWeight:600,color:"#fff",marginBottom:4}}>Iniciar sesión</div><div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:28}}>Accede con tus credenciales</div><form onSubmit={go}><div style={{marginBottom:14}}><input type="email" value={e} onChange={x=>sE(x.target.value)} placeholder="Email" style={is}/></div><div style={{marginBottom:24}}><input type="password" value={p} onChange={x=>sP(x.target.value)} placeholder="Contraseña" style={is}/></div>{err&&<div style={{background:"rgba(255,59,48,0.15)",borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:13,color:"#ff6961",fontWeight:500,textAlign:"center"}}>{err}</div>}<button type="submit" disabled={ld} style={{width:"100%",background:"#e3000b",border:"none",borderRadius:10,color:"#fff",fontFamily:F,fontSize:15,fontWeight:600,padding:14,cursor:ld?"wait":"pointer",opacity:ld?0.7:1}}>{ld?"Verificando...":"Acceder"}</button></form></div></div></div>)}

function DP({sd,ed,onChange}){const ps=[{l:"7d",d:7},{l:"15d",d:15},{l:"30d",d:30},{l:"90d",d:90},{l:"Año",d:365}];const ad=Math.round((new Date(ed)-new Date(sd))/864e5);return(<div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>{ps.map(p=>(<button key={p.d} onClick={()=>{const e2=new Date(),s2=new Date(e2);s2.setDate(s2.getDate()-p.d);onChange(s2.toISOString().split("T")[0],e2.toISOString().split("T")[0])}} style={{background:ad===p.d?C.blk:"#fff",color:ad===p.d?"#fff":C.ts,border:`1px solid ${ad===p.d?C.blk:"#d2d2d7"}`,borderRadius:20,fontFamily:F,fontSize:12,fontWeight:500,padding:"6px 14px",cursor:"pointer"}}>{p.l}</button>))}<div style={{display:"flex",alignItems:"center",gap:4,marginLeft:4}}><input type="date" value={sd} onChange={e=>onChange(e.target.value,ed)} style={{background:"#fff",border:"1px solid #d2d2d7",borderRadius:8,fontFamily:F,fontSize:12,color:C.text,padding:"6px 10px",outline:"none"}}/><span style={{color:C.tt,fontSize:12}}>→</span><input type="date" value={ed} onChange={e=>onChange(sd,e.target.value)} style={{background:"#fff",border:"1px solid #d2d2d7",borderRadius:8,fontFamily:F,fontSize:12,color:C.text,padding:"6px 10px",outline:"none"}}/></div></div>)}

function SegmentFilter({active,onChange}){return(<div style={{display:"flex",gap:4,background:"#e8e8ed",borderRadius:10,padding:3}}>{SEGMENTS.map(s=>(<button key={s.id} onClick={()=>onChange(s.id)} style={{background:active===s.id?"#fff":"transparent",color:active===s.id?C.text:C.ts,border:"none",borderRadius:8,fontFamily:F,fontSize:12,fontWeight:active===s.id?600:400,padding:"6px 16px",cursor:"pointer",boxShadow:active===s.id?"0 1px 3px rgba(0,0,0,0.08)":"none",transition:"all 0.2s"}}>{s.label}</button>))}</div>)}

function MC({label,total,google,meta}){return(<div style={{background:"#fff",borderRadius:14,padding:"18px 20px",boxShadow:C.sh,border:`1px solid ${C.border}`}}><div style={{fontSize:11,color:C.tt,letterSpacing:.5,textTransform:"uppercase",fontWeight:600,marginBottom:10}}>{label}</div><div style={{fontSize:28,fontWeight:700,color:C.text,letterSpacing:-.5,lineHeight:1}}>{total}</div><div style={{display:"flex",gap:12,marginTop:12,paddingTop:10,borderTop:`1px solid ${C.border}`}}><div style={{display:"flex",alignItems:"center",gap:5,flex:1}}><div style={{width:6,height:6,borderRadius:"50%",background:C.g}}/><span style={{fontSize:11,color:C.ts}}>Google</span><span style={{fontSize:12,fontWeight:600,color:C.text,marginLeft:"auto",fontFamily:FM}}>{google}</span></div><div style={{width:1,background:C.border}}/><div style={{display:"flex",alignItems:"center",gap:5,flex:1}}><div style={{width:6,height:6,borderRadius:"50%",background:C.m}}/><span style={{fontSize:11,color:C.ts}}>Meta</span><span style={{fontSize:12,fontWeight:600,color:C.text,marginLeft:"auto",fontFamily:FM}}>{meta}</span></div></div></div>)}

/* Stacked partida bar — 3 rows (Meta Leads / Meta Conv / Google) with budget vs spent */
function StackedPartidaBar({partidas,segLabel}){
  const totalBudget=partidas.reduce((s,p)=>s+p.budget,0);
  const totalSpent=partidas.reduce((s,p)=>s+p.spent,0);
  const totalPct=totalBudget>0?(totalSpent/totalBudget)*100:0;
  const tgc=totalPct>90?C.neg:totalPct>75?C.warn:C.pos;
  return(<div style={{background:"#fff",borderRadius:14,padding:"20px 24px",boxShadow:C.sh,border:`1px solid ${C.border}`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
      <span style={{fontSize:15,fontWeight:700,color:C.text}}>Inversión por partida{segLabel?` · ${segLabel}`:""}</span>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <span style={{fontSize:12,color:C.ts,fontFamily:FM}}>{fmt(totalSpent)} / {fmt(totalBudget)}</span>
        <span style={{fontSize:12,fontWeight:700,color:tgc,background:tgc+"14",padding:"3px 10px",borderRadius:20}}>{totalBudget>0?`${totalPct.toFixed(1)}%`:"—"}</span>
      </div>
    </div>
    {/* Stacked full bar showing each partida's slice of total budget, filled by spent */}
    <div style={{display:"flex",height:10,borderRadius:5,overflow:"hidden",background:"#f2f2f7",marginBottom:18}}>
      {partidas.map(p=>{const w=totalBudget>0?(p.budget/totalBudget)*100:0;const fillPct=p.budget>0?Math.min((p.spent/p.budget)*100,100):0;return(<div key={p.key} style={{width:`${w}%`,background:"#f2f2f7",position:"relative",borderRight:`2px solid #fff`}}><div style={{position:"absolute",left:0,top:0,height:"100%",width:`${fillPct}%`,background:p.color,transition:"width 0.8s"}}/></div>)})}
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {partidas.map(p=>{const pct=p.budget>0?(p.spent/p.budget)*100:0;const rem=p.budget-p.spent;const gc=pct>90?C.neg:pct>75?C.warn:p.color;return(<div key={p.key}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:p.color}}/>
            <span style={{fontSize:13,fontWeight:600,color:C.text}}>{p.label}</span>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:11,color:C.ts,fontFamily:FM}}>{fmt(p.spent)} / {fmt(p.budget)}</span>
            <span style={{fontSize:11,color:rem>=0?C.pos:C.neg,fontFamily:FM,fontWeight:600}}>{rem>=0?"+":""}{fmt(rem)}</span>
            <span style={{fontSize:11,fontWeight:700,color:gc,background:gc+"14",padding:"2px 10px",borderRadius:20,minWidth:48,textAlign:"center"}}>{p.budget>0?`${pct.toFixed(1)}%`:"—"}</span>
          </div>
        </div>
        <div style={{background:"#f2f2f7",borderRadius:4,height:6,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:gc,borderRadius:4,transition:"width 0.8s"}}/>
        </div>
      </div>)})}
    </div>
  </div>)
}

function BCT({monthlyBudgets,ms,cm,segLabel}){const tB=monthlyBudgets.reduce((s,v)=>s+v,0),tS=Object.values(ms).reduce((s,v)=>s+v,0);const rows=[{l:"Anual",b:tB,s:tS,isH:true}];for(let q=0;q<4;q++){let qB=0,qS=0;for(let i=q*3;i<q*3+3;i++){qB+=monthlyBudgets[i]||0;qS+=ms[i]||0}rows.push({l:QL[q],b:qB,s:qS,isQ:true})}MO.forEach((n,i)=>rows.push({l:n,b:monthlyBudgets[i]||0,s:ms[i]||0,cur:i===cm}));const cs={padding:"10px 14px",fontFamily:F,fontSize:13,borderBottom:`1px solid ${C.border}`};const ns={...cs,textAlign:"right",fontFamily:FM,fontSize:12};return(<div style={{background:"#fff",borderRadius:14,overflow:"hidden",boxShadow:C.sh,border:`1px solid ${C.border}`}}><div style={{padding:"16px 20px",background:C.blk,display:"flex",alignItems:"center",gap:8}}><div style={{width:3,height:16,background:C.red,borderRadius:2}}/><span style={{fontSize:13,color:"#fff",fontWeight:600}}>Control de presupuesto{segLabel?` · ${segLabel}`:""}</span></div><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:"#fafafa"}}>{["Periodo","Inv. disponible","Inv. consumida","Inv. restante","% disponible"].map(h=><th key={h} style={{...cs,textAlign:h==="Periodo"?"left":"right",fontWeight:600,color:C.tt,fontSize:10,letterSpacing:.5,textTransform:"uppercase"}}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=>{const rem=r.b-r.s,pct=r.b>0?((rem/r.b)*100):0;const bg=r.isH?C.red:r.isQ?"#f8f8fa":r.cur?"#fffef0":"#fff";const tc=r.isH?"#fff":C.text;const fw=r.isH||r.isQ?700:400;return(<tr key={i} style={{background:bg}}><td style={{...cs,fontWeight:fw,color:tc}}>{r.l}</td><td style={{...ns,fontWeight:fw,color:tc}}>{fmt(r.b)}</td><td style={{...ns,fontWeight:fw,color:tc}}>{fmt(r.s)}</td><td style={{...ns,fontWeight:700,color:rem>=0?(r.isH?"#fff":C.pos):C.neg}}>{fmt(rem)}</td><td style={{...ns}}><span style={{background:pct>=0?(r.isH?"rgba(255,255,255,0.2)":"#e5f9ed"):"#ffe5e7",color:pct>=0?(r.isH?"#fff":C.pos):C.neg,padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:600}}>{r.b>0?`${pct.toFixed(1)}%`:"—"}</span></td></tr>)})}</tbody></table></div></div>)}

/* Per-segment budget editor — 3 inputs per month (Meta Leads, Meta Conv, Google) */
function SegmentEditor({seg,segLabel,mb,onChange,onSave,saving,saveMsg}){
  const cs={padding:"8px 12px",fontFamily:F,fontSize:13,borderBottom:`1px solid ${C.border}`};
  const inputStyle={background:"#f8f8fa",border:"1px solid #e5e5ea",borderRadius:8,color:C.text,fontFamily:FM,fontSize:12,fontWeight:600,padding:"6px 10px",outline:"none",width:96,textAlign:"right",boxSizing:"border-box"};
  const setVal=(part,month,val)=>{const k=`${part}_${seg}`;const newArr=[...(mb[k]||Array(12).fill(0))];newArr[month]=parseFloat(val)||0;onChange({...mb,[k]:newArr})};
  return(<div style={{background:"#fff",borderRadius:14,overflow:"hidden",boxShadow:C.sh,border:`1px solid ${C.border}`}}>
    <div style={{padding:"14px 18px",background:C.blk,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:3,height:16,background:C.red,borderRadius:2}}/><span style={{fontSize:13,color:"#fff",fontWeight:600}}>Presupuesto · {segLabel}</span></div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {saveMsg&&<span style={{fontSize:11,color:saveMsg.ok?"#7CDB94":"#ff8a85"}}>{saveMsg.text}</span>}
        <button onClick={onSave} disabled={saving} style={{background:saving?"rgba(255,255,255,0.15)":C.red,color:"#fff",border:"none",borderRadius:8,fontFamily:F,fontSize:12,fontWeight:600,padding:"7px 16px",cursor:saving?"wait":"pointer",opacity:saving?0.7:1}}>{saving?"Guardando...":"Guardar"}</button>
      </div>
    </div>
    <div style={{overflowX:"auto"}}>
    <table style={{width:"100%",borderCollapse:"collapse"}}>
      <thead><tr style={{background:"#fafafa"}}>
        <th style={{...cs,textAlign:"left",fontWeight:600,color:C.tt,fontSize:10,letterSpacing:.5,textTransform:"uppercase"}}>Mes</th>
        {PART_KEYS.map(p=><th key={p} style={{...cs,textAlign:"right",fontWeight:600,color:PART_META[p].color,fontSize:10,letterSpacing:.5,textTransform:"uppercase"}}>{PART_META[p].label}</th>)}
        <th style={{...cs,textAlign:"right",fontWeight:600,color:C.tt,fontSize:10,letterSpacing:.5,textTransform:"uppercase"}}>Total</th>
      </tr></thead>
      <tbody>
        {MO.map((n,i)=>{const total=PART_KEYS.reduce((s,p)=>s+((mb[`${p}_${seg}`]||[])[i]||0),0);return(
          <tr key={i} style={{background:i===new Date().getMonth()?"#fffef0":"#fff"}}>
            <td style={{...cs,fontWeight:500}}>{n}</td>
            {PART_KEYS.map(p=>(<td key={p} style={{...cs,textAlign:"right"}}>
              <input type="number" step="100" value={(mb[`${p}_${seg}`]||[])[i]||0} onChange={e=>setVal(p,i,e.target.value)} style={inputStyle}/>
            </td>))}
            <td style={{...cs,textAlign:"right",fontWeight:700,fontFamily:FM,fontSize:12}}>{fmt(total)}</td>
          </tr>
        )})}
        <tr style={{background:C.red}}>
          <td style={{...cs,fontWeight:700,color:"#fff",borderBottom:"none"}}>Total anual</td>
          {PART_KEYS.map(p=>{const t=(mb[`${p}_${seg}`]||[]).reduce((s,v)=>s+v,0);return(<td key={p} style={{...cs,textAlign:"right",fontWeight:700,color:"#fff",borderBottom:"none",fontFamily:FM}}>{fmt(t)}</td>)})}
          <td style={{...cs,textAlign:"right",fontWeight:700,color:"#fff",borderBottom:"none",fontFamily:FM,fontSize:14}}>{fmt(PART_KEYS.reduce((s,p)=>s+(mb[`${p}_${seg}`]||[]).reduce((a,b)=>a+b,0),0))}</td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>);
}

export default function Page(){
  const[ok,setOk]=useState(false);
  const[ready,setReady]=useState(false);
  const[data,setData]=useState([]);
  const[mb,setMb]=useState(emptyBudget());
  const[vw,setVw]=useState("overview");
  const[ld,setLd]=useState(true);
  const[lu,setLu]=useState(null);
  const[st,setSt]=useState("loading");
  const[seg,setSeg]=useState("all");
  const[saving,setSaving]=useState(false);
  const[saveMsg,setSaveMsg]=useState(null);
  const now=new Date();
  const td=now.toISOString().split("T")[0];
  const d30=new Date(Date.now()-30*864e5).toISOString().split("T")[0];
  const[sd,setSd]=useState(d30);
  const[ed,setEd]=useState(td);

  useEffect(()=>{setReady(true);if(safeSGet("seat-auth")==="true")setOk(true)},[]);
  const login=()=>{setOk(true);safeSSet("seat-auth","true")};
  const logout=()=>{setOk(false);safeSRem("seat-auth")};

  const loadBudgets=useCallback(async()=>{
    try{
      const url=`https://docs.google.com/spreadsheets/d/${SID}/gviz/tq?tqx=out:csv&sheet=Presupuestos`;
      const r=await fetch(url);
      if(r.ok){
        const t=await r.text();
        const rows=pCSV(t);
        if(rows.length>=1){
          const b=emptyBudget();
          let hasAny=false;
          rows.slice(0,12).forEach((row,i)=>{
            BUDGET_KEYS.forEach(k=>{
              const raw=row[k]!==undefined?row[k]:row[k.toUpperCase()];
              const v=parseFloat(raw||0);
              if(!isNaN(v)){b[k][i]=v;if(v>0)hasAny=true}
            });
          });
          if(hasAny)setMb(b);
        }
      }
    }catch(e){}
  },[]);

  const updateMb=useCallback(nb=>{setMb(nb);safeSet("seat-budgets-v4",JSON.stringify(nb))},[]);

  const saveToSheet=useCallback(async(currentMb)=>{
    setSaving(true);setSaveMsg(null);
    try{
      const r=await fetch(SHEET_API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({budgets:currentMb})});
      const j=await r.json();
      if(j.ok){setSaveMsg({ok:true,text:"Guardado ✓"});setTimeout(()=>loadBudgets(),800)}
      else setSaveMsg({ok:false,text:"Error: "+(j.error||"desconocido")});
    }catch(e){setSaveMsg({ok:false,text:"Error de conexión"})}
    setSaving(false);
    setTimeout(()=>setSaveMsg(null),4000);
  },[loadBudgets]);

  const load=useCallback(async()=>{
    setLd(true);
    try{
      const u1=`https://docs.google.com/spreadsheets/d/${SID}/gviz/tq?tqx=out:csv&sheet=Meta%20Ads`;
      const u2=`https://docs.google.com/spreadsheets/d/${SID}/gviz/tq?tqx=out:csv&sheet=Google%20Ads`;
      const rs=await Promise.allSettled([fetch(u1).then(r=>r.ok?r.text():""),fetch(u2).then(r=>r.ok?r.text():"")]);
      let a=[];rs.forEach(r=>{if(r.status==="fulfilled"&&r.value)a.push(...pCSV(r.value))});
      if(a.length>0){setData(a);setSt("live");setLu(new Date())}else setSt("empty");
    }catch(e){setSt("error")}
    setLd(false);
  },[]);

  useEffect(()=>{if(ok&&ready){load();loadBudgets()}},[ok,ready,load,loadBudgets]);
  useEffect(()=>{if(!ok||!ready)return;const t=setInterval(()=>{load();loadBudgets()},3e5);return()=>clearInterval(t)},[ok,ready,load,loadBudgets]);

  if(!ready)return null;
  if(!ok)return <Login onLogin={login}/>;

  // Filter by date
  const dateFiltered=data.filter(d=>d.fecha&&d.fecha>=sd&&d.fecha<=ed);
  // Filter by segment
  const fd=seg==="all"?dateFiltered:dateFiltered.filter(d=>matchSeg(d.campaña||d.campaign_name||"",seg));

  const gD=fd.filter(d=>d.plataforma==="Google Ads"),mD=fd.filter(d=>d.plataforma==="Meta Ads");
  const ag=a=>({sp:a.reduce((s,d)=>s+parseFloat(d.coste||0),0),cl:a.reduce((s,d)=>s+parseInt(d.clics||0),0),im:a.reduce((s,d)=>s+parseInt(d.impresiones||0),0),cv:a.reduce((s,d)=>s+parseFloat(d.conversiones||0),0)});
  const gA=ag(gD),mA=ag(mD),tot={sp:gA.sp+mA.sp,cl:gA.cl+mA.cl,im:gA.im+mA.im,cv:gA.cv+mA.cv};

  // Partida-level spend
  const partSpent={meta_leads:0,meta_conv:0,google:0};
  fd.forEach(d=>{partSpent[partidaOf(d)]+=parseFloat(d.coste||0)});

  // Active segments for budget calc
  const activeSegs=seg==="all"?SEGS:[seg.toLowerCase()];
  const partBudget={};
  PART_KEYS.forEach(p=>{partBudget[p]=activeSegs.reduce((s,sg)=>s+(mb[`${p}_${sg}`]||Array(12).fill(0)).reduce((a,b)=>a+b,0),0)});
  const monthlyBudgets=Array(12).fill(0).map((_,i)=>{let t=0;PART_KEYS.forEach(p=>{activeSegs.forEach(sg=>{t+=(mb[`${p}_${sg}`]||[])[i]||0})});return t});
  const tB=monthlyBudgets.reduce((s,v)=>s+v,0);

  const tCPC=tot.cl>0?tot.sp/tot.cl:0,gCPC=gA.cl>0?gA.sp/gA.cl:0,mCPC=mA.cl>0?mA.sp/mA.cl:0;
  const tCostConv=tot.cv>0?tot.sp/tot.cv:0,gCostConv=gA.cv>0?gA.sp/gA.cv:0,mCostConv=mA.cv>0?mA.sp/mA.cv:0;

  // Monthly spend for BCT (all-time, but segment-filtered)
  const ms={};const msData=seg==="all"?data:data.filter(d=>matchSeg(d.campaña||d.campaign_name||"",seg));
  msData.forEach(d=>{if(!d.fecha)return;const m=parseInt(d.fecha.split("-")[1])-1;ms[m]=(ms[m]||0)+parseFloat(d.coste||0)});

  const dM={};fd.forEach(d=>{const f=d.fecha;if(!f)return;if(!dM[f])dM[f]={fecha:f,google:0,meta:0,clics:0,conv:0};dM[f].clics+=parseInt(d.clics||0);dM[f].conv+=parseFloat(d.conversiones||0);if(d.plataforma==="Google Ads")dM[f].google+=parseFloat(d.coste||0);else dM[f].meta+=parseFloat(d.coste||0)});
  const daily=Object.values(dM).sort((a,b)=>a.fecha.localeCompare(b.fecha));
  const cM={};fd.forEach(d=>{const k=`${d.plataforma}|${d.campaña}`;if(!cM[k])cM[k]={pl:d.plataforma,ca:d.campaña,es:d.estado,co:0,cl:0,im:0,cv:0,ob:d.objetivo||""};cM[k].co+=parseFloat(d.coste||0);cM[k].cl+=parseInt(d.clics||0);cM[k].im+=parseInt(d.impresiones||0);cM[k].cv+=parseFloat(d.conversiones||0)});
  const camps=Object.values(cM).sort((a,b)=>b.co-a.co);
  const piD=[{name:"Google Ads",value:gA.sp,color:C.g},{name:"Meta Ads",value:mA.sp,color:C.m}];
  const cm=now.getMonth();
  const segLabel=seg==="all"?"":(SEGMENTS.find(s=>s.id===seg)?.label||"");
  const partidaData=PART_KEYS.map(p=>({key:p,label:PART_META[p].label,color:PART_META[p].color,budget:partBudget[p],spent:partSpent[p]}));

  const nvb=(v,l)=><button key={v} onClick={()=>setVw(v)} style={{background:vw===v?C.blk:"transparent",color:vw===v?"#fff":C.ts,border:"none",borderRadius:8,fontFamily:F,fontSize:13,fontWeight:500,padding:"7px 16px",cursor:"pointer"}}>{l}</button>;

  return(<div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:F}}>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}input[type=number]::-webkit-inner-spin-button{opacity:1}`}</style>
    <div style={{background:C.blk,padding:"10px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
      <div style={{display:"flex",alignItems:"center",gap:16}}><svg viewBox="0 0 200 45" style={{height:28}} fill="none"><text x="0" y="33" style={{fontSize:36,fontFamily:F,fontWeight:800,letterSpacing:6,fill:"#fff"}}>SEAT</text><line x1="0" y1="41" x2="165" y2="41" stroke="#e3000b" strokeWidth="2.5"/></svg><div style={{width:1,height:20,background:"rgba(255,255,255,0.15)"}}/><div><div style={{fontSize:13,fontWeight:600,color:"#fff"}}>Marketing Dashboard</div><div style={{fontSize:10,color:"rgba(255,255,255,0.4)",display:"flex",alignItems:"center",gap:6,marginTop:1}}><div style={{width:5,height:5,borderRadius:"50%",background:st==="live"?C.pos:C.warn}}/>{st==="live"?"En vivo":"Cargando"}{lu&&` · ${lu.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})}`}</div></div></div>
      <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{background:"rgba(255,255,255,0.08)",borderRadius:10,padding:3,display:"flex",gap:2}}>{nvb("overview","Resumen")}{nvb("campaigns","Campañas")}{nvb("budget","Presupuestos")}</div><button onClick={()=>{load();loadBudgets()}} disabled={ld} style={{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:8,color:"#fff",fontFamily:F,fontSize:13,padding:"7px 12px",cursor:"pointer"}}>{ld?"···":"↻"}</button><button onClick={logout} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.35)",fontFamily:F,fontSize:11,padding:"7px 8px",cursor:"pointer"}}>Salir</button></div>
    </div>
    <div style={{height:2.5,background:C.red}}/>
    <div style={{padding:24,maxWidth:1440,margin:"0 auto"}}>
      {ld&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"100px 0",gap:16}}><div style={{width:36,height:36,border:"3px solid #e5e5ea",borderTop:"3px solid #e3000b",borderRadius:"50%",animation:"spin 1s linear infinite"}}/><div style={{fontSize:13,color:C.ts}}>Cargando datos...</div></div>}

      {!ld&&data.length>0&&vw==="overview"&&<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:20}}>
          <DP sd={sd} ed={ed} onChange={(s,e)=>{setSd(s);setEd(e)}}/>
          <SegmentFilter active={seg} onChange={setSeg}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14,marginBottom:20}}>
          <MC label="Inversión" total={fmt(tot.sp)} google={fmt(gA.sp)} meta={fmt(mA.sp)}/>
          <MC label="Impresiones" total={fN(tot.im)} google={fN(gA.im)} meta={fN(mA.im)}/>
          <MC label="Clics" total={fN(tot.cl)} google={fN(gA.cl)} meta={fN(mA.cl)}/>
          <MC label="CPC medio" total={fmt(tCPC)} google={fmt(gCPC)} meta={fmt(mCPC)}/>
          <MC label="Conversiones" total={fN(tot.cv)} google={fN(gA.cv)} meta={fN(mA.cv)}/>
          <MC label="Coste/Conversión" total={fmt(tCostConv)} google={fmt(gCostConv)} meta={fmt(mCostConv)}/>
        </div>

        <div style={{marginBottom:20}}><StackedPartidaBar partidas={partidaData} segLabel={segLabel}/></div>
        <div style={{marginBottom:20}}><BCT monthlyBudgets={monthlyBudgets} ms={ms} cm={cm} segLabel={segLabel}/></div>

        <div style={{display:"grid",gridTemplateColumns:"5fr 2fr",gap:14,marginBottom:20}}>
          <div style={{background:"#fff",borderRadius:14,padding:20,boxShadow:C.sh,border:`1px solid ${C.border}`}}><div style={{fontSize:11,color:C.tt,letterSpacing:.5,textTransform:"uppercase",fontWeight:600,marginBottom:16}}>Inversión diaria{seg!=="all"?` · ${seg}`:""}</div><ResponsiveContainer width="100%" height={220}><LineChart data={daily}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="fecha" tick={{fill:C.tt,fontSize:10}} tickFormatter={v=>v.slice(5)}/><YAxis tick={{fill:C.tt,fontSize:10,fontFamily:FM}} tickFormatter={v=>`${v}€`}/><Tooltip contentStyle={{background:"#fff",border:"1px solid #e5e5ea",borderRadius:10,fontFamily:F,fontSize:12,boxShadow:C.shm}} formatter={(v,n)=>[`${parseFloat(v).toFixed(2)} €`,n]}/><Line type="monotone" dataKey="google" stroke={C.g} strokeWidth={2} dot={false} name="Google Ads"/><Line type="monotone" dataKey="meta" stroke="#A855F7" strokeWidth={2} dot={false} name="Meta Ads"/></LineChart></ResponsiveContainer></div>
          <div style={{background:"#fff",borderRadius:14,padding:20,boxShadow:C.sh,border:`1px solid ${C.border}`,display:"flex",flexDirection:"column"}}><div style={{fontSize:11,color:C.tt,letterSpacing:.5,textTransform:"uppercase",fontWeight:600,marginBottom:16}}>Distribución</div><div style={{flex:1,display:"flex",alignItems:"center"}}><ResponsiveContainer width="100%" height={160}><PieChart><Pie data={piD} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" stroke="none" paddingAngle={2}>{piD.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip contentStyle={{background:"#fff",border:"1px solid #e5e5ea",borderRadius:10,fontFamily:F,fontSize:12}} formatter={v=>fmt(v)}/></PieChart></ResponsiveContainer></div><div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>{piD.map(p=>(<div key={p.name} style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:8,height:8,borderRadius:"50%",background:p.color}}/><span style={{fontSize:12,color:C.ts,flex:1}}>{p.name}</span><span style={{fontSize:13,fontWeight:600,fontFamily:FM}}>{tot.sp>0?((p.value/tot.sp)*100).toFixed(0):0}%</span></div>))}</div></div>
        </div>
        <div style={{background:"#fff",borderRadius:14,padding:20,boxShadow:C.sh,border:`1px solid ${C.border}`}}><div style={{fontSize:11,color:C.tt,letterSpacing:.5,textTransform:"uppercase",fontWeight:600,marginBottom:16}}>Clics y conversiones{seg!=="all"?` · ${seg}`:""}</div><ResponsiveContainer width="100%" height={180}><LineChart data={daily}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="fecha" tick={{fill:C.tt,fontSize:10}} tickFormatter={v=>v.slice(5)}/><YAxis yAxisId="l" tick={{fill:C.tt,fontSize:10,fontFamily:FM}}/><YAxis yAxisId="r" orientation="right" tick={{fill:C.tt,fontSize:10,fontFamily:FM}}/><Tooltip contentStyle={{background:"#fff",border:"1px solid #e5e5ea",borderRadius:10,fontFamily:F,fontSize:12}}/><Line yAxisId="l" type="monotone" dataKey="clics" stroke={C.red} strokeWidth={1.5} dot={false} name="Clics"/><Line yAxisId="r" type="monotone" dataKey="conv" stroke={C.pos} strokeWidth={1.5} dot={false} name="Conversiones"/></LineChart></ResponsiveContainer></div>
      </>}

      {!ld&&data.length>0&&vw==="campaigns"&&<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:20}}>
          <DP sd={sd} ed={ed} onChange={(s,e)=>{setSd(s);setEd(e)}}/>
          <SegmentFilter active={seg} onChange={setSeg}/>
        </div>
        <div style={{background:"#fff",borderRadius:14,overflow:"hidden",boxShadow:C.sh,border:`1px solid ${C.border}`}}>
          <div style={{padding:"16px 20px",background:C.blk,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:3,height:16,background:C.red,borderRadius:2}}/><span style={{fontSize:13,color:"#fff",fontWeight:600}}>Campañas{seg!=="all"?` · ${seg}`:""}</span></div><span style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>{camps.length} campañas</span></div>
          <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontFamily:F,fontSize:13}}><thead><tr style={{background:"#fafafa"}}>{["Plataforma","Campaña","Objetivo","Estado","Inversión","Clics","Impresiones","CPC","Conversiones","Coste/Conv."].map(h=>(<th key={h} style={{padding:"11px 14px",textAlign:h==="Plataforma"||h==="Campaña"||h==="Estado"||h==="Objetivo"?"left":"right",color:C.tt,fontWeight:600,fontSize:10,letterSpacing:.5,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>))}</tr></thead><tbody>{camps.map((c,i)=>{const cpc=c.cl>0?c.co/c.cl:0,costConv=c.cv>0?c.co/c.cv:0,pc=c.pl==="Google Ads"?C.g:C.m;return(<tr key={i} style={{borderBottom:`1px solid ${C.border}`}}><td style={{padding:"11px 14px"}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:7,height:7,borderRadius:"50%",background:pc}}/><span style={{color:pc,fontWeight:600,fontSize:12}}>{c.pl==="Google Ads"?"Google":"Meta"}</span></div></td><td style={{padding:"11px 14px",fontWeight:500,maxWidth:240,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.ca}</td><td style={{padding:"11px 14px",fontSize:11,color:C.ts}}>{c.ob||"—"}</td><td style={{padding:"11px 14px"}}><span style={{background:c.es==="ACTIVE"||c.es==="ENABLED"?"#e5f9ed":"#f0f0f0",color:c.es==="ACTIVE"||c.es==="ENABLED"?C.pos:C.tt,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600}}>{c.es==="ACTIVE"||c.es==="ENABLED"?"Activa":"Pausa"}</span></td><td style={{padding:"11px 14px",textAlign:"right",fontWeight:700,fontFamily:FM,fontSize:12}}>{fmt(c.co)}</td><td style={{padding:"11px 14px",textAlign:"right",fontFamily:FM,fontSize:12,color:C.ts}}>{fN(c.cl)}</td><td style={{padding:"11px 14px",textAlign:"right",fontFamily:FM,fontSize:12,color:C.ts}}>{fN(c.im)}</td><td style={{padding:"11px 14px",textAlign:"right",fontFamily:FM,fontSize:12,color:C.ts}}>{fmt(cpc)}</td><td style={{padding:"11px 14px",textAlign:"right",fontWeight:600,fontFamily:FM,fontSize:12,color:C.pos}}>{fN(c.cv)}</td><td style={{padding:"11px 14px",textAlign:"right",fontFamily:FM,fontSize:12,color:C.ts}}>{fmt(costConv)}</td></tr>)})}</tbody></table></div>
        </div>
      </>}

      {!ld&&vw==="budget"&&<>
        <div style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",marginBottom:8}}>
            <h2 style={{margin:0,fontSize:22,fontWeight:700,color:C.text,letterSpacing:-.3}}>Presupuestos por línea de negocio</h2>
            <a href={SHEET_URL} target="_blank" rel="noopener noreferrer" style={{background:C.blk,color:"#fff",textDecoration:"none",padding:"8px 14px",borderRadius:8,fontSize:12,fontWeight:600,display:"inline-flex",alignItems:"center",gap:6}}>Abrir Google Sheet <span style={{fontSize:14}}>↗</span></a>
          </div>
          <div style={{background:"#fff4e5",border:"1px solid #ffd699",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#8a6d3b"}}>
            Edita los presupuestos en el <a href={SHEET_URL} target="_blank" rel="noopener noreferrer" style={{color:C.red,fontWeight:600}}>Google Sheet → pestaña Presupuestos</a> para que se sincronicen con todo el equipo. Los inputs de abajo se guardan localmente en tu navegador.
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:18}}>
          {SEGS.map(s=>(<SegmentEditor key={s} seg={s} segLabel={s.toUpperCase()} mb={mb} onChange={updateMb} onSave={()=>saveToSheet(mb)} saving={saving} saveMsg={saveMsg}/>))}
        </div>
        <div style={{marginTop:20}}><BCT monthlyBudgets={monthlyBudgets} ms={ms} cm={cm} segLabel={segLabel}/></div>
      </>}

      {!ld&&data.length===0&&vw!=="budget"&&<div style={{textAlign:"center",padding:"100px 0"}}><div style={{fontSize:40,marginBottom:16}}>📊</div><div style={{fontSize:17,fontWeight:600,marginBottom:6}}>Sin datos todavía</div><div style={{fontSize:13,color:C.ts,maxWidth:360,margin:"0 auto"}}>Los datos llegarán automáticamente cuando se ejecuten los flujos.</div></div>}
    </div>
  </div>)
}

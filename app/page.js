"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart, BarChart, Bar } from "recharts";

/* ── Design Tokens (Apple + SEAT) ── */
const C = {
  bg: "#f2f2f7", card: "#ffffff", cardAlt: "#fbfbfd", border: "rgba(0,0,0,0.06)",
  text: "#1d1d1f", textSecondary: "#6e6e73", textTertiary: "#aeaeb2",
  seatRed: "#e3000b", seatBlack: "#1d1d1f", seatDark: "#000000",
  google: "#4285f4", googleBg: "#e8f0fe", meta: "#0668E1", metaBg: "#e7f0ff",
  positive: "#34c759", negativeBg: "#ffe5e7", positiveBg: "#e5f9ed",
  negative: "#ff3b30", warning: "#ff9500",
  shadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
  shadowMd: "0 4px 12px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.06)",
};
const F = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";
const FM = "-apple-system, BlinkMacSystemFont, 'SF Mono', 'Menlo', monospace";
const SID = "1HEykheeAndB-RXqKy4wehTzrZNZvuQxpv3WuUwSsUuM";
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const Q_LABELS = ["Trimestre 1","Trimestre 2","Trimestre 3","Trimestre 4"];
const VALID_USER = "marketing@safamotor.com";
const VALID_PASS = "Marketing_26";

const fmt = v => { v=parseFloat(v||0); return v>=1e6?`${(v/1e6).toFixed(1)}M €`:v>=1000?`${(v/1000).toFixed(1)}K €`:`${v.toFixed(2)} €`; };
const fN = v => { v=parseInt(v||0); return v>=1e6?`${(v/1e6).toFixed(1)}M`:v>=1000?`${(v/1000).toFixed(1)}K`:v.toString(); };
const fP = v => `${parseFloat(v||0).toFixed(2)}%`;

const parseCSV = text => {
  const lines=text.trim().split("\n");if(lines.length<2)return[];
  const headers=lines[0].split(",").map(h=>h.trim().replace(/^"|"$/g,""));
  return lines.slice(1).map(line=>{const vals=[];let cur="",inQ=false;for(let i=0;i<line.length;i++){if(line[i]==='"')inQ=!inQ;else if(line[i]===','&&!inQ){vals.push(cur.trim());cur="";}else cur+=line[i];}vals.push(cur.trim());const obj={};headers.forEach((h,i)=>{const v=(vals[i]||"").replace(/^"|"$/g,"");obj[h]=isNaN(v)||v===""?v:parseFloat(v);});return obj;});
};

/* ── SEAT Logo ── */
const SeatLogo = () => (
  <svg viewBox="0 0 200 45" style={{height:"28px"}} fill="none">
    <text x="0" y="33" style={{fontSize:"36px",fontFamily:F,fontWeight:800,letterSpacing:"6px",fill:"#fff"}}>SEAT</text>
    <line x1="0" y1="41" x2="165" y2="41" stroke={C.seatRed} strokeWidth="2.5"/>
  </svg>
);

/* ── Login ── */
const LoginScreen = ({onLogin}) => {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  const handleLogin = e => {e.preventDefault();setLoading(true);setError("");setTimeout(()=>{if(email===VALID_USER&&pass===VALID_PASS){onLogin(true);}else{setError("Credenciales incorrectas");setLoading(false);}},500);};
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg, #000 0%, #1a1a1a 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F}}>
      <div style={{width:"100%",maxWidth:"380px",padding:"24px"}}>
        <div style={{textAlign:"center",marginBottom:"48px"}}>
          <svg viewBox="0 0 200 45" style={{height:"44px",margin:"0 auto",display:"block"}} fill="none">
            <text x="22" y="33" style={{fontSize:"36px",fontFamily:F,fontWeight:800,letterSpacing:"6px",fill:"#fff"}}>SEAT</text>
            <line x1="22" y1="41" x2="187" y2="41" stroke={C.seatRed} strokeWidth="2.5"/>
          </svg>
          <div style={{color:"rgba(255,255,255,0.35)",fontSize:"12px",marginTop:"16px",letterSpacing:"3px",textTransform:"uppercase",fontWeight:500}}>Marketing Dashboard</div>
        </div>
        <div style={{background:"rgba(255,255,255,0.06)",backdropFilter:"blur(40px)",WebkitBackdropFilter:"blur(40px)",borderRadius:"16px",padding:"32px",border:"1px solid rgba(255,255,255,0.1)"}}>
          <div style={{fontSize:"20px",fontWeight:600,color:"#fff",marginBottom:"4px",letterSpacing:"-0.3px"}}>Iniciar sesión</div>
          <div style={{fontSize:"13px",color:"rgba(255,255,255,0.4)",marginBottom:"28px"}}>Accede con tus credenciales</div>
          <form onSubmit={handleLogin}>
            <div style={{marginBottom:"14px"}}>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"
                style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"10px",color:"#fff",fontFamily:F,fontSize:"15px",padding:"13px 16px",outline:"none",boxSizing:"border-box",transition:"border 0.2s"}}
                onFocus={e=>e.target.style.borderColor="rgba(227,0,11,0.6)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.12)"} />
            </div>
            <div style={{marginBottom:"24px"}}>
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Contraseña"
                style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"10px",color:"#fff",fontFamily:F,fontSize:"15px",padding:"13px 16px",outline:"none",boxSizing:"border-box",transition:"border 0.2s"}}
                onFocus={e=>e.target.style.borderColor="rgba(227,0,11,0.6)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.12)"} />
            </div>
            {error && <div style={{background:"rgba(255,59,48,0.15)",borderRadius:"10px",padding:"10px 14px",marginBottom:"16px",fontSize:"13px",color:"#ff6961",fontWeight:500,textAlign:"center"}}>{error}</div>}
            <button type="submit" disabled={loading} style={{width:"100%",background:C.seatRed,border:"none",borderRadius:"10px",color:"#fff",fontFamily:F,fontSize:"15px",fontWeight:600,padding:"14px",cursor:loading?"wait":"pointer",opacity:loading?0.7:1,transition:"all 0.2s"}}>
              {loading?"Verificando...":"Acceder"}
            </button>
          </form>
        </div>
        <div style={{textAlign:"center",marginTop:"24px",fontSize:"11px",color:"rgba(255,255,255,0.15)",letterSpacing:"0.5px"}}>Grupo Safamotor · Marketing Digital</div>
      </div>
    </div>
  );
};

/* ── Date Picker ── */
const DatePicker = ({startDate, endDate, onChange}) => {
  const presets = [
    {label:"7 días", days:7},{label:"15 días", days:15},{label:"30 días", days:30},{label:"90 días", days:90},
  ];
  const activeDays = Math.round((new Date(endDate)-new Date(startDate))/(86400000));
  return (
    <div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
      {presets.map(p=>(
        <button key={p.days} onClick={()=>{const e=new Date();const s=new Date(e);s.setDate(s.getDate()-p.days);onChange(s.toISOString().split("T")[0],e.toISOString().split("T")[0]);}}
          style={{background:activeDays===p.days?"#1d1d1f":"#fff",color:activeDays===p.days?"#fff":"#6e6e73",border:`1px solid ${activeDays===p.days?"#1d1d1f":"#d2d2d7"}`,borderRadius:"20px",fontFamily:F,fontSize:"12px",fontWeight:500,padding:"6px 14px",cursor:"pointer",transition:"all 0.2s"}}>
          {p.label}
        </button>
      ))}
      <div style={{display:"flex",alignItems:"center",gap:"4px",marginLeft:"4px"}}>
        <input type="date" value={startDate} onChange={e=>onChange(e.target.value,endDate)}
          style={{background:"#fff",border:"1px solid #d2d2d7",borderRadius:"8px",fontFamily:F,fontSize:"12px",color:C.text,padding:"6px 10px",outline:"none"}} />
        <span style={{color:C.textTertiary,fontSize:"12px"}}>→</span>
        <input type="date" value={endDate} onChange={e=>onChange(startDate,e.target.value)}
          style={{background:"#fff",border:"1px solid #d2d2d7",borderRadius:"8px",fontFamily:F,fontSize:"12px",color:C.text,padding:"6px 10px",outline:"none"}} />
      </div>
    </div>
  );
};

/* ── Metric Card (Apple style) ── */
const MetricCard = ({label,total,google,meta,color=C.seatBlack,prefix="",suffix=""}) => (
  <div style={{background:C.card,borderRadius:"14px",padding:"18px 20px",boxShadow:C.shadow,border:`1px solid ${C.border}`}}>
    <div style={{fontSize:"11px",color:C.textTertiary,letterSpacing:"0.5px",textTransform:"uppercase",fontWeight:600,marginBottom:"10px"}}>{label}</div>
    <div style={{fontSize:"28px",fontWeight:700,color:C.text,letterSpacing:"-0.5px",lineHeight:1}}>{prefix}{typeof total==="number"&&total>=1000?fN(total):total}{suffix}</div>
    <div style={{display:"flex",gap:"12px",marginTop:"12px",paddingTop:"10px",borderTop:`1px solid ${C.border}`}}>
      <div style={{display:"flex",alignItems:"center",gap:"5px",flex:1}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:C.google}} />
        <span style={{fontSize:"11px",color:C.textSecondary}}>Google</span>
        <span style={{fontSize:"12px",fontWeight:600,color:C.text,marginLeft:"auto",fontFamily:FM}}>{prefix}{typeof google==="number"&&google>=1000?fN(google):google}{suffix}</span>
      </div>
      <div style={{width:"1px",background:C.border}} />
      <div style={{display:"flex",alignItems:"center",gap:"5px",flex:1}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:C.meta}} />
        <span style={{fontSize:"11px",color:C.textSecondary}}>Meta</span>
        <span style={{fontSize:"12px",fontWeight:600,color:C.text,marginLeft:"auto",fontFamily:FM}}>{prefix}{typeof meta==="number"&&meta>=1000?fN(meta):meta}{suffix}</span>
      </div>
    </div>
  </div>
);

/* ── Budget Gauge ── */
const BudgetGauge = ({label,budget,spent,color}) => {
  const pct=budget>0?(spent/budget)*100:0,rem=budget-spent;
  const gc=pct>90?C.negative:pct>75?C.warning:C.positive;
  return (
    <div style={{background:C.card,borderRadius:"14px",padding:"18px 20px",boxShadow:C.shadow,border:`1px solid ${C.border}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}><div style={{width:8,height:8,borderRadius:"50%",background:color}}/><span style={{fontSize:"14px",fontWeight:600,color:C.text}}>{label}</span></div>
        <span style={{fontSize:"12px",fontWeight:600,color:gc,background:gc+"14",padding:"3px 10px",borderRadius:"20px"}}>{pct.toFixed(0)}%</span>
      </div>
      <div style={{background:"#f2f2f7",borderRadius:"4px",height:"5px",overflow:"hidden",marginBottom:"14px"}}>
        <div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:gc,borderRadius:"4px",transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)"}} />
      </div>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <div><div style={{fontSize:"10px",color:C.textTertiary,fontWeight:500,marginBottom:"2px"}}>Invertido</div><div style={{fontSize:"15px",fontWeight:700,color:C.text}}>{fmt(spent)}</div></div>
        <div style={{textAlign:"center"}}><div style={{fontSize:"10px",color:C.textTertiary,fontWeight:500,marginBottom:"2px"}}>Presupuesto</div><div style={{fontSize:"15px",fontWeight:700,color:C.textSecondary}}>{fmt(budget)}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:"10px",color:C.textTertiary,fontWeight:500,marginBottom:"2px"}}>Restante</div><div style={{fontSize:"15px",fontWeight:700,color:rem<0?C.negative:C.positive}}>{fmt(rem)}</div></div>
      </div>
    </div>
  );
};

/* ── Budget Control Table ── */
const BudgetControlTable = ({budgets,monthlySpend,currentMonth}) => {
  const totalB=budgets.reduce((s,v)=>s+v,0),totalS=Object.values(monthlySpend).reduce((s,v)=>s+v,0);
  const rows=[{label:"Anual",budget:totalB,spent:totalS,isHeader:true}];
  for(let q=0;q<4;q++){let qB=0,qS=0;for(let m=q*3;m<q*3+3;m++){qB+=budgets[m]||0;qS+=monthlySpend[m]||0;}rows.push({label:Q_LABELS[q],budget:qB,spent:qS,isQ:true});}
  MONTHS.forEach((n,i)=>rows.push({label:n,budget:budgets[i]||0,spent:monthlySpend[i]||0,cur:i===currentMonth}));
  const cs={padding:"10px 14px",fontFamily:F,fontSize:"13px",borderBottom:`1px solid ${C.border}`};
  const ns={...cs,textAlign:"right",fontFamily:FM,fontSize:"12px"};
  return (
    <div style={{background:C.card,borderRadius:"14px",overflow:"hidden",boxShadow:C.shadow,border:`1px solid ${C.border}`}}>
      <div style={{padding:"16px 20px",background:C.seatBlack,display:"flex",alignItems:"center",gap:"8px"}}>
        <div style={{width:3,height:16,background:C.seatRed,borderRadius:"2px"}} />
        <span style={{fontSize:"13px",color:"#fff",letterSpacing:"0.5px",fontWeight:600}}>Control de presupuesto</span>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#fafafa"}}>
            {["Periodo","Inv. disponible","Inv. consumida","Inv. restante","% disponible"].map(h=><th key={h} style={{...cs,textAlign:h==="Periodo"?"left":"right",fontWeight:600,color:C.textTertiary,fontSize:"10px",letterSpacing:"0.5px",textTransform:"uppercase"}}>{h}</th>)}
          </tr></thead>
          <tbody>{rows.map((r,i)=>{
            const rem=r.budget-r.spent,pct=r.budget>0?((rem/r.budget)*100):0;
            const bg=r.isHeader?C.seatRed:r.isQ?"#f8f8fa":r.cur?"#fffef0":"#fff";
            const tc=r.isHeader?"#fff":C.text;const fw=r.isHeader||r.isQ?700:400;
            return(<tr key={i} style={{background:bg}}>
              <td style={{...cs,fontWeight:fw,color:tc}}>{r.label}</td>
              <td style={{...ns,fontWeight:fw,color:tc}}>{fmt(r.budget)}</td>
              <td style={{...ns,fontWeight:fw,color:tc}}>{fmt(r.spent)}</td>
              <td style={{...ns,fontWeight:700,color:rem>=0?(r.isHeader?"#fff":C.positive):C.negative}}>{fmt(rem)}</td>
              <td style={{...ns}}><span style={{background:pct>=0?(r.isHeader?"rgba(255,255,255,0.2)":C.positiveBg):C.negativeBg,color:pct>=0?(r.isHeader?"#fff":C.positive):C.negative,padding:"2px 8px",borderRadius:"20px",fontSize:"11px",fontWeight:600}}>{r.budget>0?`${pct.toFixed(1)}%`:"—"}</span></td>
            </tr>);
          })}</tbody>
        </table>
      </div>
    </div>
  );
};

/* ── Budget Editor ── */
const BudgetEditor = ({budgets,onChange}) => {
  const cs={padding:"10px 14px",fontFamily:F,fontSize:"13px",borderBottom:`1px solid ${C.border}`};
  return (
    <div style={{background:C.card,borderRadius:"14px",overflow:"hidden",boxShadow:C.shadow,border:`1px solid ${C.border}`}}>
      <div style={{padding:"16px 20px",background:C.seatBlack,display:"flex",alignItems:"center",gap:"8px"}}>
        <div style={{width:3,height:16,background:C.seatRed,borderRadius:"2px"}} />
        <span style={{fontSize:"13px",color:"#fff",letterSpacing:"0.5px",fontWeight:600}}>Presupuesto mensual</span>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <tbody>
          {MONTHS.map((n,i)=>(
            <tr key={i} style={{background:i===new Date().getMonth()?"#fffef0":"#fff"}}>
              <td style={{...cs,fontWeight:500,color:C.text}}>{n}</td>
              <td style={{...cs,textAlign:"right"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:"4px"}}>
                  <input value={budgets[i]} onChange={e=>{const nb=[...budgets];nb[i]=parseFloat(e.target.value)||0;onChange(nb);}}
                    type="number" step="100" style={{background:"#f8f8fa",border:"1px solid #e5e5ea",borderRadius:"8px",color:C.text,fontFamily:FM,fontSize:"13px",fontWeight:600,padding:"8px 12px",outline:"none",width:"120px",textAlign:"right",boxSizing:"border-box"}} />
                  <span style={{fontSize:"12px",color:C.textTertiary}}>€</span>
                </div>
              </td>
            </tr>
          ))}
          {[0,1,2,3].map(q=>{const qt=budgets.slice(q*3,q*3+3).reduce((s,v)=>s+v,0);return(<tr key={`q${q}`} style={{background:"#f8f8fa"}}><td style={{...cs,fontWeight:700,color:C.seatBlack}}>{Q_LABELS[q]}</td><td style={{...cs,textAlign:"right",fontWeight:700,color:C.seatBlack,fontFamily:FM}}>{fmt(qt)}</td></tr>);})}
          <tr style={{background:C.seatRed}}><td style={{...cs,fontWeight:700,color:"#fff",borderBottom:"none"}}>Total anual</td><td style={{...cs,textAlign:"right",fontWeight:700,color:"#fff",fontSize:"16px",borderBottom:"none",fontFamily:FM}}>{fmt(budgets.reduce((s,v)=>s+v,0))}</td></tr>
        </tbody>
      </table>
    </div>
  );
};

/* ══════════════ MAIN ══════════════ */
export default function Dashboard() {
  const [auth,setAuth]=useState(false);
  const [data,setData]=useState([]);
  const [mb,setMb]=useState([2835,2835,2835,2835,2835,2835,2835,2835,2835,2835,2835,2835]);
  const [view,setView]=useState("overview");
  const [loading,setLoading]=useState(true);
  const [lastUp,setLastUp]=useState(null);
  const [status,setStatus]=useState("loading");

  // Date range
  const today=new Date().toISOString().split("T")[0];
  const d30=new Date(Date.now()-30*86400000).toISOString().split("T")[0];
  const [startDate,setStartDate]=useState(d30);
  const [endDate,setEndDate]=useState(today);
  const setDates=(s,e)=>{setStartDate(s);setEndDate(e);};

  useEffect(()=>{try{const s=sessionStorage.getItem("seat-auth");if(s==="true")setAuth(true);}catch(e){}},[]);
  const handleLogin=ok=>{setAuth(ok);try{sessionStorage.setItem("seat-auth","true");}catch(e){}};
  const handleLogout=()=>{setAuth(false);try{sessionStorage.removeItem("seat-auth");}catch(e){}};
  useEffect(()=>{try{const s=localStorage.getItem("seat-budgets-v2");if(s)setMb(JSON.parse(s));}catch(e){}},[]);
  const saveMb=nb=>{setMb(nb);try{localStorage.setItem("seat-budgets-v2",JSON.stringify(nb));}catch(e){}};

  const fetchData=useCallback(async()=>{
    setLoading(true);
    try{
      const urls=[`https://docs.google.com/spreadsheets/d/${SID}/gviz/tq?tqx=out:csv&sheet=Meta%20Ads`,`https://docs.google.com/spreadsheets/d/${SID}/gviz/tq?tqx=out:csv&sheet=Google%20Ads`];
      const res=await Promise.allSettled(urls.map(u=>fetch(u).then(r=>r.ok?r.text():"")));
      let all=[];res.forEach(r=>{if(r.status==="fulfilled"&&r.value)all.push(...parseCSV(r.value));});
      if(all.length>0){setData(all);setStatus("live");setLastUp(new Date());}else setStatus("empty");
    }catch(e){setStatus("error");}
    setLoading(false);
  },[]);

  useEffect(()=>{if(auth)fetchData();},[auth,fetchData]);
  useEffect(()=>{if(!auth)return;const t=setInterval(fetchData,300000);return()=>clearInterval(t);},[auth,fetchData]);

  if(!auth) return <LoginScreen onLogin={handleLogin} />;

  // Filter by date
  const filtered=useMemo(()=>data.filter(d=>d.fecha&&d.fecha>=startDate&&d.fecha<=endDate),[data,startDate,endDate]);

  const gD=filtered.filter(d=>d.plataforma==="Google Ads"),mD=filtered.filter(d=>d.plataforma==="Meta Ads");
  const agg=a=>({spend:a.reduce((s,d)=>s+parseFloat(d.coste||0),0),clicks:a.reduce((s,d)=>s+parseInt(d.clics||0),0),imps:a.reduce((s,d)=>s+parseInt(d.impresiones||0),0),convs:a.reduce((s,d)=>s+parseFloat(d.conversiones||0),0),convVal:a.reduce((s,d)=>s+parseFloat(d.valor_conversiones||0),0)});
  const gA=agg(gD),mA=agg(mD);
  const tot={spend:gA.spend+mA.spend,clicks:gA.clicks+mA.clicks,imps:gA.imps+mA.imps,convs:gA.convs+mA.convs};
  const tB=mb.reduce((s,v)=>s+v,0);
  const tCPC=tot.clicks>0?tot.spend/tot.clicks:0,gCPC=gA.clicks>0?gA.spend/gA.clicks:0,mCPC=mA.clicks>0?mA.spend/mA.clicks:0;
  const tCTR=tot.imps>0?(tot.clicks/tot.imps)*100:0,gCTR=gA.imps>0?(gA.clicks/gA.imps)*100:0,mCTR=mA.imps>0?(mA.clicks/mA.imps)*100:0;

  // Monthly spend (uses ALL data, not filtered)
  const monthlySpend={};
  data.forEach(d=>{if(!d.fecha)return;const m=parseInt(d.fecha.split("-")[1])-1;monthlySpend[m]=(monthlySpend[m]||0)+parseFloat(d.coste||0);});

  // Daily (filtered)
  const dM={};
  filtered.forEach(d=>{const f=d.fecha;if(!f)return;if(!dM[f])dM[f]={fecha:f,google:0,meta:0,clics:0,conv:0};dM[f].clics+=parseInt(d.clics||0);dM[f].conv+=parseFloat(d.conversiones||0);if(d.plataforma==="Google Ads")dM[f].google+=parseFloat(d.coste||0);else dM[f].meta+=parseFloat(d.coste||0);});
  const daily=Object.values(dM).sort((a,b)=>a.fecha.localeCompare(b.fecha));

  // Campaigns (filtered)
  const cM={};
  filtered.forEach(d=>{const k=`${d.plataforma}|${d.campaña}`;if(!cM[k])cM[k]={plataforma:d.plataforma,campaña:d.campaña,estado:d.estado,coste:0,clics:0,imps:0,convs:0};cM[k].coste+=parseFloat(d.coste||0);cM[k].clics+=parseInt(d.clics||0);cM[k].imps+=parseInt(d.impresiones||0);cM[k].convs+=parseFloat(d.conversiones||0);});
  const camps=Object.values(cM).sort((a,b)=>b.coste-a.coste);

  const piD=[{name:"Google Ads",value:gA.spend,color:C.google},{name:"Meta Ads",value:mA.spend,color:C.meta}];
  const currentMonth=new Date().getMonth();
  const navBtn=(v,label)=>(<button key={v} onClick={()=>setView(v)} style={{background:view===v?C.seatBlack:"transparent",color:view===v?"#fff":C.textSecondary,border:"none",borderRadius:"8px",fontFamily:F,fontSize:"13px",fontWeight:500,padding:"7px 16px",cursor:"pointer",transition:"all 0.2s"}}>{label}</button>);

  return (
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:F}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}body{margin:0;padding:0}input[type=number]::-webkit-inner-spin-button{opacity:1}input[type=date]::-webkit-calendar-picker-indicator{opacity:0.5}`}</style>

      {/* Nav */}
      <div style={{background:C.seatBlack,padding:"10px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"10px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
          <SeatLogo />
          <div style={{width:"1px",height:"20px",background:"rgba(255,255,255,0.15)"}} />
          <div>
            <div style={{fontSize:"13px",fontWeight:600,color:"#fff"}}>Marketing Dashboard</div>
            <div style={{fontSize:"10px",color:"rgba(255,255,255,0.4)",display:"flex",alignItems:"center",gap:"6px",marginTop:"1px"}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:status==="live"?C.positive:C.warning}} />
              {status==="live"?"En vivo":"Cargando"}{lastUp&&` · ${lastUp.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})}`}
            </div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
          <div style={{background:"rgba(255,255,255,0.08)",borderRadius:"10px",padding:"3px",display:"flex",gap:"2px"}}>
            {navBtn("overview","Resumen")}{navBtn("campaigns","Campañas")}{navBtn("budget","Presupuestos")}
          </div>
          <button onClick={fetchData} disabled={loading} style={{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:"8px",color:"#fff",fontFamily:F,fontSize:"13px",padding:"7px 12px",cursor:"pointer"}}>{loading?"···":"↻"}</button>
          <button onClick={handleLogout} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.35)",fontFamily:F,fontSize:"11px",padding:"7px 8px",cursor:"pointer"}}>Salir</button>
        </div>
      </div>
      <div style={{height:"2.5px",background:C.seatRed}} />

      <div style={{padding:"24px",maxWidth:"1440px",margin:"0 auto"}}>
        {loading&&(<div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"100px 0",gap:"16px"}}><div style={{width:36,height:36,border:`3px solid #e5e5ea`,borderTop:`3px solid ${C.seatRed}`,borderRadius:"50%",animation:"spin 1s linear infinite"}}/><div style={{fontSize:"13px",color:C.textSecondary}}>Cargando datos...</div></div>)}

        {/* ═══ OVERVIEW ═══ */}
        {!loading&&data.length>0&&view==="overview"&&(<>
          <div style={{marginBottom:"20px"}}><DatePicker startDate={startDate} endDate={endDate} onChange={setDates}/></div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"14px",marginBottom:"20px"}}>
            <MetricCard label="Inversión" total={fmt(tot.spend)} google={fmt(gA.spend)} meta={fmt(mA.spend)} />
            <MetricCard label="Impresiones" total={tot.imps} google={gA.imps} meta={mA.imps} />
            <MetricCard label="Clics" total={tot.clicks} google={gA.clicks} meta={mA.clicks} />
            <MetricCard label="CPC medio" total={fmt(tCPC)} google={fmt(gCPC)} meta={fmt(mCPC)} />
            <MetricCard label="CTR" total={fP(tCTR)} google={fP(gCTR)} meta={fP(mCTR)} />
            <MetricCard label="Conversiones" total={tot.convs} google={gA.convs} meta={mA.convs} />
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px",marginBottom:"20px"}}>
            <BudgetGauge label="Google Ads" budget={tB*0.6} spent={gA.spend} color={C.google} />
            <BudgetGauge label="Meta Ads" budget={tB*0.4} spent={mA.spend} color={C.meta} />
          </div>

          <div style={{marginBottom:"20px"}}><BudgetControlTable budgets={mb} monthlySpend={monthlySpend} currentMonth={currentMonth}/></div>

          <div style={{display:"grid",gridTemplateColumns:"5fr 2fr",gap:"14px",marginBottom:"20px"}}>
            <div style={{background:C.card,borderRadius:"14px",padding:"20px",boxShadow:C.shadow,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:"11px",color:C.textTertiary,letterSpacing:"0.5px",textTransform:"uppercase",fontWeight:600,marginBottom:"16px"}}>Inversión diaria</div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={daily}>
                  <defs>
                    <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.google} stopOpacity={0.15}/><stop offset="100%" stopColor={C.google} stopOpacity={0}/></linearGradient>
                    <linearGradient id="mG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.meta} stopOpacity={0.15}/><stop offset="100%" stopColor={C.meta} stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="fecha" tick={{fill:C.textTertiary,fontSize:10,fontFamily:F}} tickFormatter={v=>v.slice(5)}/><YAxis tick={{fill:C.textTertiary,fontSize:10,fontFamily:FM}} tickFormatter={v=>`${v}€`}/>
                  <Tooltip contentStyle={{background:"#fff",border:"1px solid #e5e5ea",borderRadius:"10px",fontFamily:F,fontSize:"12px",boxShadow:C.shadowMd}} formatter={(v,n)=>[`${parseFloat(v).toFixed(2)} €`,n]}/>
                  <Area type="monotone" dataKey="google" stackId="1" stroke={C.google} fill="url(#gG)" name="Google Ads" strokeWidth={1.5}/>
                  <Area type="monotone" dataKey="meta" stackId="1" stroke={C.meta} fill="url(#mG)" name="Meta Ads" strokeWidth={1.5}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{background:C.card,borderRadius:"14px",padding:"20px",boxShadow:C.shadow,border:`1px solid ${C.border}`,display:"flex",flexDirection:"column"}}>
              <div style={{fontSize:"11px",color:C.textTertiary,letterSpacing:"0.5px",textTransform:"uppercase",fontWeight:600,marginBottom:"16px"}}>Distribución</div>
              <div style={{flex:1,display:"flex",alignItems:"center"}}>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart><Pie data={piD} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" stroke="none" paddingAngle={2}>{piD.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie>
                    <Tooltip contentStyle={{background:"#fff",border:"1px solid #e5e5ea",borderRadius:"10px",fontFamily:F,fontSize:"12px"}} formatter={v=>fmt(v)}/></PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"8px",marginTop:"8px"}}>
                {piD.map(p=>(<div key={p.name} style={{display:"flex",alignItems:"center",gap:"8px"}}><div style={{width:8,height:8,borderRadius:"50%",background:p.color}}/><span style={{fontSize:"12px",color:C.textSecondary,flex:1}}>{p.name}</span><span style={{fontSize:"13px",fontWeight:600,color:C.text,fontFamily:FM}}>{tot.spend>0?((p.value/tot.spend)*100).toFixed(0):0}%</span></div>))}
              </div>
            </div>
          </div>

          <div style={{background:C.card,borderRadius:"14px",padding:"20px",boxShadow:C.shadow,border:`1px solid ${C.border}`}}>
            <div style={{fontSize:"11px",color:C.textTertiary,letterSpacing:"0.5px",textTransform:"uppercase",fontWeight:600,marginBottom:"16px"}}>Clics y conversiones</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={daily}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="fecha" tick={{fill:C.textTertiary,fontSize:10,fontFamily:F}} tickFormatter={v=>v.slice(5)}/><YAxis yAxisId="l" tick={{fill:C.textTertiary,fontSize:10,fontFamily:FM}}/><YAxis yAxisId="r" orientation="right" tick={{fill:C.textTertiary,fontSize:10,fontFamily:FM}}/>
                <Tooltip contentStyle={{background:"#fff",border:"1px solid #e5e5ea",borderRadius:"10px",fontFamily:F,fontSize:"12px"}}/>
                <Line yAxisId="l" type="monotone" dataKey="clics" stroke={C.seatRed} strokeWidth={1.5} dot={false} name="Clics"/><Line yAxisId="r" type="monotone" dataKey="conv" stroke={C.positive} strokeWidth={1.5} dot={false} name="Conversiones"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>)}

        {/* ═══ CAMPAIGNS ═══ */}
        {!loading&&data.length>0&&view==="campaigns"&&(<>
          <div style={{marginBottom:"20px"}}><DatePicker startDate={startDate} endDate={endDate} onChange={setDates}/></div>
          <div style={{background:C.card,borderRadius:"14px",overflow:"hidden",boxShadow:C.shadow,border:`1px solid ${C.border}`}}>
            <div style={{padding:"16px 20px",background:C.seatBlack,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px"}}><div style={{width:3,height:16,background:C.seatRed,borderRadius:"2px"}}/><span style={{fontSize:"13px",color:"#fff",fontWeight:600}}>Campañas</span></div>
              <span style={{fontSize:"12px",color:"rgba(255,255,255,0.4)"}}>{camps.length} campañas</span>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontFamily:F,fontSize:"13px"}}>
                <thead><tr style={{background:"#fafafa"}}>
                  {["Plataforma","Campaña","Estado","Inversión","Clics","Impresiones","CTR","CPC","Conversiones"].map(h=>(
                    <th key={h} style={{padding:"11px 14px",textAlign:h==="Plataforma"||h==="Campaña"||h==="Estado"?"left":"right",color:C.textTertiary,fontWeight:600,fontSize:"10px",letterSpacing:"0.5px",textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{camps.map((c,i)=>{
                  const ctr=c.imps>0?(c.clics/c.imps)*100:0,cpc=c.clics>0?c.coste/c.clics:0;
                  const pc=c.plataforma==="Google Ads"?C.google:C.meta;
                  return(
                    <tr key={i} style={{borderBottom:`1px solid ${C.border}`,transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background="#fafafa"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                      <td style={{padding:"11px 14px"}}><div style={{display:"flex",alignItems:"center",gap:"6px"}}><div style={{width:7,height:7,borderRadius:"50%",background:pc}}/><span style={{color:pc,fontWeight:600,fontSize:"12px"}}>{c.plataforma==="Google Ads"?"Google":"Meta"}</span></div></td>
                      <td style={{padding:"11px 14px",fontWeight:500,maxWidth:"240px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.campaña}</td>
                      <td style={{padding:"11px 14px"}}><span style={{background:c.estado==="ACTIVE"||c.estado==="ENABLED"?C.positiveBg:C.border,color:c.estado==="ACTIVE"||c.estado==="ENABLED"?C.positive:C.textTertiary,padding:"3px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:600}}>{c.estado==="ACTIVE"||c.estado==="ENABLED"?"Activa":"Pausa"}</span></td>
                      <td style={{padding:"11px 14px",textAlign:"right",fontWeight:700,fontFamily:FM,fontSize:"12px"}}>{fmt(c.coste)}</td>
                      <td style={{padding:"11px 14px",textAlign:"right",fontFamily:FM,fontSize:"12px",color:C.textSecondary}}>{fN(c.clics)}</td>
                      <td style={{padding:"11px 14px",textAlign:"right",fontFamily:FM,fontSize:"12px",color:C.textSecondary}}>{fN(c.imps)}</td>
                      <td style={{padding:"11px 14px",textAlign:"right",fontFamily:FM,fontSize:"12px",color:C.textSecondary}}>{fP(ctr)}</td>
                      <td style={{padding:"11px 14px",textAlign:"right",fontFamily:FM,fontSize:"12px",color:C.textSecondary}}>{fmt(cpc)}</td>
                      <td style={{padding:"11px 14px",textAlign:"right",fontWeight:600,fontFamily:FM,fontSize:"12px",color:C.positive}}>{fN(c.convs)}</td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          </div>
        </>)}

        {/* ═══ BUDGET ═══ */}
        {!loading&&view==="budget"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"}}>
            <BudgetEditor budgets={mb} onChange={saveMb}/>
            <BudgetControlTable budgets={mb} monthlySpend={monthlySpend} currentMonth={currentMonth}/>
          </div>
        )}

        {!loading&&data.length===0&&view!=="budget"&&(
          <div style={{textAlign:"center",padding:"100px 0"}}>
            <div style={{fontSize:"40px",marginBottom:"16px"}}>📊</div>
            <div style={{fontSize:"17px",fontWeight:600,marginBottom:"6px"}}>Sin datos todavía</div>
            <div style={{fontSize:"13px",color:C.textSecondary,maxWidth:"360px",margin:"0 auto"}}>Los datos llegarán automáticamente cuando se ejecuten los flujos.</div>
          </div>
        )}
      </div>
    </div>
  );
}

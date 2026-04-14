"use client";
import Papa from "papaparse";
import { useState, useEffect, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from "recharts";

/* ── SEAT Corporate Palette ── */
const C = {
  bg: "#f5f5f5", card: "#ffffff", border: "#e0e0e0", borderLight: "#d0d0d0",
  text: "#1a1a1a", textMuted: "#666666", textDim: "#999999",
  seatRed: "#e3000b", seatBlack: "#000000", seatDark: "#1a1a1a", seatGray: "#4a4a4a",
  google: "#4285f4", meta: "#0668E1", accent: "#e3000b",
  positive: "#00843d", negative: "#e3000b", warning: "#f5a623",
};
const F = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const SID = "1HEykheeAndB-RXqKy4wehTzrZNZvuQxpv3WuUwSsUuM";
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const Q_LABELS = ["Trimestre 1","Trimestre 2","Trimestre 3","Trimestre 4"];

const VALID_USER = "marketing@safamotor.com";
const VALID_PASS = "Marketing_26";

const fmt = v => { v=parseFloat(v||0); return v>=1e6?`${(v/1e6).toFixed(1)}M €`:v>=1000?`${(v/1000).toFixed(1)}K €`:`${v.toFixed(2)} €`; };
const fN = v => { v=parseInt(v||0); return v>=1e6?`${(v/1e6).toFixed(1)}M`:v>=1000?`${(v/1000).toFixed(1)}K`:v.toString(); };
const fP = v => `${parseFloat(v||0).toFixed(2)}%`;

const parseCSV = (text) => {
  const lines = text.trim().split("\n"); if(lines.length<2)return[];
  const headers = lines[0].split(",").map(h=>h.trim().replace(/^"|"$/g,""));
  return lines.slice(1).map(line=>{
    const vals=[];let cur="",inQ=false;
    for(let i=0;i<line.length;i++){if(line[i]==='"')inQ=!inQ;else if(line[i]===','&&!inQ){vals.push(cur.trim());cur="";}else cur+=line[i];}
    vals.push(cur.trim());
    const obj={};headers.forEach((h,i)=>{const v=(vals[i]||"").replace(/^"|"$/g,"");obj[h]=isNaN(v)||v===""?v:parseFloat(v);});return obj;
  });
};

/* ── SEAT Logo SVG ── */
const SeatLogo = ({dark}) => (
  <svg viewBox="0 0 200 45" style={{height:"32px"}} fill="none">
    <text x="0" y="35" style={{fontSize:"40px",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontWeight:800,letterSpacing:"8px",fill:dark?C.seatBlack:"#fff"}}>SEAT</text>
    <line x1="0" y1="43" x2="175" y2="43" stroke={C.seatRed} strokeWidth="3"/>
  </svg>
);

/* ── Login Screen ── */
const LoginScreen = ({onLogin}) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      if(email === VALID_USER && pass === VALID_PASS) {
        onLogin(true);
      } else {
        setError("Credenciales incorrectas");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{minHeight:"100vh",background:C.seatBlack,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F}}>
      <div style={{width:"100%",maxWidth:"400px",padding:"24px"}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:"48px"}}>
          <svg viewBox="0 0 200 45" style={{height:"48px",margin:"0 auto",display:"block"}} fill="none">
            <text x="15" y="35" style={{fontSize:"40px",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontWeight:800,letterSpacing:"8px",fill:"#fff"}}>SEAT</text>
            <line x1="15" y1="43" x2="190" y2="43" stroke={C.seatRed} strokeWidth="3"/>
          </svg>
          <div style={{color:"rgba(255,255,255,0.4)",fontSize:"13px",marginTop:"16px",letterSpacing:"2px",textTransform:"uppercase",fontWeight:600}}>Marketing Dashboard</div>
        </div>

        {/* Login Card */}
        <div style={{background:"#1a1a1a",borderRadius:"12px",padding:"32px",border:"1px solid #333"}}>
          <div style={{fontSize:"18px",fontWeight:700,color:"#fff",marginBottom:"4px"}}>Iniciar sesión</div>
          <div style={{fontSize:"13px",color:"rgba(255,255,255,0.4)",marginBottom:"28px"}}>Introduce tus credenciales para acceder</div>

          <form onSubmit={handleLogin}>
            <div style={{marginBottom:"16px"}}>
              <label style={{display:"block",fontSize:"11px",color:"rgba(255,255,255,0.5)",letterSpacing:"1px",textTransform:"uppercase",fontWeight:600,marginBottom:"6px"}}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com"
                style={{width:"100%",background:"#111",border:"1px solid #333",borderRadius:"6px",color:"#fff",fontFamily:F,fontSize:"14px",padding:"12px 14px",outline:"none",boxSizing:"border-box",transition:"border 0.2s"}}
                onFocus={e=>e.target.style.borderColor=C.seatRed} onBlur={e=>e.target.style.borderColor="#333"} />
            </div>

            <div style={{marginBottom:"24px"}}>
              <label style={{display:"block",fontSize:"11px",color:"rgba(255,255,255,0.5)",letterSpacing:"1px",textTransform:"uppercase",fontWeight:600,marginBottom:"6px"}}>Contraseña</label>
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"
                style={{width:"100%",background:"#111",border:"1px solid #333",borderRadius:"6px",color:"#fff",fontFamily:F,fontSize:"14px",padding:"12px 14px",outline:"none",boxSizing:"border-box",transition:"border 0.2s"}}
                onFocus={e=>e.target.style.borderColor=C.seatRed} onBlur={e=>e.target.style.borderColor="#333"} />
            </div>

            {error && (
              <div style={{background:C.seatRed+"18",border:`1px solid ${C.seatRed}44`,borderRadius:"6px",padding:"10px 14px",marginBottom:"16px",fontSize:"13px",color:C.seatRed,fontWeight:600}}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{width:"100%",background:C.seatRed,border:"none",borderRadius:"6px",color:"#fff",fontFamily:F,fontSize:"14px",fontWeight:700,padding:"14px",cursor:loading?"wait":"pointer",letterSpacing:"0.5px",opacity:loading?0.7:1,transition:"opacity 0.2s"}}>
              {loading ? "Verificando..." : "Acceder"}
            </button>
          </form>
        </div>

        <div style={{textAlign:"center",marginTop:"24px",fontSize:"11px",color:"rgba(255,255,255,0.2)"}}>
          Grupo Safamotor · Marketing Digital
        </div>
      </div>
    </div>
  );
};

/* ── Micro Components ── */
const Dot = ({color,size=8}) => <span style={{display:"inline-block",width:size,height:size,borderRadius:"50%",background:color,boxShadow:`0 0 4px ${color}44`}} />;

const StatCard = ({label,value,sub,color=C.accent}) => (
  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"20px",position:"relative",overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:"3px",background:color}} />
    <div style={{fontFamily:F,fontSize:"11px",color:C.textDim,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"8px",fontWeight:600}}>{label}</div>
    <div style={{fontFamily:F,fontSize:"28px",fontWeight:800,color:C.text,lineHeight:1.1}}>{value}</div>
    {sub && <div style={{fontFamily:F,fontSize:"12px",color:C.textMuted,marginTop:"6px"}}>{sub}</div>}
  </div>
);

const BudgetGauge = ({label,budget,spent,color}) => {
  const pct=budget>0?(spent/budget)*100:0, rem=budget-spent;
  const gc = pct>90?C.negative:pct>75?C.warning:C.positive;
  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"20px",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}><Dot color={color} /><span style={{fontFamily:F,fontSize:"14px",fontWeight:700,color:C.text}}>{label}</span></div>
        <span style={{background:gc+"18",color:gc,padding:"2px 8px",borderRadius:"4px",fontSize:"11px",fontFamily:F,fontWeight:700}}>{pct.toFixed(0)}%</span>
      </div>
      <div style={{background:"#e8e8e8",borderRadius:"4px",height:"6px",overflow:"hidden",marginBottom:"12px"}}>
        <div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:gc,borderRadius:"4px",transition:"width 0.6s ease"}} />
      </div>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <div><div style={{fontFamily:F,fontSize:"10px",color:C.textDim,fontWeight:600}}>INVERTIDO</div><div style={{fontFamily:F,fontSize:"15px",fontWeight:800,color:C.text}}>{fmt(spent)}</div></div>
        <div style={{textAlign:"center"}}><div style={{fontFamily:F,fontSize:"10px",color:C.textDim,fontWeight:600}}>PRESUPUESTO</div><div style={{fontFamily:F,fontSize:"15px",fontWeight:800,color:C.textMuted}}>{fmt(budget)}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontFamily:F,fontSize:"10px",color:C.textDim,fontWeight:600}}>RESTANTE</div><div style={{fontFamily:F,fontSize:"15px",fontWeight:800,color:rem<0?C.negative:C.positive}}>{fmt(rem)}</div></div>
      </div>
    </div>
  );
};

/* ── Budget Control Table ── */
const BudgetControlTable = ({budgets, monthlySpend, currentMonth}) => {
  const totalAnnualBudget = budgets.reduce((s,v)=>s+v,0);
  const totalSpent = Object.values(monthlySpend).reduce((s,v)=>s+v,0);
  const rows = [];
  rows.push({label:"Anual", budget:totalAnnualBudget, spent:totalSpent, isHeader:true});
  for(let q=0;q<4;q++){let qB=0,qS=0;for(let m=q*3;m<q*3+3;m++){qB+=budgets[m]||0;qS+=monthlySpend[m]||0;}rows.push({label:Q_LABELS[q],budget:qB,spent:qS,isQuarter:true});}
  MONTHS.forEach((name,i)=>{rows.push({label:name,budget:budgets[i]||0,spent:monthlySpend[i]||0,isCurrent:i===currentMonth,isMonth:true});});

  const cellBase = {padding:"8px 12px",fontFamily:F,fontSize:"12px",borderBottom:`1px solid ${C.border}`,whiteSpace:"nowrap"};
  const numCell = {...cellBase, textAlign:"right", fontVariantNumeric:"tabular-nums"};

  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:"8px",overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
      <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,background:C.seatBlack}}>
        <span style={{fontFamily:F,fontSize:"12px",color:"#fff",letterSpacing:"1.5px",textTransform:"uppercase",fontWeight:700}}>Control de presupuesto</span>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#f8f8f8"}}>
            <th style={{...cellBase,textAlign:"left",fontWeight:700,color:C.textDim,fontSize:"10px",letterSpacing:"0.5px"}}>PERIODO</th>
            <th style={{...numCell,fontWeight:700,color:C.textDim,fontSize:"10px",letterSpacing:"0.5px"}}>INV. DISPONIBLE</th>
            <th style={{...numCell,fontWeight:700,color:C.textDim,fontSize:"10px",letterSpacing:"0.5px"}}>INV. CONSUMIDA</th>
            <th style={{...numCell,fontWeight:700,color:C.textDim,fontSize:"10px",letterSpacing:"0.5px"}}>INV. RESTANTE</th>
            <th style={{...numCell,fontWeight:700,color:C.textDim,fontSize:"10px",letterSpacing:"0.5px"}}>% INV. DISPONIBLE</th>
          </tr></thead>
          <tbody>
            {rows.map((r,i) => {
              const remaining = r.budget - r.spent;
              const pctAvail = r.budget > 0 ? ((remaining / r.budget) * 100) : 0;
              const bgColor = r.isHeader ? C.seatRed : r.isQuarter ? "#f0f0f0" : r.isCurrent ? "#fffde7" : "transparent";
              const textColor = r.isHeader ? "#fff" : C.text;
              const fw = r.isHeader || r.isQuarter ? 800 : 500;
              return (
                <tr key={i} style={{background:bgColor}}>
                  <td style={{...cellBase,fontWeight:fw,color:textColor}}>{r.label}</td>
                  <td style={{...numCell,fontWeight:fw,color:textColor}}>{fmt(r.budget)}</td>
                  <td style={{...numCell,fontWeight:fw,color:textColor}}>{fmt(r.spent)}</td>
                  <td style={{...numCell,fontWeight:800,color:remaining>=0?(r.isHeader?"#fff":C.positive):C.negative}}>{fmt(remaining)}</td>
                  <td style={{...numCell,fontWeight:fw}}>
                    <span style={{background:pctAvail>=0?(r.isHeader?"rgba(255,255,255,0.2)":C.positive+"18"):C.negative+"18",color:pctAvail>=0?(r.isHeader?"#fff":C.positive):C.negative,padding:"2px 6px",borderRadius:"3px",fontSize:"11px",fontWeight:700}}>
                      {r.budget>0?`${pctAvail.toFixed(2)}%`:"—"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ── Monthly Budget Editor ── */
const BudgetEditor = ({budgets, onChange}) => {
  const cellBase = {padding:"8px 12px",fontFamily:F,fontSize:"13px",borderBottom:`1px solid ${C.border}`};
  const totalAnnual = budgets.reduce((s,v)=>s+v,0);
  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:"8px",overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
      <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,background:C.seatBlack}}>
        <span style={{fontFamily:F,fontSize:"12px",color:"#fff",letterSpacing:"1.5px",textTransform:"uppercase",fontWeight:700}}>Presupuesto mensual</span>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{background:"#f8f8f8"}}>
          <th style={{...cellBase,textAlign:"left",fontWeight:700,color:C.textDim,fontSize:"10px"}}>MES</th>
          <th style={{...cellBase,textAlign:"right",fontWeight:700,color:C.textDim,fontSize:"10px"}}>PRESUPUESTO</th>
        </tr></thead>
        <tbody>
          {MONTHS.map((name,i) => (
            <tr key={i} style={{background:i===new Date().getMonth()?"#fffde7":"transparent"}}>
              <td style={{...cellBase,fontWeight:600,color:C.text}}>{name}</td>
              <td style={{...cellBase,textAlign:"right"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:"4px"}}>
                  <input value={budgets[i]} onChange={e=>{const nb=[...budgets];nb[i]=parseFloat(e.target.value)||0;onChange(nb);}}
                    type="number" step="100" style={{background:"#f8f8f8",border:`1px solid ${C.border}`,borderRadius:"4px",color:C.text,fontFamily:F,fontSize:"13px",fontWeight:700,padding:"6px 10px",outline:"none",width:"120px",textAlign:"right",boxSizing:"border-box"}} />
                  <span style={{fontFamily:F,fontSize:"12px",color:C.textDim}}>€</span>
                </div>
              </td>
            </tr>
          ))}
          {[0,1,2,3].map(q => {
            const qTotal = budgets.slice(q*3,q*3+3).reduce((s,v)=>s+v,0);
            return (<tr key={`q${q}`} style={{background:"#f0f0f0"}}><td style={{...cellBase,fontWeight:800,color:C.seatDark}}>{Q_LABELS[q]}</td><td style={{...cellBase,textAlign:"right",fontWeight:800,color:C.seatDark}}>{fmt(qTotal)}</td></tr>);
          })}
          <tr style={{background:C.seatRed}}><td style={{...cellBase,fontWeight:800,color:"#fff",borderBottom:"none"}}>TOTAL ANUAL</td><td style={{...cellBase,textAlign:"right",fontWeight:800,color:"#fff",fontSize:"16px",borderBottom:"none"}}>{fmt(totalAnnual)}</td></tr>
        </tbody>
      </table>
    </div>
  );
};

/* ══════════════════════ MAIN APP ══════════════════════ */
export default function Dashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState([]);
  const [monthlyBudgets, setMonthlyBudgets] = useState([2835,2835,2835,2835,2835,2835,2835,2835,2835,2835,2835,2835]);
  const [view, setView] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [status, setStatus] = useState("loading");

  // Check saved session
  useEffect(()=>{try{const s=sessionStorage.getItem("seat-auth");if(s==="true")setAuthenticated(true);}catch(e){}},[]);

  const handleLogin = (ok) => {
    setAuthenticated(ok);
    try{sessionStorage.setItem("seat-auth","true");}catch(e){}
  };

  const handleLogout = () => {
    setAuthenticated(false);
    try{sessionStorage.removeItem("seat-auth");}catch(e){}
  };

  useEffect(()=>{try{const s=localStorage.getItem("seat-budgets");if(s)setMonthlyBudgets(JSON.parse(s));}catch(e){}},[]);
  const saveBudgets = (nb) => { setMonthlyBudgets(nb); try{localStorage.setItem("seat-budgets",JSON.stringify(nb));}catch(e){} };

  const fetchData = useCallback(async()=>{
    setLoading(true);
    try{
      const urls=[`https://docs.google.com/spreadsheets/d/${SID}/gviz/tq?tqx=out:csv&sheet=Meta%20Ads`,`https://docs.google.com/spreadsheets/d/${SID}/gviz/tq?tqx=out:csv&sheet=Google%20Ads`];
      const results=await Promise.allSettled(urls.map(u=>fetch(u).then(r=>r.ok?r.text():"")));
      let all=[];results.forEach(r=>{if(r.status==="fulfilled"&&r.value)all.push(...parseCSV(r.value));});
      if(all.length>0){setData(all);setStatus("live");setLastUpdate(new Date());}else setStatus("empty");
    }catch(e){setStatus("error");}
    setLoading(false);
  },[]);

  useEffect(()=>{if(authenticated)fetchData();},[authenticated,fetchData]);
  useEffect(()=>{if(!authenticated)return;const t=setInterval(fetchData,300000);return()=>clearInterval(t);},[authenticated,fetchData]);

  // ── If not authenticated, show login ──
  if(!authenticated) return <LoginScreen onLogin={handleLogin} />;

  // Aggregations
  const gD=data.filter(d=>d.plataforma==="Google Ads"), mD=data.filter(d=>d.plataforma==="Meta Ads");
  const agg=a=>({spend:a.reduce((s,d)=>s+parseFloat(d.coste||0),0),clicks:a.reduce((s,d)=>s+parseInt(d.clics||0),0),imps:a.reduce((s,d)=>s+parseInt(d.impresiones||0),0),convs:a.reduce((s,d)=>s+parseFloat(d.conversiones||0),0),convVal:a.reduce((s,d)=>s+parseFloat(d.valor_conversiones||0),0)});
  const gA=agg(gD),mA=agg(mD);
  const tot={spend:gA.spend+mA.spend,clicks:gA.clicks+mA.clicks,imps:gA.imps+mA.imps,convs:gA.convs+mA.convs,convVal:gA.convVal+mA.convVal};
  const tB=monthlyBudgets.reduce((s,v)=>s+v,0);
  const tCPC=tot.clicks>0?tot.spend/tot.clicks:0,tCTR=tot.imps>0?(tot.clicks/tot.imps)*100:0,tROAS=tot.spend>0?tot.convVal/tot.spend:0,tCPA=tot.convs>0?tot.spend/tot.convs:0;

  const monthlySpend = {};
  data.forEach(d=>{if(!d.fecha)return;const m=parseInt(d.fecha.split("-")[1])-1;monthlySpend[m]=(monthlySpend[m]||0)+parseFloat(d.coste||0);});

  const dM={};
  data.forEach(d=>{const f=d.fecha;if(!f)return;if(!dM[f])dM[f]={fecha:f,google:0,meta:0,clics:0,conv:0};const c=parseFloat(d.coste||0);dM[f].clics+=parseInt(d.clics||0);dM[f].conv+=parseFloat(d.conversiones||0);if(d.plataforma==="Google Ads")dM[f].google+=c;else dM[f].meta+=c;});
  const daily=Object.values(dM).sort((a,b)=>a.fecha.localeCompare(b.fecha));

  const cM={};
  data.forEach(d=>{const k=`${d.plataforma}|${d.campaña}`;if(!cM[k])cM[k]={plataforma:d.plataforma,campaña:d.campaña,estado:d.estado,coste:0,clics:0,imps:0,convs:0,val:0};cM[k].coste+=parseFloat(d.coste||0);cM[k].clics+=parseInt(d.clics||0);cM[k].imps+=parseInt(d.impresiones||0);cM[k].convs+=parseFloat(d.conversiones||0);cM[k].val+=parseFloat(d.valor_conversiones||0);});
  const camps=Object.values(cM).sort((a,b)=>b.coste-a.coste);

  const piD=[{name:"Google Ads",value:gA.spend,color:C.google},{name:"Meta Ads",value:mA.spend,color:C.meta}];
  const currentMonth = new Date().getMonth();

  return (
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:F}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} body{margin:0;padding:0} input[type=number]::-webkit-inner-spin-button{opacity:1}`}</style>

      {/* Header */}
      <div style={{background:C.seatBlack,padding:"12px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
          <div>
            <div style={{fontSize:"14px",fontWeight:700,color:"#fff",letterSpacing:"0.5px"}}>Marketing Dashboard</div>
            <div style={{fontSize:"11px",color:"rgba(255,255,255,0.5)",marginTop:"2px",display:"flex",alignItems:"center",gap:"8px"}}>
              <Dot color={status==="live"?C.positive:status==="loading"?C.warning:C.negative} size={6} />
              {status==="live"?"Datos en vivo":status==="loading"?"Cargando...":"Sin datos"}
              {lastUpdate && <span>· {lastUpdate.toLocaleString("es-ES")}</span>}
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:"8px",alignItems:"center",flexWrap:"wrap"}}>
          {["overview","campaigns","budget"].map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{
              background:view===v?"rgba(227,0,11,0.9)":"rgba(255,255,255,0.1)",
              border:view===v?"1px solid #e3000b":"1px solid rgba(255,255,255,0.15)",
              borderRadius:"4px",color:"#fff",fontFamily:F,fontSize:"11px",fontWeight:700,
              padding:"6px 14px",cursor:"pointer",letterSpacing:"1px",textTransform:"uppercase",
            }}>
              {v==="overview"?"Resumen":v==="campaigns"?"Campañas":"Presupuestos"}
            </button>
          ))}
          <button onClick={fetchData} disabled={loading} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"4px",color:"#fff",fontFamily:F,fontSize:"12px",fontWeight:700,padding:"6px 12px",cursor:"pointer"}}>{loading?"...":"↻"}</button>
          <button onClick={handleLogout} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"4px",color:"rgba(255,255,255,0.5)",fontFamily:F,fontSize:"10px",fontWeight:600,padding:"6px 10px",cursor:"pointer",letterSpacing:"0.5px"}}>Salir</button>
          <SeatLogo />
        </div>
      </div>
      <div style={{height:"3px",background:C.seatRed}} />

      <div style={{padding:"24px",maxWidth:"1400px",margin:"0 auto"}}>
        {loading && (<div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"80px 0",gap:"16px"}}><div style={{width:40,height:40,border:`3px solid ${C.border}`,borderTop:`3px solid ${C.seatRed}`,borderRadius:"50%",animation:"spin 1s linear infinite"}} /><div style={{fontFamily:F,fontSize:"13px",color:C.textMuted}}>Cargando datos...</div></div>)}

        {/* ═══ OVERVIEW ═══ */}
        {!loading && data.length>0 && view==="overview" && (<>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"16px",marginBottom:"24px"}}>
            <StatCard label="Inversión total" value={fmt(tot.spend)} sub={`de ${fmt(tB)}`} color={C.seatRed} />
            <StatCard label="Clics" value={fN(tot.clicks)} sub={`CTR: ${fP(tCTR)}`} color={C.google} />
            <StatCard label="Conversiones" value={fN(tot.convs)} sub={`CPA: ${fmt(tCPA)}`} color={C.positive} />
            <StatCard label="ROAS" value={`${tROAS.toFixed(2)}x`} sub={`Valor: ${fmt(tot.convVal)}`} color={C.seatDark} />
            <StatCard label="CPC medio" value={fmt(tCPC)} color={C.meta} />
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"24px"}}>
            <BudgetGauge label="Google Ads" budget={tB*0.6} spent={gA.spend} color={C.google} />
            <BudgetGauge label="Meta Ads" budget={tB*0.4} spent={mA.spend} color={C.meta} />
          </div>

          <div style={{marginBottom:"24px"}}><BudgetControlTable budgets={monthlyBudgets} monthlySpend={monthlySpend} currentMonth={currentMonth} /></div>

          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:"16px",marginBottom:"24px"}}>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"20px",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
              <div style={{fontFamily:F,fontSize:"11px",color:C.textDim,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"16px",fontWeight:700}}>Inversión diaria</div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={daily}>
                  <defs>
                    <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.google} stopOpacity={0.2}/><stop offset="100%" stopColor={C.google} stopOpacity={0}/></linearGradient>
                    <linearGradient id="mG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.meta} stopOpacity={0.2}/><stop offset="100%" stopColor={C.meta} stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="fecha" tick={{fill:C.textDim,fontSize:10,fontFamily:F}} tickFormatter={v=>v.slice(5)}/><YAxis tick={{fill:C.textDim,fontSize:10,fontFamily:F}} tickFormatter={v=>`${v}€`}/>
                  <Tooltip contentStyle={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:"6px",fontFamily:F,fontSize:"12px",boxShadow:"0 2px 8px rgba(0,0,0,0.1)"}} formatter={(v,n)=>[`${parseFloat(v).toFixed(2)} €`,n]}/>
                  <Area type="monotone" dataKey="google" stackId="1" stroke={C.google} fill="url(#gG)" name="Google Ads"/><Area type="monotone" dataKey="meta" stackId="1" stroke={C.meta} fill="url(#mG)" name="Meta Ads"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"20px",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
              <div style={{fontFamily:F,fontSize:"11px",color:C.textDim,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"16px",fontWeight:700}}>Distribución</div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart><Pie data={piD} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" stroke="none">{piD.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie>
                  <Tooltip contentStyle={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:"6px",fontFamily:F,fontSize:"12px"}} formatter={v=>fmt(v)}/></PieChart>
              </ResponsiveContainer>
              <div style={{display:"flex",justifyContent:"center",gap:"20px",marginTop:"4px"}}>
                {piD.map(p=>(<div key={p.name} style={{display:"flex",alignItems:"center",gap:"6px"}}><Dot color={p.color} size={6}/><span style={{fontFamily:F,fontSize:"11px",color:C.textMuted}}>{p.name}</span><span style={{fontFamily:F,fontSize:"11px",fontWeight:800,color:C.text}}>{tot.spend>0?((p.value/tot.spend)*100).toFixed(0):0}%</span></div>))}
              </div>
            </div>
          </div>

          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"20px",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
            <div style={{fontFamily:F,fontSize:"11px",color:C.textDim,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"16px",fontWeight:700}}>Clics y conversiones</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={daily}><CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="fecha" tick={{fill:C.textDim,fontSize:10,fontFamily:F}} tickFormatter={v=>v.slice(5)}/><YAxis yAxisId="l" tick={{fill:C.textDim,fontSize:10,fontFamily:F}}/><YAxis yAxisId="r" orientation="right" tick={{fill:C.textDim,fontSize:10,fontFamily:F}}/>
                <Tooltip contentStyle={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:"6px",fontFamily:F,fontSize:"12px"}}/>
                <Line yAxisId="l" type="monotone" dataKey="clics" stroke={C.seatRed} strokeWidth={2} dot={false} name="Clics"/><Line yAxisId="r" type="monotone" dataKey="conv" stroke={C.positive} strokeWidth={2} dot={false} name="Conversiones"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>)}

        {/* ═══ CAMPAIGNS ═══ */}
        {!loading && data.length>0 && view==="campaigns" && (
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:"8px",overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
            <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,background:C.seatBlack}}>
              <span style={{fontFamily:F,fontSize:"12px",color:"#fff",letterSpacing:"1.5px",textTransform:"uppercase",fontWeight:700}}>Campañas ({camps.length})</span>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontFamily:F,fontSize:"12px"}}>
                <thead><tr style={{background:"#f8f8f8"}}>
                  {["Plataforma","Campaña","Estado","Inversión","Clics","Impr.","CTR","CPC","Conv.","ROAS"].map(h=>(
                    <th key={h} style={{padding:"10px 14px",textAlign:"left",color:C.textDim,fontWeight:700,fontSize:"10px",letterSpacing:"0.5px",textTransform:"uppercase",whiteSpace:"nowrap",borderBottom:`1px solid ${C.border}`}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{camps.map((c,i)=>{
                  const ctr=c.imps>0?(c.clics/c.imps)*100:0,cpc=c.clics>0?c.coste/c.clics:0,roas=c.coste>0?c.val/c.coste:0;
                  const pc=c.plataforma==="Google Ads"?C.google:C.meta;
                  return(
                    <tr key={i} style={{borderBottom:`1px solid ${C.border}`}}>
                      <td style={{padding:"10px 14px"}}><div style={{display:"flex",alignItems:"center",gap:"6px"}}><Dot color={pc} size={6}/><span style={{color:pc,fontWeight:700}}>{c.plataforma==="Google Ads"?"Google":"Meta"}</span></div></td>
                      <td style={{padding:"10px 14px",color:C.text,fontWeight:600,maxWidth:"220px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.campaña}</td>
                      <td style={{padding:"10px 14px"}}><span style={{background:c.estado==="ACTIVE"||c.estado==="ENABLED"?C.positive+"18":C.textDim+"18",color:c.estado==="ACTIVE"||c.estado==="ENABLED"?C.positive:C.textDim,padding:"2px 8px",borderRadius:"4px",fontSize:"10px",fontWeight:700,textTransform:"uppercase"}}>{c.estado==="ACTIVE"||c.estado==="ENABLED"?"Activa":"Pausa"}</span></td>
                      <td style={{padding:"10px 14px",color:C.text,fontWeight:800}}>{fmt(c.coste)}</td>
                      <td style={{padding:"10px 14px",color:C.textMuted}}>{fN(c.clics)}</td>
                      <td style={{padding:"10px 14px",color:C.textMuted}}>{fN(c.imps)}</td>
                      <td style={{padding:"10px 14px",color:C.textMuted}}>{fP(ctr)}</td>
                      <td style={{padding:"10px 14px",color:C.textMuted}}>{fmt(cpc)}</td>
                      <td style={{padding:"10px 14px",color:C.positive,fontWeight:700}}>{fN(c.convs)}</td>
                      <td style={{padding:"10px 14px"}}><span style={{color:roas>=1?C.positive:C.negative,fontWeight:800}}>{roas.toFixed(2)}x</span></td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ BUDGET ═══ */}
        {!loading && view==="budget" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"24px"}}>
            <BudgetEditor budgets={monthlyBudgets} onChange={saveBudgets} />
            <BudgetControlTable budgets={monthlyBudgets} monthlySpend={monthlySpend} currentMonth={currentMonth} />
          </div>
        )}

        {!loading && data.length===0 && view!=="budget" && (
          <div style={{textAlign:"center",padding:"80px 0"}}>
            <div style={{fontSize:"48px",marginBottom:"16px"}}>📊</div>
            <div style={{fontSize:"18px",fontWeight:700,marginBottom:"8px"}}>Sin datos todavía</div>
            <div style={{fontSize:"13px",color:C.textMuted,maxWidth:"400px",margin:"0 auto"}}>Los datos llegarán automáticamente cuando se ejecuten los flujos.</div>
          </div>
        )}
      </div>
    </div>
  );
}

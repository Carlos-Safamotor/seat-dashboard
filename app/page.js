"use client";
import { useState, useEffect, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import Papa from "papaparse";

const C = {
  bg: "#0a0e17", card: "#111827", border: "#1e293b", borderLight: "#334155",
  text: "#e2e8f0", textMuted: "#94a3b8", textDim: "#64748b",
  google: "#4285f4", meta: "#0668E1", accent: "#10b981",
  warning: "#f59e0b", danger: "#ef4444", purple: "#8b5cf6",
};
const F = "'JetBrains Mono', 'SF Mono', monospace";
const FD = "'Inter', -apple-system, sans-serif";
const SID = "1HEykheeAndB-RXqKy4wehTzrZNZvuQxpv3WuUwSsUuM";

const fmt = (v) => { v=parseFloat(v||0); return v>=1e6?`${(v/1e6).toFixed(1)}M €`:v>=1000?`${(v/1000).toFixed(1)}K €`:`${v.toFixed(2)} €`; };
const fN = (v) => { v=parseInt(v||0); return v>=1e6?`${(v/1e6).toFixed(1)}M`:v>=1000?`${(v/1000).toFixed(1)}K`:v.toString(); };
const fP = (v) => `${parseFloat(v||0).toFixed(2)}%`;

const Pill = ({color,children}) => <span style={{background:color+"22",color,padding:"2px 8px",borderRadius:"4px",fontSize:"10px",fontFamily:F,fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"}}>{children}</span>;
const Dot = ({color,size=8}) => <span style={{display:"inline-block",width:size,height:size,borderRadius:"50%",background:color,boxShadow:`0 0 ${size}px ${color}88`}} />;

const StatCard = ({label,value,sub,color=C.accent}) => (
  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:"12px",padding:"20px",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:`linear-gradient(90deg,${color},transparent)`}} />
    <div style={{fontFamily:F,fontSize:"11px",color:C.textDim,letterSpacing:"1px",textTransform:"uppercase",marginBottom:"8px"}}>{label}</div>
    <div style={{fontFamily:F,fontSize:"26px",fontWeight:700,color:C.text,lineHeight:1.1}}>{value}</div>
    {sub && <div style={{fontFamily:F,fontSize:"12px",color:C.textMuted,marginTop:"6px"}}>{sub}</div>}
  </div>
);

const BudgetGauge = ({label,budget,spent,color,onEdit}) => {
  const pct=budget>0?(spent/budget)*100:0, rem=budget-spent;
  const gc = pct>90?C.danger:pct>75?C.warning:color;
  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:"12px",padding:"20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}><Dot color={color} /><span style={{fontFamily:FD,fontSize:"14px",fontWeight:600,color:C.text}}>{label}</span></div>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <Pill color={gc}>{pct.toFixed(0)}% usado</Pill>
          {onEdit && <button onClick={onEdit} style={{background:"transparent",border:`1px solid ${C.borderLight}`,borderRadius:"4px",color:C.textMuted,cursor:"pointer",fontFamily:F,fontSize:"10px",padding:"2px 8px"}}>✎</button>}
        </div>
      </div>
      <div style={{background:C.bg,borderRadius:"6px",height:"8px",overflow:"hidden",marginBottom:"12px"}}>
        <div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:`linear-gradient(90deg,${gc},${gc}cc)`,borderRadius:"6px",transition:"width 0.6s ease"}} />
      </div>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <div><div style={{fontFamily:F,fontSize:"10px",color:C.textDim}}>INVERTIDO</div><div style={{fontFamily:F,fontSize:"16px",fontWeight:700,color:C.text}}>{fmt(spent)}</div></div>
        <div style={{textAlign:"center"}}><div style={{fontFamily:F,fontSize:"10px",color:C.textDim}}>PRESUPUESTO</div><div style={{fontFamily:F,fontSize:"16px",fontWeight:700,color:C.textMuted}}>{fmt(budget)}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontFamily:F,fontSize:"10px",color:C.textDim}}>RESTANTE</div><div style={{fontFamily:F,fontSize:"16px",fontWeight:700,color:rem<0?C.danger:C.accent}}>{fmt(rem)}</div></div>
      </div>
    </div>
  );
};

function fetchSheet(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${SID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  return fetch(url)
    .then(r => r.ok ? r.text() : "")
    .then(text => {
      if (!text) return [];
      const result = Papa.parse(text, { header: true, skipEmptyLines: true, dynamicTyping: true });
      return result.data || [];
    })
    .catch(() => []);
}

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [budgets, setBudgets] = useState({ google: 5000, meta: 3000 });
  const [editBudget, setEditBudget] = useState(null);
  const [budgetVal, setBudgetVal] = useState("");
  const [view, setView] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [status, setStatus] = useState("loading");

  // Load budgets from localStorage
  useEffect(() => {
    try {
      const s = localStorage.getItem("safamotor-budgets");
      if (s) setBudgets(JSON.parse(s));
    } catch (e) {}
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [meta, google] = await Promise.all([fetchSheet("Meta Ads"), fetchSheet("Google Ads")]);
      const all = [...meta, ...google].filter(d => d.fecha);
      if (all.length > 0) { setData(all); setStatus("live"); setLastUpdate(new Date()); }
      else setStatus("empty");
    } catch (e) { setStatus("error"); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { const t = setInterval(fetchData, 300000); return () => clearInterval(t); }, [fetchData]);

  const saveBudget = () => {
    if (editBudget && !isNaN(budgetVal)) {
      const nb = { ...budgets, [editBudget]: parseFloat(budgetVal) };
      setBudgets(nb);
      try { localStorage.setItem("safamotor-budgets", JSON.stringify(nb)); } catch (e) {}
    }
    setEditBudget(null);
  };

  // Aggregations
  const gD = data.filter(d => d.plataforma === "Google Ads"), mD = data.filter(d => d.plataforma === "Meta Ads");
  const agg = a => ({ spend: a.reduce((s, d) => s + parseFloat(d.coste || 0), 0), clicks: a.reduce((s, d) => s + parseInt(d.clics || 0), 0), imps: a.reduce((s, d) => s + parseInt(d.impresiones || 0), 0), convs: a.reduce((s, d) => s + parseFloat(d.conversiones || 0), 0), convVal: a.reduce((s, d) => s + parseFloat(d.valor_conversiones || 0), 0) });
  const gA = agg(gD), mA = agg(mD);
  const tot = { spend: gA.spend + mA.spend, clicks: gA.clicks + mA.clicks, imps: gA.imps + mA.imps, convs: gA.convs + mA.convs, convVal: gA.convVal + mA.convVal };
  const tB = budgets.google + budgets.meta, tCPC = tot.clicks > 0 ? tot.spend / tot.clicks : 0, tCTR = tot.imps > 0 ? (tot.clicks / tot.imps) * 100 : 0, tROAS = tot.spend > 0 ? tot.convVal / tot.spend : 0, tCPA = tot.convs > 0 ? tot.spend / tot.convs : 0;

  // Daily
  const dM = {};
  data.forEach(d => { const f = d.fecha; if (!f) return; if (!dM[f]) dM[f] = { fecha: f, google: 0, meta: 0, clics: 0, conv: 0 }; const c = parseFloat(d.coste || 0); dM[f].clics += parseInt(d.clics || 0); dM[f].conv += parseFloat(d.conversiones || 0); if (d.plataforma === "Google Ads") dM[f].google += c; else dM[f].meta += c; });
  const daily = Object.values(dM).sort((a, b) => a.fecha.localeCompare(b.fecha));

  // Campaigns
  const cM = {};
  data.forEach(d => { const k = `${d.plataforma}|${d.campaña}`; if (!cM[k]) cM[k] = { plataforma: d.plataforma, campaña: d.campaña, estado: d.estado, coste: 0, clics: 0, imps: 0, convs: 0, val: 0 }; cM[k].coste += parseFloat(d.coste || 0); cM[k].clics += parseInt(d.clics || 0); cM[k].imps += parseInt(d.impresiones || 0); cM[k].convs += parseFloat(d.conversiones || 0); cM[k].val += parseFloat(d.valor_conversiones || 0); });
  const camps = Object.values(cM).sort((a, b) => b.coste - a.coste);

  const piD = [{ name: "Google Ads", value: gA.spend, color: C.google }, { name: "Meta Ads", value: mA.spend, color: C.meta }];
  const btn = c => ({ background: c, border: "none", borderRadius: "6px", color: "#fff", fontFamily: F, fontSize: "12px", fontWeight: 600, padding: "8px 16px", cursor: "pointer" });

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: FD }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} body{margin:0;padding:0}`}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>
            <span style={{ color: C.google }}>G</span><span style={{ color: C.meta }}>M</span>
            <span style={{ color: C.textDim }}> /</span> Safamotor Ad Dashboard
          </div>
          <div style={{ fontFamily: F, fontSize: "11px", color: C.textDim, marginTop: "2px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Dot color={status === "live" ? C.accent : status === "loading" ? C.warning : C.danger} size={6} />
            {status === "live" ? "Datos en vivo" : status === "loading" ? "Cargando..." : status === "empty" ? "Sin datos" : "Error"}
            {lastUpdate && <span>· {lastUpdate.toLocaleString("es-ES")}</span>}
            {data.length > 0 && <span>· {data.length} registros</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          {["overview", "campaigns", "budget"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              background: view === v ? C.accent + "22" : "transparent",
              border: `1px solid ${view === v ? C.accent : C.border}`,
              borderRadius: "6px", color: view === v ? C.accent : C.textMuted,
              fontFamily: F, fontSize: "11px", fontWeight: 600, padding: "6px 14px",
              cursor: "pointer", letterSpacing: "0.5px", textTransform: "uppercase",
            }}>
              {v === "overview" ? "Resumen" : v === "campaigns" ? "Campañas" : "Presupuestos"}
            </button>
          ))}
          <button onClick={fetchData} disabled={loading} style={btn(C.purple)}>{loading ? "..." : "↻ Actualizar"}</button>
        </div>
      </div>

      {/* Budget Modal */}
      {editBudget && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setEditBudget(null)}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "32px", width: "360px" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: F, fontSize: "11px", color: C.textDim, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
              Presupuesto mensual — {editBudget === "google" ? "Google Ads" : "Meta Ads"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <input value={budgetVal} onChange={e => setBudgetVal(e.target.value)} onKeyDown={e => e.key === "Enter" && saveBudget()}
                style={{ background: C.bg, border: `1px solid ${C.borderLight}`, borderRadius: "6px", color: C.text, fontFamily: F, fontSize: "24px", fontWeight: 700, padding: "10px", outline: "none", width: "100%", textAlign: "center", boxSizing: "border-box" }} autoFocus />
              <span style={{ fontFamily: F, fontSize: "20px", color: C.textMuted }}>€</span>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={saveBudget} style={{ ...btn(C.accent), flex: 1 }}>Guardar</button>
              <button onClick={() => setEditBudget(null)} style={{ ...btn(C.textDim), flex: 1 }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 0", gap: "16px" }}>
            <div style={{ width: 40, height: 40, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <div style={{ fontFamily: F, fontSize: "13px", color: C.textMuted }}>Cargando datos desde Google Sheets...</div>
          </div>
        )}

        {/* OVERVIEW */}
        {!loading && data.length > 0 && view === "overview" && (<>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "16px", marginBottom: "24px" }}>
            <StatCard label="Inversión total" value={fmt(tot.spend)} sub={`de ${fmt(tB)}`} color={C.warning} />
            <StatCard label="Clics" value={fN(tot.clicks)} sub={`CTR: ${fP(tCTR)}`} color={C.google} />
            <StatCard label="Conversiones" value={fN(tot.convs)} sub={`CPA: ${fmt(tCPA)}`} color={C.accent} />
            <StatCard label="ROAS" value={`${tROAS.toFixed(2)}x`} sub={`Valor: ${fmt(tot.convVal)}`} color={C.purple} />
            <StatCard label="CPC medio" value={fmt(tCPC)} color={C.meta} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <BudgetGauge label="Google Ads" budget={budgets.google} spent={gA.spend} color={C.google} onEdit={() => { setEditBudget("google"); setBudgetVal(budgets.google.toString()); }} />
            <BudgetGauge label="Meta Ads" budget={budgets.meta} spent={mA.spend} color={C.meta} onEdit={() => { setEditBudget("meta"); setBudgetVal(budgets.meta.toString()); }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontFamily: F, fontSize: "11px", color: C.textDim, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>Inversión diaria</div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={daily}>
                  <defs>
                    <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.google} stopOpacity={0.3} /><stop offset="100%" stopColor={C.google} stopOpacity={0} /></linearGradient>
                    <linearGradient id="mG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.meta} stopOpacity={0.3} /><stop offset="100%" stopColor={C.meta} stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="fecha" tick={{ fill: C.textDim, fontSize: 10, fontFamily: F }} tickFormatter={v => v.slice(5)} />
                  <YAxis tick={{ fill: C.textDim, fontSize: 10, fontFamily: F }} tickFormatter={v => `${v}€`} />
                  <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "8px", fontFamily: F, fontSize: "12px" }} formatter={(v, n) => [`${parseFloat(v).toFixed(2)} €`, n]} />
                  <Area type="monotone" dataKey="google" stackId="1" stroke={C.google} fill="url(#gG)" name="Google Ads" />
                  <Area type="monotone" dataKey="meta" stackId="1" stroke={C.meta} fill="url(#mG)" name="Meta Ads" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontFamily: F, fontSize: "11px", color: C.textDim, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>Distribución</div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart><Pie data={piD} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" stroke="none">{piD.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie>
                  <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "8px", fontFamily: F, fontSize: "12px" }} formatter={v => fmt(v)} /></PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "4px" }}>
                {piD.map(p => (<div key={p.name} style={{ display: "flex", alignItems: "center", gap: "6px" }}><Dot color={p.color} size={6} /><span style={{ fontFamily: F, fontSize: "11px", color: C.textMuted }}>{p.name}</span><span style={{ fontFamily: F, fontSize: "11px", fontWeight: 700, color: C.text }}>{tot.spend > 0 ? ((p.value / tot.spend) * 100).toFixed(0) : 0}%</span></div>))}
              </div>
            </div>
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontFamily: F, fontSize: "11px", color: C.textDim, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>Clics y conversiones diarias</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="fecha" tick={{ fill: C.textDim, fontSize: 10, fontFamily: F }} tickFormatter={v => v.slice(5)} />
                <YAxis yAxisId="l" tick={{ fill: C.textDim, fontSize: 10, fontFamily: F }} />
                <YAxis yAxisId="r" orientation="right" tick={{ fill: C.textDim, fontSize: 10, fontFamily: F }} />
                <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "8px", fontFamily: F, fontSize: "12px" }} />
                <Line yAxisId="l" type="monotone" dataKey="clics" stroke={C.google} strokeWidth={2} dot={false} name="Clics" />
                <Line yAxisId="r" type="monotone" dataKey="conv" stroke={C.accent} strokeWidth={2} dot={false} name="Conversiones" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>)}

        {/* CAMPAIGNS */}
        {!loading && data.length > 0 && view === "campaigns" && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontFamily: F, fontSize: "11px", color: C.textDim, letterSpacing: "1px", textTransform: "uppercase" }}>Detalle por campaña ({camps.length})</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: F, fontSize: "12px" }}>
                <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["Plataforma", "Campaña", "Estado", "Inversión", "Clics", "Impr.", "CTR", "CPC", "Conv.", "ROAS"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: C.textDim, fontWeight: 600, fontSize: "10px", letterSpacing: "0.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{camps.map((c, i) => {
                  const ctr = c.imps > 0 ? (c.clics / c.imps) * 100 : 0, cpc = c.clics > 0 ? c.coste / c.clics : 0, roas = c.coste > 0 ? c.val / c.coste : 0;
                  const pc = c.plataforma === "Google Ads" ? C.google : C.meta;
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "10px 14px" }}><div style={{ display: "flex", alignItems: "center", gap: "6px" }}><Dot color={pc} size={6} /><span style={{ color: pc, fontWeight: 600 }}>{c.plataforma === "Google Ads" ? "Google" : "Meta"}</span></div></td>
                      <td style={{ padding: "10px 14px", color: C.text, fontWeight: 500, maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.campaña}</td>
                      <td style={{ padding: "10px 14px" }}><Pill color={c.estado === "ACTIVE" || c.estado === "ENABLED" ? C.accent : C.textDim}>{c.estado === "ACTIVE" || c.estado === "ENABLED" ? "Activa" : "Pausa"}</Pill></td>
                      <td style={{ padding: "10px 14px", color: C.text, fontWeight: 600 }}>{fmt(c.coste)}</td>
                      <td style={{ padding: "10px 14px", color: C.textMuted }}>{fN(c.clics)}</td>
                      <td style={{ padding: "10px 14px", color: C.textMuted }}>{fN(c.imps)}</td>
                      <td style={{ padding: "10px 14px", color: C.textMuted }}>{fP(ctr)}</td>
                      <td style={{ padding: "10px 14px", color: C.textMuted }}>{fmt(cpc)}</td>
                      <td style={{ padding: "10px 14px", color: C.accent, fontWeight: 600 }}>{fN(c.convs)}</td>
                      <td style={{ padding: "10px 14px" }}><span style={{ color: roas >= 1 ? C.accent : C.danger, fontWeight: 700 }}>{roas.toFixed(2)}x</span></td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* BUDGET */}
        {!loading && data.length > 0 && view === "budget" && (<>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            {[{ k: "google", l: "Google Ads", c: C.google, a: gA }, { k: "meta", l: "Meta Ads", c: C.meta, a: mA }].map(({ k, l, c, a }) => (
              <div key={k} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><Dot color={c} size={10} /><span style={{ fontFamily: FD, fontSize: "18px", fontWeight: 700 }}>{l}</span></div>
                  <button onClick={() => { setEditBudget(k); setBudgetVal(budgets[k].toString()); }} style={btn(c)}>Editar presupuesto</button>
                </div>
                <BudgetGauge label={l} budget={budgets[k]} spent={a.spend} color={c} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "16px" }}>
                  <div><div style={{ fontFamily: F, fontSize: "10px", color: C.textDim }}>CLICS</div><div style={{ fontFamily: F, fontSize: "18px", fontWeight: 700 }}>{fN(a.clicks)}</div></div>
                  <div><div style={{ fontFamily: F, fontSize: "10px", color: C.textDim }}>CONV.</div><div style={{ fontFamily: F, fontSize: "18px", fontWeight: 700, color: C.accent }}>{fN(a.convs)}</div></div>
                  <div><div style={{ fontFamily: F, fontSize: "10px", color: C.textDim }}>ROAS</div><div style={{ fontFamily: F, fontSize: "18px", fontWeight: 700, color: C.purple }}>{a.spend > 0 ? (a.convVal / a.spend).toFixed(2) : 0}x</div></div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "24px" }}>
            <div style={{ fontFamily: F, fontSize: "11px", color: C.textDim, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>Resumen presupuestario total</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
              <div><div style={{ fontFamily: F, fontSize: "10px", color: C.textDim }}>PRESUPUESTO TOTAL</div><div style={{ fontFamily: F, fontSize: "24px", fontWeight: 700 }}>{fmt(tB)}</div></div>
              <div><div style={{ fontFamily: F, fontSize: "10px", color: C.textDim }}>INVERTIDO TOTAL</div><div style={{ fontFamily: F, fontSize: "24px", fontWeight: 700, color: C.warning }}>{fmt(tot.spend)}</div></div>
              <div><div style={{ fontFamily: F, fontSize: "10px", color: C.textDim }}>RESTANTE</div><div style={{ fontFamily: F, fontSize: "24px", fontWeight: 700, color: tB - tot.spend >= 0 ? C.accent : C.danger }}>{fmt(tB - tot.spend)}</div></div>
              <div><div style={{ fontFamily: F, fontSize: "10px", color: C.textDim }}>% CONSUMIDO</div><div style={{ fontFamily: F, fontSize: "24px", fontWeight: 700 }}>{tB > 0 ? ((tot.spend / tB) * 100).toFixed(1) : 0}%</div></div>
            </div>
          </div>
        </>)}

        {/* Empty */}
        {!loading && data.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
            <div style={{ fontFamily: FD, fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>Sin datos todavía</div>
            <div style={{ fontFamily: F, fontSize: "13px", color: C.textMuted, maxWidth: "400px", margin: "0 auto" }}>
              Los datos llegarán automáticamente cuando se ejecuten los flujos de n8n (Meta Ads) y el script de Google Ads.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

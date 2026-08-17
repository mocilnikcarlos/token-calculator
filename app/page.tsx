"use client";
import { useMemo, useState } from "react";

const MODELS = {
  efficient: { label: "Eficiente", hint: "Clasificación, extracción y respuestas simples", input: 0.4, output: 1.6 },
  balanced: { label: "Equilibrado", hint: "Asistentes, soporte y análisis general", input: 2.5, output: 10 },
  advanced: { label: "Avanzado", hint: "Razonamiento complejo y tareas críticas", input: 15, output: 60 },
};
const USE_CASES = {
  support: { label: "Atención al cliente", input: 1200, output: 450, calls: 2 },
  documents: { label: "Procesamiento de documentos", input: 4500, output: 700, calls: 1 },
  assistant: { label: "Asistente interno", input: 1800, output: 700, calls: 3 },
  custom: { label: "Caso personalizado", input: 1000, output: 400, calls: 1 },
};
type ModelKey = keyof typeof MODELS;
type UseCaseKey = keyof typeof USE_CASES;
const money = (value:number) => new Intl.NumberFormat("es-AR",{style:"currency",currency:"USD",maximumFractionDigits:value<100?2:0}).format(value);
const compact = (value:number) => new Intl.NumberFormat("es-AR",{notation:"compact",maximumFractionDigits:1}).format(value);

export default function Home() {
  const [operations,setOperations]=useState(40000);
  const [useCase,setUseCase]=useState<UseCaseKey>("support");
  const [model,setModel]=useState<ModelKey>("balanced");
  const [calls,setCalls]=useState(USE_CASES.support.calls);
  const [inputTokens,setInputTokens]=useState(USE_CASES.support.input);
  const [outputTokens,setOutputTokens]=useState(USE_CASES.support.output);
  const [growth,setGrowth]=useState(10);
  const [cache,setCache]=useState(20);
  const selectUseCase=(key:UseCaseKey)=>{setUseCase(key);setCalls(USE_CASES[key].calls);setInputTokens(USE_CASES[key].input);setOutputTokens(USE_CASES[key].output);};
  const result=useMemo(()=>{
    const selected=MODELS[model], billableInput=inputTokens*(1-cache/100);
    const probable=(operations*calls*billableInput*selected.input+operations*calls*outputTokens*selected.output)/1_000_000;
    return {probable,low:probable*.75,high:probable*1.35,annual:probable*12*(1+growth/200),perOperation:operations?probable/operations:0,tokens:operations*calls*(billableInput+outputTokens)};
  },[operations,calls,inputTokens,outputTokens,growth,cache,model]);

  return <main>
    <header className="topbar">
      <a className="brand" href="#top"><span className="brand-mark">A</span><span>AI Budget</span></a>
      <a className="github-link" href="https://github.com/mocilnikcarlos/token-calculator" target="_blank" rel="noreferrer">Código abierto <span>↗</span></a>
    </header>
    <section className="hero" id="top">
      <div className="eyebrow"><span/> Presupuesto empresarial de IA</div>
      <h1>¿Cuánto te costaría<br/><em>operar con IA?</em></h1>
      <p>Convertí el volumen de tu negocio en un presupuesto mensual claro. Sin planillas, sin registro y sin hablar en tokens.</p>
    </section>
    <section className="calculator" aria-label="Calculadora de presupuesto">
      <div className="form-panel">
        <div className="section-heading"><span className="step">01</span><div><h2>Tu operación</h2><p>Contanos qué querés automatizar.</p></div></div>
        <label className="field-label" htmlFor="use-case">Caso de uso</label>
        <select id="use-case" value={useCase} onChange={e=>selectUseCase(e.target.value as UseCaseKey)}>
          {Object.entries(USE_CASES).map(([key,item])=><option key={key} value={key}>{item.label}</option>)}
        </select>
        <div className="field-row">
          <label><span className="field-label">Operaciones por mes</span><input type="number" min="0" value={operations} onChange={e=>setOperations(Number(e.target.value))}/></label>
          <label><span className="field-label">Llamadas por operación</span><input type="number" min="1" value={calls} onChange={e=>setCalls(Number(e.target.value))}/></label>
        </div>
        <div className="divider"/>
        <div className="section-heading compact-heading"><span className="step">02</span><div><h2>Nivel de inteligencia</h2><p>Elegí según la complejidad del trabajo.</p></div></div>
        <div className="model-grid">
          {(Object.entries(MODELS) as [ModelKey,typeof MODELS[ModelKey]][]).map(([key,item])=>
            <button key={key} className={model===key?"model-card selected":"model-card"} onClick={()=>setModel(key)} type="button">
              <span className="radio"/><strong>{item.label}</strong><small>{item.hint}</small>
            </button>)}
        </div>
        <details>
          <summary>Ajustar supuestos avanzados <span>＋</span></summary>
          <div className="advanced-grid">
            <label><span className="field-label">Tokens de entrada</span><input type="number" min="0" value={inputTokens} onChange={e=>setInputTokens(Number(e.target.value))}/></label>
            <label><span className="field-label">Tokens de salida</span><input type="number" min="0" value={outputTokens} onChange={e=>setOutputTokens(Number(e.target.value))}/></label>
            <label><span className="field-label">Caché estimado (%)</span><input type="number" min="0" max="100" value={cache} onChange={e=>setCache(Number(e.target.value))}/></label>
            <label><span className="field-label">Crecimiento anual (%)</span><input type="number" min="0" value={growth} onChange={e=>setGrowth(Number(e.target.value))}/></label>
          </div>
        </details>
      </div>
      <aside className="result-panel" aria-live="polite">
        <div className="result-topline"><span>Estimación mensual</span><span className="live-dot">Actualizada</span></div>
        <div className="price">{money(result.probable)}<small>/ mes</small></div>
        <p className="range">Rango estimado: {money(result.low)} — {money(result.high)}</p>
        <div className="scenario-chart">
          <div><span>Conservador</span><i style={{width:"55%"}}/><b>{money(result.low)}</b></div>
          <div className="active"><span>Probable</span><i style={{width:"74%"}}/><b>{money(result.probable)}</b></div>
          <div><span>Exigente</span><i style={{width:"100%"}}/><b>{money(result.high)}</b></div>
        </div>
        <div className="metrics">
          <div><span>Costo por operación</span><strong>{money(result.perOperation)}</strong></div>
          <div><span>Tokens procesados</span><strong>{compact(result.tokens)}</strong></div>
          <div><span>Proyección anual</span><strong>{money(result.annual)}</strong></div>
        </div>
        <div className="recommendation"><span>◎</span><p><strong>Presupuesto sugerido</strong>Reservá {money(result.high)} por mes para absorber picos de uso sin sorpresas.</p></div>
        <p className="disclaimer">Estimación orientativa basada en precios de referencia configurables. No incluye infraestructura, desarrollo ni impuestos.</p>
      </aside>
    </section>
    <section className="trust-row">
      <div><span>✓</span><p><strong>Sin registro</strong>Calculá sin entregar tus datos.</p></div>
      <div><span>⌁</span><p><strong>Supuestos transparentes</strong>Cada número se puede revisar.</p></div>
      <div><span>↻</span><p><strong>Abierto y gratuito</strong>Usalo, compartilo, mejoralo.</p></div>
    </section>
    <footer><span>AI Budget Calculator</span><p>Una herramienta abierta para presupuestar el futuro.</p><span>2026</span></footer>
  </main>;
}

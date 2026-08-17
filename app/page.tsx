"use client"

import { useMemo, useState } from "react"
import { Calculator, GithubLogo, ArrowSquareOut, CurrencyDollar, Info, ArrowCounterClockwise, SlidersHorizontal } from "@phosphor-icons/react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const MODELS = {
  efficient: { label: "Eficiente", hint: "Clasificación, extracción y respuestas simples", input: 0.4, output: 1.6 },
  balanced: { label: "Equilibrado", hint: "Asistentes, soporte y análisis general", input: 2.5, output: 10 },
  advanced: { label: "Avanzado", hint: "Razonamiento complejo y tareas críticas", input: 15, output: 60 },
}
const USE_CASES = {
  support: { label: "Atención al cliente", input: 1200, output: 450, calls: 2 },
  documents: { label: "Procesamiento de documentos", input: 4500, output: 700, calls: 1 },
  assistant: { label: "Asistente interno", input: 1800, output: 700, calls: 3 },
  custom: { label: "Caso personalizado", input: 1000, output: 400, calls: 1 },
}
type ModelKey = keyof typeof MODELS
type UseCaseKey = keyof typeof USE_CASES

const money = (value: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD", maximumFractionDigits: value < 100 ? 2 : 0 }).format(value)
const compact = (value: number) => new Intl.NumberFormat("es-AR", { notation: "compact", maximumFractionDigits: 1 }).format(value)

export default function Home() {
  const [operations, setOperations] = useState(40000)
  const [useCase, setUseCase] = useState<UseCaseKey>("support")
  const [model, setModel] = useState<ModelKey>("balanced")
  const [calls, setCalls] = useState(2)
  const [inputTokens, setInputTokens] = useState(1200)
  const [outputTokens, setOutputTokens] = useState(450)
  const [growth, setGrowth] = useState(10)
  const [cache, setCache] = useState(20)

  const selectUseCase = (key: UseCaseKey) => {
    setUseCase(key)
    setCalls(USE_CASES[key].calls)
    setInputTokens(USE_CASES[key].input)
    setOutputTokens(USE_CASES[key].output)
  }
  const reset = () => {
    setOperations(40000); setUseCase("support"); setModel("balanced"); setCalls(2)
    setInputTokens(1200); setOutputTokens(450); setGrowth(10); setCache(20)
  }
  const result = useMemo(() => {
    const selected = MODELS[model]
    const billableInput = inputTokens * (1 - cache / 100)
    const probable = (operations * calls * billableInput * selected.input + operations * calls * outputTokens * selected.output) / 1_000_000
    return { probable, low: probable * .75, high: probable * 1.35, annual: probable * 12 * (1 + growth / 200), perOperation: operations ? probable / operations : 0, tokens: operations * calls * (billableInput + outputTokens) }
  }, [operations, calls, inputTokens, outputTokens, growth, cache, model])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex min-h-20 max-w-[1440px] items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <span className="grid size-11 place-items-center rounded-lg bg-primary text-primary-foreground"><Calculator size={24} weight="bold"/></span>
            <div>
              <p className="text-lg font-semibold tracking-tight">AI Budget Calculator</p>
              <p className="text-base text-muted-foreground">Costos de IA para operaciones empresariales</p>
            </div>
          </div>
          <Button variant="ghost" asChild>
            <a href="https://github.com/mocilnikcarlos/token-calculator" target="_blank" rel="noreferrer">
              <GithubLogo size={21} weight="bold"/> Ver en GitHub <ArrowSquareOut size={18}/>
            </a>
          </Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1440px] lg:grid-cols-[minmax(0,1.65fr)_minmax(420px,1fr)]">
        <div className="px-6 py-10 lg:px-8 xl:px-10">
          <section aria-labelledby="operation-title">
            <div className="mb-8 flex items-start gap-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-base font-semibold text-primary-foreground">1</span>
              <div><h1 id="operation-title" className="text-2xl font-semibold tracking-tight">Tu operación</h1><p className="mt-1 text-base text-muted-foreground">Contanos qué querés automatizar.</p></div>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="use-case">Caso de uso</Label>
                <Select value={useCase} onValueChange={value => selectUseCase(value as UseCaseKey)}>
                  <SelectTrigger id="use-case"><SelectValue/></SelectTrigger>
                  <SelectContent>{Object.entries(USE_CASES).map(([key,item])=><SelectItem key={key} value={key}>{item.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="operations">Operaciones por mes</Label>
                  <Input id="operations" type="number" min={0} value={operations} onChange={e=>setOperations(Number(e.target.value))}/>
                  <p className="text-base text-muted-foreground">Cantidad total de tareas o solicitudes.</p>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="calls">Llamadas por operación</Label>
                  <Input id="calls" type="number" min={1} value={calls} onChange={e=>setCalls(Number(e.target.value))}/>
                  <p className="text-base text-muted-foreground">Interacciones con el modelo por operación.</p>
                </div>
              </div>
            </div>
          </section>

          <Separator className="my-10"/>

          <section aria-labelledby="model-title">
            <div className="mb-7 flex items-start gap-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-base font-semibold text-primary-foreground">2</span>
              <div><h2 id="model-title" className="text-2xl font-semibold tracking-tight">Nivel de inteligencia</h2><p className="mt-1 text-base text-muted-foreground">Elegí según la complejidad del trabajo.</p></div>
            </div>
            <RadioGroup value={model} onValueChange={value=>setModel(value as ModelKey)} className="grid gap-4 md:grid-cols-3">
              {(Object.entries(MODELS) as [ModelKey,typeof MODELS[ModelKey]][]).map(([key,item])=>(
                <Label key={key} htmlFor={key} className="block cursor-pointer">
                  <div className="h-full min-h-44 rounded-lg border border-border p-5 transition hover:border-primary/60 data-[selected=true]:border-primary data-[selected=true]:bg-primary/[.03] data-[selected=true]:ring-1 data-[selected=true]:ring-primary" data-selected={model===key}>
                    <RadioGroupItem id={key} value={key}/>
                    <p className="mt-5 text-base font-semibold">{item.label}</p>
                    <p className="mt-2 text-base font-normal leading-6 text-muted-foreground">{item.hint}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </section>

          <Accordion type="single" collapsible defaultValue="advanced" className="mt-8">
            <AccordionItem value="advanced">
              <AccordionTrigger><span className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-md bg-muted text-primary"><SlidersHorizontal size={21}/></span><span><span className="block font-semibold">Ajustes avanzados</span><span className="block font-normal text-muted-foreground">Personalizá supuestos técnicos y de crecimiento.</span></span></span></AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3"><Label htmlFor="input-tokens">Tokens de entrada</Label><Input id="input-tokens" type="number" min={0} value={inputTokens} onChange={e=>setInputTokens(Number(e.target.value))}/></div>
                  <div className="space-y-3"><Label htmlFor="output-tokens">Tokens de salida</Label><Input id="output-tokens" type="number" min={0} value={outputTokens} onChange={e=>setOutputTokens(Number(e.target.value))}/></div>
                  <div className="space-y-3"><Label htmlFor="cache">Caché estimado (%)</Label><Input id="cache" type="number" min={0} max={100} value={cache} onChange={e=>setCache(Number(e.target.value))}/></div>
                  <div className="space-y-3"><Label htmlFor="growth">Crecimiento anual (%)</Label><Input id="growth" type="number" min={0} value={growth} onChange={e=>setGrowth(Number(e.target.value))}/></div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="flex items-center gap-2 text-base text-muted-foreground"><Info size={20}/> Los valores son estimaciones orientativas.</p>
            <Button variant="outline" onClick={reset}><ArrowCounterClockwise size={20}/> Restablecer</Button>
          </div>
        </div>

        <aside className="border-t border-border bg-muted/35 px-6 py-10 lg:sticky lg:top-0 lg:min-h-[calc(100vh-81px)] lg:border-s lg:border-t-0 lg:px-8 xl:px-10" aria-live="polite">
          <div className="mx-auto max-w-xl">
            <p className="text-lg font-semibold">Estimación mensual</p>
            <div className="mt-5 flex items-end gap-2"><strong className="text-5xl font-semibold tracking-tight lg:text-6xl">{money(result.probable)}</strong><span className="pb-2 text-base text-muted-foreground">/ mes</span></div>
            <p className="mt-4 text-base text-muted-foreground">Rango estimado: {money(result.low)} — {money(result.high)}</p>
            <Separator className="my-9"/>
            <h2 className="text-lg font-semibold">Comparación de escenarios</h2>
            <div className="mt-6 space-y-5">
              {[["Conservador",result.low,"45%"],["Probable",result.probable,"70%"],["Exigente",result.high,"100%"]].map(([label,value,width])=>(
                <div key={String(label)} className="grid grid-cols-[110px_1fr_92px] items-center gap-4 text-base">
                  <span className={label==="Probable"?"font-semibold":"text-muted-foreground"}>{label}</span>
                  <span className="h-1.5 rounded-full bg-border"><span className={label==="Probable"?"block h-full rounded-full bg-primary":"block h-full rounded-full bg-muted-foreground/40"} style={{width:String(width)}}/></span>
                  <strong className="text-right font-semibold">{money(Number(value))}</strong>
                </div>
              ))}
            </div>
            <Separator className="my-9"/>
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="pe-4"><p className="min-h-12 text-base text-muted-foreground">Costo por operación</p><strong className="mt-3 block text-xl font-semibold">{money(result.perOperation)}</strong></div>
              <div className="px-4"><p className="min-h-12 text-base text-muted-foreground">Tokens procesados</p><strong className="mt-3 block text-xl font-semibold">{compact(result.tokens)}</strong></div>
              <div className="ps-4"><p className="min-h-12 text-base text-muted-foreground">Proyección anual</p><strong className="mt-3 block text-xl font-semibold">{money(result.annual)}</strong></div>
            </div>
            <div className="mt-10 flex gap-4 rounded-lg border border-primary/30 bg-primary/[.04] p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><CurrencyDollar size={24} weight="bold"/></span>
              <div><p className="text-base font-semibold">Presupuesto sugerido</p><p className="mt-1 text-base leading-6 text-muted-foreground">Reservá {money(result.high)} por mes para absorber picos de uso sin sorpresas.</p></div>
            </div>
            <p className="mt-9 flex gap-2 text-base leading-6 text-muted-foreground"><Info className="mt-0.5 shrink-0" size={20}/>No incluye infraestructura, desarrollo ni impuestos. Revisá los supuestos antes de presentar un presupuesto.</p>
          </div>
        </aside>
      </section>
    </main>
  )
}

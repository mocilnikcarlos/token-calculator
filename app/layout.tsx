import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"AI Budget Calculator",description:"Estimá el presupuesto mensual de IA de tu empresa a partir de operaciones reales.",other:{"codex-preview":"development"},icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="es"><body>{children}</body></html>;}

"use client";

import { useRef, useState } from "react";
import type { DayPoint } from "@/lib/timeseries";

// Paleta validada (scripts/validate_palette.js, surface #ffffff):
// cliques #eda100 (âmbar), leads #1baf7a (verde da marca) — worst adjacent CVD ΔE 47.
// Ambos ficam abaixo de 3:1 no branco, então as séries têm rótulo direto além da legenda.
const SERIES = {
  clicks: { name: "Cliques", color: "#eda100" },
  leads: { name: "Leads", color: "#1baf7a" },
} as const;

const W = 640;
const H = 220;
const PAD = { top: 16, right: 90, bottom: 28, left: 34 };

export function PerformanceChart({ data }: { data: DayPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxValue = Math.max(1, ...data.map((d) => Math.max(d.clicks, d.leads)));
  // topo "redondo" para os gridlines
  const yMax = Math.max(4, Math.ceil(maxValue / 4) * 4);

  const x = (i: number) => PAD.left + (data.length <= 1 ? 0 : (i / (data.length - 1)) * innerW);
  const y = (v: number) => PAD.top + innerH - (v / yMax) * innerH;

  const linePath = (key: "clicks" | "leads") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join("");

  const gridValues = [yMax / 4, yMax / 2, (3 * yMax) / 4, yMax];
  const tickEvery = Math.max(1, Math.floor(data.length / 5));

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const ratio = Math.min(1, Math.max(0, (px - PAD.left) / innerW));
    setHover(Math.round(ratio * (data.length - 1)));
  }

  const h = hover !== null ? data[hover] : null;
  const total = { clicks: data.reduce((s, d) => s + d.clicks, 0), leads: data.reduce((s, d) => s + d.leads, 0) };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-[#0a3625]">Últimos 30 dias</h2>
        <div className="flex gap-4 text-xs text-[#4d584d]">
          {(Object.keys(SERIES) as ("clicks" | "leads")[]).map((key) => (
            <span key={key} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: SERIES[key].color }} />
              {SERIES[key].name} ({total[key]})
            </span>
          ))}
        </div>
      </div>

      <div className="relative mt-3">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          onMouseMove={handleMove}
          onMouseLeave={() => setHover(null)}
          role="img"
          aria-label={`Gráfico de linhas: cliques e leads por dia nos últimos ${data.length} dias`}
        >
          {/* grid recessivo + eixo y */}
          {gridValues.map((v) => (
            <g key={v}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} stroke="#00000012" strokeWidth={1} />
              <text
                x={PAD.left - 8}
                y={y(v) + 3.5}
                textAnchor="end"
                fontSize={10}
                fill="#7a8578"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {v}
              </text>
            </g>
          ))}
          <line x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} stroke="#dde0cb" strokeWidth={1} />

          {/* eixo x: ~5 marcações */}
          {data.map((d, i) =>
            i % tickEvery === 0 ? (
              <text
                key={d.iso}
                x={x(i)}
                y={H - 8}
                textAnchor="middle"
                fontSize={10}
                fill="#7a8578"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {d.label}
              </text>
            ) : null
          )}

          {/* linhas das séries */}
          <path d={linePath("clicks")} fill="none" stroke={SERIES.clicks.color} strokeWidth={2} strokeLinejoin="round" />
          <path d={linePath("leads")} fill="none" stroke={SERIES.leads.color} strokeWidth={2} strokeLinejoin="round" />

          {/* rótulos diretos no fim das linhas */}
          <text
            x={W - PAD.right + 8}
            y={y(data[data.length - 1].clicks) + 3.5}
            fontSize={11}
            fontWeight={600}
            fill="#0a3625"
          >
            {SERIES.clicks.name}
          </text>
          <text
            x={W - PAD.right + 8}
            y={y(data[data.length - 1].leads) + (Math.abs(y(data[data.length - 1].leads) - y(data[data.length - 1].clicks)) < 14 ? 17.5 : 3.5)}
            fontSize={11}
            fontWeight={600}
            fill="#0a3625"
          >
            {SERIES.leads.name}
          </text>

          {/* hover: guia vertical + marcadores com anel */}
          {h && hover !== null && (
            <g pointerEvents="none">
              <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + innerH} stroke="#00000022" strokeWidth={1} />
              <circle cx={x(hover)} cy={y(h.clicks)} r={4.5} fill={SERIES.clicks.color} stroke="#ffffff" strokeWidth={2} />
              <circle cx={x(hover)} cy={y(h.leads)} r={4.5} fill={SERIES.leads.color} stroke="#ffffff" strokeWidth={2} />
            </g>
          )}
        </svg>

        {h && hover !== null && (
          <div
            className="pointer-events-none absolute top-1 z-10 rounded-xl bg-[#0a3625] px-3 py-2 text-xs text-white shadow-lg"
            style={{
              left: `${(x(hover) / W) * 100}%`,
              transform: `translateX(${hover > data.length / 2 ? "calc(-100% - 10px)" : "10px"})`,
            }}
          >
            <p className="font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>
              {h.label}
            </p>
            <p className="mt-1 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: SERIES.clicks.color }} />
              Cliques: <strong>{h.clicks}</strong>
            </p>
            <p className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: SERIES.leads.color }} />
              Leads: <strong>{h.leads}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

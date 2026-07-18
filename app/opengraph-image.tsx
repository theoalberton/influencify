import { ImageResponse } from "next/og";

export const alt = "Influencify — Marketing de influência com atribuição de verdade";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a3625",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ccda47",
              borderRadius: 16,
              color: "#0a3625",
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            i
          </div>
          <div style={{ color: "#ffffff", fontSize: 40, fontWeight: 700 }}>Influencify</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ color: "#ffffff", fontSize: 72, fontWeight: 700, lineHeight: 1.05, display: "flex", flexWrap: "wrap" }}>
            A influência sem prova é
          </div>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: "#ccda47",
              color: "#0a3625",
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
              padding: "4px 24px",
              borderRadius: 16,
              transform: "rotate(-1deg)",
            }}
          >
            dinheiro no escuro.
          </div>
        </div>

        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 30 }}>
          Leads com nome e contato, rastreados até o influenciador que trouxe.
        </div>
      </div>
    ),
    { ...size }
  );
}

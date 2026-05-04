function getBarColor(pct) {
  if (pct >= 80) return "#4caf50";
  if (pct >= 60) return "#ff9800";
  if (pct >= 40) return "#f44336";
  return "#ffeb3b";
}

const CHART_H = 180;

function BarChart({ ejercicios }) {
  const [tooltipIdx, setTooltipIdx] = useState(null);

  return (
    <div className="vad-chart-wrap">
      <div className="vad-yaxis">
        <span>100%</span>
        <span>50%</span>
        <span>0%</span>
      </div>

      <div className="vad-bars-area" style={{ height: CHART_H }}>
        <div className="vad-grid-line" style={{ top: 0 }} />
        <div className="vad-grid-line" style={{ top: "50%" }} />
        <div className="vad-grid-line" style={{ top: "100%" }} />

        <div className="vad-bars">
          {ejercicios.map((ej, i) => {
            const barH = Math.round((ej.pct / 100) * CHART_H);
            return (
              <div
                key={i}
                className="vad-bar-col"
                onMouseEnter={() => setTooltipIdx(i)}
                onMouseLeave={() => setTooltipIdx(null)}
              >
                <div className="vad-bar-wrapper" style={{ height: barH }}>
                  {tooltipIdx === i && (
                    <div className="vad-tooltip">
                      <strong>{ej.pct}%</strong> · {ej.correctas}/{ej.total}
                    </div>
                  )}
                  <div
                    className="vad-bar"
                    style={{ background: getBarColor(ej.pct) }}
                  />
                </div>
                <span className="vad-bar-label">{ej.nombre}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default BarChart;

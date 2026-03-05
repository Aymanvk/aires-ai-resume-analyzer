/**
 * MetricCard — glass stat card with gradient glow, icon, value and label.
 * Props: icon (emoji/string), value, label, sub, glowColor, iconBg, trend
 */
function MetricCard({ icon, value, label, sub, glowColor = 'rgba(99,102,241,0.5)', iconBg, trend, trendLabel }) {
    return (
        <div className="metric-card">
            {/* Ambient glow blob */}
            <div
                className="metric-card-glow"
                style={{ background: glowColor }}
            />

            <div className="metric-card-top">
                <div
                    className="metric-card-icon"
                    style={{ background: iconBg || 'linear-gradient(135deg,rgba(99,102,241,0.25),rgba(139,92,246,0.18))', border: '1px solid rgba(129,140,248,0.2)' }}
                >
                    {icon}
                </div>
                {trend != null && (
                    <span className={`metric-card-trend ${trend >= 0 ? 'trend-up' : 'trend-neutral'}`}>
                        {trend >= 0 ? '↑' : '→'} {trendLabel || (trend >= 0 ? `+${trend}` : trend)}
                    </span>
                )}
            </div>

            <div>
                <div className="metric-card-value">{value ?? '—'}</div>
                <div className="metric-card-label">{label}</div>
                {sub && <div className="metric-card-sub">{sub}</div>}
            </div>
        </div>
    );
}

export default MetricCard;

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from './constants.tsx';

const SEVERITY_COLORS = {
  high: '#dc2626',
  medium: '#f59e0b',
  low: '#3b82f6',
  positive: '#16a34a',
  info: '#6b7280',
};

const safeNum = (v) =>
  v !== null && v !== undefined ? Number(v).toFixed(2) : 'N/A';

const METRIC_TOOLTIPS = {
  sharpe_ratio:
    'Return earned per unit of total risk. Above 1 is good, above 2 is excellent. Negative means underperforming a risk-free asset.',
  sortino_ratio:
    'Like Sharpe, but only penalises downside volatility. Better reflects risk for investors who don\'t mind upside swings.',
  volatility_pct:
    'Annualised standard deviation of returns. Higher means wider swings — both up and down.',
  max_drawdown:
    'Largest peak-to-trough drop in portfolio value. Shows the worst-case loss experienced in the period.',
  beta:
    'Sensitivity to market moves vs the benchmark. Beta > 1 means more volatile than the market; < 1 means more stable.',
  alpha_pct:
    'Excess return above what Beta predicts (Jensen\'s Alpha). Positive alpha means genuine outperformance after adjusting for risk taken.',
  calmar_ratio:
    'Annualised return divided by max drawdown. Higher is better — rewards strong returns achieved without deep losses.',
  treynor_ratio:
    'Return earned per unit of market risk (Beta). Like Sharpe but uses systematic risk only — useful for diversified portfolios.',
};

function MetricItem({ label, value, tooltipKey }) {
  return (
    <div className="metrics__item">
      <span className="metrics__label">
        {label}
        {METRIC_TOOLTIPS[tooltipKey] && (
          <span className="metric-tooltip">
            <span className="metric-tooltip__icon">?</span>
            <span className="metric-tooltip__box">{METRIC_TOOLTIPS[tooltipKey]}</span>
          </span>
        )}
      </span>
      <span className="metrics__value">{value}</span>
    </div>
  );
}

function capitalizeLabel(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function AnalyticsPanel({ selectedPeriod }) {
  const [healthScore, setHealthScore] = useState(null);
  const [riskMetrics, setRiskMetrics] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    const riskParams = new URLSearchParams({ step: 7 });
    if (selectedPeriod) riskParams.set('default_interval', selectedPeriod);

    const healthParams = new URLSearchParams();
    if (selectedPeriod) healthParams.set('period', selectedPeriod);

    Promise.all([
      fetch(`${API_BASE_URL}/health_score?` + healthParams).then((r) => {
        if (!r.ok) throw new Error(`health_score: ${r.status}`);
        return r.json();
      }),
      fetch(`${API_BASE_URL}/risk_metrics?` + riskParams).then((r) => {
        if (!r.ok) throw new Error(`risk_metrics: ${r.status}`);
        return r.json();
      }),
      fetch(`${API_BASE_URL}/insights`).then((r) => {
        if (!r.ok) throw new Error(`insights: ${r.status}`);
        return r.json();
      }),
    ])
      .then(([health, risk, insightsData]) => {
        if (cancelled) return;
        setHealthScore(health);
        setRiskMetrics(risk);
        setInsights(insightsData.insights);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Analytics fetch error:', err);
        setError('Failed to load analytics data');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedPeriod]);

  if (loading) {
    return <p className="analytics-loading">Computing analytics...</p>;
  }

  if (error) {
    return <div className="error-banner">{error}</div>;
  }

  const componentEntries = healthScore?.components
    ? Object.entries(healthScore.components)
    : [];

  const drawdown = riskMetrics?.max_drawdown;

  return (
    <div className="analytics">
      {/* Health Score */}
      <div>
        <p className="analytics__subtitle">Portfolio Health</p>
        <div className="health-score">
          <div className={`health-grade health-grade--${healthScore?.grade?.toLowerCase()}`}>
            {healthScore?.grade}
          </div>

          <div className="health-score__detail">
            <p className="health-score__score">{healthScore?.total_score} / 100</p>
            <p className="health-score__summary">{healthScore?.summary}</p>
          </div>

          <div className="health-score__components">
            {componentEntries.map(([key, { score, max }]) => (
              <div key={key} className="health-score__component">
                <span className="health-score__component-label">
                  {capitalizeLabel(key)}
                </span>
                <div className="health-bar-bg">
                  <div
                    className="health-bar"
                    style={{ width: `${max > 0 ? (score / max) * 100 : 0}%` }}
                  />
                </div>
                <span className="health-score__component-score">
                  {score} / {max}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Metrics */}
      <div>
        <p className="analytics__subtitle">
          Risk Metrics
          {riskMetrics?.benchmark && (
            <span className="analytics__subnote">vs {riskMetrics.benchmark}</span>
          )}
        </p>
        <div className="metrics__grid">
          <MetricItem label="Sharpe Ratio" tooltipKey="sharpe_ratio" value={safeNum(riskMetrics?.sharpe_ratio)} />
          <MetricItem label="Sortino Ratio" tooltipKey="sortino_ratio" value={safeNum(riskMetrics?.sortino_ratio)} />
          <MetricItem
            label="Volatility"
            tooltipKey="volatility_pct"
            value={riskMetrics?.volatility_pct != null ? `${safeNum(riskMetrics.volatility_pct)}%` : 'N/A'}
          />
          <MetricItem
            label="Max Drawdown"
            tooltipKey="max_drawdown"
            value={drawdown?.max_drawdown_pct != null ? `${safeNum(drawdown.max_drawdown_pct)}%` : 'N/A'}
          />
          <MetricItem label="Beta" tooltipKey="beta" value={safeNum(riskMetrics?.beta)} />
          <MetricItem
            label="Alpha"
            tooltipKey="alpha_pct"
            value={riskMetrics?.alpha_pct != null ? `${safeNum(riskMetrics.alpha_pct)}%` : 'N/A'}
          />
          <MetricItem label="Calmar Ratio" tooltipKey="calmar_ratio" value={safeNum(riskMetrics?.calmar_ratio)} />
          <MetricItem label="Treynor Ratio" tooltipKey="treynor_ratio" value={safeNum(riskMetrics?.treynor_ratio)} />
        </div>
        {drawdown?.peak_date && drawdown?.trough_date && (
          <p className="analytics__drawdown-note">
            Max drawdown: {drawdown.peak_date} &rarr; {drawdown.trough_date}
          </p>
        )}
      </div>

      {/* Insights */}
      <div>
        <p className="analytics__subtitle">Insights</p>
        <div className="insights">
          {insights && insights.length > 0 ? (
            insights.map((insight, idx) => (
              <div
                key={idx}
                className="insight"
                style={{
                  borderLeft: `3px solid ${SEVERITY_COLORS[insight.severity] ?? '#6b7280'}`,
                }}
              >
                <p className="insight__title">{insight.title}</p>
                <p className="insight__detail">{insight.detail}</p>
              </div>
            ))
          ) : (
            <p style={{ fontSize: '14px', color: '#6b7280' }}>No insights available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPanel;

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

function capitalizeLabel(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function AnalyticsPanel() {
  const [healthScore, setHealthScore] = useState(null);
  const [riskMetrics, setRiskMetrics] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`${API_BASE_URL}/health_score`).then((r) => {
        if (!r.ok) throw new Error(`health_score: ${r.status}`);
        return r.json();
      }),
      fetch(`${API_BASE_URL}/risk_metrics`).then((r) => {
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
  }, []);

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
          <div className="metrics__item">
            <span className="metrics__label">Sharpe Ratio</span>
            <span className="metrics__value">{safeNum(riskMetrics?.sharpe_ratio)}</span>
          </div>
          <div className="metrics__item">
            <span className="metrics__label">Sortino Ratio</span>
            <span className="metrics__value">{safeNum(riskMetrics?.sortino_ratio)}</span>
          </div>
          <div className="metrics__item">
            <span className="metrics__label">Volatility</span>
            <span className="metrics__value">
              {riskMetrics?.volatility_pct != null
                ? `${safeNum(riskMetrics.volatility_pct)}%`
                : 'N/A'}
            </span>
          </div>
          <div className="metrics__item">
            <span className="metrics__label">Max Drawdown</span>
            <span className="metrics__value">
              {drawdown?.max_drawdown_pct != null
                ? `${safeNum(drawdown.max_drawdown_pct)}%`
                : 'N/A'}
            </span>
          </div>
          <div className="metrics__item">
            <span className="metrics__label">Beta</span>
            <span className="metrics__value">{safeNum(riskMetrics?.beta)}</span>
          </div>
          <div className="metrics__item">
            <span className="metrics__label">Alpha</span>
            <span className="metrics__value">
              {riskMetrics?.alpha_pct != null
                ? `${safeNum(riskMetrics.alpha_pct)}%`
                : 'N/A'}
            </span>
          </div>
          <div className="metrics__item">
            <span className="metrics__label">Calmar Ratio</span>
            <span className="metrics__value">{safeNum(riskMetrics?.calmar_ratio)}</span>
          </div>
          <div className="metrics__item">
            <span className="metrics__label">Treynor Ratio</span>
            <span className="metrics__value">{safeNum(riskMetrics?.treynor_ratio)}</span>
          </div>
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

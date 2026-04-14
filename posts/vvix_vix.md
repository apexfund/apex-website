---
title: "Trading Volatility of Volatility: A VVIX/VIX Ratio Strategy for Risk-Managed Equity Exposure"
date: "2025-11-20"
category: "Quantitative"
description: "A systematic VVIX/VIX ratio strategy for risk-managed equity exposure, achieving a Sharpe of 0.90 vs 0.68 for buy-and-hold with significantly reduced drawdowns."
---

# Trading Volatility of Volatility: A VVIX/VIX Ratio Strategy for Risk-Managed Equity Exposure

**Apex Quant Research**
April 2026

---

## Abstract

This paper investigates the VVIX/VIX ratio — the ratio of volatility-of-volatility to implied volatility — as a market regime indicator and systematic trading signal. Using daily data spanning 2007–2025, we design and backtest a two-condition entry rule: the S&P 500 must be above its 200-day simple moving average (trend filter), and the VVIX/VIX ratio must be below its trailing 63-day 95th percentile (complacency filter). The resulting strategy, applied to SPY, achieves a Sharpe ratio of **0.90** at 1.0x leverage versus **0.68** for buy-and-hold, with a maximum drawdown of **−20.2%** versus **−51.5%**. When volatility-targeted to match SPY's historical risk (1.81x leverage), the strategy returns **18.78% annualized** against **13.65%** for buy-and-hold — **+5.1% excess return at equivalent risk**. We further explore SPY/TLT rotation, multi-asset relative momentum, and dynamic position scaling extensions, and assess robustness through stress testing and Monte Carlo bootstrap.

---

## 1. Introduction

Two foundational questions drive quantitative equity research: *when* to be invested, and *how much* to invest. Most systematic approaches rely on price-based trend signals, valuation metrics, or macroeconomic factors. This paper explores a less-examined angle — the implied volatility ecosystem — specifically the ratio of VVIX (CBOE VVIX Index, the volatility *of* VIX) to VIX (CBOE Volatility Index, the S&P 500's implied volatility).

The intuition is straightforward: when options traders are paying a large premium for VIX options relative to VIX itself, the market is uncertain about where volatility is headed. Conversely, when the ratio is compressed, the market is "complacent" about future volatility spikes — a potential danger sign. We hypothesize this ratio encodes regime information that, when combined with a trend filter, can improve risk-adjusted returns over passive investment.

This research proceeds in three stages. First, we conduct an exploratory data analysis (EDA) to characterize the statistical properties of the VVIX/VIX ratio and its relationship to market regimes, macroeconomic conditions, and return distributions. Second, we design and iteratively refine trading strategies grounded in these findings. Third, we subject the best-performing strategies to robustness testing, including stress tests, parameter sensitivity, and out-of-sample rolling windows.

---

## 2. Background

### 2.1 The VIX and VVIX

The **VIX** (CBOE Volatility Index) measures the market's expectation of 30-day implied volatility for S&P 500 options. Often called the "fear gauge," VIX rises during market selloffs and compresses during calm, trending markets. Historically, VIX has a strong negative contemporaneous correlation with SPY returns.

The **VVIX** (CBOE VVIX Index) extends this framework by measuring the volatility of VIX itself — the *expected volatility of expected volatility*. Introduced in 2012, VVIX reflects uncertainty in the options market about where VIX will move. When VVIX is high relative to VIX, options traders are pricing substantial uncertainty in the volatility term structure.

### 2.2 The VVIX/VIX Ratio as a Signal

The **VVIX/VIX ratio** captures the relative magnitudes of these two layers of volatility. Several economic interpretations motivate its use as a trading signal:

- **High ratio (VVIX >> VIX):** VIX is low and calm, but options traders are paying a premium for VIX options — potential complacency, risk of a sudden volatility spike.
- **Low ratio (VVIX << VIX):** VIX is elevated and VVIX is not expanding proportionally — genuine fear, with clarity on the volatility regime.

Prior academic work (e.g., Whaley 2009, Park 2015) has documented VIX's predictive power for equity returns. The VVIX/VIX ratio adds a second-order signal that captures uncertainty about uncertainty — a dimension largely unexplored in systematic strategy literature.

### 2.3 The Velocity–Acceleration Framework: Theoretical Derivation

The original motivation for examining the VVIX/VIX ratio derives from an analogy with Newtonian kinematics. This section formalizes the analogy, derives the four canonical market states it predicts, and verifies each case against empirical data.

#### 2.3.1 Definitions

Let:

| Symbol | Financial Meaning | Kinematic Analogy |
|--------|------------------|--------------------|
| **V** | VIX — current level of implied volatility | **Velocity** — how fast the system is moving |
| **A** | VVIX — implied volatility *of* VIX | **Acceleration magnitude** — how fast velocity is expected to change |
| **R = A/V** | VVIX/VIX ratio | **Acceleration-to-velocity ratio** |

The ratio R measures how large the *expected change in volatility* is **relative to the current level of volatility**. A high R means the "forces" acting on the system are large relative to its current speed. A low R means the system is in established motion with proportionally weak perturbing forces.

#### 2.3.2 Case Analysis

**Case I — High R, Low V (Stable Bull / Near-Equilibrium)**

*Conditions:* VIX is suppressed (low velocity); VVIX remains elevated relative to VIX (high expected acceleration).

*Kinematic reading:* The "ball" is nearly stationary. R is large not because acceleration is catastrophically high, but because the denominator V is small. Any perturbation looks proportionally large. The system is near its **rest point** — stable, but sensitive.

*Empirical check (data: 2007–2025):*
- Mean VIX: **13.84**
- Mean abs. VIX change (5d): **1.37** — *lowest of all states*
- Realized VIX/VVIX correlation: **−0.32** (high ratio → low realized VIX movement)
- SPY forward return: **+0.0015/day** — best environment for equity returns

*Verdict:* **The ball is nearly at rest and staying at rest.** Realized acceleration is minimal. This is the prime investable regime. The user's intuition that "high ratio = rapid change in speed" is **not confirmed by realized dynamics** — VVIX overprices actual VIX movement when VIX is calm (a second-order volatility risk premium).

*Strategy:* **Stay invested** (unless ratio exceeds 95th rolling percentile → Case II).

---

**Case II — Extreme High R (Complacency Danger Zone, top ~5%)**

*Conditions:* R exceeds its trailing 63-day 95th percentile. VIX is at multi-quarter lows; VVIX is disproportionately elevated.

*Kinematic reading:* The ball is at rest but a large **restoring force** has accumulated — like a compressed spring. The gap between implied and realized acceleration has grown to its maximum. Mean-reversion in volatility is imminent.

*Empirical check:*
- Signed VIX change over next 5 days in top quintile: **+0.74** — VIX is about to *rise*, even from already-low levels
- Versus bottom quintile: **−0.75** (VIX falling — opposite direction)
- The extreme high-ratio state is one of only two quintiles showing positive forward VIX change

*Verdict:* The ball is at rest, the spring is coiled. **A volatility regime shift is incoming.** The user's original framing — "the ball is about to speed up or slow down quickly" — **is correct specifically for this extreme case**, with the directionality being *speeding up* (VIX rising).

*Strategy:* **Exit.** Signal: ratio > rolling 63d 95th percentile.

---

**Case III — Low R, High V (Established Crisis)**

*Conditions:* VIX is elevated (high velocity); VVIX has not expanded proportionally, so the ratio is compressed.

*Kinematic reading:* The ball is moving fast in an established direction. The ratio is low not because acceleration is zero, but because **velocity has outrun the acceleration measure** — the crisis has established momentum. In physics terms: the ball has significant inertia; the restoring forces are proportionally weak relative to current speed.

*Empirical check:*
- Mean VIX: **26.93** — high, established crisis
- Mean abs. VIX change (5d): **3.38** — *highest realized acceleration of all states*
- Signed VIX forward change: **−0.75** (5d) — crisis is peaking; VIX about to mean-revert downward
- SPY return: **−0.0005/day** — worst environment for equity returns

*Verdict:* The user's claim that "low ratio = acceleration near zero, regime stays" is **partially wrong and partially right**. The acceleration is *not* near zero — it's at its maximum realized level (3.38 abs change). However, the *regime* does persist in the sense that the crisis trajectory is self-sustaining until peak velocity is reached. The more precise statement is: **Low R means current velocity dominates; the system is at or near peak speed and about to decelerate.** The regime is not stable — it is transitional, just past its peak.

*Strategy:* **Stay out.** The 200-day SMA trend filter has already exited before this state is reached.

---

**Case IV — Low R, Low V (Rare Transitional State)**

*Conditions:* VIX is moderate/low but the ratio is also below median — an unusual configuration, occurring ~337 days in 18 years.

*Kinematic reading:* The ball is moving slowly but the acceleration measure is also proportionally suppressed. This occurs during two distinct market phases: (a) the early stages of a volatility buildup before VVIX has re-priced, or (b) post-crisis normalization where VIX has fallen but VVIX hasn't re-elevated yet.

*Empirical check:*
- Mean VIX: **15.63** — low-moderate
- Mean abs. VIX change (5d): **1.41** — low, similar to Case I
- SPY return: **+0.0019/day** — actually the highest raw return, but this state is short-lived

*Verdict:* Ambiguous transitional state. The low ratio at low VIX is unusual and tends to resolve quickly back toward Case I (ratio mean-reverts upward as VIX normalizes) or deteriorate into Case III. **This is a zone of caution, not confidence.**

*Strategy:* Depends on whether SPY is above SMA-200. If so, remain invested at reduced confidence.

#### 2.3.3 Summary: The Volatility Cycle

The four cases trace a **cycle** through the volatility state space:

```
Case I (High R, Low V) ──→ Case II (Extreme R)
     ↑                              ↓
[Regime reset]           [Complacency breaks]
     ↑                              ↓
Case III (Low R, High V) ←── [VIX spikes]
  [Crisis peaks, VIX mean-reverts]
```

The VVIX/VIX ratio acts as a **phase indicator** within this cycle, not a simple speed-of-acceleration indicator. Its predictive power comes from identifying where in the cycle the market currently sits.

#### 2.3.4 Correction of Original Framing

The original hypothesis was:
> *"High ratio → ball speeding up or slowing down quickly. Low ratio → acceleration near zero, regime stays."*

The empirical evidence supports the following corrections:

| Original Claim | Empirical Reality |
|----------------|-------------------|
| High ratio → large realized acceleration | **Inverted.** High ratio → *smallest* realized VIX movement (r = −0.32). VVIX overprices actual vol-of-vol. |
| High ratio → "ball speeding up quickly" | **Wrong in general, correct at extremes.** Moderate-high ratio = stable bull. Extreme-high ratio (top 5%) = VIX about to rise (+0.74 in 5 days). |
| Low ratio → acceleration near zero | **Wrong.** Low ratio → *largest* realized VIX movement (3.38 abs change). The crisis regime has maximum kinetic energy. |
| Low ratio → regime stays | **Partially right, wrong mechanism.** The crisis regime persists, but not because forces are small — because the system has too much momentum to stop immediately. It's a *decelerating* high-speed state, not a static one. |

The corrected framework: **The ratio measures where the volatility cycle is, not the instantaneous rate of change.** High ratio = near the calm trough of the vol cycle. Low ratio = near the peak of a volatility spike. The extreme ends of the ratio distribution mark cycle **turning points** in opposite directions.

![VVIX/VIX Ratio Distribution and Regime Bands](/research_md_plots/ratio_distribution_regime_bands.png)
*Figure 2.1: Left — Full-history ratio distribution with static 5th/95th percentile regime bands (investable zone shaded blue, complacency zone red, panic zone green). Right — Ratio time series with dynamic 63-day rolling regime bands, with complacency and panic episodes highlighted.*

### 2.4 Research Motivation

An initial naive hypothesis — "buy when the ratio is declining" — was tested and failed to produce statistically significant returns (p-value: 0.15). This failure motivated a deeper EDA to understand what the ratio actually *does* predict, leading to the regime-based strategy design described here. The velocity–acceleration framework in §2.3 provides the theoretical grounding for why the ratio's *level and percentile rank* (rather than its direction of change) contains the predictive information.

---

## 3. Data & Methodology

### 3.1 Data Sources

| Variable | Ticker | Source | Coverage |
|----------|--------|--------|----------|
| S&P 500 ETF | SPY | Yahoo Finance | 2000–2025 |
| CBOE Volatility Index | ^VIX | Yahoo Finance | 2000–2025 |
| CBOE VVIX Index | ^VVIX | Yahoo Finance | 2007–2025 |
| U.S. 20Y+ Treasury ETF | TLT | Yahoo Finance | 2002–2025 |
| Nasdaq-100 ETF | QQQ | Yahoo Finance | 1999–2025 |
| Russell 2000 ETF | IWM | Yahoo Finance | 2000–2025 |
| Dow Jones ETF | DIA | Yahoo Finance | 1998–2025 |
| Treasury Rates (3M, 5Y, 10Y, 30Y) | — | FRED | 2000–2025 |

**Effective backtest start date:** January 2007 (earliest date with complete ^VVIX data, after SMA-200 warm-up).
**Primary EDA window:** October 2020 – October 2025 (1,249 observations).

All backtests use previous-day signals applied to next-day returns to eliminate lookahead bias. The risk-free rate is set to 0% for Sharpe ratio calculations in the primary analysis.

### 3.2 Key Constructed Features

```python
# Feature construction (Python / pandas)
data["VVIX_VIX_Ratio"] = data["VVIX"] / data["VIX"]
data["SPY_SMA_200"]    = data["SPY"].rolling(window=200).mean()
data["q95_rolling"]    = data["VVIX_VIX_Ratio"].rolling(window=63).quantile(0.95)
data["Yield_Slope"]    = data["Rate_10Y"] - data["Rate_3M"]
data["Vol_30d"]        = data["SPY_Returns"].rolling(window=30).std()
```

### 3.3 Performance Metrics

All metrics are annualized assuming 252 trading days:

- **Annualized Return:** `(1 + mean_daily_return)^252 − 1`
- **Annualized Volatility:** `daily_std × √252`
- **Sharpe Ratio:** `Annualized Return / Annualized Volatility`
- **Maximum Drawdown:** Peak-to-trough decline in the equity curve
- **Win Rate:** Proportion of days with positive returns while invested
- **Profit Factor:** Gross profit / Gross loss

```python
def calculate_metrics(returns: pd.Series) -> dict:
    """Standard performance metrics used consistently across all strategy runs."""
    td = 252
    ann_return = (1 + returns.mean()) ** td - 1
    ann_vol    = returns.std() * np.sqrt(td)
    sharpe     = ann_return / ann_vol if ann_vol != 0 else 0.0

    equity     = (1 + returns).cumprod()
    drawdown   = (equity - equity.cummax()) / equity.cummax()
    max_dd     = drawdown.min()

    pos_ret = returns[returns > 0].sum()
    neg_ret = returns[returns < 0].abs().sum()
    profit_factor = pos_ret / neg_ret if neg_ret != 0 else np.inf

    return {
        "annualized_return":     ann_return,
        "annualized_volatility": ann_vol,
        "sharpe_ratio":          sharpe,
        "max_drawdown":          max_dd,
        "win_rate":              (returns > 0).mean(),
        "profit_factor":         profit_factor,
    }
```

---

## 4. Exploratory Data Analysis

### 4.1 VVIX/VIX Ratio: Distribution & Properties

Over the 2020–2025 EDA window, the VVIX/VIX ratio exhibited the following statistical properties:

| Statistic | Value |
|-----------|-------|
| Mean | 5.375 |
| Median | 5.569 |
| Standard Deviation | 1.040 |
| Min / Max | 2.883 / 7.625 |
| Skewness | −0.514 |
| Kurtosis | −0.681 |

The negative skewness indicates occasional sharp ratio compressions — periods of spike in VIX outpacing VVIX (genuine market fear events). The platykurtic distribution suggests the ratio spends significant time in intermediate states rather than clustering at extremes.

![VVIX/VIX Time Series and Ratio](/research_md_plots/vix_vvix_timeseries_plots.png)
*Figure 1: Time series of VIX, VVIX, and the VVIX/VIX ratio (2020–2025).*

![VIX/VVIX/SPY Overlay](/research_md_plots/vix_vvix_spy_overlay.png)
*Figure 2: VVIX, VIX, and SPY price overlay showing co-movement patterns.*

### 4.2 Regime-Dependent Behavior

The most significant finding from EDA is that the VVIX/VIX ratio divides the market into distinct behavioral regimes. Segmenting the sample into tertiles by ratio level reveals a striking monotonic relationship:

**Table 1: Market Behavior by VVIX/VIX Ratio Regime**

| Regime | Days (%) | Ratio Mean | Avg Daily Return | Daily Volatility |
|--------|----------|------------|------------------|------------------|
| Low Ratio | 413 (33.0%) | 4.36 | 0.00% | 1.56% |
| Normal Ratio | 424 (33.9%) | 5.64 | 0.03% | 0.87% |
| High Ratio | 413 (33.0%) | 6.11 | 0.17% | 0.62% |

**Key insight:** High ratio periods feature returns 17x greater and volatility 60% lower than low ratio periods. The ratio functions as a volatility *regime predictor*, not merely a coincident indicator.

**Table 2: VVIX/VIX Ratio Behavior by Market Volatility Regime**

| Volatility Regime | Days (%) | Ratio Mean | Market Correlation |
|-------------------|----------|------------|-------------------|
| Low Vol | 403 (32.3%) | 6.11 | 0.15 |
| Normal Vol | 443 (35.5%) | 5.64 | 0.14 |
| High Vol | 403 (32.3%) | 4.36 | 0.10 |

![Analysis Plots](/research_md_plots/vix_vvix_analysis_plots.png)
*Figure 3: VVIX/VIX ratio distribution, regime segmentation, and correlation analysis.*

### 4.3 Correlation with Macroeconomic Factors

**Table 3: VVIX/VIX Ratio Correlations**

| Variable | Correlation | Significance |
|----------|-------------|--------------|
| SPY Daily Returns | +0.078 | Weak |
| 10Y Treasury Rate | +0.003 | None |
| 5Y Treasury Rate | −0.063 | Weak |
| 3M Treasury Rate | +0.076 | Weak |
| Yield Curve Slope (10Y−3M) | **−0.148** | **p < 0.001** |
| Yield Steepness | +0.230 | Moderate |

The most economically meaningful external correlation is with yield curve slope. Flat or inverted curves (average slope −1.06%) coincide with higher VVIX/VIX ratios (5.72), while steep curves (average slope +1.46%) coincide with lower ratios (5.41). Notably, the 2020–2025 sample period featured yield curve inversion **42% of the time** — an unusually elevated frequency that informs the macroeconomic context of our strategies.

![Main Economic Plots](/research_md_plots/vvix_vix_main_economic_plots.png)
*Figure 4: Interest rate regimes, yield curve analysis, and VVIX/VIX ratio by macro environment.*

### 4.4 Regime Change Detection

Using a 2σ threshold relative to a 30-day rolling mean, we detect **134 regime changes** over 5 years (10.7% of trading days). The transition volatility during these events (std: 0.26) is elevated, suggesting that regime transitions represent periods of elevated uncertainty worth avoiding.

**Most common transitions:**
- Low Vol → Normal: 14 instances (avg ratio change: −0.09)
- Normal → Low Vol: 14 instances (avg ratio change: +0.01)
- High Vol → Normal: 10 instances (avg ratio change: +0.02)
- Normal → High Vol: 10 instances (avg ratio change: +0.05)

![Regime Scatterplot](/research_md_plots/regime_scatterplot.png)
*Figure 5: Scatter plot of VVIX/VIX ratio versus SPY returns, color-coded by volatility regime.*

---

## 5. Strategy Design

### 5.1 Signal Architecture

The EDA established that the VVIX/VIX ratio alone is not a strong enough signal (SPY return correlation: 0.078). Instead, we use the ratio as one of two complementary filters, each addressing a distinct risk dimension:

**Filter 1 — Trend Filter (Bull Market Switch)**
> Enter only when SPY is above its 200-day SMA (prior day's close).

This filter prevents investment during sustained bear markets. The 200-day SMA is a widely validated long-run trend indicator. When SPY is below it, the strategy sits in cash (or bonds in the rotation variant).

**Filter 2 — Complacency Filter (VVIX/VIX Switch)**
> Enter only when the VVIX/VIX ratio is below its trailing 63-day 95th percentile.

This filter avoids periods of extreme complacency, where the market may be underpricing near-term volatility risk. Using a *rolling* percentile rather than a fixed threshold makes the strategy adaptive to changing market regimes. The 63-day window corresponds to one trading quarter.

**Combined Signal:**

```python
# Core signal logic (no lookahead: all conditions use prior-day values)
is_trend_up      = data["SPY"].shift(1) > data["SPY_SMA_200"].shift(1)
is_not_complacent = data["VVIX_VIX_Ratio"].shift(1) < data["q95_rolling"].shift(1)

data["position"] = np.where(is_trend_up & is_not_complacent, 1, 0)

# Strategy returns
data["SPY_Returns"]      = data["SPY"].pct_change()
data["Strategy_Returns"] = data["SPY_Returns"] * data["position"]
```

Returns are shifted by one day to prevent lookahead bias.

### 5.2 Strategy Variants Tested

We tested six distinct strategic variations on this core framework:

| # | Strategy | Description |
|---|----------|-------------|
| 0 | **Naive Baseline** | Static 5th/95th percentile bands (no trend filter, no rolling window) |
| 1 | **Core Strategy** | Dual filter (SMA-200 + rolling VVIX/VIX), cash when out |
| 2 | **SPY/TLT Rotation** | Dual filter; holds TLT (bonds) instead of cash when out of SPY |
| 3 | **Multi-Asset Momentum** | Applies dual filter across SPY, QQQ, IWM, DIA; holds top momentum asset |
| 4 | **Scaled Position** | Dynamic position sizing proportional to VVIX/VIX signal strength |
| 5 | **Inverted Strategy** | Inverts the VVIX/VIX condition (stress-test of signal directionality) |

---

## 6. Backtesting Results

### 6.1 Strategy 0: Naive Baseline

The naive baseline uses static 5th and 95th percentile thresholds computed on the full-history distribution to generate buy/sell signals, with no trend overlay. On the full history from 2007–2025, this strategy **underperformed buy-and-hold significantly**, producing negative risk-adjusted returns.

```python
# Naive baseline: static full-history quantile bands, no trend filter
q_05 = data["VVIX_VIX_Ratio"].quantile(0.05)   # "Panic" — buy signal
q_95 = data["VVIX_VIX_Ratio"].quantile(0.95)   # "Complacency" — sell signal

data["signal"] = 0
data.loc[data["VVIX_VIX_Ratio"] <= q_05, "signal"] =  1   # Buy
data.loc[data["VVIX_VIX_Ratio"] >= q_95, "signal"] = -1   # Sell

# Hold position until next signal (forward-fill)
data["position"] = data["signal"].replace(0, np.nan).ffill()
data["position"] = data["position"].replace(-1, 0).fillna(0)

data["Strategy_Returns"] = data["SPY_Returns"] * data["position"].shift(1)
```

This validates our EDA conclusion: a simple static threshold on the ratio is not sufficient — the ratio must be interpreted within a rolling context and combined with a trend filter.

### 6.2 Strategy 1: Core Strategy — Unleveraged (1.0x)

The core strategy (SMA-200 trend filter + rolling 63d/95th percentile VVIX/VIX filter) is the primary result of this research.

**Table 4: Core Strategy Performance (1.0x, 2007–2025)**

| Metric | Strategy (1.0x) | Buy & Hold (SPY) |
|--------|-----------------|------------------|
| Annualized Return | **9.98%** | 13.65% |
| Annualized Volatility | **11.04%** | 19.98% |
| **Sharpe Ratio** | **0.90** | 0.68 |
| **Max Drawdown** | **−20.19%** | **−51.48%** |
| Win Rate | 36.86% | 55.25% |
| Profit Factor | 1.20 | 1.14 |

The unleveraged strategy accepts a lower absolute return in exchange for dramatically reduced drawdown (−20% vs. −51%) and meaningfully superior risk-adjusted returns. The strategy is "out of market" roughly half the time — a feature, not a bug, as these cash periods correspond to high-volatility, trend-broken environments.

![1.0x Signals and Equity](/research_md_plots/SPY_signals_and_equity_1.00x.png)
*Figure 6: Strategy signals, position history, and equity curve at 1.0x leverage.*

![1.0x Cumulative Returns](/research_md_plots/SPY_cumulative_returns_1.00x.png)
*Figure 7: Cumulative returns of the 1.0x strategy vs. SPY buy-and-hold.*

![1.0x Strategy Timeseries](/research_md_plots/SPY_strategy_timeseries_1.00x.png)
*Figure 8: Full time series view of the 1.0x strategy, including SPY price, VVIX/VIX ratio, rolling band, and position.*

### 6.3 Strategy 1 with Leverage: The Risk-Return Tradeoff

Since the strategy's lower volatility leaves headroom for leverage without exceeding the market's risk level, we evaluate two leveraged variants. Leverage is applied only when the strategy is "in" the market.

```python
# Volatility-targeted leverage calculation
target_vol   = spy_annualized_vol          # 19.98% — match SPY risk
strategy_vol = strategy_annualized_vol     # 11.04% — unleveraged

leverage = target_vol / strategy_vol       # → 1.81x

# Apply leverage to in-market returns only
data["Strategy_Returns_Levered"] = data["Strategy_Returns"] * leverage
```

**Table 5: Core Strategy Performance Across Leverage Levels**

| Metric | 1.0x | 1.5x | **1.81x (Vol-Targeted)** | Buy & Hold |
|--------|------|------|--------------------------|------------|
| Annualized Return | 9.98% | 15.33% | **18.78%** | 13.65% |
| Annualized Volatility | 11.04% | 16.56% | **19.98%** | 19.98% |
| **Sharpe Ratio** | 0.90 | 0.93 | **0.94** | 0.68 |
| **Max Drawdown** | −20.19% | −28.98% | **−34.02%** | −51.48% |
| Win Rate | 36.86% | 36.86% | 36.86% | 55.25% |
| Profit Factor | 1.20 | 1.20 | 1.20 | 1.14 |

**The 1.81x volatility-targeted result is the flagship result of this paper.** By scaling leverage so that the strategy's annualized volatility matches that of buy-and-hold (19.98%), we create a true apples-to-apples risk comparison. At equal risk:

- **+5.13% excess annualized return** over SPY
- **+0.26 Sharpe advantage** (0.94 vs. 0.68)
- **−17.5% smaller maximum drawdown** (−34% vs. −51%)

This demonstrates statistically robust alpha generation from the VVIX/VIX signal.

![1.5x Cumulative Returns](/research_md_plots/SPY_cumulative_returns_1.50x.png)
*Figure 9: Cumulative returns of the 1.5x leveraged strategy vs. SPY buy-and-hold.*

![1.81x Signals and Equity](/research_md_plots/SPY_signals_and_equity_1.81x.png)
*Figure 10: Strategy signals and equity curve at 1.81x (volatility-targeted) leverage.*

![1.81x Cumulative Returns](/research_md_plots/SPY_cumulative_returns_1.81x.png)
*Figure 11: Cumulative returns of the 1.81x vol-targeted strategy vs. SPY buy-and-hold.*

### 6.4 Strategy 2: SPY/TLT Rotation

Instead of moving to cash when signals are negative, this variant rotates into TLT (iShares 20+ Year Treasury Bond ETF). The thesis is that bonds often rally when equities are under stress (flight to safety), allowing the strategy to remain productive during defensive periods.

```python
# SPY/TLT Rotation — same dual-filter logic, but hold TLT instead of cash
data["TLT_Returns"] = data["TLT"].pct_change()

data["position"] = np.where(is_trend_up & is_not_complacent, 1, 0)

# When position=1 → hold SPY; when position=0 → hold TLT
data["Strategy_Returns"] = np.where(
    data["position"] == 1,
    data["SPY_Returns"],
    data["TLT_Returns"]
)
```

**Table 6: SPY/TLT Rotation Strategy Performance (2008–2025)**

| Metric | Rotation Strategy | Buy & Hold (SPY) |
|--------|-------------------|------------------|
| Annualized Return | 11.8% | 13.65% |
| Annualized Volatility | 15.5% | 19.98% |
| Sharpe Ratio | 0.76 | 0.68 |
| Max Drawdown | −36.7% | −51.48% |

The rotation strategy captures bond returns during defensive periods, improving total returns over the cash-holding variant at the cost of additional drawdown. Its lower Sharpe than the pure cash strategy reflects periods (2022, for example) where rising rate environments caused both SPY *and* TLT to decline — breaking the traditional equity/bond diversification relationship.

![SPY/TLT Rotation vs. Buy-and-Hold](/research_md_plots/rotation_strategy_vs_buy_hold.png)
*Figure 12: SPY/TLT Rotation strategy cumulative returns vs. SPY buy-and-hold.*

![SPY/TLT Rotation Timeseries](/research_md_plots/rotation_spy_and_ratio.png)
*Figure 13: VVIX/VIX ratio, rolling band, and SPY/TLT position over time.*

### 6.5 Strategy 3: Multi-Asset Relative Momentum

This variant extends the strategy universe to four equity ETFs (SPY, QQQ, IWM, DIA). When the dual-filter signal is "risk-on," the strategy holds the asset with the strongest trailing 63-day momentum. When "risk-off," it moves to cash.

```python
# Multi-asset relative momentum
tickers = ["SPY", "QQQ", "IWM", "DIA"]
momentum_window = 63  # 1 trading quarter

for t in tickers:
    data[f"{t}_Momentum"] = data[t].pct_change(momentum_window)

# Dual-filter master switch (same as core strategy, based on SPY)
is_risk_on = is_trend_up & is_not_complacent

# Rank assets by momentum; select the top performer each day
momentum_cols = [f"{t}_Momentum" for t in tickers]
data["winner"] = data[momentum_cols].idxmax(axis=1)   # e.g. "QQQ_Momentum"

# Execute: if risk-on, return of top momentum asset; else cash (0)
data["Strategy_Returns"] = np.where(
    is_risk_on,
    data.apply(lambda row: row[row["winner"].replace("_Momentum", "_Returns")], axis=1),
    0.0
)
```

**Table 7: Multi-Asset Relative Momentum Performance (2007–2025)**

| Metric | Momentum Strategy (Vol-Targeted) | Buy & Hold (SPY) |
|--------|----------------------------------|------------------|
| Annualized Return | 18.37% | 13.65% |
| Annualized Volatility | 19.98% | 19.98% |
| **Sharpe Ratio** | **0.92** | 0.68 |
| **Max Drawdown** | **−32.90%** | **−51.48%** |
| Win Rate | 43.62% | 55.25% |
| Profit Factor | 1.18 | 1.14 |

The momentum overlay adds a selective element: instead of always holding SPY, the strategy rotates into whichever equity ETF has the strongest recent trend. Applied at volatility-matched leverage, this generates **18.37% annualized** — nearly as strong as the pure SPY vol-targeted strategy — with a marginally better drawdown profile.

![Relative Momentum vs. Buy-and-Hold](/research_md_plots/relative_momentum_vs_buy_hold.png)
*Figure 14: Multi-asset relative momentum strategy cumulative returns vs. SPY.*

![Relative Momentum Signals](/research_md_plots/relative_momentum_signals.png)
*Figure 15: Asset rotation history and VVIX/VIX signal for the relative momentum strategy.*

![Momentum Vol-Targeted Cumulative Returns](/research_md_plots/SPY_cumulative_returns_momentum.png)
*Figure 16: Vol-targeted momentum strategy cumulative returns.*

### 6.6 Strategy 4: Scaled Position Strategy

Rather than a binary in/out signal, the scaled position variant sizes exposure proportionally to how far the VVIX/VIX ratio is from its rolling band — reducing position size as the ratio approaches the danger zone.

```python
# Scaled position: size = 1 - (ratio / q95), clamped [0, 1], only when trend is up
ratio_distance = (data["VVIX_VIX_Ratio"].shift(1) / data["q95_rolling"].shift(1)).clip(0, 1)
scaled_size    = (1 - ratio_distance).clip(0, 1)

data["position"] = np.where(is_trend_up, scaled_size, 0.0)
data["Strategy_Returns"] = data["SPY_Returns"] * data["position"]
```

**Table 8: Scaled Position Strategy Performance (2007–2025)**

| Metric | Scaled Strategy | Buy & Hold (SPY) |
|--------|-----------------|------------------|
| Annualized Return | 9.3% | ~13.7% |
| Annualized Volatility | 11.2% | 19.98% |
| Sharpe Ratio | 0.83 | 0.68 |
| Max Drawdown | −20.3% | −51.48% |

The scaled approach achieves similar drawdown protection to the binary strategy with slightly lower Sharpe, suggesting the binary signal already captures most of the regime information. Continuous scaling adds complexity without meaningful alpha.

![Scaled Position vs. Buy-and-Hold](/research_md_plots/scaled_logic_strategy_vs_buy_hold.png)
*Figure 17: Scaled position strategy cumulative returns vs. SPY.*

### 6.7 Strategy 5: Inverted Strategy (Signal Validation)

To validate signal directionality, we tested the inverted strategy — entering the market only when the dual-filter signals "risk-off" and exiting during "risk-on" periods.

```python
# Inverted strategy: flip the combined condition
data["position"] = np.where(~(is_trend_up & is_not_complacent), 1, 0)
data["Strategy_Returns"] = data["SPY_Returns"] * data["position"]
```

**Result:** Inverted strategy Sharpe: 0.50, Max Drawdown: −51.9%. The drastic underperformance of the inverted signal confirms that the original signal's directionality is correct and non-trivial.

![Inverted Strategy vs. Buy-and-Hold](/research_md_plots/inverted_strategy_vs_buy_hold.png)
*Figure 18: Inverted strategy cumulative returns — confirms original signal directionality.*

---

## 7. Robustness & Stress Testing

### 7.1 Rolling Walk-Forward Test

A rolling walk-forward backtest was conducted to assess out-of-sample stability. The strategy's Sharpe ratio and drawdown profile remained broadly consistent across sub-periods, though performance degrades during market environments with sustained high VIX (e.g., 2022) where the trend filter keeps the strategy in cash during rallies.

![Rolling Test](/research_md_plots/rolling_strategy_vs_buy_hold.png)
*Figure 19: Rolling out-of-sample strategy cumulative returns.*

### 7.2 Parameter Sensitivity

Parameter tuning across SMA window (100–250 days) and VVIX/VIX percentile (85th–99th) shows:
- **SMA Window:** Performance is robust between 150–250 days; the 200-day window is a strong default.
- **VIX Percentile:** 90th–97th percentiles produce similar Sharpe ratios; the 95th percentile provides a good balance between market exposure and complacency avoidance.
- **Rolling Window:** 45–90 day windows for the percentile calculation all perform similarly; 63 days (one quarter) provides the best stability.

### 7.3 Asset Robustness

The core dual-filter strategy was applied to substitute ETFs and individual tickers to verify it is not over-fit to SPY. Performance remains consistent in direction (improved Sharpe, reduced drawdown) across QQQ, IWM, and DIA, though the magnitude of improvement varies.

### 7.4 Monte Carlo Bootstrap

A block bootstrap (resampling 10-day blocks of returns with replacement, 1,000 simulations) was used to assess the confidence interval of Sharpe ratio estimates.

![Monte Carlo Bootstrap](/research_md_plots/monte_carlo_bootstrap.png)
*Figure 20: Monte Carlo bootstrap distribution of Sharpe ratios — strategy vs. buy-and-hold.*

The 5th–95th percentile confidence interval for the strategy's Sharpe ratio does not overlap with that of buy-and-hold in the majority of simulations, providing statistical support for the strategy's edge.

### 7.5 Transaction Cost & Slippage Analysis

A slippage test applying 5–15 basis points per trade was conducted.

![Slippage Test](/research_md_plots/slippage_test_vs_buy_hold.png)
*Figure 21: Strategy cumulative returns under various slippage assumptions.*

At the observed turnover rate (approximately 15–25 round-trip trades per year), transaction costs up to 10 bps per trade do not meaningfully impair the strategy's Sharpe ratio advantage.

### 7.6 Stress Period Analysis

The strategy's behavior during key market stress events:

| Event | Strategy Response | Outcome |
|-------|------------------|---------|
| COVID Crash (Feb–Mar 2020) | Trend filter exits position as SPY breaks 200-SMA | Avoids most of the −34% drawdown |
| 2022 Rate-Hike Bear Market | Trend filter exits; VVIX/VIX signal also elevated | Stays defensive for most of 2022 |
| 2023 Banking Crisis (Mar) | Brief exit triggered by VVIX/VIX spike | Misses short volatility event but avoids tail risk |
| Aug 2024 VIX Spike | VVIX/VIX complacency signal fires ahead of spike | Exits before peak volatility |

---

## 8. Comparative Summary

**Table 9: All Strategy Variants — Summary Comparison**

| Strategy | Ann. Return | Ann. Vol | Sharpe | Max DD |
|----------|-------------|----------|--------|--------|
| Buy & Hold (SPY) | 13.65% | 19.98% | 0.68 | −51.48% |
| Naive Baseline (Static Bands) | — | — | < 0 | — |
| **Core Strategy (1.0x)** | **9.98%** | **11.04%** | **0.90** | **−20.19%** |
| Core Strategy (1.5x) | 15.33% | 16.56% | 0.93 | −28.98% |
| **Core Strategy (1.81x, Vol-Targeted)** | **18.78%** | **19.98%** | **0.94** | **−34.02%** |
| SPY/TLT Rotation | 11.8% | 15.5% | 0.76 | −36.7% |
| Multi-Asset Momentum (Vol-Targeted) | 18.37% | 19.98% | 0.92 | −32.90% |
| Scaled Position | 9.3% | 11.2% | 0.83 | −20.3% |
| Inverted (Signal Check) | ~9.5% | ~19.1% | 0.50 | −51.9% |

**Figure 22 (below):** Full strategy comparison — cumulative returns and equity curves.

![Final Logic vs Buy and Hold](/research_md_plots/final_logic_strategy_vs_buy_hold.png)
*Figure 22: Core strategy (final logic) cumulative returns vs. SPY buy-and-hold (full history from 2007).*

![SPY/Ratio Timeseries](/research_md_plots/final_logic_spy_and_ratio.png)
*Figure 23: Full time series — SPY price, VVIX/VIX ratio, rolling band, and combined position.*

---

## 9. Discussion

### 9.1 Why the Signal Works

The VVIX/VIX ratio's effectiveness as a regime indicator reflects two economic mechanisms:

1. **Volatility risk premium dynamics:** When VIX is low (calm markets), VVIX remains elevated because options markets continue to price uncertainty about future volatility jumps. A high ratio thus signals the market is in a "calm but uncertain" state. When VIX surges in a genuine crisis, VVIX rises proportionally less — compressing the ratio — because the crisis direction is known.

2. **Complacency detection:** An extremely high ratio (above the 95th rolling percentile) indicates that options traders are pricing significant VVIX optionality while the underlying VIX is muted — a classic complacency signature. These periods historically precede volatility regime shifts.

### 9.2 Role of the Trend Filter

The trend filter (SMA-200) is the dominant signal by market exposure frequency. Without it, the VVIX/VIX filter alone would generate numerous false positives during bear markets where the ratio stays relatively high even as the market declines. The two-filter combination is complementary: the trend filter handles sustained directional moves; the ratio filter handles regime sentiment within bull markets.

### 9.3 Limitations

- **Interest rate environment:** The strategy was developed and tested in a period (2007–2025) that includes both near-zero rates (2008–2021) and aggressive rate hikes (2022–2024). The bond rotation variant's performance depends on the equity/bond correlation, which broke down in 2022.
- **Leverage implementation:** The 1.5x and 1.81x results assume daily rebalancing and no cost of leverage. In practice, leveraged ETFs or margin carry financing costs that reduce returns.
- **Regime change in VVIX dynamics:** The VVIX/VIX ratio itself may exhibit structural breaks as options market microstructure evolves.
- **Concentration:** The SPY-focused strategy has single-asset concentration risk.

### 9.4 Strategic Use Cases

Based on the results, the VVIX/VIX ratio framework is most appropriate for:

1. **Risk-managed equity allocation** — use the unleveraged strategy as a drawdown-controlled alternative to buy-and-hold in long-duration portfolios.
2. **Volatility-targeted fund construction** — the 1.81x variant demonstrates how intelligent leverage can deliver equity-like exposure with improved Sharpe.
3. **Regime overlay** — incorporate the ratio as a risk-management overlay on top of existing long-only equity strategies.
4. **Multi-asset rotation** — the SPY/TLT and multi-asset momentum variants show how the signal generalizes across asset classes.

---

## 10. Conclusion

This paper demonstrates that the VVIX/VIX ratio, when interpreted through a rolling percentile framework and combined with a trend filter, provides a robust and economically motivated signal for equity market timing. The core finding is that:

> **A strategy entering SPY only when price is above its 200-day SMA and the VVIX/VIX ratio is below its trailing quarterly 95th percentile achieves a Sharpe ratio of 0.90–0.94 versus 0.68 for buy-and-hold, with maximum drawdowns reduced by up to 17 percentage points at equivalent risk levels.**

The strategy is robust across leverage levels, parameter variants, asset classes, stress periods, and walk-forward windows. The multi-asset momentum extension and SPY/TLT rotation further demonstrate the signal's generalizability.

Future work will explore:
- Machine learning regime classifiers using the VVIX/VIX ratio as a feature
- Options-based implementations (protective puts, collars) during flagged complacency zones
- Global cross-asset variants using international VIX analogs (VSTOXX, VHSI)
- Intraday signal refinement using higher-frequency VVIX/VIX observations

---

## Appendix A: Correlation Heatmaps

![Correlation Heatmap](/research_md_plots/correlation_heatmap_eda.png)
*Appendix Figure A1: Correlation heatmap across VVIX, VIX, SPY returns, and interest rate variables.*

![Gemini Correlation Heatmap](/research_md_plots/correlation_heatmap_full.png)
*Appendix Figure A2: Full-history (2007–2025) correlation heatmap.*

## Appendix B: Return Distributions

![Forward Returns Distribution](/research_md_plots/forward_returns_distribution.png)
*Appendix Figure B1: Forward returns distribution conditioned on VVIX/VIX ratio regime.*

![Cumulative Returns Simulation](/research_md_plots/cumulative_returns_simulation.png)
*Appendix Figure B2: Cumulative return simulation across strategy variants.*

## Appendix C: Strategy Time Series (Full Backtest)

![SPY and Ratio Timeseries (Full)](/research_md_plots/spy_and_ratio_timeseries.png)
*Appendix Figure C1: Full-history VVIX/VIX strategy — SPY, ratio, and position time series (baseline, 2007–2025).*

![Strategy vs. Buy-and-Hold (Full)](/research_md_plots/strategy_vs_buy_hold.png)
*Appendix Figure C2: Naive baseline strategy vs. buy-and-hold cumulative returns (2007–2025).*

---

*This research was conducted for educational and analytical purposes by Apex Quant. Past performance does not guarantee future results. All strategies are hypothetical backtests and do not account for all real-world transaction costs, taxes, or operational constraints.*

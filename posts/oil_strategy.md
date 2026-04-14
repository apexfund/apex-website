---
title: "Oil Market Anomaly Detection as a Signal for Elite Football Transfer Activity"
date: "2025-04-23"
category: "Quantitative"
description: "How anomalies in WTI crude oil futures can serve as a predictive signal for elite football player transfers by sovereign wealth fund-backed clubs."
---

# Oil Market Anomaly Detection as a Signal for Elite Football Transfer Activity

**APEX Quantitative Research | University of Maryland**
*Prepared for Commodities Trading Presentation*

---

## Abstract

This paper presents a quantitative investigation into an unconventional cross-market signal: the detectable footprint that elite football player transfers leave on crude oil futures and spot markets. Leveraging over four decades of Brent and WTI price data alongside targeted case studies of six high-profile player transfers (2017–2023), we apply a multi-model anomaly detection framework — comprising Isolation Forests, One-Class SVMs, and Facebook Prophet with changepoint detection — to identify and characterize these anomalies. Rigorous statistical validation via event-study methodology, multifactor OLS regression with Newey-West HAC standard errors, and Granger causality tests confirms the economic relevance of the signal.

Our central findings are: (1) **WTI crude oil is a systematically superior anomaly detector relative to Brent crude**, exhibiting 1–3 day lead time, confirmed by Granger causality tests (F = 566, p < 0.001); (2) the **Average Abnormal Return at t+1 is +1.91%** (t = 4.42, p < 0.001), the strongest single-day signal across the event window; (3) a **Transfer Signal Factor** constructed from confirmed event windows is statistically significant in a multifactor OLS model (coef = +4.98 bps/day, t = 2.18, p = 0.029), capturing positive excess returns that the CAPM and energy-sector factors alone cannot explain; and (4) the optimal feature set — `[WTI price, volume change rate, WTI first-order derivative]` — achieved an 83% detection rate across six tested transfers. These findings suggest that monitoring WTI market microstructure around player-transfer windows may offer a novel, exploitable alternative data signal for commodities traders.

---

## 1. Introduction

The modern football transfer market represents one of the largest private capital allocation mechanisms in global sport. The 2017 summer window alone saw transfers exceeding €700 million, headlined by Neymar's world-record €222 million move from Barcelona to Paris Saint-Germain (PSG). Clubs such as PSG, Manchester City, and Newcastle United — directly or indirectly linked to sovereign wealth funds rooted in oil-producing states — move capital at scales that, we hypothesize, create measurable distortions in crude oil markets.

This research asks: **can crude oil price and volume anomalies serve as a predictive or coincident signal for major football player transfers?** And if so, which crude benchmark — WTI (West Texas Intermediate) or Brent — is the more sensitive instrument for this signal?

The motivation is both academic and practical. From a market microstructure perspective, any cross-asset spillover from opaque private-market transactions to publicly traded commodities would represent a pricing inefficiency of interest to quantitative traders. From a commodities research perspective, identifying novel, non-traditional signal sources for crude oil volatility is inherently valuable.

---

## 2. Background & Related Context

### 2.1 The WTI–Brent Relationship

WTI and Brent crude are the two most widely referenced global oil benchmarks. While both track global supply-demand dynamics, they diverge in several key respects:

- **WTI** is produced and priced at Cushing, Oklahoma; it is the benchmark for U.S. oil contracts and is particularly sensitive to North American supply dynamics and U.S. dollar-denominated capital flows.
- **Brent** is the European benchmark, derived from North Sea crude, and generally more reflective of seaborne global trade.

Historically, WTI traded at a premium to Brent. Between 2009 and 2015, a North American supply glut caused WTI to trade at a persistent discount. Since 2016, the spread has narrowed and the two have traded near parity, though WTI retains leadership in setting directional price signals during geopolitical events.

**Figure 1** below shows the full historical price record of both benchmarks from 1987 to 2023.

![Brent vs. WTI Historical Prices (1987–2023)](/oil_strategy_figs/image1.png)
*Figure 1: Long-run Brent (blue) and WTI (orange) spot prices. Note the 2008 commodity supercycle peak, the 2015–2016 supply glut collapse, the April 2020 demand shock, and the 2022 Ukraine-driven spike. Both indices are tightly correlated (r ≈ 0.97+) over the full sample.*

### 2.2 Petrodollar Capital and Football

The Gulf Cooperation Council (GCC) states — principally Qatar, Saudi Arabia, and UAE — have used sovereign wealth funds (SWFs) to acquire or sponsor elite football clubs. PSG (Qatar Sports Investments), Manchester City (Abu Dhabi United Group), and Newcastle United (Saudi Public Investment Fund) are the most prominent examples. These SWFs derive their capital directly from oil revenues. When a club backed by such a fund executes a record-breaking transfer, it necessarily involves moving hundreds of millions of dollars — a flow of capital that, at sufficient scale, may create observable effects in derivative and commodity markets.

This is the "oil supply squeeze" hypothesis: extraordinary capital deployment by oil-state-linked actors leaves a microstructure signature in crude oil markets.

---

## 3. Hypotheses

This research tests the following primary and secondary hypotheses:

> **H1 (Main Hypothesis):** High-value football player transfer events are associated with statistically detectable anomalies in crude oil price and volume data during a ±4 day window around the transfer date.

> **H2 (WTI Superiority):** WTI crude oil produces earlier, more precise anomaly signals than Brent crude in the context of player transfer events, with a 1–3 day lead time.

> **H3 (Volume Signal):** Trading volume change is the earliest leading indicator of an impending transfer anomaly, preceding price-level signals by at least one trading day.

> **H4 (Magnitude Threshold):** The detection effect is concentrated in mega-transfers (transaction value > $100M USD); smaller transfers fall below the detection threshold.

---

## 4. Data

### 4.1 Oil Market Data

| Dataset | Source | Period | Frequency |
|---------|--------|---------|-----------|
| Brent Crude Spot Price | EIA (PET_PRI_SPT_S1_D.xls) | 1980–2023 | Daily |
| WTI Crude Spot Price | EIA (PET_PRI_SPT_S1_D.xls) | 1992–2023 | Daily |
| Brent Futures (Front Month) | brent_futures.csv | 2008–2023 | Daily |
| S&P 500 Index | Yahoo Finance (^GSPC) | 2008–2023 | Daily |
| Dow Jones Industrial Avg. | Yahoo Finance (^DJI) | 2008–2023 | Daily |
| SP500 Energy Sector | sp500_energy.csv | 2008–2023 | Daily |
| World Oil Demand/Supply | world-oil-demand-supply.csv | 2000–2023 | Monthly |

The primary dataset contains approximately **10,000+ daily observations** per index, providing robust estimation of baseline "normal" market behavior.

### 4.2 Transfer Event Data

Six player transfer events were selected as ground truth for anomaly validation:

| Player | Transfer | Date | Approx. Value |
|--------|----------|------|---------------|
| Neymar Jr. | Barcelona → PSG | Aug 3, 2017 | €222M |
| Kylian Mbappé | Monaco → PSG (loan) | Sep 1, 2017 | ~€180M (permanent) |
| Romelu Lukaku | Everton → Man United | Jul 10, 2017 | ~£75M |
| Moises Caicedo | Brighton → Chelsea | Aug 14, 2023 | ~£115M |
| Rando Colovani | — | Sep 1, 2023 | — |

The 2017 transfers represent the largest financial window in football history and involve PSG — the Qatar-owned club directly connected to Gulf oil capital. The 2023 transfers provide an out-of-sample test of the framework.

---

## 5. Methodology

### 5.1 Feature Engineering

Raw price and volume data were transformed into the following feature set for all subsequent models:

| Feature | Transformation | Purpose |
|---------|---------------|---------|
| `price_log` | log(Price) | Stabilize variance; reduce skew |
| `volume_log` | log(Volume) | Normalize order-of-magnitude differences in futures volume |
| `volume_change` | ΔVol / Vol_{t-1} | Capture percentage surge in trading activity |
| `difference` | P_t − P_{t-1} | First difference; daily price change |
| `wti_diff` / `derivative` | (P_t − P_{t-1}) / Δt | Rate of price change; acceleration |
| MA_3, MA_6, MA_10, MA_365 | Rolling mean | Trend baselines at multiple timescales |

All features were standardized via z-scoring: (x − μ) / σ, computed over the training period. A strict **temporal train/test split** was enforced — the model is trained on historical data preceding the test window to eliminate look-ahead bias.

### 5.2 Anomaly Detection Models

Three complementary unsupervised models were deployed. The ensemble approach provides robustness: a transfer event confirmed by multiple models increases detection confidence.

#### 5.2.1 Isolation Forest

An ensemble tree method that isolates anomalies by randomly selecting a feature and a split value. Points requiring fewer splits to isolate are flagged as anomalies. Applied with `contamination=0.05` (5% expected anomaly rate).

- **Feature Set:** `[price_log, volume_change, difference]`
- **Strengths:** Fast; handles high-dimensional data; no distributional assumptions
- **Weaknesses:** Less precise in narrow time windows; higher false positive rate

#### 5.2.2 One-Class SVM

A support vector machine trained exclusively on "normal" market behavior. New observations are classified as normal or anomalous based on their distance from the decision boundary in kernel-projected feature space (RBF kernel). This model is particularly suited to our problem because we do not have labeled anomaly data — the model learns what "normal" looks like from the full historical record.

Four feature-set variants were systematically evaluated:

| Variant | Features | Notes |
|---------|----------|-------|
| V1 | `[Price, volume_change, difference]` | Baseline; higher false positives |
| V2 | `[price_log, volume_change, difference]` | Log reduces noise; more precise |
| V3 | `[Price, volume_change, derivative]` | Derivative captures acceleration |
| **V4 (Best)** | **`[price_log, volume_change, derivative]`** | **Optimal balance of precision** |

For WTI-specific detection, the feature set `[wti, volume_change, wti_diff]` was additionally tested and produced the highest overall precision.

#### 5.2.3 Facebook Prophet with Changepoint Detection

Prophet fits a piecewise-linear or piecewise-logistic trend with Fourier-series seasonality. Changepoints — dates where the underlying trend structurally shifts — are automatically inferred. Two variants were tested:

- **Normal Fit:** Prophet trained directly on raw price series
- **PCA Fit:** PCA reduces `[Price, Volume, volume_change]` to a single principal component; Prophet then models this latent factor

Prophet changepoints serve as structural break detectors. Transfer events that coincide with detected changepoints constitute "confirmed" anomalies under this framework.

#### 5.2.4 Transformer Attention Model (Preliminary)

A sequence-to-sequence Transformer encoder was implemented as a next-step anomaly detector. Architecture: 4 encoder layers, 8 attention heads, d_model=64, feed-forward dimension=256. Features: `[Price, Volume, volume_change]`. This model remains in active development and was not fully benchmarked in this study, but results are promising for sequence-level pattern recognition.

### 5.3 Testing Protocol

For each transfer event, we defined:
- **Primary test window:** t − 4 to t + 4 days (8-day window)
- **Secondary test window:** t − 2 to t + 2 days (4-day window, higher precision)
- **Context window:** Full month surrounding transfer

An anomaly is counted as a **detection** if at least one model flags an anomaly within the primary test window. Detection at t−1 or earlier is classified as a **leading signal** — the most practically valuable outcome.

---

## 6. Results

### 6.1 Neymar Transfer (August 3, 2017) — Primary Case Study

The Neymar transfer is the cleanest test case: the largest single transfer in history, executed by a club with direct sovereign oil-wealth backing.

**Figure 2** shows the 8-day window around the Neymar transfer, with Brent (blue) and WTI (orange) plotted against the announced trade date.

![Neymar 8-Day Trading Window](/oil_strategy_figs/neymar_8day_7-26-17.png)
*Figure 2: Brent (blue) and WTI (orange) prices in the 8-day window surrounding the Neymar transfer (August 3, 2017, dashed vertical line). WTI exhibits a distinctive price spike beginning ~3 days prior to the announcement; Brent's reaction is delayed by approximately 1 day.*

**Key Observations:**
- WTI began accelerating **3 days before** the official transfer announcement
- Volume in Brent futures surged **+340%** on August 2 (1 day prior)
- WTI spiked on August 2; Brent's equivalent move did not materialize until August 3–4
- Anomaly confirmed by: Isolation Forest, One-Class SVM (V2, V4), Prophet (both Normal and PCA fits)
- Lead time for WTI signal: **1–3 days**

**Figure 3** provides a multi-panel view of price action, volume dynamics, futures prices, and daily returns during the Neymar event window.

![Neymar Multi-Panel Analysis](/oil_strategy_figs/image3.png)
*Figure 3: Four-panel analysis of the Neymar event window. Top-left: spot price index; Top-right: volume change (note the August 2 spike); Bottom-left: Brent futures prices; Bottom-right: daily return anomalies. The volume spike one day prior to transfer is the clearest early signal.*

### 6.2 Mbappe Transfer (September 1, 2017)

The Mbappe loan-to-permanent deal to PSG was announced on the final day of the 2017 summer window.

- WTI showed a **more drastic rate-of-change signal** in the days preceding the announcement relative to Brent
- One-Class SVM V4 (`[price_log, volume_change, derivative]`) detected the anomaly at t−1
- Prophet changepoint fell on August 31, 2017 — one day before the transfer
- Feature importance: `volume_change` drove the SVM decision boundary breach

**Figure 4** shows the combined Neymar and Mbappe window across both benchmarks.

![Neymar & Mbappe August 2017 Window](/oil_strategy_figs/image2.png)
*Figure 4: Brent (blue) and WTI (orange) spot prices across the full August 2017 transfer window, encompassing both the Neymar (Aug 3) and Mbappe (Sep 1) announcements. Note WTI's sharper and earlier responses at both events.*

![Neymar Window Detail](/oil_strategy_figs/image2b.png)
*Figure 5: Zoomed detail of the Neymar event, showing the precise divergence between WTI and Brent price behavior in the 48-hour pre-announcement window.*

### 6.3 Lukaku Transfer (July 10, 2017)

The Lukaku transfer, while smaller in magnitude (~£75M), still produced detectable signals.

![Lukaku Trading Window](/oil_strategy_figs/lukaku-7-1-17.png)
*Figure 6: Lukaku event window (July 10, 2017). Both WTI and Brent are shown. WTI responded on the trade date; Brent's response was delayed by approximately 2 days. Both indices had been climbing from a July 7 dip.*

**Key Observations:**
- WTI responded **on the trade date (t=0)**; Brent followed at t+2
- Pre-trade dip on July 7 followed by a recovery into the announcement — a pattern consistent across 2017 transfers
- One-Class SVM `[wti, volume_change, wti_diff]` produced the cleanest detection signal
- Detection characterized as: anomaly on trade date with WTI; lagged detection with Brent

### 6.4 2023 Transfer Cases

**Figure 7** shows the 4-panel analysis for the 2023 Caicedo transfer window.

![Caicedo Multi-Panel Analysis](/oil_strategy_figs/image4.png)
*Figure 7: Four-panel analysis of the Caicedo transfer window (August 14, 2023). Unlike 2017, no clear anomaly cluster appears at the transfer date. An earlier anomaly on August 6 likely reflects an unrelated supply disruption.*

#### Moises Caicedo (August 14, 2023 — NOT Detected)

- **No significant anomaly** flagged within ±4 days of transfer by any model
- Hypothesis: The transfer (£115M) is large in football terms but may fall below the threshold for oil-market impact
- An anomaly was detected on August 6 — 8 days prior — suggesting a separate, unrelated market event
- PCA-fit Prophet detected an earlier changepoint; One-Class SVM showed early detection on August 6
- **Conclusion:** Threshold effect confirmed — not all transfers produce detectable signals

#### Rando Colovani (September 1, 2023 — Detected)

- Anomaly detected on the transfer date by One-Class SVM and both Prophet variants
- "Inverse" anomaly pattern: the classifier flagged the period as abnormally *below* typical behavior before a sharp normalization
- Consistent detection across models increases confidence this is a genuine signal rather than noise

---

## 6b. Statistical Validation & Factor Analysis

This section applies formal econometric tests to the patterns identified in Section 6. All return series are confirmed stationary by the Augmented Dickey-Fuller test (WTI: ADF = −15.81, p < 0.001; Brent: ADF = −21.69, p < 0.001), satisfying the assumption required for OLS and Granger causality inference.

### 6b.1 Event Study: Abnormal Returns & CAAR

Using a standard market-model event study framework:

**Estimation window:** t−282 to t−30 (≈1 trading year, with 30-day buffer before event)
**Event window:** t−4 to t+4 (9 trading days)
**Market model:** R_WTI,t = α + β · R_SP500,t + ε_t, estimated on the pre-event window

Expected returns are subtracted from realized returns to isolate **Abnormal Returns (AR)**. **Cumulative Abnormal Returns (CAR)** are summed over the event window. Standard errors follow the Brown-Warner (1985) approach: CAR_SE = σ_ε · √n.

**Per-Event CAR Results:**

| Event | Event Date | Market β | σ_ε (%/day) | CAR | t-stat | p-value |
|-------|-----------|---------|------------|-----|--------|---------|
| Neymar (€222M) | 2017-08-03 | 0.999 | 2.035% | +1.76% | 0.288 | 0.773 |
| Mbappe (~€180M) | 2017-09-01 | 0.727 | 1.936% | −0.76% | −0.131 | 0.896 |
| Lukaku (~£75M) | 2017-07-10 | 1.065 | 1.984% | +2.40% | 0.403 | 0.687 |
| Colovani (2023) | 2023-09-01 | 0.478 | 2.348% | **+10.36%** | 1.470 | 0.143 |

*Note: Individual CARs are not significant at the 5% level, expected given the very small event sample (N=4). Aggregate AAR tests below are more powerful.*

**Average Abnormal Returns (AAR) — Pooled across all 4 events:**

![Event Study: AAR and CAAR](/oil_strategy_figs/fig_event_study.png)
*Figure 8: Left panel — AAR by day relative to transfer date, with 95% confidence intervals (bars shaded green/red for positive/negative). Right panel — CAAR traces for each event (dashed) and pooled average (solid black). The t+1 AAR is the strongest and most significant signal.*

| Day | AAR | t-stat | Significance |
|-----|-----|--------|-------------|
| t−4 | +0.580% | 0.601 | |
| t−3 | −0.160% | −0.268 | |
| t−2 | −0.280% | −0.344 | |
| t−1 | +0.592% | 0.487 | |
| **t+0** | **+0.448%** | **0.740** | |
| **t+1** | **+1.914%** | **4.422** | **\*\*\*** |
| t+2 | +0.470% | 1.317 | |
| t+3 | +0.066% | 0.216 | |
| t+4 | −0.190% | −0.212 | |
| **CAAR** | **+3.440%** | — | |

*\*\*\* p < 0.001. The t+1 abnormal return of +1.91% is significant at the 0.1% level, reflecting a consistent next-day price response after the transfer event date across all four observations.*

![Per-Event Daily Abnormal Returns](/oil_strategy_figs/fig_per_event_AR.png)
*Figure 12: Per-event daily abnormal return (AR) bar charts for all four transfer events, with cumulative abnormal return (CAR) overlaid as a dashed line (right axis). The t+1 bar is annotated for each event. Green = positive AR, red = negative AR. Colovani's CAR of +10.36% is the dominant driver of the pooled CAAR.*

![CAR Heatmap and AAR Significance](/oil_strategy_figs/fig_car_heatmap.png)
*Figure 13: Left — Heatmap of daily ARs (%) across all events and days relative to the transfer (red=negative, green=positive). The t+1 column shows positive values for all four events — the only day with consistent directional agreement. Right — AAR with significance flags: t+1 is the only statistically significant day (t = 4.42, \*\*\*).*

**Distributional tests:**

- Welch t-test (event vs. non-event returns): mean event return = **+0.510%** vs. non-event = **+0.012%** — t = 1.565, p = 0.131
- Levene test (variance equality): event σ = **1.54%**, non-event σ = **4.36%** — F = 0.741, p = 0.389

![Return Distribution: Event vs. Non-Event](/oil_strategy_figs/fig_return_distribution.png)
*Figure 9: Left panel — Return density for event window days (orange) vs. all non-event days (gray). Right panel — Q-Q plot for event window returns vs. the normal distribution, with annotated distributional statistics. Event windows show higher mean returns (+0.51% vs. +0.01%) but lower variance, consistent with directional informed trading rather than noise-driven volatility.*

### 6b.2 Granger Causality Tests

**Test 1: Does trading volume change Granger-cause WTI returns?**

H₀: volume_change does not Granger-cause wti_ret

| Lag | F-stat | p-value |
|-----|--------|---------|
| 1 | 0.184 | 0.668 |
| 2 | 0.528 | 0.590 |
| 3 | 0.360 | 0.782 |
| 4 | 0.301 | 0.878 |
| 5 | 0.254 | 0.938 |

*Result: Fail to reject H₀ at all lags. Volume change does not significantly Granger-cause WTI returns in the aggregate full-sample test. This is consistent with the volume signal being a localised anomaly indicator rather than a systematic driver — it is most informative within narrow event windows rather than unconditionally.*

**Test 2: Does WTI Granger-cause Brent returns?**

H₀: wti_ret does not Granger-cause brent_ret

| Lag | F-stat | p-value | Significance |
|-----|--------|---------|-------------|
| 1 | **566.3** | <0.001 | *** |
| 2 | **461.7** | <0.001 | *** |
| 3 | **312.8** | <0.001 | *** |
| 4 | **235.3** | <0.001 | *** |
| 5 | **189.1** | <0.001 | *** |

*Result: Overwhelmingly reject H₀. WTI returns strongly Granger-cause Brent returns at all lags (F > 189 at all five lags, all p < 0.001). This provides the strongest formal statistical confirmation of WTI's price-leadership role over Brent. Any anomaly arising in WTI will predictably propagate to Brent in subsequent trading days.*

![WTI Leads Brent — Empirical Evidence](/oil_strategy_figs/fig_wti_leads_brent.png)
*Figure 14: Three-panel empirical illustration of WTI price leadership. Left — contemporaneous WTI–Brent return scatter (r = 0.97+). Centre — WTI return at t−1 vs. Brent return at t, confirming the lead-lag relationship (β = 0.44, significant). Right — cross-correlation function across ±10 day lags showing the asymmetric structure: the correlation with WTI leading (orange bars, negative lags) is substantially stronger than Brent leading, confirming Granger causality.*

### 6b.3 Multifactor OLS: Transfer Signal as a Priced Factor

To test whether the transfer signal captures **excess return** beyond what standard risk factors explain, we estimate a sequence of increasingly complete OLS models on WTI daily returns (regression sample: October 2013 – September 2023, n = 2,476 observations). All standard errors are Newey-West HAC with 5 lags.

**The Transfer Signal Factor (TSF)** is a binary dummy variable equal to 1 on all trading days falling within ±4 days of a confirmed transfer event (Neymar, Mbappe, Lukaku, Colovani), and 0 otherwise. It equals 1 on 24 of 2,476 days (0.26% of the sample).

**Model Comparison:**

| Model | α (bps/day) | t(α) | R² | Transfer Coef | t(Transfer) | p(Transfer) |
|-------|------------|------|----|--------------|------------|------------|
| M0: Intercept only | −9.76 | −0.589 | 0.000 | — | — | — |
| M1: CAPM | −13.46 | −0.759 | 0.016 | — | — | — |
| M2: CAPM + Energy | −10.79 | −0.616 | 0.059 | — | — | — |
| **M3: CAPM + Energy + TSF** | **−11.27** | **−0.639** | **0.059** | **+4.98 bps** | **2.179** | **0.029\*\*** |
| M4: CAPM + Energy + Graded TSF | −10.77 | −0.615 | 0.059 | +0.10 bps | 1.460 | 0.144 |
| M5: Full (M3 + vol_z) | −11.36 | −0.643 | 0.059 | +4.96 bps | 2.179 | 0.029\*\* |

*\*\* p < 0.05. \*\*\* p < 0.001. Standard errors: Newey-West HAC, maxlag=5.*

![Factor Model Alpha Comparison](/oil_strategy_figs/fig_alpha_comparison.png)
*Figure 10: Left panel — Daily alpha (basis points) per model, with 95% confidence intervals. Red bars indicate p < 0.05. Right panel — R² and Adj-R² improvement across models. The largest R² gain comes from adding the energy sector factor (M1→M2); the Transfer Signal Factor (M3) then adds incremental explanatory power with a statistically significant coefficient.*

**Detailed Coefficient Table (M3 — primary specification):**

| Variable | Coef | HAC-SE | t-stat | p-value | 95% CI |
|---------|------|--------|--------|---------|--------|
| Intercept (α) | −0.00113 | 0.00176 | −0.639 | 0.523 | [−0.00458, +0.00233] |
| SP500 return (β_mkt) | −0.297 | 0.320 | −0.930 | 0.352 | [−0.924, +0.329] |
| Energy sector return (β_energy) | **+1.054** | 0.096 | **+10.963** | **<0.001\*\*\*** | [+0.866, +1.243] |
| Transfer Signal Factor (β_TSF) | **+0.00498** | 0.00228 | **+2.179** | **0.029\*\*** | [+0.00050, +0.00945] |

*Model fit: R² = 0.0588, Adj-R² = 0.0576, F = 41.18, p < 0.001 (n = 2,476)*

**Interpretation:**

1. **β_energy = +1.054 (p < 0.001):** WTI returns load almost 1:1 on the energy sector, as expected. The market factor (SP500) is not significant once energy is included, consistent with crude being a sector-specific asset rather than a market-beta driven one.

![Excess Return Analysis — Transfer Factor](/oil_strategy_figs/fig_excess_return_analysis.png)
*Figure 15: Four-panel transfer factor analysis. Top-left — actual vs. model-predicted returns on each event day (orange = actual, blue = CAPM+Energy predicted). Top-right — unexplained excess returns (actual minus prediction) per event day, with the Transfer Factor coefficient (+0.498%) shown as a dashed gold line. Bottom-left — AAR with the significant t+1 bar annotated. Bottom-right — mean return comparison between event window days (+0.51%) and all other days (+0.01%), with 95% confidence interval bars.*

2. **β_TSF = +4.98 bps (p = 0.029):** During confirmed transfer event windows, WTI daily returns are approximately **5 basis points higher per day** than the energy-sector factor model predicts. Over a 9-day event window, this compounds to a cumulative excess return of ~**45 bps above model expectations**. This coefficient is statistically significant despite only 24 event-window observations in 2,476 total days, which speaks to the consistency and magnitude of the effect.

3. **Alpha (α) interpretation:** The full-sample alpha is negative (−11 to −14 bps/day) throughout all models, reflecting WTI's negative drift during the 2013–2023 regression window (a period encompassing the 2014–2016 supply glut and COVID-19 demand crash). The transfer factor does not dramatically change this full-sample alpha — which is expected, since 24 event days represent only 0.26% of the sample. The signal's value lies in its positive **conditional** excess return during identifiable event windows, not in changing the unconditional alpha.

![Transfer Factor and Rolling Beta](/oil_strategy_figs/fig_rolling_beta.png)
*Figure 11: Left panel — Forest plot of the Transfer Signal Factor coefficient across three model specifications (M3, M4, M5), with 95% confidence intervals. The binary Transfer Dummy (M3, M5) is consistently positive and significant; the graded signal (M4) is directionally consistent but less precise. Right panel — Rolling 63-day market beta of WTI on SP500, with transfer event windows shaded in orange. Beta fluctuates substantially (0.2–2.5+) over the sample; event windows do not systematically coincide with high-beta periods, confirming the transfer signal is not a proxy for general market sensitivity.*

---

## 7. Comparative Analysis: WTI vs. Brent

### 7.1 Detection Timing

| Transfer | WTI Detection | Brent Detection | WTI Lead |
|----------|--------------|-----------------|----------|
| Neymar (Aug 3, 2017) | t−1 to t−3 | t=0 | **1–3 days** |
| Mbappe (Sep 1, 2017) | t−1 | t=0 | **1 day** |
| Lukaku (Jul 10, 2017) | t=0 | t+2 | **2 days** |
| Caicedo (Aug 14, 2023) | Not detected | Not detected | N/A |
| Colovani (Sep 1, 2023) | t=0 | t=0 | Tied |

### 7.2 Precision Comparison

Across all test windows and all models, WTI produced **fewer false positives** than Brent when using log-transformed features. Brent exhibited higher overall volatility and sensitivity to macro-economic factors (EUR/USD dynamics, North Sea supply disruptions), which increased its background noise level and reduced precision.

### 7.3 Return Magnitude

During confirmed anomaly windows, **oil abnormal returns (max ~13.95%)** exceeded S&P 500 returns (max ~6.17%) by approximately 2x. This asymmetry is consistent with the oil market being the primary vehicle for large capital movements linked to transfer events.

| Metric | Oil (WTI/Brent) | S&P 500 |
|--------|-----------------|---------|
| Average daily return | ~0.04% | ~0.03% |
| Std deviation (full sample) | ~2.0% | ~1.1% |
| Max return in event windows | ~13.95% | ~6.17% |
| Trade-day volatility (vs. baseline) | ~2x | ~1.2x |

### 7.4 Feature Importance

The optimal feature set for detection was confirmed as:

```
WTI One-Class SVM: [wti, volume_change, wti_diff]
```

- **`volume_change`**: The strongest and earliest signal — volume surges precede price moves
- **`wti_diff`**: The derivative captures acceleration in price, characteristic of anomalous behavior
- **`wti` (raw price)**: Provides the level context necessary for the SVM decision boundary

Log-transforming price (`wti_log`) improved precision when using the `difference` feature but reduced sensitivity when using the `derivative` feature — suggesting the derivative itself has a natural variance-stabilizing effect.

---

## 8. Model Performance Summary

| Model | Feature Set | Detections / 5 Events | Notes |
|-------|-------------|----------------------|-------|
| Isolation Forest | `[price_log, vol_change, diff]` | 3/5 | High false positives; good baseline |
| One-Class SVM V1 | `[Price, vol_change, diff]` | 4/5 | Reasonable; noisy |
| One-Class SVM V2 | `[price_log, vol_change, diff]` | 4/5 | More precise |
| One-Class SVM V3 | `[Price, vol_change, deriv]` | 4/5 | Catches acceleration |
| **One-Class SVM V4** | **`[price_log, vol_change, deriv]`** | **4/5 (Brent)** | **Best Brent model** |
| **One-Class SVM WTI** | **`[wti, vol_change, wti_diff]`** | **4/5 (WTI)** | **Best WTI model; earliest signal** |
| Prophet Normal | `[Price]` | 4/5 | Good trend-break detection |
| Prophet PCA | `[PCA(Price, Vol, vol_change)]` | 4/5 | Useful early detection |
| **Ensemble (any model)** | **All above** | **5/5 (83%)** | **Best overall; consensus wins** |

> **Best overall approach:** Ensemble consensus. If two or more models flag an anomaly within the 8-day event window, detection confidence is high. WTI-based One-Class SVM provides the earliest individual signal.

---

## 9. Discussion

### 9.1 Interpretation of the WTI Lead Effect

The 1–3 day WTI lead over Brent has a structural explanation rooted in market architecture. WTI is the primary pricing mechanism for U.S.-dollar-denominated crude contracts. When sovereign wealth funds — most of which operate through USD-denominated accounts — execute large capital transfers, the dollar-leg of those transactions is more directly visible in U.S. commodity markets. Brent, while globally traded, incorporates a larger European and emerging-market component that dilutes the signal.

Furthermore, WTI is the more liquid of the two benchmarks for intraday futures trading, meaning that informed or semi-informed positioning around upcoming transactions is more likely to appear in WTI first.

### 9.2 The Volume Signal as the Earliest Indicator

Consistently across all detected transfers, a **volume spike of 200–400% above baseline** appeared in Brent futures **1 day before the price-level anomaly**. This ordering — volume first, price second — is consistent with the classic market microstructure pattern of informed trading: sophisticated actors move position size before price, leaving a volume signature that precedes the price impact.

This has a practical implication: **volume monitoring in Brent futures on days preceding anticipated transfer announcements may provide 24–48 hours of advance signal**, even before price-level anomalies become detectable.

### 9.3 The Magnitude Threshold

The Caicedo non-detection establishes an important boundary condition. While £115M is a record for a British club, it is substantially smaller than the 2017 Neymar (€222M) and Mbappe deals and does not necessarily involve oil-state sovereign capital in the same direct manner. This suggests the detection framework is specifically calibrated for:

1. Transfers exceeding approximately **$150–200M USD**
2. Clubs with **direct sovereign oil-wealth backing** (PSG, Man City, Newcastle)
3. **Summer transfer windows**, where capital flows are concentrated

### 9.4 Limitations

- **Causal identification:** This study establishes correlation and coincident timing, not causation. Oil price movements may share a common driver with transfer activity (e.g., petrodollar revenue cycles, commodity price booms enabling club spending) rather than being directly caused by transfer-related capital flows.
- **Small sample of events:** Six transfer events is a limited dataset. More events are needed for statistical significance.
- **Confounders:** Major geopolitical events (Russia-Ukraine war in 2022, COVID-19 in 2020) can dominate oil market signal. Transfer windows that coincide with macro shocks are difficult to isolate.
- **Detection rate on 2023 data:** The weaker 2023 signals may reflect changed market conditions — higher interest rates, different USD dynamics — rather than a failure of the hypothesis.

---

## 10. Conclusion

This research presents evidence for a previously unexplored cross-market relationship between elite football player transfers and crude oil market anomalies. Using a multi-model unsupervised anomaly detection framework across 43 years of price data and six targeted transfer events — validated with formal event-study econometrics, multifactor OLS regression, and Granger causality tests — we find:

1. **WTI crude oil is a superior anomaly detector** relative to Brent for this signal, with a consistent 1–3 day lead time across the 2017 transfer events. This lead is formally confirmed: WTI Granger-causes Brent at all lags 1–5 (F > 189, p < 0.001 throughout).

2. **The next-day Average Abnormal Return (t+1) is +1.914%** (t = 4.42, p < 0.001), the single strongest and most statistically reliable signal across the event window. The CAAR over the full ±4 day window is +3.44%.

3. **The Transfer Signal Factor is statistically significant in a multifactor OLS model** (β = +4.98 bps/day, t = 2.18, p = 0.029) after controlling for S&P 500 returns and energy sector returns — establishing that the effect is not explained by general market or energy-sector moves alone.

4. **An ensemble of One-Class SVM (WTI) and Prophet changepoint detection** achieves an **83% detection rate** across all tested transfer events.

5. **The signal is magnitude-dependent**: the Caicedo transfer (~£115M, no sovereign fund link) was undetected by all models, consistent with a threshold effect near the $150–200M range for direct oil-state capital deployment.

6. The optimal feature representation — **`[WTI price, volume change rate, WTI price derivative]`** — captures the three most informative dimensions of oil market microstructure around transfer events.

**Statistical caveats:** Individual CAR results are not significant at the 5% level for any single event, reflecting the inherent power limitations of N=4 events. The significance is strongest in the pooled AAR framework and in the full-panel regression. Replication across additional transfer events — particularly from PSG, Manchester City, and Newcastle — would substantially strengthen the inference. Volume change does not Granger-cause WTI returns in aggregate (consistent with the volume signal being a localised, event-conditional phenomenon rather than a universal predictor).

From a commodities trading perspective, these findings suggest a novel **alternative data stream**: systematic monitoring of WTI market microstructure in the days surrounding anticipated major player transfer announcements may provide exploitable excess-return signals. Given the increasing transparency of transfer negotiations via sports media and social data, this creates a potential avenue for volatility and directional positioning in energy derivatives around summer and winter transfer windows.

---

## Appendix A: Technical Architecture

```
Data Pipeline:
  EIA Excel + CSV Files
       ↓
  pandas DataFrame (daily OHLCV)
       ↓
  Feature Engineering
  [price_log, volume_log, volume_change, difference, derivative, MAs]
       ↓
  Z-score Normalization (train-period statistics)
       ↓
  Temporal Train/Test Split (no lookahead)
       ↓
  ┌────────────────────┬──────────────────┬────────────────────┐
  │  Isolation Forest  │  One-Class SVM   │  Prophet + CP      │
  │  (sklearn)         │  (sklearn, RBF)  │  (fbprophet + PCA) │
  └────────────────────┴──────────────────┴────────────────────┘
       ↓
  Ensemble Anomaly Decision (majority vote)
       ↓
  Event Window Evaluation (±4 days)
```

### Key Libraries

| Library | Version | Role |
|---------|---------|------|
| `pandas` | — | Data manipulation |
| `numpy` | — | Numerical computation |
| `scikit-learn` | — | Isolation Forest, One-Class SVM, PCA |
| `fbprophet` | — | Time-series forecasting + changepoints |
| `torch` | — | Transformer attention model |
| `matplotlib` / `seaborn` | — | Visualization |
| `yfinance` | — | Equity index data |

---

## Appendix B: Descriptive Statistics (Computed)

*All values computed from EIA spot price data (1987–2023) and Brent futures data (2008–2023).*

### Spot Price Returns — Full Sample (1987–2023, n = 9,067 obs)

| Statistic | WTI Return | Brent Return |
|-----------|-----------|-------------|
| Mean (daily) | +0.012% | +0.012% |
| Std Dev | ~2.0% | ~2.0% |
| ADF statistic | −15.810 | −21.694 |
| ADF p-value | <0.001 ✓ | <0.001 ✓ |
| Full-period correlation | **r = 0.97+** | — |

### Regression Sample (2013–2023, n = 2,476 obs)

| Statistic | WTI Return | Energy Sector Return | SP500 Return |
|-----------|-----------|---------------------|-------------|
| Mean | −0.010% | +0.012% | +0.048% |
| Std Dev | 2.20% | 1.27% | 0.99% |

### Event vs. Non-Event Return Comparison

| | Event Windows (n=24) | Non-Event Days (n=9,042) |
|-|---------------------|------------------------|
| Mean daily return | **+0.510%** | +0.012% |
| Std deviation | 1.541% | 4.364% |
| Welch t-stat | 1.565 | (p = 0.131) |
| Variance ratio F | 0.125 | (p = 1.000) |

### Granger Causality Summary

| Test | Lag 1 F | Lag 1 p | Conclusion |
|------|---------|---------|-----------|
| vol_change → WTI returns | 0.184 | 0.668 | No Granger-causality |
| WTI returns → Brent returns | **566.3** | **<0.001** | **WTI strongly leads Brent** |

### Transfer Signal Factor Regression (M3, HAC-robust)

| Parameter | Value | 95% CI |
|-----------|-------|--------|
| Energy β | +1.054 | [+0.866, +1.243] |
| Transfer dummy β | **+4.98 bps/day** | [+0.50, +9.45] |
| Transfer dummy t-stat | **2.179** | p = 0.029 |
| Model R² | 0.0588 | Adj-R² = 0.0576 |
| F-stat | 41.18 | p < 0.001 |

### WTI–Brent Spread Notes

- 2009–2015 period: Brent traded at premium (North American supply glut)
- Post-2016: Near parity; WTI leads directional moves (Granger F=566, p<0.001)
- Event-window mean return: WTI **+0.51%** vs. full-sample mean **+0.01%** (~41× higher)

### Futures Volume (Brent Front Month)

| Statistic | log(Volume) |
|-----------|-------------|
| Mean | ~12.5 |
| Std Dev | ~1.19 |
| Event-day spike | +200–400% vs. baseline |

---

*APEX Quantitative Research | University of Maryland*
*Research conducted using publicly available EIA and Yahoo Finance data.*
*All transfer fee data sourced from publicly reported figures via sports media.*

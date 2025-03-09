class StatsAggregator {
  statsMap = {};
  hasNewStats = false;
  turns = 0;
  constructor() {
  }
  addStat(stat) {
    const [service, metric, value] = stat;
    if (!service || !metric || value <= 0) {
      return;
    }
    if (!this.statsMap[service]) {
      this.statsMap[service] = {};
    }
    const timeseries = [
      ...this.statsMap[service][metric]?.timeseries || [],
      value
    ];
    const median = timeseries.reduce((acc, curr) => acc + curr, 0) / timeseries.length;
    const high = timeseries.reduce((acc, curr) => Math.max(acc, curr), 0);
    const low = timeseries.reduce((acc, curr) => Math.min(acc, curr), Infinity);
    this.statsMap[service][metric] = {
      latest: value,
      timeseries,
      median,
      high,
      low
    };
    this.hasNewStats = true;
  }
  getStats() {
    if (this.hasNewStats) {
      this.hasNewStats = false;
      return this.statsMap;
    } else {
      return null;
    }
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: StatsAggregator
}, Symbol.toStringTag, { value: "Module" }));
export {
  StatsAggregator as S,
  _page as _
};

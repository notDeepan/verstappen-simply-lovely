// Local-only audit instrumentation. No analytics, no network reporting.
const metrics = { cls: 0, longTasks: 0, maxLongTaskMs: 0 };
const publish = () => {
  let output = document.querySelector("#qa-metrics");
  if (!output) {
    output = document.createElement("output");
    output.id = "qa-metrics";
    output.hidden = true;
    document.body.append(output);
  }
  const resources = performance.getEntriesByType("resource");
  output.textContent = JSON.stringify({
    ...metrics,
    domReadyMs: Math.round(
      performance.getEntriesByType("navigation")[0]?.domContentLoadedEventEnd ??
        0,
    ),
    transferBytes: resources.reduce((total, e) => total + e.transferSize, 0),
    resources: resources.length,
  });
};
for (const type of [
  "paint",
  "largest-contentful-paint",
  "layout-shift",
  "longtask",
]) {
  if (!PerformanceObserver.supportedEntryTypes.includes(type)) continue;
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      if (type === "paint") metrics[e.name] = Math.round(e.startTime);
      if (type === "largest-contentful-paint")
        metrics.lcpMs = Math.round(e.startTime);
      if (type === "layout-shift" && !e.hadRecentInput) metrics.cls += e.value;
      if (type === "longtask") {
        metrics.longTasks++;
        metrics.maxLongTaskMs = Math.max(
          metrics.maxLongTaskMs,
          Math.round(e.duration),
        );
      }
    }
    if (document.body) publish();
  }).observe({ type, buffered: true });
}
window.addEventListener("load", () => {
  publish();
  const script = document.createElement("script");
  script.src = "node_modules/axe-core/axe.min.js";
  script.onload = async () => {
    const results = await axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
      },
    });
    const output = document.createElement("output");
    output.id = "qa-accessibility";
    output.hidden = true;
    output.textContent = JSON.stringify({
      violations: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
      passes: results.passes.length,
      incomplete: results.incomplete.map((v) => v.id),
    });
    document.body.append(output);
    publish();
  };
  document.head.append(script);
});

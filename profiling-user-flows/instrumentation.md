# Instrumentation Snippets

JS code to inject via `mcp__chrome-devtools__evaluate_script` before and after the profiled interaction.

## Before Interaction: Install Tracking

Inject this as a single `evaluate_script` call to set up all observers:

```js
() => {
  // Long Task Observer — captures main thread blocks >50ms
  window.__perf = {
    longTasks: [],
    startTime: null,
    mutationCount: 0,
    firstMutationTime: null,
    lastMutationTime: null,
    networkRequests: [],
  };

  try {
    const ltObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__perf.longTasks.push({
          duration: entry.duration,
          startTime: entry.startTime,
          name: entry.name,
        });
      }
    });
    ltObserver.observe({ entryTypes: ["longtask"] });
    window.__perf._ltObserver = ltObserver;
  } catch (e) {
    // longtask observer not supported in all browsers
  }

  // Mutation Observer — tracks when DOM first/last changes
  const mutObserver = new MutationObserver((mutations) => {
    const now = performance.now();
    window.__perf.mutationCount += mutations.length;
    if (!window.__perf.firstMutationTime) {
      window.__perf.firstMutationTime = now;
    }
    window.__perf.lastMutationTime = now;
  });
  mutObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });
  window.__perf._mutObserver = mutObserver;

  // Network watcher — track fetch/XHR during the flow
  const origFetch = window.fetch;
  window.fetch = function (...args) {
    const url =
      typeof args[0] === "string" ? args[0] : (args[0]?.url ?? "(unknown)");
    const start = performance.now();
    return origFetch.apply(this, args).then((res) => {
      window.__perf.networkRequests.push({
        url: url.substring(0, 120),
        duration: (performance.now() - start).toFixed(0) + "ms",
        status: res.status,
      });
      return res;
    });
  };
  window.__perf._origFetch = origFetch;

  return "instrumentation installed";
};
```

## Before Interaction: Start Timer

Inject immediately before driving the interaction:

```js
() => {
  window.__perf.startTime = performance.now();
  window.__perf.longTasks = [];
  window.__perf.mutationCount = 0;
  window.__perf.firstMutationTime = null;
  window.__perf.lastMutationTime = null;
  window.__perf.networkRequests = [];
  performance.mark("flow-start");
  return "timer started at " + window.__perf.startTime;
};
```

## After Interaction: Collect Measurements

Inject after the flow completes (expected text/element has appeared):

```js
() => {
  performance.mark("flow-end");
  performance.measure("flow-duration", "flow-start", "flow-end");

  const p = window.__perf;
  const elapsed = performance.now() - p.startTime;
  const measure = performance.getEntriesByName("flow-duration")[0];

  // DOM stats
  const domCount = document.querySelectorAll("*").length;
  const domDepth = (() => {
    let max = 0;
    const walk = (el, depth) => {
      if (depth > max) max = depth;
      for (const child of el.children) walk(child, depth + 1);
    };
    walk(document.documentElement, 0);
    return max;
  })();

  // Clean up
  if (p._ltObserver) p._ltObserver.disconnect();
  if (p._mutObserver) p._mutObserver.disconnect();
  if (p._origFetch) window.fetch = p._origFetch;

  return {
    totalElapsed: elapsed.toFixed(0) + "ms",
    measureDuration: measure ? measure.duration.toFixed(0) + "ms" : "n/a",
    longTasks: {
      count: p.longTasks.length,
      totalDuration:
        p.longTasks.reduce((s, t) => s + t.duration, 0).toFixed(0) + "ms",
      longest: p.longTasks.length
        ? Math.max(...p.longTasks.map((t) => t.duration)).toFixed(0) + "ms"
        : "0ms",
      tasks: p.longTasks.map((t) => ({
        duration: t.duration.toFixed(0) + "ms",
        relativeStart: (t.startTime - p.startTime).toFixed(0) + "ms",
      })),
    },
    domMutations: {
      count: p.mutationCount,
      firstMutationDelay: p.firstMutationTime
        ? (p.firstMutationTime - p.startTime).toFixed(0) + "ms"
        : "none",
      lastMutationDelay: p.lastMutationTime
        ? (p.lastMutationTime - p.startTime).toFixed(0) + "ms"
        : "none",
    },
    dom: {
      elementCount: domCount,
      maxDepth: domDepth,
    },
    network: p.networkRequests,
  };
};
```

## Optional: CPU Throttling

To simulate slower hardware (closer to real user devices), use `mcp__chrome-devtools__emulate` with `cpuThrottlingRate: 4` before starting the trace. This 4x slowdown approximates a mid-range mobile device. Reset with `cpuThrottlingRate: 1` after.

import { httpRequestCount, httpRequestDurationMicroseconds, inProgressRequests } from '../pages/api/metrics';

const withMetrics = (handler) => async (req, res) => {
  const startEpoch = Date.now();

  httpRequestCount.inc({ method: req.method, route: req.url, statusCode: res.statusCode });
  inProgressRequests.inc({ method: req.method, route: req.url });

  // Run the handler and wait for it to finish
  await handler(req, res);

  const responseTimeInMs = Date.now() - startEpoch;
  httpRequestDurationMicroseconds.observe({ method: req.method, route: req.url, code: res.statusCode }, responseTimeInMs);

  inProgressRequests.dec({ method: req.method, route: req.url });
};

export default withMetrics;
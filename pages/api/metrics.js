import { Counter, Gauge, Histogram, register } from 'prom-client';

// Check if the counter has already been registered
let httpRequestCount;
if (!register.getSingleMetric('http_requests_total')) {
  httpRequestCount = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'statusCode'],
  });
  register.registerMetric(httpRequestCount);
} else {
  httpRequestCount = register.getSingleMetric('http_requests_total');
}

// Check if the counter has already been registered
let httpRequestDurationMicroseconds;
if (!register.getSingleMetric('http_request_duration_ms')) {
  httpRequestDurationMicroseconds = new Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
  });
  register.registerMetric(httpRequestDurationMicroseconds);
} else {
  httpRequestDurationMicroseconds = register.getSingleMetric('http_request_duration_ms');
}

// Check if the counter has already been registered
let inProgressRequests;
if (!register.getSingleMetric('in_progress_requests')) {
  inProgressRequests = new Gauge({
    name: 'in_progress_requests',
    help: 'In progress requests',
    labelNames: ['method', 'route']
  });
  register.registerMetric(inProgressRequests);
} else {
  inProgressRequests = register.getSingleMetric('in_progress_requests');
}

export { httpRequestCount, httpRequestDurationMicroseconds, inProgressRequests };

export default async (req, res) => {
  if (req.method === 'GET') {
    res.setHeader('Content-Type', register.contentType);
    try {
      const metrics = await register.metrics();
      res.end(metrics);
    } catch (err) {
      res.status(500).end();
    }
  } else {
    res.status(405).end();
  }
};
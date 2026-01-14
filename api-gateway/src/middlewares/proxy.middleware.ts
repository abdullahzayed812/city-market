import { createProxyMiddleware } from "http-proxy-middleware";

export const setupProxy = (basePath: string, targetUrl: string) => {
  return createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
      [`^${basePath}`]: "/",
    },
    on: {
      proxyReq: (proxyReq: any, req: any, res: any) => {
        if (req.headers.authorization) {
          proxyReq.setHeader("Authorization", req.headers.authorization);
        }

        if (req.body && Object.keys(req.body).length > 0) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      },
      error: (err: any, req: any, res: any) => {
        console.error(`Proxy error for ${req.path} to ${targetUrl}:`, err);
        res.status(500).send("Proxy error");
      },
    },
  });
};

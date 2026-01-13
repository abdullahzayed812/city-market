import { createApp } from "./app";
import { config } from "./config/env";
import { Logger } from "@city-market/shared";

const app = createApp();

app.listen(config.port, () => {
  Logger.info(`User Service running on port ${config.port}`);
});

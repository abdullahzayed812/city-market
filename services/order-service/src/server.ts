import { createApp } from "./app";
import { config } from "./config/env";
import { Logger, rabbitMQBus } from "@city-market/shared";

const app = createApp();

app.listen(config.port, async () => {
  await rabbitMQBus.connect();
  Logger.info(`Order Service running on port ${config.port}`);
});

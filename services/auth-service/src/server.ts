import { createApp } from "./app";
import { config } from "./config/env";
import { Logger } from "../../shared/utils/logger";

const app = createApp();

app.listen(config.port, () => {
  Logger.info(`Auth Service running on port ${config.port}`);
});

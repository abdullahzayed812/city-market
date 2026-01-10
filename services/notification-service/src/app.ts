import express from "express";
import { NotificationService } from "./application/services/notification.service";
import { eventBus } from "../../shared/events/event-bus";

export const createApp = () => {
  const app = express();

  app.use(express.json());

  // Initialize notification service (subscribes to events)
  new NotificationService(eventBus);

  app.get("/health", (req, res) => {
    res.json({ status: "healthy", service: "notification-service" });
  });

  return app;
};

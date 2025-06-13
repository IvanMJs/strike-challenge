import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { config } from "./config/environment";
import { errorHandler } from "./api/middleware/errorHandler";
import { vulnerabilityRoutes } from "./api/routes/vulnerabilityRoutes";
import { authRoutes } from "./api/routes/authRoutes";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "Accept",
      "X-Requested-With",
    ],
    credentials: true,
    exposedHeaders: ["Content-Length", "X-Requested-With"],
  })
);

app.options("*", cors());

app.use(
  express.json({
    verify: (req: Request, res: Response, buf: Buffer, encoding: string) => {
      try {
        JSON.parse(buf.toString());
      } catch (e) {
        res.status(400).json({
          message: "Invalid JSON format",
          error: "Bad Request",
        });
        throw new Error("Invalid JSON format");
      }
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/vulnerabilities", vulnerabilityRoutes);

app.use(errorHandler);

export default app;

import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import cors from "cors";

const app = express();
const port = process.env.PORT;

const allowedOrigins = [
  "http://localhost:5173",
  "https://todo-theta-ten-91.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin
      if (!origin) return callback(null, true);

      // Allow exact matches
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow all Vercel preview deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(
  express.urlencoded({
    extended: true, // support rich objects
    limit: "1mb",
  }),
);

app.use(express.json());

app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

app.listen(port, () => {
  console.log("server is listening ");
});

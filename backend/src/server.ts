import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import authRoutes from "./routes/authRoutes";
import todoRoutes from "./routes/todoRoutes";
import cors from "cors";

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
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
  console.log("listening on port:", port);
});

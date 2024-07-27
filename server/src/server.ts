import express from "express";
import cors from "cors";

import authRoute from "./routes/auth.route";
import jobRoute from "./routes/job.route";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoute);
app.use("/api/jobs", jobRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

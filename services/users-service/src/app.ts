import express from "express";

import { errorHandler } from "./middlewares/errorHandler.js";
import healthRoutes from "./routes/health.routes.js";
import usersRoutes from "./routes/users.routes.js";

const app = express();

app.use(express.json());

app.use(healthRoutes);
app.use(usersRoutes);

app.use(errorHandler);

export default app;

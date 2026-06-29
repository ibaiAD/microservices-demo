import express from "express";
import healthRoutes from "./routes/health.routes.js";
import usersRoutes from "./routes/users.routes.js";

const app = express()

app.use(express.json())

app.use(healthRoutes)
app.use(usersRoutes)

export default app
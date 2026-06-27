import express from "express";

const app = express()

app.use(express.json())

app.get("/health", (_req, res) => {
  res.json({
    service: "users-service",
    status: "OK",
  })
})

export default app
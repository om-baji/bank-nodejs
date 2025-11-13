import express from "express";
import router from "./routes/manager.routes";

const app = express()

app.use(express.json())

app.use("/api/manager", router);

app.listen(3003, () => console.log("Accout Service running!"))
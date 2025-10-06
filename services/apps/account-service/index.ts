import express from "express";
import router from "./routes/account.routes";

const app = express()

app.use(express.json())

app.use("/api/account", router);

app.listen(3000, () => console.log("Accout Service running!"))
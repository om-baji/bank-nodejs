import express from "express";
import router from "./routes/user.routes";

const app = express()

app.use(express.json())

app.use("/api/user", router);

app.listen(7000, () => console.log("Accout Service running!"))
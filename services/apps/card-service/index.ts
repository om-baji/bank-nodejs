import express from "express";
import router from "./routes/card.routes";

const app = express()

app.use(express.json())

app.use("/api/card", router);

app.listen(5000, () => console.log("Card Service running!"))
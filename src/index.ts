import { AppDataSource } from "./data-source";
import express from "express";
import cors from "cors";

import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import medicamentosRouter from "./routes/medicamentos.routes";


const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/login", authRouter);
app.use("/medicamentos", medicamentosRouter);

AppDataSource.initialize()
  .then(async () => {
    app.listen(3000, () => {
      console.log("Servidor rodando na porta http://localhost:3000");
    });
  })
  .catch((error) => console.log(error));

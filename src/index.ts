import { AppDataSource } from "./data-source";
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

AppDataSource.initialize()
  .then(async () => {
    app.listen(3000, () => {
      console.log("Servidor rodando na porta http://localhost:3000");
    });
  })
  .catch((error) => console.log(error));

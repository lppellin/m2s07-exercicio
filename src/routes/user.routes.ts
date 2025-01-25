import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import authToken from "../middlewares/auth";

const userRouter = Router();
const userRepository = AppDataSource.getRepository(User);

userRouter.post("/", authToken, async (req: Request, res: Response) => {
  try {
    const userBody = req.body;

    if (!userBody || !userBody.email || !userBody.nome || !userBody.senha) {
      res.status(400).json("Preencha todos os dados!");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(userBody.senha, salt);
    userBody.senha = senhaHash;

    await userRepository.save(userBody);
    res.status(201).json(userBody);
  } catch (error) {
    if (error.code === "23505") {
      // Código de erro para violação de restrição unique do Postgre
      res.status(400).json({ error: "O email já está em uso." });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

export default userRouter;

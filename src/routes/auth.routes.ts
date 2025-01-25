import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import authToken from "../middlewares/auth";

const authRouter = Router();
const userRepository = AppDataSource.getRepository(User);

authRouter.post("/", authToken, async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      res.status(400).json("Email e senha são obrigatórios!");
      return;
    }

    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      res.status(401).json("Usuário e/ou senha incorreta!");
      return;
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (isPasswordValid) {
      res.status(200).json({ userId: user.id });
      return;
    }
  } catch (error) {
    res.status(500).json("Não foi possível executar a solicitação!");
  }
});

export default authRouter;
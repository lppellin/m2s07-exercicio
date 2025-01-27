import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import { Medicamento } from "../entity/Medicamento";
import authToken from "../middlewares/auth";

const medicamentosRouter = Router();

const medicamentoRepository = AppDataSource.getRepository(Medicamento);

medicamentosRouter.post("/", authToken, async (req: Request, res: Response) => {
  try {
    const medBody = req.body as Medicamento;

    if (
      !medBody ||
      !medBody.nome ||
      !medBody.quantidade ||
      !medBody.userId ||
      !medBody.descricao
    ) {
      res.status(400).json("Preencha todos os dados!");
      return;
    }
    await medicamentoRepository.save(medBody);
    res.status(201).json(medBody);
  } catch (ex) {
    res.status(500).json("Não foi possível executar a solicitação!");
  }
});

medicamentosRouter.get("/", authToken, async (req: Request, res: Response) => {
  try {
    const medicamentos = await medicamentoRepository.find();

    res.status(200).json(medicamentos);
  } catch (ex) {
    res.status(500).json("Não foi possível executar a solicitação!");
  }
});

medicamentosRouter.get(
  "/:id",
  authToken,
  async (req: Request, res: Response) => {
    try {
      const medicamento = await medicamentoRepository.findOne({
        where: {
          id: Number(req.params.id),
        },
      });

      if (!medicamento) {
        res.status(404).json("Medicamento não encontrado!");
        return;
      }

      res.status(200).json(medicamento);
    } catch (ex) {
      res.status(500).json("Não foi possível executar a solicitação!");
    }
  }
);

medicamentosRouter.put(
  "/:id",
  authToken,
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const userId = Number(req.headers.userid);

      if (!userId) {
        res.status(400).json("Será necessário informar o userId no header");
        return;
      }

      const medBody = req.body as Medicamento;

      const medicamento = await medicamentoRepository.findOne({
        where: { id: id, userId: userId },
      });

      if (!medicamento) {
        res.status(200).json("Nenhum medicamento encontrado!");
        return;
      }

      Object.assign(medicamento, medBody);

      await medicamentoRepository.save(medicamento);

      res.status(200).json(medicamento);
    } catch (ex) {
      res.status(500).json("Não foi possível executar a solicitação!");
    }
  }
);

medicamentosRouter.delete(
  "/:id",
  authToken,
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const userId = Number(req.headers.userid);

      if (!userId) {
        res.status(400).json("Será necessário informar o userId no header");
        return;
      }

      const medicamento = await medicamentoRepository.findOne({
        where: { id: id, userId: userId },
      });

      if (!medicamento) {
        res.status(200).json("Nenhum medicamento encontrado!");
        return;
      }

      await medicamentoRepository.remove(medicamento);

      res.status(200).json("Medicamento removido com sucesso!");
    } catch (ex) {
      res.status(500).json("Não foi possível executar a solicitação!");
    }
  }
);

export default medicamentosRouter;

import { NextFunction, Request, Response } from "express";

const authToken = async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.senha == "1234") {
    next();
    return;
  }
  res.status(401).json("Acesso negado!");
};

export default authToken;

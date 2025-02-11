import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(401).json("Acesso não autorizado");
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.body.userId = decoded;

    next();
  } catch (error) {
    res.status(401).json("Token inválido");
  }
};

export default authToken;

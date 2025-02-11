import { NextFunction, Request, Response } from "express";

const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.body.userId;

      if (!user || !user.role) {
        return res.status(403).json("Acesso negado: Nenhuma role encontrada");
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json("Acesso negado: Permissão insuficiente");
      }

      next();
    } catch (error) {
      return res.status(500).json("Erro na verificação de permissões");
    }
  };
};

export default authorizeRole;

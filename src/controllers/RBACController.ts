import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Permission } from "../entity/Permission";
import { Role } from "../entity/Role";
import { User } from "../entity/User";

export class RBACController {
  private userRepository = AppDataSource.getRepository(User);
  private roleRepository = AppDataSource.getRepository(Role);
  private permissionRepository = AppDataSource.getRepository(Permission);

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.roleRepository = AppDataSource.getRepository(Role);
    this.permissionRepository = AppDataSource.getRepository(Permission);
  }

  listPermissions = async (req: Request, res: Response) => {
    try {
      const permissions = await this.permissionRepository.find({
        relations: ["roles"],
      });
      res.status(200).json(permissions);
    } catch (error) {
      res.status(500).json("Erro ao processar a requisição");
    }
  };

  createPermission = async (req: Request, res: Response) => {
    try {
      const permissionBody = req.body as Permission;
      if (!permissionBody.descricao) {
        res.status(400).json("A descrição da permissão é obrigatória");
        return;
      }
      await this.permissionRepository.save(permissionBody);
      res.status(201).json("Permissão criada com sucesso");
    } catch (error) {
      res.status(500).json("Erro ao processar a requisição");
    }
  };

  listRoles = async (req: Request, res: Response) => {
    try {
      const roles = await this.roleRepository.find({
        relations: ["permissions"],
      });
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json("Erro ao processar a requisição");
    }
  };

  createRole = async (req: Request, res: Response) => {
    try {
      const roleBody = req.body as Role;
      if (!roleBody.descricao) {
        res.status(400).json("A descrição da role é obrigatória");
        return;
      }
      await this.roleRepository.save(roleBody);
      res.status(201).json("Role criada com sucesso");
    } catch (error) {
      res.status(500).json("Erro ao processar a requisição");
    }
  };

  listPermissionsByRole = async (req: Request, res: Response) => {
    try {
      const { roleId } = req.params;
      const role = await this.roleRepository.findOne({
        where: { id: Number(roleId) },
        relations: ["permissions"],
      });
      if (!role) {
        res.status(404).json("Role não encontrada");
        return;
      }
      res.status(200).json(role.permissions);
    } catch (error) {
      res.status(500).json("Erro ao processar a requisição");
    }
  };

  addPermissionToRole = async (req: Request, res: Response) => {
    try {
      const permissionRoleBody = req.body as {
        permissionId: number;
        roleId: number;
      };

      if (!permissionRoleBody.permissionId || !permissionRoleBody.roleId) {
        res.status(400).json("Os ids da permissão e da role são obrigatórios");
        return;
      }

      const permission = await this.permissionRepository.findOne({
        where: { id: permissionRoleBody.permissionId },
      });

      if (!permission) {
        res.status(404).json("Permissão não encontrada");
        return;
      }

      const role = await this.roleRepository.findOne({
        where: { id: permissionRoleBody.roleId },
        relations: ["permissions"],
      });

      if (!role) {
        res.status(404).json("Role não encontrada");
        return;
      }

      role.permissions.push(permission);
      await this.roleRepository.save(role);
      res.status(200).json(role);
    } catch (error) {
      res.status(500).json("Erro ao processar a requisição");
    }
  }

  addRoleToUser = async (req: Request, res: Response) => {
    try {
      const userRoleBody = req.body as {
        userId: number;
        roleId: number;
      };

      if (!userRoleBody.userId || !userRoleBody.roleId) {
        res.status(400).json("Os ids do usuário e da role são obrigatórios");
        return;
      }

      const role = await this.roleRepository.findOne({
        where: { id: userRoleBody.roleId },
      });

      if (!role) {
        res.status(404).json("Role não encontrada");
        return;
      }

      const user = await this.userRepository.findOne({
        where: { id: userRoleBody.userId },
        relations: ["roles"],
      });

      if (!user) {
        res.status(404).json("Usuário não encontrado");
        return;
      }

      user.roles.push(role);
      await this.userRepository.save(user);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json("Erro ao processar a requisição");
    }
  }

}

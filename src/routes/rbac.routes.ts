import { Router } from "express";
import RBACController from "../controllers/RBACController";
import authorizeRole from "../middlewares/authorizeRole";

const rbacRouter = Router();

rbacRouter.get("/permissions", RBACController.listPermissions);
rbacRouter.post("/permissions", RBACController.createPermission);
rbacRouter.get("/roles/:id/permissions", RBACController.listPermissionsByRole);

rbacRouter.get("/roles", RBACController.listRoles);
rbacRouter.post("/roles", RBACController.createRole);
rbacRouter.post("/roles/permissions", RBACController.addPermissionToRole);
rbacRouter.post("/users/roles", RBACController.addRoleToUser);

export default rbacRouter;

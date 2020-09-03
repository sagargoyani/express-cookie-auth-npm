import { Router } from "express";
import UsersController from "../controllers/UsersController";
import authServer from "auth-server-jwt";

const router = Router();

router.get("/users", authServer.check, UsersController.index);

export default router;

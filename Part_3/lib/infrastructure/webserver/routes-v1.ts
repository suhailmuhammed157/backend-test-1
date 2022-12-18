import { Router } from "express";

import AuthRoutes from "../../interfaces/routes/v1/auth";
import UsersRoutes from "../../interfaces/routes/v1/users";
import PostsRoutes from "../../interfaces/routes/v1/posts";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/users", UsersRoutes);
router.use("/posts", PostsRoutes);

export default router;

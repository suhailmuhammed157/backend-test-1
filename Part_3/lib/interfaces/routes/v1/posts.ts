import { Router } from "express";
import PostController from "../../controllers/PostController";

import AuthenticationMiddleware from "../../middlewares/AuthenticationMiddleware";

const router = Router();

router.get("/", PostController.findPosts);
router.get("/:id", PostController.getPost);
router.post("", PostController.createPost);
router.patch("/:id", PostController.updatePost);
router.delete("/:id", PostController.deletePost);

export default router;

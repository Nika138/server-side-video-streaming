import express from "express";
import videoController from "../controllers/videoController.js";

const router = express.Router();

router.get("/:videoName", videoController.streamVideo);

export default router;

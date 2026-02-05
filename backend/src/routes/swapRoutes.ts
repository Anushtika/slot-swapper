import { Router } from "express";
import { createSwap, getSwaps, getSwapById, acceptSwap, rejectSwap, cancelSwap } from "../controllers/swapController";

const router = Router();

router.post("/", createSwap);
router.get("/", getSwaps);
router.get("/:id", getSwapById);
router.put("/:id/accept", acceptSwap);
router.put("/:id/reject", rejectSwap);
router.put("/:id/cancel", cancelSwap);

export default router;
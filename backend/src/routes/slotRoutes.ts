import { Router } from "express";
import { createSlot, getSlots, getSlotById, updateSlot, deleteSlot } from "../controllers/slotController";

const router = Router();

// IMPORTANT: Put /mine BEFORE /:id, otherwise "mine" will be treated as an ID!
router.get("/mine", getSlots); // This will get current user's slots
router.post("/", createSlot);
router.get("/", getSlots);
router.get("/:id", getSlotById);
router.put("/:id", updateSlot);
router.delete("/:id", deleteSlot);

export default router;
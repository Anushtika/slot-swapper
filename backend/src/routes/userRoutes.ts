import { Router } from "express";
import { getMe, getUserCalendar } from "../controllers/userController";

const router = Router();

router.get("/me", getMe);
router.get("/:id/calendar", getUserCalendar);

export default router;
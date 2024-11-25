import express from "express"
import { checkAuth, login, logout, signup, updatedProfile } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/signup", signup )
router.post("/login", login )
router.post("/logout", logout )

router.put("/update-profile",protectRoute, updatedProfile) //per uploadare un profilo, ci sarà la chiamata prima alla funzione protectedroute e successivamente con next, si andrà all'altro middleware
router.get("/check", protectRoute, checkAuth)

export default router
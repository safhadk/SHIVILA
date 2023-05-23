import express from "express";
import { Register,Login,Profile } from "../controller/user.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post('/register',Register)
router.post('/login',Login)
router.get('/profile',verifyToken,Profile)


export default router;

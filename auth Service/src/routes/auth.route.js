import express from 'express'
import * as authController from '../controllers/auth.controller.js'
import * as authMiddleware from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/register', authController.registerController)
router.post('/login', authController.loginController)
router.get('/me', authMiddleware.authMiddleware ,authController.getCurrentUser)
router.get('/logout',authController.logoutController)

export default router
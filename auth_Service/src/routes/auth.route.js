import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';

import { registerValidation } from '../middlewares/auth.validation.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

router.post('/register',registerValidation,validate,authController.registerController);

router.post('/login', authController.loginController);

router.get('/me',authMiddleware.authMiddleware,authController.getCurrentUser);

router.get('/logout', authController.logoutController);

export default router;
/*
{
    "username":"test",
    "email": "test@test.com",
    "password": "test12",
    "fullname": {
        "firstname": "test",
        "lastname": "last"
    },
    "role": "user"
} */
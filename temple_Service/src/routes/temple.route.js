import express from "express";
import * as templeController from "../controllers/temple.controller.js";
import * as authMiddleware from "../middlewares/auth.middleware.js";
import * as adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();

//Protected routes
router.post( "/",authMiddleware.authMiddleware,adminMiddleware.adminMiddleware,templeController.createTemple);

router.patch('/:slug/verify',authMiddleware.authMiddleware,adminMiddleware.adminMiddleware,templeController.verifyTemple);

router.put('/:slug',authMiddleware.authMiddleware,adminMiddleware.adminMiddleware,templeController.updateTemple);

router.delete('/:slug',authMiddleware.authMiddleware,adminMiddleware.adminMiddleware,templeController.deleteTemple);

//Public routes
router.get("/", templeController.getAllTemples);

router.get("/search", templeController.searchTemples);

router.get("/featured", templeController.getFeaturedTemples);

router.get("/stats", templeController.getTempleStats);

// Dynamic route ALWAYS LAST
router.get("/:slug", templeController.getTempleBySlug);

export default router;

import { body, validationResult } from 'express-validator';

export const createTempleValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Temple name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 to 100 characters'),

    body('location.state')
        .trim()
        .notEmpty().withMessage('State is required'),

    body('location.city')
        .trim()
        .notEmpty().withMessage('City is required'),

    body('deity')
        .notEmpty().withMessage('Deity is required')
        .isIn(['Shiva', 'Vishnu', 'Krishna', 'Durga', 'Lakshmi', 'Ganesha', 'Hanuman', 'Rama', 'Other'])
        .withMessage('Invalid deity'),

    body('historicalBackground')
        .trim()
        .isLength({ min: 20 }).withMessage('Historical background must be at least 20 characters'),

    body('darshanTimings')
        .optional()
        .isArray().withMessage('Darshan timings must be an array'),

    body('festivals')
        .optional()
        .isArray().withMessage('Festivals must be an array'),

    body('visitorGuidelines.dressCode')
        .optional()
        .isString(),

    // You can add more rules as needed
];

export const updateTempleValidation = [
    body('name').optional().trim().isLength({ min: 3, max: 100 }),
    body('location.state').optional().trim().notEmpty(),
    body('location.city').optional().trim().notEmpty(),
    body('deity').optional().isIn(['Shiva', 'Vishnu', 'Krishna', 'Durga', 'Lakshmi', 'Ganesha', 'Hanuman', 'Rama', 'Other']),
    body('historicalBackground').optional().isLength({ min: 20 }),
    // Add other optional fields
];

// Middleware to check validation results
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array()
        });
    }
    next();
};
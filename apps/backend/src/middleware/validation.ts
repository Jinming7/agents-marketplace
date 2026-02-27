import { body, param, query, validationResult, ValidationChain } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

// Validation result checker
export function validate(validations: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)))
    
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    
    const formattedErrors: Record<string, string[]> = {}
    errors.array().forEach(err => {
      const key = err.type === 'field' ? err.path : 'body'
      if (!formattedErrors[key]) {
        formattedErrors[key] = []
      }
      formattedErrors[key].push(err.msg)
    })
    
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: formattedErrors
    })
  }
}

// Auth validation rules
export const authValidation = {
  register: [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
      .matches(/\d/)
      .withMessage('Password must contain at least one number')
  ],
  login: [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  refresh: [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required')
  ],
  changePassword: [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters')
      .matches(/\d/)
      .withMessage('New password must contain at least one number')
  ]
}

// App validation rules
export const appValidation = {
  getById: [
    param('id')
      .matches(/^[0-9a-f-]+$/i)
      .withMessage('Invalid app ID format')
  ],
  list: [
    query('q')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Search query too long'),
    query('category')
      .optional()
      .isString()
      .isLength({ max: 50 })
      .withMessage('Invalid category'),
    query('sort')
      .optional()
      .isIn(['installs', 'rating', 'name'])
      .withMessage('Invalid sort option')
  ]
}

// User validation rules
export const userValidation = {
  install: [
    body('appId')
      .matches(/^[0-9a-f-]+$/i)
      .withMessage('Invalid app ID format')
  ],
  uninstall: [
    param('appId')
      .matches(/^[0-9a-f-]+$/i)
      .withMessage('Invalid app ID format')
  ],
  updateProfile: [
    body('name')
      .optional()
      .isLength({ min: 1, max: 50 })
      .withMessage('Name must be between 1 and 50 characters'),
    body('bio')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Bio must be less than 500 characters'),
    body('notifications')
      .optional()
      .isBoolean()
      .withMessage('Notifications must be a boolean')
  ]
}

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';
import dns from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(dns.lookup);

// ============================================
// Security Headers Middleware
// ============================================

/**
 * Configure Helmet with comprehensive security headers
 */
// CSP configuration - stricter in production
const isProduction = process.env.NODE_ENV === 'production';
const scriptSrc = [
  "'self'",
  "https://accounts.google.com",
  "https://apis.google.com",
];

// Add unsafe-inline and unsafe-eval only in development (required for Vite)
if (!isProduction) {
  scriptSrc.push("'unsafe-inline'", "'unsafe-eval'");
}

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: scriptSrc,
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: [
        "'self'",
        process.env.CLIENT_URL,
        "https://api.nexmo.com",
        "https://api.vonage.com",
        "https://accounts.google.com",
        "https://oauth2.googleapis.com",
      ],
      frameSrc: ["'self'", "https://accounts.google.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameAncestors: ["'none'"], // Prevent clickjacking
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: isProduction ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false, // Set to true if you need COEP
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' }, // X-Frame-Options
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true, // X-Content-Type-Options
  originAgentCluster: true,
  permittedCrossDomainPolicies: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true, // X-XSS-Protection (legacy, but still useful)
});

// ============================================
// CORS Configuration (Enhanced)
// ============================================

export const corsConfig = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5174',
      process.env.CLIENT_URL,
    ].filter(Boolean);

    // Allow requests with no origin (mobile apps, Postman, etc.) in development
    if (!origin) {
      if (process.env.NODE_ENV === 'production') {
        return callback(new Error('CORS: Origin header required in production'));
      }
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      if (process.env.NODE_ENV === 'production') {
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      } else {
        console.warn(`⚠️  CORS: Allowing origin ${origin} in development`);
        callback(null, true);
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Per-Page'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// ============================================
// Rate Limiting
// ============================================

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health';
  },
});

// Strict rate limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// OTP rate limiter
export const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 OTP requests per hour
  message: 'Too many OTP requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// SSRF Protection
// ============================================

// Private IP ranges
const privateIPRanges = [
  /^127\./, // 127.0.0.0/8
  /^10\./, // 10.0.0.0/8
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
  /^192\.168\./, // 192.168.0.0/16
  /^169\.254\./, // 169.254.0.0/16 (Link-local)
  /^::1$/, // IPv6 localhost
  /^fc00:/, // IPv6 private
  /^fe80:/, // IPv6 link-local
];

// Blocked protocols
const blockedProtocols = ['file:', 'ftp:', 'gopher:', 'javascript:', 'data:', 'vbscript:'];

/**
 * Validate URL to prevent SSRF attacks
 * @param {string} url - URL to validate
 * @returns {Promise<{valid: boolean, error?: string}>}
 */
export const validateURL = async (url) => {
  try {
    if (!url || typeof url !== 'string') {
      return { valid: false, error: 'Invalid URL format' };
    }

    // Check for blocked protocols
    const lowerUrl = url.toLowerCase().trim();
    for (const protocol of blockedProtocols) {
      if (lowerUrl.startsWith(protocol)) {
        return { valid: false, error: `Protocol ${protocol} is not allowed` };
      }
    }

    // Parse URL
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      return { valid: false, error: 'Invalid URL format' };
    }

    // Only allow http and https
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { valid: false, error: 'Only HTTP and HTTPS protocols are allowed' };
    }

    // Check for private/localhost hostnames
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // Block localhost variations
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      return { valid: false, error: 'Localhost URLs are not allowed' };
    }

    // Block private IP ranges
    for (const range of privateIPRanges) {
      if (range.test(hostname)) {
        return { valid: false, error: 'Private IP ranges are not allowed' };
      }
    }

    // DNS lookup to verify hostname doesn't resolve to private IP
    try {
      const addresses = await dnsLookup(hostname, { all: true });
      for (const addr of addresses) {
        const ip = addr.address;
        for (const range of privateIPRanges) {
          if (range.test(ip)) {
            return { valid: false, error: 'Hostname resolves to private IP' };
          }
        }
      }
    } catch (dnsError) {
      // DNS lookup failed, but URL format is valid
      // Allow it but log the warning
      console.warn(`DNS lookup failed for ${hostname}:`, dnsError.message);
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

/**
 * Middleware to validate URLs in request body/query
 */
export const ssrfProtection = async (req, res, next) => {
  // Check for URL parameters in body and query
  const urlFields = ['url', 'imageUrl', 'avatar', 'callbackUrl', 'redirectUrl', 'webhookUrl'];
  
  for (const field of urlFields) {
    const urlValue = req.body[field] || req.query[field];
    if (urlValue) {
      const validation = await validateURL(urlValue);
      if (!validation.valid) {
        return res.status(400).json({
          message: 'Invalid URL',
          error: validation.error,
        });
      }
    }
  }

  next();
};

// ============================================
// XSS Protection - Input Sanitization
// ============================================

/**
 * Sanitize string input to prevent XSS
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .trim();
};

/**
 * Recursively sanitize object/array inputs
 */
export const sanitizeObject = (obj) => {
  if (typeof obj === 'string') {
    return sanitizeInput(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  
  return obj;
};

/**
 * Middleware to sanitize request body
 */
export const xssProtection = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  next();
};

// ============================================
// Request Size Limits
// ============================================

export const requestSizeLimit = {
  json: '10mb',
  urlencoded: '10mb',
};

// ============================================
// Input Validation Rules
// ============================================

export const validationRules = {
  register: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Name can only contain letters and spaces'),
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('phone')
      .trim()
      .matches(/^[0-9]{10}$/)
      .withMessage('Phone must be exactly 10 digits'),
  ],
  login: [
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  otp: [
    body('mobile')
      .trim()
      .matches(/^[0-9]{10}$/)
      .withMessage('Mobile must be exactly 10 digits'),
  ],
};

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// ============================================
// SRI (Subresource Integrity) Helper
// ============================================

/**
 * Generate SRI hash for a resource (for frontend use)
 * This is typically done at build time, but we provide a helper
 */
export const generateSRI = async (content, algorithm = 'sha384') => {
  const crypto = await import('crypto');
  const hash = crypto.createHash(algorithm).update(content).digest('base64');
  return `${algorithm}-${hash}`;
};

// ============================================
// Security Headers for SRI
// ============================================

/**
 * Add SRI-related headers
 */
export const sriHeaders = (req, res, next) => {
  // Require SRI for external scripts (enforced via CSP)
  // This is mainly handled by the CSP policy above
  res.setHeader('X-Content-Security-Policy', 'require-sri-for script style');
  next();
};

// ============================================
// Additional Security Headers
// ============================================

export const additionalSecurityHeaders = (req, res, next) => {
  // Permissions Policy (formerly Feature Policy)
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );

  // X-Permitted-Cross-Domain-Policies
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');

  // Clear-Site-Data (for logout endpoints)
  if (req.path.includes('/logout')) {
    res.setHeader('Clear-Site-Data', '"cache", "cookies", "storage"');
  }

  next();
};

// ============================================
// Request ID for tracking
// ============================================

export const requestId = (req, res, next) => {
  req.id = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader('X-Request-ID', req.id);
  next();
};

// ============================================
// Security Logging
// ============================================

export const securityLogger = (req, res, next) => {
  // Log security-relevant events
  const logSecurityEvent = (event, details) => {
    console.warn(`[SECURITY] ${event}:`, {
      requestId: req.id,
      ip: req.ip,
      path: req.path,
      method: req.method,
      userAgent: req.get('user-agent'),
      ...details,
    });
  };

  req.logSecurityEvent = logSecurityEvent;
  next();
};


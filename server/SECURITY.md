# Security Implementation Guide

This document outlines all security measures implemented in the Home Service application.

## 🔒 Security Features Implemented

### 1. Security Headers (Helmet.js)

All security headers are configured via Helmet middleware:

- **Content Security Policy (CSP)**: Prevents XSS attacks by controlling which resources can be loaded
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **Strict-Transport-Security (HSTS)**: Forces HTTPS connections
- **X-XSS-Protection**: Legacy XSS protection (for older browsers)
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Controls browser features access

### 2. SSRF (Server-Side Request Forgery) Protection

**Location**: `server/middleware/security.js`

**Protection Mechanisms**:
- ✅ URL validation before making external requests
- ✅ Blocks private IP ranges (127.0.0.1, 10.x.x.x, 192.168.x.x, etc.)
- ✅ Blocks localhost variations
- ✅ Only allows HTTP/HTTPS protocols
- ✅ Blocks dangerous protocols (file:, ftp:, javascript:, etc.)
- ✅ DNS lookup validation to prevent private IP resolution

**Usage**:
```javascript
import { validateURL } from './middleware/security.js';

const validation = await validateURL(userProvidedUrl);
if (!validation.valid) {
  return res.status(400).json({ error: validation.error });
}
```

### 3. XSS (Cross-Site Scripting) Protection

**Protection Layers**:

1. **Input Sanitization**: Automatically sanitizes all request body and query parameters
2. **CSP Headers**: Restricts script execution sources
3. **Output Encoding**: All user input is sanitized before processing

**Sanitization Rules**:
- Removes `<` and `>` characters
- Removes `javascript:` protocol
- Removes event handlers (onclick=, onerror=, etc.)
- Trims whitespace

### 4. CORS (Cross-Origin Resource Sharing)

**Enhanced Configuration**:
- ✅ Whitelist-based origin validation
- ✅ Credentials support for authenticated requests
- ✅ Preflight request handling
- ✅ Configurable allowed methods and headers
- ✅ Production vs Development mode handling

**Allowed Origins**:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative dev port)
- `CLIENT_URL` environment variable (Production frontend)

### 5. Rate Limiting

**Three Levels of Rate Limiting**:

1. **General API Limiter**: 100 requests per 15 minutes per IP
2. **Auth Limiter**: 5 requests per 15 minutes per IP (for login/register)
3. **OTP Limiter**: 3 requests per hour per IP (for OTP requests)

**Benefits**:
- Prevents brute force attacks
- Prevents DDoS attacks
- Protects against credential stuffing
- Reduces API abuse

### 6. Input Validation

**Express-Validator Integration**:

- Email validation with normalization
- Password strength requirements (min 8 chars, uppercase, lowercase, number)
- Phone number format validation (10 digits)
- Name validation (letters and spaces only, 2-50 chars)

**Validation Rules**:
```javascript
// Register validation
- name: 2-50 characters, letters and spaces only
- email: Valid email format, normalized
- password: Min 8 chars, uppercase, lowercase, number
- phone: Exactly 10 digits

// Login validation
- email: Valid email format
- password: Required

// OTP validation
- mobile: Exactly 10 digits
```

### 7. Request Size Limits

**Limits**:
- JSON body: 10MB
- URL-encoded body: 10MB

Prevents memory exhaustion attacks and large payload attacks.

### 8. SRI (Subresource Integrity)

**Frontend Helper**: `src/utils/sri.js`

SRI allows browsers to verify that external resources haven't been tampered with.

**Usage Example**:
```javascript
import { createSecureScript, generateSRIFromURL } from './utils/sri.js';

// Generate SRI hash from URL
const integrity = await generateSRIFromURL('https://cdn.example.com/script.js');

// Create secure script tag
const script = createSecureScript(
  'https://cdn.example.com/script.js',
  integrity
);
document.head.appendChild(script);
```

**Backend Support**: SRI headers are included in responses to enforce SRI for external resources.

### 9. Security Logging

All security-relevant events are logged with:
- Request ID
- IP address
- Path and method
- User agent
- Event details

### 10. Request ID Tracking

Every request gets a unique ID for tracking and debugging:
- Header: `X-Request-ID`
- Used in logs and error responses

## 📋 Security Checklist

### Before Deployment

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (min 32 characters, random)
- [ ] Configure `CLIENT_URL` with production frontend URL
- [ ] Review and update CSP directives for production
- [ ] Enable HTTPS (required for HSTS)
- [ ] Review allowed CORS origins
- [ ] Set up MongoDB with proper authentication
- [ ] Review rate limiting thresholds
- [ ] Test SSRF protection with various URL formats
- [ ] Verify input validation on all endpoints

### Environment Variables

**Required for Security**:
```env
NODE_ENV=production
JWT_SECRET=your_super_secret_key_min_32_chars
CLIENT_URL=https://your-frontend-domain.com
```

**Optional**:
```env
# Adjust rate limits if needed
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100
```

## 🛡️ Security Best Practices

### 1. Never Trust User Input
- Always validate and sanitize user input
- Use parameterized queries (Mongoose handles this)
- Escape output when rendering

### 2. Use HTTPS in Production
- HSTS header requires HTTPS
- Protects data in transit
- Required for secure cookies

### 3. Keep Dependencies Updated
```bash
npm audit
npm audit fix
```

### 4. Regular Security Audits
- Review logs for suspicious activity
- Monitor rate limit violations
- Check for unusual request patterns

### 5. Principle of Least Privilege
- Users should only have access to what they need
- Admin routes are protected
- JWT tokens have expiration

## 🔍 Testing Security

### Test SSRF Protection
```bash
# Should be blocked
curl -X POST http://localhost:5000/api/test \
  -H "Content-Type: application/json" \
  -d '{"url": "http://127.0.0.1:22"}'

# Should be blocked
curl -X POST http://localhost:5000/api/test \
  -H "Content-Type: application/json" \
  -d '{"url": "file:///etc/passwd"}'

# Should be allowed
curl -X POST http://localhost:5000/api/test \
  -H "Content-Type: application/json" \
  -d '{"url": "https://api.example.com"}'
```

### Test Rate Limiting
```bash
# Make multiple rapid requests
for i in {1..10}; do
  curl http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test"}'
done
# Should see rate limit error after 5 requests
```

### Test XSS Protection
```bash
# Should be sanitized
curl -X POST http://localhost:5000/api/test \
  -H "Content-Type: application/json" \
  -d '{"name": "<script>alert(1)</script>"}'
```

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [CSP Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [SRI Hash Generator](https://www.srihash.org/)

## 🆘 Security Incident Response

If you suspect a security breach:

1. **Immediately**: Review security logs
2. **Check**: Rate limit violations and unusual patterns
3. **Rotate**: JWT_SECRET and database passwords
4. **Review**: Recent code changes
5. **Notify**: Affected users if data was compromised
6. **Document**: The incident and response

## 🔄 Regular Updates

Security is an ongoing process. Regularly:
- Update dependencies (`npm update`)
- Review and update security headers
- Test security measures
- Review access logs
- Update rate limits based on usage patterns

---

**Last Updated**: 2024
**Maintained By**: Development Team


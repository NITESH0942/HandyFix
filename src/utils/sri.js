/**
 * Subresource Integrity (SRI) Helper for Frontend
 * 
 * SRI allows browsers to verify that resources they fetch (for example, from a CDN)
 * are delivered without unexpected manipulation. It works by allowing you to provide
 * a cryptographic hash that a fetched resource must match.
 * 
 * Usage:
 * 1. Generate hash for external scripts/stylesheets
 * 2. Add integrity attribute to script/link tags
 * 3. Add crossorigin="anonymous" attribute
 */

/**
 * Generate SHA-384 hash for SRI (browser-compatible)
 * @param {string} content - Content to hash
 * @returns {Promise<string>} - Base64-encoded hash
 */
export const generateSRIClient = async (content) => {
  // Convert string to ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  
  // Generate hash using Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-384', data);
  
  // Convert ArrayBuffer to base64
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashBase64 = btoa(String.fromCharCode(...hashArray));
  
  return `sha384-${hashBase64}`;
};

/**
 * Generate SRI hash from URL (fetch and hash)
 * @param {string} url - URL to fetch and hash
 * @returns {Promise<string>} - SRI hash string
 */
export const generateSRIFromURL = async (url) => {
  try {
    const response = await fetch(url);
    const content = await response.text();
    return await generateSRIClient(content);
  } catch (error) {
    console.error('Error generating SRI from URL:', error);
    throw error;
  }
};

/**
 * Create script tag with SRI
 * @param {string} src - Script source URL
 * @param {string} integrity - SRI hash
 * @param {string} crossOrigin - Cross-origin attribute
 * @returns {HTMLScriptElement}
 */
export const createSecureScript = (src, integrity, crossOrigin = 'anonymous') => {
  const script = document.createElement('script');
  script.src = src;
  script.integrity = integrity;
  script.crossOrigin = crossOrigin;
  script.async = true;
  return script;
};

/**
 * Create link tag with SRI
 * @param {string} href - Stylesheet URL
 * @param {string} integrity - SRI hash
 * @param {string} crossOrigin - Cross-origin attribute
 * @returns {HTMLLinkElement}
 */
export const createSecureStylesheet = (href, integrity, crossOrigin = 'anonymous') => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.integrity = integrity;
  link.crossOrigin = crossOrigin;
  return link;
};

/**
 * Example usage:
 * 
 * // For external CDN scripts
 * const bootstrapIntegrity = 'sha384-...'; // Get from CDN provider
 * const script = createSecureScript(
 *   'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
 *   bootstrapIntegrity
 * );
 * document.head.appendChild(script);
 * 
 * // For dynamically loaded content
 * const content = await fetch('https://example.com/script.js').then(r => r.text());
 * const integrity = await generateSRIClient(content);
 * const script = createSecureScript('https://example.com/script.js', integrity);
 * document.head.appendChild(script);
 */


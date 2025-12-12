const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Check if response has content and is JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // If not JSON, get text response
      const text = await response.text();
      throw new Error(text || `Server error: ${response.status} ${response.statusText}`);
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `Server error: ${response.status}`);
    }

    return data;
  } catch (error) {
    // Handle network errors or JSON parsing errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the server is running.');
    }
    // Re-throw if it's already an Error with a message
    if (error instanceof Error) {
      throw error;
    }
    // Fallback for unknown errors
    throw new Error(error.message || 'Something went wrong. Please try again.');
  }
};

// Service API functions
export const serviceAPI = {
  // Hire a professional
  hireRequest: async (data) => {
    return apiCall('/services/hire', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Book a service
  bookService: async (data) => {
    return apiCall('/services/book', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get available time slots for a date
  getAvailableSlots: async (date) => {
    return apiCall(`/services/slots/${date}`);
  },

  // Get user's bookings (requires auth)
  getMyBookings: async () => {
    return apiCall('/services/my-bookings');
  },

  // Submit review for a booking or hire request
  submitReview: async (orderId, orderType, rating, comment) => {
    return apiCall('/services/review', {
      method: 'POST',
      body: JSON.stringify({ orderId, orderType, rating, comment }),
    });
  },

  // Cancel order
  cancelOrder: async (orderId, orderType) => {
    return apiCall(`/services/cancel/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ orderType }),
    });
  },
};

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (name, email, password, phone) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone }),
    });
  },

  // Login user
  login: async (email, password) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Send OTP
  sendOTP: async (mobile) => {
    return apiCall('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    });
  },

  // Verify OTP
  verifyOTP: async (mobile, otp, name) => {
    return apiCall('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile, otp, name }),
    });
  },

  // Resend OTP
  resendOTP: async (mobile) => {
    return apiCall('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    });
  },

  // Get current user
  getMe: async () => {
    return apiCall('/auth/me');
  },

  // Update profile
  updateProfile: async (profileData) => {
    return apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Google OAuth URL
  getGoogleAuthUrl: () => {
    return `${API_BASE_URL}/auth/google`;
  },
};

export default apiCall;


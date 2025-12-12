import HireRequest from '../models/HireRequest.js';
import BookService from '../models/BookService.js';

// @desc    Create hire request
// @route   POST /api/services/hire
// @access  Public
export const createHireRequest = async (req, res) => {
  try {
    const { professionalType, name, email, mobile, description } = req.body;

    // Validate required fields
    if (!professionalType || !name || !email || !mobile) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    const userId = req.user?._id || null;
    
    console.log('Creating hire request with:', {
      professionalType,
      name,
      email,
      mobile,
      userId: userId ? userId.toString() : 'null (not logged in)',
      hasUser: !!req.user,
    });

    const hireRequest = await HireRequest.create({
      professionalType,
      name,
      email,
      mobile,
      description,
      user: userId,
    });

    console.log('✅ Hire request saved to database:', {
      requestId: hireRequest._id,
      orderId: hireRequest.orderId,
      professionalType: hireRequest.professionalType,
      userId: hireRequest.user ? hireRequest.user.toString() : 'null',
      name: hireRequest.name,
    });

    res.status(201).json({
      success: true,
      message: 'Hire request submitted successfully! We will contact you soon.',
      data: hireRequest,
    });
  } catch (error) {
    console.error('Create hire request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all hire requests (admin)
// @route   GET /api/services/hire
// @access  Private/Admin
export const getHireRequests = async (req, res) => {
  try {
    const requests = await HireRequest.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('Get hire requests error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create service booking
// @route   POST /api/services/book
// @access  Public
export const createBooking = async (req, res) => {
  try {
    const { serviceType, name, mobile, email, postalCode, address, date, timeSlot } = req.body;

    // Validate required fields
    if (!serviceType || !name || !mobile || !postalCode || !date || !timeSlot) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    // Check if slot is already booked
    const existingBooking = await BookService.findOne({
      date: new Date(date),
      timeSlot,
      status: { $nin: ['cancelled'] },
    });

    if (existingBooking) {
      return res.status(400).json({ 
        message: 'This time slot is already booked. Please select another slot.' 
      });
    }

    const userId = req.user?._id || null;
    
    console.log('Creating booking with:', {
      serviceType,
      name,
      mobile,
      userId: userId ? userId.toString() : 'null (not logged in)',
      hasUser: !!req.user,
    });

    const booking = await BookService.create({
      serviceType,
      name,
      mobile,
      email,
      postalCode,
      address,
      date: new Date(date),
      timeSlot,
      user: userId,
    });

    console.log('✅ Booking saved to database:', {
      bookingId: booking._id,
      orderId: booking.orderId,
      serviceType: booking.serviceType,
      userId: booking.user ? booking.user.toString() : 'null',
      name: booking.name,
      date: booking.date,
    });

    res.status(201).json({
      success: true,
      message: 'Service booked successfully! We will confirm your booking soon.',
      data: booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/services/book
// @access  Private/Admin
export const getBookings = async (req, res) => {
  try {
    const bookings = await BookService.find()
      .populate('user', 'name email')
      .sort({ date: 1, timeSlot: 1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get available time slots for a date
// @route   GET /api/services/slots/:date
// @access  Public
export const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.params;
    
    const allSlots = [
      '08:00-09:00',
      '09:00-10:00',
      '10:00-11:00',
      '11:00-12:00',
      '12:00-13:00',
      '13:00-14:00',
      '14:00-15:00',
      '15:00-16:00',
      '16:00-17:00',
      '17:00-18:00',
      '18:00-19:00',
      '19:00-20:00',
    ];

    // Find booked slots for the date
    const bookedSlots = await BookService.find({
      date: new Date(date),
      status: { $nin: ['cancelled'] },
    }).select('timeSlot');

    const bookedSlotNames = bookedSlots.map(b => b.timeSlot);
    const availableSlots = allSlots.filter(slot => !bookedSlotNames.includes(slot));

    res.json({
      success: true,
      date,
      availableSlots,
      bookedSlots: bookedSlotNames,
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's bookings
// @route   GET /api/services/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const bookings = await BookService.find({ user: req.user._id })
      .sort({ date: -1 });

    const hireRequests = await HireRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    console.log('Fetching bookings for user:', {
      userId: req.user._id,
      bookingsCount: bookings.length,
      hireRequestsCount: hireRequests.length,
    });

    res.json({
      success: true,
      bookings,
      hireRequests,
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Submit review for a booking or hire request
// @route   POST /api/services/review
// @access  Private
export const submitReview = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { orderId, orderType, rating, comment } = req.body;

    // Validate input
    if (!orderId || !orderType || !rating) {
      return res.status(400).json({ message: 'Please provide orderId, orderType, and rating' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if order exists and belongs to user
    let order;
    if (orderType === 'booking') {
      order = await BookService.findOne({ _id: orderId, user: req.user._id });
    } else if (orderType === 'hireRequest') {
      order = await HireRequest.findOne({ _id: orderId, user: req.user._id });
    } else {
      return res.status(400).json({ message: 'Invalid orderType. Must be "booking" or "hireRequest"' });
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found or does not belong to you' });
    }

    // Check if order is completed
    if (order.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review completed orders' });
    }

    // Check if user already reviewed this order
    const existingReview = order.reviews?.find(
      review => review.user && review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this order' });
    }

    // Add review
    const review = {
      rating: parseInt(rating),
      comment: comment || '',
      user: req.user._id,
      createdAt: new Date(),
    };

    order.reviews = order.reviews || [];
    order.reviews.push(review);
    await order.save();

    console.log(`✅ Review submitted for ${orderType} ${orderId} by user ${req.user._id}`);

    res.json({
      success: true,
      message: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Cancel order (booking or hire request)
// @route   PUT /api/services/cancel/:orderId
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { orderId } = req.params;
    const { orderType } = req.body; // 'booking' or 'hireRequest'

    if (!orderType) {
      return res.status(400).json({ message: 'Please provide orderType' });
    }

    // Find the order
    let order;
    if (orderType === 'booking') {
      order = await BookService.findOne({ orderId, user: req.user._id });
    } else if (orderType === 'hireRequest') {
      order = await HireRequest.findOne({ orderId, user: req.user._id });
    } else {
      return res.status(400).json({ message: 'Invalid orderType' });
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found or does not belong to you' });
    }

    // Check if order is already cancelled or completed
    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    if (order.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed order' });
    }

    // Check if 10 minutes have passed since order creation
    const orderCreatedAt = new Date(order.createdAt);
    const now = new Date();
    const minutesSinceCreation = (now - orderCreatedAt) / (1000 * 60);

    if (minutesSinceCreation > 10) {
      return res.status(400).json({ 
        message: 'Cancellation is only allowed within 10 minutes of order creation',
        minutesSinceCreation: Math.round(minutesSinceCreation * 100) / 100
      });
    }

    // Cancel the order
    order.status = 'cancelled';
    await order.save();

    console.log(`✅ Order cancelled: ${orderId} by user ${req.user._id}`);

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



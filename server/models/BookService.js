import mongoose from 'mongoose';

// Generate unique order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `HF-${timestamp}-${random}`;
};

const bookServiceSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      default: generateOrderId,
      index: true,
    },
    serviceType: {
      type: String,
      required: [true, 'Please select a service'],
      enum: [
        'wall-hanging',
        'fan-repair',
        'sink-repair',
        'furniture-assembly',
        'tv-mounting',
        'electrical-repair',
        'plumbing-repair',
        'home-cleaning',
        'painting',
        'appliance-repair',
        'ac-service',
        'pest-control',
      ],
    },
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, 'Please provide your mobile number'],
    },
    email: {
      type: String,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    postalCode: {
      type: String,
      required: [true, 'Please provide your postal code'],
    },
    address: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'Please select a date'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Please select a time slot'],
      enum: [
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
      ],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviews: [{
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        trim: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

const BookService = mongoose.model('BookService', bookServiceSchema);

export default BookService;





import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { serviceAPI } from '../../services/api';
import styles from './orderHistory.module.css';

const serviceTypeNames = {
  'wall-hanging': 'Wall Hanging',
  'fan-repair': 'Fan Repair',
  'sink-repair': 'Sink Repair',
  'furniture-assembly': 'Furniture Assembly',
  'tv-mounting': 'TV Mounting',
  'electrical-repair': 'Electrical Repair',
  'plumbing-repair': 'Plumbing Repair',
  'home-cleaning': 'Home Cleaning',
  'painting': 'Painting',
  'appliance-repair': 'Appliance Repair',
  'ac-service': 'AC Service',
  'pest-control': 'Pest Control',
};

const professionalTypeNames = {
  'electrician': 'Electrician',
  'plumber': 'Plumber',
  'painter': 'Painter',
  'carpenter': 'Carpenter',
  'cleaner': 'Cleaner',
  'handyman': 'Handyman',
  'gardener': 'Gardener',
  'pest-control': 'Pest Control',
};

const statusColors = {
  'pending': '#f59e0b',
  'confirmed': '#10b981',
  'in-progress': '#3b82f6',
  'completed': '#6366f1',
  'cancelled': '#ef4444',
};

const OrderHistoryModal = ({ isOpen, onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [hireRequests, setHireRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'hireRequests'
  const [submittingReview, setSubmittingReview] = useState({});
  const [reviewForm, setReviewForm] = useState({});
  const [cancellingOrder, setCancellingOrder] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchBookings();
    }
  }, [isOpen]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await serviceAPI.getMyBookings();
      setBookings(data.bookings || []);
      setHireRequests(data.hireRequests || []);
    } catch (err) {
      setError('Failed to load booking history. Please try again.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (slot) => {
    if (!slot) return '';
    const [start] = slot.split('-');
    const hour = parseInt(start.split(':')[0]);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${ampm}`;
  };

  const getStatusBadge = (status) => {
    return (
      <span 
        className={styles.statusBadge}
        style={{ backgroundColor: `${statusColors[status] || '#666'}20`, color: statusColors[status] || '#666' }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const hasUserReviewed = (order) => {
    if (!order.reviews || order.reviews.length === 0) return false;
    return order.reviews.length > 0;
  };

  const handleStarClick = (orderId, orderType, rating) => {
    const key = `${orderType}-${orderId}`;
    setReviewForm(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        rating,
      },
    }));
  };

  const handleReviewCommentChange = (orderId, orderType, comment) => {
    const key = `${orderType}-${orderId}`;
    setReviewForm(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        comment,
      },
    }));
  };

  const handleSubmitReview = async (orderId, orderType) => {
    const key = `${orderType}-${orderId}`;
    const formData = reviewForm[key];

    if (!formData || !formData.rating) {
      setError('Please select a rating');
      return;
    }

    setSubmittingReview(prev => ({ ...prev, [key]: true }));
    setError('');

    try {
      await serviceAPI.submitReview(orderId, orderType, formData.rating, formData.comment || '');
      
      // Refresh bookings
      await fetchBookings();
      
      // Clear form
      setReviewForm(prev => {
        const newForm = { ...prev };
        delete newForm[key];
        return newForm;
      });
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(prev => ({ ...prev, [key]: false }));
    }
  };

  const StarRating = ({ orderId, orderType, currentRating, onStarClick, interactive = true }) => {
    return (
      <div className={styles.starRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${styles.star} ${star <= currentRating ? styles.starFilled : ''} ${interactive ? styles.starInteractive : ''}`}
            onClick={() => interactive && onStarClick(orderId, orderType, star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const canCancelOrder = (order) => {
    if (order.status === 'cancelled' || order.status === 'completed') {
      return false;
    }
    const orderCreatedAt = new Date(order.createdAt);
    const now = new Date();
    const minutesSinceCreation = (now - orderCreatedAt) / (1000 * 60);
    return minutesSinceCreation <= 10;
  };

  const getRemainingCancelTime = (order) => {
    const orderCreatedAt = new Date(order.createdAt);
    const now = new Date();
    const minutesSinceCreation = (now - orderCreatedAt) / (1000 * 60);
    const remainingMinutes = 10 - minutesSinceCreation;
    if (remainingMinutes <= 0) return 0;
    return Math.floor(remainingMinutes);
  };

  const handleCancelOrder = async (orderId, orderType) => {
    const key = `${orderType}-${orderId}`;
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancellingOrder(prev => ({ ...prev, [key]: true }));
    setError('');

    try {
      await serviceAPI.cancelOrder(orderId, orderType);
      await fetchBookings();
    } catch (err) {
      setError(err.message || 'Failed to cancel order');
    } finally {
      setCancellingOrder(prev => ({ ...prev, [key]: false }));
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        
        <h2 className={styles.title}>Order History</h2>
        <p className={styles.subtitle}>View all your bookings and hire requests</p>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'bookings' ? styles.active : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Service Bookings ({bookings.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'hireRequests' ? styles.active : ''}`}
            onClick={() => setActiveTab('hireRequests')}
          >
            Hire Requests ({hireRequests.length})
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading your bookings...</p>
          </div>
        ) : error && !loading ? (
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={fetchBookings} className={styles.retryBtn}>
              Retry
            </button>
          </div>
        ) : (
          <div className={styles.content}>
            {/* Service Bookings */}
            {activeTab === 'bookings' && (
              <div className={styles.list}>
                {bookings.length === 0 ? (
                  <div className={styles.empty}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    <h3>No Bookings Yet</h3>
                    <p>You haven't booked any services yet. Book a service to see it here!</p>
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking._id} className={styles.card}>
                      <div className={styles.cardHeader}>
                        <div className={styles.cardTitle}>
                          <h3>{serviceTypeNames[booking.serviceType] || booking.serviceType}</h3>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className={styles.orderInfo}>
                          {booking.orderId && (
                            <p className={styles.orderId}>Order ID: <strong>{booking.orderId}</strong></p>
                          )}
                          <p className={styles.cardDate}>
                            {formatDate(booking.date)} at {formatTime(booking.timeSlot)}
                          </p>
                        </div>
                        {canCancelOrder(booking) && (
                          <div className={styles.cancelSection}>
                            <button
                              className={styles.cancelBtn}
                              onClick={() => handleCancelOrder(booking.orderId, 'booking')}
                              disabled={cancellingOrder[`booking-${booking.orderId}`]}
                            >
                              {cancellingOrder[`booking-${booking.orderId}`] ? 'Cancelling...' : `Cancel Order (${getRemainingCancelTime(booking)}m left)`}
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.cardBody}>
                        <div className={styles.cardRow}>
                          <span className={styles.label}>Service Type:</span>
                          <span className={styles.value}>{serviceTypeNames[booking.serviceType] || booking.serviceType}</span>
                        </div>
                        {booking.name && (
                          <div className={styles.cardRow}>
                            <span className={styles.label}>Name:</span>
                            <span className={styles.value}>{booking.name}</span>
                          </div>
                        )}
                        {booking.mobile && (
                          <div className={styles.cardRow}>
                            <span className={styles.label}>Mobile:</span>
                            <span className={styles.value}>{booking.mobile}</span>
                          </div>
                        )}
                        {booking.postalCode && (
                          <div className={styles.cardRow}>
                            <span className={styles.label}>Postal Code:</span>
                            <span className={styles.value}>{booking.postalCode}</span>
                          </div>
                        )}
                        {booking.address && (
                          <div className={styles.cardRow}>
                            <span className={styles.label}>Address:</span>
                            <span className={styles.value}>{booking.address}</span>
                          </div>
                        )}
                        <div className={styles.cardRow}>
                          <span className={styles.label}>Booked On:</span>
                          <span className={styles.value}>{formatDate(booking.createdAt)}</span>
                        </div>
                      </div>
                      
                      {/* Reviews Section for Completed Orders */}
                      {booking.status === 'completed' && (
                        <div className={styles.reviewsSection}>
                          <h4 className={styles.reviewsTitle}>Reviews</h4>
                          
                          {/* Review Submission Form */}
                          {!hasUserReviewed(booking) && (
                            <div className={styles.reviewForm}>
                              <label className={styles.reviewFormLabel}>Rate this service:</label>
                              <StarRating
                                orderId={booking._id}
                                orderType="booking"
                                currentRating={reviewForm[`booking-${booking._id}`]?.rating || 0}
                                onStarClick={handleStarClick}
                                interactive={true}
                              />
                              <textarea
                                className={styles.reviewTextarea}
                                placeholder="Write your review (optional)"
                                value={reviewForm[`booking-${booking._id}`]?.comment || ''}
                                onChange={(e) => handleReviewCommentChange(booking._id, 'booking', e.target.value)}
                                rows={3}
                              />
                              {error && error.includes('review') && (
                                <div className={styles.reviewError}>{error}</div>
                              )}
                              <button
                                className={styles.submitReviewBtn}
                                onClick={() => handleSubmitReview(booking._id, 'booking')}
                                disabled={submittingReview[`booking-${booking._id}`] || !reviewForm[`booking-${booking._id}`]?.rating}
                              >
                                {submittingReview[`booking-${booking._id}`] ? 'Submitting...' : 'Submit Review'}
                              </button>
                            </div>
                          )}

                          {/* Existing Reviews */}
                          {booking.reviews && booking.reviews.length > 0 && (
                            <div className={styles.reviewsList}>
                              {booking.reviews.map((review, index) => (
                                <div key={index} className={styles.reviewItem}>
                                  <div className={styles.reviewHeader}>
                                    <StarRating
                                      orderId={booking._id}
                                      orderType="booking"
                                      currentRating={review.rating}
                                      interactive={false}
                                    />
                                    <span className={styles.reviewDate}>
                                      {formatDate(review.createdAt || review.date)}
                                    </span>
                                  </div>
                                  {review.comment && (
                                    <p className={styles.reviewComment}>{review.comment}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Hire Requests */}
            {activeTab === 'hireRequests' && (
              <div className={styles.list}>
                {hireRequests.length === 0 ? (
                  <div className={styles.empty}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <h3>No Hire Requests Yet</h3>
                    <p>You haven't requested any professionals yet. Hire a pro to see it here!</p>
                  </div>
                ) : (
                  hireRequests.map((request) => (
                    <div key={request._id} className={styles.card}>
                      <div className={styles.cardHeader}>
                        <div className={styles.cardTitle}>
                          <h3>{professionalTypeNames[request.professionalType] || request.professionalType}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className={styles.orderInfo}>
                          {request.orderId && (
                            <p className={styles.orderId}>Order ID: <strong>{request.orderId}</strong></p>
                          )}
                          <p className={styles.cardDate}>
                            Requested on {formatDate(request.createdAt)}
                          </p>
                        </div>
                        {canCancelOrder(request) && (
                          <div className={styles.cancelSection}>
                            <button
                              className={styles.cancelBtn}
                              onClick={() => handleCancelOrder(request.orderId, 'hireRequest')}
                              disabled={cancellingOrder[`hireRequest-${request.orderId}`]}
                            >
                              {cancellingOrder[`hireRequest-${request.orderId}`] ? 'Cancelling...' : `Cancel Order (${getRemainingCancelTime(request)}m left)`}
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.cardBody}>
                        <div className={styles.cardRow}>
                          <span className={styles.label}>Professional Type:</span>
                          <span className={styles.value}>{professionalTypeNames[request.professionalType] || request.professionalType}</span>
                        </div>
                        {request.name && (
                          <div className={styles.cardRow}>
                            <span className={styles.label}>Name:</span>
                            <span className={styles.value}>{request.name}</span>
                          </div>
                        )}
                        {request.email && (
                          <div className={styles.cardRow}>
                            <span className={styles.label}>Email:</span>
                            <span className={styles.value}>{request.email}</span>
                          </div>
                        )}
                        {request.mobile && (
                          <div className={styles.cardRow}>
                            <span className={styles.label}>Mobile:</span>
                            <span className={styles.value}>{request.mobile}</span>
                          </div>
                        )}
                        {request.description && (
                          <div className={styles.cardRow}>
                            <span className={styles.label}>Description:</span>
                            <span className={styles.value}>{request.description}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Reviews Section for Completed Orders */}
                      {request.status === 'completed' && (
                        <div className={styles.reviewsSection}>
                          <h4 className={styles.reviewsTitle}>Reviews</h4>
                          
                          {/* Review Submission Form */}
                          {!hasUserReviewed(request) && (
                            <div className={styles.reviewForm}>
                              <label className={styles.reviewFormLabel}>Rate this service:</label>
                              <StarRating
                                orderId={request._id}
                                orderType="hireRequest"
                                currentRating={reviewForm[`hireRequest-${request._id}`]?.rating || 0}
                                onStarClick={handleStarClick}
                                interactive={true}
                              />
                              <textarea
                                className={styles.reviewTextarea}
                                placeholder="Write your review (optional)"
                                value={reviewForm[`hireRequest-${request._id}`]?.comment || ''}
                                onChange={(e) => handleReviewCommentChange(request._id, 'hireRequest', e.target.value)}
                                rows={3}
                              />
                              <button
                                className={styles.submitReviewBtn}
                                onClick={() => handleSubmitReview(request._id, 'hireRequest')}
                                disabled={submittingReview[`hireRequest-${request._id}`] || !reviewForm[`hireRequest-${request._id}`]?.rating}
                              >
                                {submittingReview[`hireRequest-${request._id}`] ? 'Submitting...' : 'Submit Review'}
                              </button>
                            </div>
                          )}

                          {/* Existing Reviews */}
                          {request.reviews && request.reviews.length > 0 && (
                            <div className={styles.reviewsList}>
                              {request.reviews.map((review, index) => (
                                <div key={index} className={styles.reviewItem}>
                                  <div className={styles.reviewHeader}>
                                    <StarRating
                                      orderId={request._id}
                                      orderType="hireRequest"
                                      currentRating={review.rating}
                                      interactive={false}
                                    />
                                    <span className={styles.reviewDate}>
                                      {formatDate(review.createdAt || review.date)}
                                    </span>
                                  </div>
                                  {review.comment && (
                                    <p className={styles.reviewComment}>{review.comment}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default OrderHistoryModal;



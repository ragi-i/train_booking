import React, { useState } from 'react';
import axios from 'axios';
import './seatBooking.css';

function SeatBooking() {
  const [availableSeats, setAvailableSeats] = useState('');
  const [seatCount, setSeatCount] = useState('');
  const [message, setMessage] = useState('');
  const [bookedSeats, setBookedSeats] = useState([]); 

  const checkSeats = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/available-seats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableSeats(response.data.availableSeats);
    } catch (error) {
      setMessage('Error fetching available seats.');
    }
  };

  const bookSeats = async () => {
    if (!seatCount || seatCount <= 0) {
      setMessage('Please enter the number of seats you wish to book.');
      return;
    }

    if (seatCount > 8) {
      setMessage('You cannot book more than 8 seats at a time.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:5000/api/book-seats',
        { seatCount: parseInt(seatCount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      setBookedSeats(response.data.seats); 
      checkSeats(); 
    } catch (err) {
      setBookedSeats([]); 
      setMessage(err.response?.data?.message || 'Error booking seats.');
    }
  };

  const resetSeats = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:5000/api/reset-seats',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      setBookedSeats([]); 
      checkSeats(); 
    } catch (err) {
      setMessage('Error resetting seats.');
    }
  };

  return (
    <div className="booking-container">
      <h1 className="main-heading">Book Your Tickets</h1>
      <div className="route-container">
        <div className="route">
          <div className="route-label">Source:</div>
          <input type="text" value="Delhi" disabled />
        </div>
        <div className="route">
          <div className="route-label">Destination:</div>
          <input type="text" value="Mumbai" disabled />
        </div>
      </div>

      <button className="check-seats-btn" onClick={checkSeats}>
        Check Available Seats
      </button>

      <div className="available-seats">
        <div className="available-seats-header">
          Available Seats: {availableSeats || 'Loading...'}
        </div>
      </div>

      <div className="booking-section">
        <div className="booking-header">Book Seats</div>
        <input
          type="number"
          className="seat-count-input"
          placeholder="Enter the number of seats"
          value={seatCount}
          onChange={(e) => setSeatCount(e.target.value)}
          max="7"
          min="1"
        />
        <button className="book-btn" onClick={bookSeats}>
          Book
        </button>
      </div>

      <button className="reset-btn" onClick={resetSeats}>
        Reset All Seats
      </button>

      {message && <div className="message">{message}</div>}

      {bookedSeats.length > 0 && (
        <div className="booked-seats">
          <h3>Your Booked Seats:</h3>
          <ul>
            {bookedSeats.map((seat) => (
              <li key={seat.id}>
                Row: {seat.row_number}, Seat: {seat.seat_number}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SeatBooking;

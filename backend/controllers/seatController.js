const pool = require('../config/database');

const getAvailableSeats = async (req, res) => {
  try {
    
    const result = await pool.query('SELECT COUNT(*) FROM seats WHERE is_booked = FALSE');
    const availableSeatsCount = result.rows[0].count; 
    console.log(`Available seats count: ${availableSeatsCount}`); 
    res.json({ availableSeats: availableSeatsCount }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching available seats' });
  }
};


const bookSeats = async (req, res) => {
  const { seatCount } = req.body;


  if (seatCount > 7) return res.status(400).json({ message: 'You can book up to 7 seats at a time' });


  const availableSeats = await pool.query(
    'SELECT * FROM seats WHERE is_booked = FALSE ORDER BY row_number, seat_number'
  );


  const groupedSeats = availableSeats.rows.reduce((acc, seat) => {
    if (!acc[seat.row_number]) acc[seat.row_number] = [];
    acc[seat.row_number].push(seat);
    return acc;
  }, {});

  let bookedSeats = [];


  for (const row in groupedSeats) {
    if (groupedSeats[row].length >= seatCount) {
      bookedSeats = groupedSeats[row].slice(0, seatCount);
      break;
    }
  }

  
  if (bookedSeats.length === 0) {
    for (const row in groupedSeats) {
      for (const seat of groupedSeats[row]) {
        bookedSeats.push(seat);
        if (bookedSeats.length === seatCount) break;
      }
      if (bookedSeats.length === seatCount) break;
    }
  }

  if (bookedSeats.length < seatCount) {
    return res.status(400).json({ message: 'Not enough seats available' });
  }

 
  const seatIds = bookedSeats.map((seat) => seat.id);
  await pool.query('UPDATE seats SET is_booked = TRUE WHERE id = ANY($1::INT[])', [seatIds]);

  res.json({ message: 'Seats booked successfully', seats: bookedSeats });
};



const resetSeat = async (req, res) => {
  try {
    await pool.query('UPDATE seats SET is_booked = FALSE');
    res.json({ message: 'All seats have been reset and are now available' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting seats' });
  }
};



module.exports = { resetSeat, getAvailableSeats, bookSeats };
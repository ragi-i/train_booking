const express = require("express");
const router = express.Router();
const { getAvailableSeats, bookSeats,resetSeat } = require("../controllers/seatController"); 
const authenticateUser = require('../middleware/authenticateUser');

router.get("/available-seats", getAvailableSeats); 
router.post("/book-seats", bookSeats);
router.post('/reset-seats', resetSeat);


module.exports = router;

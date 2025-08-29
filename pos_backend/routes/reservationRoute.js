const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Đặt bàn mới
router.post('/', reservationController.createReservation);

// Lấy danh sách đặt bàn (search + phân trang)
router.get('/', reservationController.getReservations);

// Lọc theo ngày
router.get('/filter', reservationController.getReservationsByDate);

// Cập nhật
router.put('/:id', reservationController.updateReservation);

// Xóa
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;

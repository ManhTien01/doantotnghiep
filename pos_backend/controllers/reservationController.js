const Reservation = require('../models/reservationModel');
const nodemailer = require('nodemailer');

// Gửi email xác nhận
const sendConfirmationEmail = async (reservation) => {
    // Looking to send emails in production? Check out our Email API/SMTP product!
    var transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "ebf45191407167",
            pass: "3c1facf36858d4"
        }
    });

    const formatDate = (isoDateStr) => {
        const d = new Date(isoDateStr);
        return d.toLocaleDateString('vi-VN'); 
      };
      
      const mailOptions = {
        from: 'manhtientranite@gmail.com',
        to: reservation.email,
        subject: 'Xác nhận đặt bàn',
        text: `Chào ${reservation.name},\n\nYêu cầu đặt bàn của bạn cho ${reservation.people} người vào ngày ${formatDate(reservation.date)} lúc ${reservation.time} đã được xác nhận.\n\nGhi chú: ${reservation.message || 'Không có ghi chú nào.'}\n\nCảm ơn bạn đã đặt bàn tại nhà hàng của chúng tôi!`
      };
      

    await transporter.sendMail(mailOptions);
};

// Tạo đặt bàn (kiểm tra trùng)
exports.createReservation = async (req, res) => {
    try {
        const { name, email, phone, date, time, people, message } = req.body;

        const existing = await Reservation.findOne({
            date: new Date(date),
            time,
            $or: [{ email }, { phone }]
        });

        if (existing) {
            return res.status(400).json({ message: 'Bạn đã có bàn đặt trong khung giờ này rồi!' });
        }

        const newReservation = new Reservation({
            name,
            email,
            phone,
            date,
            time,
            people,
            message
        });

        await newReservation.save();
        await sendConfirmationEmail(newReservation);

        res.status(201).json({ message: 'Reservation created and email sent', reservation: newReservation });
    } catch (error) {
        res.status(500).json({ message: 'Error creating reservation', error });
    }
};

// Lấy danh sách (tìm kiếm + phân trang)
exports.getReservations = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10, date } = req.query;

        const query = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ]
        };

        if (date) {
            const start = new Date(date);
            const end = new Date(date);
            end.setDate(end.getDate() + 1); 
        
            query.date = { $gte: start, $lt: end };
        }

        const total = await Reservation.countDocuments(query);
        const reservations = await Reservation.find(query)
            .populate("tables", "tableNo") // ✅ Sửa ở đây
            .sort({ date: 1, time: 1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).json({
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            reservations
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reservations', error });
    }
};


// Lọc theo ngày
exports.getReservationsByDate = async (req, res) => {
    try {
        const { date } = req.query;
        const reservations = await Reservation.find({ date: new Date(date) }).sort({ time: 1 });
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Error filtering reservations', error });
    }
};

// Cập nhật đặt bàn
exports.updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Reservation.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: 'Reservation updated', reservation: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating reservation', error });
    }
};

// Xóa đặt bàn
exports.deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        await Reservation.findByIdAndDelete(id);
        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting reservation', error });
    }
};

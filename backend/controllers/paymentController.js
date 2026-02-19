const Payment = require("../models/Payment");

/*
====================================
CREATE PAYMENT RECORD
====================================
*/

exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);

    res.status(201).json({
      success: true,
      data: payment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


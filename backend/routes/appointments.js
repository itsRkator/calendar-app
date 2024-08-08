const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointments");

// Create a new appointment
router.post("/", async (req, res) => {
  const { title, date } = req.body;
  try {
    const newAppointment = new Appointment({ title, date });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get an appointment by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an appointment
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, date } = req.body;
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { title, date },
      { new: true, runValidators: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an appointment
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

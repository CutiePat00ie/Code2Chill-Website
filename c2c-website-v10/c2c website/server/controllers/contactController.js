const ContactMessage = require('../models/ContactMessage');
const memoryStore = require('../utils/memoryStore');

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in all contact form fields' });
    }

    if (global.USE_MEMORY_DB) {
      const newMsg = memoryStore.createContact({ name, email, subject, message });
      return res.status(201).json({
        success: true,
        data: newMsg,
        message: 'Thank you for reaching out! The Code2Chill team will get back to you soon.'
      });
    }

    const newMsg = await ContactMessage.create({
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      data: newMsg,
      message: 'Thank you for reaching out! The Code2Chill team will get back to you soon.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = async (req, res, next) => {
  try {
    if (global.USE_MEMORY_DB) {
      const messages = memoryStore.getContacts();
      return res.json({ success: true, count: messages.length, data: messages });
    }

    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContact = async (req, res, next) => {
  try {
    if (global.USE_MEMORY_DB) {
      const deleted = memoryStore.deleteContact(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Message not found' });
      }
      return res.json({ success: true, message: 'Message deleted' });
    }

    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContact,
  getContacts,
  deleteContact
};

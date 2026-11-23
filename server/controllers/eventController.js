const Event = require('../models/Event');
const User = require('../models/User');
const memoryStore = require('../utils/memoryStore');

// @desc    Get all events with search & filters
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res, next) => {
  try {
    const { domain, category, status, search } = req.query;

    if (global.USE_MEMORY_DB) {
      const events = memoryStore.getEvents({ domain, category, status, search });
      return res.json({ success: true, count: events.length, data: events });
    }

    let query = {};

    if (domain && domain !== 'All') {
      query.domain = { $regex: domain, $options: 'i' };
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const events = await Event.find(query).sort({ date: 1 });
    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
  try {
    if (global.USE_MEMORY_DB) {
      const event = memoryStore.getEventById(req.params.id);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      return res.json({ success: true, data: event });
    }

    const event = await Event.findById(req.params.id).populate('registeredUsers', 'name email collegeId year branch');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      category,
      domain,
      description,
      date,
      endDate,
      time,
      venue,
      type,
      banner,
      capacity,
      registrationDeadline,
      tags,
      prerequisites,
      organizer,
      speaker
    } = req.body;

    if (!title || !description || !date || !time || !venue) {
      return res.status(400).json({ success: false, message: 'Please fill in all required event fields' });
    }

    if (global.USE_MEMORY_DB) {
      const newEvent = memoryStore.createEvent({
        title,
        category: category || 'Workshop',
        domain: domain || 'Software Development',
        description,
        date,
        endDate,
        time,
        venue,
        type: type || 'In-Person',
        banner: banner || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
        capacity: Number(capacity) || 100,
        registrationDeadline,
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['Tech']),
        prerequisites,
        organizer: organizer || 'Code2Chill Technical Council',
        speaker: speaker || 'Code2Chill Domain Mentors'
      });
      return res.status(201).json({ success: true, data: newEvent, message: 'Event published successfully' });
    }

    const event = await Event.create({
      title,
      category,
      domain,
      description,
      date,
      endDate,
      time,
      venue,
      type,
      banner,
      capacity: Number(capacity) || 100,
      registrationDeadline,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      prerequisites,
      organizer,
      speaker
    });

    res.status(201).json({ success: true, data: event, message: 'Event published successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res, next) => {
  try {
    if (global.USE_MEMORY_DB) {
      const updated = memoryStore.updateEvent(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      return res.json({ success: true, data: updated, message: 'Event updated successfully' });
    }

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, data: event, message: 'Event updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res, next) => {
  try {
    if (global.USE_MEMORY_DB) {
      const deleted = memoryStore.deleteEvent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      return res.json({ success: true, message: 'Event deleted successfully' });
    }

    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
const registerForEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    if (global.USE_MEMORY_DB) {
      const result = memoryStore.registerUserForEvent(userId, eventId);
      if (!result.success) {
        return res.status(400).json({ success: false, message: result.message });
      }
      return res.json({
        success: true,
        data: result.event,
        user: result.user,
        message: '🎉 Congratulations! You have successfully registered for the event.'
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.registeredUsers.includes(userId)) {
      return res.status(400).json({ success: false, message: 'You are already registered for this event' });
    }

    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Event registration is at full capacity' });
    }

    event.registeredUsers.push(userId);
    event.registeredCount += 1;
    await event.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { registeredEvents: event._id }
    });

    res.json({
      success: true,
      data: event,
      message: '🎉 Congratulations! You have successfully registered for the event.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel registration for an event
// @route   POST /api/events/:id/cancel
// @access  Private
const cancelRegistration = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    if (global.USE_MEMORY_DB) {
      const result = memoryStore.cancelEventRegistration(userId, eventId);
      if (!result.success) {
        return res.status(400).json({ success: false, message: result.message });
      }
      return res.json({
        success: true,
        data: result.event,
        message: 'Event registration cancelled.'
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    event.registeredUsers = event.registeredUsers.filter(id => id.toString() !== userId.toString());
    if (event.registeredCount > 0) {
      event.registeredCount -= 1;
    }
    await event.save();

    await User.findByIdAndUpdate(userId, {
      $pull: { registeredEvents: event._id }
    });

    res.json({
      success: true,
      data: event,
      message: 'Event registration cancelled.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get registered events for current user
// @route   GET /api/events/my/registered
// @access  Private
const getMyRegisteredEvents = async (req, res, next) => {
  try {
    const registeredIds = req.user.registeredEvents || [];

    if (global.USE_MEMORY_DB) {
      const allEvents = memoryStore.getEvents();
      const userEvents = allEvents.filter(e => registeredIds.includes(e._id));
      return res.json({ success: true, count: userEvents.length, data: userEvents });
    }

    const events = await Event.find({ _id: { $in: registeredIds } });
    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration,
  getMyRegisteredEvents
};

const seedData = require('./seedData');

class MemoryStore {
  constructor() {
    this.initialized = false;
    this.users = [];
    this.events = [];
    this.projects = [];
    this.team = [];
    this.announcements = [];
    this.contacts = [];
    this.applications = [];
    this.domains = [];
  }

  initSeed() {
    if (this.initialized) return;
    this.users = JSON.parse(JSON.stringify(seedData.usersData));
    this.events = JSON.parse(JSON.stringify(seedData.eventsData));
    this.projects = JSON.parse(JSON.stringify(seedData.projectsData));
    this.team = JSON.parse(JSON.stringify(seedData.teamMembersData));
    this.announcements = JSON.parse(JSON.stringify(seedData.announcementsData));
    this.domains = JSON.parse(JSON.stringify(seedData.domainsData));
    this.contacts = [
      {
        _id: 'msg-001',
        name: 'Sarah Jenkins',
        email: 'sarah.j@student.edu',
        subject: 'Collaboration with Robotics Lab',
        message: 'Hi C2C team! Would love to partner with your IoT domain for the upcoming campus tech fest.',
        createdAt: new Date().toISOString(),
        status: 'read'
      }
    ];
    this.applications = [
      {
        _id: 'app-001',
        name: 'Rohan Gupta',
        email: 'rohan.g@student.edu',
        collegeId: 'CS24B012',
        year: '2nd Year',
        branch: 'Computer Science',
        domain: 'Artificial Intelligence & ML',
        experience: 'Intermediate with PyTorch and Python data analysis.',
        github: 'https://github.com/rohan-g',
        whyJoin: 'I want to build real-world AI projects and participate in hackathons with the C2C community.',
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ];
    this.initialized = true;
    console.log('📦 MemoryStore loaded with seed data successfully.');
  }

  // --- Users ---
  findUserById(id) {
    return this.users.find(u => u._id === id);
  }

  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData) {
    const newUser = {
      _id: 'user-' + Date.now(),
      registeredEvents: [],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      role: 'member',
      createdAt: new Date().toISOString(),
      ...userData
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id, updates) {
    const idx = this.users.findIndex(u => u._id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...updates };
    return this.users[idx];
  }

  // --- Events ---
  getEvents({ domain, category, status, search } = {}) {
    let result = [...this.events];
    if (domain && domain !== 'All') {
      result = result.filter(e => e.domain.toLowerCase().includes(domain.toLowerCase()));
    }
    if (category && category !== 'All') {
      result = result.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }
    if (status && status !== 'All') {
      result = result.filter(e => e.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(q) || 
        e.description.toLowerCase().includes(q) ||
        (e.tags && e.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    return result;
  }

  getEventById(id) {
    return this.events.find(e => e._id === id);
  }

  createEvent(eventData) {
    const newEvent = {
      _id: 'event-' + Date.now(),
      registeredCount: 0,
      status: 'upcoming',
      tags: [],
      createdAt: new Date().toISOString(),
      ...eventData
    };
    this.events.unshift(newEvent);
    return newEvent;
  }

  updateEvent(id, updates) {
    const idx = this.events.findIndex(e => e._id === id);
    if (idx === -1) return null;
    this.events[idx] = { ...this.events[idx], ...updates };
    return this.events[idx];
  }

  deleteEvent(id) {
    const idx = this.events.findIndex(e => e._id === id);
    if (idx === -1) return false;
    this.events.splice(idx, 1);
    return true;
  }

  registerUserForEvent(userId, eventId) {
    const user = this.findUserById(userId);
    const event = this.getEventById(eventId);
    if (!user || !event) return { success: false, message: 'User or Event not found' };

    user.registeredEvents = user.registeredEvents || [];
    if (user.registeredEvents.includes(eventId)) {
      return { success: false, message: 'Already registered for this event' };
    }

    if (event.registeredCount >= event.capacity) {
      return { success: false, message: 'Event is fully booked' };
    }

    user.registeredEvents.push(eventId);
    event.registeredCount = (event.registeredCount || 0) + 1;
    return { success: true, event, user };
  }

  cancelEventRegistration(userId, eventId) {
    const user = this.findUserById(userId);
    const event = this.getEventById(eventId);
    if (!user || !event) return { success: false, message: 'User or Event not found' };

    user.registeredEvents = (user.registeredEvents || []).filter(id => id !== eventId);
    if (event.registeredCount > 0) {
      event.registeredCount -= 1;
    }
    return { success: true, event, user };
  }

  // --- Projects ---
  getProjects({ domain, featured, search } = {}) {
    let result = [...this.projects];
    if (domain && domain !== 'All') {
      result = result.filter(p => p.domain.toLowerCase().includes(domain.toLowerCase()));
    }
    if (featured === true || featured === 'true') {
      result = result.filter(p => p.featured === true);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.techStack && p.techStack.some(t => t.toLowerCase().includes(q)))
      );
    }
    return result;
  }

  getProjectById(id) {
    return this.projects.find(p => p._id === id);
  }

  createProject(projectData) {
    const newProject = {
      _id: 'proj-' + Date.now(),
      likes: 1,
      featured: false,
      status: 'Active',
      createdAt: new Date().toISOString(),
      ...projectData
    };
    this.projects.unshift(newProject);
    return newProject;
  }

  updateProject(id, updates) {
    const idx = this.projects.findIndex(p => p._id === id);
    if (idx === -1) return null;
    this.projects[idx] = { ...this.projects[idx], ...updates };
    return this.projects[idx];
  }

  deleteProject(id) {
    const idx = this.projects.findIndex(p => p._id === id);
    if (idx === -1) return false;
    this.projects.splice(idx, 1);
    return true;
  }

  likeProject(id) {
    const project = this.getProjectById(id);
    if (!project) return null;
    project.likes = (project.likes || 0) + 1;
    return project;
  }

  // --- Team ---
  getTeamMembers() {
    return [...this.team];
  }

  createTeamMember(memberData) {
    const newMember = {
      _id: 'team-' + Date.now(),
      createdAt: new Date().toISOString(),
      ...memberData
    };
    this.team.push(newMember);
    return newMember;
  }

  deleteTeamMember(id) {
    const idx = this.team.findIndex(t => t._id === id);
    if (idx === -1) return false;
    this.team.splice(idx, 1);
    return true;
  }

  // --- Announcements ---
  getAnnouncements() {
    return [...this.announcements];
  }

  createAnnouncement(annData) {
    const newAnn = {
      _id: 'ann-' + Date.now(),
      date: new Date().toISOString(),
      priority: annData.priority || 'normal',
      ...annData
    };
    this.announcements.unshift(newAnn);
    return newAnn;
  }

  deleteAnnouncement(id) {
    const idx = this.announcements.findIndex(a => a._id === id);
    if (idx === -1) return false;
    this.announcements.splice(idx, 1);
    return true;
  }

  // --- Contacts ---
  getContacts() {
    return [...this.contacts];
  }

  createContact(contactData) {
    const newContact = {
      _id: 'msg-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'unread',
      ...contactData
    };
    this.contacts.unshift(newContact);
    return newContact;
  }

  deleteContact(id) {
    const idx = this.contacts.findIndex(c => c._id === id);
    if (idx === -1) return false;
    this.contacts.splice(idx, 1);
    return true;
  }

  // --- Applications ---
  getApplications() {
    return [...this.applications];
  }

  createApplication(appData) {
    const newApp = {
      _id: 'app-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...appData
    };
    this.applications.unshift(newApp);
    return newApp;
  }

  updateApplicationStatus(id, status) {
    const app = this.applications.find(a => a._id === id);
    if (!app) return null;
    app.status = status;
    return app;
  }

  // --- Domains ---
  getDomains() {
    return [...this.domains];
  }

  getDomainById(id) {
    return this.domains.find(d => d.id === id);
  }

  // --- Stats ---
  getStats() {
    return {
      activeMembers: 680 + this.users.length - 2,
      eventsOrganized: this.events.length + 32,
      innovativeProjects: this.projects.length + 40,
      techDomains: this.domains.length,
      hackathonsWon: 19,
      githubStars: '1.4k+'
    };
  }
}

const memoryStore = new MemoryStore();
module.exports = memoryStore;

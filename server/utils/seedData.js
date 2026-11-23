const bcrypt = require('bcryptjs');

const getHashedPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const domainsData = [
  {
    id: 'software-dev',
    title: 'Software Development',
    shortName: 'Dev & Systems',
    icon: 'Terminal',
    tagline: 'Architecting scalable, resilient, and high-performance software systems.',
    description: 'Focuses on core engineering disciplines including algorithms, data structures, object-oriented design, system architecture, database design, and desktop application development. We build strong problem-solving muscles and engineering fundamentals.',
    topics: ['Data Structures & Algorithms', 'System Architecture', 'Design Patterns', 'Low-Level Design (LLD)', 'Database Internals'],
    technologies: ['C++', 'Go', 'Rust', 'Java', 'Python', 'PostgreSQL', 'Redis'],
    lead: 'Aryan Sharma',
    color: 'from-blue-500 to-indigo-600',
    stats: { members: 110, projects: 12, workshops: 8 }
  },
  {
    id: 'web-mobile',
    title: 'Web & Mobile Development',
    shortName: 'Web & Mobile',
    icon: 'Layout',
    tagline: 'Crafting responsive, delightful, and interactive modern applications.',
    description: 'Dedicated to front-end artistry, back-end scalability, and cross-platform mobile experiences. Members learn modern frameworks, progressive web apps, micro-frontends, responsive layouts, and robust REST/GraphQL APIs.',
    topics: ['Modern React & Next.js', 'Mobile Apps with Flutter & React Native', 'State Management & Offline First', 'Serverless Functions', 'UI/UX Design Systems'],
    technologies: ['React', 'Next.js', 'Node.js', 'Flutter', 'TypeScript', 'Tailwind CSS', 'GraphQL'],
    lead: 'Sneha Patel',
    color: 'from-cyan-500 to-blue-600',
    stats: { members: 145, projects: 18, workshops: 10 }
  },
  {
    id: 'ai-ml',
    title: 'Artificial Intelligence & ML',
    shortName: 'AI & Data Science',
    icon: 'BrainCircuit',
    tagline: 'Unlocking predictive intelligence, deep learning, and generative models.',
    description: 'Empowers students to dive into data analysis, computer vision, natural language processing, LLMs, reinforcement learning, and MLOps. We translate mathematical algorithms into real-world predictive models and intelligent autonomous agents.',
    topics: ['Machine Learning Foundations', 'Deep Neural Networks', 'NLP & Large Language Models', 'Computer Vision & OpenCV', 'MLOps & Model Deployment'],
    technologies: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'HuggingFace', 'FastAPI', 'Pandas'],
    lead: 'Rohan Deshmukh',
    color: 'from-purple-500 to-pink-600',
    stats: { members: 160, projects: 15, workshops: 12 }
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & Ethical Hacking',
    shortName: 'CyberSec & Forensics',
    icon: 'ShieldCheck',
    tagline: 'Defending the perimeter through hands-on penetration testing and forensics.',
    description: 'Covers red-teaming, blue-teaming, cryptography, web security (OWASP Top 10), reverse engineering, network forensics, and Capture The Flag (CTF) challenges. Students learn how to identify vulnerabilities and harden defenses against evolving threats.',
    topics: ['Web Application Pentesting', 'Network Security & Packet Analysis', 'Reverse Engineering', 'Cryptography & Steganography', 'CTF Training & Bug Bounty'],
    technologies: ['Wireshark', 'Burp Suite', 'Kali Linux', 'Metasploit', 'Nmap', 'Ghidra', 'Python'],
    lead: 'Ananya Verma',
    color: 'from-red-500 to-rose-600',
    stats: { members: 95, projects: 9, workshops: 7 }
  },
  {
    id: 'cloud-devops',
    title: 'Cloud Computing & DevOps',
    shortName: 'Cloud & Infrastructure',
    icon: 'Cloud',
    tagline: 'Automating pipelines and orchestrating containerized infrastructure at scale.',
    description: 'Provides hands-on experience in cloud architectures (AWS, Google Cloud, Azure), containerization, Kubernetes orchestration, Infrastructure as Code, CI/CD pipelines, and observability.',
    topics: ['Containers with Docker', 'Kubernetes Cluster Orchestration', 'CI/CD Pipelines with GitHub Actions', 'Infrastructure as Code (Terraform)', 'Cloud Security & FinOps'],
    technologies: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'GitHub Actions', 'Prometheus', 'Linux'],
    lead: 'Vikramaditya Rao',
    color: 'from-amber-500 to-orange-600',
    stats: { members: 105, projects: 11, workshops: 9 }
  },
  {
    id: 'iot-robotics',
    title: 'Internet of Things (IoT)',
    shortName: 'IoT & Embedded',
    icon: 'Cpu',
    tagline: 'Bridging the physical and digital world with microcontrollers and sensors.',
    description: 'Focuses on embedded systems, microcontrollers, edge computing, sensor telemetry, wireless communication protocols (MQTT, LoRaWAN, BLE), and robotics. Students build tangible smart hardware prototypes.',
    topics: ['Microcontroller Programming', 'Sensor Integration & Telemetry', 'MQTT & IoT Cloud Brokers', 'Edge AI & TinyML', 'Hardware Prototyping & PCB Design'],
    technologies: ['ESP32', 'Arduino', 'Raspberry Pi', 'C/C++', 'MQTT', 'FreeRTOS', 'KiCAD'],
    lead: 'Kavya Nair',
    color: 'from-emerald-500 to-teal-600',
    stats: { members: 80, projects: 10, workshops: 6 }
  }
];

const usersData = [
  {
    _id: 'user-admin-001',
    name: 'Club Lead Admin',
    email: 'admin@code2chill.org',
    password: getHashedPassword('admin123'),
    role: 'admin',
    domain: 'Software Development',
    collegeId: 'C2C-EXEC-01',
    year: '4th Year',
    branch: 'Computer Science & Engineering',
    bio: 'President & Lead Coordinator of Code2Chill. Passionate about systems architecture and open source culture.',
    github: 'https://github.com/code2chill',
    linkedin: 'https://linkedin.com/company/code2chill',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    registeredEvents: ['event-001', 'event-002']
  },
  {
    _id: 'user-member-001',
    name: 'Devin Student',
    email: 'member@code2chill.org',
    password: getHashedPassword('member123'),
    role: 'member',
    domain: 'Web & Mobile Development',
    collegeId: 'CS23B1042',
    year: '2nd Year',
    branch: 'Information Technology',
    bio: 'Passionate full-stack developer exploring React, Node.js, and cloud deployments.',
    github: 'https://github.com/devinstudent',
    linkedin: 'https://linkedin.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    registeredEvents: ['event-001']
  }
];

const teamMembersData = [
  {
    _id: 'team-001',
    name: 'Aryan Sharma',
    role: 'President & Founder',
    domain: 'Executive Board',
    year: '4th Year, CSE',
    bio: 'Loves building distributed systems, community mentoring, and organizing hackathons.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  },
  {
    _id: 'team-002',
    name: 'Sneha Patel',
    role: 'Vice President & Web Lead',
    domain: 'Web & Mobile Development',
    year: '3rd Year, IT',
    bio: 'Frontend enthusiast obsessed with high-fidelity UI design, animations, and React performance.',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  },
  {
    _id: 'team-003',
    name: 'Rohan Deshmukh',
    role: 'Technical Head (AI & ML)',
    domain: 'Artificial Intelligence & ML',
    year: '4th Year, AI & DS',
    bio: 'Researches Computer Vision, LLM fine-tuning, and scalable machine learning workflows.',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  },
  {
    _id: 'team-004',
    name: 'Ananya Verma',
    role: 'Cybersecurity Domain Head',
    domain: 'Cybersecurity',
    year: '3rd Year, CSE-Cyber',
    bio: 'CTF player, ethical hacker, and advocate for campus digital privacy and security awareness.',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  },
  {
    _id: 'team-005',
    name: 'Vikramaditya Rao',
    role: 'DevOps & Cloud Head',
    domain: 'Cloud Computing',
    year: '3rd Year, CSE',
    bio: 'Cloud architect certified in AWS and Kubernetes. Automating everything that moves.',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  },
  {
    _id: 'team-006',
    name: 'Kavya Nair',
    role: 'IoT & Hardware Lead',
    domain: 'Internet of Things (IoT)',
    year: '3rd Year, ECE',
    bio: 'Hardware hacker bridging microcontrollers with cloud dashboards and smart campus sensors.',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  }
];

const eventsData = [
  {
    _id: 'event-001',
    title: 'CodePulse 2026: 36-Hour National Flagship Hackathon',
    category: 'Hackathon',
    domain: 'Software Development',
    description: 'The annual flagship hackathon of Code2Chill! Over 36 hours of non-stop innovation, mentorship from industry architects, free food, swag packs, and cash prizes worth $2,500. Form teams of 2 to 4 and build solutions for real-world impact.',
    date: '2026-12-12T09:00:00.000Z',
    endDate: '2026-12-13T21:00:00.000Z',
    time: '09:00 AM - Next Day 09:00 PM',
    venue: 'Auditorium A & Innovation Center, Main Campus',
    type: 'In-Person',
    banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    capacity: 250,
    registeredCount: 184,
    registrationDeadline: '2026-12-05T23:59:59.000Z',
    status: 'upcoming',
    tags: ['Hackathon', 'Cash Prizes', 'Mentorship', 'All Domains', 'Networking'],
    prerequisites: 'Laptop, charger, team enthusiasm, and an eagerness to build cool stuff!',
    organizer: 'Code2Chill Executive Council',
    speaker: 'Mentors from Google, Microsoft, and Accel portfolio startups'
  },
  {
    _id: 'event-002',
    title: 'Zero to Zero-Day: Hands-On CyberSec & CTF Sprint',
    category: 'Workshop',
    domain: 'Cybersecurity',
    description: 'An intensive technical workshop covering web application security, finding SQL injections, XSS vulnerabilities, privilege escalation, and decoding cryptic ciphers. Features a live mini-CTF challenge at the end!',
    date: '2026-11-28T14:00:00.000Z',
    endDate: '2026-11-28T18:00:00.000Z',
    time: '02:00 PM - 06:00 PM',
    venue: 'Computer Lab 3 & Hybrid Live Stream',
    type: 'Hybrid',
    banner: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    capacity: 100,
    registeredCount: 78,
    registrationDeadline: '2026-11-27T18:00:00.000Z',
    status: 'upcoming',
    tags: ['Cybersecurity', 'CTF', 'Ethical Hacking', 'Hands-on', 'Certification'],
    prerequisites: 'Basic command line knowledge; Kali Linux VM or Docker installed.',
    organizer: 'Cybersecurity Domain',
    speaker: 'Ananya Verma (Domain Lead) & Guest Security Analyst'
  },
  {
    _id: 'event-003',
    title: 'Docker & Kubernetes Bootcamp: From Localhost to the Cloud',
    category: 'Workshop',
    domain: 'Cloud Computing',
    description: 'Master containerization from ground zero. Learn how to write optimized Dockerfiles, manage multi-container apps with Docker Compose, deploy pods to Kubernetes, and set up continuous automated deployments with GitHub Actions.',
    date: '2026-12-02T10:00:00.000Z',
    endDate: '2026-12-02T16:00:00.000Z',
    time: '10:00 AM - 04:00 PM',
    venue: 'Seminar Hall B',
    type: 'In-Person',
    banner: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
    capacity: 120,
    registeredCount: 95,
    registrationDeadline: '2026-12-01T23:59:59.000Z',
    status: 'upcoming',
    tags: ['Docker', 'Kubernetes', 'DevOps', 'Cloud', 'CI/CD'],
    prerequisites: 'Basic knowledge of Git and web application basics.',
    organizer: 'Cloud & DevOps Domain',
    speaker: 'Vikramaditya Rao (AWS Certified Solutions Architect)'
  },
  {
    _id: 'event-004',
    title: 'Neural Networks & LLM Agents: Building with Modern AI',
    category: 'Technical Talk',
    domain: 'Artificial Intelligence & ML',
    description: 'Explore the revolution in Large Language Models and autonomous agent architectures. We will code an autonomous research agent using Python, LangChain, and vector embeddings in real time.',
    date: '2026-12-08T16:00:00.000Z',
    endDate: '2026-12-08T18:30:00.000Z',
    time: '04:00 PM - 06:30 PM',
    venue: 'Tech Auditorium 2',
    type: 'In-Person',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    capacity: 150,
    registeredCount: 142,
    registrationDeadline: '2026-12-07T20:00:00.000Z',
    status: 'upcoming',
    tags: ['AI', 'LLM', 'Python', 'Machine Learning', 'Autonomous Agents'],
    prerequisites: 'Familiarity with Python syntax.',
    organizer: 'AI & ML Domain',
    speaker: 'Rohan Deshmukh & AI Research Scholar'
  },
  {
    _id: 'event-005',
    title: 'Code2Chill SpeedCode: Competitive Programming Showdown',
    category: 'Coding Competition',
    domain: 'Software Development',
    description: 'A 2-hour algorithmic battle testing data structures, dynamic programming, graph algorithms, and speed. Leaderboards updated in real time with exclusive mechanical keyboards and tech gear for winners!',
    date: '2026-12-20T18:00:00.000Z',
    endDate: '2026-12-20T20:30:00.000Z',
    time: '06:00 PM - 08:30 PM',
    venue: 'Online on HackerRank / C2C Portal',
    type: 'Virtual',
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    capacity: 300,
    registeredCount: 198,
    registrationDeadline: '2026-12-19T23:59:59.000Z',
    status: 'upcoming',
    tags: ['Algorithms', 'Data Structures', 'Competitive Programming', 'Prizes'],
    prerequisites: 'Any supported language: C++, Java, Python, Go.',
    organizer: 'Software Development Domain',
    speaker: 'C2C Problem Setting Team'
  },
  {
    _id: 'event-006',
    title: 'Smart Campus IoT Sprint: From Sensor to Cloud Telemetry',
    category: 'Project Sprints',
    domain: 'Internet of Things (IoT)',
    description: 'Hardware prototyping session where teams program ESP32 microcontrollers, connect air quality and temperature sensors, and stream real-time data to an interactive MQTT dashboard.',
    date: '2026-11-10T10:00:00.000Z',
    endDate: '2026-11-10T17:00:00.000Z',
    time: '10:00 AM - 05:00 PM',
    venue: 'IoT & Hardware Innovation Lab',
    type: 'In-Person',
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    capacity: 60,
    registeredCount: 60,
    registrationDeadline: '2026-11-08T23:59:59.000Z',
    status: 'completed',
    tags: ['IoT', 'ESP32', 'Sensors', 'Hardware', 'Microcontrollers'],
    prerequisites: 'Curiosity for electronics and basic C programming.',
    organizer: 'IoT & Robotics Domain',
    speaker: 'Kavya Nair'
  }
];

const projectsData = [
  {
    _id: 'proj-001',
    title: 'CampusSense: Intelligent IoT Environment & Energy Monitor',
    domain: 'Internet of Things (IoT)',
    description: 'An open-source distributed sensor network deployed across campus laboratories to monitor temperature, humidity, CO2 levels, and electrical power consumption in real-time, streaming to a Grafana dashboard.',
    techStack: ['ESP32', 'MQTT', 'Node.js', 'InfluxDB', 'Grafana', 'C++'],
    github: 'https://github.com/code2chill/campus-sense',
    liveDemo: 'https://campussense.code2chill.org',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    authors: ['Kavya Nair', 'Aditya Verma', 'Meera Rao'],
    likes: 42,
    featured: true,
    status: 'Active'
  },
  {
    _id: 'proj-002',
    title: 'NeuroScribe: Multi-Modal AI Lecture Assistant',
    domain: 'Artificial Intelligence & ML',
    description: 'An AI-powered academic tool that transcribes recorded lectures, extracts slide diagrams, generates structured notes, flashcards, and conceptual quizzes using whisper and modern LLM pipelines.',
    techStack: ['Python', 'FastAPI', 'PyTorch', 'Whisper', 'React', 'ChromaDB'],
    github: 'https://github.com/code2chill/neuro-scribe',
    liveDemo: 'https://neuroscribe.code2chill.org',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    authors: ['Rohan Deshmukh', 'Simran Kaur'],
    likes: 67,
    featured: true,
    status: 'Active'
  },
  {
    _id: 'proj-003',
    title: 'CyberShield CTF: Gamified Security Training Arena',
    domain: 'Cybersecurity',
    description: 'An interactive vulnerability playground designed for college students to practice offensive security, cryptographic decoding, binary exploitation, and web attack simulations in safe isolated Docker sandboxes.',
    techStack: ['Docker', 'Python', 'Go', 'React', 'TailwindCSS', 'Redis'],
    github: 'https://github.com/code2chill/cybershield-arena',
    liveDemo: 'https://ctf.code2chill.org',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    authors: ['Ananya Verma', 'Rahul Sen'],
    likes: 54,
    featured: true,
    status: 'Active'
  },
  {
    _id: 'proj-004',
    title: 'CloudPulse: Automated Multi-Cloud Cost & Health Monitor',
    domain: 'Cloud Computing',
    description: 'A lightweight DevOps tool that continuously scans cloud resources across AWS and GCP, highlights unused volumes, detects misconfigured security groups, and sends Discord / Slack alerts.',
    techStack: ['Go', 'AWS SDK', 'Docker', 'Terraform', 'React', 'Prometheus'],
    github: 'https://github.com/code2chill/cloud-pulse',
    liveDemo: 'https://cloudpulse.code2chill.org',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
    authors: ['Vikramaditya Rao', 'Varun Iyer'],
    likes: 38,
    featured: false,
    status: 'Active'
  },
  {
    _id: 'proj-005',
    title: 'AlgoVisualizer Pro: Interactive 3D Algorithm Sandbox',
    domain: 'Software Development',
    description: 'A high-performance visual simulator for sorting, graph traversals (Dijkstra, A*, BFS, DFS), binary search trees, and dynamic programming with step-by-step playback and time complexity graphs.',
    techStack: ['TypeScript', 'Three.js', 'React', 'Canvas API', 'TailwindCSS'],
    github: 'https://github.com/code2chill/algovisualizer-pro',
    liveDemo: 'https://algoviz.code2chill.org',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    authors: ['Aryan Sharma', 'Kunal Ghosh'],
    likes: 89,
    featured: true,
    status: 'Completed'
  },
  {
    _id: 'proj-006',
    title: 'C2C Campus Connect: Peer Mentorship & Collaboration Hub',
    domain: 'Web & Mobile Development',
    description: 'A modern PWA helping college students discover project partners, find domain mentors, share hackathon team openings, and showcase verified club certifications.',
    techStack: ['MongoDB', 'Express', 'React', 'Node.js', 'Socket.io', 'TailwindCSS'],
    github: 'https://github.com/code2chill/campus-connect',
    liveDemo: 'https://connect.code2chill.org',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    authors: ['Sneha Patel', 'Tanvi Mehta', 'Nikhil Joshi'],
    likes: 73,
    featured: false,
    status: 'Active'
  }
];

const announcementsData = [
  {
    _id: 'ann-001',
    title: '🚀 CodePulse 2026 Hackathon Registrations Are Now LIVE!',
    content: 'Registration is officially open for our 36-hour flagship hackathon. Early bird teams receive free custom swag hoodies and cloud sponsor credits!',
    priority: 'urgent',
    category: 'Hackathon',
    date: '2026-11-20T10:00:00.000Z',
    link: '/events/event-001'
  },
  {
    _id: 'ann-002',
    title: '🛡️ Hands-on CyberSec & CTF Bootcamp Scheduled for Nov 28',
    content: 'Join us in Computer Lab 3 or virtually for an in-depth ethical hacking and bug bounty walkthrough with live challenges.',
    priority: 'normal',
    category: 'Workshop',
    date: '2026-11-18T14:30:00.000Z',
    link: '/events/event-002'
  },
  {
    _id: 'ann-003',
    title: '🌟 Code2Chill Annual Recruitment Drive 2026-27 is Open!',
    content: 'Calling all innovative minds from 1st, 2nd, and 3rd year! Apply now to join our core domains and lead impactful technical initiatives.',
    priority: 'urgent',
    category: 'Recruitment',
    date: '2026-11-15T09:00:00.000Z',
    link: '/join'
  }
];

const statsData = {
  activeMembers: 680,
  eventsOrganized: 38,
  innovativeProjects: 46,
  techDomains: 6,
  hackathonsWon: 19,
  githubStars: '1.4k+'
};

module.exports = {
  domainsData,
  usersData,
  teamMembersData,
  eventsData,
  projectsData,
  announcementsData,
  statsData
};

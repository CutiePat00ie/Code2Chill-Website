import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../services/api';
import EventCard from '../components/EventCard';
import { 
  Calendar, 
  Search, 
  Filter, 
  Sparkles, 
  Trophy, 
  Clock, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';

const categories = [
  'All',
  'Hackathon',
  'Workshop',
  'Technical Talk',
  'Coding Competition',
  'Project Sprints'
];

const domainsList = [
  'All',
  'Software Development',
  'Web & Mobile Development',
  'Artificial Intelligence & ML',
  'Cybersecurity',
  'Cloud Computing',
  'Internet of Things (IoT)'
];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [statusTab, setStatusTab] = useState('upcoming'); // 'upcoming' or 'completed'

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventsAPI.getEvents({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        domain: selectedDomain !== 'All' ? selectedDomain : undefined,
        status: statusTab !== 'All' ? statusTab : undefined,
        search: search.trim() || undefined
      });
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, selectedDomain, statusTab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="badge bg-purple-500/10 text-purple-300 border border-purple-500/30">
          Hackathons & Workshops
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Events & Technical <span className="text-gradient">Bootcamps</span>
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Level up your engineering skills, build hackathon projects, and earn club badges. Register in one click with your student account.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800 space-y-5">
        
        {/* Top Controls: Status Toggle & Search Form */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-dark-900 border border-slate-800 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setStatusTab('upcoming')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                statusTab === 'upcoming'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upcoming ({statusTab === 'upcoming' ? events.length : '...'})
            </button>
            <button
              onClick={() => setStatusTab('completed')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                statusTab === 'completed'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Past Archives
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, title, or keywords..."
              className="w-full pl-10 pr-20 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold hover:bg-cyan-500/30"
            >
              Search
            </button>
          </form>

        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs font-mono text-slate-400 uppercase flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-400 text-dark-950 font-bold shadow-md shadow-cyan-400/20'
                  : 'bg-dark-900 text-slate-300 border border-slate-800 hover:border-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Domain Filter Dropdown */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="text-xs font-mono text-slate-400 uppercase">
            Domain Wing:
          </span>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-1.5 bg-dark-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            {domainsList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-xs font-mono text-slate-400">Loading Code2Chill events...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} onUpdate={fetchEvents} />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 space-y-3">
          <Calendar className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Events Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            We couldn't find any events matching your selected filters. Try choosing another category or clearing search terms.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedDomain('All');
              setSearch('');
              setStatusTab('All');
            }}
            className="btn-secondary text-xs py-2 px-4 mt-2"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};

export default Events;

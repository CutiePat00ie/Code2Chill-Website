import CoverArt from '../components/CoverArt';
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import TicketModal from '../components/TicketModal';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowLeft, 
  Ticket, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  Tag, 
  Building 
} from 'lucide-react';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isRegisteredForEvent, registerEvent, cancelEvent } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showTicket, setShowTicket] = useState(false);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await eventsAPI.getEventById(id);
      if (res.data.success) {
        setEvent(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching event details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-xs font-mono text-slate-400">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Event Not Found</h2>
        <p className="text-sm text-slate-400">The requested event could not be located or has expired.</p>
        <Link to="/events" className="btn-primary text-sm py-2 px-5 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>
      </div>
    );
  }

  const isRegistered = isRegisteredForEvent(event._id);
  const isFull = event.registeredCount >= event.capacity;

  const handleRegister = async () => {
    if (!user) {
      navigate(`/login?redirect=/events/${event._id}`);
      return;
    }

    try {
      setActionLoading(true);
      await registerEvent(event._id);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      await fetchEvent();
      setShowTicket(true);
    } catch (err) {
      alert(err.message || 'Registration failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your registration?')) return;
    try {
      setActionLoading(true);
      await cancelEvent(event._id);
      await fetchEvent();
    } catch (err) {
      alert(err.message || 'Failed to cancel');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back Link */}
      <div>
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events Catalog
        </Link>
      </div>

      {/* Hero Banner Card */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-dark-900">
          <CoverArt seed={event.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge bg-purple-500/20 text-purple-300 border border-purple-500/40">
                {event.category}
              </span>
              <span className="badge bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                {event.domain}
              </span>
              <span className="badge bg-dark-900/80 text-slate-300 border border-slate-700">
                {event.type}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Action & Metadata Bar */}
        <div className="p-6 sm:p-8 bg-dark-900/60 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-300">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Date</span>
              <span className="font-semibold text-white">
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Time</span>
              <span className="font-semibold text-white">{event.time}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Venue</span>
              <span className="font-semibold text-white truncate block">{event.venue}</span>
            </div>
          </div>

          {/* Registration CTA */}
          <div className="flex items-center gap-3">
            {isRegistered ? (
              <>
                <button
                  onClick={() => setShowTicket(true)}
                  className="btn-primary text-xs sm:text-sm py-2.5 px-5 flex items-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  View Digital Pass
                </button>
                <button
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="px-3 py-2.5 rounded-xl text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleRegister}
                disabled={actionLoading || isFull || event.status === 'completed'}
                className={`py-3 px-6 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  isFull || event.status === 'completed'
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Register For Event
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Body */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h3 className="text-xl font-bold text-white">About This Event</h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {event.prerequisites && (
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                Prerequisites & Requirements
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {event.prerequisites}
              </p>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-cyan-400 mr-1" />
              {event.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono px-3 py-1 rounded-lg bg-dark-900 border border-slate-800 text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          
          {/* Organizer Card */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Event Details
            </h4>
            
            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px] font-mono uppercase">Organizer</span>
                <span className="font-semibold text-white">{event.organizer || 'Code2Chill Technical Council'}</span>
              </div>

              {event.speaker && (
                <div>
                  <span className="text-slate-500 block text-[10px] font-mono uppercase">Speaker / Mentors</span>
                  <span className="font-semibold text-cyan-300">{event.speaker}</span>
                </div>
              )}

              <div>
                <span className="text-slate-500 block text-[10px] font-mono uppercase">Spots Claimed</span>
                <span className="font-mono text-white font-bold">{event.registeredCount || 0} / {event.capacity} Attendees</span>
              </div>
            </div>
          </div>

          {/* Quick Help */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-white">Have a question?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reach out to our event coordinators at <strong className="text-cyan-400">events@code2chill.org</strong> or visit the club room.
            </p>
          </div>

        </div>

      </div>

      {showTicket && (
        <TicketModal
          event={event}
          user={user}
          onClose={() => setShowTicket(false)}
        />
      )}

    </div>
  );
};

export default EventDetail;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import TicketModal from './TicketModal';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowRight, 
  Ticket, 
  CheckCircle, 
  Sparkles,
  Loader2
} from 'lucide-react';

const categoryColors = {
  Hackathon: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Workshop: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Technical Talk': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Coding Competition': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  'Project Sprints': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  General: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
};

const EventCard = ({ event, onUpdate }) => {
  const { user, isRegisteredForEvent, registerEvent, cancelEvent } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const navigate = useNavigate();

  const isRegistered = isRegisteredForEvent(event._id);
  const isFull = event.registeredCount >= event.capacity;
  const badgeClass = categoryColors[event.category] || categoryColors.General;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=/events');
      return;
    }

    try {
      setSubmitting(true);
      await registerEvent(event._id);
      
      // Fire confetti celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00f2fe', '#8b5cf6', '#4facfe']
      });

      if (onUpdate) onUpdate();
      setShowTicket(true);
    } catch (err) {
      alert(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    if (!confirm('Are you sure you want to cancel your event registration?')) return;
    try {
      setSubmitting(true);
      await cancelEvent(event._id);
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.message || 'Failed to cancel');
    } finally {
      setSubmitting(false);
    }
  };

  const progressPercent = Math.min(100, Math.round(((event.registeredCount || 0) / (event.capacity || 100)) * 100));

  return (
    <>
      <div className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-slate-800 hover:border-cyan-500/30">
        
        {/* Event Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-dark-900">
          <img
            src={event.banner || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80'}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
          
          {/* Top Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className={`badge border backdrop-blur-md ${badgeClass}`}>
              {event.category}
            </span>
            <span className="badge bg-dark-950/80 text-slate-300 border border-slate-700/80 backdrop-blur-md">
              {event.type}
            </span>
          </div>

          {/* Domain Pill on bottom of banner */}
          <div className="absolute bottom-3 left-3">
            <span className="text-[11px] font-mono font-semibold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-500/30">
              {event.domain}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <Link to={`/events/${event._id}`}>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                {event.title}
              </h3>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="space-y-2.5 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>

          {/* Capacity Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-cyan-400" />
                Capacity
              </span>
              <span className="font-mono text-[11px]">
                {event.registeredCount || 0} / {event.capacity} spots
              </span>
            </div>
            <div className="w-full h-1.5 bg-dark-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  progressPercent >= 90 ? 'bg-rose-500' : progressPercent >= 60 ? 'bg-amber-400' : 'bg-cyan-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action Button Section */}
          <div className="pt-2 flex items-center gap-2">
            {isRegistered ? (
              <div className="flex-1 flex items-center gap-2">
                <button
                  onClick={() => setShowTicket(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  View Pass
                </button>
                <button
                  onClick={handleCancel}
                  disabled={submitting}
                  className="py-2 px-2.5 rounded-xl text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-700 transition-colors"
                  title="Cancel Registration"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleRegister}
                disabled={submitting || isFull || event.status === 'completed'}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  event.status === 'completed'
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : isFull
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {submitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : event.status === 'completed' ? (
                  'Event Concluded'
                ) : isFull ? (
                  'Fully Booked'
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    1-Click Register
                  </>
                )}
              </button>
            )}

            <Link
              to={`/events/${event._id}`}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-dark-800 border border-slate-700 hover:border-slate-500 transition-all"
              title="Event Details"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
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
    </>
  );
};

export default EventCard;

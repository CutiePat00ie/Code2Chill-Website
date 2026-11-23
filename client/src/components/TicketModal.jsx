import React from 'react';
import { X, Calendar, Clock, MapPin, QrCode, CheckCircle2, Printer, Shield } from 'lucide-react';

const TicketModal = ({ event, user, onClose }) => {
  if (!event || !user) return null;

  const handlePrint = () => {
    window.print();
  };

  const ticketId = `C2C-${event._id.slice(-6).toUpperCase()}-${user._id.slice(-4).toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-dark-900 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden">
        
        {/* Top Accent Strip */}
        <div className="h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-dark-800/80 rounded-xl border border-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  Verified Event Pass
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> Confirmed
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-mono">Code2Chill (C2C)</h3>
            </div>
          </div>

          {/* Ticket Body Card */}
          <div className="bg-dark-950/80 rounded-xl border border-slate-800 p-5 space-y-4 relative">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wide">
                {event.category}
              </span>
              <h2 className="text-xl font-bold text-white mt-2 leading-snug">
                {event.title}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">{event.time}</span>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">{event.venue}</span>
              </div>
            </div>

            {/* Attendee Details */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Attendee</p>
                <p className="text-sm font-bold text-white">{user.name}</p>
                <p className="text-xs text-slate-400">{user.collegeId || user.email}</p>
              </div>

              {/* Simulated QR Code */}
              <div className="flex flex-col items-center">
                <div className="p-2 bg-white rounded-lg">
                  <QrCode className="w-12 h-12 text-dark-950" />
                </div>
                <span className="text-[9px] font-mono text-cyan-400 mt-1">{ticketId}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="btn-secondary text-sm py-2.5 px-4 flex-1 flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print / Save Pass
            </button>
            <button
              onClick={onClose}
              className="btn-primary text-sm py-2.5 px-5 flex-1"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;

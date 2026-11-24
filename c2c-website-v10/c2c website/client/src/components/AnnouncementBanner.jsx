import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { announcementAPI } from '../services/api';
import { Megaphone, X, ArrowRight, Sparkles } from 'lucide-react';

const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await announcementAPI.getAnnouncements();
        if (res.data.success && res.data.data.length > 0) {
          setAnnouncements(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching announcements:', err);
      }
    };

    fetchAnnouncements();
  }, []);

  if (!visible || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  return (
    <div className="bg-gradient-to-r from-cyan-950 via-dark-900 to-indigo-950 border-b border-cyan-500/20 py-2.5 px-4 text-xs sm:text-sm text-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-bold uppercase tracking-wider shrink-0 border border-cyan-500/30">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Alert
          </span>
          <p className="truncate font-medium text-slate-200">
            {current.title}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {current.link && (
            <Link
              to={current.link}
              className="inline-flex items-center gap-1 font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
            >
              Details
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {announcements.length > 1 && (
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % announcements.length)}
              className="text-[11px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-dark-800 border border-slate-700"
            >
              Next ({currentIndex + 1}/{announcements.length})
            </button>
          )}

          <button
            onClick={() => setVisible(false)}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;

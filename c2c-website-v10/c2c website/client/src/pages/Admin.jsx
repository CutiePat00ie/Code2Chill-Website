import React, { useCallback, useEffect, useState } from 'react';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import { teamAPI, projectsAPI, announcementAPI, contactAPI, joinAPI } from '../services/api';

const TABS = ['Applications', 'Messages', 'Team', 'Announcements', 'Projects'];
const input = 'w-full px-3 py-2 rounded-xl border-2 border-slate-800 bg-dark-950 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400';

const Row = ({ children, onDelete }) => (
  <div className="glass-card rounded-2xl p-4 flex items-start justify-between gap-4">
    <div className="min-w-0 flex-1">{children}</div>
    {onDelete && (
      <button onClick={onDelete} className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
    )}
  </div>
);

export default function Admin() {
  const [tab, setTab] = useState('Applications');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const call = { Applications: joinAPI.getApplications, Messages: contactAPI.getContacts, Team: teamAPI.getTeamMembers, Announcements: announcementAPI.getAnnouncements, Projects: projectsAPI.getProjects }[tab];
      const res = await call();
      setData(res.data.data || []);
    } catch (e) {
      setData([]);
      setMsg(e.response?.data?.message || 'Could not load data');
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { setForm({}); setMsg(''); load(); }, [load]);

  const act = async (fn, okMsg) => {
    try { await fn(); setMsg(okMsg || 'Done'); await load(); } catch (e) { setMsg(e.response?.data?.message || 'Action failed'); }
  };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const addTeam = (e) => {
    e.preventDefault();
    act(() => teamAPI.createTeamMember({
      ...form,
      skills: (form.skills || '').split(',').map((s) => s.trim()).filter(Boolean),
      isHead: form.isHead === 'yes'
    }), 'Member added'); setForm({});
  };
  const addAnn = (e) => { e.preventDefault(); act(() => announcementAPI.createAnnouncement(form), 'Announcement posted'); setForm({}); };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-2">
        <span className="badge bg-purple-500/10 text-purple-300 border-2 border-purple-500/30">Admin</span>
        <h1 className="text-4xl font-extrabold text-white">Club <span className="serif-em text-gradient">control room</span></h1>
        <p className="text-sm text-slate-400">Review applications and messages, and manage the team, announcements and projects.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${tab === t ? 'bg-brand-orange text-[#1F1B24] border-[#1F1B24]' : 'border-slate-800 text-slate-300'}`}>{t}</button>
        ))}
      </div>
      {msg && <p className="text-sm font-semibold text-cyan-400">{msg}</p>}

      {tab === 'Team' && (
        <form onSubmit={addTeam} className="glass-card rounded-2xl p-5 grid sm:grid-cols-2 gap-3">
          <input className={input} placeholder="Name *" required value={form.name || ''} onChange={set('name')} />
          <input className={input} placeholder="Role * (e.g. President)" required value={form.role || ''} onChange={set('role')} />
          <input className={input} placeholder="Domain / wing *" required value={form.domain || ''} onChange={set('domain')} />
          <input className={input} placeholder="Year (e.g. 3rd Year, CSE)" value={form.year || ''} onChange={set('year')} />
          <input className={input} placeholder="Emoji avatar (e.g. 🧠)" value={form.emoji || ''} onChange={set('emoji')} />
          <input className={input} placeholder="Email" value={form.email || ''} onChange={set('email')} />
          <input className={input} placeholder="Skills (comma separated)" value={form.skills || ''} onChange={set('skills')} />
          <select className={input} value={form.isHead || 'no'} onChange={set('isHead')}><option value="no">Core member / lead</option><option value="yes">Club Head</option></select>
          <input className={`${input} sm:col-span-2`} placeholder="Short bio" value={form.bio || ''} onChange={set('bio')} />
          <input className={input} placeholder="Fun fact" value={form.funFact || ''} onChange={set('funFact')} />
          <input className={input} placeholder="Favourite quote" value={form.quote || ''} onChange={set('quote')} />
          <input className={input} placeholder="GitHub URL" value={form.github || ''} onChange={set('github')} />
          <input className={input} placeholder="LinkedIn URL" value={form.linkedin || ''} onChange={set('linkedin')} />
          <button className="btn-primary sm:col-span-2"><Plus className="w-4 h-4 mr-2" /> Add member</button>
        </form>
      )}
      {tab === 'Announcements' && (
        <form onSubmit={addAnn} className="glass-card rounded-2xl p-5 grid gap-3">
          <input className={input} placeholder="Title *" required value={form.title || ''} onChange={set('title')} />
          <textarea className={input} rows={3} placeholder="Message *" required value={form.content || ''} onChange={set('content')} />
          <select className={input} value={form.priority || 'normal'} onChange={set('priority')}><option value="normal">Normal</option><option value="info">Info</option><option value="urgent">Urgent</option></select>
          <button className="btn-primary"><Plus className="w-4 h-4 mr-2" /> Post announcement</button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center"><Loader2 className="w-7 h-7 text-cyan-400 animate-spin" /></div>
      ) : data.length === 0 ? (
        <p className="text-slate-400 text-sm">Nothing here yet.</p>
      ) : (
        <div className="space-y-3">
          {tab === 'Applications' && data.map((a) => (
            <Row key={a._id}>
              <p className="font-bold text-white">{a.name} <span className="text-xs font-mono text-slate-400">· {a.year}, {a.branch} · {a.domain}</span></p>
              <p className="text-xs text-slate-400">{a.email}{a.github ? ` · ${a.github}` : ''}</p>
              <p className="text-sm text-slate-300 mt-2">{a.whyJoin}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {['pending', 'shortlisted', 'accepted', 'rejected'].map((s) => (
                  <button key={s} onClick={() => act(() => joinAPI.updateStatus(a._id, s), `Marked ${s}`)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${a.status === s ? 'bg-brand-orange text-[#1F1B24] border-[#1F1B24]' : 'border-slate-800 text-slate-300'}`}>{s}</button>
                ))}
              </div>
            </Row>
          ))}
          {tab === 'Messages' && data.map((m) => (
            <Row key={m._id} onDelete={() => act(() => contactAPI.deleteContact(m._id), 'Deleted')}>
              <p className="font-bold text-white">{m.subject} <span className="text-xs font-mono text-slate-400">· {m.name} &lt;{m.email}&gt;</span></p>
              <p className="text-sm text-slate-300 mt-1">{m.message}</p>
            </Row>
          ))}
          {tab === 'Team' && data.map((m) => (
            <Row key={m._id} onDelete={() => act(() => teamAPI.deleteTeamMember(m._id), 'Removed')}>
              <p className="font-bold text-white">{m.name} {m.isHead && <span className="badge bg-amber-500/15 text-amber-400 ml-1">Head</span>}</p>
              <p className="text-xs text-slate-400">{m.role} · {m.domain}</p>
            </Row>
          ))}
          {tab === 'Announcements' && data.map((a) => (
            <Row key={a._id} onDelete={() => act(() => announcementAPI.deleteAnnouncement(a._id), 'Deleted')}>
              <p className="font-bold text-white">{a.title}</p>
              <p className="text-sm text-slate-300">{a.content}</p>
            </Row>
          ))}
          {tab === 'Projects' && data.map((p) => (
            <Row key={p._id} onDelete={() => act(() => projectsAPI.deleteProject(p._id), 'Deleted')}>
              <p className="font-bold text-white">{p.title} <span className="text-xs font-mono text-slate-400">· {p.status}</span></p>
              <p className="text-xs text-slate-400">{p.domain}</p>
            </Row>
          ))}
        </div>
      )}
    </div>
  );
}

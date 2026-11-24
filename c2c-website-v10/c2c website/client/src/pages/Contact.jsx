import React, { useState } from 'react';
import { contactAPI } from '../services/api';
import { Mail, Send } from 'lucide-react';

const initialForm = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const response = await contactAPI.submitContact(form);
      setStatus({ type: 'success', message: response.data.message || 'Your message has been sent.' });
      setForm(initialForm);
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Could not send your message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <div className="mb-8">
        <p className="text-cyan-400 text-xs font-mono tracking-widest uppercase mb-3">Get in touch</p>
        <h1 className="text-4xl font-black text-white mb-3">Contact Code2Chill</h1>
        <p className="text-slate-400">Have a question, idea, or collaboration in mind? Send the team a message.</p>
      </div>
      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-5">
        {[
          { name: 'name', label: 'Your name', type: 'text' },
          { name: 'email', label: 'Email address', type: 'email' },
          { name: 'subject', label: 'Subject', type: 'text' },
        ].map((field) => (
          <label key={field.name} className="block text-sm text-slate-300">
            {field.label}
            <input className="mt-2 w-full rounded-xl border border-slate-700 bg-dark-900 px-4 py-3 text-white outline-none focus:border-cyan-500" name={field.name} type={field.type} required value={form[field.name]} onChange={updateField} />
          </label>
        ))}
        <label className="block text-sm text-slate-300">
          Message
          <textarea className="mt-2 w-full min-h-36 rounded-xl border border-slate-700 bg-dark-900 px-4 py-3 text-white outline-none focus:border-cyan-500" name="message" required value={form.message} onChange={updateField} />
        </label>
        {status.message && <p role="status" className={status.type === 'success' ? 'text-sm text-emerald-400' : 'text-sm text-rose-400'}>{status.message}</p>}
        <button className="btn-primary w-full sm:w-auto" type="submit" disabled={loading}>
          <Send className="w-4 h-4 mr-2" />{loading ? 'Sending…' : 'Send message'}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-500 flex items-center gap-2"><Mail className="w-4 h-4" /> Your message is sent to the Code2Chill website backend.</p>
    </section>
  );
}

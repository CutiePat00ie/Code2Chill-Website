import React from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SiteShell from './components/layout/SiteShell';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';

function NotFound() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-24 text-center">
      <p className="text-cyan-400 font-mono text-sm mb-3">404 / PAGE NOT FOUND</p>
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">That page isn't in this build.</h1>
      <p className="text-slate-400 mb-8">Use the navigation to explore the Code2Chill website.</p>
      <Link to="/" className="btn-primary">Back to home</Link>
    </section>
  );
}

export default function App() {
  const { pathname } = useLocation();
  return (
    <SiteShell>
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div key={pathname} className="page-in">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events/:id" element={<EventDetail />} />
          {['about', 'domains', 'events', 'projects', 'team', 'goals', 'gallery', 'join', 'contact'].map((id) => (
            <Route key={id} path={`/${id}`} element={<Navigate to={`/#${id}`} replace />} />
          ))}
          <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </div>
      </main>
      <Footer />
    </div>
    </SiteShell>
  );
}

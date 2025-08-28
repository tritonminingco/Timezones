"use client";

import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";

export const SignUpForm: React.FC = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [timezone, setTimezone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  
  let messageColor = "";
  if (message) {
    if (/(?:fail|error|invalid)/i.test(message)) {
      messageColor = "text-rose-400";
    } else {
      messageColor = "text-amber-200";
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!name || !location || !timezone) {
      setMessage("Please fill name, location and timezone (e.g. America/New_York)");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/api/team-members', { name, location, timezone });
      if (res.data?.success) {
        setMessage(res.data.message || 'Signup submitted — pending approval');
        setName(''); setLocation(''); setTimezone('');
      } else {
        setMessage(res.data?.error || 'Failed to signup');
      }
    } catch (err: unknown) {
      let errMsg = 'Request failed';
      if (axios.isAxiosError(err)) {
        // axios error: try to read server message safely
        const resp = err.response as unknown as { data?: { error?: string } } | undefined;
        errMsg = resp?.data?.error || err.message || errMsg;
      }
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-md bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-indigo-900/40 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-slate-700/30"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 flex-shrink-0 rounded-full overflow-hidden shadow-inner ring-1 ring-amber-400/20">
          <Image src="/triton-logo.png" alt="Triton logo" fill sizes="80px" style={{ objectFit: 'cover' }} />
        </div>
        <div>
          <h3 className="text-white font-extrabold text-2xl tracking-tight">Triton's Global Ops Clock</h3>
          <p className="text-slate-300 text-sm mt-1">Quick sign-up — no GitHub required</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="su-name" className="sr-only">Full name</label>
        <input
          id="su-name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Full name"
          className="px-4 py-2 rounded-lg bg-slate-800/60 text-white border border-slate-600/30 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
        />

        <label htmlFor="su-location" className="sr-only">City or Country</label>
        <input
          id="su-location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="City or Country (e.g. London)"
          className="px-4 py-2 rounded-lg bg-slate-800/60 text-white border border-slate-600/30 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
        />

        <label htmlFor="su-timezone" className="sr-only">Timezone</label>
        <input
          id="su-timezone"
          value={timezone}
          onChange={e => setTimezone(e.target.value)}
          placeholder="Timezone (e.g. Europe/London)"
          className="px-4 py-2 rounded-lg bg-slate-800/60 text-white border border-slate-600/30 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
        />

        <div className="flex items-center gap-3 mt-2">
          <button
            aria-label="Submit sign up"
            className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-md font-semibold shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Sign up'}
          </button>
          <div className="text-sm text-slate-300">We will add you as "pending" until confirmed.</div>
        </div>

        {message && <output className={`text-sm mt-2 ${messageColor}`}>{message}</output>}
      </div>
    </form>
  );
};

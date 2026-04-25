import React from "react";
import { Link } from "wouter";
import { ArrowLeft, Play, Eye, Calendar } from "lucide-react";

const MOCK_HIGHLIGHTS = [
  { id: 1, title: "Game Winning TD", views: 1247, date: "Dec 15", thumbnail: null },
  { id: 2, title: "4.52 40-Yard Dash", views: 892, date: "Dec 10", thumbnail: null },
  { id: 3, title: "Highlight Reel 2024", views: 3421, date: "Nov 28", thumbnail: null },
];

export default function Highlights() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/feed" className="flex items-center gap-2 text-blue-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>
        <h1 className="text-3xl font-black mb-2">My Highlights</h1>
        <p className="text-slate-400 mb-8">Your athletic highlight reel — showcase your best moments.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_HIGHLIGHTS.map((h) => (
            <div key={h.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-colors">
              <div className="aspect-video bg-slate-700 flex items-center justify-center">
                <Play className="w-12 h-12 text-blue-400" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{h.title}</h3>
                <div className="flex items-center gap-4 text-slate-400 text-sm">
                  <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{h.views.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{h.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors">
            Upload New Highlight
          </button>
        </div>
      </div>
    </div>
  );
}

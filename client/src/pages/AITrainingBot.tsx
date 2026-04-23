import { useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function AITrainingBot() {
  const meQuery = trpc.auth.me.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });
  const [, navigate] = useLocation();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const CREDIT_COST = 5;

  const generateMutation = trpc.ai.generateTrainingPlan.useMutation({
    onSuccess: (data) => {
      setResult(data.result ?? "");
      toast.success(`Training plan generated! ${CREDIT_COST} credits used.`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to generate training plan");
    },
  });

  const handleGenerate = () => {
    if (!meQuery.data) { navigate("/signin"); return; }
    if (!prompt.trim()) { toast.error("Please enter your training goals"); return; }
    generateMutation.mutate({ prompt });
  };

  if (meQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!meQuery.data) { navigate("/signin"); return null; }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/feed" className="flex items-center gap-2">
            <span className="text-xl font-black text-white">ATHLYNX</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-cyan-400 font-semibold text-sm">🤖 AI Trainer</span>
            <Link href="/feed" className="text-cyan-400 hover:text-cyan-300 text-sm">Dashboard</Link>
          </div>
        </div>
      </header>

      <div className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-6xl block mb-4">🤖</span>
            <h1 className="text-4xl font-bold text-white mb-3">AI Training Bot</h1>
            <p className="text-xl text-gray-400 mb-6">
              Personalized training plans powered by LYNX AI — built for athletes, by athletes
            </p>
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/50 px-4 py-2 rounded-full">
              <span className="text-cyan-400">⚡</span>
              <span className="text-white font-semibold">{CREDIT_COST} credits per plan</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
            <label className="text-white font-semibold mb-3 block text-lg">Describe your training goals</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: I'm a college football wide receiver looking to increase my 40-yard dash speed and improve route running. I train 5 days a week and have access to a full weight room and track..."
              className="w-full h-40 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-gray-400 text-sm">Include your sport, position, goals, and available equipment</span>
              <button
                onClick={handleGenerate}
                disabled={generateMutation.isPending || !prompt.trim()}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generateMutation.isPending ? "Generating..." : `Generate Plan (${CREDIT_COST} credits)`}
              </button>
            </div>
          </div>

          {result && (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Your Personalized Training Plan</h3>
                <button
                  onClick={() => { navigator.clipboard?.writeText(result); toast.success("Copied to clipboard!"); }}
                  className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                >
                  Copy Plan
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-gray-300 font-sans leading-relaxed">{result}</pre>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
              <span className="text-4xl block mb-3">🎯</span>
              <h3 className="text-white font-semibold mb-2">Personalized</h3>
              <p className="text-gray-400 text-sm">Plans tailored to your sport, position, and goals</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
              <span className="text-4xl block mb-3">📊</span>
              <h3 className="text-white font-semibold mb-2">Data-Driven</h3>
              <p className="text-gray-400 text-sm">Based on proven training methodologies for elite athletes</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
              <span className="text-4xl block mb-3">⚡</span>
              <h3 className="text-white font-semibold mb-2">Instant</h3>
              <p className="text-gray-400 text-sm">Get your complete plan in seconds, ready to execute</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

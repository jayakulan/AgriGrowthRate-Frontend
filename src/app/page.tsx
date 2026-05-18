import Link from 'next/link';
import {
  Sprout, TrendingUp, Globe, MessageCircle, CloudSun, ShieldCheck, Package,
  LayoutGrid, CheckCircle2
} from 'lucide-react';

const features = [
  {
    icon: MessageCircle,
    title: 'AI Chatbot Assistant',
    desc: 'Instant, expert advice on crop management, soil health, and pest control powered by advanced agricultural language models.',
  },
  {
    icon: CloudSun,
    title: 'Weather Advisory',
    desc: 'Micro-climate forecasting to schedule irrigation and harvesting precisely.',
  },
  {
    icon: ShieldCheck,
    title: 'Disease Detection',
    desc: 'Upload photos for instant pathogen identification and treatment protocols.',
  },
  {
    icon: LayoutGrid,
    title: 'Digital Marketplace',
    desc: 'Connect directly with buyers and suppliers, bypassing traditional intermediaries.',
  },
  {
    icon: Package,
    title: 'Product Recommendation',
    desc: 'Data-driven suggestions for fertilizers and seeds based on local soil analysis.',
  },
];

const steps = [
  {
    icon: LayoutGrid,
    num: '1',
    title: 'Register',
    desc: 'Create your profile and input your farm\'s baseline data to calibrate the system.',
  },
  {
    icon: CheckCircle2,
    num: '2',
    title: 'Use AI Tools',
    desc: 'Deploy predictive models for weather, disease, and optimal planting schedules.',
  },
  {
    icon: TrendingUp,
    num: '3',
    title: 'Buy, Sell, Succeed',
    desc: 'Leverage the marketplace to procure inputs and sell yields at premium margins.',
  },
];

export default function HomePage() {
  return (
    <div className="bg-[#f4f5f0] min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <div className="badge mb-5">
          <Sprout className="w-3.5 h-3.5" />
          Sustainable Innovation
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight mb-4 leading-tight">
          AgriGrowthRate
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8">
          Empowering Farmers with Smart Technology and AI
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/register" id="hero-get-started" className="btn-primary px-6 py-2.5 text-sm">
            Get Started
          </Link>
          <Link href="/#features" id="hero-learn-more" className="btn-outline px-6 py-2.5 text-sm">
            Learn More
          </Link>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-10">
          <h2 className="section-title">Precision Farming Tools</h2>
          <p className="section-sub">Leveraging AI to optimize yield and mitigate risks.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="card">
              <div className="icon-box mb-4">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-base">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SPLIT SECTION ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4 leading-snug">
              Catalyzing Agricultural Productivity
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              AgriGrowthRate bridges the gap between traditional farming and modern data science.
              We provide tools that enhance productivity while expanding market access through
              robust technological infrastructure.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-[#2d6a2d]" /> Yield Increase
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                <Globe className="w-3.5 h-3.5 text-[#2d6a2d]" /> Global Reach
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-[#e4e6df] shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&h=450&fit=crop"
                alt="Agricultural drone over crop field"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PROCESS ───────────────────────────────────────── */}
      <section id="process" className="bg-white border-y border-[#e4e6df] py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title mb-1">The Process</h2>
          <p className="section-sub mb-12">Streamlined operations from seed to sale.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.title} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full border-2 border-[#e4e6df] flex items-center justify-center mb-4 bg-[#f4f5f0]">
                  <s.icon className="w-5 h-5 text-[#2d6a2d]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.num}. {s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="bg-[#f4f5f0] border-t border-[#e4e6df] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-[#2d6a2d] text-base mb-1">
                <Sprout className="w-5 h-5" /> AgriGrowthRate
              </div>
              <p className="text-gray-500 text-xs">
                © 2024 AgriGrowthRate AI Platform. Sustainable Innovation for Global Agriculture.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {['Privacy Policy', 'Terms of Service', 'Sustainability', 'Contact', 'Careers'].map((label) => (
                <Link key={label} href="#" className="text-xs text-gray-500 hover:text-gray-800 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

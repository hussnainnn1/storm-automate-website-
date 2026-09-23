import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bot,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Clock3,
  Command,
  Database,
  GitBranch,
  Inbox,
  Layers3,
  LineChart,
  LockKeyhole,
  Menu,
  MessageCircle,
  PanelTop,
  Play,
  Radar,
  RefreshCw,
  Send,
  ShieldCheck,
  Target,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error-boundary';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

const navItems = [
  { label: 'The system', href: '#system' },
  { label: 'Revenue leaks', href: '#leaks' },
  { label: 'Approach', href: '#approach' },
  { label: 'Services', href: '#services' },
  { label: 'FAQ', href: '#faq' },
];

const leakItems = [
  {
    number: '01',
    title: 'The silent inbox',
    body: 'A lead reaches out after hours. By the time the team sees it, the moment has cooled.',
    signal: 'Response window',
    detail: 'A system that acknowledges intent immediately, routes the conversation, and keeps the context intact.',
    icon: Inbox,
  },
  {
    number: '02',
    title: 'The qualification gap',
    body: 'Every inquiry gets treated the same, so high-intent opportunities wait behind low-fit questions.',
    signal: 'Lead clarity',
    detail: 'Qualification logic that feels human while collecting the signals your team needs to prioritize.',
    icon: Target,
  },
  {
    number: '03',
    title: 'The booking cliff',
    body: 'A prospect says yes, then hits a scheduling maze, a broken handoff, or an empty calendar.',
    signal: 'Booking path',
    detail: 'A clean path from qualified interest to the right calendar, with fallbacks for every edge case.',
    icon: CalendarDays,
  },
  {
    number: '04',
    title: 'The follow-up fade',
    body: 'A maybe becomes a no because nobody owns the next touch when the first attempt misses.',
    signal: 'Next action',
    detail: 'Thoughtful follow-up sequences that respect the customer and make the next best action obvious.',
    icon: RefreshCw,
  },
];

const capabilities = [
  { icon: MessageCircle, title: 'Conversational intake', body: 'Web, SMS, and form experiences that turn questions into useful context.' },
  { icon: GitBranch, title: 'Lead routing', body: 'Route by intent, service, location, urgency, or the rules your team already uses.' },
  { icon: CalendarDays, title: 'Booking systems', body: 'Connect qualified demand to the right calendar without creating more admin work.' },
  { icon: Database, title: 'CRM orchestration', body: 'Keep records, handoffs, tags, and tasks moving in the background.' },
  { icon: Send, title: 'Follow-up logic', body: 'Build the right next step for a no-show, a maybe, or an unfinished conversation.' },
  { icon: LineChart, title: 'Signal reporting', body: 'See where the system is working, where it hesitates, and what deserves attention.' },
];

const faqs = [
  {
    question: 'Is Storm Automate a chatbot vendor?',
    answer: 'No. A chatbot can be one interface inside a larger system. Storm Automate maps the moments around your leads — response, qualification, booking, follow-up, and handoff — then builds the automation that connects them.',
  },
  {
    question: 'Do we need to replace our CRM or booking software?',
    answer: 'Usually not. The goal is to make the systems you already rely on behave like one connected workflow. We start by understanding the current stack and only recommend changes when the existing setup creates a material constraint.',
  },
  {
    question: 'Will this make our customer experience feel robotic?',
    answer: 'The opposite is the point. Good automation removes the repetitive work that makes conversations feel delayed or fragmented. We use clear boundaries, useful context, and human handoffs so automation knows when to step in — and when to step aside.',
  },
  {
    question: 'How long does an engagement take?',
    answer: 'The answer depends on the shape of the system and the number of tools involved. The first step is a focused strategy call to map the revenue path, identify the highest-value gap, and define a sensible first build.',
  },
  {
    question: 'Do you only work with med spas?',
    answer: 'Med spas are a primary focus because appointment-based businesses share a very specific set of revenue leaks. The same systems thinking can support other established, appointment-led businesses with a high value per booked conversation.',
  },
];

function scrollToId(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function useScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('sa-motion-ready');
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return () => root.classList.remove('sa-motion-ready');
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    elements.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      root.classList.remove('sa-motion-ready');
    };
  }, []);
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#top" className="sa-focus flex items-center gap-3" data-testid="link-logo">
      <img
        src="/storm-logo-wordmark.png"
        alt="Storm Automate"
        className={`${compact ? 'h-9 w-[126px]' : 'h-10 w-[144px]'} object-contain`}
      />
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 border-b border-white/[.07] bg-[#0b0e17]/85 backdrop-blur-xl" data-testid="header-navigation">
      <div className="sa-container flex h-[72px] items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="sa-focus text-[.77rem] text-slate-400 transition-colors hover:text-slate-100" data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-5 lg:flex">
          <a href="#assessment" className="sa-focus font-mono text-[.65rem] uppercase tracking-[.13em] text-slate-400 hover:text-lime-200" data-testid="link-nav-assessment">Free assessment</a>
          <a href="#contact" className="sa-button-primary min-h-[38px] px-4 text-[.72rem]" data-testid="link-nav-cta">Book a Strategy Call <ArrowUpRight size={14} /></a>
        </div>
        <button type="button" className="sa-focus rounded-md border border-white/10 p-2 text-slate-200 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} data-testid="button-mobile-menu">
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/[.07] bg-[#0b0e17] lg:hidden">
          <nav className="sa-container flex flex-col gap-1 py-4" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="sa-focus rounded-md px-3 py-3 text-sm text-slate-300 hover:bg-white/[.05]" data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
                {item.label}
              </a>
            ))}
            <a href="#assessment" onClick={() => setOpen(false)} className="mt-2 flex items-center justify-between border-t border-white/[.08] px-3 pt-4 font-mono text-[.68rem] uppercase tracking-[.12em] text-lime-200" data-testid="link-mobile-assessment">
              Find your revenue leaks <ArrowRight size={15} />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function SystemVisual() {
  const steps = [
    { icon: MessageCircle, label: 'Lead', pos: 'left-[4%] top-[9%]' },
    { icon: Bot, label: 'Response', pos: 'left-[39%] top-[1%]' },
    { icon: Target, label: 'Qualify', pos: 'right-[3%] top-[14%]' },
    { icon: CalendarDays, label: 'Book', pos: 'left-[18%] top-[51%]' },
    { icon: RefreshCw, label: 'Follow up', pos: 'right-[17%] top-[53%]' },
    { icon: CircleCheck, label: 'Revenue', pos: 'left-[39%] bottom-[2%]' },
  ];
  return (
    <div className="relative mx-auto h-[430px] w-full max-w-[540px] lg:h-[510px]" data-testid="visual-system-map">
      <div className="sa-dot-grid absolute inset-[9%] rounded-full opacity-25" />
      <div className="sa-system-orbit absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/15 bg-cyan-300/[.025] shadow-[0_0_90px_rgba(96,219,241,0.08)]" />
      <div className="sa-system-core absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-lime-200/20 bg-[#111c1a] shadow-[0_0_45px_rgba(182,255,70,0.12)]">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <Zap size={22} className="mb-2 text-lime-200" />
          <span className="font-mono text-[.58rem] uppercase tracking-[.18em] text-lime-200">Storm</span>
          <span className="mt-1 text-[.7rem] text-slate-400">control layer</span>
        </div>
      </div>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 540 510" fill="none" aria-hidden="true">
        <path d="M92 82C165 70 176 120 226 160" stroke="rgba(209,180,140,.58)" strokeWidth="1.3" />
        <path d="M247 58C251 111 260 124 270 166" stroke="rgba(126,164,200,.7)" strokeWidth="1.3" className="sa-signal" />
        <path d="M442 102C388 106 359 132 315 174" stroke="rgba(209,180,140,.58)" strokeWidth="1.3" />
        <path d="M145 306C185 292 194 282 218 274" stroke="rgba(126,164,200,.62)" strokeWidth="1.3" className="sa-signal" />
        <path d="M397 320C362 304 342 287 315 278" stroke="rgba(209,180,140,.62)" strokeWidth="1.3" />
        <path d="M253 375C253 342 260 329 270 314" stroke="rgba(126,164,200,.68)" strokeWidth="1.3" className="sa-signal" />
        <circle cx="180" cy="117" r="2.4" fill="#d1b48c" className="sa-live-dot" />
        <circle cx="360" cy="126" r="2.4" fill="#7ea4c8" className="sa-live-dot" />
        <circle cx="195" cy="293" r="2.4" fill="#7ea4c8" className="sa-live-dot" />
      </svg>
      {steps.map(({ icon: Icon, label, pos }, index) => (
        <div key={label} className={`sa-float absolute ${pos} z-10`} style={{ animationDelay: `${index * 180}ms` }}>
          <div className="sa-node-card flex items-center gap-2 rounded-xl border border-white/10 bg-[#111722]/90 px-3 py-2 shadow-xl backdrop-blur-md">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[.06] text-cyan-200"><Icon size={14} /></span>
            <span className="font-mono text-[.61rem] uppercase tracking-[.12em] text-slate-300">{label}</span>
          </div>
        </div>
      ))}
      <div className="absolute bottom-[15%] left-[5%] flex items-center gap-2 font-mono text-[.58rem] uppercase tracking-[.12em] text-slate-600">
        <span className="h-1.5 w-1.5 rounded-full bg-lime-300" /> signal connected
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-white/[.07]">
      <div className="absolute -right-48 -top-40 h-[32rem] w-[32rem] rounded-full bg-cyan-300/[.07] blur-3xl" />
      <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-lime-300/[.045] blur-3xl" />
      <div className="sa-container relative grid min-h-[calc(100dvh-72px)] items-center gap-12 py-20 lg:grid-cols-[1.02fr_.98fr] lg:gap-6 lg:py-24">
        <div className="sa-reveal max-w-3xl">
          <div className="mb-7 flex items-center gap-3">
            <span className="h-px w-8 bg-lime-300" />
            <span className="sa-eyebrow">Revenue systems partner / 01</span>
          </div>
          <h1 className="sa-display max-w-[780px] text-slate-100">
            Plug the gaps that are <span className="text-lime-200">leaking</span> your revenue.
          </h1>
          <p className="mt-8 max-w-xl text-[1.02rem] leading-8 text-slate-400 md:text-[1.12rem]">
            Storm Automate builds AI-powered automation systems that capture, qualify, book, and follow up with your leads — so fewer opportunities fall through the cracks.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#contact" className="sa-button-primary sa-focus" data-testid="link-hero-cta">Book a Strategy Call <ArrowUpRight size={16} /></a>
            <a href="#assessment" className="sa-button-secondary sa-focus" data-testid="link-hero-assessment">Find Your Revenue Leaks <ArrowDownRight size={16} /></a>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/[.09] pt-5 text-[.71rem] text-slate-500">
            <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-lime-200" /> Built for established operators</span>
            <span className="flex items-center gap-2"><LockKeyhole size={14} className="text-cyan-200" /> No replacement stack required</span>
          </div>
        </div>
        <div className="sa-reveal [animation-delay:180ms]">
          <SystemVisual />
        </div>
      </div>
      <div className="sa-container flex items-center justify-between border-t border-white/[.07] py-4 font-mono text-[.59rem] uppercase tracking-[.16em] text-slate-600">
        <span>Systems that keep moving</span>
        <span className="hidden items-center gap-2 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-lime-300" /> monitoring the handoff</span>
      </div>
    </section>
  );
}

function SystemSection() {
  return (
    <section id="system" className="sa-section" data-reveal>
      <div className="sa-container">
        <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
          <div>
            <span className="sa-eyebrow">The revenue path / 02</span>
            <h2 className="sa-h2 mt-5 max-w-xl text-slate-100">Revenue is a chain. One loose link changes the outcome.</h2>
          </div>
          <p className="max-w-lg pb-1 text-base leading-7 text-slate-400 lg:justify-self-end">
            Most businesses do not have a lead problem. They have a handoff problem. We connect the moments between first contact and booked revenue into one visible system.
          </p>
        </div>
        <div className="mt-16 overflow-hidden rounded-2xl border border-white/[.1] bg-[#0d121c] shadow-[0_24px_80px_rgba(0,0,0,.2)]">
          <div className="flex items-center justify-between border-b border-white/[.08] px-5 py-4">
            <div className="flex items-center gap-2 font-mono text-[.62rem] uppercase tracking-[.16em] text-slate-500"><Workflow size={14} className="text-cyan-200" /> Lead-to-revenue map</div>
            <div className="flex items-center gap-2 font-mono text-[.58rem] uppercase tracking-[.12em] text-lime-200"><span className="h-1.5 w-1.5 rounded-full bg-lime-300" /> live architecture</div>
          </div>
          <div className="grid divide-y divide-white/[.08] md:grid-cols-6 md:divide-x md:divide-y-0">
            {[
              ['01', 'Capture', 'The signal arrives', MessageCircle],
              ['02', 'Respond', 'Context, not a canned reply', Bot],
              ['03', 'Qualify', 'Intent becomes clear', Target],
              ['04', 'Book', 'The next step is easy', CalendarDays],
              ['05', 'Follow up', 'The thread stays warm', RefreshCw],
              ['06', 'Revenue', 'A better handoff lands', CircleCheck],
            ].map(([num, label, description, Icon], index) => {
              const StepIcon = Icon as typeof MessageCircle;
              return (
                <div key={label as string} className="group relative min-h-[205px] p-5 transition-colors hover:bg-white/[.035]" data-testid={`card-system-step-${index + 1}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[.61rem] text-slate-600">{num as string}</span>
                    <StepIcon size={17} className={index === 5 ? 'text-lime-200' : 'text-cyan-200/75'} />
                  </div>
                  <div className="mt-16">
                    <h3 className="text-[.94rem] font-semibold text-slate-100">{label as string}</h3>
                    <p className="mt-2 text-[.72rem] leading-5 text-slate-500">{description as string}</p>
                  </div>
                  {index < 5 && <ChevronRight size={14} className="absolute bottom-5 right-4 text-slate-700 md:block hidden" />}
                  <div className={`absolute bottom-0 left-0 h-[2px] transition-all duration-500 group-hover:w-full ${index === 5 ? 'w-2/3 bg-lime-300' : 'w-1/4 bg-cyan-300/70'}`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function LeaksSection() {
  const [active, setActive] = useState(0);
  const leak = leakItems[active];
  const Icon = leak.icon;
  return (
    <section id="leaks" className="sa-section border-y border-white/[.07] bg-[#0a0d15]" data-reveal>
      <div className="sa-container grid gap-14 lg:grid-cols-[.82fr_1.18fr]">
        <div>
          <span className="sa-eyebrow">The leak report / 03</span>
          <h2 className="sa-h2 mt-5 text-slate-100">Small gaps. Expensive silence.</h2>
          <p className="mt-6 max-w-md leading-7 text-slate-400">The most costly moments are often invisible in a dashboard. Explore the four handoffs where a good lead can quietly disappear.</p>
          <div className="mt-9 space-y-2">
            {leakItems.map((item, index) => {
              const ItemIcon = item.icon;
              return (
                <button type="button" key={item.number} onClick={() => setActive(index)} className={`sa-focus flex w-full items-center gap-4 rounded-lg border px-4 py-4 text-left transition-all ${active === index ? 'border-lime-200/40 bg-lime-200/[.06]' : 'border-transparent hover:border-white/[.1] hover:bg-white/[.03]'}`} aria-pressed={active === index} data-testid={`button-leak-${index + 1}`}>
                  <span className={`font-mono text-[.67rem] ${active === index ? 'text-lime-200' : 'text-slate-600'}`}>{item.number}</span>
                  <ItemIcon size={16} className={active === index ? 'text-lime-200' : 'text-slate-500'} />
                  <span className={`flex-1 text-sm ${active === index ? 'text-slate-100' : 'text-slate-400'}`}>{item.title}</span>
                  <ChevronRight size={15} className={active === index ? 'text-lime-200' : 'text-slate-600'} />
                </button>
              );
            })}
          </div>
        </div>
        <div key={leak.number} className="sa-leak-panel relative min-h-[420px] overflow-hidden rounded-2xl border border-white/[.1] bg-[#111722] p-7 md:p-10">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan-300/[.05] blur-3xl" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-lime-200/20 bg-lime-200/[.08] text-lime-200"><Icon size={21} /></div>
              <span className="sa-mono text-[.61rem] text-slate-600">signal / {leak.number}</span>
            </div>
            <div className="my-14">
              <div className="font-mono text-[.65rem] uppercase tracking-[.16em] text-cyan-200">{leak.signal}</div>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-.04em] text-slate-100 md:text-4xl">{leak.title}</h3>
              <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">{leak.body}</p>
            </div>
            <div className="border-t border-white/[.09] pt-5">
              <p className="text-sm leading-6 text-slate-400"><span className="font-semibold text-slate-200">What a connected system changes:</span> {leak.detail}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ApproachSection() {
  return (
    <section id="approach" className="sa-section" data-reveal>
      <div className="sa-container">
        <div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr]">
          <div>
            <span className="sa-eyebrow">The operating model / 04</span>
            <h2 className="sa-h2 mt-5 max-w-2xl text-slate-100">Less “AI project.” More operating system.</h2>
          </div>
          <div className="space-y-7 lg:pt-8">
            <p className="max-w-xl text-lg leading-8 text-slate-300">We do not drop a tool into your business and call it transformation. We find the break in the journey, design the logic around it, then make the system legible to the people who run it.</p>
            <a href="#contact" className="sa-focus inline-flex items-center gap-2 font-mono text-[.68rem] uppercase tracking-[.14em] text-lime-200 hover:text-lime-100" data-testid="link-approach-cta">Talk through your workflow <ArrowRight size={15} /></a>
          </div>
        </div>
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/[.09] bg-white/[.09] md:grid-cols-3">
          {[
            { n: '01', title: 'Map the reality', body: 'We trace the actual customer journey, including the workarounds your team has stopped noticing.', icon: Radar },
            { n: '02', title: 'Build the connective tissue', body: 'We turn decisions into dependable triggers, guardrails, handoffs, and next actions.', icon: Layers3 },
            { n: '03', title: 'Make it accountable', body: 'We leave your team with a clear system, clear ownership, and signals worth checking.', icon: Command },
          ].map(({ n, title, body, icon: Icon }) => (
            <article key={n} className="bg-[#10151f] p-7 md:min-h-[290px] md:p-9" data-testid={`card-approach-${n}`}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[.64rem] text-lime-200">{n}</span>
                <Icon size={20} className="text-cyan-200" />
              </div>
              <h3 className="mt-16 text-xl font-semibold tracking-[-.03em] text-slate-100">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-slate-500">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="sa-section border-y border-white/[.07] bg-[#0a0d15]" data-reveal>
      <div className="sa-container">
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <span className="sa-eyebrow">Capability stack / 05</span>
            <h2 className="sa-h2 mt-5 max-w-2xl text-slate-100">The pieces that keep the promise.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-500">A practical layer across your existing tools — designed around the revenue path, not around a vendor’s feature list.</p>
        </div>
        <div className="mt-14 grid gap-x-10 gap-y-0 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, body }, index) => (
            <article key={title} className="group border-t border-white/[.1] py-7" data-testid={`card-capability-${index + 1}`}>
              <div className="flex items-start justify-between">
                <Icon size={20} className="text-cyan-200 transition-colors group-hover:text-lime-200" />
                <span className="font-mono text-[.6rem] text-slate-700">0{index + 1}</span>
              </div>
              <h3 className="mt-10 text-lg font-semibold text-slate-100">{title}</h3>
              <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FitSection() {
  return (
    <section id="fit" className="sa-section" data-reveal>
      <div className="sa-container grid gap-14 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
        <div>
          <span className="sa-eyebrow">A focus, not a box / 06</span>
          <h2 className="sa-h2 mt-5 max-w-2xl text-slate-100">Built with med spas in mind. Useful beyond them.</h2>
          <p className="mt-7 max-w-xl text-base leading-8 text-slate-400">Independent med spas understand the cost of a missed conversation. High-value treatments, limited calendars, and personal trust make every handoff matter. We bring that same care to the systems behind the front desk.</p>
          <div className="mt-9 grid max-w-xl grid-cols-2 gap-x-8 gap-y-5 border-t border-white/[.09] pt-6">
            {['High-consideration services', 'Consultation-led journeys', 'Lean, busy teams', 'Existing tools worth keeping'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-300"><Check size={15} className="text-lime-200" /> {item}</div>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-cyan-200/15 bg-[#101820] p-7 md:p-9">
          <div className="absolute right-0 top-0 h-48 w-48 bg-cyan-300/[.06] blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between border-b border-white/[.09] pb-5">
              <span className="font-mono text-[.62rem] uppercase tracking-[.14em] text-slate-500">Example context / med spa</span>
              <PanelTop size={16} className="text-cyan-200" />
            </div>
            <div className="mt-8 space-y-5">
              {[
                ['09:42', 'New consultation inquiry', 'intent detected'],
                ['09:43', 'Treatment + timing captured', 'context complete'],
                ['09:45', 'Consultation path offered', 'calendar ready'],
                ['09:47', 'Reminder thread queued', 'handoff clear'],
              ].map(([time, label, status], index) => (
                <div key={label} className="flex gap-4" data-testid={`row-context-${index + 1}`}>
                  <span className="pt-1 font-mono text-[.6rem] text-slate-600">{time}</span>
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full border border-cyan-200/50 bg-cyan-200/30" />
                  <div className="flex-1 border-b border-white/[.07] pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm text-slate-200">{label}</span>
                      <span className="font-mono text-[.57rem] uppercase tracking-[.1em] text-lime-200">{status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs leading-5 text-slate-500">Illustrative workflow only. No client results or performance claims are implied.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section className="sa-section border-y border-white/[.07] bg-[#0a0d15]" data-reveal>
      <div className="sa-container">
        <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <span className="sa-eyebrow">Why Storm / 07</span>
            <h2 className="sa-h2 mt-5 text-slate-100">Calm systems for high-stakes moments.</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {[
              ['Clarity over spectacle', 'No AI theater. You get a map of what happens, why it happens, and who owns the next move.'],
              ['Designed for the messy middle', 'Real operations are full of exceptions. We build for the handoffs, not just the happy path.'],
              ['Technology with taste', 'The best automation is felt as ease, not exposed as machinery. Every interaction earns its place.'],
              ['A partner, not a platform', 'Your business stays in the driver’s seat. We bring the systems thinking and the build discipline.'],
            ].map(([title, body], index) => (
              <article key={title} className="border-t border-white/[.1] pt-5" data-testid={`card-why-${index + 1}`}>
                <span className="font-mono text-[.6rem] text-lime-200">0{index + 1}</span>
                <h3 className="mt-8 text-lg font-semibold text-slate-100">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{body}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-20 rounded-2xl border border-dashed border-white/15 bg-white/[.018] p-7 md:p-10" data-testid="card-case-study-placeholder">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div>
              <span className="sa-eyebrow text-cyan-200">Field note / coming soon</span>
              <h3 className="mt-5 max-w-xl text-2xl font-semibold tracking-[-.04em] text-slate-100">An honest case study is better than a borrowed one.</h3>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">We are building a library of documented system transformations. Until those stories are ready to share, we will not invent logos, metrics, or outcomes.</p>
            </div>
            <div className="flex items-center gap-2 font-mono text-[.63rem] uppercase tracking-[.12em] text-slate-600"><Clock3 size={15} /> proof, when earned</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineSection() {
  const steps = [
    ['01', 'Strategy call', 'A focused conversation about your business, current stack, and the moment where momentum breaks.'],
    ['02', 'Leak map', 'We document the revenue path and prioritize the gap with the clearest business case.'],
    ['03', 'System design', 'You get a practical architecture: triggers, logic, tools, guardrails, and ownership.'],
    ['04', 'Build + handoff', 'We implement the workflow, test the edges, and make it understandable to your team.'],
  ];
  return (
    <section className="sa-section" data-reveal>
      <div className="sa-container">
        <div className="max-w-2xl">
          <span className="sa-eyebrow">How it works / 08</span>
          <h2 className="sa-h2 mt-5 text-slate-100">From “something feels off” to a system you can see.</h2>
        </div>
        <div className="relative mt-16">
          <div className="sa-timeline-line absolute left-[20px] top-4 hidden h-[calc(100%-32px)] w-px bg-gradient-to-b from-lime-200/60 via-cyan-200/35 to-transparent md:block" />
          <div className="space-y-10">
            {steps.map(([number, title, body]) => (
              <article key={number} className="relative grid gap-5 md:grid-cols-[42px_200px_1fr] md:items-start" data-testid={`timeline-step-${number}`}>
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-lime-200/30 bg-[#10151f] font-mono text-[.62rem] text-lime-200">{number}</div>
                <h3 className="pt-2 text-lg font-semibold text-slate-100">{title}</h3>
                <p className="max-w-xl pt-2 text-sm leading-6 text-slate-500">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Assessment() {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const concerns = [
    'Leads wait too long for a first response',
    'The team cannot see which leads are serious',
    'Booking requires too much back-and-forth',
    'Follow-up depends on someone remembering',
    'Our tools do not share enough context',
  ];
  const toggle = (concern: string) => setSelected((items) => items.includes(concern) ? items.filter((item) => item !== concern) : [...items, concern]);
  return (
    <section id="assessment" className="sa-section border-y border-white/[.07] bg-[#0a0d15]" data-reveal>
      <div className="sa-container grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
        <div className="lg:sticky lg:top-32">
          <span className="sa-eyebrow">The leak assessment / 09</span>
          <h2 className="sa-h2 mt-5 text-slate-100">Find the friction before it finds your next customer.</h2>
          <p className="mt-6 max-w-md leading-7 text-slate-400">Tell us what feels familiar. This quick diagnostic stays in your browser for now — no data is sent, saved, or added to a list.</p>
          <div className="mt-8 flex items-center gap-3 font-mono text-[.62rem] uppercase tracking-[.12em] text-slate-600"><LockKeyhole size={14} className="text-cyan-200" /> private by design</div>
        </div>
        <div className="rounded-2xl border border-white/[.1] bg-[#111722] p-6 md:p-9">
          {submitted ? (
            <div className="flex min-h-[420px] flex-col items-start justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-200 text-slate-950"><Check size={24} /></div>
              <span className="sa-eyebrow mt-7">Assessment captured locally</span>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-.05em] text-slate-100">You have a place to start.</h3>
              <p className="mt-4 max-w-md leading-7 text-slate-400">Based on your selections, the next useful conversation is the handoff between first response and booking. Bring this list to a strategy call and we can turn it into a clear first build.</p>
              <button type="button" onClick={() => setSubmitted(false)} className="sa-button-secondary sa-focus mt-8" data-testid="button-retake-assessment">Run it again <RefreshCw size={15} /></button>
            </div>
          ) : (
            <form onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); }} data-testid="form-leak-assessment">
              <div className="flex items-center justify-between border-b border-white/[.09] pb-5">
                <span className="font-mono text-[.65rem] uppercase tracking-[.14em] text-slate-300">Which signals are familiar?</span>
                <span className="font-mono text-[.62rem] text-slate-600">{selected.length}/5 selected</span>
              </div>
              <div className="mt-7 space-y-3">
                {concerns.map((concern, index) => {
                  const isSelected = selected.includes(concern);
                  return (
                    <button type="button" key={concern} onClick={() => toggle(concern)} className={`sa-focus flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors ${isSelected ? 'border-lime-200/40 bg-lime-200/[.07]' : 'border-white/[.08] hover:border-white/20'}`} aria-pressed={isSelected} data-testid={`button-assessment-concern-${index + 1}`}>
                      <span className={`flex h-5 w-5 items-center justify-center rounded border ${isSelected ? 'border-lime-200 bg-lime-200 text-slate-950' : 'border-slate-600 text-transparent'}`}><Check size={13} /></span>
                      <span className={`text-sm ${isSelected ? 'text-slate-100' : 'text-slate-400'}`}>{concern}</span>
                    </button>
                  );
                })}
              </div>
              <button type="submit" disabled={selected.length === 0} className="sa-button-primary sa-focus mt-7 w-full disabled:cursor-not-allowed disabled:opacity-40" data-testid="button-submit-assessment">Show my starting point <ArrowRight size={16} /></button>
              <p className="mt-4 text-center font-mono text-[.58rem] uppercase tracking-[.12em] text-slate-600">Client-side diagnostic / no submission endpoint connected</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="sa-section" data-reveal>
      <div className="sa-container grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          <span className="sa-eyebrow">Clear answers / 10</span>
          <h2 className="sa-h2 mt-5 text-slate-100">No fog machine required.</h2>
          <p className="mt-6 max-w-sm leading-7 text-slate-500">A few honest answers before we put anything on a calendar.</p>
        </div>
        <div className="border-t border-white/[.1]">
          {faqs.map((faq, index) => (
            <div key={faq.question} className="border-b border-white/[.1]" data-testid={`faq-item-${index + 1}`}>
              <button type="button" onClick={() => setOpen(open === index ? null : index)} className="sa-focus flex w-full items-center justify-between gap-5 py-6 text-left" aria-expanded={open === index} data-testid={`button-faq-${index + 1}`}>
                <span className="text-base font-medium text-slate-200">{faq.question}</span>
                <ChevronDown size={17} className={`shrink-0 text-lime-200 transition-transform ${open === index ? 'rotate-180' : ''}`} />
              </button>
              {open === index && <p className="sa-faq-answer max-w-2xl pb-6 pr-10 text-sm leading-7 text-slate-500">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    website: '',
    email: '',
    phone: '',
    employees: '',
    revenue: '',
    businessType: '',
    crm: '',
    challenge: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const updateField = (field: keyof typeof fields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!fields.firstName.trim()) nextErrors.firstName = 'First name is required.';
    if (!fields.lastName.trim()) nextErrors.lastName = 'Last name is required.';
    if (!fields.businessName.trim()) nextErrors.businessName = 'Business name is required.';
    if (!fields.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };
  const inputClass = (field: string) => `sa-focus w-full rounded-lg border bg-white/[.035] px-4 py-3 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-700 focus:border-lime-200/60 ${errors[field] ? 'border-red-300/60' : 'border-white/[.12]'}`;
  const errorMessage = (field: string) => errors[field] ? <p id={`error-${field}`} className="mt-2 text-xs text-red-200" role="alert">{errors[field]}</p> : null;
  return (
    <section id="contact" className="relative overflow-hidden border-t border-white/[.07] bg-[#0b1118] py-24 md:py-32" data-reveal>
      <div className="absolute right-[-10rem] top-[-15rem] h-[38rem] w-[38rem] rounded-full bg-lime-300/[.06] blur-3xl" />
      <div className="sa-container relative grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
        <div>
          <span className="sa-eyebrow">Start with the gap / 11</span>
          <h2 className="sa-h2 mt-5 max-w-xl text-slate-100">Your next best system may start with one honest conversation.</h2>
          <p className="mt-7 max-w-md text-base leading-8 text-slate-400">Share a little context and we will have a smarter place to start. This form is a design preview for now — it does not send or store your information.</p>
          <div className="mt-10 flex items-center gap-3 text-sm text-slate-500"><Play size={15} className="text-lime-200" /> 30-minute strategy call</div>
        </div>
        <div className="rounded-2xl border border-white/[.1] bg-[#101720]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,.22)] md:p-9">
          {submitted ? (
            <div className="flex min-h-[420px] flex-col justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-200 text-slate-950"><CircleCheck size={23} /></div>
              <span className="sa-eyebrow mt-7">Ready for the next step</span>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-.05em] text-slate-100">Thanks, {fields.firstName}.</h3>
              <p className="mt-4 max-w-md leading-7 text-slate-400">Your assessment is complete in this browser. Nothing was sent or stored. When contact details are connected, this is where a real scheduling handoff will begin.</p>
              <button type="button" onClick={() => setSubmitted(false)} className="sa-button-secondary sa-focus mt-8 w-fit" data-testid="button-edit-contact">Edit assessment <ArrowRight size={15} /></button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5" noValidate data-testid="form-strategy-call">
              <div className="border-b border-white/[.09] pb-5">
                <span className="font-mono text-[.65rem] uppercase tracking-[.14em] text-slate-300">Lead qualification details</span>
                <p className="mt-2 text-xs leading-5 text-slate-500">The four identity fields marked required help frame a useful first conversation. Everything else is optional.</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block"><span className="mb-2 block font-mono text-[.62rem] uppercase tracking-[.12em] text-slate-500">First name <span className="text-lime-200">*</span></span><input required value={fields.firstName} onChange={(event) => updateField('firstName', event.target.value)} className={inputClass('firstName')} aria-invalid={Boolean(errors.firstName)} aria-describedby={errors.firstName ? 'error-firstName' : undefined} placeholder="First name" data-testid="input-contact-first-name" />{errorMessage('firstName')}</label>
                <label className="block"><span className="mb-2 block font-mono text-[.62rem] uppercase tracking-[.12em] text-slate-500">Last name <span className="text-lime-200">*</span></span><input required value={fields.lastName} onChange={(event) => updateField('lastName', event.target.value)} className={inputClass('lastName')} aria-invalid={Boolean(errors.lastName)} aria-describedby={errors.lastName ? 'error-lastName' : undefined} placeholder="Last name" data-testid="input-contact-last-name" />{errorMessage('lastName')}</label>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block"><span className="mb-2 block font-mono text-[.62rem] uppercase tracking-[.12em] text-slate-500">Business name <span className="text-lime-200">*</span></span><input required value={fields.businessName} onChange={(event) => updateField('businessName', event.target.value)} className={inputClass('businessName')} aria-invalid={Boolean(errors.businessName)} aria-describedby={errors.businessName ? 'error-businessName' : undefined} placeholder="Business name" data-testid="input-contact-business-name" />{errorMessage('businessName')}</label>
                <label className="block"><span className="mb-2 block font-mono text-[.62rem] uppercase tracking-[.12em] text-slate-500">Business website</span><input type="url" value={fields.website} onChange={(event) => updateField('website', event.target.value)} className={inputClass('website')} placeholder="https://yourbusiness.com" data-testid="input-contact-website" /></label>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block"><span className="mb-2 block font-mono text-[.62rem] uppercase tracking-[.12em] text-slate-500">Work email <span className="text-lime-200">*</span></span><input required type="email" value={fields.email} onChange={(event) => updateField('email', event.target.value)} className={inputClass('email')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'error-email' : undefined} placeholder="you@business.com" data-testid="input-contact-email" />{errorMessage('email')}</label>
                <label className="block"><span className="mb-2 block font-mono text-[.62rem] uppercase tracking-[.12em] text-slate-500">Phone</span><input type="tel" value={fields.phone} onChange={(event) => updateField('phone', event.target.value)} className={inputClass('phone')} placeholder="(555) 555-0123" data-testid="input-contact-phone" /></label>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block"><span className="mb-2 block font-mono text-[.62rem] uppercase tracking-[.12em] text-slate-500">Number of employees</span><select value={fields.employees} onChange={(event) => updateField('employees', event.target.value)} className={`${inputClass('employees')} appearance-none`} data-testid="select-contact-employees"><option value="" className="bg-[#101720]">Select a range</option><option value="1-5" className="bg-[#101720]">1–5</option><option value="6-15" className="bg-[#101720]">6–15</option><option value="16-50" className="bg-[#101720]">16–50</option><option value="51-100" className="bg-[#101720]">51–100</option><option value="101+" className="bg-[#101720]">101+</option></select></label>
                <label className="block"><span className="mb-2 block font-mono text-[.62rem] uppercase tracking-[.12em] text-slate-500">Approximate annual revenue</span><select value={fields.revenue} onChange={(event) => updateField('revenue', event.target.value)} className={`${inputClass('revenue')} appearance-none`} data-testid="select-contact-revenue"><option value="" className="bg-[#101720]">Select a range</option><option value="under-250k" className="bg-[#101720]">Under $250k</option><option value="250k-1m" className="bg-[#101720]">$250k–$1M</option><option value="1m-5m" className="bg-[#101720]">$1M–$5M</option><option value="5m-10m" className="bg-[#101720]">$5M–$10M</option><option value="10m-plus" className="bg-[#101720]">$10M+</option></select></label>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block"><span className="mb-2 block font-mono text-[.62rem] uppercase tracking-[.12em] text-slate-500">Business type</span><select value={fields.businessType} onChange={(event) => updateField('businessType', event.target.value)} className={`${inputClass('businessType')} appearance-none`} data-testid="select-contact-business-type"><option value="" className="bg-[#101720]">Select a business type</option><option value="med-spa" className="bg-[#101720]">Med spa</option><option value="health-wellness" className="bg-[#101720]">Health & wellness</option><option value="professional-services" className="bg-[#101720]">Professional services</option><option value="home-services" className="bg-[#101720]">Home services</option><option value="other" className="bg-[#101720]">Other appointment-based business</option></select></label>
                <label className="block"><span className="mb-2 block font-mono text-[.62rem] uppercase tracking-[.12em] text-slate-500">Current CRM</span><select value={fields.crm} onChange={(event) => updateField('crm', event.target.value)} className={`${inputClass('crm')} appearance-none`} data-testid="select-contact-crm"><option value="" className="bg-[#101720]">Select your CRM</option><option value="hubspot" className="bg-[#101720]">HubSpot</option><option value="salesforce" className="bg-[#101720]">Salesforce</option><option value="go-high-level" className="bg-[#101720]">GoHighLevel</option><option value="other" className="bg-[#101720]">Another CRM</option><option value="none" className="bg-[#101720]">No CRM yet</option></select></label>
              </div>
              <label className="block"><span className="mb-2 block font-mono text-[.62rem] uppercase tracking-[.12em] text-slate-500">Biggest operational challenge</span><textarea value={fields.challenge} onChange={(event) => updateField('challenge', event.target.value)} rows={4} className={`${inputClass('challenge')} resize-none leading-6`} placeholder="Tell us what happens between a new inquiry and a booked appointment." data-testid="textarea-contact-challenge" /></label>
              {Object.keys(errors).length > 0 && <p className="rounded-lg border border-red-300/20 bg-red-300/[.06] px-4 py-3 text-sm leading-5 text-red-200" role="alert" data-testid="status-contact-error">Please review the highlighted required fields before continuing.</p>}
              <button type="submit" className="sa-button-primary sa-focus w-full" data-testid="button-submit-contact">Request a strategy call <ArrowUpRight size={16} /></button>
              <p className="text-center font-mono text-[.58rem] uppercase tracking-[.1em] text-slate-600">No email or calendar connection is active yet.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[.07] bg-[#080b12]">
      <div className="sa-container py-12">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-600">AI-powered automation systems for businesses that cannot afford to lose the thread.</p>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm text-slate-500">
            <a href="#system" className="sa-focus hover:text-slate-200" data-testid="link-footer-system">The system</a>
            <a href="#services" className="sa-focus hover:text-slate-200" data-testid="link-footer-services">Services</a>
            <a href="#assessment" className="sa-focus hover:text-slate-200" data-testid="link-footer-assessment">Assessment</a>
            <a href="#faq" className="sa-focus hover:text-slate-200" data-testid="link-footer-faq">FAQ</a>
            <a href="#contact" className="sa-focus hover:text-slate-200" data-testid="link-footer-contact">Strategy call</a>
            <span className="text-slate-700" data-testid="text-footer-contact-placeholder">Contact details coming soon</span>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/[.07] pt-5 font-mono text-[.58rem] uppercase tracking-[.12em] text-slate-700 sm:flex-row">
          <span>© {new Date().getFullYear()} Storm Automate</span>
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-lime-300" /> built for the handoff</span>
        </div>
      </div>
    </footer>
  );
}

function Home() {
  useScrollReveal();
  return (
    <div className="sa-page sa-noise min-h-[100dvh]">
      <Header />
      <main>
        <Hero />
        <SystemSection />
        <LeaksSection />
        <ApproachSection />
        <ServicesSection />
        <FitSection />
        <WhySection />
        <TimelineSection />
        <Assessment />
        <FAQ />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ErrorBoundary>
            <Router />
          </ErrorBoundary>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
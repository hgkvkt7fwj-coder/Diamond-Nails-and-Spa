import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowDown, ArrowUpRight, CalendarDays, Check, ChevronDown, Clock3, Diamond,
  Instagram, MapPin, Menu, MessageCircle, Phone, Send, Sparkles, Star, X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const gold = '#B8946A';

const images = {
  hero: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1400&q=85',
  detail: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=85',
  interior: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&w=1200&q=85',
  table: 'https://images.unsplash.com/photo-1610992015762-45dca7c5f3b9?auto=format&fit=crop&w=900&q=85',
  polish: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=85',
  hands: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=85',
  nude: 'https://images.unsplash.com/photo-1629211062497-0b7f5c53fcb0?auto=format&fit=crop&w=900&q=85',
  spa: 'https://images.unsplash.com/photo-1604654894758-2b9b4d1b3ec0?auto=format&fit=crop&w=900&q=85',
  flower: 'https://images.unsplash.com/photo-1602680117767-5d36b4c9a6c6?auto=format&fit=crop&w=900&q=85',
  pink: 'https://images.unsplash.com/photo-1610992015765-5c5c6c3d124d?auto=format&fit=crop&w=900&q=85',
};

const navItems = [
  { label: 'Services', href: '#services' },
  { label: 'Our work', href: '#gallery' },
  { label: 'About', href: '#about' },
  { label: 'FAQs', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const services = [
  { title: 'Acrylic', description: 'Structured length and a beautiful, durable finish — shaped just for you.', price: '£-- [TO CONFIRM]', image: images.detail, number: '01' },
  { title: 'BIAB', description: 'The natural-looking strength your own nails have been waiting for.', price: '£-- [TO CONFIRM]', image: images.nude, number: '02' },
  { title: 'Gel Nails', description: 'High-shine colour with staying power, from quiet neutrals to the unexpected.', price: '£-- [TO CONFIRM]', image: images.polish, number: '03' },
  { title: 'Manicures & Pedicures', description: 'A considered reset for hands and feet, finished in your favourite shade.', price: '£-- [TO CONFIRM]', image: images.spa, number: '04' },
  { title: 'Nail Design', description: 'Fine details, tiny flourishes and art that feels like you.', price: '£-- [TO CONFIRM]', image: images.flower, number: '05' },
];

const faqs = [
  ['Do I need to book an appointment?', 'We recommend booking ahead so we can give your appointment our full attention. We may be able to welcome walk-ins depending on availability — please call first.'],
  ['How long does an appointment take?', '[TO CONFIRM]'],
  ['Can I bring an inspiration photo?', 'Absolutely. Bring a screenshot, a saved post or simply describe the mood. We love making a reference feel personal to you.'],
  ['Do you remove product applied elsewhere?', '[TO CONFIRM]'],
  ['What should I do if I need to cancel?', 'Please contact us as soon as possible so we can offer the time to another guest. Cancellation policy: [TO CONFIRM]'],
  ['Do you offer nail art?', 'Yes — from a quiet glazed finish to considered, hand-painted details. Tell us when booking if you would like nail art so we can allow the right time.'],
];

type Message = { from: 'assistant' | 'user'; text: string };

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={`${className} transform-gpu will-change-transform`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '50px' }}
      transition={{ duration: 0.48, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function DiamondMark({ size = 22 }: { size?: number }) {
  return <Diamond size={size} strokeWidth={1.3} color={gold} aria-hidden="true" />;
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 z-50 w-full px-4 pt-4 md:px-8 md:pt-5" data-testid="header-main">
      <nav className="glass-nav section-shell flex min-h-[68px] items-center justify-between rounded-full border px-5 md:px-7" aria-label="Main navigation">
        <a href="#top" className="flex items-center gap-2.5" data-testid="link-logo">
          <DiamondMark size={19} />
          <span className="font-display text-[1.25rem] font-semibold tracking-wide text-[#3B2F2C]">Diamond Nails <span className="font-sans text-[.58rem] font-medium uppercase tracking-[.18em] text-[#B8946A]">& Spa</span></span>
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => <a className="nav-link text-[.73rem] font-medium uppercase tracking-[.13em] text-[#3B2F2C]/80 transition-colors hover:text-[#3B2F2C]" href={item.href} key={item.href} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}</a>)}
          <a href="#booking" className="rounded-full bg-[#3B2F2C] px-5 py-3 text-[.7rem] font-medium uppercase tracking-[.16em] text-[#FBF6F2] transition-transform hover:-translate-y-0.5" data-testid="link-book-nav">Book now</a>
        </div>
        <button type="button" className="rounded-full p-2 text-[#3B2F2C] md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)} data-testid="button-mobile-menu">
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="glass-nav section-shell mt-2 rounded-[1.75rem] border p-3 md:hidden" data-testid="menu-mobile">
            {navItems.map((item) => <a href={item.href} onClick={() => setOpen(false)} key={item.href} className="block rounded-2xl px-4 py-3.5 text-sm text-[#3B2F2C] hover:bg-[#F1D9D3]/60" data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}</a>)}
            <a href="#booking" onClick={() => setOpen(false)} className="mt-1 flex items-center justify-between rounded-2xl bg-[#3B2F2C] px-4 py-3.5 text-sm text-[#FBF6F2]" data-testid="link-mobile-book">Book an appointment <ArrowUpRight size={16} /></a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="hero-glow relative overflow-hidden pt-32 md:pt-44" data-testid="section-hero">
      <div className="section-shell grid min-h-[690px] items-center gap-14 pb-20 md:grid-cols-[.86fr_1.14fr] md:pb-28">
        <Reveal className="relative z-10">
          <p className="eyebrow mb-7 flex items-center gap-3"><span className="gold-rule" /> Caerphilly · South Wales</p>
          <h1 className="font-display max-w-[600px] text-[4.4rem] font-medium leading-[.84] tracking-[-.035em] text-[#3B2F2C] sm:text-[6rem] md:text-[7.4rem]">Experience<br /><em className="font-normal text-[#B8946A]">meets</em> style.</h1>
          <p className="mt-8 max-w-[405px] text-[1rem] leading-[1.7] text-[#3B2F2C]/70 md:text-[1.06rem]">A calm corner in Caerphilly for beautifully considered nails, thoughtful details and a little time that is entirely yours.</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#booking" className="group flex items-center gap-3 rounded-full bg-[#3B2F2C] px-6 py-3.5 text-[.72rem] font-medium uppercase tracking-[.15em] text-[#FBF6F2] shadow-card transition-transform hover:-translate-y-1" data-testid="link-book-hero">Book your visit <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#B8946A] transition-transform group-hover:rotate-45"><ArrowUpRight size={14} /></span></a>
            <a href="#services" className="flex items-center gap-2 text-[.73rem] font-medium uppercase tracking-[.13em] text-[#3B2F2C]/65 hover:text-[#3B2F2C]" data-testid="link-explore-services">Explore services <ArrowDown size={15} /></a>
          </div>
          <div className="mt-14 flex gap-8 border-t border-[#D9A9A0]/60 pt-5">
            {['Independent studio', 'By appointment', 'Caerphilly town'].map((item) => <span key={item} className="text-[.65rem] uppercase tracking-[.13em] text-[#3B2F2C]/55">{item}</span>)}
          </div>
        </Reveal>
        <Reveal delay={0.16} className="relative mx-auto w-full max-w-[590px]">
          <div className="relative ml-auto aspect-[.84] w-[82%] overflow-hidden rounded-t-[14rem] rounded-b-[.8rem] sm:w-[73%]">
            <img src={images.hero} alt="Elegant neutral manicure with delicate gold detail" loading="lazy" className="image-fade h-full w-full object-cover" data-testid="img-hero-nails" />
          </div>
          <div className="absolute bottom-[7%] left-0 flex h-[160px] w-[160px] -rotate-6 flex-col justify-between rounded-full bg-[#F1D9D3] p-7 shadow-card sm:h-[185px] sm:w-[185px]" data-testid="card-hero-note">
            <DiamondMark size={25} />
            <p className="font-display text-[1.55rem] leading-[.95] text-[#3B2F2C]">The little<br /><em>luxury</em> in your week.</p>
          </div>
          <div className="absolute right-[-.25rem] top-[7%] hidden rotate-90 items-center gap-3 text-[.63rem] uppercase tracking-[.2em] text-[#B8946A] sm:flex"><span className="gold-rule" /> Since 2020</div>
        </Reveal>
      </div>
      <div className="absolute -bottom-12 -left-16 h-40 w-40 rounded-full border border-[#D9A9A0]/40 md:h-64 md:w-64" />
    </section>
  );
}

function TrustStrip() {
  return (
    <div className="border-y border-[#D9A9A0]/45 bg-[#F1D9D3]/35" data-testid="section-trust">
      <div className="section-shell grid gap-5 py-7 sm:grid-cols-3 sm:gap-8">
        {[['01', 'Thoughtful detail', 'Every set is shaped around you.'], ['02', 'A slower pace', 'Time to settle in, switch off and stay awhile.'], ['03', 'A finish to love', 'Modern, wearable nails that feel like you.']].map(([number, title, copy]) => (
          <div className="flex gap-4" key={number} data-testid={`trust-point-${number}`}>
            <span className="font-display text-xl italic text-[#B8946A]">{number}</span>
            <div><h2 className="font-display text-[1.34rem] leading-none text-[#3B2F2C]">{title}</h2><p className="mt-1.5 text-[.76rem] text-[#3B2F2C]/60">{copy}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Services() {
  return (
    <section id="services" className="bg-[#FBF6F2] py-24 md:py-36" data-testid="section-services">
      <div className="section-shell">
        <Reveal className="mb-14 flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div><p className="eyebrow mb-5">The service menu</p><h2 className="font-display max-w-[540px] text-[3.6rem] leading-[.87] text-[#3B2F2C] md:text-[5rem]">Made for your<br /><em className="font-normal text-[#D9A9A0]">next favourite</em> set.</h2></div>
          <p className="max-w-[275px] text-sm leading-[1.75] text-[#3B2F2C]/65">From your first consultation to the final cuticle oil, every appointment is personal.</p>
        </Reveal>
        <div className="grid gap-3 md:grid-cols-12">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * .06} className={index === 0 ? 'md:col-span-7' : index === 1 ? 'md:col-span-5' : index === 2 ? 'md:col-span-5' : index === 3 ? 'md:col-span-4' : 'md:col-span-3'}>
              <article className="group relative min-h-[280px] overflow-hidden rounded-[1.2rem] bg-[#F1D9D3]" data-testid={`card-service-${service.number}`}>
                <img src={service.image} alt={`${service.title} nail service`} loading="lazy" className="image-fade absolute inset-0 h-full w-full object-cover opacity-65 mix-blend-multiply" data-testid={`img-service-${service.number}`} />
               <div className="absolute inset-0 bg-[#3B2F2C]/35" />
                <div className="relative flex min-h-[280px] flex-col justify-between p-6 text-[#FBF6F2]"><div className="flex justify-between text-[.65rem] tracking-[.16em]"><span>{service.number}</span><span>{service.price}</span></div><div><h3 className="font-display text-[2.25rem] leading-none">{service.title}</h3><p className="mt-2 max-w-[280px] text-[.78rem] leading-[1.5] text-[#FBF6F2]/75">{service.description}</p></div></div>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-[.7rem] text-[#3B2F2C]/50">All prices shown as £-- [TO CONFIRM]. Please ask about your specific set when booking.</p>
      </div>
    </section>
  );
}

function Gallery() {
  const tiles = [
    [images.detail, 'Soft chrome detail', 'col-span-2 row-span-2'],
    [images.interior, 'A calm place to land', ''],
    [images.table, 'The finishing touch', ''],
    [images.polish, 'Gloss, always', ''],
    [images.hands, 'A little closer', 'col-span-2'],
    [images.nude, 'Quietly considered', ''],
    [images.flower, 'Fine details', ''],
    [images.pink, 'A touch of blush', 'col-span-2'],
    [images.spa, 'A quiet ritual', ''],
  ];
  return (
    <section id="gallery" className="bg-[#3B2F2C] py-24 text-[#FBF6F2] md:py-36" data-testid="section-gallery">
      <div className="section-shell">
        <Reveal className="mb-12 flex items-end justify-between gap-5"><div><p className="eyebrow mb-5 text-[#D9A9A0]">A glimpse inside</p><h2 className="font-display text-[3.8rem] leading-[.86] md:text-[5rem]">Your nails,<br /><em className="font-normal text-[#D9A9A0]">our canvas.</em></h2></div><p className="hidden max-w-[190px] text-right text-[.76rem] leading-[1.7] text-[#FBF6F2]/55 sm:block">A collection of recent sets and quiet studio moments.</p></Reveal>
        <div className="grid auto-rows-[125px] grid-cols-2 gap-3 sm:auto-rows-[150px] sm:grid-cols-4 md:auto-rows-[185px]" data-testid="gallery-grid">
          {tiles.map(([src, alt, size], index) => <Reveal delay={index * .04} className={`${size} overflow-hidden rounded-xl`} key={`${alt}-${index}`}><div className="h-full overflow-hidden"><img src={src} alt={alt} loading="lazy" className="image-fade h-full w-full object-cover" data-testid={`img-gallery-${index + 1}`} /></div></Reveal>)}
        </div>
        <div className="mt-10 flex items-center justify-between border-t border-[#FBF6F2]/15 pt-5"><span className="text-[.65rem] uppercase tracking-[.18em] text-[#FBF6F2]/50">Follow along</span><a href="https://www.instagram.com/diamondnails.50caerphilly/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-[#D9A9A0] hover:text-[#FBF6F2]" data-testid="link-instagram"><Instagram size={16} /> @diamondnails.50caerphilly <ArrowUpRight size={14} /></a></div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="overflow-hidden bg-[#F1D9D3]/45 py-24 md:py-36" data-testid="section-about">
      <div className="section-shell grid items-center gap-14 md:grid-cols-[.95fr_1.05fr]">
        <Reveal className="relative">
          <div className="relative mx-auto max-w-[420px] overflow-hidden rounded-[12rem] rounded-b-2xl"><img src={images.interior} alt="Warm, airy Diamond Nails studio interior" loading="lazy" className="image-fade aspect-[.78] w-full object-cover" data-testid="img-about-studio" /></div>
          <div className="absolute -bottom-5 right-0 flex h-28 w-28 rotate-6 items-center justify-center rounded-full bg-[#B8946A] p-5 text-center text-[.65rem] uppercase leading-[1.4] tracking-[.1em] text-[#FBF6F2] shadow-card">Good nails<br />good mood</div>
        </Reveal>
        <Reveal delay={.12}>
          <p className="eyebrow mb-5">A little about us</p><h2 className="font-display text-[3.8rem] leading-[.88] text-[#3B2F2C] md:text-[5.3rem]">The kind of<br />place you <em className="font-normal text-[#B8946A]">exhale.</em></h2>
          <p className="mt-8 max-w-[470px] text-[1rem] leading-[1.8] text-[#3B2F2C]/70">Diamond Nails & Spa is an independent nail studio in the heart of Caerphilly. We believe beautiful nails do not need to shout — they need to feel considered, comfortable and completely yours.</p>
          <p className="mt-4 max-w-[470px] text-[1rem] leading-[1.8] text-[#3B2F2C]/70">Come for the finish. Stay for the feeling of having nowhere else to be for an hour or two.</p>
          <div className="mt-9 flex items-center gap-4"><span className="gold-rule" /><span className="font-display text-xl italic text-[#3B2F2C]">Experience meets style</span></div>
        </Reveal>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="bg-[#FBF6F2] py-24 md:py-32" data-testid="section-reviews">
      <div className="section-shell">
        <Reveal><p className="eyebrow mb-5 text-center">Kind words</p><h2 className="mx-auto max-w-[660px] text-center font-display text-[3.3rem] leading-[.88] text-[#3B2F2C] md:text-[4.8rem]">A little love from<br /><em className="font-normal text-[#D9A9A0]">our lovely clients.</em></h2></Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[['“', 'The calmest nail appointment I have ever had. My BIAB set is perfect — natural, glossy and exactly what I had in mind.', 'Sian R.', 'BIAB client'], ['“', 'The attention to detail is unreal. I left feeling like I had just had a proper reset, not just my nails done.', 'Carys M.', 'Gel nails client'], ['“', 'Beautiful studio, lovely atmosphere and the most thoughtful design. I already cannot wait for my next visit.', 'Bethan J.', 'Nail design client']].map(([quote, text, name, role], index) => (
            <Reveal key={name} delay={index * .09}><article className={`rounded-2xl p-7 ${index === 1 ? 'bg-[#3B2F2C] text-[#FBF6F2]' : 'border border-[#D9A9A0]/60 bg-[#F1D9D3]/35 text-[#3B2F2C]'}`} data-testid={`review-card-${index + 1}`}><span className="font-display text-5xl leading-none text-[#B8946A]">{quote}</span><p className="mt-3 min-h-[106px] text-[.92rem] leading-[1.7] opacity-80">{text}</p><div className="mt-7 flex items-end justify-between border-t border-current/15 pt-4"><div><p className="text-sm font-medium">{name}</p><p className="mt-1 text-[.67rem] uppercase tracking-[.12em] opacity-55">{role}</p></div><div className="flex gap-1" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, star) => <Star key={star} size={12} fill={gold} strokeWidth={0} />)}</div></div></article></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Booking() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  return (
    <section id="booking" className="bg-[#D9A9A0] py-20 md:py-28" data-testid="section-booking">
      <div className="section-shell grid gap-12 md:grid-cols-[.9fr_1.1fr] md:items-center">
        <Reveal><p className="eyebrow mb-5 text-[#3B2F2C]/65">Your time, reserved</p><h2 className="font-display text-[4.1rem] leading-[.84] text-[#3B2F2C] md:text-[5.7rem]">Make a little<br /><em className="font-normal text-[#FBF6F2]">space for you.</em></h2><p className="mt-7 max-w-[360px] text-sm leading-[1.7] text-[#3B2F2C]/70">Booking is currently by message. Share a few details and we will be in touch to find your perfect appointment.</p></Reveal>
        <Reveal delay={.12}><form onSubmit={submit} className="rounded-2xl bg-[#FBF6F2]/80 p-6 md:p-8" data-testid="form-booking"><div className="mb-6 flex items-center justify-between"><div><p className="font-display text-2xl text-[#3B2F2C]">Request an appointment</p><p className="mt-1 text-xs text-[#3B2F2C]/55">No payment required.</p></div><CalendarDays size={23} color={gold} /></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs text-[#3B2F2C]/70">Your name<input required name="name" type="text" placeholder="Your name" className="mt-2 w-full rounded-xl border border-[#D9A9A0] bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-[#3B2F2C]/35 focus:ring-2 focus:ring-[#B8946A]/35" data-testid="input-booking-name" /></label><label className="text-xs text-[#3B2F2C]/70">Phone number<input required name="phone" type="tel" placeholder="07..." className="mt-2 w-full rounded-xl border border-[#D9A9A0] bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-[#3B2F2C]/35 focus:ring-2 focus:ring-[#B8946A]/35" data-testid="input-booking-phone" /></label></div><label className="mt-4 block text-xs text-[#3B2F2C]/70">What would you love?<select name="service" className="mt-2 w-full rounded-xl border border-[#D9A9A0] bg-[#FBF6F2] px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#B8946A]/35" data-testid="select-booking-service">{services.map((service) => <option key={service.title}>{service.title}</option>)}</select></label><button type="submit" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B2F2C] py-4 text-[.7rem] font-medium uppercase tracking-[.15em] text-[#FBF6F2] transition-transform hover:-translate-y-0.5" data-testid="button-submit-booking">{sent ? <><Check size={15} /> Request received</> : <>Send request <ArrowUpRight size={15} /></>}</button>{sent && <p className="mt-3 text-center text-xs text-[#3B2F2C]/65" data-testid="status-booking-success">Thank you — we will be in touch shortly. This is a presentation form, so please also call 07496 973566.</p>}</form></Reveal>
      </div>
    </section>
  );
}

function FAQ() {
  const [active, setActive] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-[#FBF6F2] py-24 md:py-36" data-testid="section-faq">
      <div className="section-shell grid gap-12 md:grid-cols-[.7fr_1.3fr]">
        <Reveal><p className="eyebrow mb-5">Good to know</p><h2 className="font-display text-[4.1rem] leading-[.86] text-[#3B2F2C] md:text-[5rem]">Questions,<br /><em className="font-normal text-[#D9A9A0]">answered.</em></h2><p className="mt-7 max-w-[245px] text-sm leading-[1.7] text-[#3B2F2C]/60">Still wondering something? Our chat assistant is happy to point you in the right direction.</p></Reveal>
        <Reveal delay={.1}><div className="divide-y divide-[#D9A9A0]/55 border-y border-[#D9A9A0]/55">{faqs.map(([question, answer], index) => <div key={question} data-testid={`faq-item-${index + 1}`}><button type="button" className="flex w-full items-center justify-between gap-4 py-5 text-left text-[.92rem] text-[#3B2F2C]" onClick={() => setActive(active === index ? null : index)} aria-expanded={active === index} data-testid={`button-faq-${index + 1}`}><span>{question}</span><ChevronDown size={17} className={`shrink-0 text-[#B8946A] transition-transform ${active === index ? 'rotate-180' : ''}`} /></button><AnimatePresence initial={false}>{active === index && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="max-w-[600px] pb-5 pr-8 text-sm leading-[1.7] text-[#3B2F2C]/60" data-testid={`text-faq-answer-${index + 1}`}>{answer}</p></motion.div>}</AnimatePresence></div>)}</div></Reveal>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="bg-[#F1D9D3]/45 py-24 md:py-32" data-testid="section-contact">
      <div className="section-shell">
        <Reveal className="mb-12"><p className="eyebrow mb-5">Come and see us</p><h2 className="font-display text-[4rem] leading-[.85] text-[#3B2F2C] md:text-[5.5rem]">Find your way<br /><em className="font-normal text-[#B8946A]">to Diamond.</em></h2></Reveal>
        <div className="grid gap-4 md:grid-cols-[1fr_1.25fr]">
          <Reveal><div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1"><div className="rounded-2xl bg-[#FBF6F2] p-6" data-testid="contact-address"><MapPin size={19} color={gold} /><p className="mt-5 text-[.67rem] uppercase tracking-[.15em] text-[#3B2F2C]/50">Address</p><p className="mt-1 font-display text-2xl text-[#3B2F2C]">Caerphilly town centre<br /><span className="text-[#B8946A]">South Wales</span></p><a href="https://www.google.com/maps/search/Caerphilly+town+centre" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs text-[#3B2F2C] underline decoration-[#B8946A]" data-testid="link-map">Open in maps <ArrowUpRight size={13} /></a></div><div className="rounded-2xl bg-[#3B2F2C] p-6 text-[#FBF6F2]" data-testid="contact-hours"><Clock3 size={19} color={gold} /><p className="mt-5 text-[.67rem] uppercase tracking-[.15em] text-[#FBF6F2]/50">Opening hours</p><div className="mt-2 space-y-1.5 text-sm"><p>Monday – Saturday <span className="float-right text-[#D9A9A0]">By appointment</span></p><p>Sunday <span className="float-right text-[#D9A9A0]">Closed</span></p></div><a href="tel:07496973566" className="mt-5 inline-flex items-center gap-2 text-sm text-[#D9A9A0]" data-testid="link-contact-phone"><Phone size={14} /> 07496 973566</a></div></div></Reveal>
        <Reveal delay={.1}><div className="relative min-h-[360px] overflow-hidden rounded-2xl bg-[#D9A9A0]" data-testid="map-placeholder"><img src={images.table} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-multiply" /><div className="absolute inset-0 flex items-center justify-center"><div className="rounded-full bg-[#FBF6F2] px-5 py-4 text-center shadow-soft"><MapPin size={20} color={gold} className="mx-auto" /><p className="mt-2 font-display text-xl text-[#3B2F2C]">Diamond Nails & Spa</p><p className="text-[.68rem] uppercase tracking-[.13em] text-[#3B2F2C]/55">Caerphilly town centre</p></div></div><div className="absolute bottom-5 left-5 text-[.65rem] uppercase tracking-[.16em] text-[#3B2F2C]/60">Map preview · exact address to confirm</div></div></Reveal>
        </div>
      </div>
    </section>
  );
}

function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([{ from: 'assistant', text: 'Hello, I’m Diamond’s little assistant. Ask me about our hours, location, services or walk-ins.' }]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (event?: FormEvent) => {
    event?.preventDefault();
    const value = input.trim();
    if (!value) return;
    const lower = value.toLowerCase();
    let response = "I'm not sure, please call 07496 973566 or send us a message on Instagram @diamondnails.50caerphilly.";
    if (lower.includes('hour') || lower.includes('open') || lower.includes('close')) response = 'We are open Monday to Saturday by appointment, and closed on Sunday.';
    else if (lower.includes('where') || lower.includes('location') || lower.includes('address') || lower.includes('find')) response = 'You can find us in Caerphilly town centre, South Wales. The exact address is [TO CONFIRM].';
    else if (lower.includes('service') || lower.includes('acrylic') || lower.includes('biab') || lower.includes('gel') || lower.includes('manicure') || lower.includes('pedicure') || lower.includes('design')) response = 'We offer Acrylic, BIAB, Gel Nails, Manicures & Pedicures and Nail Design. Prices are £-- [TO CONFIRM].';
    else if (lower.includes('walk')) response = 'Walk-ins may be possible depending on availability. Please call 07496 973566 first so we can check for you.';
    setMessages((current) => [...current, { from: 'user', text: value }, { from: 'assistant', text: response }]);
    setInput('');
  };
  return (
    <div className="fixed bottom-5 right-5 z-50" data-testid="chat-assistant">
      <AnimatePresence>
        {open && <motion.div initial={{ opacity: 0, y: 14, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: .97 }} className="mb-3 flex w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#D9A9A0] bg-[#FBF6F2] shadow-soft" data-testid="chat-panel"><div className="flex items-center justify-between bg-[#3B2F2C] px-5 py-4 text-[#FBF6F2]"><div><p className="font-display text-xl">A little help?</p><p className="text-[.65rem] text-[#FBF6F2]/60">Diamond assistant</p></div><button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-1 hover:bg-white/10" data-testid="button-close-chat"><X size={17} /></button></div><div className="chat-scroll flex max-h-72 flex-col gap-3 overflow-y-auto p-4">{messages.map((message, index) => <div key={`${message.from}-${index}`} className={`max-w-[87%] rounded-2xl px-3.5 py-2.5 text-xs leading-[1.55] ${message.from === 'user' ? 'self-end rounded-br-sm bg-[#D9A9A0]/45 text-[#3B2F2C]' : 'self-start rounded-bl-sm bg-[#F1D9D3]/45 text-[#3B2F2C]/75'}`} data-testid={`chat-message-${index}`}>{message.text}</div>)}<div ref={messagesEndRef} aria-hidden="true" /></div><form onSubmit={send} className="flex gap-2 border-t border-[#D9A9A0]/55 p-3"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a question..." aria-label="Chat message" className="min-w-0 flex-1 rounded-xl border border-[#D9A9A0] bg-transparent px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#B8946A]/35" data-testid="input-chat-message" /><button type="submit" aria-label="Send chat message" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3B2F2C] text-[#FBF6F2]" data-testid="button-send-chat"><Send size={15} /></button></form></motion.div>}
      </AnimatePresence>
      <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-full bg-[#3B2F2C] px-4 py-3.5 text-[#FBF6F2] shadow-soft transition-transform hover:-translate-y-1" aria-expanded={open} data-testid="button-toggle-chat"><MessageCircle size={18} color={gold} /><span className="text-[.68rem] uppercase tracking-[.12em]">Chat with us</span></button>
    </div>
  );
}

function Footer() {
  return <footer className="bg-[#3B2F2C] py-12 text-[#FBF6F2]" data-testid="footer-main"><div className="section-shell flex flex-col justify-between gap-9 md:flex-row md:items-end"><div><a href="#top" className="flex items-center gap-2.5" data-testid="link-footer-logo"><DiamondMark size={19} /><span className="font-display text-2xl">Diamond Nails <span className="font-sans text-[.58rem] uppercase tracking-[.18em] text-[#D9A9A0]">& Spa</span></span></a><p className="mt-5 max-w-[250px] text-[.75rem] leading-[1.6] text-[#FBF6F2]/50">Experience meets style — we create nails you’ll love.</p></div><div className="flex flex-wrap gap-x-7 gap-y-3 text-[.68rem] uppercase tracking-[.13em] text-[#FBF6F2]/60"><a href="#services" className="hover:text-[#D9A9A0]" data-testid="link-footer-services">Services</a><a href="#gallery" className="hover:text-[#D9A9A0]" data-testid="link-footer-gallery">Our work</a><a href="#contact" className="hover:text-[#D9A9A0]" data-testid="link-footer-contact">Contact</a><a href="https://www.instagram.com/diamondnails.50caerphilly/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#D9A9A0]" data-testid="link-footer-instagram"><Instagram size={13} /> Instagram</a></div></div><div className="section-shell mt-10 flex justify-between border-t border-[#FBF6F2]/15 pt-5 text-[.62rem] uppercase tracking-[.12em] text-[#FBF6F2]/35"><span>© 2024 Diamond Nails & Spa</span><span>Caerphilly, South Wales</span></div></footer>;
}

function Home() {
  return <div className="noise min-h-[100dvh] overflow-x-hidden"><Header /><main><Hero /><TrustStrip /><Services /><Gallery /><About /><Reviews /><Booking /><FAQ /><Contact /></main><Footer /><a href="#booking" className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full bg-[#B8946A] px-5 py-3.5 text-[.68rem] font-medium uppercase tracking-[.13em] text-[#FBF6F2] shadow-soft md:hidden" data-testid="link-floating-book"><CalendarDays size={15} /> Book now</a><ChatAssistant /></div>;
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><RoutedErrorBoundary><Router /></RoutedErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown, MessageSquare, Globe, WifiOff, Menu, X, ClipboardList, Camera, BarChart3, Quote } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollAnimationWrapper, StaggerWrapper } from '@/components/ScrollAnimationWrapper';
import { InteractiveButton, InteractiveCard } from '@/components/InteractiveButton';
import { useAdvancedParallax } from '@/hooks/useAdvancedParallax';
import logoTropiScan from '@/assets/tropiscan.jpeg';

/* ─── Counter Hook ─── */
function useCountUp(end: number, duration = 1500, startOnView = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started, startOnView]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return { count, ref };
}

/* ─── Fade-in variant ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const stagger = { 
  visible: { transition: { staggerChildren: 0.15 } },
  hidden: {}
};

const staggerFast = { 
  visible: { transition: { staggerChildren: 0.1 } },
  hidden: {}
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Parallax Avançado */
  const heroRef = useRef<HTMLDivElement>(null);
  const { style: heroParallax } = useAdvancedParallax({ 
    speed: 0.5, 
    opacity: true, 
    scale: false 
  });
  
  const { scrollYProgress } = useScroll({ 
    target: heroRef, 
    offset: ['start start', 'end start'] 
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  /* Counters */
  const c1 = useCountUp(25);
  const c2 = useCountUp(80);
  const c3 = useCountUp(5);

  const navLinks = [
    { label: t('landing.navHow'), id: 'como-funciona' },
    { label: t('landing.navWhy'), id: 'por-que-importa' },
    { label: 'FAQ', id: 'faq' },
  ];

  return (
    <div className="landing-page bg-[#f8f6f0] text-[#1a4d3a] overflow-x-hidden">
      
      {/* ═══ NAVBAR ═══ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#1a4d3a]/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          <button onClick={() => scrollTo('hero')} className={`font-playfair text-2xl font-bold tracking-tight transition-colors ${scrolled ? 'text-[#f8f6f0]' : 'text-white'}`}>
            TropiScan
          </button>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <button key={l.id} onClick={() => scrollTo(l.id)} className={`text-sm font-medium tracking-wide uppercase transition-colors hover:opacity-70 ${scrolled ? 'text-[#f8f6f0]/80' : 'text-white/80'}`}>
                {l.label}
              </button>
            ))}
            <button onClick={() => navigate('/selecionar-doenca')} className={`border px-5 py-2 text-sm font-semibold uppercase tracking-widest transition-all hover:bg-white hover:text-[#1a4d3a] ${scrolled ? 'border-[#f8f6f0]/40 text-[#f8f6f0]' : 'border-white/40 text-white'}`}>
              Iniciar Triagem
            </button>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden transition-colors ${scrolled ? 'text-[#f8f6f0]' : 'text-white'}`}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute left-0 right-0 top-full bg-[#1a4d3a]/95 backdrop-blur-lg md:hidden">
            <div className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((l) => (
                <button key={l.id} onClick={() => scrollTo(l.id)} className="text-left text-sm font-medium uppercase tracking-wide text-[#f8f6f0]/80 hover:text-white">
                  {l.label}
                </button>
              ))}
              <button onClick={() => { setMenuOpen(false); navigate('/selecionar-doenca'); }} className="mt-2 border border-white/30 px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-white hover:bg-white hover:text-[#1a4d3a]">
                Iniciar Triagem
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ═══ SECTION 1 — HERO ═══ */}
      <section id="hero" ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }} 
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" 
            alt="Portal de triagem inteligente para doenças negligenciadas" 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/85" />
        </motion.div>

        <StaggerWrapper className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 text-center">
          <ScrollAnimationWrapper variant="fadeUp" delay={0.2}>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/80 drop-shadow-lg" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
              Portal de Doenças Negligenciadas
            </p>
          </ScrollAnimationWrapper>
          
          <ScrollAnimationWrapper variant="scaleIn" delay={0.4}>
            <h1 className="font-playfair text-5xl font-bold leading-[1.1] text-white sm:text-6xl lg:text-8xl drop-shadow-2xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              América Latina
              <br />
              <span className="italic text-[#6b9b7a] drop-shadow-2xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Mais Saudável</span>
            </h1>
          </ScrollAnimationWrapper>
          
          <ScrollAnimationWrapper variant="fadeUp" delay={0.6}>
            <p className="max-w-lg text-base leading-relaxed text-white/90 sm:text-lg drop-shadow-lg" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
              Triagem inteligente para Chagas, Hanseníase, Esquistossomose e Leishmaniose com IA e educação em saúde
            </p>
          </ScrollAnimationWrapper>
          
          <ScrollAnimationWrapper variant="fadeUp" delay={0.8}>
            <InteractiveButton
              onClick={() => navigate('/selecionar-doenca')}
              variant="ghost"
              size="lg"
              className="mt-4 border-2 border-white text-white hover:bg-white hover:text-[#1a4d3a]"
              cursorText="Começar triagem"
              glowEffect
            >
              Iniciar Triagem
            </InteractiveButton>
          </ScrollAnimationWrapper>
        </StaggerWrapper>

        {/* Scroll indicator */}
        <ScrollAnimationWrapper 
          variant="fadeUp" 
          delay={1.2}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors cursor-pointer"
        >
          <InteractiveButton
            onClick={() => scrollTo('missao')}
            variant="ghost"
            className="flex flex-col items-center gap-2 p-2"
            cursorText="Saiba mais"
          >
            <span className="text-xs font-medium uppercase tracking-[0.3em]">Saiba Mais</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </InteractiveButton>
        </ScrollAnimationWrapper>
      </section>

      {/* ═══ SECTION 2 — A MISSÃO ═══ */}
      <section id="missao" className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80" 
            alt="Médico examinando paciente" 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-white/85" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-12">
          <ScrollAnimationWrapper variant="fadeInLeft" duration={0.8}>
            <h2 className="font-playfair text-4xl font-bold leading-tight text-[#1a4d3a] sm:text-5xl lg:text-6xl">
              Doenças negligenciadas têm cura.
              <br />
              <span className="italic text-[#1a4d3a]/60">O diagnóstico tardio, não.</span>
            </h2>
          </ScrollAnimationWrapper>
          
          <ScrollAnimationWrapper variant="scaleIn" delay={0.3}>
            <div className="mx-auto mt-8 h-px w-16 bg-[#1a4d3a]/20" />
          </ScrollAnimationWrapper>
          
          <ScrollAnimationWrapper variant="fadeInRight" delay={0.5}>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-[#1a4d3a]/70 sm:text-lg">
              Milhões de casos de Chagas, Hanseníase, Esquistossomose e Leishmaniose são registrados anualmente na América Latina, 
              a maioria em comunidades sem acesso a especialistas. O TropiScan leva triagem inteligente a quem mais precisa — 
              pelo celular, sem internet, em poucos minutos.
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* ═══ SECTION 3 — COMO FUNCIONA ═══ */}
      <section id="como-funciona" className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Tecnologia em saúde" 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-[#1a4d3a]/80" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-12">
          <ScrollAnimationWrapper variant="scaleIn">
            <h2 className="text-center font-playfair text-4xl font-bold text-[#f8f6f0] sm:text-5xl lg:text-6xl">
              Como Funciona
            </h2>
          </ScrollAnimationWrapper>
          
          <ScrollAnimationWrapper variant="fadeUp" delay={0.2}>
            <div className="mx-auto mt-4 h-px w-16 bg-[#f8f6f0]/20" />
          </ScrollAnimationWrapper>

          <StaggerWrapper className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              { icon: ClipboardList, num: '01', title: 'Selecione a Doença', desc: 'Escolha entre Chagas, Hanseníase, Esquistossomose ou Leishmaniose' },
              { icon: Camera, num: '02', title: 'Responda e Fotografe', desc: 'Questionário clínico e análise de imagem por IA (quando aplicável)' },
              { icon: BarChart3, num: '03', title: 'Receba Orientação', desc: 'Score de risco, educação em saúde e encaminhamento médico' },
            ].map((step, index) => (
              <ScrollAnimationWrapper 
                key={step.num}
                variant={index === 0 ? 'fadeInLeft' : index === 1 ? 'fadeUp' : 'fadeInRight'}
                delay={index * 0.2}
              >
                <InteractiveCard 
                  className="group relative border border-[#f8f6f0]/10 p-8 transition-all hover:border-[#6b9b7a]/30 hover:bg-[#f8f6f0]/5"
                  hoverScale={1.05}
                  glowOnHover
                >
                  <span className="font-playfair text-5xl font-bold text-[#6b9b7a]/20">{step.num}</span>
                  <step.icon className="mt-4 h-8 w-8 text-[#6b9b7a]" />
                  <h3 className="mt-4 font-playfair text-xl font-bold text-[#f8f6f0]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#f8f6f0]/60">{step.desc}</p>
                </InteractiveCard>
              </ScrollAnimationWrapper>
            ))}
          </StaggerWrapper>
        </div>
      </section>

      {/* ═══ SECTION 4 — POR QUE IMPORTA (Stats) ═══ */}
      <section id="por-que-importa" className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
            alt="Comunidade latino-americana" 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-white/90" />
        </div>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}
          className="relative z-10 mx-auto max-w-6xl px-6 lg:px-12"
        >
          <ScrollAnimationWrapper variant="scaleIn">
            <h2 className="text-center font-playfair text-4xl font-bold text-[#1a4d3a] sm:text-5xl lg:text-6xl">
              Por que Importa
            </h2>
          </ScrollAnimationWrapper>
          
          <ScrollAnimationWrapper variant="fadeUp" delay={0.2}>
            <div className="mx-auto mt-4 h-px w-16 bg-[#1a4d3a]/20" />
          </ScrollAnimationWrapper>

          <div className="mt-16 grid gap-12 sm:grid-cols-3">
            {[
              { ref: c1.ref, value: `${c1.count.toLocaleString('pt-BR')}M+`, label: 'Pessoas afetadas na América Latina' },
              { ref: c2.ref, value: `${c2.count}%`, label: 'Casos em áreas remotas' },
              { ref: c3.ref, value: `${c3.count} min`, label: 'Tempo de triagem' },
            ].map((stat, i) => (
              <ScrollAnimationWrapper 
                key={i}
                variant={i === 0 ? 'fadeInLeft' : i === 1 ? 'scaleIn' : 'fadeInRight'}
                delay={i * 0.2}
              >
                <div ref={stat.ref} className="text-center">
                  <span className="font-playfair text-6xl font-bold text-[#1a4d3a] lg:text-7xl">{stat.value}</span>
                  <p className="mt-3 text-sm uppercase tracking-widest text-[#1a4d3a]/50">{stat.label}</p>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ SECTION 5 — ACESSIBILIDADE ═══ */}
      <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2088&q=80" 
            alt="Pessoa usando tecnologia assistiva e acessível" 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-[#1a4d3a]/90" />
        </div>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}
          className="relative z-10 mx-auto max-w-6xl px-6 lg:px-12"
        >
          <ScrollAnimationWrapper variant="scaleIn">
            <h2 className="text-center font-playfair text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Acessibilidade Total
            </h2>
          </ScrollAnimationWrapper>
          
          <ScrollAnimationWrapper variant="fadeUp" delay={0.2}>
            <div className="mx-auto mt-4 h-px w-16 bg-white/30" />
          </ScrollAnimationWrapper>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: MessageSquare, title: 'Áudio Integrado', desc: 'Narração completa para pessoas com deficiência visual' },
              { Icon: () => <span className="text-2xl font-bold text-[#6b9b7a]">VL</span>, title: 'VLibras', desc: 'Tradução automática para Libras' },
              { Icon: Globe, title: 'Multilíngue', desc: 'Português, Espanhol e Inglês' },
              { Icon: WifiOff, title: 'Funciona Offline', desc: 'Sem necessidade de internet' },
            ].map((card, i) => (
              <ScrollAnimationWrapper 
                key={i}
                variant={i % 2 === 0 ? 'fadeInLeft' : 'fadeInRight'}
                delay={i * 0.1}
              >
                <div className="border border-white/20 bg-black/20 backdrop-blur-sm p-6 transition-all hover:border-[#6b9b7a]/50 hover:bg-black/30">
                  <div className="flex h-12 w-12 items-center justify-center">
                    <card.Icon className="h-6 w-6 text-[#6b9b7a]" />
                  </div>
                  <h3 className="mt-4 font-playfair text-lg font-bold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">{card.desc}</p>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ SECTION 6 — DEPOIMENTO ═══ */}
      <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Médico rural na América Latina" 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-white/88" />
        </div>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}
          className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-12"
        >
          <ScrollAnimationWrapper variant="scaleIn">
            <Quote className="mx-auto h-12 w-12 text-[#1a4d3a]/15 rotate-180" />
          </ScrollAnimationWrapper>
          
          <ScrollAnimationWrapper variant="fadeUp" delay={0.3}>
            <blockquote className="mt-8 font-playfair text-2xl font-medium italic leading-relaxed text-[#1a4d3a] sm:text-3xl lg:text-4xl">
              "O TropiScan chegou na nossa comunidade quando mais precisávamos. Conseguimos identificar casos suspeitos rapidamente e encaminhar para tratamento. É uma ferramenta que salva vidas."
            </blockquote>
          </ScrollAnimationWrapper>
          
          <ScrollAnimationWrapper variant="fadeInRight" delay={0.6}>
            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#1a4d3a]/60">Dr. Carlos M. — Médico Rural, Minas Gerais</p>
            </div>
          </ScrollAnimationWrapper>
        </motion.div>
      </section>

      {/* ═══ SECTION 7 — FAQ ═══ */}
      <section id="faq" className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Profissional de saúde respondendo dúvidas" 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/85" />
        </div>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}
          className="relative z-10 mx-auto max-w-3xl px-6 lg:px-12"
        >
          <ScrollAnimationWrapper variant="scaleIn">
            <h2 className="text-center font-playfair text-4xl font-bold text-white sm:text-5xl">
              Perguntas Frequentes
            </h2>
          </ScrollAnimationWrapper>
          
          <ScrollAnimationWrapper variant="fadeUp" delay={0.2}>
            <div className="mx-auto mt-4 h-px w-16 bg-white/30" />
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper variant="fadeInLeft" delay={0.4}>
            <div className="mt-12">
              <Accordion type="single" collapsible className="space-y-2">
                <AccordionItem value="faq-1" className="border-b border-white/30 bg-black/20 backdrop-blur-sm rounded-lg px-4">
                  <AccordionTrigger className="py-5 text-left font-medium text-white hover:text-[#6b9b7a] hover:no-underline [&[data-state=open]]:text-[#6b9b7a]">
                    O TropiScan substitui uma consulta médica?
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-white/90">
                    Não. O TropiScan é uma ferramenta auxiliar de triagem. Apenas um profissional de saúde pode confirmar um diagnóstico. Em caso de suspeita, procure uma unidade de saúde.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2" className="border-b border-white/30 bg-black/20 backdrop-blur-sm rounded-lg px-4">
                  <AccordionTrigger className="py-5 text-left font-medium text-white hover:text-[#6b9b7a] hover:no-underline [&[data-state=open]]:text-[#6b9b7a]">
                    Meus dados são enviados para algum servidor?
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-white/90">
                    Não. Todos os dados ficam armazenados exclusivamente no seu dispositivo. Nenhuma informação pessoal é enviada para servidores externos.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3" className="border-b border-white/30 bg-black/20 backdrop-blur-sm rounded-lg px-4">
                  <AccordionTrigger className="py-5 text-left font-medium text-white hover:text-[#6b9b7a] hover:no-underline [&[data-state=open]]:text-[#6b9b7a]">
                    Quais doenças o TropiScan pode identificar?
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-white/90">
                    O TropiScan oferece triagem para quatro doenças negligenciadas: Doença de Chagas, Hanseníase, Esquistossomose e Leishmaniose.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-4" className="border-b border-white/30 bg-black/20 backdrop-blur-sm rounded-lg px-4">
                  <AccordionTrigger className="py-5 text-left font-medium text-white hover:text-[#6b9b7a] hover:no-underline [&[data-state=open]]:text-[#6b9b7a]">
                    Como funciona a análise por IA?
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-white/90">
                    O algoritmo foi desenvolvido com base em critérios clínicos reconhecidos e complementado por IA para análise de imagens. No entanto, não substitui avaliação médica profissional.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-5" className="border-b border-white/30 bg-black/20 backdrop-blur-sm rounded-lg px-4">
                  <AccordionTrigger className="py-5 text-left font-medium text-white hover:text-[#6b9b7a] hover:no-underline [&[data-state=open]]:text-[#6b9b7a]">
                    Quanto custa?
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-white/90">
                    É completamente gratuito. O TropiScan é um projeto de impacto social para a América Latina.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </ScrollAnimationWrapper>
        </motion.div>
      </section>

      {/* ═══ SECTION 8 — FOOTER CTA + RODAPÉ ═══ */}
      <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Cuidados de saúde preventivos" 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-white/85" />
        </div>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}
          className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-12"
        >
          <ScrollAnimationWrapper variant="fadeInLeft">
            <h2 className="font-playfair text-4xl font-bold leading-tight text-[#1a4d3a] sm:text-5xl lg:text-6xl">
              Cuide da sua saúde.
              <br />
              <span className="italic text-[#1a4d3a]/60">Onde você estiver.</span>
            </h2>
          </ScrollAnimationWrapper>
          
          <ScrollAnimationWrapper variant="scaleIn" delay={0.4}>
            <motion.button
              onClick={() => navigate('/selecionar-doenca')}
              className="mt-10 border-2 border-[#1a4d3a] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#1a4d3a] transition-all hover:bg-[#1a4d3a] hover:text-[#f8f6f0]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Iniciar Triagem
            </motion.button>
          </ScrollAnimationWrapper>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-[#1a4d3a]/10 px-6 py-8 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
            alt="América Latina saudável" 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-white/90" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="font-playfair text-lg font-bold text-[#1a4d3a]">TropiScan</span>
          <p className="text-xs text-[#1a4d3a]/40">© {new Date().getFullYear()} TropiScan — Portal de Doenças Negligenciadas da América Latina</p>
        </div>
      </footer>
    </div>
  );
}

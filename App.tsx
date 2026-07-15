import React, { useState, useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { Sidebar } from './components/Sidebar';
import { HeroSection } from './components/HeroSection';
import { PortfolioSection } from './components/PortfolioSection';
import { ResumeGeneratorSection } from './components/ResumeGeneratorSection';
import { TimelineSection } from './components/TimelineSection';
import { Mail, RotateCcw, MessageSquare } from 'lucide-react';
import { CONTACT_DATA } from './src/data/contact';
import { PORTFOLIO_PAGE_DATA } from './src/data/portfolioPage';
import { Language, Category } from './types';

interface ExplodedElementData {
  element: HTMLElement;
  originalStyle: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState<Language>('zh');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const [portfolioCategory, setPortfolioCategory] = useState<string>('All');
  
  const [gravityActive, setGravityActive] = useState(false);

  const startViewTransition = (update: () => void) => {
    // Disable view transitions on mobile to prevent flickering and performance issues
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      update();
      return;
    }

    const anyDoc = document as any;
    if (anyDoc && typeof anyDoc.startViewTransition === 'function') {
      anyDoc.startViewTransition(update);
    } else {
      update();
    }
  };
  const engineRef = useRef<any>(null);
  const runnerRef = useRef<any>(null);
  const requestRef = useRef<number | null>(null);
  const explodedElementsRef = useRef<ExplodedElementData[]>([]);
  const dissipatedElementsRef = useRef<ExplodedElementData[]>([]);
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    // Automatic theme based on time: 18:30 - 06:00 is dark mode
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeInMinutes = hour * 60 + minutes;
    const darkStartTimeInMinutes = 18 * 60 + 30; // 18:30
    const darkEndTimeInMinutes = 6 * 60; // 06:00
    
    const isDarkTime = currentTimeInMinutes >= darkStartTimeInMinutes || currentTimeInMinutes < darkEndTimeInMinutes;
    setTheme(isDarkTime ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Scroll to top when activeTab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'portfolio') {
      setPortfolioCategory('All');
    }
    setActiveTab(tab);
  };

  const handleHeroNavigation = (category: Category) => {
    startViewTransition(() => {
      setPortfolioCategory(category);
      setActiveTab('portfolio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };
  
  // -------------------------
  // GRAVITY EXPLOSION LOGIC
  // -------------------------
  
  const handleInteraction = (event: MouseEvent) => {
    if (!engineRef.current) return;
    const engine = engineRef.current;
    
    const mouseX = event.clientX + window.scrollX;
    const mouseY = event.clientY + window.scrollY;
    
    const bodies = Matter.Composite.allBodies(engine.world);
    
    bodies.forEach((body: any) => {
      if (body.isStatic) return;

      // Add force on click
      if (event.type === 'mousedown') {
          const bodyX = body.position.x;
          const bodyY = body.position.y;
          const distance = Math.sqrt(Math.pow(mouseX - bodyX, 2) + Math.pow(mouseY - bodyY, 2));
          
          if (distance < 500) {
            const forceMagnitude = 0.8 * (1 - distance / 500); 
            const angle = Math.atan2(bodyY - mouseY, bodyX - mouseX);
            
            Matter.Body.applyForce(body, body.position, {
              x: Math.cos(angle) * forceMagnitude,
              y: Math.sin(angle) * forceMagnitude
            });
          }
      }
    });
  };

  const triggerGravity = () => {
    if (gravityActive) return;
    
    if (!Matter) return;

    scrollPositionRef.current = window.scrollY;
    // Lock body height to current scroll height to prevent layout jump
    document.body.style.height = `${document.documentElement.scrollHeight}px`; 
    document.body.style.overflow = 'hidden'; 
    
    setGravityActive(true);

    const Engine = Matter.Engine,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite;

    const engine = Engine.create({
      positionIterations: 12,
      velocityIterations: 8,
      constraintIterations: 4
    });
    const world = engine.world;
    engineRef.current = engine;

    // Dissipate large images
    const largeComponents = Array.from(document.querySelectorAll('main img, .aspect-\\[4\\/3\\]')) as HTMLElement[];
    const dissipatedData: ExplodedElementData[] = [];
    
    largeComponents.forEach(el => {
      dissipatedData.push({
        element: el,
        originalStyle: el.getAttribute('style') || ''
      });
      el.style.transition = 'all 0.5s ease-out';
      el.style.transform = 'scale(0.8)';
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
    });
    dissipatedElementsRef.current = dissipatedData;

    // Selector: Target individual visible elements, avoid layout wrappers
    const selector = `
      nav h1, nav button, nav span,
      footer p,
      .rounded-\\[2rem\\]:not(.aspect-\\[4\\/3\\]),
      main h1, main h2, main h3, main h4, main p, main span, 
      main svg, main button, main a, 
      main li,
      div[class*="border-b-2"], 
      div[class*="h-[1px]"],
      div[class*="h-[2px]"]
    `;
    
    const candidates = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
    
    const visibleCandidates = candidates.filter(el => {
       const rect = el.getBoundingClientRect();
       if (rect.width < 5 || rect.height < 5) return false;
       if (window.getComputedStyle(el).display === 'none') return false;
       if (window.getComputedStyle(el).opacity === '0') return false;
       if (largeComponents.includes(el)) return false;
       return true;
    });

    // Containment check to prevent overlapping physics bodies
    const validElements = visibleCandidates.filter(el => {
      return !visibleCandidates.some(parent => parent !== el && parent.contains(el));
    });

    const bodies: any[] = [];
    const explodedData: ExplodedElementData[] = [];

    validElements.forEach(el => {
      explodedData.push({
        element: el,
        originalStyle: el.getAttribute('style') || ''
      });

      const rect = el.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      const centerX = rect.left + rect.width / 2 + scrollX;
      const centerY = rect.top + rect.height / 2 + scrollY;

      const body = Bodies.rectangle(centerX, centerY, rect.width, rect.height, {
        restitution: 0.2, 
        friction: 0.5,    
        frictionAir: 0.05, 
        density: 0.002,
        chamfer: { radius: Math.min(rect.width, rect.height) * 0.1 }, 
        angle: (Math.random() - 0.5) * 0.05
      });
      (body as any).domElement = el;
      bodies.push(body);

      // Lock Visuals
      el.style.boxSizing = 'border-box';
      el.style.position = 'absolute';
      el.style.left = `${rect.left + scrollX}px`;
      el.style.top = `${rect.top + scrollY}px`;
      el.style.width = `${rect.width}px`;
      el.style.height = `${rect.height}px`;
      el.style.margin = '0'; 
      el.style.transform = 'translate(0, 0) rotate(0deg)';
      el.style.zIndex = '1000';
      el.style.pointerEvents = 'none'; 
      el.style.transition = 'none';
    });

    explodedElementsRef.current = explodedData;

    const totalHeight = document.documentElement.scrollHeight;

    // Add floor
    const floor = Bodies.rectangle(
        window.innerWidth / 2, 
        totalHeight + 500, // Place floor well below content
        window.innerWidth, 
        1000, 
        { isStatic: true, render: { visible: false } }
    );

    // Add walls
    const wallLeft = Bodies.rectangle(
        -500, 
        totalHeight / 2, 
        1000, 
        totalHeight * 2, 
        { isStatic: true, render: { visible: false } }
    );
    const wallRight = Bodies.rectangle(
        window.innerWidth + 500, 
        totalHeight / 2, 
        1000, 
        totalHeight * 2, 
        { isStatic: true, render: { visible: false } }
    );

    Composite.add(world, [floor, wallLeft, wallRight, ...bodies]);

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    const update = () => {
      if (!engineRef.current) return;

      bodies.forEach(body => {
        const el = (body as any).domElement;
        if (el) {
          const { x, y } = body.position;
          const angle = body.angle;
          
          const initialLeft = parseFloat(el.style.left);
          const initialTop = parseFloat(el.style.top);
          const w = parseFloat(el.style.width);
          const h = parseFloat(el.style.height);

          const initialCenterX = initialLeft + w / 2;
          const initialCenterY = initialTop + h / 2;

          const dx = x - initialCenterX;
          const dy = y - initialCenterY;

          el.style.transform = `translate(${dx}px, ${dy}px) rotate(${angle}rad)`;
        }
      });

      requestRef.current = requestAnimationFrame(update);
    };
    
    update();

    setTimeout(() => {
        window.addEventListener('mousedown', handleInteraction);
    }, 50);
  };

  const resetGravity = () => {
    window.removeEventListener('mousedown', handleInteraction);

    if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
    if (engineRef.current) {
      Matter.World.clear(engineRef.current.world, false);
      Matter.Engine.clear(engineRef.current);
    }
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    
    engineRef.current = null;
    runnerRef.current = null;

    const explodedData = explodedElementsRef.current;
    
    explodedData.forEach(({ element }) => {
      // FORCE REFLOW: Critical for smooth transition from chaos to order
      void element.offsetWidth; 
      
      // Use specific transition property to avoid conflicts
      element.style.transition = 'transform 1s cubic-bezier(0.19, 1, 0.22, 1)';
      // Reset transform to identity (relative to fixed start position)
      element.style.transform = 'translate(0, 0) rotate(0deg)';
    });

    const dissipatedData = dissipatedElementsRef.current;
    dissipatedData.forEach(({ element }) => {
      element.style.transition = 'all 1s ease';
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
    });

    setTimeout(() => {
      explodedData.forEach(({ element, originalStyle }) => {
        element.setAttribute('style', originalStyle);
      });
      dissipatedData.forEach(({ element, originalStyle }) => {
         element.setAttribute('style', originalStyle);
      });

      explodedElementsRef.current = [];
      dissipatedElementsRef.current = [];
      
      document.body.style.height = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollPositionRef.current);
      
      setGravityActive(false);
    }, 1000); // Matches transition duration
  };


  const content = CONTACT_DATA[language];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <HeroSection 
              onNavigate={(tab) => startViewTransition(() => handleTabChange(tab))}
              onCategorySelect={handleHeroNavigation}
              language={language} 
            />
          </>
        );
      case 'portfolio':
        return (
          <div className="pt-2 md:pt-6 w-full max-w-[96vw] mx-auto min-h-[calc(100svh-6rem)] flex flex-col">
             <div className="mb-4 md:mb-6">
               <h1 className="text-[12vw] sm:text-[10vw] md:text-[7vw] leading-none font-black mb-5 md:mb-6 text-black dark:text-white transition-colors duration-300">
                 {PORTFOLIO_PAGE_DATA[language].title}
               </h1>
             </div>
             <PortfolioSection language={language} externalFilter={portfolioCategory} archiveLayout />
          </div>
        );
      case 'articles':
        return (
          <div className="pt-20 w-full max-w-[96vw] mx-auto">
             <ResumeGeneratorSection language={language} />
          </div>
        );
      case 'about':
        return (
          <div className="w-full max-w-none mx-auto">
            <TimelineSection language={language} />
          </div>
        );
      case 'contact':
        return (
           <div className="mx-auto w-full max-w-5xl animate-fade-in px-5 pt-6 text-center md:px-8 md:pt-10">
              <h1 className="mb-5 text-[clamp(4.5rem,9vw,8rem)] font-black leading-[0.88] tracking-[-0.055em] text-black transition-colors duration-300 dark:text-white">
                {content.hello}
              </h1>
              <p className="mx-auto mb-12 max-w-2xl text-lg font-medium leading-relaxed text-gray-500 transition-colors duration-300 dark:text-gray-400 md:mb-16 md:text-2xl">
                {content.intro}
              </p>

              <div className="contact-directory mx-auto grid max-w-3xl grid-cols-1 md:grid-cols-2">
                 {/* Email */}
                  <div className="contact-directory-item group flex min-h-52 cursor-default flex-col items-center justify-center px-6 py-9 md:min-h-60 md:px-10">
                     <Mail size={32} strokeWidth={1.6} className="mb-5 text-gray-400 transition-colors duration-300 group-hover:text-black dark:group-hover:text-white" />
                     <h3 className="mb-2 text-lg font-bold text-black transition-colors duration-300 dark:text-white md:text-xl">
                       {content.emailMeLabel}
                     </h3>
                     <p className="select-text text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 md:text-base">
                       {content.email}
                     </p>
                  </div>

                 {/* Socials - WeChat */}
                 <div 
                    className="contact-directory-item group relative flex min-h-52 cursor-default flex-col items-center justify-center px-6 py-9 md:min-h-60 md:px-10"
                    onMouseEnter={(e) => {
                       const tooltip = document.getElementById('wechat-tooltip');
                       if (tooltip) {
                          tooltip.style.opacity = '1';
                          tooltip.style.transform = 'scale(1) translateY(0)';
                       }
                    }}
                    onMouseMove={(e) => {
                       const tooltip = document.getElementById('wechat-tooltip');
                       if (tooltip) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const y = e.clientY - rect.top;
                          tooltip.style.left = `${x + 20}px`;
                          tooltip.style.top = `${y + 20}px`;
                       }
                    }}
                    onMouseLeave={() => {
                       const tooltip = document.getElementById('wechat-tooltip');
                       if (tooltip) {
                          tooltip.style.opacity = '0';
                          tooltip.style.transform = 'scale(0.95) translateY(10px)';
                       }
                    }}
                 >
                    <MessageSquare size={32} strokeWidth={1.6} className="mb-5 text-gray-400 transition-colors duration-300 group-hover:text-black dark:group-hover:text-white" />
                    <h3 className="mb-2 text-lg font-bold text-black transition-colors duration-300 dark:text-white md:text-xl">
                      {language === 'zh' ? '微信' : 'WeChat'}
                    </h3>
                    <p className="text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 md:text-base">
                      {content.socials?.wechat || 'Lun3cy'}
                    </p>
                    
                    {/* Glassmorphism Tooltip */}
                    <div 
                       id="wechat-tooltip"
                       className="pointer-events-none absolute z-50 flex h-28 w-56 translate-y-2 scale-95 items-center justify-center overflow-hidden border border-black/15 bg-white/90 opacity-0 shadow-[0_16px_40px_rgba(23,23,23,0.14)] backdrop-blur-md transition-all duration-200 dark:border-white/20 dark:bg-[#171717]/95"
                       style={{ top: 0, left: 0 }}
                    >
                       <p className="text-sm font-bold text-black dark:text-white opacity-80 px-4 text-center">
                          WeChat ID<br/>
                          <span className="text-xs opacity-50 font-mono">{content.socials?.wechat || 'Lun3cy'}</span>
                       </p>
                    </div>
                 </div>

              </div>
           </div>
        )
      default:
        return (
          <>
            <HeroSection 
              onNavigate={(tab) => startViewTransition(() => handleTabChange(tab))}
              onCategorySelect={handleHeroNavigation}
              language={language} 
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-[100dvh] overflow-x-clip bg-[#f7f7f5] font-sans text-[#171717] transition-colors duration-300 dark:bg-[#121212] dark:text-[#f7f7f5]">
      <span id="nav-scroll-sentinel" aria-hidden="true" className="pointer-events-none absolute left-0 top-8 h-px w-px" />
      
      {/* Dynamic Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => startViewTransition(() => handleTabChange(tab))}
        language={language}
        toggleLanguage={toggleLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        onTriggerGravity={triggerGravity}
      />

      {/* Main Content Area */}
      <main className={`w-full ${activeTab === 'portfolio' || activeTab === 'about' ? 'pt-24 pb-0' : activeTab === 'dashboard' ? 'pt-40 pb-0' : 'pt-40 pb-32'} vt-page`}>
         <div key={activeTab} className={activeTab === 'about' ? '' : 'animate-fade-in'}>
           {renderContent()}
         </div>

         {/* Footer */}
          <footer className={`${activeTab === 'dashboard' || activeTab === 'portfolio' || activeTab === 'about' || activeTab === 'articles' ? 'hidden' : 'flex'} w-full max-w-[96vw] mx-auto mt-32 border-t-2 border-black dark:border-white pt-12 flex-col md:flex-row justify-between items-center text-sm font-light text-gray-400 dark:text-gray-500 uppercase tracking-wide gap-4 transition-colors duration-300`}>
            <p>© 2026 ZHUORAN SONG</p>
            <p>{content.footerDesign}</p>
         </footer>
      </main>
      
      {/* Floating Reset Button for Gravity - Fixed Centering Wrapper */}
      {gravityActive && (
        <div className="fixed bottom-8 left-0 w-full flex justify-center z-[1001] pointer-events-none">
          <button 
            onClick={resetGravity}
            className="pointer-events-auto bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-bold text-xl shadow-2xl animate-fade-in hover:scale-110 transition-transform flex items-center gap-3 cursor-pointer"
          >
            <RotateCcw size={24} />
            {language === 'zh' ? '返回' : 'Go Back'}
          </button>
        </div>
      )}

    </div>
  );
}

export default App;

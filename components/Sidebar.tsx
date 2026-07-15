
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../src/data/navigation';
import { Language } from '../types';
import { Moon, Sun, Globe, Bomb } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  toggleLanguage: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onTriggerGravity: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  language,
  toggleLanguage,
  theme,
  toggleTheme,
  onTriggerGravity
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const isHeroNav = activeTab === 'dashboard' && !isScrolled;

  useEffect(() => {
    const sentinel = document.getElementById('nav-scroll-sentinel');
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsScrolled(!entry.isIntersecting);
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const items = NAV_ITEMS[language];

  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex justify-center pt-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:pt-6">
      <nav 
        className={`
          flex min-w-0 items-center justify-between 
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isScrolled 
            ? 'w-[96vw] md:w-auto gap-[clamp(0.5rem,2.6vw,3rem)] bg-[#f7f7f5]/95 dark:bg-[#121212]/95 backdrop-blur-md border border-black/10 dark:border-white/15 rounded-2xl md:rounded-full px-[clamp(0.6rem,2.4vw,2.5rem)] py-3 md:py-4 shadow-pill dark:shadow-pill-dark'
            : 'w-[96vw] gap-[clamp(0.5rem,2.8vw,3rem)] bg-transparent border-transparent shadow-none px-0 py-2 backdrop-blur-none'}
        `}
      >
        
        {/* Logo Left - Text Based */}
        <div 
          className="editorial-action group flex shrink-0 cursor-pointer items-center gap-2"
          onClick={() => setActiveTab('dashboard')}
        >
          <h1 className={`font-black tracking-tighter uppercase transition-all duration-500 ease-in-out leading-none
            ${isHeroNav ? 'text-white' : 'text-black dark:text-white'}
            ${isScrolled ? 'text-xl md:text-3xl' : 'text-[clamp(1.25rem,3vw,3rem)]'}
          `}>
            <span className="sm:hidden">宋卓冉</span>
            <span className="hidden sm:inline">ZHUORAN SONG</span>
          </h1>
        </div>

        {/* Links Right */}
        <div className={`flex min-w-0 items-center overflow-hidden transition-all duration-500 ${isScrolled ? 'gap-[clamp(0.35rem,1.7vw,2rem)]' : 'gap-[clamp(0.3rem,2.1vw,3rem)]'}`}>
          {items.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  editorial-action relative whitespace-nowrap text-[clamp(0.82rem,2.35vw,1.25rem)] font-bold uppercase tracking-wide
                  ${isHeroNav
                    ? (isActive ? 'text-white' : 'text-white/45 hover:text-white')
                    : (isActive ? 'text-black dark:text-white' : 'text-gray-400 hover:text-black dark:hover:text-white')}
                `}
              >
                {item.label}
                {/* Underline for hover/active */}
                <span className={`absolute -bottom-1 left-0 w-full h-[2px] md:h-[3px] ${isHeroNav ? 'bg-white' : 'bg-black dark:bg-white'} transform transition-transform duration-200 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </button>
            )
          })}

          {/* Divider */}
          <div className={`w-[1px] h-6 md:h-8 shrink-0 mx-[clamp(0.15rem,0.9vw,0.5rem)] ${isHeroNav ? 'bg-white/30' : 'bg-gray-200 dark:bg-gray-700'}`}></div>

          {/* Controls: Language & Theme & Gravity */}
          <div className="flex items-center gap-[clamp(0.15rem,1.2vw,1rem)] shrink-0">
             {/* Language Toggle */}
             <button
               onClick={toggleLanguage}
               className={`editorial-action flex items-center gap-1 rounded-full p-1 md:p-2 ${isHeroNav ? 'text-white hover:bg-white/10' : 'text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10'}`}
               title="Switch Language"
             >
               <Globe size={20} className="md:w-6 md:h-6" />
               <span className="text-base md:text-lg font-bold">{language === 'zh' ? 'EN' : '中'}</span>
             </button>

             {/* Theme Toggle */}
             <button 
               onClick={toggleTheme}
               className={`editorial-action rounded-full p-1 md:p-2 ${isHeroNav ? 'text-white hover:bg-white/10' : 'text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10'}`}
               title="Toggle Theme"
             >
               {theme === 'light' ? <Moon size={20} className="md:w-6 md:h-6" /> : <Sun size={20} className="md:w-6 md:h-6" />}
             </button>
             
             {/* Gravity Bonus Toggle */}
             <button 
               onClick={onTriggerGravity}
               className={`editorial-action hidden rounded-full p-1 min-[430px]:block md:p-2 ${isHeroNav ? 'text-white hover:bg-white/10' : 'text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10'}`}
               title="Boom!"
             >
               <Bomb size={20} className="md:w-6 md:h-6 hover:text-red-500 transition-colors" />
             </button>
          </div>

        </div>
      </nav>
    </div>
  );
};

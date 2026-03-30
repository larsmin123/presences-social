import { useEffect, useState, createContext, useContext } from 'react';
import './App.css';
import { SphereHeader } from './SphereHeader';

// Content from CMS
interface ContentData {
  hero?: { subtitle?: { en?: string; nl?: string } };
  philosophy?: { title?: { en?: string; nl?: string }; subtitle?: { en?: string; nl?: string }; description?: { en?: string; nl?: string } };
  pipeline?: { title?: { en?: string; nl?: string }; subtitle?: { en?: string; nl?: string }; start?: { en?: string; nl?: string }; end?: { en?: string; nl?: string } };
  features?: { title?: { en?: string; nl?: string }; subtitle?: { en?: string; nl?: string }; items?: Array<{ title?: { en?: string; nl?: string }; description?: { en?: string; nl?: string } }> };
  footer?: { tagline?: { en?: string; nl?: string }; contact?: { en?: string; nl?: string }; location?: { en?: string; nl?: string }; locationText?: { en?: string; nl?: string } };
  cookie?: { title?: { en?: string; nl?: string }; message?: { en?: string; nl?: string }; accept?: { en?: string; nl?: string }; more?: { en?: string; nl?: string } };
}

// Language Context
interface Translations {
  [key: string]: string;
}

const defaultTranslations: Record<string, Translations> = {
  en: {
    'hero.subtitle': 'AI-powered social media automation with human oversight at every gate.',
    'philosophy.title': 'Human-in-the-loop.',
    'philosophy.subtitle': 'Every decision gated.',
    'philosophy.desc': 'AI proposes. AI produces. AI flags. But you decide. Every piece of content passes through approval gates. Nothing goes live without your sign-off.',
    'pipeline.title': 'The Pipeline.',
    'pipeline.subtitle': 'From onboarding to optimization. Every step traceable.',
    'pipeline.start': 'Start',
    'pipeline.end': 'End',
    'features.title': 'What you get.',
    'features.subtitle': 'Everything you need to run social at scale.',
    'feature.1.title': 'Brand Kit',
    'feature.1.desc': 'Colors, fonts, tone of voice. Locked in one place.',
    'feature.2.title': 'Content Library',
    'feature.2.desc': 'All your assets, organized and rights-managed.',
    'feature.3.title': 'Format Templates',
    'feature.3.desc': 'Best performing templates personalized to your brand.',
    'feature.4.title': 'AI Drafting',
    'feature.4.desc': 'Copy, media plans, hashtags. Generated in seconds.',
    'feature.5.title': 'Approval Gates',
    'feature.5.desc': 'You approve every format, draft, and post.',
    'feature.6.title': 'Scheduling',
    'feature.6.desc': 'Best-time posting, automated.',
    'feature.7.title': 'Analytics',
    'feature.7.desc': 'Weekly insights that drive better content.',
    'feature.8.title': 'Community',
    'feature.8.desc': 'Moderation with human oversight.',
    'footer.contact': 'Contact',
    'footer.location': 'Location',
    'footer.location.text': 'Worldwide\nbased in Rotterdam, Netherlands',
    'footer.tagline': 'AI-powered social media automation with human oversight at every gate.',
    'footer.terms': 'Terms',
    'footer.privacy': 'Privacy',
    'footer.cookies': 'Cookies',
    'footer.linkedin': 'LinkedIn',
    'footer.instagram': 'Instagram',
    'cookie.title': 'Cookies',
    'cookie.message': 'We use only essential cookies to make this website work. No tracking, no analytics.',
    'cookie.accept': 'Accept',
    'cookie.more': 'Learn more',
  },
  nl: {
    'hero.subtitle': 'AI-gestuurde social media automatisering met menselijke controle bij elke stap.',
    'philosophy.title': 'Mens-in-de-lus.',
    'philosophy.subtitle': 'Elke beslissing gecontroleerd.',
    'philosophy.desc': 'AI stelt voor. AI produceert. AI signaleert. Maar jij beslist. Elk stukje content doorloopt goedkeuringspoorten. Niets gaat live zonder jouw akkoord.',
    'pipeline.title': 'De Pijplijn.',
    'pipeline.subtitle': 'Van onboarding tot optimalisatie. Elke stap traceerbaar.',
    'pipeline.start': 'Start',
    'pipeline.end': 'Einde',
    'features.title': 'Wat je krijgt.',
    'features.subtitle': 'Alles wat je nodig hebt om social op schaal te draaien.',
    'feature.1.title': 'Brand Kit',
    'feature.1.desc': 'Kleuren, fonts, tone of voice. Op één plek vastgelegd.',
    'feature.2.title': 'Content Bibliotheek',
    'feature.2.desc': 'Al je assets, georganiseerd en rechten beheerd.',
    'feature.3.title': 'Format Templates',
    'feature.3.desc': 'Best presterende templates gepersonaliseerd voor jouw merk.',
    'feature.4.title': 'AI Drafting',
    'feature.4.desc': 'Copy, media plannen, hashtags. In seconden gegenereerd.',
    'feature.5.title': 'Goedkeuringspoorten',
    'feature.5.desc': 'Jij keurt elk format, draft en post goed.',
    'feature.6.title': 'Planning',
    'feature.6.desc': 'Best-time posting, geautomatiseerd.',
    'feature.7.title': 'Analytics',
    'feature.7.desc': 'Wekelijkse inzichten die betere content opleveren.',
    'feature.8.title': 'Community',
    'feature.8.desc': 'Moderatie met menselijke controle.',
    'footer.contact': 'Contact',
    'footer.location': 'Locatie',
    'footer.location.text': 'Wereldwijd actief\ngevestigd in Rotterdam, Nederland',
    'footer.tagline': 'AI-gestuurde social media automatisering met menselijke controle bij elke stap.',
    'footer.terms': 'Voorwaarden',
    'footer.privacy': 'Privacy',
    'footer.cookies': 'Cookies',
    'footer.linkedin': 'LinkedIn',
    'footer.instagram': 'Instagram',
    'cookie.title': 'Cookies',
    'cookie.message': 'We gebruiken alleen essentiële cookies om deze website te laten werken. Geen tracking, geen analytics.',
    'cookie.accept': 'Accepteren',
    'cookie.more': 'Meer info',
  }
};

// Content Context
const ContentContext = createContext<{
  content: ContentData;
  loading: boolean;
}>({ content: {}, loading: true });

function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<ContentData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading }}>
      {children}
    </ContentContext.Provider>
  );
}

function useContent() {
  return useContext(ContentContext);
}

const LanguageContext = createContext<{
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
}>({ lang: 'en', setLang: () => {}, t: (key: string) => key });

function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState('en');
  const { content } = useContent();
  
  const t = (key: string) => {
    // First check CMS content
    const parts = key.split('.');
    const langKey = lang as 'en' | 'nl';
    if (parts.length >= 2) {
      const section = parts[0];
      const field = parts[1];
      
      if (section === 'hero' && field === 'subtitle' && content.hero?.subtitle?.[langKey]) {
        return content.hero.subtitle[langKey];
      }
      if (section === 'philosophy') {
        if (field === 'title' && content.philosophy?.title?.[langKey]) return content.philosophy.title[langKey];
        if (field === 'subtitle' && content.philosophy?.subtitle?.[langKey]) return content.philosophy.subtitle[langKey];
        if (field === 'desc' && content.philosophy?.description?.[langKey]) return content.philosophy.description[langKey];
      }
      if (section === 'pipeline') {
        if (field === 'title' && content.pipeline?.title?.[langKey]) return content.pipeline.title[langKey];
        if (field === 'subtitle' && content.pipeline?.subtitle?.[langKey]) return content.pipeline.subtitle[langKey];
        if (field === 'start' && content.pipeline?.start?.[langKey]) return content.pipeline.start[langKey];
        if (field === 'end' && content.pipeline?.end?.[langKey]) return content.pipeline.end[langKey];
      }
      if (section === 'features') {
        if (field === 'title' && content.features?.title?.[langKey]) return content.features.title[langKey];
        if (field === 'subtitle' && content.features?.subtitle?.[langKey]) return content.features.subtitle[langKey];
      }
      if (section === 'feature' && parts.length >= 3) {
        const index = parseInt(parts[1]) - 1;
        const subField = parts[2];
        const item = content.features?.items?.[index];
        if (item) {
          if (subField === 'title' && item.title?.[langKey]) return item.title[langKey];
          if (subField === 'desc' && item.description?.[langKey]) return item.description[langKey];
        }
      }
      if (section === 'footer') {
        if (field === 'tagline' && content.footer?.tagline?.[langKey]) return content.footer.tagline[langKey];
        if (field === 'contact' && content.footer?.contact?.[langKey]) return content.footer.contact[langKey];
        if (field === 'location' && content.footer?.location?.[langKey]) return content.footer.location[langKey];
        if (field === 'location.text' && content.footer?.locationText?.[langKey]) return content.footer.locationText[langKey];
      }
      if (section === 'cookie') {
        if (field === 'title' && content.cookie?.title?.[langKey]) return content.cookie.title[langKey];
        if (field === 'message' && content.cookie?.message?.[langKey]) return content.cookie.message[langKey];
        if (field === 'accept' && content.cookie?.accept?.[langKey]) return content.cookie.accept[langKey];
        if (field === 'more' && content.cookie?.more?.[langKey]) return content.cookie.more[langKey];
      }
    }
    
    // Fallback to default translations
    return defaultTranslations[langKey][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

function useTranslation() {
  return useContext(LanguageContext);
}

// Scroll reveal hook
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

// Language Switcher
function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();
  return (
    <div className="lang-switcher">
      <button 
        className={lang === 'en' ? 'active' : ''} 
        onClick={() => setLang('en')}
      >
        EN
      </button>
      <span className="text-black/20">/</span>
      <button 
        className={lang === 'nl' ? 'active' : ''} 
        onClick={() => setLang('nl')}
      >
        NL
      </button>
    </div>
  );
}

// Cookie Consent Component
function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[400px] z-50 bg-white border border-black/10 p-6 shadow-lg">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-caption font-medium mb-2">{t('cookie.title')}</h3>
          <p className="text-body-small text-black/60">{t('cookie.message')}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-black text-white text-caption hover:bg-black/80 transition-colors"
          >
            {t('cookie.accept')}
          </button>
          <a
            href="/cookies.html"
            className="px-4 py-2 border border-black/20 text-caption text-black/60 hover:border-black hover:text-black transition-colors"
          >
            {t('cookie.more')}
          </a>
        </div>
      </div>
    </div>
  );
}

// Philosophy Section
function Philosophy() {
  const { t } = useTranslation();
  
  return (
    <section className="py-32 px-8 md:px-16 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-2">
            <span className="section-number">02</span>
          </div>

          <div className="col-span-12 md:col-span-10">
            <h2 className="text-headline mb-4 reveal">
              {t('philosophy.title')}
            </h2>
            <p className="text-headline text-black/30 mb-12 reveal">
              {t('philosophy.subtitle')}
            </p>

            <p className="text-body text-black/60 max-w-xl reveal">
              {t('philosophy.desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Pipeline Section - Linear Flow
function Pipeline() {
  const { t, lang } = useTranslation();
  
  const steps = lang === 'en' ? [
    { id: '01', title: 'Onboarding', sub: 'Brand + channels', type: 'normal' },
    { id: '02', title: 'Brand Kit', sub: 'Rules + policies', type: 'normal' },
    { id: '03', title: 'Assets', sub: 'Library + rights', type: 'normal' },
    { id: '04', title: 'Channel Research', sub: 'Patterns per platform', type: 'normal' },
    { id: '05', title: 'Format Proposals', sub: 'Proposing the best performing research based formats', type: 'normal' },
    { id: 'A', title: 'Gate A', sub: 'Approve formats', type: 'gate' },
    { id: '06', title: 'Planning Calendar', sub: 'Cadence + mix', type: 'normal' },
    { id: '07', title: 'Draft Generation', sub: 'Copy + media plan', type: 'normal' },
    { id: '08', title: 'QA Checks', sub: 'Risk score', type: 'normal' },
    { id: 'B', title: 'Gate B', sub: 'Approve drafts', type: 'gate' },
    { id: '09', title: 'Scheduling', sub: 'Best-time posting', type: 'normal' },
    { id: 'C', title: 'Gate C', sub: 'Publish', type: 'gate' },
    { id: '10', title: 'Published', sub: 'Post IDs stored', type: 'normal' },
    { id: '11', title: 'Analytics', sub: 'Daily + per post', type: 'normal' },
    { id: 'E', title: 'Gate E', sub: 'Weekly report', type: 'gate' },
    { id: '12', title: 'Optimization', sub: 'Experiments', type: 'normal' },
  ] : [
    { id: '01', title: 'Onboarding', sub: 'Brand + kanalen', type: 'normal' },
    { id: '02', title: 'Brand Kit', sub: 'Regels + policies', type: 'normal' },
    { id: '03', title: 'Assets', sub: 'Bibliotheek + rechten', type: 'normal' },
    { id: '04', title: 'Kanaal Research', sub: 'Patronen per platform', type: 'normal' },
    { id: '05', title: 'Format Voorstellen', sub: 'Best presterende formats op basis van research', type: 'normal' },
    { id: 'A', title: 'Gate A', sub: 'Formats goedkeuren', type: 'gate' },
    { id: '06', title: 'Planning Kalender', sub: 'Cadence + mix', type: 'normal' },
    { id: '07', title: 'Draft Generatie', sub: 'Copy + media plan', type: 'normal' },
    { id: '08', title: 'QA Checks', sub: 'Risk score', type: 'normal' },
    { id: 'B', title: 'Gate B', sub: 'Drafts goedkeuren', type: 'gate' },
    { id: '09', title: 'Planning', sub: 'Best-time posting', type: 'normal' },
    { id: 'C', title: 'Gate C', sub: 'Publiceren', type: 'gate' },
    { id: '10', title: 'Gepubliceerd', sub: 'Post IDs opgeslagen', type: 'normal' },
    { id: '11', title: 'Analytics', sub: 'Dagelijks + per post', type: 'normal' },
    { id: 'E', title: 'Gate E', sub: 'Wekelijks rapport', type: 'gate' },
    { id: '12', title: 'Optimalisatie', sub: 'Experimenten', type: 'normal' },
  ];

  return (
    <section className="py-32 px-4 md:px-8 lg:px-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-8 mb-16">
          <div className="col-span-12 md:col-span-2">
            <span className="section-number">03</span>
          </div>
          <div className="col-span-12 md:col-span-10">
            <h2 className="text-headline reveal">{t('pipeline.title')}</h2>
            <p className="text-body text-black/50 mt-4 reveal">{t('pipeline.subtitle')}</p>
          </div>
        </div>

        <div className="reveal">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-3 h-3 bg-black"></div>
            <span className="text-caption text-black/40">{t('pipeline.start')}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-3">
            {steps.slice(0, 6).map((step, i) => (
              <div 
                key={i} 
                className={`pipeline-box ${step.type === 'gate' ? 'gate' : ''}`}
              >
                <div className={`text-mono text-xs mb-2 ${step.type === 'gate' ? 'text-white/50' : 'text-black/40'}`}>
                  {step.id}
                </div>
                <div className="text-title leading-tight">{step.title}</div>
                <div className={`text-caption mt-2 ${step.type === 'gate' ? 'text-white/50' : 'text-black/40'}`}>
                  {step.sub}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-start pl-[16%] mb-3">
            <div className="flex flex-col items-center">
              <div className="w-px h-6 bg-black/20"></div>
              <span className="text-black/30 text-lg">↓</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-3">
            {steps.slice(6, 12).map((step, i) => (
              <div 
                key={i} 
                className={`pipeline-box ${step.type === 'gate' ? 'gate' : ''}`}
              >
                <div className={`text-mono text-xs mb-2 ${step.type === 'gate' ? 'text-white/50' : 'text-black/40'}`}>
                  {step.id}
                </div>
                <div className="text-title leading-tight">{step.title}</div>
                <div className={`text-caption mt-2 ${step.type === 'gate' ? 'text-white/50' : 'text-black/40'}`}>
                  {step.sub}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-start pl-[16%] mb-3">
            <div className="flex flex-col items-center">
              <div className="w-px h-6 bg-black/20"></div>
              <span className="text-black/30 text-lg">↓</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {steps.slice(12, 16).map((step, i) => (
              <div 
                key={i} 
                className={`pipeline-box ${step.type === 'gate' ? 'gate' : ''}`}
              >
                <div className={`text-mono text-xs mb-2 ${step.type === 'gate' ? 'text-white/50' : 'text-black/40'}`}>
                  {step.id}
                </div>
                <div className="text-title leading-tight">{step.title}</div>
                <div className={`text-caption mt-2 ${step.type === 'gate' ? 'text-white/50' : 'text-black/40'}`}>
                  {step.sub}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-black/10">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <div className="pipeline-box">
                <div className="text-mono text-xs mb-2 text-black/40">13</div>
                <div className="text-title leading-tight">Community</div>
                <div className="text-caption mt-2 text-black/40">Comments + DMs</div>
              </div>
              <div className="pipeline-box gate">
                <div className="text-mono text-xs mb-2 text-white/50">D</div>
                <div className="text-title leading-tight">Gate D</div>
                <div className="text-caption mt-2 text-white/50">Approve actions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Section
function Features() {
  const { t, lang } = useTranslation();
  
  const features = lang === 'en' ? [
    { title: 'Brand Kit', desc: 'Colors, fonts, tone of voice. Locked in one place.' },
    { title: 'Content Library', desc: 'All your assets, organized and rights-managed.' },
    { title: 'Format Templates', desc: 'Best performing templates personalized to your brand.' },
    { title: 'AI Drafting', desc: 'Copy, media plans, hashtags. Generated in seconds.' },
    { title: 'Approval Gates', desc: 'You approve every format, draft, and post.' },
    { title: 'Scheduling', desc: 'Best-time posting, automated.' },
    { title: 'Analytics', desc: 'Weekly insights that drive better content.' },
    { title: 'Community', desc: 'Moderation with human oversight.' },
  ] : [
    { title: 'Brand Kit', desc: 'Kleuren, fonts, tone of voice. Op één plek vastgelegd.' },
    { title: 'Content Bibliotheek', desc: 'Al je assets, georganiseerd en rechten-beheerd.' },
    { title: 'Format Templates', desc: 'Best presterende templates gepersonaliseerd voor jouw merk.' },
    { title: 'AI Drafting', desc: 'Copy, media plannen, hashtags. In seconden gegenereerd.' },
    { title: 'Goedkeuringspoorten', desc: 'Jij keurt elk format, draft en post goed.' },
    { title: 'Planning', desc: 'Best-time posting, geautomatiseerd.' },
    { title: 'Analytics', desc: 'Wekelijkse inzichten die betere content opleveren.' },
    { title: 'Community', desc: 'Moderatie met menselijke controle.' },
  ];

  return (
    <section className="py-32 px-8 md:px-16 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-12 gap-8 mb-16">
          <div className="col-span-12 md:col-span-2">
            <span className="section-number">04</span>
          </div>
          <div className="col-span-12 md:col-span-10">
            <h2 className="text-headline reveal">{t('features.title')}</h2>
            <p className="text-body text-black/50 mt-4 reveal">{t('features.subtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {features.map((feature, i) => (
            <div key={i} className="reveal">
              <h3 className="text-title mb-2">{feature.title}</h3>
              <p className="text-body text-black/50">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer Section
function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="py-24 px-8 md:px-16 lg:px-24 border-t border-black/10">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-6">
            <h2 className="text-headline mb-8">
              presences.social
            </h2>
            <p className="text-body text-black/50 max-w-sm">
              {t('footer.tagline')}
            </p>
          </div>
          
          <div className="col-span-12 md:col-span-6">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="text-caption text-black/40 block mb-4">{t('footer.contact')}</span>
                <a href="mailto:hello@presences.social" className="text-body text-black hover:text-black/60 transition-colors">
                  hello@presences.social
                </a>
              </div>
              <div>
                <span className="text-caption text-black/40 block mb-4">{t('footer.location')}</span>
                <span className="text-body text-black/60 whitespace-pre-line">
                  {t('footer.location.text')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <span className="text-mono text-black/30">© 2026 presences.social</span>
          <div className="flex gap-8">
            <a href="/terms.html" className="text-caption text-black/40 hover:text-black transition-colors">{t('footer.terms')}</a>
            <a href="/privacy.html" className="text-caption text-black/40 hover:text-black transition-colors">{t('footer.privacy')}</a>
            <a href="/cookies.html" className="text-caption text-black/40 hover:text-black transition-colors">{t('footer.cookies')}</a>
            <a href="https://www.linkedin.com/company/presences-social/" target="_blank" rel="noopener noreferrer" className="text-caption text-black/40 hover:text-black transition-colors">{t('footer.linkedin')}</a>
            <a href="https://www.instagram.com/presences.social/" target="_blank" rel="noopener noreferrer" className="text-caption text-black/40 hover:text-black transition-colors">{t('footer.instagram')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main App
function App() {
  useScrollReveal();

  return (
    <ContentProvider>
      <LanguageProvider>
        <div className="bg-white min-h-screen">
          <AppContent />
        </div>
      </LanguageProvider>
    </ContentProvider>
  );
}

function AppContent() {
  const { t } = useTranslation();
  return (
    <>
      <div className="fixed top-8 right-8 z-50">
        <LanguageSwitcher />
      </div>
      <SphereHeader subtitle={t('hero.subtitle')} />
      <Philosophy />
      <Pipeline />
      <Features />
      <Footer />
      <CookieConsent />
    </>
  );
}

export default App;

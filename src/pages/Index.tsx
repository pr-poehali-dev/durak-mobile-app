import { useState } from 'react';
import Icon from '@/components/ui/icon';

const BG = 'https://cdn.poehali.dev/projects/5566614e-5100-4099-8a5c-1c35ad0e3eac/files/20b038a5-a031-4d7c-8e00-5b473bb85f14.jpg';

type Tab = 'home' | 'rating' | 'shop' | 'profile' | 'settings';

const SUITS = ['♠', '♥', '♦', '♣'];

const NAV: { id: Tab; icon: string; label: string }[] = [
  { id: 'home', icon: 'Home', label: 'Играть' },
  { id: 'rating', icon: 'Trophy', label: 'Рейтинг' },
  { id: 'shop', icon: 'ShoppingBag', label: 'Магазин' },
  { id: 'profile', icon: 'User', label: 'Профиль' },
  { id: 'settings', icon: 'Settings', label: 'Ещё' },
];

const PlayingCard = ({ suit, rank, delay = 0, className = '' }: { suit: string; rank: string; delay?: number; className?: string }) => {
  const red = suit === '♥' || suit === '♦';
  return (
    <div
      className={`animate-deal flex h-24 w-16 flex-col justify-between rounded-xl bg-[#faf6ea] p-1.5 shadow-2xl ring-1 ring-black/10 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className={`font-display text-lg font-bold leading-none ${red ? 'text-accent' : 'text-[#1a1a1a]'}`}>{rank}<br />{suit}</span>
      <span className={`self-end font-display text-lg font-bold leading-none ${red ? 'text-accent' : 'text-[#1a1a1a]'}`}>{suit}<br />{rank}</span>
    </div>
  );
};

const Home = () => (
  <div className="animate-fade-in space-y-6">
    <div className="relative flex h-52 items-center justify-center">
      <div className="animate-float" style={{ ['--r' as string]: '-14deg' }}>
        <PlayingCard suit="♠" rank="A" delay={0} className="rotate-[-14deg] translate-x-6" />
      </div>
      <div className="animate-float -mx-4 z-10" style={{ ['--r' as string]: '0deg', animationDelay: '0.4s' }}>
        <PlayingCard suit="♥" rank="K" delay={120} className="scale-125" />
      </div>
      <div className="animate-float" style={{ ['--r' as string]: '14deg', animationDelay: '0.8s' }}>
        <PlayingCard suit="♦" rank="Q" delay={240} className="rotate-[14deg] -translate-x-6" />
      </div>
    </div>

    <div className="text-center">
      <h1 className="font-display text-5xl font-bold uppercase tracking-tight text-glow text-gold">Дурак</h1>
      <p className="mt-1 font-display text-lg uppercase tracking-[0.35em] text-foreground/70">Онлайн</p>
    </div>

    <div className="space-y-3">
      <button className="group relative w-full overflow-hidden rounded-2xl gold-gradient py-5 glow-gold hover-lift">
        <div className="flex items-center justify-center gap-3">
          <Icon name="Swords" className="text-primary-foreground" size={26} />
          <span className="font-display text-2xl font-bold uppercase tracking-wide text-primary-foreground">Быстрая игра</span>
        </div>
        <span className="mt-0.5 block text-sm font-medium text-primary-foreground/70">Найти соперника онлайн</span>
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button className="glass rounded-2xl py-5 hover-lift">
          <Icon name="Users" className="mx-auto mb-2 text-gold" size={26} />
          <span className="font-display text-base font-semibold uppercase tracking-wide">Играть с другом</span>
        </button>
        <button className="glass rounded-2xl py-5 hover-lift">
          <Icon name="Crown" className="mx-auto mb-2 text-gold" size={26} />
          <span className="font-display text-base font-semibold uppercase tracking-wide">Турниры</span>
        </button>
      </div>
    </div>

    <div className="glass flex items-center justify-between rounded-2xl px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
        </span>
        <span className="text-sm font-medium text-foreground/80">Сейчас онлайн</span>
      </div>
      <span className="font-display text-xl font-bold text-gold">12 480</span>
    </div>
  </div>
);

const RATING = [
  { name: 'Валет Козырной', pts: 24850, medal: '🥇' },
  { name: 'Дама Пик', pts: 21340, medal: '🥈' },
  { name: 'Король Червей', pts: 19870, medal: '🥉' },
  { name: 'Туз в Рукаве', pts: 17200, medal: '4' },
  { name: 'Шестёрка', pts: 15640, medal: '5' },
  { name: 'Тимофей', pts: 14200, medal: '6' },
];

const Rating = () => (
  <div className="animate-fade-in space-y-4">
    <h2 className="font-display text-3xl font-bold uppercase text-gold">Рейтинг</h2>
    <div className="glass flex justify-center gap-2 rounded-2xl p-1">
      {['За неделю', 'За месяц', 'Всё время'].map((t, i) => (
        <button key={t} className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${i === 0 ? 'gold-gradient text-primary-foreground' : 'text-foreground/60'}`}>{t}</button>
      ))}
    </div>
    <div className="space-y-2">
      {RATING.map((p, i) => (
        <div key={p.name} className={`flex items-center gap-4 rounded-2xl px-4 py-3 hover-lift ${i < 3 ? 'glass glow-gold' : 'glass'}`}>
          <span className="w-8 text-center font-display text-xl font-bold">{p.medal}</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-full gold-gradient font-display font-bold text-primary-foreground">{p.name[0]}</div>
          <span className="flex-1 font-semibold">{p.name}</span>
          <span className="font-display text-lg font-bold text-gold">{p.pts.toLocaleString('ru')}</span>
        </div>
      ))}
    </div>
  </div>
);

const DECKS = [
  { name: 'Классика', suit: '♠', price: 'Бесплатно', owned: true, grad: 'from-slate-600 to-slate-800' },
  { name: 'Золото', suit: '♦', price: '450 ₽', owned: false, grad: 'from-yellow-500 to-amber-700' },
  { name: 'Неон', suit: '♥', price: '390 ₽', owned: false, grad: 'from-fuchsia-500 to-purple-700' },
  { name: 'Ретро', suit: '♣', price: '290 ₽', owned: false, grad: 'from-emerald-500 to-teal-700' },
];

const Shop = () => (
  <div className="animate-fade-in space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="font-display text-3xl font-bold uppercase text-gold">Магазин колод</h2>
      <div className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5">
        <span className="text-gold">🪙</span>
        <span className="font-display font-bold">1 250</span>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {DECKS.map((d, i) => (
        <div key={d.name} className="glass overflow-hidden rounded-2xl hover-lift animate-scale-in" style={{ animationDelay: `${i * 80}ms` }}>
          <div className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${d.grad}`}>
            <span className="font-display text-6xl text-white/90 drop-shadow-lg">{d.suit}</span>
            <span className="absolute -right-3 bottom-2 font-display text-6xl text-white/20">{d.suit}</span>
          </div>
          <div className="p-3">
            <p className="font-display text-lg font-semibold uppercase">{d.name}</p>
            <button className={`mt-2 w-full rounded-xl py-2 text-sm font-bold ${d.owned ? 'bg-secondary text-foreground/60' : 'gold-gradient text-primary-foreground'}`}>
              {d.owned ? 'Выбрана' : d.price}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Profile = () => (
  <div className="animate-fade-in space-y-5">
    <div className="glass relative overflow-hidden rounded-3xl p-6 text-center glow-gold">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full gold-gradient font-display text-4xl font-bold text-primary-foreground">Т</div>
      <h2 className="mt-3 font-display text-2xl font-bold uppercase">Тимофей</h2>
      <p className="text-sm text-foreground/60">Мастер козырей · 6 место</p>
    </div>
    <div className="grid grid-cols-3 gap-3">
      {[
        { icon: 'Gamepad2', val: '342', label: 'Игр' },
        { icon: 'Award', val: '218', label: 'Побед' },
        { icon: 'Percent', val: '64%', label: 'Винрейт' },
      ].map((s) => (
        <div key={s.label} className="glass rounded-2xl py-4 text-center hover-lift">
          <Icon name={s.icon} className="mx-auto mb-1 text-gold" size={22} />
          <p className="font-display text-2xl font-bold">{s.val}</p>
          <p className="text-xs text-foreground/60">{s.label}</p>
        </div>
      ))}
    </div>
    <div className="glass rounded-2xl p-4">
      <p className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-foreground/70">Достижения</p>
      <div className="flex gap-3 text-3xl">
        {['🏆', '🔥', '👑', '💎', '⭐'].map((e, i) => (
          <span key={i} className="animate-float" style={{ animationDelay: `${i * 0.2}s` }}>{e}</span>
        ))}
      </div>
    </div>
  </div>
);

const Settings = () => {
  const [sound, setSound] = useState(true);
  const [music, setMusic] = useState(true);
  const [vibro, setVibro] = useState(false);
  const rows: [string, string, boolean, (v: boolean) => void][] = [
    ['Volume2', 'Звуки игры', sound, setSound],
    ['Music', 'Музыка', music, setMusic],
    ['Vibrate', 'Вибрация', vibro, setVibro],
  ];
  return (
    <div className="animate-fade-in space-y-4">
      <h2 className="font-display text-3xl font-bold uppercase text-gold">Настройки</h2>
      <div className="glass divide-y divide-border rounded-2xl">
        {rows.map(([icon, label, on, set]) => (
          <div key={label} className="flex items-center gap-3 px-5 py-4">
            <Icon name={icon} className="text-gold" size={20} />
            <span className="flex-1 font-medium">{label}</span>
            <button onClick={() => set(!on)} className={`relative h-7 w-12 rounded-full transition ${on ? 'gold-gradient' : 'bg-secondary'}`}>
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${on ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        ))}
      </div>
      <div className="glass divide-y divide-border rounded-2xl">
        {[['Bell', 'Уведомления'], ['Globe', 'Язык · Русский'], ['ShieldQuestion', 'Помощь'], ['Info', 'О приложении']].map(([icon, label]) => (
          <button key={label} className="flex w-full items-center gap-3 px-5 py-4 text-left">
            <Icon name={icon} className="text-gold" size={20} />
            <span className="flex-1 font-medium">{label}</span>
            <Icon name="ChevronRight" className="text-foreground/40" size={18} />
          </button>
        ))}
      </div>
    </div>
  );
};

const Index = () => {
  const [tab, setTab] = useState<Tab>('home');
  return (
    <div className="min-h-screen w-full bg-felt">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col">
        <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: `url(${BG})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />

        <header className="relative flex items-center justify-between px-5 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gold-gradient font-display text-xl font-bold text-primary-foreground">Д</div>
            <span className="font-display text-lg font-bold uppercase tracking-wide">Дурак</span>
          </div>
          <div className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5">
            <span>🪙</span>
            <span className="font-display font-bold">1 250</span>
          </div>
        </header>

        <main className="relative flex-1 px-5 py-4 pb-28">
          {tab === 'home' && <Home />}
          {tab === 'rating' && <Rating />}
          {tab === 'shop' && <Shop />}
          {tab === 'profile' && <Profile />}
          {tab === 'settings' && <Settings />}
        </main>

        <nav className="fixed bottom-4 left-1/2 z-20 w-[calc(100%-2rem)] max-w-[27rem] -translate-x-1/2">
          <div className="glass flex items-center justify-around rounded-2xl px-2 py-2 shadow-2xl">
            {NAV.map((n) => {
              const active = tab === n.id;
              return (
                <button key={n.id} onClick={() => setTab(n.id)} className="flex flex-1 flex-col items-center gap-1 py-1">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${active ? 'gold-gradient glow-gold' : ''}`}>
                    <Icon name={n.icon} size={20} className={active ? 'text-primary-foreground' : 'text-foreground/50'} />
                  </div>
                  <span className={`text-[10px] font-semibold ${active ? 'text-gold' : 'text-foreground/40'}`}>{n.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Index;

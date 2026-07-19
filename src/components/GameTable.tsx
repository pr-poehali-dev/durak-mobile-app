import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { Card, Suit, buildDeck, isRed, beats, canDefend, rankValue } from '@/lib/durak';

const BG = 'https://cdn.poehali.dev/projects/5566614e-5100-4099-8a5c-1c35ad0e3eac/files/20b038a5-a031-4d7c-8e00-5b473bb85f14.jpg';

export type Difficulty = 'easy' | 'medium' | 'hard';

const DIFF_META: Record<Difficulty, { label: string; icon: string; mistake: number; think: number }> = {
  easy: { label: 'Лёгкий', icon: 'Smile', mistake: 0.45, think: 450 },
  medium: { label: 'Средний', icon: 'Brain', mistake: 0.12, think: 750 },
  hard: { label: 'Сложный', icon: 'Skull', mistake: 0, think: 1000 },
};

const PIP_LAYOUT: Record<string, [number, number, boolean][]> = {
  '6': [
    [25, 18, false], [75, 18, false],
    [25, 50, false], [75, 50, false],
    [25, 82, true], [75, 82, true],
  ],
  '7': [
    [25, 15, false], [75, 15, false],
    [50, 32, false],
    [25, 50, false], [75, 50, false],
    [25, 85, true], [75, 85, true],
  ],
  '8': [
    [25, 13, false], [75, 13, false],
    [50, 30, false],
    [25, 50, false], [75, 50, false],
    [50, 70, true],
    [25, 87, true], [75, 87, true],
  ],
  '9': [
    [25, 12, false], [75, 12, false],
    [25, 37, false], [75, 37, false],
    [50, 50, false],
    [25, 63, true], [75, 63, true],
    [25, 88, true], [75, 88, true],
  ],
  '10': [
    [25, 11, false], [75, 11, false],
    [50, 24, false],
    [25, 38, false], [75, 38, false],
    [25, 62, true], [75, 62, true],
    [50, 76, true],
    [25, 89, true], [75, 89, true],
  ],
};

const FACE_META: Record<string, { icon: string; label: string }> = {
  'В': { icon: 'Sword', label: 'Валет' },
  'Д': { icon: 'Gem', label: 'Дама' },
  'К': { icon: 'Crown', label: 'Король' },
};

const CardFace = ({ card, small, onClick, active, dim }: { card: Card; small?: boolean; onClick?: () => void; active?: boolean; dim?: boolean }) => {
  const red = isRed(card.suit);
  const ink = red ? 'text-accent' : 'text-[#1a1a1a]';
  const size = small ? 'h-32 w-[5.5rem]' : 'h-48 w-32';
  const corner = small ? 'text-base' : 'text-2xl';
  const pip = small ? 'text-4xl' : 'text-7xl';
  const smallPip = small ? 'text-lg' : 'text-3xl';
  const layout = PIP_LAYOUT[card.rank];
  const face = FACE_META[card.rank];

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`animate-deal relative rounded-2xl bg-[#faf6ea] shadow-xl ring-1 ring-black/10 transition-transform ${size} ${active ? 'ring-2 ring-[hsl(43_74%_52%)] -translate-y-3 glow-gold' : ''} ${onClick ? 'hover:-translate-y-2 cursor-pointer' : ''} ${dim ? 'opacity-40' : ''}`}
    >
      <div className={`absolute left-2 top-2 flex flex-col items-center leading-none font-display font-bold ${corner} ${ink}`}>
        <span>{card.rank}</span>
        <span>{card.suit}</span>
      </div>

      {layout ? (
        <div className="pointer-events-none absolute inset-0">
          {layout.map(([x, y, flip], i) => (
            <span
              key={i}
              className={`absolute font-display ${smallPip} ${ink} ${flip ? 'rotate-180' : ''}`}
              style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) ${flip ? 'rotate(180deg)' : ''}` }}
            >
              {card.suit}
            </span>
          ))}
        </div>
      ) : face ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1">
          <Icon name={face.icon} size={small ? 34 : 56} className={ink} strokeWidth={2} />
          <span className={`font-display font-bold ${ink} ${small ? 'text-[10px]' : 'text-xs'} tracking-wide opacity-70`}>{face.label}</span>
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className={`font-display ${pip} ${ink} opacity-85`}>{card.suit}</span>
        </div>
      )}

      <div className={`absolute bottom-2 right-2 flex rotate-180 flex-col items-center leading-none font-display font-bold ${corner} ${ink}`}>
        <span>{card.rank}</span>
        <span>{card.suit}</span>
      </div>
    </button>
  );
};

const CardBack = ({ small }: { small?: boolean }) => (
  <div className={`relative flex flex-col items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-b from-[hsl(158_42%_20%)] to-[hsl(158_55%_8%)] shadow-xl ring-2 ring-gold/40 ${small ? 'h-32 w-[5.5rem] py-3' : 'h-48 w-32 py-5'}`}>
    <div className="pointer-events-none absolute inset-1.5 rounded-xl border border-gold/25" />
    <div
      className="pointer-events-none absolute inset-1.5 rounded-xl opacity-30"
      style={{
        backgroundImage:
          'repeating-linear-gradient(45deg, hsla(43,74%,52%,0.5) 0, hsla(43,74%,52%,0.5) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-45deg, hsla(43,74%,52%,0.5) 0, hsla(43,74%,52%,0.5) 1px, transparent 1px, transparent 10px)',
      }}
    />
    <Icon name="Crown" size={small ? 16 : 24} className="relative text-gold/85" />
    <span className={`relative font-display font-bold text-gold/55 ${small ? 'text-base' : 'text-2xl'}`}>Д</span>
    <span className={`relative block rounded-full bg-gold/15 ${small ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />
  </div>
);

const deal = (deck: Card[], hand: Card[], n: number) => {
  const need = Math.max(0, n - hand.length);
  const drawn = deck.slice(0, need);
  return { deck: deck.slice(need), hand: [...hand, ...drawn] };
};

const GameTable = ({ onExit, difficulty = 'medium' }: { onExit: () => void; difficulty?: Difficulty }) => {
  const diff = DIFF_META[difficulty];
  const init = useMemo(() => {
    const full = buildDeck();
    const trumpCard = full[full.length - 1];
    const trump = trumpCard.suit as Suit;
    let deck = full;
    let me: Card[] = [];
    let opp: Card[] = [];
    ({ deck, hand: me } = deal(deck, me, 6));
    ({ deck, hand: opp } = deal(deck, opp, 6));
    return { deck, me, opp, trump, trumpCard };
  }, []);

  const [deck, setDeck] = useState<Card[]>(init.deck);
  const [me, setMe] = useState<Card[]>(init.me);
  const [opp, setOpp] = useState<Card[]>(init.opp);
  const [table, setTable] = useState<{ attack: Card; defend?: Card }[]>([]);
  const [msg, setMsg] = useState('Ваш ход — выберите карту для атаки');
  const [myTurn, setMyTurn] = useState(true);
  const trump = init.trump;
  const trumpCard = init.trumpCard;

  const sortHand = (h: Card[]) =>
    [...h].sort((a, b) => (a.suit === trump ? 1 : 0) - (b.suit === trump ? 1 : 0) || rankValue(a.rank) - rankValue(b.rank));

  const tableRanks = table.flatMap((p) => [p.attack.rank, p.defend?.rank]).filter(Boolean);
  const undefended = table.find((p) => !p.defend);

  const refill = (d: Card[], mine: Card[], theirs: Card[]) => {
    let nd = d;
    let m = mine;
    let o = theirs;
    ({ deck: nd, hand: m } = deal(nd, m, 6));
    ({ deck: nd, hand: o } = deal(nd, o, 6));
    return { nd, m, o };
  };

  const oppTurn = (curDeck: Card[], curMe: Card[], curOpp: Card[]) => {
    setTimeout(() => {
      const sorted = [...curOpp].sort((a, b) => (a.suit === trump ? 1 : 0) - (b.suit === trump ? 1 : 0) || rankValue(a.rank) - rankValue(b.rank));
      const attack = sorted[0];
      setTable([{ attack }]);
      setOpp(curOpp.filter((c) => c.id !== attack.id));
      setMyTurn(true);
      setMsg('Соперник атакует — отбейтесь или возьмите');
    }, diff.think);
  };

  const playAttack = (card: Card) => {
    if (!myTurn || undefended) return;
    const newMe = me.filter((c) => c.id !== card.id);
    setMe(newMe);
    setTable([...table, { attack: card }]);
    setMsg('Соперник отбивается...');
    setMyTurn(false);
    setTimeout(() => {
      const realDef = canDefend(card, opp, trump);
      const missPlay = realDef && Math.random() < diff.mistake;
      const def = missPlay ? undefined : realDef;
      if (def) {
        setOpp((o) => o.filter((c) => c.id !== def.id));
        setTable((t) => t.map((p) => (p.attack.id === card.id ? { ...p, defend: def } : p)));
        setMsg('Отбито! Подкиньте ещё или завершите ход');
        setMyTurn(true);
      } else {
        const taken = [card];
        const nOpp = [...opp, ...taken];
        setTable([]);
        const { nd, m, o } = refill(deck, newMe, nOpp);
        setDeck(nd);
        setMe(m);
        setOpp(o);
        setMsg('Соперник забрал карты! Ваш ход');
        setMyTurn(true);
      }
    }, diff.think);
  };

  const defend = (card: Card) => {
    if (!undefended || !myTurn) return;
    if (!beats(undefended.attack, card, trump)) {
      setMsg('Этой картой не побить!');
      return;
    }
    const newMe = me.filter((c) => c.id !== card.id);
    setMe(newMe);
    setTable(table.map((p) => (p === undefended ? { ...p, defend: card } : p)));
    setMsg('Отбито! Ход соперника');
    setMyTurn(false);
    setTimeout(() => {
      const { nd, m, o } = refill(deck, newMe, opp);
      setDeck(nd);
      setMe(m);
      setTable([]);
      oppTurn(nd, m, o);
    }, 700);
  };

  const takeCards = () => {
    if (!undefended) return;
    const taken = table.flatMap((p) => [p.attack, p.defend]).filter(Boolean) as Card[];
    const nMe = [...me, ...taken];
    setTable([]);
    const { nd, m, o } = refill(deck, nMe, opp);
    setDeck(nd);
    setMe(m);
    setOpp(o);
    setMsg('Вы взяли карты. Ход соперника');
    setMyTurn(false);
    setTimeout(() => oppTurn(nd, m, o), 300);
  };

  const endTurn = () => {
    setTable([]);
    setMsg('Ход соперника...');
    setMyTurn(false);
    setTimeout(() => oppTurn(deck, me, opp), 300);
  };

  const win = me.length === 0 && deck.length === 0;
  const lose = opp.length === 0 && deck.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-felt">
      <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: `url(${BG})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />

      <div className="relative flex items-center justify-between px-5 pt-6 pb-2">
        <button onClick={onExit} className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5">
          <Icon name="ChevronLeft" size={18} />
          <span className="text-sm font-medium">Выход</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-foreground/80">
            <Icon name={diff.icon} size={14} className="text-gold" />
            {diff.label}
          </div>
          <div className="glass rounded-full px-4 py-1.5 text-sm font-medium">
            Козырь: <span className="text-gold font-bold">{trump}</span>
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-between overflow-x-auto px-3 py-3">
        <div className="flex flex-col items-center gap-2">
          <div className="glass flex items-center gap-2 rounded-full px-4 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full gold-gradient text-xs font-bold text-primary-foreground">С</div>
            <span className="text-sm font-semibold">Соперник</span>
            <span className={`ml-1 h-2 w-2 rounded-full ${!myTurn ? 'bg-green-400 animate-pulse' : 'bg-foreground/30'}`} />
          </div>
          <div className="flex -space-x-12">
            {opp.map((c) => <CardBack key={c.id} small />)}
          </div>
        </div>

        <div className="flex flex-1 items-center gap-3">
          {deck.length > 0 && (
            <div className="flex shrink-0 items-center">
              <div className="relative h-32 w-48 shrink-0 drop-shadow-[0_0_16px_hsla(43,74%,52%,0.5)]">
                <div className="absolute inset-0 flex items-center justify-center rotate-90">
                  <CardFace card={trumpCard} />
                </div>
              </div>
              <div className="relative -ml-[3.6rem] z-10">
                <div className="absolute left-1.5 top-1.5"><CardBack /></div>
                <div className="relative"><CardBack /></div>
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-sm font-bold text-gold">{deck.length} карт</span>
              </div>
            </div>
          )}
          <div className="flex min-h-[9rem] flex-1 flex-wrap items-center justify-center gap-2">
            {table.map((p, i) => (
              <div key={i} className="relative">
                <CardFace card={p.attack} />
                {p.defend && (
                  <div className="absolute left-5 top-6 rotate-12">
                    <CardFace card={p.defend} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="glass rounded-full px-4 py-1.5 text-center text-sm font-medium text-foreground/90">{msg}</div>

          {myTurn && (
            <div className="flex gap-2">
              {undefended ? (
                <button onClick={takeCards} className="rounded-full bg-accent px-6 py-2 text-sm font-bold text-accent-foreground hover-scale">Взять</button>
              ) : table.length > 0 ? (
                <button onClick={endTurn} className="rounded-full gold-gradient px-6 py-2 text-sm font-bold text-primary-foreground hover-scale">Бито</button>
              ) : null}
            </div>
          )}

          <div className="flex max-w-full items-end overflow-x-auto px-2 pb-1 [&>*]:-ml-10 [&>*:first-child]:ml-0">
            {sortHand(me).map((c) => {
              const playable = myTurn && (undefended ? beats(undefended.attack, c, trump) : !undefended && (table.length === 0 || tableRanks.includes(c.rank)));
              return (
                <CardFace
                  key={c.id}
                  card={c}
                  onClick={playable ? () => (undefended ? defend(c) : playAttack(c)) : undefined}
                  dim={myTurn && !playable}
                />
              );
            })}
          </div>
        </div>
      </div>

      {(win || lose) && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          <span className="text-7xl">{win ? '🏆' : '😅'}</span>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase text-gold text-glow">{win ? 'Победа!' : 'Вы дурак'}</h2>
          <button onClick={onExit} className="mt-6 rounded-full gold-gradient px-8 py-3 font-display font-bold uppercase text-primary-foreground hover-scale">В меню</button>
        </div>
      )}
    </div>
  );
};

export default GameTable;
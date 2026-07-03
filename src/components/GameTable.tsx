import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { Card, Suit, buildDeck, isRed, beats, canDefend, rankValue } from '@/lib/durak';

const BG = 'https://cdn.poehali.dev/projects/5566614e-5100-4099-8a5c-1c35ad0e3eac/files/20b038a5-a031-4d7c-8e00-5b473bb85f14.jpg';

const CardFace = ({ card, small, onClick, active, dim }: { card: Card; small?: boolean; onClick?: () => void; active?: boolean; dim?: boolean }) => {
  const red = isRed(card.suit);
  const size = small ? 'h-16 w-11 text-sm' : 'h-24 w-16 text-lg';
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`animate-deal relative flex flex-col justify-between rounded-xl bg-[#faf6ea] p-1.5 shadow-xl ring-1 ring-black/10 transition-transform ${size} ${active ? 'ring-2 ring-[hsl(43_74%_52%)] -translate-y-3 glow-gold' : ''} ${onClick ? 'hover:-translate-y-2 cursor-pointer' : ''} ${dim ? 'opacity-40' : ''}`}
    >
      <span className={`font-display font-bold leading-none ${red ? 'text-accent' : 'text-[#1a1a1a]'}`}>{card.rank}<br />{card.suit}</span>
      <span className={`self-end font-display font-bold leading-none ${red ? 'text-accent' : 'text-[#1a1a1a]'}`}>{card.suit}<br />{card.rank}</span>
    </button>
  );
};

const CardBack = ({ small }: { small?: boolean }) => (
  <div className={`rounded-xl bg-gradient-to-br from-[hsl(158_40%_20%)] to-[hsl(158_50%_10%)] shadow-xl ring-1 ring-[hsl(43_74%_52%)]/30 ${small ? 'h-16 w-11' : 'h-24 w-16'} flex items-center justify-center`}>
    <span className="font-display text-2xl text-gold/50">Д</span>
  </div>
);

const deal = (deck: Card[], hand: Card[], n: number) => {
  const need = Math.max(0, n - hand.length);
  const drawn = deck.slice(0, need);
  return { deck: deck.slice(need), hand: [...hand, ...drawn] };
};

const GameTable = ({ onExit }: { onExit: () => void }) => {
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
    }, 700);
  };

  const playAttack = (card: Card) => {
    if (!myTurn || undefended) return;
    const newMe = me.filter((c) => c.id !== card.id);
    setMe(newMe);
    setTable([...table, { attack: card }]);
    setMsg('Соперник отбивается...');
    setMyTurn(false);
    setTimeout(() => {
      const def = canDefend(card, opp, trump);
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
    }, 800);
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
        <div className="glass rounded-full px-4 py-1.5 text-sm font-medium">
          Козырь: <span className="text-gold font-bold">{trump}</span>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-between px-4 py-3">
        <div className="flex flex-col items-center gap-2">
          <div className="glass flex items-center gap-2 rounded-full px-4 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full gold-gradient text-xs font-bold text-primary-foreground">С</div>
            <span className="text-sm font-semibold">Соперник</span>
            <span className={`ml-1 h-2 w-2 rounded-full ${!myTurn ? 'bg-green-400 animate-pulse' : 'bg-foreground/30'}`} />
          </div>
          <div className="flex -space-x-6">
            {opp.map((c) => <CardBack key={c.id} small />)}
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <div className="relative flex items-center">
            {deck.length > 0 && (
              <>
                <div className="absolute -left-2 rotate-90">
                  <CardFace card={trumpCard} />
                </div>
                <div className="relative z-10"><CardBack /></div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-display text-sm font-bold text-gold">{deck.length}</span>
              </>
            )}
          </div>
          <div className="flex min-h-[6rem] flex-wrap items-center justify-center gap-1">
            {table.map((p, i) => (
              <div key={i} className="relative">
                <CardFace card={p.attack} />
                {p.defend && (
                  <div className="absolute left-3 top-4 rotate-12">
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

          <div className="flex flex-wrap justify-center gap-1 px-2">
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

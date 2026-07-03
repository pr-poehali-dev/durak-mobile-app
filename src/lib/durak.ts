export const SUITS = ['♠', '♥', '♦', '♣'] as const;
export const RANKS = ['6', '7', '8', '9', '10', 'В', 'Д', 'К', 'Т'] as const;

export type Suit = (typeof SUITS)[number];
export type Rank = (typeof RANKS)[number];

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
}

export const isRed = (s: Suit) => s === '♥' || s === '♦';
export const rankValue = (r: Rank) => RANKS.indexOf(r);

export const buildDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ id: `${rank}${suit}`, suit, rank });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export const beats = (attacker: Card, defender: Card, trump: Suit): boolean => {
  if (attacker.suit === defender.suit) {
    return rankValue(defender.rank) > rankValue(attacker.rank);
  }
  return defender.suit === trump && attacker.suit !== trump;
};

export const canDefend = (attack: Card, hand: Card[], trump: Suit): Card | undefined => {
  const sorted = [...hand].sort((a, b) => rankValue(a.rank) - rankValue(b.rank));
  const nonTrump = sorted.filter((c) => c.suit !== trump);
  const trumps = sorted.filter((c) => c.suit === trump);
  return [...nonTrump, ...trumps].find((c) => beats(attack, c, trump));
};

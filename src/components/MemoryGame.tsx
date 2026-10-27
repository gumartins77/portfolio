"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { memoryCards, techLabels } from "@/data/profile";
import styles from "./MemoryGame.module.css";

type Card = { id: number; face: string; pair: string };

const PAIRS = memoryCards.length / 2;
const initialCards: Card[] = memoryCards.map((card, id) => ({ id, ...card }));

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function MemoryGame() {
  const [cards, setCards] = useState(initialCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Embaralha só no cliente para o HTML do servidor bater com a hidratação.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCards(shuffle(initialCards));
    return () => clearTimeout(timeout.current);
  }, []);

  const locked = flipped.length === 2;
  const won = matched.length === cards.length;

  function handleClick(card: Card) {
    if (locked || flipped.includes(card.id) || matched.includes(card.id)) return;

    const next = [...flipped, card.id];
    setFlipped(next);
    if (next.length < 2) return;

    setMoves((m) => m + 1);
    const [a, b] = next.map((id) => cards.find((c) => c.id === id)!);
    if (a.pair === b.pair) {
      setMatched((m) => [...m, a.id, b.id]);
      setFlipped([]);
    } else {
      timeout.current = setTimeout(() => setFlipped([]), 1000);
    }
  }

  function restart() {
    clearTimeout(timeout.current);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setCards(shuffle(initialCards));
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.hint}>
        <i className="bi bi-controller" aria-hidden="true" /> Jogo da memória: vire as cartas e encontre os{" "}
        {PAIRS} pares.
        <span className={styles.status} aria-live="polite">
          {" "}
          {matched.length / 2}/{PAIRS} pares · {moves} jogadas
        </span>
      </p>

      <div className={styles.grid}>
        {cards.map((card) => {
          const isOpen = flipped.includes(card.id) || matched.includes(card.id);
          return (
            <button
              key={card.id}
              type="button"
              className={`${styles.card} ${isOpen ? styles.flip : ""} ${matched.includes(card.id) ? styles.matched : ""}`}
              onClick={() => handleClick(card)}
              aria-label={isOpen ? `Par: ${techLabels[card.pair]}` : `Carta ${techLabels[card.face]}`}
              aria-pressed={isOpen}
            >
              <Image
                className={styles.back}
                src={`/images/${card.face}.png`}
                alt=""
                width={96}
                height={96}
                title={techLabels[card.face]}
              />
              <Image className={styles.front} src={`/images/${card.pair}.png`} alt="" width={96} height={96} />
            </button>
          );
        })}
      </div>

      <div className={`${styles.result} ${won ? styles.won : ""}`} aria-hidden={!won}>
        <h3 className="section-title">
          E muito <span>mais...</span>
        </h3>
        <button type="button" className="btn-ghost" onClick={restart} tabIndex={won ? 0 : -1}>
          <i className="bi bi-arrow-repeat" aria-hidden="true" /> Jogar de novo
        </button>
      </div>
    </div>
  );
}

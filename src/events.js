// Data-driven events: each event describes its chance and structured effects.
const EVENTS = [
  {
    name: 'Tour bus arrives',
    chance: 0.25,
    description: 'Event: A tour bus arrives — lots of thirsty customers.',
    effects: {
      demandMultiplier: 1.3,
    },
  },
  {
    name: 'Raccoon steals food',
    chance: 0.25,
    description: 'Event: A raccoon sneaks in and steals some food.',
    effects: {
      stealQuantity: 1,
    },
  },
  {
    name: 'Helpful neighbor cleans',
    chance: 0.25,
    description: 'Event: A helpful neighbor tidies up the shop.',
    effects: {
      cleanlinessDelta: 10,
    },
  },
  {
    name: 'Bad weather for bagels',
    chance: 0.25,
    description: 'Event: Bad weather scares away bagel customers.',
    effects: {
      disabledProducts: ['bagel'],
    },
  },
];

// Roll for a single event each day (with an overall chance that any event happens).
const BASE_EVENT_CHANCE = 0.3;

export default function randomEvent() {
  const rollForAny = Math.random();
  if (rollForAny > BASE_EVENT_CHANCE) return null;

  const roll = Math.random();
  let cumulative = 0;

  for (const event of EVENTS) {
    cumulative += event.chance;
    if (roll <= cumulative) {
      return {
        name: event.name,
        description: event.description,
        ...event.effects,
      };
    }
  }

  return null;
}

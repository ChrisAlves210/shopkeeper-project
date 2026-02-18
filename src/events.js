// Data-driven events: each event describes its weight and structured effects.
const EVENTS = [
  {
    name: 'Tour bus arrives',
    // More common positive event
    weight: 3,
    description: 'Event: A tour bus arrives — lots of thirsty customers.',
    effects: {
      demandMultiplier: 1.3,
    },
  },
  {
    name: 'Raccoon steals food',
    weight: 1,
    description: 'Event: A raccoon sneaks in and steals some food.',
    effects: {
      stealQuantity: 1,
    },
  },
  {
    name: 'Helpful neighbor cleans',
    weight: 2,
    description: 'Event: A helpful neighbor tidies up the shop.',
    effects: {
      cleanlinessDelta: 10,
    },
  },
  {
    name: 'Bad weather for bagels',
    weight: 1,
    description: 'Event: Bad weather scares away bagel customers.',
    effects: {
      disabledProducts: ['bagel'],
    },
  },
];

// Roll for a single event each day (with an overall chance that any event happens).
const BASE_EVENT_CHANCE = 0.3;

function pickWeightedEvent(events) {
  const totalWeight = events.reduce((sum, ev) => sum + (ev.weight ?? 1), 0);
  if (totalWeight <= 0) return null;

  const roll = Math.random() * totalWeight;
  let running = 0;

  for (const event of events) {
    running += event.weight ?? 1;
    if (roll <= running) {
      return event;
    }
  }

  return null;
}

export default function randomEvent() {
  const rollForAny = Math.random();
  if (rollForAny > BASE_EVENT_CHANCE) return null;
  const picked = pickWeightedEvent(EVENTS);
  if (!picked) return null;

  return {
    name: picked.name,
    description: picked.description,
    ...picked.effects,
  };
}

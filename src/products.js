export const PRODUCTS = [
  {
    id: "coffee",
    name: "Coffee",
    wholesaleCents: 150,
    baseDemand: 3,
    maxStock: 30,
  },
  {
    id: "bagel",
    name: "Bagel",
    wholesaleCents: 100,
    baseDemand: 2,
    maxStock: 20,
    // Simple spoilage rule: up to this many bagels spoil each day
    spoilPerDay: 2,
  },
  {
    id: "tea",
    name: "Tea",
    wholesaleCents: 120,
    baseDemand: 2,
    maxStock: 25,
  },
];
export function saveState(state) {
  localStorage.setItem("shopkeeper", JSON.stringify(state));
}

export function loadState() {
  const data = localStorage.getItem("shopkeeper");
  if (!data) return null;
  return JSON.parse(data);
}
//usage tracking and business logic\


// In-memory usage store: Map<token, usage in ms>
const usageStore = new Map();

function getUsage(token) {
  return usageStore.get(token) || 0;
}

function incrementUsage(token, ms) {
  const currentUsage = getUsage(token);
  usageStore.set(token, currentUsage + ms);
}

module.exports = {
  getUsage,
  incrementUsage,
  usageStore, // Exposing for other modules if needed
};

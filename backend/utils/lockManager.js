
class LockManager {
  constructor() {
    // Map of itemId -> lock state (true = locked, false/undefined = unlocked)
    this.locks = new Map();
    // Map of itemId -> array of pending resolve functions
    this.queues = new Map();
  }
  async acquireLock(itemId) {
    // If lock is not held, acquire it immediately
    if (!this.locks.get(itemId)) {
      this.locks.set(itemId, true);
      return Promise.resolve();
    }

    // Lock is held, add to queue and wait
    return new Promise((resolve) => {
      if (!this.queues.has(itemId)) {
        this.queues.set(itemId, []);
      }
      this.queues.get(itemId).push(resolve);
    });
  }

  releaseLock(itemId) {
    const queue = this.queues.get(itemId);

    // If there are queued requests, grant lock to next in line
    if (queue && queue.length > 0) {
      const nextResolve = queue.shift();
      nextResolve(); // Grant lock to next waiter
    } else {
      // No one waiting, release the lock
      this.locks.set(itemId, false);
    }
  }
}

module.exports = new LockManager();

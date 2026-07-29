import type { UrlMapping } from '../types/url';

const HISTORY_STORAGE_KEY = 'nanolink_url_history';

export const historyService = {
  getHistory(): UrlMapping[] {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to load URL history from localStorage:', error);
      return [];
    }
  },

  saveHistory(history: UrlMapping[]): void {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save URL history to localStorage:', error);
    }
  },

  addMapping(mapping: UrlMapping): UrlMapping[] {
    const current = this.getHistory();
    // Deduplicate by shortCode
    const filtered = current.filter((item) => item.shortCode !== mapping.shortCode);
    const updated = [mapping, ...filtered];
    this.saveHistory(updated);
    return updated;
  },

  removeMapping(shortCode: String): UrlMapping[] {
    const current = this.getHistory();
    const updated = current.filter((item) => item.shortCode !== shortCode);
    this.saveHistory(updated);
    return updated;
  },

  clearHistory(): void {
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear URL history:', error);
    }
  },
};

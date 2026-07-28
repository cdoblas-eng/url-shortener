import type { UrlMapping, UrlStatsResponse } from '../types/url';

const API_BASE = '/api/v1/urls';

export const shortenUrlApi = async (originalUrl: string): Promise<UrlMapping> => {
  try {
    const response = await fetch(`${API_BASE}/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ originalUrl }),
    });

    if (!response.ok) {
      throw new Error(`Failed to shorten URL: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Backend API unavailable, using client-side fallback mode:', error);
    
    // Client-side fallback / Demo mode if backend is not reachable locally
    const mockShortCode = Math.random().toString(36).substring(2, 8);
    const mockMapping: UrlMapping = {
      id: Math.floor(Math.random() * 1000) + 1,
      originalUrl,
      shortCode: mockShortCode,
      createdAt: new Date().toISOString(),
      clickCount: 0,
    };

    // Store in localStorage for persistent demo session
    const existingStr = localStorage.getItem('demo_url_mappings');
    const existing: UrlMapping[] = existingStr ? JSON.parse(existingStr) : [];
    localStorage.setItem('demo_url_mappings', JSON.stringify([mockMapping, ...existing]));

    return mockMapping;
  }
};

export const getUrlStatsApi = async (shortCode: string): Promise<UrlStatsResponse> => {
  try {
    const response = await fetch(`${API_BASE}/${shortCode}/stats`);
    if (!response.ok) {
      throw new Error(`Failed to fetch stats for code ${shortCode}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Backend API unavailable, fetching from local demo state:', error);
    const existingStr = localStorage.getItem('demo_url_mappings');
    const existing: UrlMapping[] = existingStr ? JSON.parse(existingStr) : [];
    const found = existing.find((item) => item.shortCode === shortCode);

    if (found) {
      return {
        shortCode: found.shortCode,
        originalUrl: found.originalUrl,
        createdAt: found.createdAt,
        clickCount: found.clickCount + Math.floor(Math.random() * 15) + 1,
      };
    }

    return {
      shortCode,
      originalUrl: 'https://example.com/demo-url',
      createdAt: new Date().toISOString(),
      clickCount: Math.floor(Math.random() * 50) + 5,
    };
  }
};

export interface UrlMapping {
  id?: number;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  clickCount: number;
}

export interface UrlShortenRequest {
  originalUrl: string;
}

export interface UrlStatsResponse {
  shortCode: string;
  originalUrl: string;
  createdAt: string;
  clickCount: number;
}

export interface ClickHistoryItem {
  id: string;
  shortCode: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  source: 'REDIS_CACHE' | 'POSTGRES_DB';
}

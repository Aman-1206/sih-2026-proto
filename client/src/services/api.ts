import {
  IStation,
  IDataset,
  IPublication,
  IExpedition,
  IMediaAsset,
  IActivity,
  IStory,
  ILearnTopic,
  IContentDraft,
  ICampaign,
  IAskResponse,
  ISearchResponse,
  IAnalyticsOverview,
  IAuditLog,
  IKnowledgeGraphData,
  SocialPlatform,
  AudienceType,
  ToneType,
} from '@oruvia/shared';

const API_BASE = '/api';

async function fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('oruvia_token');
  const headers = new Headers(options.headers || {});
  
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    let errorMsg = 'An unexpected error occurred.';
    try {
      const errJson = await response.json();
      errorMsg = errJson.error || errorMsg;
    } catch {
      errorMsg = response.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  auth: {
    login: (credentials: { email: string; password: string }) =>
      fetchWithAuth<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData: any) =>
      fetchWithAuth<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    logout: () => fetchWithAuth<{ message: string }>('/auth/logout', { method: 'POST' }),
    me: () => fetchWithAuth<{ user: any }>('/auth/me'),
  },

  // Search
  search: {
    query: (params: Record<string, any>) => {
      const queryStr = new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== '')
          .map(([k, v]) => [k, String(v)])
      ).toString();
      return fetchWithAuth<ISearchResponse>(`/search?${queryStr}`);
    },
    suggestions: (q: string) => fetchWithAuth<any>(`/search/suggestions?q=${encodeURIComponent(q)}`),
    semantic: (query: string) =>
      fetchWithAuth<{ items: any[]; total: number }>('/search/semantic', {
        method: 'POST',
        body: JSON.stringify({ query }),
      }),
    getSaved: () => fetchWithAuth<{ searches: any[] }>('/search/saved'),
    saveSearch: (data: { query: string; filters?: any; name?: string }) =>
      fetchWithAuth<{ saved: any }>('/search/saved', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Datasets
  datasets: {
    list: (params: Record<string, any> = {}) => {
      const queryStr = new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== '')
          .map(([k, v]) => [k, String(v)])
      ).toString();
      return fetchWithAuth<{ datasets: IDataset[]; total: number; page: number; totalPages: number }>(
        `/datasets?${queryStr}`
      );
    },
    getBySlug: (slug: string) =>
      fetchWithAuth<{ dataset: IDataset; jsonLd: string; citations: any }>(`/datasets/${slug}`),
    create: (data: any) =>
      fetchWithAuth<{ dataset: IDataset }>('/datasets', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Expeditions
  expeditions: {
    list: (params: Record<string, any> = {}) => {
      const queryStr = new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== '')
          .map(([k, v]) => [k, String(v)])
      ).toString();
      return fetchWithAuth<{ expeditions: IExpedition[]; total: number }>(`/expeditions?${queryStr}`);
    },
    getBySlug: (slug: string) =>
      fetchWithAuth<{ expedition: IExpedition; datasets: IDataset[]; publications: IPublication[]; media: IMediaAsset[] }>(
        `/expeditions/${slug}`
      ),
  },

  // Publications
  publications: {
    list: (params: Record<string, any> = {}) => {
      const queryStr = new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== '')
          .map(([k, v]) => [k, String(v)])
      ).toString();
      return fetchWithAuth<{ publications: IPublication[]; total: number; page: number; totalPages: number }>(
        `/publications?${queryStr}`
      );
    },
    getBySlug: (slug: string) =>
      fetchWithAuth<{ publication: IPublication; datasets: IDataset[]; expeditions: IExpedition[]; bibtex: string }>(
        `/publications/${slug}`
      ),
  },

  // Media
  media: {
    list: (params: Record<string, any> = {}) => {
      const queryStr = new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== '')
          .map(([k, v]) => [k, String(v)])
      ).toString();
      return fetchWithAuth<{ media: IMediaAsset[]; total: number; page: number; totalPages: number }>(
        `/media?${queryStr}`
      );
    },
    getById: (id: string) => fetchWithAuth<{ asset: IMediaAsset }>(`/media/${id}`),
    upload: (formData: FormData) =>
      fetchWithAuth<{ asset: IMediaAsset }>('/media/upload', {
        method: 'POST',
        body: formData,
      }),
  },

  // Activities
  activities: {
    list: (params: Record<string, any> = {}) => {
      const queryStr = new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== '')
          .map(([k, v]) => [k, String(v)])
      ).toString();
      return fetchWithAuth<{ activities: IActivity[]; total: number }>(`/activities?${queryStr}`);
    },
    getBySlug: (slug: string) => fetchWithAuth<{ activity: IActivity }>(`/activities/${slug}`),
  },

  // Stations
  stations: {
    list: () => fetchWithAuth<{ stations: IStation[]; total: number }>('/stations'),
    getBySlug: (slug: string) =>
      fetchWithAuth<{ station: IStation; datasets: IDataset[]; media: IMediaAsset[] }>(`/stations/${slug}`),
    getWeather: (slug: string) =>
      fetchWithAuth<{ isDemoData: boolean; current: any; historical: any[] }>(`/stations/${slug}/weather`),
  },

  // Atlas & Graph
  atlas: {
    getLayers: () => fetchWithAuth<any>('/atlas/layers'),
  },
  graph: {
    getGraph: (resourceId?: string) =>
      fetchWithAuth<IKnowledgeGraphData>(`/graph${resourceId ? `?resourceId=${resourceId}` : ''}`),
  },

  // Stories
  stories: {
    list: (params: Record<string, any> = {}) => {
      const queryStr = new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== '')
          .map(([k, v]) => [k, String(v)])
      ).toString();
      return fetchWithAuth<{ stories: IStory[]; total: number }>(`/stories?${queryStr}`);
    },
    getBySlug: (slug: string) => fetchWithAuth<{ story: IStory }>(`/stories/${slug}`),
    create: (data: any) =>
      fetchWithAuth<{ story: IStory }>('/stories', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Learn
  learn: {
    list: (category?: string) =>
      fetchWithAuth<{ topics: ILearnTopic[]; total: number }>(
        `/learn${category ? `?category=${encodeURIComponent(category)}` : ''}`
      ),
    getBySlug: (slug: string) => fetchWithAuth<{ topic: ILearnTopic }>(`/learn/${slug}`),
  },

  // AI & RAG
  ai: {
    ask: (question: string, contextResourceIds?: string[], language: 'en' | 'hi' = 'en') =>
      fetchWithAuth<IAskResponse>('/ai/ask', {
        method: 'POST',
        body: JSON.stringify({ question, contextResourceIds, language }),
      }),
    generateContent: (params: {
      resourceIds: string[];
      platform: SocialPlatform;
      audience: AudienceType;
      tone: ToneType;
      language?: 'en' | 'hi';
      targetLengthWords?: number;
      additionalInstructions?: string;
    }) =>
      fetchWithAuth<{ title: string; content: string; evidenceSentences: any[]; evidenceSummary: any }>(
        '/ai/generate-content',
        { method: 'POST', body: JSON.stringify(params) }
      ),
    extractMetadata: (fileName: string, mimeType: string) =>
      fetchWithAuth<any>('/ai/extract-metadata', {
        method: 'POST',
        body: JSON.stringify({ fileName, mimeType }),
      }),
    suggestTags: (text: string) =>
      fetchWithAuth<{ tags: string[] }>('/ai/suggest-tags', {
        method: 'POST',
        body: JSON.stringify({ text }),
      }),
  },

  // Studio
  studio: {
    getDrafts: (params: Record<string, any> = {}) => {
      const queryStr = new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== '')
          .map(([k, v]) => [k, String(v)])
      ).toString();
      return fetchWithAuth<{ drafts: IContentDraft[]; total: number }>(`/studio/drafts?${queryStr}`);
    },
    getDraftById: (id: string) => fetchWithAuth<{ draft: IContentDraft }>(`/studio/drafts/${id}`),
    createDraft: (data: any) =>
      fetchWithAuth<{ draft: IContentDraft }>('/studio/drafts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateDraft: (id: string, data: any) =>
      fetchWithAuth<{ draft: IContentDraft }>(`/studio/drafts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    submitForReview: (id: string) =>
      fetchWithAuth<{ draft: IContentDraft; message: string }>(`/studio/drafts/${id}/submit`, {
        method: 'POST',
      }),
    reviewAction: (id: string, action: string, comment: string) =>
      fetchWithAuth<{ draft: IContentDraft }>(`/studio/drafts/${id}/review`, {
        method: 'POST',
        body: JSON.stringify({ action, comment }),
      }),
    getCampaigns: () => fetchWithAuth<{ campaigns: ICampaign[]; total: number }>('/studio/campaigns'),
    createCampaign: (data: any) =>
      fetchWithAuth<{ campaign: ICampaign }>('/studio/campaigns', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getCalendarEvents: () => fetchWithAuth<{ events: any[] }>('/studio/calendar'),
  },

  // Analytics
  analytics: {
    getOverview: () => fetchWithAuth<IAnalyticsOverview>('/analytics/overview'),
  },

  // Audit
  audit: {
    getLogs: (params: Record<string, any> = {}) => {
      const queryStr = new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== '')
          .map(([k, v]) => [k, String(v)])
      ).toString();
      return fetchWithAuth<{ logs: IAuditLog[]; total: number; page: number; limit: number }>(
        `/audit?${queryStr}`
      );
    },
  },

  // Notifications
  notifications: {
    list: () => fetchWithAuth<{ notifications: any[] }>('/notifications'),
    markRead: (id: string) => fetchWithAuth<{ success: boolean }>(`/notifications/${id}/read`, { method: 'PATCH' }),
  },

  // Generic HTTP helpers
  get: <T = any>(path: string) => fetchWithAuth<T>(path),
  post: <T = any>(path: string, body?: any) =>
    fetchWithAuth<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch: <T = any>(path: string, body?: any) =>
    fetchWithAuth<T>(path, { method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined }),
  delete: <T = any>(path: string) => fetchWithAuth<T>(path, { method: 'DELETE' }),
};

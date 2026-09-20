const getApiBase = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) return '/api/v1';
  const cleanUrl = envUrl.trim().replace(/\/$/, '');
  return cleanUrl.endsWith('/api/v1') ? cleanUrl : `${cleanUrl}/api/v1`;
};

const API_BASE = getApiBase();

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Workspace {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Source {
  id: string;
  workspace_id: string;
  name: string;
  type: string;
  uri?: string;
  status: string;
  metadata_?: Record<string, any>;
  created_at: string;
}

export interface GraphNode {
  id: string;
  workspace_id: string;
  type: string;
  name: string;
  description?: string;
  metadata_?: Record<string, any>;
  confidence: number;
  created_at: string;
}

export interface GraphEdge {
  id: string;
  workspace_id: string;
  source_entity_id: string;
  target_entity_id: string;
  relationship_type: string;
  confidence: number;
  evidence: string[];
  temporal_metadata?: Record<string, any>;
  created_at: string;
}

export interface Discovery {
  id: string;
  workspace_id: string;
  title: string;
  description: string;
  severity: string;
  impact_score: number;
  confidence: number;
  type: string;
  status: string;
  evidence: string[];
  reasoning: Array<{ step: number; statement: string; evidence_type?: string }>;
  affected_entities: string[];
  recommended_actions: string[];
  created_at: string;
}

export interface TimelineEvent {
  id: string;
  workspace_id: string;
  entity_id?: string;
  title: string;
  start_time?: string;
  end_time?: string;
  event_type: string;
  confidence: number;
  created_at: string;
}

export interface QueryResult {
  answer: string;
  confidence: number;
  sources: Array<{ title: string; snippet: string }>;
  nodes: Array<{ id: string; name: string; type: string }>;
  reasoning: Array<{ step: number; thought: string }>;
  discoveries: Array<{ title: string; impact_score: number; severity: string }>;
}

export interface SimulationResult {
  simulation_id: string;
  original_state: Record<string, any>;
  modified_state: Record<string, any>;
  impacted_nodes: GraphNode[];
  new_conflicts: string[];
  resolved_conflicts: string[];
  summary: string;
}

export interface Notification {
  id: string;
  user_id: string;
  workspace_id?: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('realitygraph_token');
  }

  setToken(token: string) {
    localStorage.setItem('realitygraph_token', token);
  }

  clearToken() {
    localStorage.removeItem('realitygraph_token');
  }

  private getHeaders(contentType: string | null = 'application/json'): HeadersInit {
    const headers: Record<string, string> = {};
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isFormData = options.body instanceof FormData;
    const headers = {
      ...this.getHeaders(isFormData ? null : 'application/json'),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Network request failed' }));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err: any) {
      if (err.name === 'TypeError' || err.message?.includes('fetch') || err.message?.includes('Network')) {
        throw new Error('NETWORK_ERROR: Unable to connect to backend service.');
      }
      throw err;
    }
  }

  // Health
  async getHealth() {
    return this.request<{ status: string; service: string; version: string; ai_enabled: boolean }>('/health');
  }

  // Auth
  async register(data: { email: string; password: string; name: string }) {
    return this.request<{ access_token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request<User>('/auth/me');
  }

  // Workspaces
  async listWorkspaces() {
    return this.request<Workspace[]>('/workspaces');
  }

  async getWorkspaces() {
    return this.listWorkspaces();
  }

  async createWorkspace(data: { name: string; description?: string }) {
    return this.request<Workspace>('/workspaces', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getWorkspace(id: string) {
    return this.request<Workspace>(`/workspaces/${id}`);
  }

  // Sources
  async listSources(workspaceId: string) {
    return this.request<Source[]>(`/workspaces/${workspaceId}/sources`);
  }

  async getSources(workspaceId: string) {
    return this.listSources(workspaceId);
  }


  async createTextSource(workspaceId: string, data: { name: string; content: string }) {
    return this.request<Source>(`/workspaces/${workspaceId}/sources`, {
      method: 'POST',
      body: JSON.stringify({ ...data, type: 'text_input' }),
    });
  }

  async uploadSourceFile(workspaceId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.request<Source>(`/workspaces/${workspaceId}/sources/upload`, {
      method: 'POST',
      body: formData,
    });
  }

  async deleteSource(sourceId: string) {
    return this.request<{ message: string }>(`/sources/${sourceId}`, {
      method: 'DELETE',
    });
  }

  // Graph
  async getGraph(workspaceId: string) {
    return this.request<{ nodes: GraphNode[]; edges: GraphEdge[] }>(`/workspaces/${workspaceId}/graph`);
  }

  async getNodeNeighbors(nodeId: string) {
    return this.request<{
      entity: GraphNode;
      in_edges: GraphEdge[];
      out_edges: GraphEdge[];
      neighbors: GraphNode[];
    }>(`/nodes/${nodeId}/neighbors`);
  }

  async getNodeEvidence(nodeId: string) {
    return this.request<{ node_id: string; node_name: string; evidence: string[] }>(`/nodes/${nodeId}/evidence`);
  }

  // Discoveries
  async listDiscoveries(workspaceId: string) {
    return this.request<Discovery[]>(`/workspaces/${workspaceId}/discoveries`);
  }

  async generateDiscoveries(workspaceId: string) {
    return this.request<Discovery[]>(`/workspaces/${workspaceId}/discoveries/generate`, {
      method: 'POST',
    });
  }

  async getDiscoveryExplanation(discoveryId: string) {
    return this.request<any>(`/discoveries/${discoveryId}/explain`);
  }

  async dismissDiscovery(discoveryId: string) {
    return this.request<{ message: string }>(`/discoveries/${discoveryId}/dismiss`, {
      method: 'POST',
    });
  }

  // Timeline
  async getTimeline(workspaceId: string) {
    return this.request<TimelineEvent[]>(`/workspaces/${workspaceId}/timeline`);
  }

  // Query
  async queryIntelligence(workspaceId: string, query: string, language: string = 'en') {
    return this.request<QueryResult>(`/workspaces/${workspaceId}/query`, {
      method: 'POST',
      body: JSON.stringify({ query, language }),
    });
  }

  // Simulate
  async simulateChange(workspaceId: string, change: { entity: string; property: string; value: any }) {
    return this.request<SimulationResult>(`/workspaces/${workspaceId}/simulate`, {
      method: 'POST',
      body: JSON.stringify({ change }),
    });
  }

  async getSimulation(simulationId: string) {
    return this.request<SimulationResult>(`/simulations/${simulationId}`);
  }


  // Demo
  async loadDemoDataset(workspaceId: string) {
    return this.request<{ message: string; documents_processed: number; sources: any[] }>(
      `/workspaces/${workspaceId}/load-demo`,
      { method: 'POST' }
    );
  }

  // Notifications
  async getNotifications(unreadOnly = false) {
    const query = unreadOnly ? '?unread_only=true' : '';
    return this.request<Notification[]>(`/notifications${query}`);
  }

  async markNotificationRead(id: string) {
    return this.request<Notification>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsRead() {
    return this.request<{ message: string }>(`/notifications/mark-all-read`, {
      method: 'POST',
    });
  }
}

export const api = new ApiService();

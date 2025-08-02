/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "../lib/apiClient";

export interface Agent {
  id: string;
  name: string;
  description: string;
  agent_type: string;
  cost_per_run: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgentExecution {
  id: string;
  user_id: string;
  agent_id: string;
  input_data: Record<string, any>;
  output_data?: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  cost_deducted: number;
  execution_time_seconds?: number;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export interface AgentExecutionResponse {
  execution_id: string;
  status: string;
  message: string;
  cost_deducted?: number;
}

export class AgentService {
  /**
   * Get all available agents
   */
  static async getAgents(): Promise<Agent[]> {
    const response = await apiClient.get('/api/v0/agents/');
    return response.data;
  }

  /**
   * Get specific agent details
   */
  static async getAgent(agentId: string): Promise<Agent> {
    const response = await apiClient.get(`/api/v0/agents/${agentId}`);
    return response.data;
  }

  /**
   * Execute an agent
   */
  static async executeAgent(
    agentId: string, 
    inputData: Record<string, any>
  ): Promise<AgentExecutionResponse> {
    const response = await apiClient.post(`/api/v0/agents/${agentId}/execute`, inputData);
    return response.data;
  }

  /**
   * Get user's execution history
   */
  static async getExecutionHistory(
    limit: number = 50, 
    offset: number = 0
  ): Promise<AgentExecution[]> {
    const response = await apiClient.get('/api/v0/agents/executions/history', {
      params: { limit, offset }
    });
    return response.data;
  }

  /**
   * Get agent type information (for form requirements)
   */
  static async getAgentTypeInfo(agentType: string): Promise<any> {
    const response = await apiClient.get(`/api/v0/agents/types/${agentType}`);
    return response.data;
  }

  // Specific agent type info methods
  static async getSocialMediaAgentInfo() {
    return this.getAgentTypeInfo('social-media');
  }

  static async getCampaignAgentInfo() {
    return this.getAgentTypeInfo('campaign');
  }

  static async getAudienceAnalysisAgentInfo() {
    return this.getAgentTypeInfo('audience-analysis');
  }

  static async getCopyWriterAgentInfo() {
    return this.getAgentTypeInfo('copy-writer');
  }

  static async getCompetitorAgentInfo() {
    return this.getAgentTypeInfo('competitor');
  }

  static async getBlogAgentInfo() {
    return this.getAgentTypeInfo('blog');
  }
}

export default AgentService;
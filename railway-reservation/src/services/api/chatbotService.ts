import apiClient from './axiosConfig';

export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
}

class ChatbotService {
  private readonly baseUrl = '/api/chatbot/chat';

  async sendMessage(message: string): Promise<string> {
    try {
      const response = await apiClient.post<ChatResponse>(this.baseUrl, {
        message: message.trim()
      });
      return response.data.response;
    } catch (error) {
      console.error('Chatbot API error:', error);
      throw new Error('Failed to get response from chatbot. Please try again.');
    }
  }

  // Store chat history in localStorage
  saveChatHistory(messages: ChatMessage[]): void {
    try {
      localStorage.setItem('chatbot_history', JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }

  loadChatHistory(): ChatMessage[] {
    try {
      const history = localStorage.getItem('chatbot_history');
      if (history) {
        const parsed = JSON.parse(history);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
    return [];
  }

  clearChatHistory(): void {
    localStorage.removeItem('chatbot_history');
  }
}

export default new ChatbotService();

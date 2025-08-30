import axios from 'axios';
import { Game } from '../../../shared/types/game';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class GameService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/games`;
  }

  async createGame(playerName: string): Promise<Game> {
    const response = await axios.post(this.baseURL, { playerName });
    return response.data;
  }

  async getGame(gameId: string): Promise<Game> {
    const response = await axios.get(`${this.baseURL}/${gameId}`);
    return response.data;
  }

  async joinGame(gameId: string, playerName: string): Promise<Game> {
    const response = await axios.post(`${this.baseURL}/${gameId}/join`, { playerName });
    return response.data;
  }

  async leaveGame(gameId: string, playerId: string): Promise<Game> {
    const response = await axios.post(`${this.baseURL}/${gameId}/leave`, { playerId });
    return response.data;
  }

  async listGames(): Promise<Game[]> {
    const response = await axios.get(this.baseURL);
    return response.data;
  }

  async takeTokens(gameId: string, playerId: string, tokens: any): Promise<Game> {
    const response = await axios.post(`${this.baseURL}/${gameId}/actions/take-tokens`, {
      playerId,
      tokens
    });
    return response.data;
  }

  async purchaseCard(gameId: string, playerId: string, cardId: string, payment: any): Promise<Game> {
    const response = await axios.post(`${this.baseURL}/${gameId}/actions/purchase-card`, {
      playerId,
      cardId,
      payment
    });
    return response.data;
  }

  async reserveCard(gameId: string, playerId: string, cardId: string): Promise<Game> {
    const response = await axios.post(`${this.baseURL}/${gameId}/actions/reserve-card`, {
      playerId,
      cardId
    });
    return response.data;
  }
}

export const gameService = new GameService();

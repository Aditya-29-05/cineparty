import api from './api';

export const roomService = {
  async createRoom(data) {
    const response = await api.post('/rooms', data);
    return response.data;
  },

  async getRoom(roomCode) {
    const response = await api.get(`/rooms/${roomCode}`);
    return response.data;
  },

  async joinRoom(roomCode) {
    const response = await api.post(`/rooms/${roomCode}/join`);
    return response.data;
  },

  async setRoomMetadata(roomCode, metadata) {
    const response = await api.patch(`/rooms/${roomCode}/metadata`, metadata);
    return response.data;
  },

  async leaveRoom(roomCode) {
    const response = await api.post(`/rooms/${roomCode}/leave`);
    return response.data;
  },

  async endRoom(roomCode) {
    const response = await api.delete(`/rooms/${roomCode}`);
    return response.data;
  },

  async toggleControls(roomCode, hostOnlyControls) {
    const response = await api.patch(`/rooms/${roomCode}/controls`, { hostOnlyControls });
    return response.data;
  },

  async getUserRooms() {
    const response = await api.get('/rooms');
    return response.data;
  },
};

import express from 'express';
import {
  createRoom,
  getRoom,
  joinRoom,
  setRoomMetadata,
  toggleControls,
  leaveRoom,
  endRoom,
  getUserRooms,
} from '../controllers/roomController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getUserRooms);
router.post('/', protect, createRoom);
router.get('/:roomCode', getRoom);
router.post('/:roomCode/join', protect, joinRoom);
router.patch('/:roomCode/metadata', protect, setRoomMetadata);
router.patch('/:roomCode/controls', protect, toggleControls);
router.post('/:roomCode/leave', protect, leaveRoom);
router.delete('/:roomCode', protect, endRoom);

export default router;

import { roomService } from '../services/roomService.js';

// @desc    Create a new watch room
// @route   POST /api/rooms
// @access  Private
export const createRoom = async (req, res, next) => {
  try {
    const { title, movieMetadata, hostOnlyControls } = req.body;

    const room = await roomService.createRoom(
      req.user,
      title,
      movieMetadata,
      hostOnlyControls !== undefined ? hostOnlyControls : true
    );

    res.status(201).json({
      success: true,
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get room details by room code
// @route   GET /api/rooms/:roomCode
// @access  Public (or Private)
export const getRoom = async (req, res, next) => {
  try {
    const { roomCode } = req.params;
    const room = await roomService.getRoomByCode(roomCode);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found or no longer active',
      });
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join an existing room
// @route   POST /api/rooms/:roomCode/join
// @access  Private
export const joinRoom = async (req, res, next) => {
  try {
    const { roomCode } = req.params;
    const room = await roomService.joinRoom(roomCode, req.user);

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Could not join room',
    });
  }
};

// @desc    Set/update room movie metadata
// @route   PATCH /api/rooms/:roomCode/metadata
// @access  Private (Host only)
export const setRoomMetadata = async (req, res, next) => {
  try {
    const { roomCode } = req.params;
    const { fileName, fileSize, fileType, duration } = req.body;

    const room = await roomService.setMovieMetadata(roomCode, req.user._id, {
      fileName,
      fileSize,
      fileType,
      duration,
    });

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Leave room
// @route   POST /api/rooms/:roomCode/leave
// @access  Private
export const leaveRoom = async (req, res, next) => {
  try {
    const { roomCode } = req.params;
    const result = await roomService.leaveRoom(roomCode, req.user._id);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    End room (Host only)
// @route   DELETE /api/rooms/:roomCode
// @access  Private (Host only)
export const endRoom = async (req, res, next) => {
  try {
    const { roomCode } = req.params;
    await roomService.endRoom(roomCode, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Room ended successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's active rooms
// @route   GET /api/rooms
// @access  Private
export const getUserRooms = async (req, res, next) => {
  try {
    const rooms = await roomService.getUserRooms(req.user._id);
    res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

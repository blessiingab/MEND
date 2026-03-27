/**
 * Therapy Session Controller - Handle session booking requests
 */
const TherapySession = require('../models/TherapySession');
const TherapistGroup = require('../models/TherapistGroup');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class SessionController {
  static async bookSession(req, res) {
    try {
      const { therapistId, startTime, endTime, notes } = req.body;

      if (!therapistId || !startTime || !endTime) {
        return errorResponse(res, 'therapistId, startTime, and endTime are required', 400);
      }

      const isLicensedTherapist = await TherapySession.isLicensedTherapist(therapistId);
      if (!isLicensedTherapist) {
        return errorResponse(res, 'Selected therapist is not available for booking', 400);
      }

      // Check therapist availability
      const isAvailable = await TherapySession.checkTherapistAvailability(therapistId, startTime, endTime);
      if (!isAvailable) {
        return errorResponse(res, 'Therapist not available for selected time', 400);
      }

      const session = await TherapySession.create({
        userId: req.user.id,
        therapistId,
        startTime,
        endTime,
        notes,
        status: 'pending'
      });

      return successResponse(res, 'Therapy session booked successfully', session, 201);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getUserSessions(req, res) {
    try {
      const { limit = 20, offset = 0 } = req.query;

      const sessions = await TherapySession.getUserSessions(req.user.id, parseInt(limit), parseInt(offset));

      return successResponse(res, 'User sessions retrieved', { sessions, count: sessions.length });
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getSessionById(req, res) {
    try {
      const { sessionId } = req.params;

      const session = await TherapySession.getSessionById(sessionId);
      if (!session) {
        return errorResponse(res, 'Session not found', 404);
      }

      // Check authorization
      if (session.user_id !== req.user.id && session.therapist_id !== req.user.id && req.user.role !== 'admin') {
        return errorResponse(res, 'Access denied', 403);
      }

      return successResponse(res, 'Session retrieved', session);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async updateSession(req, res) {
    try {
      const { sessionId } = req.params;
      const { notes, status } = req.body;

      const session = await TherapySession.getSessionById(sessionId);
      if (!session) {
        return errorResponse(res, 'Session not found', 404);
      }

      if (session.user_id !== req.user.id && session.therapist_id !== req.user.id && req.user.role !== 'admin') {
        return errorResponse(res, 'Access denied', 403);
      }

      const updated = await TherapySession.updateSession(sessionId, { notes, status });

      return successResponse(res, 'Session updated successfully', updated);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async cancelSession(req, res) {
    try {
      const { sessionId } = req.params;

      const session = await TherapySession.getSessionById(sessionId);
      if (!session) {
        return errorResponse(res, 'Session not found', 404);
      }

      if (session.user_id !== req.user.id && req.user.role !== 'admin') {
        return errorResponse(res, 'Access denied', 403);
      }

      const cancelled = await TherapySession.cancelSession(sessionId);

      return successResponse(res, 'Session cancelled', cancelled);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getAvailableTherapists(req, res) {
    try {
      const therapists = await TherapySession.getAvailableTherapists();

      return successResponse(res, 'Available therapists retrieved', { therapists, count: therapists.length });
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getTherapistSessions(req, res) {
    try {
      const { limit = 20, offset = 0 } = req.query;
      const sessions = await TherapySession.getTherapistSessions(req.user.id, parseInt(limit), parseInt(offset));

      return successResponse(res, 'Therapist sessions retrieved', { sessions, count: sessions.length });
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getSessionStats(req, res) {
    try {
      const stats = await TherapySession.getSessionStats(req.user.id);

      return successResponse(res, 'Session statistics retrieved', stats);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async createTherapistGroup(req, res) {
    try {
      const { name, description, careFocus } = req.body;
      if (!name) {
        return errorResponse(res, 'Group name is required', 400);
      }

      const group = await TherapistGroup.createGroup(req.user.id, {
        name,
        description,
        careFocus
      });

      return successResponse(res, 'Therapist group created', group, 201);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getTherapistGroups(req, res) {
    try {
      const groups = await TherapistGroup.getTherapistGroups(req.user.id);
      return successResponse(res, 'Therapist groups retrieved', { groups, count: groups.length });
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async addMemberToTherapistGroup(req, res) {
    try {
      const { groupId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return errorResponse(res, 'userId is required', 400);
      }

      const group = await TherapistGroup.getGroupById(groupId);
      if (!group || group.therapist_id !== req.user.id) {
        return errorResponse(res, 'Group not found', 404);
      }

      const member = await TherapistGroup.addMember(groupId, userId);
      return successResponse(res, 'Group member added', member, 201);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async removeMemberFromTherapistGroup(req, res) {
    try {
      const { groupId, userId } = req.params;

      const group = await TherapistGroup.getGroupById(groupId);
      if (!group || group.therapist_id !== req.user.id) {
        return errorResponse(res, 'Group not found', 404);
      }

      const removed = await TherapistGroup.removeMember(groupId, userId);
      if (!removed) {
        return errorResponse(res, 'Group member not found', 404);
      }

      return successResponse(res, 'Group member removed', { groupId: Number(groupId), userId: Number(userId) });
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getTherapistAvailableClients(req, res) {
    try {
      const clients = await TherapistGroup.getAvailableClientsForTherapist(req.user.id);
      return successResponse(res, 'Therapist clients retrieved', { clients, count: clients.length });
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }
}

module.exports = SessionController;

/**
 * Career Guidance Controller - Handle career counseling requests
 */
const CareerGuidance = require('../models/CareerGuidance');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class CareerController {
  static async createGuidanceSession(req, res) {
    try {
      const { careerGoal, currentRole, experience, guidance, recommendedActions } = req.body;

      if (!careerGoal || !currentRole) {
        return errorResponse(res, 'Career goal and current role are required', 400);
      }

      const session = await CareerGuidance.createGuidanceSession({
        userId: req.user.id,
        careerGoal,
        currentRole,
        experience,
        guidance,
        recommendedActions
      });

      return successResponse(res, 'Guidance session created', session, 201);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getUserCareerPath(req, res) {
    try {
      const careerPath = await CareerGuidance.getUserCareerPath(req.user.id);

      if (!careerPath) {
        return errorResponse(res, 'No career guidance found', 404);
      }

      return successResponse(res, 'Career path retrieved', careerPath);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getUserCareerHistory(req, res) {
    try {
      const { limit = 10, offset = 0 } = req.query;

      const history = await CareerGuidance.getUserCareerHistory(req.user.id, parseInt(limit), parseInt(offset));

      return successResponse(res, 'Career history retrieved', { history, count: history.length });
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getCareerResources(req, res) {
    try {
      const { type, limit = 50, offset = 0 } = req.query;

      const resources = await CareerGuidance.getActiveResources(type, parseInt(limit), parseInt(offset));

      return successResponse(res, 'Career resources retrieved', { resources, count: resources.length });
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async trackProgress(req, res) {
    try {
      const { goal, milestone } = req.body;

      if (!goal || !milestone) {
        return errorResponse(res, 'Goal and milestone are required', 400);
      }

      const progress = await CareerGuidance.trackCareerProgress(req.user.id, goal, milestone);

      return successResponse(res, 'Progress tracked', progress, 201);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getProgressTracking(req, res) {
    try {
      const progress = await CareerGuidance.getUserProgressTracking(req.user.id);

      return successResponse(res, 'Progress tracking retrieved', { progress, count: progress.length });
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async createResource(req, res) {
    try {
      const { title, description, type, link } = req.body;

      if (!title || !type || !link) {
        return errorResponse(res, 'Title, type, and link are required', 400);
      }

      const resource = await CareerGuidance.createResource({
        title,
        description,
        type,
        link
      });

      return successResponse(res, 'Resource created', resource, 201);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }
}

module.exports = CareerController;

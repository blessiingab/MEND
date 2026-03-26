/**
 * Assessment Controller - Handle assessment requests
 */
const AssessmentService = require('../services/AssessmentService');
const Assessment = require('../models/Assessment');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class AssessmentController {
  static async submitPHQ9(req, res) {
    try {
      const { answers } = req.body;

      if (!answers) {
        return errorResponse(res, 'Answers are required', 400);
      }

      const assessment = await AssessmentService.scorePHQ9(answers);
      const saved = await AssessmentService.saveAssessment(req.user.id, assessment);

      return successResponse(res, 'PHQ-9 assessment submitted', {
        id: saved.id,
        type: assessment.type,
        score: assessment.totalScore,
        severity: assessment.severity,
        interpretation: assessment.interpretation
      }, 201);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async submitGAD7(req, res) {
    try {
      const { answers } = req.body;

      if (!answers) {
        return errorResponse(res, 'Answers are required', 400);
      }

      const assessment = await AssessmentService.scoreGAD7(answers);
      const saved = await AssessmentService.saveAssessment(req.user.id, assessment);

      return successResponse(res, 'GAD-7 assessment submitted', {
        id: saved.id,
        type: assessment.type,
        score: assessment.totalScore,
        severity: assessment.severity,
        interpretation: assessment.interpretation
      }, 201);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getAssessmentHistory(req, res) {
    try {
      const assessments = await AssessmentService.getUserAssessmentHistory(req.user.id);

      return successResponse(res, 'Assessment history retrieved', {
        assessments,
        count: assessments.length
      });
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getAssessmentStats(req, res) {
    try {
      const stats = await AssessmentService.getAssessmentStats(req.user.id);

      return successResponse(res, 'Assessment statistics retrieved', stats);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getLatestAssessment(req, res) {
    try {
      const { type } = req.params;

      if (!['phq9', 'gad7'].includes(type)) {
        return errorResponse(res, 'Invalid assessment type', 400);
      }

      const assessment = await Assessment.getLatestAssessment(req.user.id, type);

      if (!assessment) {
        return errorResponse(res, 'No assessment found', 404);
      }

      return successResponse(res, 'Latest assessment retrieved', assessment);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }
}

module.exports = AssessmentController;

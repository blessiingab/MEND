/**
 * Assessment Service - Mental health assessment business logic
 */
const Assessment = require('../models/Assessment');
const { ASSESSMENTS } = require('../config/constants');

class AssessmentService {
  static async scorePHQ9(answers) {
    // PHQ-9 has 9 questions, each scored 0-3
    if (!Array.isArray(answers) || answers.length !== 9) {
      throw new Error('PHQ-9 requires exactly 9 answers');
    }

    const totalScore = answers.reduce((sum, answer) => {
      if (typeof answer !== 'number' || answer < 0 || answer > 3) {
        throw new Error('Each answer must be 0-3');
      }
      return sum + answer;
    }, 0);

    const severity = Assessment.calculatePHQ9Severity(totalScore);

    return {
      type: ASSESSMENTS.PHQ9,
      totalScore,
      severity,
      interpretation: this.getPHQ9Interpretation(totalScore)
    };
  }

  static async scoreGAD7(answers) {
    // GAD-7 has 7 questions, each scored 0-3
    if (!Array.isArray(answers) || answers.length !== 7) {
      throw new Error('GAD-7 requires exactly 7 answers');
    }

    const totalScore = answers.reduce((sum, answer) => {
      if (typeof answer !== 'number' || answer < 0 || answer > 3) {
        throw new Error('Each answer must be 0-3');
      }
      return sum + answer;
    }, 0);

    const severity = Assessment.calculateGAD7Severity(totalScore);

    return {
      type: ASSESSMENTS.GAD7,
      totalScore,
      severity,
      interpretation: this.getGAD7Interpretation(totalScore)
    };
  }

  static getPHQ9Interpretation(score) {
    if (score >= 20) return 'Severe depression - Immediate professional help recommended';
    if (score >= 15) return 'Moderately severe depression - Professional treatment recommended';
    if (score >= 10) return 'Moderate depression - Consider professional support';
    if (score >= 5) return 'Mild depression - Continue self-care and monitor';
    return 'Minimal or no depressive symptoms';
  }

  static getGAD7Interpretation(score) {
    if (score >= 15) return 'Severe anxiety - Immediate professional help recommended';
    if (score >= 10) return 'Moderate anxiety - Professional support recommended';
    if (score >= 5) return 'Mild anxiety - Consider professional support or self-help';
    return 'Minimal or no anxiety';
  }

  static async saveAssessment(userId, assessmentData) {
    const assessment = await Assessment.createAssessment({
      userId,
      type: assessmentData.type,
      answers: assessmentData.answers,
      totalScore: assessmentData.totalScore,
      severity: assessmentData.severity
    });

    return assessment;
  }

  static async getUserAssessmentHistory(userId) {
    return await Assessment.getUserAssessments(userId);
  }

  static async getAssessmentStats(userId) {
    return await Assessment.getUserAssessmentStats(userId);
  }
}

module.exports = AssessmentService;

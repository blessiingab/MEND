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
    const assessments = await Assessment.getUserAssessments(userId);
    return assessments.map((assessment) => ({
      id: assessment.id,
      userId: assessment.user_id || assessment.userId,
      type: assessment.type,
      score: assessment.total_score ?? assessment.score,
      severity: assessment.severity,
      createdAt: assessment.created_at || assessment.createdAt
    }));
  }

  static calculateMoodStreak(assessments) {
    const parsedDates = Array.from(
      new Set(
        assessments
          .map((a) => (a.created_at || a.createdAt))
          .filter((v) => v)
          .map((v) => new Date(v).toDateString())
      )
    ).sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    let currentDay = new Date();
    while (true) {
      const dayString = currentDay.toDateString();
      if (parsedDates.includes(dayString)) {
        streak += 1;
        currentDay.setDate(currentDay.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  static async getAssessmentStats(userId) {
    const typeStats = await Assessment.getUserAssessmentStats(userId);
    const allAssessments = await Assessment.getUserAssessments(userId, 1000, 0);

    const mapped = allAssessments.map((assessment) => ({
      ...assessment,
      score: assessment.total_score ?? assessment.score,
      createdAt: assessment.created_at || assessment.createdAt
    }));

    const totalAssessments = mapped.length;
    const avgScore =
      totalAssessments > 0
        ? parseFloat(
            (
              mapped.reduce((sum, item) => sum + Number(item.score || 0), 0) / totalAssessments
            ).toFixed(1)
          )
        : 0;
    const highestScore = totalAssessments > 0 ? Math.max(...mapped.map((a) => Number(a.score || 0))) : 0;
    const lowestScore = totalAssessments > 0 ? Math.min(...mapped.map((a) => Number(a.score || 0))) : 0;
    const streakDays = this.calculateMoodStreak(mapped);
    const completionRate = totalAssessments > 0 ? Math.round((mapped.filter((m) => Number(m.score) > 0).length / totalAssessments) * 100) : 0;
    const dates = mapped
      .map((a) => new Date(a.createdAt))
      .filter((d) => !Number.isNaN(d.getTime()));
    const startDate = dates.length ? new Date(Math.min.apply(null, dates)) : null;
    const totalDays = startDate ? Math.max(1, Math.ceil((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24))) : 0;
    const latestAssessment = mapped.length > 0 ? mapped[0] : null;

    return {
      typeStats,
      totalAssessments,
      averageScore: avgScore,
      highestScore,
      lowestScore,
      moodStreak: streakDays,
      completionRate,
      totalDays,
      latestAssessment
    };
  }
}

module.exports = AssessmentService;

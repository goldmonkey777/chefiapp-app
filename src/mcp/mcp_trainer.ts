// ChefIApp™ - MCP_TRAINER Server
// ChefIApp Academy - Courses, Exams and Certificates

import { Course, CourseModule, Quiz, ExamResult, Certificate, IndustryTrend } from './types';

export function generateCourse(
  title: string,
  description: string,
  industry: 'hospitality' | 'restaurant' | 'hotel' | 'catering' | 'general' = 'hospitality',
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' = 'intermediate'
): Course {
  const moduleCount = difficulty === 'beginner' ? 3 : difficulty === 'intermediate' ? 5 : 7;
  const modules: CourseModule[] = [];

  for (let i = 0; i < moduleCount; i++) {
    modules.push({
      id: `module-${i + 1}`,
      title: `Módulo ${i + 1}: ${title} - Parte ${i + 1}`,
      content: `Conteúdo do módulo ${i + 1}...`,
      quiz: {
        questions: [
          {
            question: `Pergunta ${i + 1} sobre ${title}?`,
            options: ['Opção A', 'Opção B', 'Opção C', 'Opção D'],
            correctAnswer: 0,
            explanation: 'Explicação da resposta correta.',
          },
        ],
        passingScore: 70,
      },
      order: i + 1,
    });
  }

  return {
    id: `course-${Date.now()}`,
    title,
    description,
    industry,
    difficulty,
    modules,
    estimatedHours: moduleCount * 2,
    createdAt: new Date().toISOString(),
  };
}

export function gradeExam(
  userId: string,
  courseId: string,
  answers: number[],
  correctAnswers: number[]
): ExamResult {
  const totalQuestions = correctAnswers.length;
  let correct = 0;

  for (let i = 0; i < totalQuestions; i++) {
    if (answers[i] === correctAnswers[i]) correct++;
  }

  const score = Math.round((correct / totalQuestions) * 100);
  const passed = score >= 70;

  const certificateId = passed ? `cert-${userId}-${courseId}-${Date.now()}` : undefined;

  return {
    userId,
    courseId,
    score,
    totalQuestions,
    correctAnswers: correct,
    passed,
    feedback: passed
      ? 'Parabéns! Você passou no exame.'
      : 'Você não atingiu a nota mínima. Tente novamente.',
    certificateId,
    completedAt: new Date().toISOString(),
  };
}

export function generateCertificate(
  userName: string,
  courseName: string,
  completionDate: string
): Certificate {
  const id = `cert-${Date.now()}`;

  return {
    id,
    userId: 'user-id',
    userName,
    courseId: 'course-id',
    courseName,
    issueDate: completionDate,
    qrCode: `https://chefiapp.com/verify/${id}`,
  };
}

export function updateCourseWithTrends(topic: string): IndustryTrend[] {
  return [
    {
      topic,
      description: `Tendência atual em ${topic}`,
      relevance: 85,
      sources: ['Industry Report 2025', 'Hospitality Today'],
      updatedAt: new Date().toISOString(),
    },
  ];
}

export const MCPTrainer = {
  generateCourse,
  gradeExam,
  generateCertificate,
  updateCourseWithTrends,
};

export default MCPTrainer;

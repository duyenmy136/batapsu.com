import { ExamConfig, ExamQuestion } from '@/components/ExamSimulator';

const ccbaExamConfig: ExamConfig = {
  title: 'CCBA Practice Exam',
  certName: 'CCBA',
  totalTimeMinutes: 70,
  passingScore: 70,
  questionsPerExam: 50,
  kaLabels: {
    planning: 'BA Planning & Monitoring',
    elicitation: 'Elicitation & Collaboration',
    rlm: 'Requirements Life Cycle Mgmt',
    strategy: 'Strategy Analysis',
    radd: 'Requirements Analysis & Design Definition',
    se: 'Solution Evaluation',
  },
  kaDistribution: {
    planning: 6,
    elicitation: 10,
    rlm: 9,
    strategy: 6,
    radd: 16,
    se: 3,
  },
  questionPool: [],
};

export default ccbaExamConfig;

'use client';

import ExamSimulator from './ExamSimulator';
import LoginGate from './LoginGate';
import ecbaExamConfig from '@/data/ecba-exam';

export default function EcbaExam() {
    return (
        <LoginGate>
            <ExamSimulator config={ecbaExamConfig} />
        </LoginGate>
    );
}

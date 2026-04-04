'use client';

import ExamSimulator from './ExamSimulator';
import LoginGate from './LoginGate';
import ccbaExamConfig from '@/data/ccba-exam';

export default function CcbaExam() {
    return (
        <LoginGate>
            <ExamSimulator config={ccbaExamConfig} />
        </LoginGate>
    );
}

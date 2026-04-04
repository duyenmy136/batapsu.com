'use client';

import ExamSimulator from './ExamSimulator';
import LoginGate from './LoginGate';
import cbapExamConfig from '@/data/cbap-exam';

export default function CbapExam() {
    return (
        <LoginGate>
            <ExamSimulator config={cbapExamConfig} />
        </LoginGate>
    );
}

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Thi thử — Practice Exam',
    description: 'Đề thi thử CCBA & CBAP với giao diện interactive, bấm giờ, chấm điểm tự động và AI đánh giá kết quả.',
};

const exams = [
    {
        slug: 'ccba-de-thi-thu',
        title: 'CCBA Practice Exam',
        subtitle: '50 câu · 70 phút · Scenario-based',
        description: 'Đề thi mô phỏng CCBA với 50 câu trắc nghiệm bao gồm tất cả 6 Knowledge Areas theo chuẩn BABOK v3.',
        icon: '🥈',
        gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        level: 'Intermediate',
        passingScore: '70%',
        questions: 50,
        time: '70 phút',
    },
    {
        slug: 'cbap-de-thi-thu',
        title: 'CBAP Practice Exam',
        subtitle: '50 câu · 70 phút · Analysis & Synthesis',
        description: 'Đề thi mô phỏng CBAP với 50 câu phân tích chuyên sâu, đòi hỏi tư duy chiến lược và kinh nghiệm enterprise-level.',
        icon: '🥇',
        gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
        level: 'Advanced',
        passingScore: '70%',
        questions: 50,
        time: '70 phút',
    },
];

export default function ThiThuPage() {
    return (
        <>
            <section className="page-header">
                <div className="container page-header__content">
                    <h1 className="page-header__title">📝 Thi thử</h1>
                    <p className="page-header__subtitle">
                        Mô phỏng bài thi thật với giao diện interactive, bấm giờ, chấm điểm tự động và AI phân tích kết quả
                    </p>
                </div>
            </section>

            <section className="section container">
                <div className="exam-list">
                    {exams.map((exam) => (
                        <Link key={exam.slug} href={`/blog/${exam.slug}`} className="exam-card">
                            <div className="exam-card__badge" style={{ background: exam.gradient }}>
                                <span className="exam-card__icon">{exam.icon}</span>
                                <span className="exam-card__level">{exam.level}</span>
                            </div>
                            <div className="exam-card__body">
                                <h2 className="exam-card__title">{exam.title}</h2>
                                <p className="exam-card__subtitle">{exam.subtitle}</p>
                                <p className="exam-card__desc">{exam.description}</p>
                                <div className="exam-card__meta">
                                    <span>📋 {exam.questions} câu</span>
                                    <span>⏱ {exam.time}</span>
                                    <span>🎯 Pass: {exam.passingScore}</span>
                                </div>
                            </div>
                            <div className="exam-card__action">
                                <span className="exam-card__btn" style={{ background: exam.gradient }}>
                                    Bắt đầu thi →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="exam-info">
                    <h3>💡 Hướng dẫn</h3>
                    <ul>
                        <li>Đăng nhập Google để lưu kết quả và nhận đánh giá AI</li>
                        <li>Mỗi đề gồm 50 câu trải đều 6 Knowledge Areas theo BABOK v3</li>
                        <li>Thời gian 70 phút — tương tự tỷ lệ thời gian/câu hỏi của bài thi thật</li>
                        <li>Sau khi nộp bài, xem giải thích chi tiết từng câu và AI phân tích điểm yếu</li>
                    </ul>
                </div>
            </section>
        </>
    );
}

'use client';

import { useAuth } from './AuthProvider';

export default function LoginGate({ children }: { children: React.ReactNode }) {
    const { user, loading, loginWithGoogle } = useAuth();

    if (loading) {
        return (
            <div className="exam-sim">
                <div className="exam-sim__intro">
                    <div className="exam-sim__intro-icon">⏳</div>
                    <h2 className="exam-sim__intro-title">Đang tải...</h2>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="exam-sim">
                <div className="exam-sim__intro">
                    <div className="exam-sim__intro-icon">🔐</div>
                    <h2 className="exam-sim__intro-title">Đăng nhập để thi thử</h2>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                        Bạn cần đăng nhập để bắt đầu làm bài thi thử.<br />
                        Kết quả sẽ được lưu lại và AI sẽ đánh giá, đưa ra lộ trình ôn tập cho bạn.
                    </p>
                    <button className="exam-sim__btn exam-sim__btn--start" onClick={loginWithGoogle}>
                        <svg width="18" height="18" viewBox="0 0 48 48" style={{ verticalAlign: 'middle', marginRight: 8 }}>
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        Đăng nhập bằng Google
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

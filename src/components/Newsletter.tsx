'use client';

export default function Newsletter() {
    return (
        <div className="newsletter">
            <h2 className="newsletter__title">📬 Đăng ký nhận bài viết mới</h2>
            <p className="newsletter__desc">
                Nhận thông báo khi có bài viết mới, hoàn toàn miễn phí!
            </p>
            <form className="newsletter__form" onSubmit={(e) => e.preventDefault()}>
                <input
                    type="email"
                    className="newsletter__input"
                    placeholder="email@example.com"
                    aria-label="Email"
                />
                <button type="submit" className="newsletter__btn">
                    Đăng ký
                </button>
            </form>
        </div>
    );
}

import { Metadata } from 'next';
import Image from 'next/image';
import Newsletter from '@/components/Newsletter';

export const metadata: Metadata = {
    title: 'Về mình',
    description: 'Giới thiệu về BA Tập Sự - Blog chia sẻ kiến thức Business Analysis cho người mới bắt đầu.',
};

export default function AboutPage() {
    return (
        <>
            <section className="page-header">
                <div className="container page-header__content">
                    <h1 className="page-header__title">👋 Về mình</h1>
                    <p className="page-header__subtitle">
                        Chào bạn! Mình là tác giả đằng sau BA Tập Sự
                    </p>
                </div>
            </section>

            <section className="section container">
                <div className="about-hero">
                    <div className="about-hero__image">
                        <Image
                            src="/logo.png"
                            alt="BA Tập Sự Avatar"
                            width={300}
                            height={300}
                        />
                    </div>
                    <div className="about-hero__content">
                        <h2 className="about-hero__name">BA Tập Sự 💜</h2>
                        <p className="about-hero__role">Business Analyst | Blogger | Tech Lover</p>
                        <p className="about-hero__bio">
                            Xin chào! Mình là một nữ Business Analyst đang trên hành trình khám phá
                            và chia sẻ kiến thức về nghề BA.
                        </p>
                        <p className="about-hero__bio">
                            Blog <strong>BA Tập Sự</strong> được tạo ra với mong muốn giúp các bạn mới bắt đầu
                            có thể tiếp cận kiến thức BA một cách dễ hiểu, thực tế và thú vị nhất.
                            Mình tin rằng ai cũng có thể trở thành BA giỏi nếu có đam mê và sự kiên trì! 🚀
                        </p>
                        <p className="about-hero__bio">
                            Tại blog này, bạn sẽ tìm thấy:
                        </p>
                        <ul style={{ color: 'var(--text-secondary)', lineHeight: '2', paddingLeft: '1.5rem' }}>
                            <li>📚 Kiến thức BA từ cơ bản đến nâng cao</li>
                            <li>🛠️ Hướng dẫn sử dụng các công cụ phổ biến</li>
                            <li>💡 Tips & tricks trong công việc hàng ngày</li>
                            <li>🎯 Chia sẻ kinh nghiệm phỏng vấn & phát triển sự nghiệp</li>
                            <li>💬 Kỹ năng mềm cần thiết cho BA</li>
                        </ul>
                        <p className="about-hero__bio" style={{ marginTop: '1rem' }}>
                            Nếu bạn thấy blog hữu ích, hãy chia sẻ với bạn bè nhé!
                            Đừng ngại liên hệ với mình qua email hoặc mạng xã hội.
                            Mình luôn sẵn sàng lắng nghe và trao đổi! 💌
                        </p>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="container">
                <Newsletter />
            </section>
        </>
    );
}

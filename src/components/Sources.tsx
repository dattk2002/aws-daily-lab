import { ArrowUpRight, GitFork, BookOpen, ShieldCheck } from "./Icons";

export function Sources() {
  const sources = [
    {
      title: "AWS Full Course — James McArthur",
      desc: "Nguồn cảm hứng và tuyến triển khai EC2 → RDS → Nginx → ALB. Tham khảo README, INSTRUCTIONS và video của tác giả.",
      url: "https://github.com/jamezmca/aws-full-course",
      icon: GitFork,
    },
    {
      title: "AWS Documentation",
      desc: "Nguồn chính thức cho cấu hình, giới hạn, kết nối và thao tác từng dịch vụ. Mỗi bài có liên kết tài liệu liên quan.",
      url: "https://docs.aws.amazon.com/",
      icon: BookOpen,
    },
    {
      title: "AWS IAM best practices",
      desc: "MFA, quyền tối thiểu và credentials tạm thời. Bảo mật được gắn vào từng bước thực hành.",
      url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
      icon: ShieldCheck,
    },
    {
      title: "AWS Free / Paid account plans",
      desc: "Kiểm tra điều kiện thực tế của tài khoản. Không mặc định tài nguyên gắn nhãn micro đều miễn phí.",
      url: "https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier-plans.html",
      icon: BookOpen,
    },
  ];
  return (
    <>
      <header className="page-heading">
        <div className="eyebrow">HỌC CÓ CĂN CỨ</div>
        <h1>
          Nguồn rõ ràng.
          <br />
          <span>Hiểu điều mình đang làm.</span>
        </h1>
        <p>
          Bài học tiếng Việt và mã lab được viết riêng cho lộ trình này, có đối
          chiếu tài liệu chính thức.
        </p>
      </header>
      <div className="source-grid">
        {sources.map((source) => (
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="source-card"
            key={source.url}
          >
            <source.icon size={24} aria-hidden="true" />
            <div>
              <h2>{source.title}</h2>
              <p>{source.desc}</p>
            </div>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        ))}
      </div>
      <div className="editorial-note">
        <h2>Đọc lộ trình như thế nào?</h2>
        <p>
          Ngày 01–12 là tuyến nền tảng và triển khai chính dựa trên chủ đề của
          khóa nguồn, với phần tài khoản, bảo mật, HTTPS và kiểm tra được bổ
          sung. Ngày 13–20 mở rộng sang lưu trữ, backup, CI/CD, scaling và sự
          cố; một số chủ đề được khóa gốc giới thiệu ở phần cuối.
        </p>
        <p>
          Đây là lộ trình học thực hành, không phải khóa luyện chứng chỉ hoặc
          cam kết một bản demo đã đáp ứng mọi yêu cầu production. Các lab cloud
          là hướng dẫn để bạn tự thực hiện; chúng chưa được xác minh bằng tài
          khoản AWS trong quá trình xây dựng website.
        </p>
        <a
          className="text-link"
          href="https://github.com/dattk2002/aws-daily-lab/blob/main/docs/SOURCES.md"
          target="_blank"
          rel="noreferrer"
        >
          Xem ghi chú biên soạn
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </>
  );
}

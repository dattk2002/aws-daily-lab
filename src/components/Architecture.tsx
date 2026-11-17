import { Cloud, Database, GitBranch, Server, ShieldCheck } from "./Icons";

export function Architecture() {
  return (
    <div
      className="architecture"
      role="img"
      aria-label="Sơ đồ kiến trúc mục tiêu: người dùng gửi HTTPS qua ALB, Nginx và Node.js trên EC2 tới PostgreSQL private trên RDS."
    >
      <div className="diagram-top">
        <span className="live-dot" /> KIẾN TRÚC BẠN SẼ XÂY{" "}
        <span className="mono">ap-southeast-1</span>
      </div>
      <div className="cloud-boundary">
        <div className="boundary-label">
          <Cloud size={15} aria-hidden="true" /> AWS CLOUD
        </div>
        <div className="diagram-node node-alb">
          <span className="node-icon orange">
            <GitBranch aria-hidden="true" />
          </span>
          <div>
            <strong>Application Load Balancer</strong>
            <span>HTTPS · Phân phối request</span>
          </div>
        </div>
        <div className="diagram-connector">
          <span>HTTP :80</span>
        </div>
        <div className="diagram-node">
          <span className="node-icon blue">
            <Server aria-hidden="true" />
          </span>
          <div>
            <strong>EC2 + Nginx + Node.js</strong>
            <span>Ứng dụng rút gọn URL</span>
          </div>
          <code>:3000</code>
        </div>
        <div className="diagram-connector">
          <span>TLS :5432</span>
        </div>
        <div className="diagram-node">
          <span className="node-icon mint">
            <Database aria-hidden="true" />
          </span>
          <div>
            <strong>RDS PostgreSQL</strong>
            <span>Database private · Chỉ nhận từ EC2</span>
          </div>
        </div>
      </div>
      <div className="diagram-bottom">
        <ShieldCheck size={14} aria-hidden="true" />
        <span>Hiểu từng lớp. Tự tay triển khai.</span>
        <span className="diagram-dots">•••</span>
      </div>
    </div>
  );
}

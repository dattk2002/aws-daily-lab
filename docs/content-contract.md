# Curriculum authoring contract

Write original Vietnamese learning material. Do not copy upstream code or prose. Read the approved design topic table at `docs/superpowers/specs/2026-11-17-aws-daily-lab-design.md`. Each author owns only assigned day directories.

## Files and metadata

`content/day-DD/day.json`:

```json
{
  "day": 1,
  "title": "Hiểu hệ thống cần xây",
  "summary": "One concrete Vietnamese sentence about the day's outcome.",
  "track": "core",
  "lessons": [
    {
      "id": "01-1",
      "title": "AWS trong một request",
      "minutes": 10,
      "kind": "concept",
      "services": ["AWS"],
      "prerequisites": [],
      "quiz": {
        "question": "One unambiguous question?",
        "options": ["Answer A", "Answer B", "Answer C"],
        "answer": 1,
        "explanation": "Explain why the zero-based answer is correct."
      }
    }
  ]
}
```

Exactly five lessons per day, ordered IDs `DD-1` through `DD-5`; Markdown at `content/day-DD/1.md` through `5.md`. `track`: `core` days 1–12, `extension` days 13–20. `kind`: `concept`, `lab`, or `challenge`. `minutes`: integer 5–30. `services`: short nonempty list. Prerequisites use earlier lesson IDs; first lesson on day N may depend on preceding day's fifth lesson, all other lessons normally depend on the preceding lesson. Avoid unnecessary cross-day prerequisites, but explain real setup dependencies in prose. Quizzes exactly 3 or 4 distinct choices with integer zero-based `answer`.

## Required Markdown structure

Every lesson has H1 title and these exact H2 headings (can add H3 under them):

- `## Mục tiêu`
- `## Hiểu nhanh`
- `## Thực hành`
- `## Kiểm tra kết quả`
- `## Lỗi thường gặp`
- `## Dọn dẹp`
- `## Tài liệu`

At least 1,600 meaningful characters per Markdown lesson; aim 2,200–4,000+. Explain the actual topic, give precise steps, commands or concrete reasoning deliverable, expected results and relevant errors. No generic duplicated filler. Include at least one official relevant primary-source HTTPS documentation link per lesson. Concept lessons have an actual exercise and expected response; cleanup can state that no cloud resources were created. Cloud labs specify costs qualitatively, what to keep for the next lesson and teardown steps; budget alerts are not spending caps. Never claim Free Tier guarantees zero cost. Don't use emoji.

## Shared app contract

An ORIGINAL example is supplied by primary implementer at `labs/url-shortener/`: Node.js >=22 native HTTP, PostgreSQL via `pg`; `GET /health` liveness returns `{ "status": "ok" }`, `GET /ready` checks DB and returns 200 or 503; `POST /shorten` with `{ "url": "https://example.com" }` returns 201 JSON `{ "code": "...", "shortUrl": ".../r/..." }`; `GET /r/:code` returns 302 for known URL, 404 otherwise. Environment: `DATABASE_URL`, `PORT` default 3000, `HOST` default `127.0.0.1`, `PUBLIC_BASE_URL`, optional `PGSSLROOTCERT` path. For container local DB use `labs/url-shortener/compose.yaml`, DB postgres:17-alpine, user/password/database `lab` for local-only development. `.env.example` holds local dummy credentials and must never imply production values. Node demo supports `npm run db:init`, `npm start`, `npm test`; root package handles UI only. SQL creates `links (code TEXT PRIMARY KEY, url TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())` idempotently. Nginx example lives at `labs/nginx/url-shortener.conf`, proxies `127.0.0.1:3000`, port 80. PM2 process name `aws-daily-lab`, working directory example `/opt/aws-daily-lab/labs/url-shortener`; use non-root app user with ownership limited to app path.

Commands assume Bash and Amazon Linux 2023 for EC2; local dev Linux/macOS or WSL2. Any command making cloud mutations is EDUCATIONAL ONLY and must be run deliberately by learner. Primary implementer does not execute AWS commands. IAM human access uses temporary/federated credentials when available, root reserved for root-only administration and MFA. Avoid forcing Organizations setup because of Free plan consequences. Private RDS with TLS verification, SG source references; no credentials in Git, inline shells or public pages. Treat domains/ACM as optional paid prerequisites; ALB default AWS hostname cannot get a certificate for a domain learner doesn't own.

RDS automated snapshots and logical pg_dump/restore are distinct: S3 snapshot export is NOT a restorable RDS snapshot. CI/CD lessons need complete preparation assumptions and actual runnable or clearly scoped snippets, not an invented one-click production workflow. OIDC trust limited to exact repo/branch and `aud`; use role placeholders. All AWS CLI destructive examples must target explicitly named lab resources, never wildcard/broad account deletion.

## Finish

Validate JSON and all expected Markdown paths. Return a concise list of files, source checks and any limitation. Do not change app files, package files, design, other authors' directories or Git state; no commits/push/deployment. Authors may create `content/day-DD` only.

# AWS Daily Lab workflow

## User-confirmed publication rule

- Tran Kim Dat wants a prepared learning roadmap and GitHub contributions in batches of five lessons.
- Only start a publication batch when the user requests it, for example `chạy 5 bài`. This means prepare, check, commit and push lesson content; it does not mean teach five lessons in chat, ask quiz questions, install AWS tools or run AWS account operations.
- Each batch contains five distinct lessons, with one meaningful commit per lesson. Push the five commits together after the complete batch passes its relevant checks.
- Do not publish the remaining roadmap in one bulk commit. Do not create a cron job, scheduled workflow or background publisher.
- A response choosing the manual mode is not itself a request to publish a batch.

## Publication record and existing content

- Inspect `publication-log.json`, Git history, the working tree and the remote before choosing the next five lessons. Preserve existing user changes.
- The initial public commit `ad27dfe075d85fd1d4171bf2cd06b84114ee4129` contains all 100 lessons and the site. This was an earlier misunderstanding, not a completed five-lesson publication batch.
- Preserve that history unless the user explicitly authorizes a specific history rewrite. Use actual commit dates.
- Existing published material must not be represented as newly authored or previously unpublished. Any revision must add useful learning content, examples, practical artifacts or corrections; describe it accurately in the commit message and publication record.
- Record each actually committed lesson in `publication-log.json` as part of its own lesson commit. Distinguish `new` from `revision`; do not record the learner as having completed the lesson.
- Never create empty commits, cosmetic-only changes or duplicate articles solely to increase contribution counts.

## Checks and delivery

- Follow `docs/content-contract.md` for lesson quality and sources. Check current official documentation for details that can change.
- Run checks appropriate to the changed content and code before committing. Preserve the working website and verify deployment when the batch changes its content.
- Use native `git` for commits/push and `gh` for GitHub workflow state. An uncertain push must be inspected before retrying.
- Report the five lesson titles, their actual commit links, push verification and CI/deployment status. Keep the chat response short and omit learner quiz questions.

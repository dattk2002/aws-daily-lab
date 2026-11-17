# AWS Daily Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Ship the approved public AWS learning repository, 100 Vietnamese lessons and a working GitHub Pages learning interface.

**Architecture:** Static React application consumes twenty day manifests and Markdown lesson files. Browser-local progress is versioned and validated; no AWS resources or backend are provisioned. Independent curriculum groups are authored in parallel under a fixed content contract; application integration and Git operations stay with the primary implementer.

**Tech Stack:** React, TypeScript, Vite, react-markdown, GSAP, Node test runner, Playwright for browser QA.

**Spec:** `docs/superpowers/specs/2026-11-17-aws-daily-lab-design.md`, approved by user including public GitHub Pages; repository subsequently supplied by user.

## Global Constraints

- 20 days × 5 lessons = 100 original Vietnamese lessons; prewritten curriculum, no scheduled commits.
- Preserve existing user work; remote inspected empty before initialization.
- No AWS credentials, cloud mutations or claims of live AWS verification.
- Markdown and metadata are the source of truth; source attribution and official AWS documentation.
- Responsive, semantic navigation, visible focus, reduced motion and real progress only.

## Review Focus

- Corrupt/imported local data: reject invalid versions, unknown IDs and invalid answers without losing current progress.
- Incomplete days: resume first unfinished lesson; a partial day is not marked complete.
- Deep links under `/aws-daily-lab/`: refresh and browser history keep the intended lesson.
- Unavailable browser storage: keep usable in-memory progress and communicate persistence failure.
- Lab prerequisites and cleanup: network, role, database and domain assumptions must be explicit.

### Task 1: Workspace and content contract

Files: package/config files, `docs/content-contract.md`, `.gitignore`, `docs/superpowers/ledger.md`.

- [x] Initialize local Git main and attach exact provided remote; no branch/worktree needed for an empty new repository.
- [x] Define day manifests, lesson IDs, Markdown sections and quiz schema.
- [x] Install declared dependencies and create build/CI configuration.

### Task 2: Curriculum

Files: `content/day-01` through `content/day-20`, `scripts/check-content.mjs`.

Interface: each `day.json` has day, title, summary, track and exactly five lessons; lesson ID `DD-N`, title, minutes, kind, services, prerequisites and quiz. Markdown at `content/day-DD/N.md`.

- [x] Write content validator tests for missing sections, duplicate IDs, invalid prerequisite/quiz.
- [x] Author twenty days in five independent groups, following the contract and approved topic table.
- [x] Implement validator and pass all tests plus check all 100 lessons.

### Task 3: Learning state

Files: `src/lib/progress.ts`, `src/lib/progress.test.ts`, `src/lib/content.ts`.

Interface: `parseProgress(raw, ids)`, `toggleCompleted(progress,id)`, `getCurrentDay(days,completed)`; schema `{version:1, completed:string[], answers:Record<string,number>, notes:Record<string,string>}`.

- [x] Write failing tests for corrupted data, duplicate/unknown IDs, invalid answers, partial-day resumption, completion toggle.
- [x] Implement pure helpers; run focused tests and full unit suite.

### Task 4: Interface

Files: `src/App.tsx`, `src/components/*`, `src/styles.css`, `src/main.tsx`, `index.html`, `public/*`.

Consumes validated curriculum and progress helpers. Produces hash routes: today, roadmap, labs, sources, lesson/DD-N, settings.

- [x] Implement today, roadmap search/filter, lesson reader with code copy and TOC, quiz feedback, notes, completion, navigation.
- [x] Implement settings for export/import/reset and storage failure feedback.
- [x] Add scoped GSAP motion, reduced motion and responsive behavior.
- [x] Run typecheck/build; verify user flows in browser and three screen sizes, keyboard and console.

### Task 5: Practical artifacts and documentation

Files: `labs/`, `README.md`, `docs/SOURCES.md`, `docs/LEARNING.md`, `.github/workflows/pages.yml`.

- [x] Supply original local demo, sample env, Nginx/runbook and no secret values; align lessons with actual demo paths/endpoints.
- [x] Document prerequisites, costs, teardown, local-only progress and curriculum mapping.
- [x] CI runs tests, content validation and production build before Pages deploy.

### Task 6: Review, publish, verify

- [ ] Fresh read-only review of implementation and curriculum; address important findings.
- [ ] Run unit tests, content checker, TypeScript/build, browser QA and local demo tests.
- [ ] Inspect tracked payload, remote and branch; commit coherent changes, push with native Git.
- [ ] Enable GitHub Pages, watch workflow, verify live URL and remote commit.
- [ ] Report repository/site links, checks and AWS lab verification limitation.

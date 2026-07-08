# Retail Analytics Platform

Production-oriented SaaS platform for counting retail visitors from existing
CCTV, webcam, RTSP, or test video sources.

Primary components:

- `ai-agent`: local Python computer-vision agent with SQLite offline cache.
- `backend`: NestJS, Prisma, and PostgreSQL API for auth, sync, events, and analytics.
- `dashboard`: reserved for the future Next.js dashboard implementation.

Documentation in `docs/` is the source of truth for architecture and business
rules.

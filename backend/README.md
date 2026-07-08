# Retail Analytics Backend

NestJS API for authentication, store and camera management, AI Agent
synchronization, visitor events, and analytics.

## Setup

```powershell
copy .env.example .env
npm.cmd install
npm.cmd run prisma:generate
npm.cmd run prisma:migrate
npm.cmd run prisma:seed
npm.cmd run start:dev
```

The API is served under `/api/v1`.

## AI Agent Contract

Register an agent from an authenticated dashboard session:

```http
POST /api/v1/agent/register
Authorization: Bearer <user-jwt>
```

The returned agent token is shown once. Configure the AI Agent with:

- `BACKEND_BASE_URL=http://localhost:3000/api/v1`
- `AGENT_API_TOKEN=<token>`
- `AGENT_ID`, `STORE_ID`, and `CAMERA_ID` from the registration response

Event synchronization endpoint:

```http
POST /api/v1/agent/events/batch
Authorization: Bearer <agent-token>
```

The backend treats visitor event IDs as idempotency keys, so retrying the same
event cannot create duplicate analytics.

## Dashboard Account APIs

Authenticated dashboard users can update their profile and password:

```http
PATCH /api/v1/users/me
PATCH /api/v1/users/me/password
Authorization: Bearer <user-jwt>
```

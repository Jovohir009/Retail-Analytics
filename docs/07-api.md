# API

## Overview

The Retail Analytics Platform exposes a secure REST API that enables communication between the AI Agent, Backend, and Dashboard.

The API acts as the single communication layer for the entire platform.

All clients communicate only with the backend.

No component communicates directly with the database or other services.

---

# API Principles

The API follows these principles:

- RESTful architecture
- Stateless requests
- JSON request/response format
- HTTPS only
- Secure authentication
- Consistent response structure
- Versioned endpoints
- Production-ready design

---

# Communication Flow

```
AI Agent
      │
 HTTPS REST API
      ▼
Backend
      ▲
 HTTPS REST API
      │
Dashboard
```

All requests pass through the backend.

The Dashboard never communicates with the AI Agent.

The AI Agent never communicates with the Dashboard.

---

# API Consumers

## Dashboard

The dashboard consumes APIs for:

- Authentication
- User profile
- Store information
- Camera information
- Visitor analytics
- Dashboard statistics

---

## AI Agent

The AI Agent consumes APIs for:

- Authentication
- Registration
- Synchronization
- Health reporting
- Camera registration
- Visitor event upload

---

# Authentication

The API uses token-based authentication.

Authentication is required for all protected endpoints.

Authentication types:

### User Authentication

Used by the Dashboard.

Purpose:

- Login
- Dashboard access
- User management

---

### AI Agent Authentication

Used by the AI Agent.

Purpose:

- Secure synchronization
- Event uploads
- Health reporting

Every AI Agent should have its own identity.

---

# API Versioning

All endpoints should be versioned.

Example:

```
/api/v1/
```

Future breaking changes should introduce new API versions without affecting existing clients.

Example:

```
/api/v2/
```

---

# Endpoint Groups

The API is organized into logical modules.

## Authentication

Responsibilities:

- Login
- Logout
- Refresh token
- Password management

---

## Users

Responsibilities:

- Profile
- Account settings

---

## Stores

Responsibilities:

- Store information
- Store settings

---

## Cameras

Responsibilities:

- Register camera
- Camera status
- Camera information

---

## AI Agent

Responsibilities:

- Agent registration
- Agent authentication
- Heartbeat
- Synchronization

---

## Visitor Events

Responsibilities:

- Upload visitor events
- Batch synchronization
- Event validation

---

## Analytics

Responsibilities:

- Live statistics
- Daily reports
- Weekly reports
- Monthly reports

---

# Request Format

Every request should:

- Use HTTPS
- Send JSON payloads
- Include authentication token when required

Example structure:

```json
{
    "field": "value"
}
```

---

# Response Format

Successful responses should follow a consistent structure.

Example:

```json
{
    "success": true,
    "message": "Operation completed successfully.",
    "data": {}
}
```

---

Error responses should also be consistent.

Example:

```json
{
    "success": false,
    "message": "Authentication failed.",
    "errors": []
}
```

Clients should never rely on HTTP status codes alone.

---

# HTTP Status Codes

The API should use standard HTTP status codes.

Examples:

- 200 OK
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict
- 422 Validation Error
- 500 Internal Server Error

---

# Validation

Every request should be validated before processing.

Validation includes:

- Required fields
- Data types
- Authentication
- Authorization
- Ownership verification

Invalid requests should never reach business logic.

---

# Synchronization

The AI Agent synchronizes visitor events with the backend.

Synchronization supports:

- Single event upload
- Batch upload
- Retry failed uploads

Synchronization should be idempotent.

Sending the same visitor event multiple times must never create duplicates.

---

# Heartbeat

The AI Agent periodically sends heartbeat requests.

Purpose:

- Verify agent availability
- Monitor connection status
- Display online/offline status

Heartbeat requests do not contain visitor analytics.

---

# Error Handling

The API should provide clear error messages.

Errors should:

- Explain the problem
- Avoid exposing internal implementation
- Help clients recover

Unexpected server errors should be logged internally.

---

# Rate Limiting

The API should support rate limiting.

Purpose:

- Prevent abuse
- Protect backend resources
- Improve stability

Normal AI Agent synchronization should never be affected by rate limiting.

---

# Security

The API should enforce:

- HTTPS only
- Authentication
- Authorization
- Input validation
- Ownership verification

Sensitive information must never be exposed.

Camera credentials must never be returned through the API.

---

# Performance

The API should prioritize:

- Low latency
- Fast synchronization
- Efficient batch processing
- Minimal payload size

Large analytics queries should be optimized by the backend.

---

# Future Extensions

The API should be designed to support:

- Mobile applications
- Public API access
- Third-party integrations
- Webhooks
- Report export
- Notifications

These features should extend the existing API without breaking compatibility.

---

# Design Principles

The API should always be:

- RESTful
- Secure
- Stateless
- Consistent
- Versioned
- Easy to consume
- Scalable
- Production-ready

Every endpoint should have a single responsibility and follow the same request and response conventions.
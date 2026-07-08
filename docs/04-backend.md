# Backend

## Overview

The backend is the central cloud service of the Retail Analytics Platform.

It connects all components of the system by receiving visitor events from AI Agents, storing business data, generating analytics, and serving information to the web dashboard.

The backend never performs AI processing or accesses CCTV cameras directly.

Its primary responsibility is business logic and data management.

---

# Responsibilities

The backend is responsible for:

- User authentication
- User authorization
- Store management
- Camera management
- Receiving visitor events
- Generating analytics
- Providing dashboard data
- Synchronizing AI Agents
- Monitoring AI Agent health
- Managing system configuration

The backend does not process video streams.

---

# Backend Modules

The backend is divided into independent modules.

Each module has a single responsibility.

---

## Authentication Module

Responsibilities:

- User registration
- User login
- Password management
- Token generation
- Token validation
- Session management

Only authenticated users may access protected resources.

---

## User Module

Responsibilities:

- User profile
- Account settings
- Password updates
- User permissions

Future versions may support multiple user roles.

---

## Store Module

Responsibilities:

- Create stores
- Update store information
- Manage store settings

For MVP:

One account owns one store.

---

## Camera Module

Responsibilities:

- Register cameras
- Store camera configuration
- Monitor connection status
- Associate cameras with stores

The backend stores camera metadata only.

Camera communication happens through the AI Agent.

---

## AI Agent Module

Responsibilities:

- Register AI Agents
- Authenticate AI Agents
- Receive visitor events
- Monitor synchronization
- Track AI Agent status

The backend should always know whether an AI Agent is:

- Online
- Offline
- Synchronizing

---

## Analytics Module

Responsibilities:

- Calculate daily statistics
- Calculate weekly statistics
- Calculate monthly statistics
- Generate hourly reports
- Calculate visitor trends

Analytics are generated from stored visitor events.

---

## Dashboard Module

Responsibilities:

- Provide dashboard data
- Serve reports
- Serve charts
- Provide live visitor statistics

The backend prepares data for visualization.

The frontend is responsible only for presentation.

---

## Notification Module

Responsibilities:

Future versions may include:

- System notifications
- Camera alerts
- AI Agent alerts
- Maintenance notifications

This module is outside the MVP scope.

---

# Event Processing

Every visitor entry follows the same workflow.

```
AI Agent

↓

Visitor Event

↓

Backend Validation

↓

Database

↓

Analytics Update

↓

Dashboard
```

Every visitor event is validated before being stored.

---

# Synchronization

The backend supports asynchronous synchronization.

AI Agents may send:

- Individual events
- Multiple cached events
- Retry failed events

Duplicate visitor events should never be stored.

---

# Live Updates

The backend provides near real-time updates.

Whenever new visitor events are received:

- Statistics are updated.
- Connected dashboards receive fresh data.
- Charts reflect the newest information.

The backend should minimize latency while avoiding unnecessary processing.

---

# Security

Every request must be authenticated.

The backend should validate:

- User identity
- AI Agent identity
- Request integrity
- Store ownership

Unauthorized requests must be rejected.

---

# Scalability

The backend should support future expansion without redesign.

Future capabilities include:

- Multiple stores
- Multiple cameras
- Multiple entrances
- Multiple AI Agents
- Mobile applications
- Public APIs

The architecture should allow horizontal scaling.

---

# Error Handling

The backend should gracefully handle:

- Invalid requests
- Duplicate events
- Missing data
- Temporary database failures
- AI Agent disconnections

Unexpected errors should be logged without exposing internal details.

---

# Logging

The backend should log:

- Authentication events
- Synchronization events
- Visitor event processing
- Errors
- Warnings
- Critical failures

Logs should assist debugging without exposing sensitive information.

---

# Performance Goals

The backend should provide:

- Fast authentication
- Low response latency
- Efficient event processing
- Reliable synchronization
- Stable long-running operation

Performance should remain consistent as visitor traffic increases.

---

# Design Principles

The backend follows these principles:

- Single responsibility per module
- Stateless request handling
- Secure by default
- Modular architecture
- Easy maintenance
- Easy testing
- Production-ready implementation

Every new feature should extend existing modules without introducing unnecessary coupling.
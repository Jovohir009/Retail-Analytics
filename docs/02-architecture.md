# System Architecture

## Overview

Retail Analytics Platform follows a distributed architecture consisting of two independent applications connected through secure cloud APIs.

The architecture is designed to provide:

- High reliability
- Scalability
- Offline support
- Easy deployment
- Low network usage
- Clear separation of responsibilities

Video processing always happens locally while analytics and reporting are handled in the cloud.

---

# High-Level Architecture

```
                 CCTV Camera
                      │
              RTSP / Webcam / Video
                      │
                      ▼
               AI Agent (Local PC)
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
   Local SQLite Cache      Cloud REST API
                                    │
                                    ▼
                             Backend Server
                                    │
                                    ▼
                              PostgreSQL
                                    │
                                    ▼
                           Web Dashboard
```

---

# Architecture Principles

The platform follows these principles:

- Every component has a single responsibility.
- Components communicate only through well-defined interfaces.
- Video never leaves the customer's local network.
- AI processing always happens locally.
- Cloud only receives analytics data.
- Every component can evolve independently.

---

# System Components

## CCTV Camera

The camera acts only as a video source.

Responsibilities:

- Capture video
- Stream video to AI Agent

Supported sources:

- RTSP IP Camera
- USB Camera
- Laptop Webcam
- Video File (development and testing)

The camera performs no AI processing.

---

## AI Agent

The AI Agent is a lightweight Windows application installed on the customer's computer.

Responsibilities:

- Connect to camera
- Read video frames
- Detect people
- Track detected people
- Count visitor entries
- Cache events locally
- Synchronize events with cloud
- Monitor camera connection

The AI Agent continues collecting data even when internet connectivity is unavailable.

No video frames are uploaded to the cloud.

---

## Local Storage

A lightweight local SQLite database is used by the AI Agent.

Responsibilities:

- Store visitor events
- Cache unsynchronized data
- Preserve data during internet outages

The local database exists only for reliability.

It is not intended for analytics.

---

## Backend Server

The backend is the central cloud service.

Responsibilities:

- Authentication
- User management
- Store management
- Camera management
- Receive visitor events
- Generate reports
- Serve dashboard data

The backend never processes video.

---

## Cloud Database

The cloud database stores all business information.

Responsibilities:

- Users
- Stores
- Cameras
- Visitor events
- Historical analytics

The database is the single source of truth for customer analytics.

---

## Dashboard

The dashboard is the customer-facing web application.

Responsibilities:

- User authentication
- Live visitor monitoring
- Historical reports
- Camera status
- Business analytics

The dashboard never communicates directly with cameras.

All communication goes through the backend.

---

# Data Flow

## Online Mode

```
Camera
    │
    ▼
AI Agent
    │
Detect & Count
    │
    ▼
Cloud API
    │
    ▼
Backend
    │
    ▼
Database
    │
    ▼
Dashboard
```

Visitor events appear in the dashboard almost immediately.

---

## Offline Mode

```
Camera
    │
    ▼
AI Agent
    │
Detect & Count
    │
    ▼
SQLite Cache
```

When the internet connection is restored:

```
SQLite
    │
    ▼
Cloud API
    │
    ▼
Backend
    │
    ▼
Dashboard
```

No visitor events should be lost because of temporary internet failures.

---

# Component Communication

The platform uses direct communication only where necessary.

```
Camera
      │
      ▼
AI Agent
      │
 HTTPS REST API
      ▼
Backend
      │
 SQL
      ▼
Database
      │
 HTTPS REST API
      ▼
Dashboard
```

Components never bypass this communication chain.

For example:

Dashboard ❌ Camera

Dashboard ❌ AI Agent

Camera ❌ Backend

Every request passes through the backend.

---

# Security Model

Video streams remain inside the customer's local network.

Only visitor analytics are transmitted to the cloud.

Every AI Agent must authenticate before sending data.

All cloud communication uses HTTPS.

No passwords or camera credentials are exposed to the dashboard.

---

# Scalability

The architecture is designed to support future growth without major redesign.

Future versions may include:

- Multiple cameras
- Multiple entrances
- Multiple stores
- Multiple AI Agents
- Mobile applications
- Additional AI modules

These features should be implemented by extending existing components rather than replacing them.

---

# Reliability

The platform should remain operational under the following conditions:

- Temporary internet outages
- Backend restarts
- Dashboard downtime
- Camera reconnections

The AI Agent is responsible for guaranteeing that visitor events are not lost before synchronization.

---

# Design Goals

The architecture is designed to achieve the following goals:

- Modular
- Maintainable
- Scalable
- Fault tolerant
- Secure
- Easy to deploy
- Easy to test
- Production ready

Every future feature should integrate into the existing architecture without requiring significant redesign.
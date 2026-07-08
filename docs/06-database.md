# Database

## Overview

The Retail Analytics Platform uses two databases.

### Local Database

SQLite

Used by the AI Agent.

Purpose:

- Cache visitor events
- Store unsynchronized events
- Continue operating during internet outages

This database is temporary and exists only on the customer's computer.

---

### Cloud Database

PostgreSQL

Used by the backend.

Purpose:

- Store business data
- Store visitor events
- Generate reports
- Provide dashboard analytics

The cloud database is the primary source of truth.

---

# Database Design Principles

The database follows these principles:

- Normalized structure
- No duplicated business data
- Store raw visitor events
- Generate reports from stored events
- Soft deletion where appropriate
- UUID primary keys
- UTC timestamps
- Audit-friendly design

---

# Entity Overview

The MVP contains the following entities.

```
User
 │
 │ 1:N
 ▼
Store
 │
 │ 1:N
 ▼
Camera
 │
 │ 1:N
 ▼
VisitorEvent
```

---

# User

Represents a customer account.

Purpose:

- Authentication
- Account ownership
- Store management

Responsibilities:

- Own a store
- Access dashboard
- Configure cameras

For MVP:

One user owns one store.

---

# Store

Represents a physical business location.

Purpose:

- Store business information
- Group cameras
- Group visitor analytics

Responsibilities:

- Store name
- Address
- Time zone
- Status

For MVP:

One store contains one camera.

---

# Camera

Represents a camera connected through an AI Agent.

Purpose:

- Identify video source
- Store camera metadata
- Track connection status

Responsibilities:

- Camera name
- Camera type
- Connection status
- Last synchronization

The database stores metadata only.

Video is never stored.

---

# Visitor Event

Represents one successful visitor entry.

Each visitor crossing the counting line creates exactly one visitor event.

Responsibilities:

- Entry timestamp
- Camera reference
- Store reference

Visitor events are immutable.

They should never be edited after creation.

---

# Relationships

## User → Store

One-to-One

A user owns one store.

Future versions may support multiple stores.

---

## Store → Camera

One-to-Many

For MVP:

One store uses one camera.

Future versions may support multiple cameras.

---

## Camera → Visitor Event

One-to-Many

Each camera generates many visitor events.

---

# Local Database

The AI Agent maintains a lightweight SQLite database.

Purpose:

- Temporary storage
- Offline operation
- Synchronization queue

The local database should contain only operational data.

Business analytics belong in the cloud database.

---

# Data Lifecycle

Visitor Event

↓

Stored locally

↓

Synchronized

↓

Stored in PostgreSQL

↓

Analytics generated

↓

Displayed on dashboard

Local cached events may be removed after successful synchronization.

---

# Soft Deletion

The following entities should support soft deletion:

- User
- Store
- Camera

Visitor Events should never be deleted automatically.

Historical analytics depend on them.

---

# Timestamps

Every entity should contain standard timestamps.

Examples:

- Created At
- Updated At

Visitor Events additionally contain:

- Event Timestamp

All timestamps should use UTC.

Time zone conversion happens in the dashboard.

---

# Primary Keys

Every entity should use UUID identifiers.

Reasons:

- Globally unique
- Safer for public APIs
- Easier synchronization
- Better scalability

Sequential integer IDs should not be exposed publicly.

---

# Indexing

Frequently queried fields should be indexed.

Examples:

- Store ID
- Camera ID
- Visitor Event Timestamp
- User ID

Indexes should prioritize dashboard performance.

---

# Data Retention

Business data should remain available for historical reporting.

Visitor Events should not be automatically removed during the MVP.

Future versions may introduce configurable retention policies.

---

# Backup Strategy

The cloud database should support:

- Automatic backups
- Point-in-time recovery
- Disaster recovery

The AI Agent's local SQLite database is temporary and does not require cloud backups.

---

# Future Entities

The architecture should support adding new entities without redesign.

Examples:

- Multiple Stores
- Multiple AI Agents
- Multiple Entrances
- Occupancy Events
- Notifications
- Reports
- Audit Logs
- Roles & Permissions

---

# Design Principles

The database should be:

- Normalized
- Scalable
- Secure
- Maintainable
- Consistent
- Reliable
- Production-ready

Business reports should always be generated from stored visitor events rather than pre-calculated values whenever practical.
# Architecture Decisions

## Overview

This document records the major architectural and product decisions made during the development of the Retail Analytics Platform.

Its purpose is to explain **why** specific technologies, workflows, and design choices were selected.

Unlike other documentation, this file is historical.

Existing decisions should not be modified.

If a decision changes, a new decision should be added explaining the reason for the change.

---

# Decision Format

Every decision should contain:

- Decision ID
- Date
- Status
- Decision
- Reason
- Consequences

Example:

```
Decision ID: ADR-001

Status:
Accepted

Decision:
Use local AI processing.

Reason:
Protect customer privacy and reduce bandwidth usage.

Consequences:
AI Agent must run on customer hardware.
```

---

# ADR-001

## Status

Accepted

## Decision

Use local AI processing instead of cloud video processing.

## Reason

Uploading live CCTV video to the cloud increases bandwidth usage, introduces latency, raises privacy concerns, and significantly increases infrastructure costs.

Processing video locally allows the platform to operate faster while keeping video inside the customer's network.

## Consequences

- AI Agent performs all computer vision tasks.
- Cloud never receives video.
- Customer hardware performs AI inference.

---

# ADR-002

## Status

Accepted

## Decision

Use a cloud dashboard for analytics.

## Reason

Customers should be able to monitor their business remotely without accessing the local computer running the AI Agent.

## Consequences

- Dashboard is hosted in the cloud.
- AI Agent synchronizes visitor events.
- Dashboard accesses analytics through the backend.

---

# ADR-003

## Status

Accepted

## Decision

Use one Git repository (Monorepo).

## Reason

The AI Agent, Backend, Dashboard, and Documentation belong to a single product.

Keeping them together simplifies development, versioning, and deployment.

## Consequences

- Shared documentation
- Easier dependency management
- Simpler project organization

---

# ADR-004

## Status

Accepted

## Decision

Use SQLite inside the AI Agent.

## Reason

The AI Agent must continue operating without internet connectivity.

SQLite provides lightweight local storage without requiring installation of additional database software.

## Consequences

- Offline support
- Reliable synchronization
- Minimal resource usage

---

# ADR-005

## Status

Accepted

## Decision

Use PostgreSQL as the cloud database.

## Reason

PostgreSQL is reliable, scalable, open source, and well suited for analytical workloads.

## Consequences

- Structured relational data
- Future scalability
- Strong ecosystem support

---

# ADR-006

## Status

Accepted

## Decision

Use virtual line crossing instead of automatic door detection.

## Reason

Door detection is significantly more complex and less reliable across different environments.

Virtual line crossing is simpler, easier to configure, and widely used in commercial people-counting systems.

## Consequences

- User configures counting line during setup.
- Higher counting accuracy.
- Easier installation.

---

# ADR-007

## Status

Accepted

## Decision

Store visitor events instead of aggregated statistics.

## Reason

Raw visitor events provide maximum flexibility for generating reports and future analytics.

Aggregated reports can always be generated from raw events.

The opposite is not possible.

## Consequences

- Better historical reporting.
- Flexible analytics.
- Future-proof database design.

---

# ADR-008

## Status

Accepted

## Decision

Support one store and one camera in the MVP.

## Reason

Supporting multiple stores and cameras introduces significant architectural complexity without increasing MVP value.

The primary objective is to validate accurate visitor counting.

## Consequences

- Faster development.
- Simpler installation.
- Easier testing.
- Future expansion remains possible.

---

# ADR-009

## Status

Accepted

## Decision

Ignore exit counting in the MVP.

## Reason

The MVP solves a single business problem:

Accurate visitor entry counting.

Supporting exits introduces additional tracking complexity without providing immediate business value.

## Consequences

- Simpler AI logic.
- Higher reliability.
- Occupancy tracking postponed.

---

# ADR-010

## Status

Accepted

## Decision

Support Webcam, RTSP cameras, and video files.

## Reason

Different environments require different input sources.

Webcam simplifies development.

Video files simplify testing.

RTSP cameras support production deployment.

## Consequences

- Easier development.
- Easier testing.
- Production-ready architecture.

---

# ADR-011

## Status

Accepted

## Decision

The AI Agent communicates only with the backend.

## Reason

Direct communication between the Dashboard and AI Agent would complicate networking and reduce security.

The backend acts as the single communication layer.

## Consequences

- Cleaner architecture.
- Improved security.
- Easier maintenance.

---

# ADR-012

## Status

Accepted

## Decision

Privacy takes precedence over advanced analytics.

## Reason

Customer trust is essential.

Video recordings, images, and facial information should never leave the customer's premises.

Only visitor events and operational metadata are synchronized.

## Consequences

- GDPR-friendly architecture.
- Lower bandwidth usage.
- Increased customer confidence.

---

# ADR-013

## Status

Accepted

## Decision

Build the platform as a production-ready SaaS from the first version.

## Reason

The goal of the project is to become a real product rather than a demonstration or portfolio-only application.

All architectural decisions should support long-term maintainability and scalability.

## Consequences

- Production-quality code.
- Modular architecture.
- Comprehensive documentation.
- Real deployment strategy.

---

# Future Decisions

Future architectural decisions should be recorded in this document rather than replacing previous decisions.

Examples:

- AI model replacement
- Multiple camera support
- Automatic updates
- Mobile application
- Notification system
- Public API
- Multi-store architecture

---

# Documentation Rules

Every significant architectural or product decision must be documented before implementation.

No major feature should be implemented without recording the reasoning behind the decision.

This document serves as the historical record of the Retail Analytics Platform and ensures that future contributors understand why the system was designed the way it is.
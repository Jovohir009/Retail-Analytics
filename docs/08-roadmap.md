# Development Roadmap

## Overview

This roadmap defines the development phases of the Retail Analytics Platform.

Each milestone builds upon the previous one and represents a fully functional increment of the product.

The goal is to release a production-ready MVP as early as possible while maintaining a scalable architecture for future expansion.

---

# Development Principles

Every milestone should follow these principles:

- Production-ready implementation
- Clean architecture
- Modular design
- Fully tested before moving forward
- Backward compatible
- No unfinished or placeholder features

Each milestone must be completed before starting the next.

---

# Milestone 1 — Project Foundation

## Goal

Create the foundation of the entire platform.

### Deliverables

- Repository structure
- Documentation
- Development environment
- Project configuration
- Source code organization
- Git repository

### Success Criteria

- Project compiles successfully
- Folder structure finalized
- Documentation completed
- Development environment works correctly

Status:

Completed

---

# Milestone 2 — AI Detection Engine

## Goal

Build the core computer vision engine.

### Deliverables

- Camera connection
- Webcam support
- Video file support
- RTSP support
- Person detection
- Bounding box visualization

### Success Criteria

- Detect people in real time
- Stable video processing
- Reliable camera connection

Status:

In Progress

---

# Milestone 3 — Object Tracking

## Goal

Track every detected person across video frames.

### Deliverables

- Persistent object IDs
- Stable tracking
- Occlusion recovery
- Duplicate prevention

### Success Criteria

- Every visible person receives a unique ID.
- IDs remain stable while visible.
- Tracking survives temporary occlusions.

---

# Milestone 4 — Visitor Counting

## Goal

Convert tracked people into visitor events.

### Deliverables

- Virtual counting line
- Direction detection
- Entry counting
- Duplicate prevention

### Success Criteria

- Every visitor crossing the entry line is counted once.
- False positives remain minimal.

---

# Milestone 5 — Local Reliability

## Goal

Allow the AI Agent to operate independently.

### Deliverables

- SQLite database
- Local event storage
- Offline mode
- Automatic synchronization queue

### Success Criteria

- Internet failures do not interrupt counting.
- No visitor events are lost.

---

# Milestone 6 — Backend

## Goal

Develop the cloud platform.

### Deliverables

- Authentication
- User management
- Store management
- Camera management
- Visitor event API
- Analytics generation

### Success Criteria

- AI Agent successfully synchronizes events.
- Backend stores visitor history.
- Dashboard data becomes available.

---

# Milestone 7 — Dashboard

## Goal

Create the customer web application.

### Deliverables

- Authentication
- Home dashboard
- Analytics page
- Camera page
- Settings page
- Profile page

### Success Criteria

- Users can monitor visitor analytics.
- Reports update automatically.
- Dashboard performs smoothly.

---

# Milestone 8 — System Integration

## Goal

Connect all platform components.

### Deliverables

- AI Agent → Backend
- Backend → Database
- Dashboard → Backend
- End-to-end communication

### Success Criteria

- Complete workflow operates successfully.
- Visitor events appear in the dashboard.
- Offline synchronization works correctly.

---

# Milestone 9 — Testing

## Goal

Validate system reliability.

### Deliverables

- AI testing
- Backend testing
- Dashboard testing
- Integration testing
- Long-running stability testing

### Success Criteria

- Stable long-term operation
- No critical failures
- Reliable visitor counting
- Acceptable performance

---

# Milestone 10 — Production Release

## Goal

Prepare the platform for real customers.

### Deliverables

- Installation guide
- User documentation
- Deployment
- Production configuration
- Release version

### Success Criteria

- Customers can install the AI Agent.
- Customers can connect their camera.
- Customers can access the dashboard.
- Platform operates without developer intervention.

---

# Future Roadmap

The following features are planned after the MVP.

## AI

- Gender estimation
- Age estimation
- Occupancy calculation
- Heatmaps
- Time spent inside the store

---

## Dashboard

- Multi-store support
- Multi-camera support
- AI-generated insights
- Advanced analytics
- Report export
- Notifications

---

## Platform

- Automatic AI Agent updates
- Mobile application
- Public API
- Third-party integrations
- Role-based access control

---

# Definition of Done

A milestone is considered complete only when:

- Development is finished.
- Code has been tested.
- Documentation is updated.
- No known critical bugs remain.
- The feature is production-ready.

Partially completed milestones should never be marked as complete.

---

# MVP Scope

Version 1.0 includes:

- AI Agent
- Person detection
- Person tracking
- Visitor counting
- Local SQLite cache
- Backend API
- PostgreSQL database
- Cloud Dashboard
- Authentication
- Analytics
- Offline synchronization

Everything outside this scope belongs to future releases.

---

# Release Philosophy

The Retail Analytics Platform follows an incremental release strategy.

Every released version must:

- Solve a real business problem
- Be stable
- Be deployable
- Be maintainable
- Improve upon previous versions

The focus is to deliver value continuously rather than delaying releases while waiting for additional features.
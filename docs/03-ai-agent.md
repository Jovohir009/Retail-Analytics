# AI Agent

## Overview

The AI Agent is a lightweight Windows application responsible for processing video streams locally and generating visitor analytics.

It acts as the bridge between physical CCTV cameras and the cloud platform.

The AI Agent performs all computer vision tasks on the customer's computer without sending video to the cloud.

Only visitor events and analytics are synchronized.

---

# Responsibilities

The AI Agent is responsible for:

- Connecting to supported camera sources
- Reading live video frames
- Detecting people using AI
- Tracking detected people
- Counting visitor entries
- Monitoring camera connection
- Caching visitor events locally
- Synchronizing events with the backend
- Recovering automatically after temporary failures

The AI Agent does **not** provide analytics or generate reports.

Those responsibilities belong to the backend.

---

# Supported Video Sources

The AI Agent supports multiple input sources.

### Webcam

Used for development and testing.

---

### RTSP Camera

Primary production source.

Most IP CCTV cameras expose an RTSP stream that can be connected directly.

---

### Video File

Used for testing and debugging.

Supported formats include:

- MP4
- AVI
- MOV

---

# Processing Pipeline

Every frame passes through the following pipeline.

```
Camera
    │
    ▼
Read Frame
    │
    ▼
Person Detection
    │
    ▼
Object Tracking
    │
    ▼
Entry Counter
    │
    ▼
Visitor Event
    │
    ▼
SQLite Cache
    │
    ▼
Cloud Synchronization
```

Each stage has only one responsibility.

---

# Internal Modules

The AI Agent is divided into independent modules.

## Camera Module

Responsibilities:

- Connect to camera
- Read frames
- Detect camera failures
- Reconnect automatically

Supported implementations:

- Webcam
- RTSP Camera
- Video File

---

## Detector Module

Responsibilities:

- Detect people in each frame
- Ignore unsupported object classes
- Return structured detection results

The detector only identifies objects.

It never counts visitors.

---

## Tracker Module

Responsibilities:

- Assign unique IDs to detected people
- Keep IDs consistent across frames
- Handle temporary occlusions

Tracking prevents the same person from being counted multiple times.

---

## Counter Module

Responsibilities:

- Monitor tracked people
- Detect virtual line crossings
- Determine entry direction
- Generate visitor events

The counter is responsible only for business logic.

It does not perform AI detection.

---

## Storage Module

Responsibilities:

- Store visitor events locally
- Preserve unsynchronized events
- Mark synchronized records

SQLite is used as local storage.

---

## Sync Module

Responsibilities:

- Detect internet availability
- Send pending events
- Retry failed requests
- Mark successful synchronization

Synchronization happens automatically in the background.

---

## Configuration Module

Responsibilities:

- Load application settings
- Store camera configuration
- Store backend connection settings

Configuration should not require code changes.

---

## Logging Module

Responsibilities:

- Record application activity
- Store warnings
- Store errors
- Assist troubleshooting

Logging should never interrupt normal operation.

---

# AI Model

The AI Agent uses a lightweight object detection model optimized for real-time performance.

Requirements:

- Fast inference
- High detection accuracy
- Low hardware requirements
- Local execution

The detection model should be replaceable without modifying other modules.

---

# Tracking

Tracking assigns a persistent identifier to every detected person.

Example:

```
Frame 1

Person #14

↓

Frame 2

Person #14

↓

Frame 3

Person #14
```

The same person must keep the same identifier while visible.

This prevents duplicate counting.

---

# Counting Strategy

Visitor counting is based on virtual line crossing.

The user defines a counting line during camera setup.

A visitor is counted only when:

- A tracked person crosses the counting line.
- The crossing direction matches the configured entry direction.
- The person has not already been counted.

Every person should generate only one entry event.

The exact counting rules are documented in **10-business-rules.md**.

---

# Offline Support

The AI Agent must continue operating without internet.

When offline:

- Detection continues.
- Tracking continues.
- Counting continues.
- Visitor events are stored locally.

When connectivity returns:

- Cached events are synchronized automatically.
- No visitor events should be lost.

---

# Error Recovery

The AI Agent should recover automatically whenever possible.

Examples:

- Camera disconnected
- Camera restarted
- Temporary internet outage
- Backend unavailable

The application should retry operations without requiring manual intervention.

---

# Performance Goals

Target performance for MVP:

- Near real-time processing
- Stable operation for long-running sessions
- Low memory usage
- Low CPU usage when idle

Performance should prioritize counting accuracy over maximum FPS.

---

# Security

The AI Agent never uploads:

- Video streams
- Images
- Camera recordings

Only visitor events and operational metadata are transmitted.

Camera credentials remain on the local machine.

---

# Future Extensions

The AI Agent is designed for future expansion.

Possible future modules include:

- Multi-camera support
- Occupancy calculation
- Heatmap generation
- Gender estimation
- Age estimation
- Employee detection
- Camera health monitoring
- Automatic updates

These features should be added as new modules without redesigning the existing architecture.

---

# Design Principles

The AI Agent should always follow these principles:

- Single responsibility for every module
- Local-first processing
- Reliable offline operation
- Modular architecture
- Replaceable AI models
- Secure communication
- Automatic recovery
- Easy deployment
- Production-ready design
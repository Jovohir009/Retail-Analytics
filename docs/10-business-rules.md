# Business Rules

## Overview

This document defines the business rules that govern how Retail Analytics Platform operates.

Business rules ensure that visitor counting remains accurate, predictable, and consistent regardless of implementation.

Every platform component must follow these rules.

---

# Primary Business Goal

The MVP solves one business problem:

> Count every person entering the store exactly once.

The platform prioritizes counting accuracy over additional AI features.

---

# Visitor Definition

A visitor is defined as:

> A person who successfully enters the store by crossing the configured entry line in the configured direction.

Only people are considered visitors.

Objects such as:

- Chairs
- Bags
- Shopping carts
- Strollers
- Animals

must never generate visitor events.

---

# Entry Rule

A visitor entry is counted only when all of the following conditions are satisfied:

- A person is detected.
- The person is successfully tracked.
- The tracked person crosses the virtual counting line.
- The crossing direction matches the configured entry direction.
- The person has not already been counted.

Only then is one visitor event created.

---

# Exit Rule

For MVP:

People leaving the store are ignored.

No exit events are stored.

Future versions may support exit counting and occupancy monitoring.

---

# Duplicate Prevention

Each tracked person may generate only one visitor event.

Once a tracked person has been counted:

- They cannot be counted again while remaining in view.
- Additional detections of the same tracked person must be ignored.

Tracking IDs are used only during active tracking.

They must not be stored permanently.

---

# Counting Line

Every camera must have one configured counting line.

The counting line defines:

- Entry boundary
- Crossing direction

Visitors are counted only when crossing this line.

Standing near the line must never generate a visitor event.

---

# Counting Direction

The installer defines the allowed counting direction during camera setup.

Example:

Outside

↓

Inside

Only movement in the configured direction generates visitor events.

Movement in the opposite direction is ignored.

---

# Camera Position

The camera should monitor a single entrance.

Recommended placement:

- Stable position
- Visible doorway
- Minimal obstruction
- Good lighting

Poor camera positioning may reduce counting accuracy.

---

# Camera Ownership

For MVP:

One store has one camera.

One camera belongs to one store.

A camera cannot belong to multiple stores.

---

# Store Ownership

For MVP:

One user owns one store.

Future versions may support multiple stores per account.

---

# AI Agent Ownership

One AI Agent belongs to one customer account.

One AI Agent manages one camera during MVP.

Future versions may support multiple cameras.

---

# Visitor Event Creation

Every successful visitor entry creates one immutable visitor event.

Visitor events represent historical business data.

Visitor events must never be edited after creation.

---

# Event Synchronization

Visitor events are first stored locally.

Only after successful synchronization may an event be marked as synchronized.

Synchronization failures must never remove local events.

---

# Offline Behavior

Internet availability must never affect visitor counting.

If the backend becomes unavailable:

- Continue detecting people.
- Continue tracking.
- Continue counting.
- Continue storing visitor events locally.

Synchronization resumes automatically when connectivity returns.

---

# Camera Failure

If the camera disconnects:

- Counting stops.
- Existing data remains preserved.
- Automatic reconnection begins.

No visitor events should be generated while the camera is unavailable.

---

# Dashboard Behavior

The dashboard displays information received from the backend.

The dashboard must never estimate visitor counts.

Displayed analytics must always originate from synchronized visitor events.

---

# Time Handling

All timestamps are stored in UTC.

Time zone conversion occurs only when displaying information to users.

This ensures consistent reporting across all regions.

---

# Data Integrity

The system should guarantee:

- No duplicate visitor events.
- No missing synchronized events.
- No invalid store references.
- No invalid camera references.

Every visitor event must belong to:

- One camera
- One store

---

# Privacy

The platform prioritizes customer privacy.

The following data must never be transmitted to the cloud:

- Video streams
- Camera recordings
- Images
- Face data

Only visitor events and operational metadata are synchronized.

---

# Accuracy

The platform prioritizes:

1. Correct counting
2. Stable operation
3. Reliable synchronization

Additional AI capabilities must never reduce counting reliability.

---

# Future Business Rules

Future versions may introduce rules for:

- Exit counting
- Occupancy calculation
- Multiple entrances
- Multiple cameras
- Heatmaps
- Employee exclusion
- Gender estimation
- Age estimation
- Customer flow analysis

These rules should extend the existing business logic without changing MVP behavior.

---

# Design Principles

Every future feature should respect the following principles:

- One person generates one visitor event.
- Business rules are independent of AI implementation.
- Counting must remain deterministic.
- Visitor history must remain immutable.
- Offline operation must never lose visitor events.
- Privacy must always be preserved.
- Accuracy is more important than feature quantity.

These principles define the expected behavior of the Retail Analytics Platform and serve as the foundation for all future development.
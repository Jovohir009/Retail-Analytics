# Retail Analytics Platform

## Overview

Retail Analytics Platform is a SaaS solution that helps physical stores understand customer traffic using existing CCTV cameras. The platform uses Artificial Intelligence to detect and count people entering a store, then provides real-time analytics and historical reports through a cloud dashboard.

The product consists of two main components:

- AI Agent (Windows application)
- Cloud Dashboard (Web application)

The AI Agent runs locally inside the customer's network, processes video streams from CCTV cameras, counts visitors, and securely synchronizes analytics with the cloud. Customers log in to the dashboard to monitor visitor statistics and business insights.

The platform is designed to work with existing IP cameras without requiring additional hardware.

---

# Problem Statement

Many small and medium-sized businesses have CCTV cameras installed but do not use them to collect business insights.

Store owners often cannot answer questions such as:

- How many people visited today?
- Which hours are the busiest?
- Is today's traffic higher than yesterday?
- How many visitors came this month?
- Are marketing campaigns increasing customer traffic?

Current enterprise solutions are often expensive, require proprietary hardware, or are difficult to configure.

Retail Analytics Platform provides an affordable and easy-to-install alternative.

---

# Product Goal

The goal of the platform is to provide accurate visitor analytics using existing CCTV cameras with minimal installation effort.

The first version focuses on one business problem:

> Count every person entering the store as accurately as possible.

Accuracy and reliability are prioritized over adding many features.

---

# Target Customers

The MVP is designed for:

- Retail stores
- Small supermarkets
- Grocery stores
- Pharmacies
- Showrooms
- Local businesses with a single entrance

Future versions may support larger businesses with multiple entrances and multiple locations.

---

# Core Features (MVP)

### AI Agent

- Connect to a webcam, RTSP camera, or video file
- Detect people in real time
- Track detected people
- Count entries using a virtual counting line
- Store events locally when offline
- Synchronize data with the cloud

### Cloud Dashboard

- User authentication
- Live visitor count
- Daily visitor statistics
- Weekly visitor statistics
- Monthly visitor statistics
- Hourly traffic visualization
- Camera connection status

---

# Out of Scope (MVP)

The following features are intentionally excluded from the first release:

- Gender detection
- Age estimation
- Face recognition
- Customer identification
- Heatmaps
- Occupancy monitoring
- Time spent inside the store
- Multiple entrances
- Multiple cameras per store
- Multi-store management

These features may be implemented in future versions after the core counting system proves accurate and reliable.

---

# Product Components

The platform consists of two independent applications.

## 1. AI Agent

A lightweight Windows application installed on the customer's computer.

Responsibilities:

- Connect to cameras
- Process video locally
- Detect and track people
- Count visitor entries
- Cache events locally
- Send analytics to the cloud

The AI Agent performs all computer vision tasks locally to reduce bandwidth usage and improve privacy.

---

## 2. Cloud Dashboard

A web application that allows customers to access visitor analytics from anywhere.

Responsibilities:

- Authentication
- Dashboard
- Reports
- Camera management
- Historical analytics

The dashboard never processes video streams directly.

---

# Success Criteria

The MVP is considered successful if it can:

- Detect people reliably using a CCTV camera
- Count store entries with high accuracy
- Continue collecting data during internet outages
- Synchronize cached data after reconnection
- Display real-time and historical analytics in the dashboard
- Be installed and configured by a customer with minimal technical knowledge

---

# Future Vision

Retail Analytics Platform is intended to become a complete AI-powered business intelligence solution for physical stores.

Future versions may include:

- Multiple cameras
- Multiple entrances
- Multi-store management
- Occupancy analytics
- Customer flow analysis
- Heatmaps
- Employee analytics
- Advanced reporting
- Mobile application
- AI-generated business insights
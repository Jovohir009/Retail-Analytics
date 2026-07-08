# Installation

## Overview

Retail Analytics Platform is designed to be installed with minimal technical knowledge.

The installation process consists of:

1. Creating an account
2. Installing the AI Agent
3. Connecting a camera
4. Verifying the connection
5. Accessing the cloud dashboard

The complete installation should take less than 15 minutes under normal conditions.

---

# System Requirements

## Operating System

Supported:

- Windows 10
- Windows 11

Linux and macOS support may be added in future versions.

---

## Hardware Requirements

Minimum:

- Dual-Core CPU
- 8 GB RAM
- 2 GB Available Storage
- Stable Internet Connection

Recommended:

- Intel Core i5 (or equivalent)
- 16 GB RAM
- SSD Storage
- Dedicated GPU (optional)

The AI Agent is capable of running on CPU-only systems, although a dedicated GPU improves performance.

---

## Camera Requirements

Supported camera sources:

- RTSP IP Camera
- USB Camera
- Webcam

For testing purposes:

- MP4 video files

---

# Installation Steps

## Step 1 — Create an Account

The customer registers through the cloud dashboard.

Required information:

- Name
- Email
- Password

After registration, the customer gains access to the dashboard.

---

## Step 2 — Download AI Agent

Download the latest AI Agent installer from the dashboard.

Example:

```
RetailAnalyticsAgentSetup.exe
```

The installer automatically installs the AI Agent.

---

## Step 3 — Install AI Agent

Launch the installer.

The installer should:

- Install required files
- Create application folders
- Configure local database
- Create desktop shortcut
- Register the application

No manual configuration should be required.

---

## Step 4 — Login

Open the AI Agent.

Authenticate using the same account created on the dashboard.

After successful authentication, the AI Agent securely connects to the cloud.

---

## Step 5 — Configure Camera

Choose the desired video source.

Supported options:

- Webcam
- RTSP Camera
- Video File (testing)

For RTSP cameras:

Provide:

- Camera IP Address
- Username
- Password
- RTSP URL (if required)

The AI Agent validates the connection before continuing.

---

## Step 6 — Configure Counting Line

The AI Agent displays the live camera feed.

The customer defines:

- Entry direction
- Virtual counting line

This configuration determines how visitor entries are counted.

The customer can adjust the counting line later if necessary.

---

## Step 7 — Verify Detection

The AI Agent begins detecting people.

The customer verifies that:

- People are detected correctly.
- Tracking IDs remain stable.
- Visitor count increases when entering.

No synchronization occurs until verification is complete.

---

## Step 8 — Start Monitoring

After successful verification:

- AI Agent starts processing video.
- Visitor events are stored locally.
- Analytics synchronize automatically.
- Dashboard begins displaying visitor statistics.

The installation is complete.

---

# Offline Operation

If the internet connection becomes unavailable:

- Detection continues.
- Tracking continues.
- Counting continues.
- Events are stored locally.

When connectivity returns:

- Cached events synchronize automatically.

No manual action is required.

---

# Updating AI Agent

The AI Agent should support future automatic updates.

Until automatic updates are implemented:

- Download latest installer.
- Run installer.
- Existing configuration should remain intact.

User settings and cached data should not be lost during updates.

---

# Dashboard Access

The dashboard is accessible through any modern web browser.

Supported browsers:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari

No software installation is required.

---

# Troubleshooting

Common issues include:

## Camera Not Detected

Possible causes:

- Incorrect RTSP URL
- Invalid credentials
- Camera offline
- Firewall restrictions

---

## No Person Detection

Possible causes:

- Poor lighting
- Camera angle
- Low video quality
- Obstructed entrance

---

## Dashboard Not Updating

Possible causes:

- Internet connection unavailable
- AI Agent offline
- Synchronization pending

The AI Agent should indicate synchronization status to the user.

---

# Security

The installation process should ensure:

- Secure authentication
- Encrypted communication
- Local storage of camera credentials
- No transmission of video streams

Only visitor analytics are synchronized with the cloud.

---

# Uninstallation

The AI Agent should support complete removal.

Uninstallation should:

- Remove application files
- Remove shortcuts
- Stop background services

The customer should have the option to:

- Keep configuration
- Remove configuration
- Remove cached visitor events

---

# Customer Support

Support resources include:

- Installation Guide
- Video Tutorials
- Frequently Asked Questions (FAQ)
- Documentation
- Email Support

Future versions may include in-application support.

---

# Installation Goals

The installation process should be:

- Simple
- Fast
- Reliable
- Secure
- Repeatable
- Production-ready

A customer should be able to complete the installation without developer assistance under normal conditions.
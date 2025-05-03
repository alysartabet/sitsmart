# SitSmart - Real-Time Classroom and Study Space Reservation System
**SitSmart (v1.0)** is a mobile-first, progressive mobile app that revolutionizes classroom and study space management in educational institutions. With real-time availability tracking, smart seat recommendations, and faculty reservation controls, SitSmart ensures seamless space management. Built with **React Native**, **Python**, and **PostgreSQL**, it offers a dynamic, user-friendly experience for students and faculty.

---

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Setup Guide](#setup-guide)
- [User Guide](#user-guide)
- [Technology Stack](#technology-stack)
- [API Documentation](#api-documentation)
- [Contributors](#contributors)
- [Challenges, Limitations, and Future Work](#challenges-limitations-and-future-work)
- [Future Enhancements](#future-enhancements)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Project Overview
SitSmart optimizes space usage in educational institutions by streamlining the reservation process. Designed for efficiency, it empowers students and faculty with intuitive tools to book classrooms and study spaces effortlessly.

- **Real-Time Availability**: Track open rooms and seats instantly.
- **Smart Recommendations**: Find the perfect seat based on preferences like lighting or noise levels.
- **Faculty Controls**: Reserve entire classrooms with ease.
- **Cross-Platform**: Access via a mobile-first progressive mobile app.

---

## Features 
SitSmart offers a robust set of tools to enhance space management:

- 🕒 **Real-Time Room Availability**: Monitor open spaces instantly.
- 🪑 **Smart Seat Selection**: Choose seats based on preferences (e.g., outlets, quiet areas).
- 🎓 **Faculty Reservations**: Override bookings for classes or events.
- 📩 **Push Notifications**: Get alerts when preferred spaces are available.
- 📊 **Room Ratings**: Rate and view ratings for rooms.

---

## Setup Guide
Set up SitSmart locally with these steps.

### Prerequisites
- **Operating System**: Windows, macOS, or Linux
- **Software**:
  - Node.js and npm (for React Native)
  - PostgreSQL (for database)
  - Expo Go (for mobile app visualization)

### Installation Steps
1. **Clone the Repository**:
   ```bash
   https://github.com/alysartabet/sitsmart.git
   ```

2. **Frontend Setup**:
   ```bash
   npm install
   cd frontend
   npm install
   npx expo start
   ```
   - Do npm install in root directory of project, THEN npm install in the frontend directory
   - Open Expo Go on your mobile device and scan the QR code to launch the app.

3. **Running the Application**:
   ```bash
   cd frontend
   npx expo start
   ```
   - Open Expo Go on your mobile device and scan the QR code to launch the app.
---

## User Guide
Get started with SitSmart in a few simple steps:

1. **Launch the App**:
   - Run `npx expo start` in the frontend directory and scan the QR code with Expo Go.
2. **Log In/Sign Up**:
   - Create manual account and you can save you login information with Remember Me button.
3. **Book a Room**:
   - Browse available spaces and reserve a classroom or study area.
4. **Smart Seat Selection**:
   - Filter seats by preferences (e.g., proximity to outlets, noise levels).
5. **Enable Notifications**:
   - Receive alerts for space availability via push notifications.

---

## Technology Stack
SitSmart leverages modern technologies for a seamless experience:

- **Frontend**: React Native, Expo Go
- **Backend**: JavaScript
- **Database**: PostgreSQL (Supabase for production)
- **Authentication**: Supabase
- **Email Notifications**: Twilio SendGrid
- **Version Control**: Git
- **Languages**: JavaScript, Python
- **UI/UX Design**: Figma, Canva

---

## API Documentation
The API supports key functionality for SitSmart. Find detailed documentation in the `api/` directory or at `/docs/api` (when the backend server is running). Key endpoints include:

- `POST /login`: Authenticate users and return a token.
- `GET /rooms`: Fetch available rooms with filters.
- `POST /bookings`: Create a new room booking.
- `GET /user/profile`: Retrieve user profile details.

---

## Contributors
- **Alysar Tabet** ([@alysartabet](https://github.com/alysartabet)): Project Management, UX/UI Design, Full-Stack Integration
- **Kisn Mathema** ([@kisndalgory](https://github.com/kisndalgory)): Frontend Development, QA Testing
- **Jonathan Figuereo** ([@JonIFig](https://github.com/JonIFig)): Backend Development, Database Management, QA Testing
- **Sodikjon Ismoilov** ([@sodikjonismoilov](https://github.com/sodikjonismoilov)): Frontend Development, Security Engineering
- **Sameer Ramkissoon** ([@rrreeemcs](https://github.com/rrreeemcs)): Backend Development, Database Management, QA Testing

---

## Challenges, Limitations, and Future Work
### Challenges
- **Database Implementation**:
  - **Issue**: Initial PostgreSQL setup faced timeout errors for external connections.
  - **Solution**: Migrated to Supabase for managed PostgreSQL and robust authentication.
- **User Verification**:
  - **Issue**: Institutional permissions for Okta were unavailable.
  - **Solution**: Implemented manual login with secure password hashing.

### Limitations
- Manual user verification due to lack of institutional OAuth access.
- No advanced analytics for room usage trends in v1.0.

### Future Works
- 🧠 AI-driven study space recommendations.
- 📈 Heatmap analytics for space allocation.
- 📋 Faculty reporting for booking history.

---

## Future Enhancements
- **AI-Powered Recommendations**: Suggest optimal seats based on room conditions.
- **Advanced Filters**: Search by noise levels, lighting, or other preferences.
- **Analytics Dashboard**: Track usage patterns for better space management.

---

## Troubleshooting
Resolve common issues with these solutions:

- **Room Availability Not Updating**:
  - Ensure a stable internet connection for real-time updates.
- **Booking Errors**:
  - Verify the room isn’t already reserved. Contact the admin if issues persist.
- **Notifications Not Working**:
  - Check device notification settings and app permissions.

---

## License


# Film Management Application

## Author
- **Name**: Debrina Veisha Rashika W
- **NIM**: 13522025

## Overview
Welcome to the Film Management Application! This project integrates a comprehensive backend with a user-friendly frontend to manage film-related operations. Users can explore, purchase, and review films, while administrators can manage film listings and user data. Built with modern technologies, this application ensures a seamless and engaging experience for both users and admins.

## Technology Stack

### Backend
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (with Prisma ORM)
- **Media Storage**: Firebase Cloud Storage

### Frontend
- **Framework**: React
- **Routing**: React Router
- **Styling**: CSS Modules

## Design Patterns Used
- **Singleton Pattern**: Applied in repository classes to ensure a single instance of each repository, improving efficiency and resource management.
- **Factory Pattern**: Utilized to create instances of models such as `User` and `Film`, allowing for flexible and dynamic object creation.
- **Observer Pattern**: Implemented to handle real-time updates for the user interface, ensuring that film additions or updates by admins are reflected immediately without needing a page refresh.

### SOLID Principles
- **Single Responsibility Principle (SRP)**: Each class and function adheres to a single responsibility, such as `UserService` for user management and `FilmService` for film operations.
- **Open/Closed Principle (OCP)**: The system is designed to be extendable without modifying existing code, promoting scalability and flexibility.
- **Liskov Substitution Principle (LSP)**: Ensures that derived classes can replace base classes without affecting the application's correctness.
- **Interface Segregation Principle (ISP)**: Interfaces are designed to be small and specific, ensuring that implementing classes only need to adhere to relevant contracts.
- **Dependency Inversion Principle (DIP)**: High-level modules depend on abstractions rather than concrete implementations, promoting modularity and ease of testing.

## Features

### Core Features
- **User Registration and Authentication**: Secure user registration and login using JWT for authentication.
- **Film Management**: Create, update, delete, and view film details.
- **Admin Control**: Special endpoints for admins to manage films and users.

### Advanced Features
- **Film Rating and Review**: Users can rate films from 1 to 5 stars and leave reviews. This feature enhances user interaction and helps others make informed decisions.
- **Bookmarking**: Users can add films to their Wishlist for future reference. A separate Wishlist page allows users to manage their bookmarked films.

### Media Storage
- **Firebase Integration**: Utilizes Firebase Cloud Storage for managing film images and videos. This approach separates media storage from the application server, ensuring efficient and scalable file handling.

### Real-Time Updates
- **Polling Mechanism**: Implemented a polling system in the header that updates the user interface every 5 seconds. 

### Responsiveness
- **Responsive Design**: The application is designed to be fully responsive, ensuring a smooth experience across various devices and screen sizes.

## Admin API Endpoint
- **Base URL**: https://movieweb-tan.vercel.app/api/admin

### Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

## How to Run the Application

### Prerequisites
- Node.js (v14.x or higher)
- PostgreSQL
- Firebase Account
- Prisma CLI

## Docker Setup

To run the application using Docker, follow these steps:

### Prerequisites
- Docker and Docker Compose installed on your machine.

### Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/debrinashika/movieweb

2. **Create Docker Images**:
   ```bash
   docker-compose up --build

3. **Start the Containers**:
   ```bash
   docker-compose up

## Website Link
https://movieweb-tan.vercel.app/

# Helpdesk System

A full-stack helpdesk and ticket management system built with ASP.NET Core, PostgreSQL, and React.

> 🚀 **Status: MVP Complete**
>
> The core full-stack helpdesk workflow has been implemented, including authentication, ticket management, comments, user management, and administrative functionality.

---

## Overview

Helpdesk System is a web-based application designed to manage internal support requests through a ticket-based workflow.

Users can authenticate, create and manage their own support tickets, communicate through comments, and view their ticket history.

Administrators can manage users, manage tickets, update ticket status and priority, and perform administrative operations.

The project consists of:

- A REST API backend built with ASP.NET Core
- A React + TypeScript web frontend
- PostgreSQL as the relational database

The project focuses on applying practical software engineering concepts such as layered architecture, authentication and authorization, data integrity, optimistic concurrency, audit fields, soft deletion, pagination, filtering, sorting, and activity logging.

---

## Current Features

### Authentication & Authorization

- JWT-based authentication
- Role-based authorization
- Admin and User roles
- Password hashing with BCrypt
- Authenticated user context
- Protected API endpoints
- Protected frontend routes
- Admin-only frontend routes
- Custom `401 Unauthorized` and `403 Forbidden` responses
- Logout functionality

---

### Ticket Management

#### Users can:

- Create tickets
- View their own tickets
- View ticket details
- Update their own tickets
- Delete their own tickets
- Add comments to tickets
- View comments associated with a ticket
- Edit their own comments
- Delete their own comments

#### Administrators can:

- View and manage tickets through admin functionality
- Update ticket status
- Update ticket priority
- Add comments
- Manage comments according to administrative permissions
- Search and filter tickets
- Sort ticket lists

Tickets support:

- Unique ticket numbers
- Title
- Description
- Status
- Priority
- Ticket owner
- Creation and update timestamps
- Optimistic concurrency versioning
- Soft deletion

---

### Comments

- Create comments on tickets
- View comments belonging to a ticket
- Update comments
- Delete comments
- Comment ownership validation
- Administrative comment management
- Optimistic concurrency versioning
- Soft deletion

---

### User Management

Administrators can manage users through the admin interface.

User data includes:

- Name
- Email
- Password hash
- Phone number
- Role
- Account status
- Audit information

User listing supports:

- Pagination
- Filtering
- Sorting
- Search

Administrators can also:

- View user details
- Change user roles
- Change account status
- Create users

---

### Dashboard

The frontend provides separate dashboard experiences for users and administrators.

#### User Dashboard

Provides access to:

- Ticket overview
- Ticket management
- Ticket creation
- Recent ticket activity

#### Admin Dashboard

Provides administrative access to:

- Ticket management
- User management
- Administrative workflows

---

### Pagination, Filtering & Sorting

List endpoints use a reusable pagination response structure.

Example response:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 10,
  "totalItems": 25,
  "totalPages": 3
}
```

Ticket queries support:

- Search
- Status filtering
- Priority filtering
- Sorting
- Ascending / descending order
- Pagination

User queries support:

- Search
- Role filtering
- Account status filtering
- Sorting
- Ascending / descending order
- Pagination

---

## Data Integrity

The backend includes several features intended to make the application more reliable and maintainable as the system grows.

### Audit Fields

Entities track information such as:

- `CreatedAt`
- `CreatedBy`
- `UpdatedAt`
- `UpdatedBy`

---

### Soft Delete

Users, tickets, and comments support soft deletion instead of immediately removing records from the database.

This allows deleted records to remain available for data integrity and auditing purposes.

---

### Optimistic Concurrency

Tickets, comments, and users use a version value to detect conflicting updates.

For example, if two requests attempt to modify the same record using an outdated version, the application can detect the conflict instead of silently overwriting the newer data.

---

### Activity Logging

Important actions are recorded through an activity log.

Examples include:

- Create
- Update
- Delete

Activity logs store information about the affected entity and the user performing the action.

---

## Architecture

The backend follows a simple layered architecture:

```text
┌──────────────────────────┐
│       Controllers        │
│   HTTP / API Endpoints   │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│         Services         │
│   Application Logic      │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      Entity Framework    │
│          Core            │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│        PostgreSQL        │
│         Database         │
└──────────────────────────┘
```

The frontend communicates with the REST API:

```text
┌──────────────────────────┐
│       React Frontend     │
│    TypeScript + Vite     │
└────────────┬─────────────┘
             │
             │ HTTP / JSON
             ▼
┌──────────────────────────┐
│      ASP.NET Core API    │
│ Controllers → Services   │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│    Entity Framework Core │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│        PostgreSQL        │
└──────────────────────────┘
```

DTOs are used to define API request and response models, while mapper classes handle entity-to-response projections.

The architecture is intentionally kept straightforward. The goal is to maintain clear separation of responsibilities without introducing unnecessary abstractions for the current size and scope of the project.

---

## Tech Stack

### Backend

- **C#**
- **ASP.NET Core 10**
- **Entity Framework Core 10**
- **PostgreSQL**
- **Npgsql**
- **JWT Bearer Authentication**
- **BCrypt**

### Frontend

- **React**
- **TypeScript**
- **Vite**
- **React Router**
- **Tailwind CSS**
- **Lucide React**

### API Documentation

- **OpenAPI / Swagger**
- **Scalar**

### Development

- **Git**
- **GitHub**
- **.NET CLI**
- **npm**

---

## Project Structure

```text
Helpdesk/
│
├── Helpdesk.Api/
│   │
│   ├── Controllers/
│   │   ├── AdminTicketsController.cs
│   │   ├── AuthController.cs
│   │   ├── CommentsController.cs
│   │   ├── TicketCommentController.cs
│   │   ├── TicketsController.cs
│   │   └── UsersController.cs
│   │
│   ├── Data/
│   │   └── AppDbContext.cs
│   │
│   ├── Dtos/
│   │   ├── Auth/
│   │   ├── Comment/
│   │   ├── Common/
│   │   ├── Ticket/
│   │   └── User/
│   │
│   ├── Exceptions/
│   ├── Extensions/
│   ├── Helpers/
│   ├── Mappers/
│   ├── Middleware/
│   │
│   ├── Models/
│   │   ├── Base/
│   │   ├── Enums/
│   │   ├── ActivityLog.cs
│   │   ├── Comment.cs
│   │   ├── Ticket.cs
│   │   └── User.cs
│   │
│   ├── Services/
│   │   ├── ActivityLogService.cs
│   │   ├── AuthService.cs
│   │   ├── CommentService.cs
│   │   ├── CurrentUserAccessor.cs
│   │   ├── CurrentUserService.cs
│   │   ├── JwtService.cs
│   │   ├── TicketService.cs
│   │   └── UserService.cs
│   │
│   ├── Migrations/
│   ├── Program.cs
│   ├── appsettings.json
│   └── Helpdesk.Api.csproj
│
├── helpdesk-web/
│   │
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── comments/
│   │   │   ├── dashboard/
│   │   │   ├── tickets/
│   │   │   └── users/
│   │   └── ...
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
│
└── README.md
```

---

## API

The backend exposes REST-style endpoints.

### Authentication

```text
POST /api/auth/login
POST /api/auth/logout
```

---

### Tickets

```text
GET    /api/tickets
GET    /api/tickets/{id}
POST   /api/tickets
PUT    /api/tickets/{id}
DELETE /api/tickets/{id}
```

---

### Ticket Comments

```text
GET  /api/tickets/{ticketId}/comments
POST /api/tickets/{ticketId}/comments
```

---

### Comments

```text
PUT    /api/comments/{id}
DELETE /api/comments/{id}
```

---

### Admin Tickets

```text
PUT /api/admin/tickets/{id}
```

---

### Users

User management endpoints are available for administrative operations, including:

- Listing users
- Searching users
- Filtering users
- Sorting users
- Creating users
- Updating users
- Managing account status
- Managing user roles

All protected endpoints require authentication, while administrative operations are additionally restricted by role.

---

## API Documentation

The API uses OpenAPI/Swagger for API specification and Scalar as the interactive API documentation interface during development.

When running the application in development mode, Scalar is configured with the title:

```text
Helpdesk API
```

The API also exposes its OpenAPI document for the Scalar interface.

---

## Database

The application uses:

```text
PostgreSQL
     │
     ▼
Entity Framework Core
     │
     ▼
AppDbContext
```

Database schema changes are managed using Entity Framework Core migrations.

The project currently contains migrations covering features such as:

- Initial database structure
- Soft delete
- Created timestamps
- Base entity fields
- Audit fields
- Optimistic concurrency
- Database-side `CreatedAt` defaults
- Enum conversion
- Ticket numbers
- Activity logs
- Admin seeding

---

## Getting Started

### Prerequisites

Make sure the following are installed:

- [.NET 10 SDK](https://dotnet.microsoft.com/)
- PostgreSQL
- Node.js and npm
- Git

---

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

---

### 2. Configure the database

Configure the PostgreSQL connection string in your application configuration.

Example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=helpdesk_db;Username=your_username;Password=your_password"
  }
}
```

---

### 3. Configure JWT

The application requires JWT configuration:

```json
{
  "Jwt": {
    "Key": "your-secret-key",
    "Issuer": "your-issuer",
    "Audience": "your-audience",
    "ExpireMinutes": 60
  }
}
```

> **Important:** Never commit real database credentials or JWT secrets to the repository.

For local development, use environment variables, .NET user secrets, or another secure configuration method.

---

### 4. Apply database migrations

From the backend directory:

```bash
dotnet ef database update
```

---

### 5. Run the backend

```bash
dotnet run
```

The development configuration currently uses:

```text
http://localhost:5109
https://localhost:7173
```

---

### 6. Install frontend dependencies

From the frontend directory:

```bash
npm install
```

---

### 7. Run the frontend

```bash
npm run dev
```

Vite will provide the local development URL in the terminal.

---

### 8. Open the application

Open the frontend URL provided by Vite in your browser.

Make sure the backend API is running at the same time.

---

## Development Roadmap

### Backend

- [x] Project setup
- [x] PostgreSQL integration
- [x] Entity Framework Core
- [x] Database migrations
- [x] User management
- [x] JWT authentication
- [x] Role-based authorization
- [x] Ticket management
- [x] Ticket comments
- [x] Pagination
- [x] Filtering
- [x] Sorting
- [x] DTOs
- [x] Entity-to-DTO mapping
- [x] `AsNoTracking` for read-only queries
- [x] CancellationToken support
- [x] Audit fields
- [x] Soft delete
- [x] Optimistic concurrency
- [x] Database-side `CreatedAt` defaults
- [x] Enum handling
- [x] Ticket numbers
- [x] Activity logging
- [x] API documentation

### Frontend

- [x] Frontend project setup
- [x] Authentication flow
- [x] Login page
- [x] User dashboard
- [x] Ticket list
- [x] Ticket creation
- [x] Ticket detail page
- [x] Ticket comments
- [x] Ticket status and priority display
- [x] User management
- [x] Admin ticket management
- [x] Backend API integration
- [x] Responsive UI
- [x] Basic accessibility
- [x] Loading states
- [x] Error states
- [x] Empty states
- [x] Form validation
- [x] Success/error notifications
- [x] Authentication state handling
- [x] User flow testing
- [x] Admin flow testing

### Production Readiness

- [ ] Production configuration
- [ ] Production database
- [ ] Production build verification
- [ ] Deploy backend API
- [ ] Deploy frontend
- [ ] Configure reverse proxy
- [ ] HTTPS
- [ ] Production API documentation

---

## Future Improvements

After the MVP and initial deployment are completed, possible future improvements include:

- Ticket categories
- Ticket assignment
- File attachments
- Email notifications
- SLA tracking
- Dashboard analytics
- Advanced search
- Reporting
- Monitoring and logging improvements

These features are not part of the current MVP implementation and may be added as the project evolves.

---

## Project Goals

This project is being developed not only as a CRUD application, but as a practical full-stack system for learning and applying software engineering concepts.

The main goals are:

- Building a real-world REST API
- Understanding ASP.NET Core and Entity Framework Core
- Implementing authentication and authorization
- Designing a maintainable application structure
- Handling data integrity and concurrent updates
- Building a frontend that consumes the API
- Applying frontend architecture with React and TypeScript
- Testing complete user and administrative workflows
- Preparing the application for production deployment

The project prioritizes a practical architecture and incremental development rather than introducing unnecessary complexity.

---

## License

This project is currently intended as a personal learning and portfolio project.
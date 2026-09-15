# Helpdesk System

A full-stack helpdesk and ticket management system built with ASP.NET Core, PostgreSQL, React, and TypeScript.

> 🚀 **Status: MVP Complete**
>
> The core helpdesk workflow is implemented, including authentication, ticket management, comments, user management, administrative operations, data integrity features, and a React-based web frontend.

---

## Overview

Helpdesk System is a web-based application designed to manage internal support requests through a ticket-based workflow.

Users can authenticate, create and manage their own support tickets, communicate through comments, and view their ticket history.

Administrators can manage users, manage tickets, update ticket status and priority, and manage comments.

The project is built as a full-stack application consisting of:

- ASP.NET Core REST API
- PostgreSQL database
- React web frontend
- JWT-based authentication
- Role-based authorization

The project focuses on applying practical software engineering concepts while keeping the architecture straightforward and maintainable.

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

#### Administrators can:

- View and manage tickets
- Update ticket status
- Update ticket priority
- Add comments
- Edit comments
- Delete comments
- Manage tickets through admin-specific functionality

Tickets currently support:

- Unique ticket numbers
- Title
- Description
- Status
- Priority
- Ticket owner
- Creation and update timestamps
- Optimistic concurrency versioning
- Soft deletion
- Audit fields

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
- Audit fields

---

### User Management

Administrators can manage users through the API and web frontend.

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
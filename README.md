# 🔧 FixMate – Smart Device & Home Appliance Repair Platform

A full-stack repair service platform that connects customers with skilled technicians for smartphone, laptop, and home appliance repairs. Customers can explore services, book technicians, track repair progress, and **pay only after their repair is completed**.

| Resource | Link |
|---|---|
| 🌐 Live Website | [https://fixmate-client24.vercel.app/](https://fixmate-client24.vercel.app/) |
| 💻 Client Repository | [https://github.com/walid573/FixMate-Client](https://github.com/walid573/FixMate-Client) |
| ⚙️ Server Repository | [https://github.com/walid573/FixMate-Server](https://github.com/walid573/FixMate-Server) |
| 🔌 Live Backend API | [Add Backend API URL](#) |

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Database Architecture](#️-database-architecture)
- [Application Workflow](#-application-workflow)
- [API Security & Access Control](#-api-security--access-control)
- [Search, Filtering & Sorting](#-search-filtering--sorting)
- [Stripe Payment Integration](#-stripe-payment-integration)
- [Environment Variables](#-environment-variables)
- [Installation & Setup](#-installation--setup)
- [Application Routes](#-application-routes)
- [Testing Credentials](#-testing-credentials)
- [Seed Data](#-seed-data)
- [Deployment Guide](#-deployment-guide)
- [Submission Checklist](#-submission-checklist)
- [Project Information & License](#-project-information--license)

---

## 📌 Overview

**FixMate** is a role-based repair service management platform designed to simplify the process of finding, booking, and managing professional repair services.

Built with Next.js, Express.js, MongoDB, BetterAuth, JWT, and Stripe, the platform provides a centralized solution for customers, technicians, and administrators.

### 👥 User Roles & Responsibilities

| Role | Responsibilities |
|---|---|
| **Customer** | Browse repair services, book technicians, track repair progress, cancel eligible requests, and make payments after service completion. |
| **Technician** | Create and manage repair services, handle incoming requests, update job statuses, and determine final repair costs. |
| **Admin** | Manage users, approve or reject services, monitor bookings, and oversee platform transactions. |

### 🎯 Project Objectives

- Simplify the process of finding reliable repair professionals.
- Provide technicians with a platform to showcase their services.
- Ensure transparency throughout the repair process.
- Enable customers to monitor their repair requests.
- Implement a secure pay-after-service payment system.
- Provide administrators with centralized platform management tools.

---

## ✨ Key Features

### 🔐 Authentication & Authorization

- Secure authentication powered by BetterAuth.
- Separate Customer and Technician registration.
- Google authentication through social login (when configured).
- JWT generation and verification for API authentication.
- Role-based access control on both frontend and backend.
- Protected dashboard routes and API endpoints.
- Secure session handling and user profile management.

### 👤 Customer Features

- Browse approved and available repair services.
- Search services by title or category.
- Filter services by category and service mode.
- Sort services by price or newest listings.
- View detailed service information and technician profiles.
- Submit repair booking requests.
- Prevent duplicate active booking requests.
- Track repair progress through booking statuses.
- Cancel bookings while their status is `requested`.
- Pay after successful service completion.
- View payment history and transaction details.

### 🔧 Technician Features

- Create, edit, and delete personal repair services.
- Upload service images through ImgBB.
- Enable or disable service availability.
- Monitor service approval status.
- Accept or reject incoming repair requests.
- Start repair jobs and update their progress.
- Mark jobs as completed.
- Set the final repair amount.
- Access customer contact information and repair details.

### 🛡️ Admin Features

- Dashboard with platform statistics and revenue information.
- View and manage registered users.
- Manage customer and technician roles.
- Approve or reject technician service listings.
- Monitor all platform bookings.
- View payment transactions.
- Maintain service quality and platform access control.

### 💳 Payment Features

- Stripe Checkout integration in test mode.
- Pay-after-service payment workflow.
- Server-side payment amount verification.
- Booking ownership and completion validation.
- Post-checkout payment verification.
- Store successful transactions in MongoDB.
- Prevent duplicate successful payments.
- Dedicated payment success and cancellation pages.

### 🎨 User Interface & Experience

- Fully responsive design for mobile, tablet, and desktop.
- Modern landing page with a professional layout.
- Sticky navigation bar and responsive footer.
- Role-based dashboard layouts.
- Collapsible dashboard sidebar.
- Loading skeletons and custom empty states.
- Custom 404 page and error handling.
- Toast notifications and confirmation dialogs.
- Consistent status badges and reusable UI components.

---

## 🧰 Technology Stack

FixMate uses modern frontend and backend technologies to provide a scalable and maintainable application architecture.

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js (App Router), React, TypeScript |
| **Styling & UI** | Tailwind CSS, shadcn/ui, Lucide React |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Native Driver) |
| **Authentication** | BetterAuth, JWT |
| **Authorization** | Role-Based Access Control (RBAC) |
| **Payment Gateway** | Stripe |
| **Image Hosting** | ImgBB API |
| **Notifications** | Sonner |
| **Deployment** | Vercel (frontend), [Add Backend Hosting Platform] (backend), MongoDB Atlas (database) |

### 📦 Key Packages

**Frontend**

- `next`
- `react`
- `react-dom`
- `better-auth`
- `mongodb` (used server-side by BetterAuth)
- `jsonwebtoken`
- `lucide-react`
- `sonner`
- `tailwindcss`

**Backend**

- `express`
- `mongodb`
- `cors`
- `dotenv`
- `stripe`
- `jose`

> Dependencies are installed with Bun. Refer to the respective `package.json` files (and `bun.lock`) for exact package versions.

---

## 📁 Project Structure

The project is organized into two main applications: the Next.js frontend and the Express.js backend.

```text
FixMate/
│
├── FixMate-client/
│   ├── public/
│   │   └── images, icons, logos
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/
│   │   │   │   ├── about/
│   │   │   │   ├── services/
│   │   │   │   │   └── [id]/
│   │   │   │   ├── sign-in/
│   │   │   │   └── sign-up/
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── profile/
│   │   │   │   ├── customer/
│   │   │   │   │   ├── overview/
│   │   │   │   │   ├── bookings/
│   │   │   │   │   └── payments/
│   │   │   │   │
│   │   │   │   ├── technician/
│   │   │   │   │   ├── overview/
│   │   │   │   │   ├── add-service/
│   │   │   │   │   ├── my-services/
│   │   │   │   │   └── requests/
│   │   │   │   │
│   │   │   │   └── admin/
│   │   │   │       ├── overview/
│   │   │   │       ├── users/
│   │   │   │       ├── services/
│   │   │   │       ├── bookings/
│   │   │   │       └── transactions/
│   │   │   │
│   │   │   ├── payment/
│   │   │   │   ├── success/
│   │   │   │   └── cancel/
│   │   │   │
│   │   │   ├── api/
│   │   │   │   └── auth/
│   │   │   │       └── [...all]/
│   │   │   │           └── route.ts
│   │   │   │
│   │   │   ├── layout.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── globals.css
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── home/
│   │   │   ├── services/
│   │   │   ├── dashboard/
│   │   │   └── ui/
│   │   │
│   │   ├── lib/
│   │   │   ├── auth.ts
│   │   │   ├── auth-client.ts
│   │   │   ├── utils.ts
│   │   │   ├── imgbb.ts
│   │   │   └── api/
│   │   │       ├── services.ts
│   │   │       ├── bookings.ts
│   │   │       ├── payments.ts
│   │   │       ├── users.ts
│   │   │       └── admin.ts
│   │   │
│   │   ├── hooks/
│   │   ├── types/
│   │   └── middleware.ts
│   │
│   ├── .env.local
│   ├── components.json
│   ├── next.config.ts
│   └── package.json
│
├── FixMate-server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── mongodb.js
│   │   │   └── stripe.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── verifyToken.js
│   │   │   ├── verifyCustomer.js
│   │   │   ├── verifyTechnician.js
│   │   │   └── verifyAdmin.js
│   │   │
│   │   ├── routes/
│   │   │   ├── services.js
│   │   │   ├── bookings.js
│   │   │   ├── payments.js
│   │   │   ├── users.js
│   │   │   └── admin.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── services.js
│   │   │   ├── bookings.js
│   │   │   ├── payments.js
│   │   │   ├── users.js
│   │   │   └── admin.js
│   │   │
│   │   ├── utils/
│   │   │   ├── generateToken.js
│   │   │   └── paymentVerification.js
│   │   │
│   │   └── index.js
│   │
│   ├── .env
│   └── package.json
│
└── README.md
```

> **Note:** This structure represents the intended project organization. Actual filenames and folders may vary slightly depending on the implementation.

---

## 🗄️ Database Architecture

FixMate uses MongoDB as its primary database, with four main application collections.

| Collection | Description |
|---|---|
| `users` | Stores user profiles, contact information, and application roles. |
| `services` | Stores technician service listings, pricing, availability, and approval information. |
| `bookings` | Stores customer repair requests, job details, and repair statuses. |
| `payments` | Stores successful payment transactions and Stripe references. |

### 📋 Collection Fields

<details>
<summary><strong>View database collection fields</strong></summary>

**1. users**

```text
_id
name
email
image
role
phone
area
bio
```

**2. services**

```text
_id
title
category
description
image
basePrice
estimatedDuration
serviceMode
serviceArea
technicianName
technicianEmail
approvalStatus
isAvailable
createdAt
```

**3. bookings**

```text
_id
serviceId
serviceTitle
serviceImage
category
basePrice
technicianName
technicianEmail
customerName
customerEmail
customerPhone
address
preferredDate
problemDescription
status
finalAmount
paymentStatus
```

**4. payments**

```text
_id
bookingId
serviceTitle
customerName
customerEmail
technicianName
technicianEmail
amount
currency
transactionId
stripeSessionId
paymentStatus
paidAt
```

</details>

### 🔗 BetterAuth Database Integration

BetterAuth manages authentication-related data, including:

- `user`
- `session`
- `account`
- `verification`

The application's user profile fields are extended through BetterAuth `additionalFields`.

Depending on the database adapter and collection configuration, the BetterAuth user collection can serve as the application's user collection. The four application collections described above do not imply that BetterAuth creates four additional application collections.

### 🔄 Database Relationships

- **Users → Services:** One technician can create multiple services.
- **Services → Bookings:** One service can receive multiple booking requests.
- **Customers → Bookings:** One customer can create multiple bookings.
- **Technicians → Bookings:** One technician can manage multiple bookings.
- **Bookings → Payments:** Each completed booking can have at most one successful payment.

---

## 🔄 Application Workflow

FixMate follows a structured repair booking lifecycle to ensure transparency between customers and technicians.

### Complete Workflow

1. **User Registration:** Users register as Customers or Technicians.
2. **Service Creation:** Technicians publish repair services, initially marked as pending.
3. **Admin Approval:** Administrators review and approve or reject submitted services.
4. **Service Discovery:** Customers browse approved and available repair services.
5. **Booking Request:** Customers submit repair requests with their contact information, address, preferred date, and problem description.
6. **Request Management:** Technicians accept or reject incoming requests.
7. **Repair Process:** Accepted bookings move to the `in-progress` state.
8. **Job Completion:** Technicians complete the repair and specify the final repair amount.
9. **Payment:** Customers pay securely through Stripe Checkout.
10. **Payment Verification:** The backend verifies the transaction and stores the successful payment in MongoDB.

### 📊 Booking Status Lifecycle

```text
                 ┌─────────────┐
                 │  Requested  │──────────► Cancelled (by customer)
                 └──────┬──────┘
                        │
               ┌────────┴────────┐
               ▼                 ▼
         ┌──────────┐      ┌──────────┐
         │ Accepted │      │ Rejected │
         └────┬─────┘      └──────────┘
              │
              ▼
        ┌─────────────┐
        │ In Progress │
        └──────┬──────┘
               │
               ▼
         ┌───────────┐
         │ Completed │
         └─────┬─────┘
               │  (customer pays)
               ▼
   paymentStatus: unpaid → paid
```

**Booking Cancellation:** Customers can cancel their requests only while the booking status is `requested`.

**Payment Status:** Payment is tracked separately in the `paymentStatus` field (`unpaid` → `paid`). A booking's `status` remains `completed` after payment.

---

## 🔒 API Security & Access Control

FixMate implements JWT-based authentication and role-based authorization using custom Express middleware.

### Authentication Middleware

| Middleware | Responsibility |
|---|---|
| `verifyToken` | Validates the JWT and authenticates incoming requests. |
| `verifyCustomer` | Restricts access to customer-only operations. |
| `verifyTechnician` | Restricts access to technician-only operations. |
| `verifyAdmin` | Restricts access to administrator-only operations. |

### API Access Control

| Endpoint | Access |
|---|---|
| `GET /api/services` | Public |
| `GET /api/services/:id` | Public |
| `POST /api/services` | Technician |
| `PATCH /api/services/:id` | Technician |
| `DELETE /api/services/:id` | Technician |
| `POST /api/bookings` | Customer |
| `GET /api/bookings/my` | Customer |
| `PATCH /api/bookings/:id/cancel` | Customer |
| `GET /api/bookings/technician` | Technician |
| `PATCH /api/bookings/:id/status` | Technician |
| `POST /api/payments/create-checkout-session` | Customer |
| `GET /api/admin/users` | Admin |
| `PATCH /api/admin/users/:id/role` | Admin |
| `PATCH /api/admin/services/:id/approval` | Admin |
| `GET /api/admin/bookings` | Admin |
| `GET /api/admin/payments` | Admin |
| `PATCH /api/users/profile` | Authenticated Users |

> Additional endpoints (for example, post-checkout payment verification or fetching a customer's payment history) may exist in the source code. Add them here if your implementation includes them.

### 🛡️ Security Rules

- Unauthenticated requests receive `401 Unauthorized`.
- Authenticated users without sufficient permissions receive `403 Forbidden`.
- Users can access only their own protected information.
- Technicians can manage only their own services and assigned repair requests.
- Customers cannot book their own services.
- Duplicate active booking requests are prevented.
- Only valid booking status transitions are permitted.
- Customers can pay only for completed and unpaid bookings.
- Payment amounts are calculated and validated by the backend using database records.
- Sensitive credentials and secret keys are stored in environment variables.

---

## 🔎 Search, Filtering & Sorting

The Browse Services page provides flexible service discovery through server-side search and filtering.

### Available Options

| Feature | Functionality |
|---|---|
| **Search** | Search services by title or category. |
| **Category Filter** | Filter by repair category. |
| **Service Mode Filter** | Filter by available service modes. |
| **Price Sorting** | Sort from lowest to highest or highest to lowest price. |
| **Newest First** | Display recently published services first. |

### Query Parameter Support

Search, filtering, and sorting options are maintained through URL query parameters.

Example:

```text
/services?category=AC
```

This allows users to refresh or share filtered service pages without losing their selected filters.

---

## 💳 Stripe Payment Integration

FixMate implements a **Pay After Service** payment model using Stripe Checkout.

Customers are charged only after technicians complete the repair and specify the final repair amount.

### Payment Workflow

1. Technician marks the booking as `completed`.
2. Technician sets the final repair amount.
3. Customer selects the **Pay Now** option.
4. Frontend sends a checkout request to the backend.
5. Backend validates:
   - Booking ownership.
   - Booking completion status.
   - Existing payment status.
   - Final repair amount stored in MongoDB.
6. Backend creates a Stripe Checkout Session.
7. Customer completes payment through Stripe.
8. Backend verifies the payment result.
9. Successful payment information is stored in MongoDB.
10. Booking payment status is updated to `paid`.

### 💳 Stripe Test Card

Use the following Stripe test card details to simulate a successful transaction.

| Field | Test Value |
|---|---|
| Card Number | `4242 4242 4242 4242` |
| Expiry Date | Any future date |
| CVC | Any three digits |
| ZIP / Postal Code | Any valid ZIP code |

> **Important:** Use Stripe test-mode credentials for testing. Never use real payment information in development demonstrations.

---

## 🔐 Environment Variables

Configure the following environment variables before running the applications.

**Important:** Never commit `.env` or `.env.local` files to GitHub. Keep secret keys private and never expose server-side credentials through `NEXT_PUBLIC_` variables.

### Frontend – `.env.local`

```env
# Backend API base URL
NEXT_PUBLIC_BASE_URL=http://localhost:8000

# BetterAuth (server-side only)
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000

# Server-side only – never prefix these with NEXT_PUBLIC_
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Public by design (visible in the browser)
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Optional – only needed if you use Stripe.js on the client.
# Not required for a server-created Stripe Checkout redirect.
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Optional – only if Google social login is enabled
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Backend – `.env`

```env
PORT=8000

MONGODB_URL=your_mongodb_connection_string
DB_NAME=fixmate

# Must match the secret used by the frontend to sign tokens
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000

STRIPE_SECRET_KEY=your_stripe_secret_key

# Optional – only needed if Stripe webhooks are implemented
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

> **Configuration note:** These are example variable names. Ensure they match the actual environment variable references in your source code. `MONGODB_URL`, `JWT_SECRET`, and `BETTER_AUTH_SECRET` must remain server-side only.

---

## 🚀 Installation & Setup

Follow these steps to run FixMate locally.

### Prerequisites

Make sure the following tools and accounts are available:

- Node.js 18 or later (required by Next.js and by most hosting platforms).
- [Bun](https://bun.sh) package manager and runtime (used for installing dependencies and running scripts).
- MongoDB Atlas account or local MongoDB installation.
- Stripe account with test API credentials.
- ImgBB account and API key.
- Git installed on your machine.

### 1. Clone the Repositories

```bash
git clone https://github.com/walid573/FixMate-Client.git
git clone https://github.com/walid573/FixMate-Server.git
```

### 2. Configure and Run the Backend

```bash
cd FixMate-Server

bun install
```

Create a `.env` file in the backend root directory and configure the required environment variables.

Start the development server:

```bash
bun run dev
```

The backend API will run at:

```text
http://localhost:8000
```

### 3. Configure and Run the Frontend

Open a new terminal:

```bash
cd FixMate-Client

bun install
```

Create a `.env.local` file in the frontend root directory and configure the required environment variables.

Start the Next.js development server:

```bash
bun run dev
```

The frontend application will be available at:

```text
http://localhost:3000
```

### 4. Verify the Application

After starting both applications:

- Open the frontend in your browser.
- Register or sign in to your account.
- Browse available repair services.
- Test the booking workflow.
- Verify technician and admin dashboard functionality.
- Test Stripe Checkout using the provided test card.

---

## 📍 Application Routes

The application provides dedicated routes for public users, customers, technicians, and administrators.

### 🌐 Public Routes

| Route | Description |
|---|---|
| `/` | Home Page |
| `/services` | Browse Repair Services |
| `/services/[id]` | Service Details |
| `/about` | About FixMate |
| `/sign-in` | User Sign In |
| `/sign-up` | User Registration |
| `/payment/success` | Payment Success |
| `/payment/cancel` | Payment Cancellation |

### 👤 Customer Dashboard

| Route | Description |
|---|---|
| `/dashboard/customer/overview` | Customer Overview |
| `/dashboard/customer/bookings` | My Bookings |
| `/dashboard/customer/payments` | Payment History |

### 🔧 Technician Dashboard

| Route | Description |
|---|---|
| `/dashboard/technician/overview` | Technician Overview |
| `/dashboard/technician/add-service` | Add New Service |
| `/dashboard/technician/my-services` | Manage Services |
| `/dashboard/technician/requests` | Manage Repair Requests |

### 🛡️ Admin Dashboard

| Route | Description |
|---|---|
| `/dashboard/admin/overview` | Admin Overview |
| `/dashboard/admin/users` | Manage Users |
| `/dashboard/admin/services` | Manage Service Approvals |
| `/dashboard/admin/bookings` | Monitor All Bookings |
| `/dashboard/admin/transactions` | Manage Transactions |

### ⚙️ Shared Routes

| Route | Description |
|---|---|
| `/dashboard/profile` | Manage User Profile |

> Visiting `/dashboard/customer`, `/dashboard/technician`, or `/dashboard/admin` should redirect to the matching `overview` page.

---

## 🧪 Testing Credentials

The following accounts can be used to evaluate the application.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@tech.com` | `Admin123` |
| Technician | `technician@tech.com` | `technician123` |
| Customer | `customer@tech.com` | `Customer123` |

> Ensure these accounts are registered in the production database and assigned the correct application roles before submitting the project.

---

## 🌱 Seed Data

For a meaningful demonstration and evaluation experience, the production database should contain realistic sample data.

### Recommended Seed Data

- At least 2 technician accounts.
- At least 12 approved repair services.
- Services distributed across multiple repair categories.
- Several bookings with different job statuses.
- A few successful payment transactions.

### Suggested Service Categories

- 📱 Smartphone Repair
- 💻 Laptop & PC Repair
- ❄️ Air Conditioner Repair
- 🧊 Refrigerator Repair
- 📺 Television Repair
- 🧺 Washing Machine Repair
- ⚡ Electrical Repair

---

## 🌍 Deployment Guide

FixMate uses separate deployment environments for the frontend, backend, and database.

### 1. Frontend Deployment – Vercel

1. Import the client repository into Vercel (Vercel detects `bun.lock` and installs dependencies with Bun automatically).
2. Configure all required frontend environment variables.
3. Set the production `BETTER_AUTH_URL` (for example, `https://fixmate-client24.vercel.app`).
4. Configure BetterAuth trusted origins for the production domain.
5. Set `NEXT_PUBLIC_BASE_URL` to the deployed backend API URL.
6. Deploy the application.
7. Verify public pages and protected dashboard routes.

### 2. Backend Deployment – Node.js Hosting Platform

1. Import the server repository into your preferred Node.js hosting platform.
2. Configure production environment variables.
3. Set the production frontend URL in `CLIENT_URL`.
4. Configure Express CORS to allow the frontend domain.
5. Connect the backend to MongoDB Atlas.
6. Configure the Stripe webhook endpoint and signing secret if webhooks are implemented.
7. Deploy the backend.
8. Verify all API endpoints and authentication middleware.

### 3. Database Deployment – MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Configure database access credentials.
3. Set the appropriate network access rules (allow your hosting platforms' IPs, or `0.0.0.0/0` for serverless hosts).
4. Add the production MongoDB connection string to both the backend and frontend environments.
5. Verify database connectivity and collection operations.

### 4. Final Production Verification

- Verify frontend-to-backend communication.
- Test BetterAuth authentication.
- Verify JWT authorization.
- Test customer, technician, and admin workflows.
- Test service image uploads.
- Complete a Stripe test transaction.
- Verify payment records in MongoDB.
- Check production logs for unexpected errors.

---

## ✅ Submission Checklist

Use this checklist to verify the project before final submission.

### Deployment & Functionality

- [ ] Frontend and backend deployments are accessible.
- [ ] MongoDB production connection works.
- [ ] BetterAuth authentication works correctly.
- [ ] JWT verification and role-based authorization work.
- [ ] Protected dashboard routes reload correctly.
- [ ] Customer booking workflow works.
- [ ] Technician request management works.
- [ ] Admin management functionality works.
- [ ] Stripe test payments work correctly.
- [ ] ImgBB image uploads work.
- [ ] No unexpected CORS errors or broken images.
- [ ] Production testing accounts are functional.

### GitHub & Repository

- [ ] Client repository is publicly accessible (if required).
- [ ] Server repository is publicly accessible (if required).
- [ ] At least 20 meaningful client-side commits.
- [ ] At least 12 meaningful server-side commits.
- [ ] Commit messages clearly describe changes.
- [ ] No secret credentials or environment files are committed.

**Examples of meaningful commit messages:**

```text
feat: integrate Stripe checkout
feat: implement technician service management
fix: prevent duplicate booking requests
fix: improve JWT authentication validation
style: improve responsive dashboard layout
refactor: organize booking API functions
```

### README & Documentation

- [x] Project name and description are included.
- [x] Live website URL is provided.
- [x] Client and server repository links are provided.
- [x] Key features and technology stack are documented.
- [x] Project structure is included.
- [x] Database architecture is documented.
- [x] Environment variables are explained.
- [x] Installation instructions are provided.
- [x] Admin testing credentials are included.
- [x] Deployment instructions are documented.

---

## 👨‍💻 Project Information & License

| Information | Details |
|---|---|
| **Project Name** | FixMate |
| **Assignment** | Assignment 9 – Category 006 |
| **Project Type** | Full-Stack Web Application |
| **Frontend** | Next.js, React, TypeScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Authentication** | BetterAuth & JWT |
| **Payment Gateway** | Stripe |
| **Image Hosting** | ImgBB |

### 📄 License

This project has been developed for educational and evaluation purposes as part of **Assignment 9 – Category 006**.

All rights are reserved to the respective project contributors. Third-party libraries, frameworks, and services remain subject to their respective licenses and terms of use.

---

**Built with ❤️ to make device and home appliance repairs easier, faster, and more transparent.**

*FixMate – Your Trusted Repair Partner.*
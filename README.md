# Catalog Pollings

## Overview

**Catalog Pollings** is a polling application frontend built with Next.js and styled using Tailwind CSS. The application allows users to create and participate in polls seamlessly. Authentication is implemented using Passkeys to ensure a secure and passwordless experience.

## Features

- **Passkey-based Registration and Login:** Passwordless, secure user authentication.
- **Interactive Poll Management:** Create, manage, and participate in polls with ease.
- **Real-time Results Visualization:** View poll results dynamically as they update.
- **Responsive UI:** Optimized for all screen sizes and devices.

## Configuration

- **Environment Variables:**
    - `NEXT_PUBLIC_BACKEND_BASE_URL`: Backend API base URL.

## Deployment

The application is live at: [Catalog Pollings](https://catalog-pollings.vercel.app/)

Documentation: [Catalog Pollings Docs](https://catalog-pollings.vercel.app/docs)

## Local Setup

Follow these steps to run the project locally:

1. Clone the Repository

```bash
git clone https://github.com/svssathvik7/catalog_pollings.git
cd catalog_pollings
```

2. Install Dependencies

```bash
yarn install
```

3. Configure Environment Variables

Create a `.env` file in the project root and add the following:

```code
NEXT_PUBLIC_API_URL=<your-backend-api-url>
```

4. Start the Development Server

```bash
yarn run dev
```

5. Access the Application

Once the server is running, visit the application in your browser at: `http://localhost:3000`


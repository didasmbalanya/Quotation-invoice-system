# Quotation & Invoice Microservice (TypeScript + Sequelize + MySQL)

A backend service for managing quotations and invoices for a restaurant system.

## Features

- Create, update, and list quotations
- Convert quotation into immutable invoice
- Generate on-the-fly PDF files
- TypeScript-first with Sequelize ORM

## Tech Stack

- Node.js


- TypeScript
- Express.js
- Sequelize ORM
- MySQL
- PDFKit

## Environment Setup

Create the following environment files in your project root:

- `.env.development`
- `.env.test`
- `.env.production`

Each file should contain:

```
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASS=your_db_password
DB_HOST=localhost
```

The application will automatically load the correct environment file based on `NODE_ENV` (`development`, `test`, or `production`).

## Setup

```bash
npm install
npm run dev
```
## Test Setup
Integration tests have been written to work with a mysql db. The tests automatically clear the DB and so they can be rerun many times without any issues.

1. Start your mysql db
2. Fill your .env.test file
3. run
```bash
npm install
npm run test
```
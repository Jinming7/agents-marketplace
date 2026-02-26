# Marketplace

A modern marketplace application built with Vite + React and Express.

## Features

- 🔍 Search and filter apps
- 📱 Modern UI with gradients and animations
- 🔐 User authentication (login/register)
- ⬇️ App installation flow
- 📊 Category browsing

## Tech Stack

- **Frontend**: Vite + React + TypeScript
- **Backend**: Express + TypeScript
- **Deployment**: Vercel

## Getting Started

### Install dependencies

```bash
cd apps/frontend && npm install
cd apps/backend && npm install
```

### Run development

```bash
# Terminal 1 - Backend
cd apps/backend && npm run dev

# Terminal 2 - Frontend
cd apps/frontend && npm run dev
```

### Build

```bash
cd apps/frontend && npm run build
```

## API Endpoints

- `GET /api/apps` - List all apps
- `GET /api/apps/:id` - Get app details
- `GET /api/categories` - List categories
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

## License

MIT

# Iglesia Nueva Vida Internacional — PRD

## Original Problem Statement
Spanish website for Christian Pentecostal church that displays news, embeds a radio program ("Impacto de Dios al Pueblo") which announces church events, with a clean and professional look.

## Architecture
- Backend: FastAPI + Motor (MongoDB), JWT Bearer auth, bcrypt
- Frontend: React 19 + React Router 7 + Tailwind + Shadcn (sonner toasts)
- Routes: `/`, `/noticias`, `/eventos`, `/radio`, `/nosotros`, `/admin`, `/admin/panel`
- Auth: single admin, seeded from env (ADMIN_EMAIL / ADMIN_PASSWORD), token in localStorage `inv_token`

## User Personas
- Public visitors (Spanish-speaking community in Scranton, PA)
- Church administrator (single account managing content)

## Core Requirements
- Spanish content throughout the public site
- Embedded live radio player on home + dedicated /radio page
- News listing with detail modal
- Events listing with featured event highlighting
- Admin panel for full CRUD on news and events

## Implemented (2025-12)
- Public site: hero, embedded radio strip, news/events bento, weekly verse, About page, Events page, News page with modal, Radio dedicated page
- Backend CRUD endpoints with JWT-protected mutations
- Admin login + dashboard with tabs (news/events), modal form, edit/delete
- Sample news (3) and events (2, one featured) auto-seeded
- 100% pass on backend (8/8) and frontend (12/12) testing agent flows

## Prioritized Backlog
- P1: Replace placeholder radio stream URL with real Iglesia Nueva Vida stream
- P1: Real contact phone, email, full address
- P2: Image uploads (currently URL-only)
- P2: Multi-author / role-based admin
- P2: Live "now playing" metadata from radio stream
- P3: Donation / "Ofrenda" page (Stripe/PayPal)
- P3: Sermon archive (audio/video)

## Next Tasks
- Provide real radio stream URL
- Provide actual contact info & address

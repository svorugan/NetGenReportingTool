# Reporting Tool with LLM-Assisted Query Builder

## Notes
- Front-end: React (Vite) with TypeScript for fast DX & rich ecosystem.
- UI library: Material-UI (MUI) for ready components (tables, dialogs, theming).
- Charts: Recharts or Chart.js wrapped in React-chartjs-2.
- Back-end: Node.js (Express) + TypeScript; Prisma ORM for database access & migrations.
- Database: PostgreSQL, Oracle, and Snowflake as primary reporting sources; later support multiple engines via Prisma.
- Authentication: JSON Web Tokens (JWT) with bcrypt password hashing; Passport.js JWT strategy.
- LLM layer: OpenAI (or Azure OpenAI) GPT-4o via REST. Prompt engineering to convert NL -> SQL using database schema description.
- Security: Parameterized queries & role-based access control to limit accessible tables.
- Deployment: Docker-compose (db + api + web) with CI/CD via GitHub Actions.
- Future: Add multi-tenant support and caching of frequent reports.
- Oracle connector scaffolded using `oracledb`; HR schema metadata included.
- Node backend project scaffolded (Express, TypeScript, env config, tsconfig, npm scripts).
- .gitignore added and Git repository initialized (GitHub: svorugan/NetGenReportingTool)

## Task List
- [ ] Gather detailed requirements & schema samples from user.
- [ ] Finalize tech stack and repo structure (monorepo with pnpm workspaces).
- [ ] Scaffold React app with Vite + MUI + React-Router.
- [ ] Scaffold Express API with TypeScript, Prisma, PostgreSQL connection.
- [ ] Implement authentication:
  - [ ] User registration & login endpoints (JWT issuance).
  - [ ] Front-end login page and protected route guard.
- [ ] Settings page:
  - [ ] UI form to add/edit database connections (host, port, user, pwd, dbname).
  - [ ] API endpoints & Prisma models for connection configs.
- [ ] Implement data source connectors:
  - [x] Oracle connector implementation.
  - [ ] Snowflake connector implementation.
- [ ] LLM Query Builder:
  - [x] Create prompt template including selected connection's schema.
  - [x] Endpoint that sends user NL request to OpenAI and returns generated SQL.
  - [ ] Front-end wizard to display generated SQL and let user approve/modify.
- [ ] Query Execution & Visualization:
  - [ ] Securely execute approved SQL against selected database via Prisma/raw.
  - [ ] Display results in data grid.
  - [ ] Offer chart suggestions (bar, line, pie) and render with Recharts.
- [ ] Report Management:
  - [ ] Save report definition (NL prompt, SQL, chart config) to user profile.
  - [ ] List, run, edit, delete saved reports.
- [ ] Deployment scripts (Docker-compose, env management).
- [ ] Basic test suite (API integration tests & React component tests).
- [x] Add .gitignore and push initial commit to GitHub.

## Current Goal
- Scaffold React front-end

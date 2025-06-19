# NextGen Reporting Tool Backend

## Overview
This is the backend service for the NextGen Reporting Tool, focused on Oracle E-Business Suite (EBS) HR reporting with LLM-assisted SQL generation.

## Features
- Oracle EBS direct database connector (using `oracledb`)
- LLM endpoint for natural language to SQL (via OpenAI GPT-4o)
- Endpoints for schema metadata and query execution
- TypeScript, Express, and best-practice project structure

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your Oracle and OpenAI credentials.
3. Run the development server:
   ```sh
   npm run dev
   ```

## Endpoints
- `POST /api/llm/generate-sql` — Generate SQL from a natural language prompt
- `GET /api/oracle/schema` — Get HR schema metadata
- `POST /api/oracle/execute` — Execute approved SQL query

## Environment Variables
- `ORACLE_USER`, `ORACLE_PASSWORD`, `ORACLE_CONNECTION_STRING`
- `OPENAI_API_KEY`
- `PORT` (default: 4000)

## Notes
- Only safe, read-only queries should be executed via `/execute`.
- LLM prompt includes business logic and schema context for best results.

---

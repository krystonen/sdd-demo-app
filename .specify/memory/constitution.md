

# SDD Demo App Constitution

## Core Principles

### I. Static-First Delivery

The production site MUST ship as a Vite-built static or edge-deployable client bundle
(HTML, CSS, JS, assets). Custom server runtimes and databases are OUT OF SCOPE unless
added via constitution amendment. Shopify checkout and catalog integration MUST use
client-side or host-supported patterns compatible with static deployment.

**Rationale**: Keeps operations simple on Vercel (or equivalent) while still allowing a
rich React storefront.

### II. Browser-Verifiable & Tested Logic

Every feature MUST be demonstrable in a modern browser. Business logic (i18n rules, age
verification, catalog mapping, Shopify adapters, form validation) MUST have automated
Vitest coverage; UI smoke checks remain the default integration gate unless a spec
requires more.

**Rationale**: React UI needs fast unit tests for branching logic; the browser confirms
end-to-end behavior.

### III. Simplicity (YAGNI)

Use the approved stack below. Dependencies beyond React, Vite, Vitest, scoped CSS, and
Shopify integration libraries MUST be justified in the plan's Complexity Tracking table
before adoption.

**Rationale**: Prevents framework sprawl while allowing the chosen baseline toolchain.

## Stack Constraints

- **Application**: React (current stable) with Vite as the build tool and dev server.
- **Styling**: Scoped CSS only—CSS Modules, vanilla-extract, or equivalent per-component
scoping. Avoid unscoped global styles except minimal resets/theme tokens.
- **Testing**: Vitest for unit and integration tests; business-logic modules MUST have
tests before a user story is marked complete.
- **Hosting**: Deploy to **Vercel** by default, or another platform only if it offers
simpler Shopify integration with the same static/edge model—choice MUST be recorded
in `plan.md`.
- **Commerce**: Shopify integration MUST use the simplest supported approach for the
chosen host (e.g., Storefront API / Buy Button / embed from the React app without a
custom backend unless Complexity Tracking approves one).
- **Assets**: Built output MUST work on the target host with correct base paths and
environment variables for Shopify storefront configuration.

## Development Workflow

- Features follow Spec Kit branches and artifacts under `specs/` per project workflow.
- Run `npm test` (Vitest) for touched business logic; verify acceptance scenarios in
the browser via `npm run dev` or preview deploy.
- Constitution violations MUST be recorded in `plan.md` Complexity Tracking before merge.

## Governance

- This constitution overrides conflicting conventions for Spec Kit-driven work.
- Amendments MUST update `.specify/memory/constitution.md`, bump `CONSTITUTION_VERSION`
per semantic versioning, and set `LAST_AMENDED_DATE` to the amendment date.
- `/speckit-plan` Constitution Check and `/speckit-analyze` MUST validate against the
active principles in this file.
- Guidance for agents: `.cursor/rules/specify-rules.mdc` and the current feature
`plan.md`.

**Version**: 1.1.0 | **Ratified**: 2026-05-28 | **Last Amended**: 2026-06-02
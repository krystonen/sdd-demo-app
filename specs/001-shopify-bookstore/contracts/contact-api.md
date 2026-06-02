# Contract: Contact Form Submission

**Client**: `ContactPage` form submit handler  
**Server**: Vercel serverless `api/contact.ts` (preferred) OR external Formspree endpoint

## Request (Vercel function)

`POST /api/contact`

```json
{
  "name": "string",
  "email": "string",
  "message": "string",
  "locale": "en" | "hu"
}
```

## Validation (shared module `src/lib/contactValidation.ts`)

| Field | Rules |
|-------|--------|
| `name` | required, trim, length ≥ 2 |
| `email` | required, RFC5322-simple regex |
| `message` | required, trim, length ≥ 10 |
| `locale` | required, enum |

Vitest: all rules + localized error message keys.

## Response

| Status | Body | UI |
|--------|------|-----|
| 200 | `{ "ok": true }` | Success message in active locale |
| 400 | `{ "ok": false, "errors": { field: code } }` | Inline field errors |
| 500 | `{ "ok": false }` | Generic error message |

## Environment (Vercel)

| Variable | Description |
|----------|-------------|
| `CONTACT_TO_EMAIL` | Store owner inbox |
| `RESEND_API_KEY` or `SENDGRID_API_KEY` | Mail provider (one required) |

## Formspree fallback

If `VITE_CONTACT_FORM_ENDPOINT` is set, POST JSON directly from client; skip Vercel function. Document in `quickstart.md`.

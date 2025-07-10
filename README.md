# Hovercode Vercel Proxy

A tiny Vercel backend to securely call the Hovercode API and return PNG + shortlink URLs.

POST JSON to `/api/hovercode`:

```json
{
  "url": "https://example.com",
  "workspace": "YOUR_WORKSPACE_ID"
}

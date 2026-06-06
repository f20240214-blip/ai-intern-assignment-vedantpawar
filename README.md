# AI-intern-assignment-vedantpawar

**Name:** Vedant Pawar
**Email:** f20240214@pilani.bits-pilani.ac.in
**Date of Submission:** 6 June 2026

---

## Repository Structure

```
ai-intern-assignment-vedantpawar/
├── part-a/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── script.js
├── part-b/
│   ├── workflow-b1-lead-notification.json
│   ├── workflow-b2-scheduled-fetch.json
│   ├── screenshot-b1.png
│   └── screenshot-b2.png
├── part-c/
│   ├── index.html
│   └── loom-link.txt
└── README.md
```

---

## Part A — Student Lead Capture Form

`part-a/index.html` defines the structure of the lead capture form with the following fields: Full Name, Email, Country (dropdown), Course Level (radio: UG/PG/PhD), Preferred University, and Message (textarea).

`part-a/css/styles.css` handles all visual styling including layout, responsive design for mobile screens, error state highlighting, and the thank-you message display. It is linked to `index.html` via a `<link>` element in the `<head>`.

`part-a/js/script.js` implements all interactive behaviour — inline field validation with error messages, a live 300-character counter on the Message textarea, a success thank-you message shown on valid submission without page reload, and a JSON log of the form data to the browser console. It is linked to `index.html` via a `<script>` element at the bottom of `<body>`.

**How to run:** Open `part-a/index.html` with VS Code Live Server or any local HTTP server.

---

## Part B — N8N Automation Workflows

### B1 — Lead Notification Workflow

`part-b/workflow-b1-lead-notification.json`

The workflow is triggered by a **Webhook node** configured to accept POST requests at the path `/leadform`. A **Set node** extracts and renames key fields from the incoming JSON body — `name`, `email`, `courseLevel`, and `message`. An **IF node** then evaluates the `courseLevel` field:

- If `courseLevel` equals `UG` → routes to a **No-Op node** (mock for Google Sheets, as Google Sheets access was unavailable)
- If `courseLevel` equals `PG` or `PhD` → routes to a **Gmail node** which sends an email notification with the lead's details to a designated inbox

**How to test:** Activate the workflow in N8N, then submit a POST request to the production webhook URL with a JSON body containing the form fields.

---

### B2 — Scheduled Data Fetch Workflow

`part-b/workflow-b2-scheduled-fetch.json`

A **Schedule Trigger** node is configured to activate every day at 9:00 AM. It triggers an **HTTP Request node** which sends a GET request to the Universities API:

```
http://universities.hipolabs.com/search?country=Canada
```

A **Code node** then executes the following JavaScript transformation on the API response — it maps over all returned items, extracts only the relevant fields, and limits the output to 10 results, returning a structured JSON array:

```javascript
const filtered = $input.all().map((item) => ({
  json: {
    name: item.json.name,
    country: item.json.country,
    website: item.json.web_pages?.[0] || "N/A",
    domain: item.json.domains?.[0] || "N/A",
  },
}));

return filtered.slice(0, 10);
```

Each output item contains four clean, labelled fields: `name`, `country`, `website`, and `domain`.

**Why the Universities API?**

- Free to use with no API key required
- Directly relevant to HSA's core business of connecting students to universities globally
- Returns structured JSON that demonstrates meaningful filtering and transformation
- Reliable and publicly maintained

**How to test:** Manually trigger the workflow in N8N using the "Test workflow" button.

---

## Part C — Integration Challenge (Bonus)

`part-c/index.html`

Part C connects the Part A form directly to the B1 N8N webhook using `fetch()`. The `part-a/index.html` was copied into `part-c/` and the following modifications were made:

**HTML change:** The submit button was updated to include two child `<span>` elements — `#btnText` (displays "Submit") and `#btnLoader` (displays "Sending...", hidden by default) — to support a visual loading state during submission.

**JS change:** After all validation passes, instead of logging to the console, the submit handler now fires a `fetch()` POST request to the B1 production webhook URL with `Content-Type: application/json`. During the request the button is disabled and the loading span is shown. On success, the thank-you message is displayed and the form is reset. On a non-ok HTTP response, an alert reads "Submission failed. Please try again." On a network-level failure, an alert reads "Network error. Please check your connection." The `finally()` block restores the button to its original state in all cases.

**Current status:** The form submits and shows the loading state correctly. A CORS policy error is being encountered between the local Live Server origin and the N8N cloud webhook URL. This is being resolved by enabling the Allowed Origins (CORS) setting on the Webhook node in N8N and ensuring the workflow is set to Active so the production URL is live.

---

## Credentials & Environment Variables

| Variable                   | Placeholder                                                       |
| -------------------------- | ----------------------------------------------------------------- |
| N8N Webhook Production URL | `https://<your-n8n-instance>.app.n8n.cloud/webhook/leadform`      |
| N8N Webhook Test URL       | `https://<your-n8n-instance>.app.n8n.cloud/webhook-test/leadform` |
| Gmail OAuth Credential     | Configured via N8N Gmail OAuth2 — no hardcoded credentials        |

---

## Challenges & Resolutions

1. **Set node expressions rendering as plain text in N8N** — the field values in the Set node were being saved as fixed strings instead of expressions. Resolved by deleting all fields and re-adding them using the expression editor (`fx` mode) rather than the fixed value input.

2. **Universities API returning a flat array as separate N8N items** — initially assumed the entire API response was one item containing an array, causing `.slice()` to fail. Resolved by using `$input.all().map()` to iterate over each item individually, then applying `.slice(0, 10)` on the final mapped array.

3. **CORS error blocking fetch() in Part C** — submitting the form from a local Live Server origin to the N8N cloud webhook URL was blocked by the browser's CORS policy. Being resolved by enabling the Allowed Origins field on the Webhook node in N8N and activating the workflow to use the production URL.

---

## Loom / Screen Recording

See `part-c/loom-link.txt` for the full demo recording of the Part C integration flow.

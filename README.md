# AI Intern Assignment — VEDANT PAWAR

|               |                                    |
| ------------- | ---------------------------------- |
| **Name**      | Vedant Pawar                       |
| **Email**     | f20240214@pilani.bits-pilani.ac.in |
| **Submitted** | 6 June 2026                        |

---

## 📁 Structure

```
ai-intern-assignment-vedantpawar/
├── part-a/
│   ├── index.html
│   ├── css/styles.css
│   └── js/script.js
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

## Part A — Lead Capture Form

> Pure HTML + CSS + Vanilla JS. No frameworks.

| File             | Role                                                     |
| ---------------- | -------------------------------------------------------- |
| `index.html`     | Form structure — 6 fields                                |
| `css/styles.css` | Layout, responsiveness, error states                     |
| `js/script.js`   | Validation, char counter, thank-you message, console log |

**Run:** Open `part-a/index.html` with VS Code Live Server.

---

## Part B — N8N Workflows

### B1 — Lead Notification

> Webhook → Set → IF → Gmail or No-Op

| Node    | Purpose                                                      |
| ------- | ------------------------------------------------------------ |
| Webhook | Receives POST from form at `/leadform`                       |
| Set     | Extracts `name`, `email`, `courseLevel`, `message` from body |
| IF      | Checks if `courseLevel == "UG"`                              |
| No-Op   | Mocks Google Sheet log for UG leads (no Sheets access)       |
| Gmail   | Sends email notification for PG / PhD leads                  |

**Test:** Activate workflow → POST to production webhook URL with form fields as JSON body.

---

### B2 — Scheduled University Fetch

> Cron → HTTP Request → Code → Set

| Node             | Purpose                                                      |
| ---------------- | ------------------------------------------------------------ |
| Schedule Trigger | Fires daily at 9:00 AM                                       |
| HTTP Request     | GET `http://universities.hipolabs.com/search?country=Canada` |
| Code             | Filters response, returns 10 universities with clean fields  |
| Set              | Labels output as `name`, `country`, `website`, `domain`      |

**Why this API?**

- ✅ Free, no API key needed
- ✅ Directly relevant to HSA's business
- ✅ Returns structured JSON — good for demonstrating JS transformation

**Test:** Click "Test workflow" in N8N.

---

## Part C — Form → Webhook Integration _(Bonus)_

> Part A form modified to POST directly to B1 webhook via `fetch()`

**Changes made:**

- Submit button now shows **"Sending..."** loading state during request
- On success → thank-you message shown, form reset
- On failure → user-facing alert shown
- `finally()` block always restores button state

**Status:** Loading state and submission work correctly. CORS issue between local Live Server and N8N cloud URL is being resolved by enabling Allowed Origins on the Webhook node.

---

## ⚙️ Environment Variables

| Variable               | Value                                                    |
| ---------------------- | -------------------------------------------------------- |
| N8N Production Webhook | `https://<instance>.app.n8n.cloud/webhook/leadform`      |
| N8N Test Webhook       | `https://<instance>.app.n8n.cloud/webhook-test/leadform` |
| Gmail Credential       | N8N Gmail OAuth2 — no hardcoded credentials              |

---

## 🧱 Challenges

| Challenge                                                 | Resolution                                                                              |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Set node expressions rendering as plain text              | Deleted fields, re-added using `fx` expression editor instead of fixed value mode       |
| Universities API returning flat items, `.slice()` failing | Used `$input.all().map()` to iterate items individually, then sliced the result         |
| CORS error blocking `fetch()` in Part C                   | Enabling Allowed Origins (`*`) on Webhook node + activating workflow for production URL |

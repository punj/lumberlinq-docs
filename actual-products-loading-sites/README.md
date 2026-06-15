# Actual Products and Loading Sites Help Capture

Output folder for real VPS LumberLinq help documentation.

Run:

```bash
npm run all
```

The scripts block `**/challenges.cloudflare.com/**`, log in through the real app, verify authenticated Product and Loading Site API calls return HTTP 200, seed only `LL Help Demo -` records when missing, then capture screenshots and a Playwright video.

Artifacts:

- `docs/user-manual.md`
- `docs/faq.md`
- `docs/chatbot-kb.md`
- `screenshots/`
- `video/`
- `seed-result.json`
- `capture-summary.txt`

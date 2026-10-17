# Community Signup

A responsive dark-theme application form with animated duck mascot, fox helper popup, Tier 1 (Mod) / Tier 2 (Admin), username and age-range selection, and a confirmation screen.

## Important privacy and safety notes

- The destination email address is configured only as a server-side environment variable; do not hard-code it in `index.html`.
- The form does not ask for an email address, real name, or exact birth date.
- **Under-13 applicants:** this form collects a username and age band and emails that information to the organizers. Before publishing, decide whether you should accept under-13 submissions at all and review applicable child-privacy requirements (including COPPA in the US). The safest default is to block under-13 submissions unless a compliant process is in place.
- Tier selection is self-reported; it does not grant moderation/admin permissions by itself.
- Do not commit API keys or `.env` files. Restrict repository access and enable two-factor authentication.

## Deploy from GitHub using Vercel

1. Create a GitHub repository and upload these files.
2. Import that repository at https://vercel.com/ and deploy it. Vercel supports the `/api/submit.js` serverless function.
3. Create an account at https://resend.com/ and verify a sending domain/address according to Resend's instructions.
4. In Vercel → Project → Settings → Environment Variables, set:
   - `RESEND_API_KEY`: your Resend API key (secret)
   - `APPLICATIONS_TO_EMAIL`: the private inbox that should receive applications
   - `APPLICATIONS_FROM_EMAIL`: a verified sender, e.g. `Community Forms <forms@your-verified-domain.com>`
   - `SITE_ORIGIN`: the exact deployed site origin, e.g. `https://your-project.vercel.app`
5. Redeploy after setting environment variables.
6. Test with a sample application and confirm that the email arrives.

## Run locally

Install Node.js, then run:

```bash
npm install --save-dev vercel
npx vercel dev
```

For local email testing, add the environment variables in a local `.env` file (never commit it). Use test values until you are ready.

## Customization

- Edit `index.html` to change colors, copy, and visual details.
- Edit the helper buttons in `index.html` to change the canned setup answers. This is a scripted FAQ helper, not a connected generative AI.
- The endpoint validates the fields again on the server and sends only tier, username, and age range.

## Limitations

Email delivery depends on your Resend configuration and verified sender. The success screen appears only after the endpoint reports that the email provider accepted the message; acceptance does not guarantee inbox delivery.

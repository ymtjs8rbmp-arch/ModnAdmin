// Vercel serverless endpoint. Keep secrets in Vercel Project Settings > Environment Variables.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Basic same-origin check. Configure SITE_ORIGIN in production, e.g. https://your-site.vercel.app
  const origin = req.headers.origin;
  const siteOrigin = process.env.SITE_ORIGIN;
  if (siteOrigin && origin && origin !== siteOrigin) {
    return res.status(403).json({ error: "Request origin not allowed." });
  }

  const { tier, username, ageRange } = req.body || {};
  const allowedTiers = ["mod", "admin"];
  const allowedAges = ["under-13", "13-17", "18+"];
  if (!allowedTiers.includes(tier) ||
      !allowedAges.includes(ageRange) ||
      typeof username !== "string" ||
      !/^[\w .-]{2,40}$/u.test(username.trim())) {
    return res.status(400).json({ error: "Please check your form and try again." });
  }

  // Never put these values in frontend code or commit them to Git.
  const apiKey = process.env.RESEND_API_KEY;
  const destination = process.env.APPLICATIONS_TO_EMAIL;
  const from = process.env.APPLICATIONS_FROM_EMAIL;
  if (!apiKey || !destination || !from) {
    console.error("Email service is not configured.");
    return res.status(503).json({ error: "Applications are temporarily unavailable. Please DM a founder." });
  }

  const tierLabel = tier === "mod" ? "Tier 1 (Mod)" : "Tier 2 (Admin)";
  const ageLabel = ageRange === "under-13" ? "Under 13" : ageRange === "13-17" ? "13–17" : "18+";
  const safe = s => s.replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
  const html = `<h2>New Community Application</h2>
    <p><b>Tier:</b> ${safe(tierLabel)}</p>
    <p><b>Yapper username:</b> ${safe(username.trim())}</p>
    <p><b>Age range:</b> ${safe(ageLabel)}</p>
    <hr><p>This email contains only the application fields provided by the applicant.</p>`;

  try {
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [destination],
        subject: `New community application — ${tierLabel}`,
        html
      })
    });
    if (!emailResponse.ok) {
      console.error("Email provider rejected the message:", emailResponse.status);
      return res.status(502).json({ error: "We couldn't send your application. Please DM a founder." });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Email delivery error.");
    return res.status(502).json({ error: "We couldn't send your application. Please DM a founder." });
  }
}

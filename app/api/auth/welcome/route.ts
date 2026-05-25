import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

const html = (email: string) => `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenue sur AlphaLux</title>
</head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:48px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Barre dorée top -->
          <tr>
            <td height="2" style="background:linear-gradient(90deg,#d4af37,#f5d97a,#d4af37);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header logo -->
          <tr>
            <td style="background:#111111;padding:36px 48px 28px;border-left:1px solid #1e1e1e;border-right:1px solid #1e1e1e;">
              <span style="font-size:20px;font-weight:300;letter-spacing:0.28em;text-transform:uppercase;color:#e8e0cc;">
                ALPHA<span style="color:#c9a84c;">LUX</span>
              </span>
            </td>
          </tr>

          <!-- Séparateur -->
          <tr>
            <td height="1" style="background:#1e1e1e;border-left:1px solid #1e1e1e;border-right:1px solid #1e1e1e;font-size:0;">&nbsp;</td>
          </tr>

          <!-- Corps -->
          <tr>
            <td style="background:#111111;padding:48px 48px 40px;border-left:1px solid #1e1e1e;border-right:1px solid #1e1e1e;">

              <!-- Eyebrow -->
              <p style="margin:0 0 20px;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:#8a7340;">
                Collection privée
              </p>

              <!-- Titre -->
              <h1 style="margin:0 0 24px;font-size:32px;font-weight:300;letter-spacing:0.05em;color:#e8e0cc;line-height:1.2;">
                Bienvenue sur AlphaLux
              </h1>

              <!-- Trait décoratif -->
              <div style="width:40px;height:1px;background:linear-gradient(90deg,#d4af37,transparent);margin-bottom:28px;"></div>

              <!-- Texte principal -->
              <p style="margin:0 0 16px;font-size:13px;line-height:1.9;letter-spacing:0.04em;color:#aaa;">
                Votre compte est créé. Commencez dès maintenant à suivre la valeur de votre collection de montres de luxe.
              </p>
              <p style="margin:0 0 40px;font-size:13px;line-height:1.9;letter-spacing:0.04em;color:#777;">
                Valorisation marché automatique, graphiques de performance, patrimoine consolidé — tout ce dont vous avez besoin pour piloter votre collection avec précision.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#d4af37,#f5d97a);">
                    <a href="https://www.alphalux.fr/pricing"
                       style="display:inline-block;padding:16px 40px;font-size:10px;font-weight:600;letter-spacing:0.25em;text-transform:uppercase;color:#0a0a0a;text-decoration:none;">
                      Activer mon accès Premium
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Séparateur -->
          <tr>
            <td height="1" style="background:#1e1e1e;border-left:1px solid #1e1e1e;border-right:1px solid #1e1e1e;font-size:0;">&nbsp;</td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0d0d0d;padding:24px 48px;border-left:1px solid #1e1e1e;border-right:1px solid #1e1e1e;border-bottom:1px solid #1e1e1e;">
              <p style="margin:0 0 8px;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#333;">
                © 2026 AlphaLux &nbsp;·&nbsp;
                <a href="https://www.alphalux.fr/legal" style="color:#444;text-decoration:none;">Mentions légales</a>
                &nbsp;·&nbsp;
                <a href="mailto:contact@alphalux.fr" style="color:#444;text-decoration:none;">contact@alphalux.fr</a>
              </p>
              <p style="margin:0;font-size:9px;letter-spacing:0.1em;color:#2a2a2a;">
                Vous recevez cet email car vous venez de créer un compte sur alphalux.fr.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 })
    }

    const { error } = await resend.emails.send({
      from: "AlphaLux <noreply@alphalux.fr>",
      to: email,
      subject: "Bienvenue sur AlphaLux — Votre collection vous attend",
      html: html(email),
    })

    if (error) {
      console.error("[welcome] Resend error:", error)
      return NextResponse.json({ error: "Échec envoi email" }, { status: 500 })
    }

    return NextResponse.json({ sent: true })
  } catch (err) {
    console.error("[welcome] Unexpected error:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

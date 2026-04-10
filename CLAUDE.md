# AlphaLux — Contexte projet

## Vision
Tableau de bord patrimonial pour montres et sacs de luxe (style Finary).
Clarté · Contrôle · Performance · Sophistication.
URL : https://alphalux.fr

## Stack
- Next.js 16 + TypeScript
- Supabase (auth, BDD, storage bucket "watch-images")
- Vercel (déploiement, cron jobs)
- Stripe (paiement, abonnements, portail client)
- Resend (emails transactionnels depuis noreply@alphalux.fr)
- Recharts (graphiques)

## BDD Supabase
- `watches` : id, user_id, brand, model, reference, purchase_price, current_value, year, image_url, note
- `price_history` : id, watch_id, user_id, value, created_at
- `market_data` : pour la valorisation marché
- `users` : id, email, subscription_status, stripe_customer_id
- RLS activé sur toutes les tables

## Auth
- Connexion / Inscription / Mot de passe oublié
- Email de confirmation depuis noreply@alphalux.fr
- Templates email luxury dark (confirm signup, reset password, invite user)
- Supabase URL config : https://alphalux.fr

## Structure fichiers clés
- `app/page.tsx` — dashboard principal (avec écran onboarding si 0 montre)
- `app/login/page.tsx` — page login/inscription/reset
- `app/legal/page.tsx` — mentions légales + CGU
- `app/watch/[id]/page.tsx` — page détail montre
- `app/reset-password/page.tsx` — page reset mot de passe
- `app/not-found.tsx` — page 404 luxury dark
- `app/pricing/page.tsx` — page tarification (29,99€/mois ou 249€/an)
- `app/pricing/success/page.tsx` — page post-paiement succès
- `app/pricing/cancel/page.tsx` — page post-paiement annulation
- `app/components/WatchItem.tsx` — card montre
- `app/components/AddWatchForm.tsx` — formulaire ajout montre
- `app/components/PortfolioChart.tsx` — graphique portfolio
- `app/components/PriceChart.tsx` — graphique prix
- `app/api/market-price/route.ts` — API eBay valorisation
- `app/api/cron/update-prices/route.ts` — cron job mise à jour prix
- `app/api/stripe/checkout/route.ts` — création session Stripe Checkout
- `app/api/stripe/webhook/route.ts` — webhook Stripe (checkout.session.completed, subscription.deleted)
- `app/api/stripe/portal/route.ts` — portail client Stripe (gestion abonnement)
- `middleware.ts` — routes publiques (dont /api/stripe/webhook)
- `vercel.json` — cron job quotidien 8h

## Variables d'environnement (.env.local + Vercel)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- EBAY_CLIENT_ID
- EBAY_CLIENT_SECRET
- CRON_SECRET
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_PRICE_MONTHLY_ID
- STRIPE_PRICE_YEARLY_ID
- STRIPE_WEBHOOK_SECRET

## Stripe
- Webhook URL : https://www.alphalux.fr/api/stripe/webhook
- Événements écoutés : checkout.session.completed, customer.subscription.deleted
- checkout → sauvegarde subscription_status = "active" + stripe_customer_id dans users
- Portail client : bouton "Gérer mon abonnement" dans le header du dashboard
- Protection routes : redirect vers /pricing si subscription_status != "active"

## SEO & infra
- Metadata + OpenGraph dans app/layout.tsx
- Google Search Console vérifié (public/google9a95fbe24fbd5709.html)
- DMARC configuré sur OVH
- Redirection contact@alphalux.fr → julien26r@yahoo.fr

## Fait ✅
- Auth complète (connexion, inscription, mot de passe oublié)
- RLS Supabase sur toutes les tables
- Dashboard luxury dark : stats (valeur, investi, profit, best performer) + graphique
- Cards montres cliquables → page détail
- Formulaire ajout avec validation + upload image
- Valorisation marché via API eBay
- Bouton "Actualiser les prix" manuel
- Cron job quotidien 8h (update prix eBay)
- Page détail montre avec graphique + historique
- Interface 100% en français
- Déployé sur Vercel → alphalux.fr
- Domaine alphalux.fr configuré (OVH + DNS Vercel)
- Emails transactionnels via Resend (noreply@alphalux.fr)
- Templates email luxury dark (confirmation, reset, invitation)
- Mentions légales + CGU (app/legal/page.tsx)
- Auto-entreprise créée (micro-entreprise, ajout activité sur LMNP existant)
- Stripe intégré : Checkout, webhook, portail client
- Page pricing (29,99€/mois ou 249€/an)
- Protection routes par subscription_status
- Écran onboarding au premier login (0 montre)
- Page 404 luxury dark
- Metadata SEO + OpenGraph
- Google Search Console vérifié
- Logo AlphaLux cliquable → / sur toutes les pages
- Tagline : "La précision au service du prestige."
- Polices : Cormorant Garamond (titres) + Montserrat (texte) + Playfair Display (italic accents)

## À faire 🟠 Important
- Gérer customer.subscription.deleted → passer subscription_status à "inactive"
- Test et correction mobile

## À faire 🟡 Recommandé
- Ajouter Chrono24 comme 2ème source de valorisation (attendre API stable)
- V2 : sacs à main de luxe

## Charte UI
- Fond : #0f0f0f / #161616
- Doré : gradient #d4af37 → #f5d97a
- Texte principal : #e8e0cc
- Texte secondaire : #aaa / #bbb
- Bordures : #2e2e2e
- Fonts : Cormorant Garamond (titres) + Montserrat (texte) + Playfair Display (italic)
- Positif : #4ab364
- Négatif : #dc5050

# AlphaLux — Contexte projet

## Vision
Tableau de bord patrimonial pour montres et sacs de luxe (style Finary).
Clarté · Contrôle · Performance · Sophistication.
URL : https://alphalux.fr

## Stack
- Next.js 16 + TypeScript
- Supabase (auth, BDD, storage bucket "watch-images")
- Vercel (déploiement, cron jobs)
- Resend (emails transactionnels depuis noreply@alphalux.fr)
- Recharts (graphiques)

## BDD Supabase
- `watches` : id, user_id, brand, model, reference, purchase_price, current_value, year, image_url, note
- `price_history` : id, watch_id, user_id, value, created_at
- `market_data` : pour la valorisation marché
- `users` : id, email, subscription_status
- RLS activé sur toutes les tables

## Auth
- Connexion / Inscription / Mot de passe oublié
- Email de confirmation depuis noreply@alphalux.fr
- Templates email luxury dark (confirm signup, reset password, invite user)
- Supabase URL config : https://alphalux.fr

## Structure fichiers clés
- `app/page.tsx` — dashboard principal
- `app/login/page.tsx` — page login/inscription/reset
- `app/legal/page.tsx` — mentions légales + CGU
- `app/watch/[id]/page.tsx` — page détail montre
- `app/reset-password/page.tsx` — page reset mot de passe
- `app/components/WatchItem.tsx` — card montre
- `app/components/AddWatchForm.tsx` — formulaire ajout montre
- `app/components/PortfolioChart.tsx` — graphique portfolio
- `app/components/PriceChart.tsx` — graphique prix
- `app/api/market-price/route.ts` — API eBay valorisation
- `app/api/cron/update-prices/route.ts` — cron job mise à jour prix
- `vercel.json` — cron job quotidien 8h

## Variables d'environnement (.env.local + Vercel)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- EBAY_CLIENT_ID
- EBAY_CLIENT_SECRET
- CRON_SECRET
- SUPABASE_SERVICE_ROLE_KEY

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

## En cours 🔄
- Upgrade UI luxury (gold gradient, profondeur cards, glow image placeholder)
- Bouton afficher/masquer mot de passe sur login

## À faire 🔴 Bloquant
- Corriger l'erreur de déploiement Vercel (Failed production deployment)
- Nettoyer les données de test en BDD

## À faire 🟠 Important
- Plan de tarification (gratuit ? freemium ? abonnement ?)
- Intégration Stripe (si payant)
- Limite plan gratuit (ex: max 3 montres)
- Page pricing

## À faire 🟡 Recommandé
- Test et correction mobile
- Page 404 stylée
- Supprimer les console.log du code
- Ajouter Chrono24 comme 2ème source de valorisation
- V2 : sacs à main de luxe

## Charte UI
- Fond : #0f0f0f / #161616
- Doré : #c9a84c (à migrer vers gradient #d4af37 → #f5d97a)
- Texte principal : #e8e0cc
- Texte secondaire : #aaa / #bbb
- Bordures : #2e2e2e
- Fonts : Cormorant Garamond (titres) + Montserrat (texte)
- Positif : #4ab364
- Négatif : #dc5050

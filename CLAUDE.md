# AlphaLux — Contexte projet

## Vision
Tableau de bord patrimonial pour montres et sacs de luxe (style Finary).
Clarté · Contrôle · Performance · Sophistication.

## Stack
- Next.js 16 + TypeScript
- Supabase (auth, BDD, storage)
- Recharts pour les graphiques

## BDD Supabase
- `watches` : id, user_id, brand, model, reference, purchase_price, current_value, year, image_url, note
- `price_history` : id, watch_id, user_id, value, created_at
- `market_data` : pour la valorisation marché
- `users` : id, email, subscription_status

## Fait
- RLS activé sur toutes les tables
- Auth Supabase configurée
- UI luxury dark (Cormorant Garamond + Montserrat, doré #c9a84c)
- Dashboard : stats (valeur, investi, profit, best performer) + graphique
- Cards montres cliquables → page détail
- Formulaire ajout avec validation + upload image (bucket watch-images)

## En cours / À faire
- Page détail montre (app/watch/[id]/page.tsx)
- Valorisation marché via API eBay (clés en attente approbation)
- Page login refonte luxury
- Déploiement Vercel + cron job quotidien pour update des prix

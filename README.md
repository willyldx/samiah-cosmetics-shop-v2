# Samiah Cosmetics v2

Site e-commerce moderne pour Samiah Cosmetics - Soins capillaires au Tchad.

## 🛠 Stack Technique

- **Framework**: Nuxt 3 (Vue 3 + Vite)
- **Styling**: Tailwind CSS
- **Base de données**: Supabase (PostgreSQL)
- **Hébergement**: Vercel
- **CDN**: Cloudflare (optionnel)

## 🚀 Déploiement sur Vercel

### Option 1 : Via GitHub (Recommandé)

1. **Push le code sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Samiah Cosmetics v2"
   git remote add origin https://github.com/VOTRE-USERNAME/samiah-cosmetics.git
   git push -u origin main
   ```

2. **Connecter à Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - Cliquer "Add New Project"
   - Importer depuis GitHub
   - Sélectionner le repo `samiah-cosmetics`

3. **Configurer les variables d'environnement**
   - Dans Vercel > Settings > Environment Variables
   - Ajouter :
     ```
     SUPABASE_URL=https://dzzblqlteirtzyegplgu.supabase.co
     SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
     ```

4. **Déployer**
   - Cliquer "Deploy"
   - Attendre ~2 minutes

### Option 2 : Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Suivre les instructions
```

## 📦 Développement Local

```bash
# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env

# Lancer le serveur de dev
npm run dev

# Ouvrir http://localhost:3000
```

## 🗄 Structure Supabase

### Tables requises

```sql
-- Produits
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  price INTEGER NOT NULL,
  currency TEXT DEFAULT 'XAF',
  category TEXT,
  short_description TEXT,
  image TEXT,
  images TEXT[],
  cities TEXT[],
  active BOOLEAN DEFAULT true,
  expires_after_days INTEGER,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commandes
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_city TEXT NOT NULL,
  client_address TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  shipping_fee INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Témoignages
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  city TEXT,
  rating INTEGER,
  message TEXT NOT NULL,
  photos TEXT[],
  photo_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🎨 Personnalisation

### Couleurs (tailwind.config.ts)
- `charcoal`: Noir principal (#0A0A0A)
- `ivory`: Blanc/gris clair (#FAFAFA)
- `gold`: Or luxe (#C6A961)

### Images à remplacer
- `/public/images/hero-hair.jpg` - Image principale du héro
- `/public/images/about-mission.jpg` - Image page À propos
- `/public/favicon.svg` - Favicon du site

## 📱 Contact

- **WhatsApp**: +235 62 75 21 05
- **Facebook**: Samiah Cosmetics

---

Développé avec ❤️ pour Samiah Cosmetics

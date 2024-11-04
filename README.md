# 🔐 Secret Manager

Une application Next.js sécurisée permettant aux utilisateurs de stocker et gérer des secrets personnels avec chiffrement.

## 🌟 Fonctionnalités

- 🔒 Authentification sécurisée avec Clerk
- 🔑 Chiffrement AES des secrets
- 💾 Stockage persistant avec Prisma
- 🎨 Interface utilisateur moderne avec Tailwind CSS
- 🚀 Architecture serverless-ready

## 🛠️ Technologies

- [Next.js 15](https://nextjs.org/) - Framework React
- [Clerk](https://clerk.com/) - Authentification
- [Prisma](https://www.prisma.io/) - ORM
- [CryptoJS](https://github.com/brix/crypto-js) - Chiffrement
- [Tailwind CSS](https://tailwindcss.com/) - Styles
- SQLite (développement)

## 🚀 Installation

1. Clonez le repository
```bash
git clone <repository-url>
cd secret-manager
```

2. Installez les dépendances
```bash
npm install
```

3. Configurez les variables d'environnement
```bash
cp .env.example .env
```

4. Remplissez le fichier `.env` avec vos valeurs :
- Créez un compte sur [Clerk](https://clerk.com/) pour obtenir les clés d'API
- Générez une clé de chiffrement :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. Initialisez la base de données
```bash
npx prisma migrate dev
```

6. Lancez le serveur de développement
```bash
npm run dev
```

## 🔧 Configuration

### Variables d'environnement requises

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
DATABASE_URL=
ENCRYPTION_KEY=
```

## 🏗️ Structure du projet

```
src/
├── actions/        # Actions serveur
├── app/           # Pages et layout
├── components/    # Composants React
├── lib/          # Utilitaires et configuration
└── middleware.ts  # Middleware de protection des routes
```

## 🔒 Sécurité

- Authentification gérée par Clerk
- Chiffrement AES des secrets avec CryptoJS
- Protection des routes via middleware
- Exécution côté serveur des opérations sensibles

## 📝 Utilisation

1. Créez un compte ou connectez-vous
2. Accédez à la page `/secret`
3. Entrez votre secret dans le champ de texte
4. Cliquez sur "Sauvegarder le secret"

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

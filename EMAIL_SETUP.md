# Configuration de l'envoi d'email - OnMangeQuoi

## 🎯 Fonctionnalité

Le système permet d'envoyer automatiquement un email avec toutes les informations du formulaire d'inscription dans un template HTML élégant qui suit le code couleur de l'application.

## 📧 Configuration requise

### 1. Créer le fichier d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
EMAIL_USER=votre.email@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_application
RECIPIENT_EMAIL=admin@onmangequoi.com
```

### 2. Configuration Gmail

Pour utiliser Gmail comme service d'envoi :

1. **Activez la double authentification** sur votre compte Google
2. **Générez un mot de passe d'application** :
   - Allez dans [Paramètres Google > Sécurité](https://myaccount.google.com/security)
   - Cliquez sur "Mots de passe d'application"
   - Sélectionnez "Mail" comme application
   - Copiez le mot de passe généré (16 caractères)
3. **Utilisez ce mot de passe** dans `EMAIL_PASSWORD` (pas votre mot de passe normal)

### 3. Variables d'environnement

- `EMAIL_USER` : Votre adresse Gmail (l'expéditeur)
- `EMAIL_PASSWORD` : Le mot de passe d'application Gmail
- `RECIPIENT_EMAIL` : L'adresse email où recevoir les formulaires

## 🎨 Template Email

Le template HTML est situé dans `templates/email-template.hbs` et inclut :

- ✅ Design responsive avec les couleurs orange/rouge d'OMQ
- ✅ Logo et branding
- ✅ Toutes les sections du formulaire organisées
- ✅ Horaires d'ouverture en tableau
- ✅ Options de service avec indicateurs visuels
- ✅ Gestion des fichiers uploadés
- ✅ Section promotion conditionnelle
- ✅ Mentions légales RGPD

## 🚀 Utilisation

1. **Remplissez le formulaire** sur `/omq`
2. **Cliquez sur "Soumettre le formulaire"**
3. **Les données s'affichent dans la console** (pour debug)
4. **Un email est automatiquement envoyé** avec le template HTML
5. **Une confirmation s'affiche** à l'utilisateur

## 🔧 API Endpoint

L'API est accessible via `POST /api/send-email` et :

- ✅ Valide les données requises
- ✅ Compile le template Handlebars
- ✅ Envoie l'email avec HTML et version texte
- ✅ Gère les erreurs et retourne des messages clairs
- ✅ Supporte CORS pour les requêtes frontend

## 📁 Structure des fichiers

```
├── templates/
│   └── email-template.hbs          # Template HTML du mail
├── app/
│   ├── api/
│   │   └── send-email/
│   │       └── route.ts            # API route pour l'envoi
│   └── omq/
│       └── page.tsx                # Formulaire avec fonction handleSubmit
├── email-config.example.txt        # Exemple de configuration
└── .env.local                      # Variables d'environnement (à créer)
```

## 🐛 Dépannage

### Erreur "Invalid login"
- Vérifiez que vous utilisez un mot de passe d'application Gmail
- Assurez-vous que la double authentification est activée

### Erreur "Template not found"
- Vérifiez que le fichier `templates/email-template.hbs` existe
- Assurez-vous que le chemin est correct dans `route.ts`

### Email non reçu
- Vérifiez le dossier spam
- Vérifiez que `RECIPIENT_EMAIL` est correct
- Consultez les logs de la console pour plus de détails

## 🔒 Sécurité

- ✅ Les mots de passe d'application sont utilisés (plus sécurisé)
- ✅ Les variables d'environnement protègent les credentials
- ✅ Validation des données côté serveur
- ✅ Gestion d'erreurs complète

## 📱 Responsive

Le template email est entièrement responsive et s'adapte aux mobiles avec :
- Grilles CSS flexibles
- Breakpoints pour petits écrans
- Images optimisées
- Typography adaptative

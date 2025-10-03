# 🚨 SOLUTION À L'ERREUR 500

## Le problème
L'erreur 500 est causée par des variables d'environnement manquantes pour l'envoi d'email.

## ✅ Solution rapide

### 1. Créez le fichier `.env.local`
À la racine du projet, créez un fichier nommé `.env.local` avec ce contenu :

```env
EMAIL_USER=votre.email@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_application_gmail
RECIPIENT_EMAIL=admin@onmangequoi.com
```

### 2. Configuration Gmail
1. **Activez la double authentification** sur votre compte Google
2. **Générez un mot de passe d'application** :
   - Allez sur [myaccount.google.com/security](https://myaccount.google.com/security)
   - Cliquez sur "Mots de passe d'application"
   - Sélectionnez "Mail" 
   - Copiez le mot de passe généré (16 caractères)
3. **Remplacez** `votre_mot_de_passe_application_gmail` par ce mot de passe

### 3. Redémarrez le serveur
```bash
npm run dev
```

### 4. Testez le formulaire
Remplissez le formulaire et cliquez sur "Soumettre le formulaire"

## 🔍 Vérification
Après configuration, relancez le diagnostic :
```bash
node debug-email.js
```

Vous devriez voir :
```
✅ EMAIL_USER : ✅ Set
✅ EMAIL_PASSWORD : ✅ Set  
✅ RECIPIENT_EMAIL : ✅ Set
```

## 📧 Test rapide
Une fois configuré, le système enverra automatiquement un email HTML élégant avec toutes les informations du formulaire !

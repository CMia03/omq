// Script de debug pour diagnostiquer les problèmes d'email
const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNOSTIC EMAIL SYSTEM');
console.log('========================\n');

// 1. Vérifier les dépendances
console.log('📦 Vérification des dépendances:');
try {
  const nodemailer = require('nodemailer');
  console.log('✅ nodemailer:', nodemailer.version || 'installed');
} catch (error) {
  console.log('❌ nodemailer not found:', error.message);
}

try {
  const handlebars = require('handlebars');
  console.log('✅ handlebars:', handlebars.version || 'installed');
} catch (error) {
  console.log('❌ handlebars not found:', error.message);
}

// 2. Vérifier le template
console.log('\n📄 Vérification du template:');
const templatePath = path.join(__dirname, 'templates', 'email-template.hbs');
console.log('Template path:', templatePath);

if (fs.existsSync(templatePath)) {
  console.log('✅ Template file exists');
  const stats = fs.statSync(templatePath);
  console.log('   Size:', stats.size, 'bytes');
} else {
  console.log('❌ Template file NOT found');
}

// 3. Vérifier les variables d'environnement
console.log('\n🔧 Variables d\'environnement:');
const envFile = path.join(__dirname, '.env.local');
if (fs.existsSync(envFile)) {
  console.log('✅ .env.local file exists');
  const envContent = fs.readFileSync(envFile, 'utf8');
  const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  console.log('   Variables found:', lines.length);
  lines.forEach(line => {
    const [key] = line.split('=');
    console.log('   -', key, ':', process.env[key] ? '✅ Set' : '❌ Not set');
  });
} else {
  console.log('❌ .env.local file NOT found');
  console.log('   Create .env.local with:');
  console.log('   EMAIL_USER=your.email@gmail.com');
  console.log('   EMAIL_PASSWORD=your_app_password');
  console.log('   RECIPIENT_EMAIL=admin@onmangequoi.com');
}

// 4. Vérifier la structure des dossiers
console.log('\n📁 Structure des dossiers:');
const apiPath = path.join(__dirname, 'app', 'api', 'send-email', 'route.ts');
if (fs.existsSync(apiPath)) {
  console.log('✅ API route exists');
} else {
  console.log('❌ API route NOT found');
}

// 5. Test de compilation du template
console.log('\n🧪 Test de compilation du template:');
try {
  const handlebars = require('handlebars');
  if (fs.existsSync(templatePath)) {
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    
    const testData = {
      restaurantName: 'Test Restaurant',
      email: 'test@example.com',
      address: { street: 'Test Street', postalCode: '75001', city: 'Paris' },
      socialMedia: {},
      category: 'Test',
      openingHours: {},
      serviceOptions: {},
      logo: null,
      banner: null,
      photos: [],
      partnershipReady: false,
      partnershipType: '',
      acceptTerms: true,
      date: new Date().toLocaleString('fr-FR')
    };
    
    const html = template(testData);
    console.log('✅ Template compilation successful');
    console.log('   HTML length:', html.length, 'characters');
  } else {
    console.log('❌ Cannot test template - file not found');
  }
} catch (error) {
  console.log('❌ Template compilation failed:', error.message);
}

console.log('\n🎯 PROCHAINES ÉTAPES:');
console.log('1. Créez le fichier .env.local avec vos vraies valeurs Gmail');
console.log('2. Redémarrez le serveur Next.js');
console.log('3. Testez le formulaire');
console.log('4. Consultez les logs du serveur pour plus de détails');

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

// Configuration du transporteur email (Gmail)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Votre email Gmail
      pass: process.env.EMAIL_PASSWORD, // Votre mot de passe d'application Gmail
    },
  });
};

// Fonction pour charger et compiler le template
const compileTemplate = async (data: any) => {
  try {
    const templatePath = path.join(process.cwd(), 'templates', 'email-template.hbs');
    console.log('Template path:', templatePath);
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found at: ${templatePath}`);
    }
    
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    console.log('Template loaded successfully, length:', templateSource.length);
    
    const template = Handlebars.compile(templateSource);
    
    // Ajouter la date actuelle
    const templateData = {
      ...data,
      date: new Date().toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    
    const htmlContent = template(templateData);
    console.log('Template compiled successfully, HTML length:', htmlContent.length);
    
    return htmlContent;
  } catch (error) {
    console.error('Erreur lors de la compilation du template:', error);
    throw new Error(`Erreur lors de la génération du template email: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

export async function POST(request: NextRequest) {
  try {
    console.log('📧 API send-email called');
    
    const formData = await request.json();
    console.log('📋 Form data received:', Object.keys(formData));
    
    // Validation des données requises
    if (!formData.restaurantName || !formData.email || !formData.address?.street) {
      console.error('❌ Données requises manquantes:', {
        restaurantName: !!formData.restaurantName,
        email: !!formData.email,
        address: !!formData.address?.street
      });
      return NextResponse.json(
        { error: 'Données requises manquantes' },
        { status: 400 }
      );
    }

    // Vérifier les variables d'environnement
    console.log('🔧 Environment check:', {
      EMAIL_USER: !!process.env.EMAIL_USER,
      EMAIL_PASSWORD: !!process.env.EMAIL_PASSWORD,
      RECIPIENT_EMAIL: !!process.env.RECIPIENT_EMAIL
    });

    // Compiler le template avec les données
    console.log('📄 Compiling template...');
    const htmlContent = await compileTemplate(formData);

    // Créer le transporteur
    console.log('🚀 Creating transporter...');
    const transporter = createTransporter();

    // Configuration de l'email
    const mailOptions = {
      from: {
        name: 'OnMangeQuoi - Formulaire',
        address: process.env.EMAIL_USER || 'noreply@onmangequoi.com',
      },
      to: process.env.RECIPIENT_EMAIL || formData.email, // Email de destination
      subject: `Nouvelle inscription - ${formData.restaurantName}`,
      html: htmlContent,
      // Version texte alternative
      text: `
Nouvelle inscription OnMangeQuoi

Restaurant: ${formData.restaurantName}
Email: ${formData.email}
Téléphone: ${formData.phone}
Adresse: ${formData.address.street}, ${formData.address.postalCode} ${formData.address.city}
Site web: ${formData.website}
Catégorie: ${formData.category}

Date d'inscription: ${new Date().toLocaleString('fr-FR')}
      `.trim(),
    };

    console.log('📨 Sending email to:', mailOptions.to);

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email envoyé avec succès:', info.messageId);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: 'Email envoyé avec succès',
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'envoi de l\'email',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Gérer les requêtes OPTIONS pour CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

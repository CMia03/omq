'use client';

import { useState } from 'react';
import Image from 'next/image';

// Types pour les horaires d'ouverture
interface OpeningHours {
  open: string;
  close: string;
  closed: boolean;
}

// Types pour l'adresse
interface Address {
  street: string;
  postalCode: string;
  city: string;
}

// Types pour les réseaux sociaux
interface SocialMedia {
  instagram: string;
  tiktok: string;
  twitter: string;
  facebook: string;
  snapchat: string;
}

// Types pour les options de service
interface ServiceOptions {
  onSite: boolean;
  delivery: boolean;
  uberEats: boolean;
  deliveroo: boolean;
}

// Types pour les horaires d'ouverture par jour
interface OpeningHoursByDay {
  monday: OpeningHours;
  tuesday: OpeningHours;
  wednesday: OpeningHours;
  thursday: OpeningHours;
  friday: OpeningHours;
  saturday: OpeningHours;
  sunday: OpeningHours;
}

// Type principal pour les données du formulaire
interface FormData {
  restaurantName: string;
  address: Address;
  phone: string;
  email: string;
  website: string;
  socialMedia: SocialMedia;
  category: string;
  openingHours: OpeningHoursByDay;
  serviceOptions: ServiceOptions;
  logo: File | null;
  banner: File | null;
  photos: File[];
  partnershipReady: boolean;
  partnershipType: string;
  acceptTerms: boolean;
}

// Type pour les données traitées avant envoi
interface ProcessedFormData extends Omit<FormData, 'logo' | 'banner' | 'photos'> {
  logoBase64?: string;
  logoName?: string;
  bannerBase64?: string;
  bannerName?: string;
  photosBase64?: Array<{ name: string; base64: string }>;
}

const initialFormData: FormData = {
  // Informations générales
  restaurantName: '',
  address: {
    street: '',
    postalCode: '',
    city: ''
  },
  phone: '',
  email: '',
  website: '',
  socialMedia: {
    instagram: '',
    tiktok: '',
    twitter: '',
    facebook: '',
    snapchat: ''
  },
  // Informations pratiques
  category: '',
  openingHours: {
    monday: { open: '', close: '', closed: false },
    tuesday: { open: '', close: '', closed: false },
    wednesday: { open: '', close: '', closed: false },
    thursday: { open: '', close: '', closed: false },
    friday: { open: '', close: '', closed: false },
    saturday: { open: '', close: '', closed: false },
    sunday: { open: '', close: '', closed: false }
  },
  serviceOptions: {
    onSite: false,
    delivery: false,
    uberEats: false,
    deliveroo: false
  },
  // Identité visuelle
  logo: null as File | null,
  banner: null as File | null,
  photos: [] as File[],
  // Promotion
  partnershipReady: false,
  partnershipType: '',
  // Mentions légales
  acceptTerms: false
};

export default function OMQPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleInputChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (
    parent: keyof Pick<FormData, 'address' | 'socialMedia' | 'openingHours' | 'serviceOptions'>,
    field: string,
    value: string | boolean | OpeningHours | ServiceOptions
  ) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as unknown as Record<string, unknown>),
        [field]: value
      }
    }));
  };

  const handleFileUpload = (
    field: 'logo' | 'banner' | 'photos',
    files: FileList | null
  ) => {
    if (files) {
      if (field === 'photos') {
        setFormData(prev => ({
          ...prev,
          photos: Array.from(files)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [field]: files[0]
        }));
      }
    }
  };

  // Fonction pour convertir un fichier en base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Retirer le préfixe "data:image/...;base64,"
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Convertir les fichiers en base64
    const processedData: ProcessedFormData = { ...formData };
    
    try {
      if (formData.logo) {
        processedData.logoBase64 = await fileToBase64(formData.logo);
        processedData.logoName = formData.logo.name;
      }
      
      if (formData.banner) {
        processedData.bannerBase64 = await fileToBase64(formData.banner);
        processedData.bannerName = formData.banner.name;
      }
      
      if (formData.photos.length > 0) {
        processedData.photosBase64 = await Promise.all(
          formData.photos.map(async (photo) => ({
            name: photo.name,
            base64: await fileToBase64(photo)
          }))
        );
      }
      
      console.log('📧 Envoi de l\'email en cours...');
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Email envoyé avec succès !', result);
        alert('Formulaire soumis avec succès ! Un email a été envoyé avec toutes les informations. Consultez la console pour voir les détails.');
        setFormData(initialFormData);
        setFormKey((k) => k + 1);
      } else {
        console.error('❌ Erreur lors de l\'envoi de l\'email:', result);
        alert(`Erreur lors de l'envoi de l'email: ${result.error || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
      alert('Erreur lors de l\'envoi de l\'email. Consultez la console pour plus de détails.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const days = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header avec logo */}
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/OMQ-logoColor.png"
              alt="OMQ Logo"
              width={120}
              height={60}
              className="object-contain w-24 h-12 sm:w-32 sm:h-16"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 px-4">
          FORMULAIRE D'INSCRIPTION
          </h1>
          <p className="text-center text-gray-600 mt-2 text-sm sm:text-base px-4">
            Rejoignez l'annuaire OnMangeQuoi et augmentez votre visibilité
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <form key={formKey} onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Informations générales */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-orange-600 mb-4 sm:mb-6 border-b-2 border-orange-200 pb-2 flex justify-between items-center">
              <span>Informations générales</span>
              <span className="text-sm font-normal text-orange-600">* obligatoire</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de votre restaurant *
                </label>
                <input
                  type="text"
                  required
                  value={formData.restaurantName}
                  onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone du restaurant
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de contact *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site web
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Adresse */}
            <div className="mt-4 sm:mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse postale *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Rue"
                  value={formData.address.street}
                  onChange={(e) => handleNestedInputChange('address', 'street', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  type="text"
                  required
                  placeholder="Code postal"
                  value={formData.address.postalCode}
                  onChange={(e) => handleNestedInputChange('address', 'postalCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  type="text"
                  required
                  placeholder="Ville"
                  value={formData.address.city}
                  onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-4">Réseaux sociaux</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram
                  </label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/votrecompte"
                    value={formData.socialMedia.instagram}
                    onChange={(e) => handleNestedInputChange('socialMedia', 'instagram', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TikTok
                  </label>
                  <input
                    type="url"
                    placeholder="https://tiktok.com/@votrecompte"
                    value={formData.socialMedia.tiktok}
                    onChange={(e) => handleNestedInputChange('socialMedia', 'tiktok', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    X (Twitter)
                  </label>
                  <input
                    type="url"
                    placeholder="https://x.com/votrecompte"
                    value={formData.socialMedia.twitter}
                    onChange={(e) => handleNestedInputChange('socialMedia', 'twitter', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook
                  </label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/votrepage"
                    value={formData.socialMedia.facebook}
                    onChange={(e) => handleNestedInputChange('socialMedia', 'facebook', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Snapchat
                  </label>
                  <input
                    type="text"
                    placeholder="@votrecompte"
                    value={formData.socialMedia.snapchat}
                    onChange={(e) => handleNestedInputChange('socialMedia', 'snapchat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Informations pratiques */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-orange-600 mb-4 sm:mb-6 border-b-2 border-orange-200 pb-2">
              Informations pratiques
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <input
                  type="text"
                  placeholder="Ex: Restaurant italien, Fast-food, Brasserie..."
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Horaires d'ouverture */}
            <div className="mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-4">Horaires d'ouverture</h3>
              <div className="space-y-3 sm:space-y-4">
                {days.map((day) => (
                  <div key={day.key} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="w-20 text-sm font-medium text-gray-700 flex-shrink-0">
                      {day.label}
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.openingHours[day.key as keyof typeof formData.openingHours].closed}
                        onChange={(e) => {
                          const newHours = { ...formData.openingHours };
                          const dayKey = day.key as keyof OpeningHoursByDay;
                          newHours[dayKey] = {
                            ...newHours[dayKey],
                            closed: e.target.checked,
                            open: e.target.checked ? '' : newHours[dayKey].open,
                            close: e.target.checked ? '' : newHours[dayKey].close
                          };
                          setFormData(prev => ({ ...prev, openingHours: newHours }));
                        }}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-600">Fermé</span>
                    </div>
                    {!formData.openingHours[day.key as keyof typeof formData.openingHours].closed && (
                      <div className="flex items-center space-x-2 flex-wrap">
                        <input
                          type="time"
                          value={formData.openingHours[day.key as keyof typeof formData.openingHours].open}
                          onChange={(e) => {
                            const newHours = { ...formData.openingHours };
                            const dayKey = day.key as keyof OpeningHoursByDay;
                            newHours[dayKey] = {
                              ...newHours[dayKey],
                              open: e.target.value
                            };
                            setFormData(prev => ({ ...prev, openingHours: newHours }));
                          }}
                          className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        />
                        <span className="text-gray-600 text-sm">à</span>
                        <input
                          type="time"
                          value={formData.openingHours[day.key as keyof typeof formData.openingHours].close}
                          onChange={(e) => {
                            const newHours = { ...formData.openingHours };
                            const dayKey = day.key as keyof OpeningHoursByDay;
                            newHours[dayKey] = {
                              ...newHours[dayKey],
                              close: e.target.value
                            };
                            setFormData(prev => ({ ...prev, openingHours: newHours }));
                          }}
                          className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Options de service */}
            <div className="mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-4">Options de service</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key: 'onSite', label: 'Sur place' },
                  { key: 'delivery', label: 'Livraison' },
                  { key: 'uberEats', label: 'Uber Eats' },
                  { key: 'deliveroo', label: 'Deliveroo' }
                ].map((option) => (
                  <label key={option.key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.serviceOptions[option.key as keyof typeof formData.serviceOptions]}
                      onChange={(e) => {
                        const newOptions = { ...formData.serviceOptions };
                        const optionKey = option.key as keyof ServiceOptions;
                        newOptions[optionKey] = e.target.checked;
                        setFormData(prev => ({ ...prev, serviceOptions: newOptions }));
                      }}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Identité visuelle */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-orange-600 mb-4 sm:mb-6 border-b-2 border-orange-200 pb-2">
              Identité visuelle
            </h2>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('logo', e.target.files)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bannière
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('banner', e.target.files)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos du restaurant
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload('photos', e.target.files)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Vous pouvez sélectionner plusieurs photos
                </p>
              </div>
            </div>
          </div>

          {/* Promotion */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-orange-600 mb-4 sm:mb-6 border-b-2 border-orange-200 pb-2">
              Promotion
            </h2>

            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.partnershipReady}
                  onChange={(e) => handleInputChange('partnershipReady', e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Es-tu prêt à faire une promotion en partenariat avec OnMangeQuoi ?
                </span>
              </label>

              {formData.partnershipReady && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Si oui, laquelle ?
                  </label>
                  <textarea
                    value={formData.partnershipType}
                    onChange={(e) => handleInputChange('partnershipType', e.target.value)}
                    placeholder="Décrivez votre proposition de promotion..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Mentions légales */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-orange-600 mb-4 sm:mb-6 border-b-2 border-orange-200 pb-2">
              Mentions légales
            </h2>

            <div className="space-y-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  required
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-2">
                    J'accepte que mes informations soient utilisées pour être référencé dans l'annuaire OMQ.
                  </p>
                  <p className="text-gray-600">
                    <strong>Mentions légales RGPD :</strong> Vos données sont conservées de façon sécurisée. 
                    Vous disposez d'un droit de rectification et de suppression de vos données personnelles.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Bouton de soumission */}
          <div className="flex justify-center px-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg shadow-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Soumettre le formulaire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function OMQPage() {
  const [formData, setFormData] = useState({
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
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as any),
        [field]: value
      }
    }));
  };

  const handleFileUpload = (field: string, files: FileList | null) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Ici vous pouvez ajouter la logique pour envoyer les données
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
          FORMULAIRE “TROJAN HORSE”
          </h1>
          <p className="text-center text-gray-600 mt-2 text-sm sm:text-base px-4">
            Rejoignez l'annuaire OnMangeQuoi et augmentez votre visibilité
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
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
                          newHours[day.key as keyof typeof newHours] = {
                            ...newHours[day.key as keyof typeof newHours],
                            closed: e.target.checked,
                            open: e.target.checked ? '' : newHours[day.key as keyof typeof newHours].open,
                            close: e.target.checked ? '' : newHours[day.key as keyof typeof newHours].close
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
                            newHours[day.key as keyof typeof newHours] = {
                              ...newHours[day.key as keyof typeof newHours],
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
                            newHours[day.key as keyof typeof newHours] = {
                              ...newHours[day.key as keyof typeof newHours],
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
                        newOptions[option.key as keyof typeof newOptions] = e.target.checked;
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
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg shadow-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-300 text-sm sm:text-base"
            >
              Soumettre le formulaire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

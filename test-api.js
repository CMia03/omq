// Script de test pour l'API send-email
const testData = {
  restaurantName: "Restaurant Test",
  email: "test@example.com",
  phone: "0123456789",
  website: "https://test.com",
  address: {
    street: "123 Rue Test",
    postalCode: "75001",
    city: "Paris"
  },
  socialMedia: {
    instagram: "",
    tiktok: "",
    twitter: "",
    facebook: "",
    snapchat: ""
  },
  category: "Restaurant français",
  openingHours: {
    monday: { open: "09:00", close: "18:00", closed: false },
    tuesday: { open: "09:00", close: "18:00", closed: false },
    wednesday: { open: "09:00", close: "18:00", closed: false },
    thursday: { open: "09:00", close: "18:00", closed: false },
    friday: { open: "09:00", close: "18:00", closed: false },
    saturday: { open: "09:00", close: "18:00", closed: false },
    sunday: { open: "", close: "", closed: true }
  },
  serviceOptions: {
    onSite: true,
    delivery: false,
    uberEats: false,
    deliveroo: false
  },
  logo: null,
  banner: null,
  photos: [],
  partnershipReady: false,
  partnershipType: "",
  acceptTerms: true
};

async function testAPI() {
  try {
    console.log('🧪 Testing API with data:', testData);
    
    const response = await fetch('http://localhost:3000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response body:', result);
    
    if (response.ok) {
      console.log('✅ API test successful!');
    } else {
      console.log('❌ API test failed:', result);
    }
  } catch (error) {
    console.error('❌ Error during API test:', error);
  }
}

testAPI();

/**
 * APL IMAGE - Data Schema Definition
 *
 * MongoDB Collection: 01_customers
 * Shared schema for consistent data read/write across all pages
 */

// ========== CUSTOMER DATA SCHEMA ==========
const CUSTOMER_SCHEMA = {
  _id: null,
  customerId: '',

  customerInfo: {
    name: '',
    gender: '',
    age: null,
    phone: '',
    email: '',
    occupation: '',
    height: null,
    weight: null,
    clothingSize: '',
    diagnosisReason: '',
    stylePreference: ''
  },

  appointment: {
    date: '',
    time: ''
  },

  customerPhotos: {
    face: {
      front: '',
      side: '',
      video: ''
    },
    body: {
      front: '',
      side: '',
      video: ''
    },
    reference: {
      makeup: [],
      fashion: []
    }
  },

  colorDiagnosis: {
    type: '',
    bestColors: [],
    worstColors: [],
    palette: { primary: [], accent: [], avoid: [] },
    makeupMuse: { name: '', imageUrl: '' },
    description: ''
  },

  faceAnalysis: {
    type: '',
    features: { forehead: '', cheekbone: '', jawline: '', chin: '' },
    referenceImage: '',
    description: ''
  },

  bodyAnalysis: {
    skeletonType: '',
    silhouetteType: '',
    features: { shoulder: '', waist: '', hip: '', leg: '' },
    bestItems: [],
    worstItems: [],
    description: ''
  },

  styling: {
    keywords: [],
    recommendations: {
      tops: [], bottoms: [], outerwear: [],
      accessories: [], overall: []
    },
    avoidItems: [],
    description: ''
  },

  mediaMetadata: {
    totalSizeBytes: 0,
    uploadedAt: null,
    processingStatus: 'pending'
  },

  meta: {
    status: 'pending',
    createdAt: null,
    updatedAt: null,
    completedAt: null,
    diagnosedBy: ''
  }
};

function createEmptyCustomer() {
  return JSON.parse(JSON.stringify(CUSTOMER_SCHEMA));
}

function generateCustomerId() {
  const now = new Date();
  const y = now.getFullYear();
  const mo = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  return `${y}${mo}${d}${h}${mi}${s}${ms}`;
}

function createNewCustomer(formData) {
  const customer = createEmptyCustomer();

  customer.customerId = generateCustomerId();

  customer.customerInfo = {
    name: formData.customerName || '',
    gender: formData.gender || '',
    age: formData.age ? parseInt(formData.age) : null,
    phone: formData.phone || '',
    email: formData.email || '',
    occupation: formData.occupation || '',
    height: formData.height ? parseInt(formData.height) : null,
    weight: formData.weight ? parseInt(formData.weight) : null,
    clothingSize: formData.clothingSize || '',
    diagnosisReason: formData.reason || '',
    stylePreference: formData.stylePreference || ''
  };

  customer.appointment = {
    date: '',
    time: ''
  };

  customer.mediaMetadata = {
    totalSizeBytes: 0,
    uploadedAt: null,
    processingStatus: 'pending'
  };

  customer.meta.status = 'pending';
  customer.meta.createdAt = new Date().toISOString();
  customer.meta.updatedAt = new Date().toISOString();

  return customer;
}

function validateCustomerInfo(customerInfo) {
  const errors = [];

  if (!customerInfo.name || customerInfo.name.trim() === '') errors.push('Name is required.');
  if (!customerInfo.gender) errors.push('Gender is required.');
  if (!customerInfo.age || customerInfo.age < 1) errors.push('Age is required.');
  if (!customerInfo.phone || !/^010-\d{4}-\d{4}$/.test(customerInfo.phone)) errors.push('Valid phone number is required.');
  if (!customerInfo.height || customerInfo.height < 100 || customerInfo.height > 250) errors.push('Valid height is required.');
  if (!customerInfo.weight || customerInfo.weight < 30 || customerInfo.weight > 200) errors.push('Valid weight is required.');

  return { isValid: errors.length === 0, errors };
}

// ========== localStorage KEYS ==========
const STORAGE_KEYS = {
  CURRENT_CUSTOMER: 'apl_current_customer',
  CUSTOMER_LIST: 'apl_customer_list',
  SELECTED_CUSTOMER_ID: 'apl_selected_customer_id'
};

function saveCurrentCustomer(customer) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_CUSTOMER, JSON.stringify(customer));
}

function loadCurrentCustomer() {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_CUSTOMER);
  return data ? JSON.parse(data) : null;
}

function addToCustomerList(customer) {
  const list = getCustomerList();
  customer._id = 'temp_' + Date.now();
  list.push(customer);
  localStorage.setItem(STORAGE_KEYS.CUSTOMER_LIST, JSON.stringify(list));
  return customer._id;
}

function getCustomerList() {
  const data = localStorage.getItem(STORAGE_KEYS.CUSTOMER_LIST);
  return data ? JSON.parse(data) : [];
}

function findCustomerById(customerId) {
  const list = getCustomerList();
  return list.find(c => c._id === customerId) || null;
}

function updateCustomer(customerId, updatedData) {
  const list = getCustomerList();
  const index = list.findIndex(c => c._id === customerId);

  if (index !== -1) {
    list[index] = {
      ...list[index],
      ...updatedData,
      meta: {
        ...list[index].meta,
        ...updatedData.meta,
        updatedAt: new Date().toISOString()
      }
    };
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_LIST, JSON.stringify(list));
    return true;
  }
  return false;
}

function setSelectedCustomerId(customerId) {
  localStorage.setItem(STORAGE_KEYS.SELECTED_CUSTOMER_ID, customerId);
}

function getSelectedCustomerId() {
  return localStorage.getItem(STORAGE_KEYS.SELECTED_CUSTOMER_ID);
}

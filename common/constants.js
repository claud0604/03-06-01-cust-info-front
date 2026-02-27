/**
 * APL IMAGE - Common Constants
 *
 * Usage:
 * - HTML: <script src="common/constants.js"></script>
 * - Access: PERSONAL_COLOR_TYPES.SPRING_BRIGHT.code
 */

// ========== API CONFIG ==========
const API_CONFIG = {
  BASE_URL: 'https://facefree-api.apls.kr',
  ENDPOINTS: {
    CUSTOMERS: '/api/customers',
    PRESIGNED_URL: '/api/upload/presigned-url',
    PRESIGNED_URL_SINGLE: '/api/upload/presigned-url/single',
    VIEW_URLS: '/api/upload/view-urls',
    AI_DIAGNOSE: '/api/ai/diagnose'
  }
};

function getApiUrl(endpoint) {
  return API_CONFIG.BASE_URL + endpoint;
}

// ========== PERSONAL COLOR TYPES (14) ==========
const PERSONAL_COLOR_TYPES = {
  SPRING_BRIGHT: { code: 'SPRING_BRIGHT', label: 'Spring Bright', season: 'spring' },
  SPRING_WARM: { code: 'SPRING_WARM', label: 'Spring Warm', season: 'spring' },
  SPRING_LIGHT: { code: 'SPRING_LIGHT', label: 'Spring Light', season: 'spring' },
  SUMMER_LIGHT: { code: 'SUMMER_LIGHT', label: 'Summer Light', season: 'summer' },
  SUMMER_COOL: { code: 'SUMMER_COOL', label: 'Summer Cool', season: 'summer' },
  SUMMER_MUTE: { code: 'SUMMER_MUTE', label: 'Summer Mute', season: 'summer' },
  AUTUMN_MUTE: { code: 'AUTUMN_MUTE', label: 'Autumn Mute', season: 'autumn' },
  AUTUMN_WARM: { code: 'AUTUMN_WARM', label: 'Autumn Warm', season: 'autumn' },
  AUTUMN_DEEP: { code: 'AUTUMN_DEEP', label: 'Autumn Deep', season: 'autumn' },
  WINTER_DEEP: { code: 'WINTER_DEEP', label: 'Winter Deep', season: 'winter' },
  WINTER_COOL: { code: 'WINTER_COOL', label: 'Winter Cool', season: 'winter' },
  WINTER_BRIGHT: { code: 'WINTER_BRIGHT', label: 'Winter Bright', season: 'winter' },
  AUTUMN_STRONG: { code: 'AUTUMN_STRONG', label: 'Autumn Strong', season: 'autumn' },
  WINTER_STRONG: { code: 'WINTER_STRONG', label: 'Winter Strong', season: 'winter' }
};

const PERSONAL_COLOR_LIST = Object.values(PERSONAL_COLOR_TYPES);

const PERSONAL_COLOR_BY_SEASON = {
  spring: PERSONAL_COLOR_LIST.filter(t => t.season === 'spring'),
  summer: PERSONAL_COLOR_LIST.filter(t => t.season === 'summer'),
  autumn: PERSONAL_COLOR_LIST.filter(t => t.season === 'autumn'),
  winter: PERSONAL_COLOR_LIST.filter(t => t.season === 'winter')
};

// ========== FACE SHAPE TYPES (7) ==========
const FACE_SHAPE_TYPES = {
  OVAL: { code: 'OVAL', label: 'Oval' },
  ROUND: { code: 'ROUND', label: 'Round' },
  INVERTED_TRIANGLE: { code: 'INVERTED_TRIANGLE', label: 'Inverted Triangle' },
  DIAMOND: { code: 'DIAMOND', label: 'Diamond' },
  HEART: { code: 'HEART', label: 'Heart' },
  SQUARE: { code: 'SQUARE', label: 'Square' },
  OBLONG: { code: 'OBLONG', label: 'Oblong' }
};

const FACE_SHAPE_LIST = Object.values(FACE_SHAPE_TYPES);

// ========== BODY TYPES ==========
const BODY_SKELETON_TYPES = {
  STRAIGHT: { code: 'STRAIGHT', label: 'Straight' },
  WAVE: { code: 'WAVE', label: 'Wave' },
  NATURAL: { code: 'NATURAL', label: 'Natural' }
};

const BODY_SKELETON_LIST = Object.values(BODY_SKELETON_TYPES);

const BODY_SILHOUETTE_TYPES = {
  CIRCLE: { code: 'CIRCLE', label: 'Circle' },
  RECTANGLE: { code: 'RECTANGLE', label: 'Rectangle' },
  INVERTED_TRIANGLE: { code: 'INVERTED_TRIANGLE', label: 'Inverted Triangle' },
  TRIANGLE: { code: 'TRIANGLE', label: 'Triangle' },
  HOURGLASS: { code: 'HOURGLASS', label: 'Hourglass' }
};

const BODY_SILHOUETTE_LIST = Object.values(BODY_SILHOUETTE_TYPES);

// ========== GENDER ==========
const GENDER_TYPES = {
  FEMALE: { code: 'female', label: 'Female' },
  MALE: { code: 'male', label: 'Male' }
};

const GENDER_LIST = Object.values(GENDER_TYPES);

// ========== CLOTHING SIZES ==========
const CLOTHING_SIZE_TYPES = {
  XS: { code: 'XS', label: 'XS (44)' },
  S: { code: 'S', label: 'S (55)' },
  M: { code: 'M', label: 'M (66)' },
  L: { code: 'L', label: 'L (77)' },
  XL: { code: 'XL', label: 'XL (88)' },
  XXL: { code: 'XXL', label: 'XXL (99)' },
  XXXL: { code: 'XXXL', label: 'XXXL (100+)' }
};

const CLOTHING_SIZE_LIST = Object.values(CLOTHING_SIZE_TYPES);

// ========== CUSTOMER STATUS ==========
const CUSTOMER_STATUS = {
  PENDING: { code: 'pending', label: 'Pending' },
  IN_PROGRESS: { code: 'in_progress', label: 'In Progress' },
  COMPLETED: { code: 'completed', label: 'Completed' }
};

const CUSTOMER_STATUS_LIST = Object.values(CUSTOMER_STATUS);

// ========== HELPER FUNCTIONS ==========
function findTypeByCode(typeObject, code) {
  return Object.values(typeObject).find(t => t.code === code) || null;
}

function getLabelByCode(typeObject, code) {
  const type = findTypeByCode(typeObject, code);
  return type ? type.label : '';
}

function generateSelectOptions(typeList, selectedCode = '') {
  return typeList.map(type =>
    `<option value="${type.code}"${type.code === selectedCode ? ' selected' : ''}>${type.label}</option>`
  ).join('\n');
}

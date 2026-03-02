// APL IMAGE - Customer Information Script

// ========== THEME SYSTEM ==========
const html = document.documentElement;
const iconDark = document.getElementById('icon-dark');
const iconLight = document.getElementById('icon-light');

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('apl-theme', theme);
  if (theme === 'light') {
    iconLight.classList.add('active');
    iconDark.classList.remove('active');
  } else {
    iconDark.classList.add('active');
    iconLight.classList.remove('active');
  }
}

function toggleTheme() {
  const current = html.getAttribute('data-theme') || getSystemTheme();
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

const savedTheme = localStorage.getItem('apl-theme');
applyTheme(savedTheme || getSystemTheme());

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
  if (!localStorage.getItem('apl-theme')) applyTheme(e.matches ? 'light' : 'dark');
});

// ========== LANGUAGE DROPDOWN ==========
function toggleLangDropdown() {
  document.getElementById('langDropdown').classList.toggle('open');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.lang-switcher')) {
    document.getElementById('langDropdown').classList.remove('open');
  }
});

// ========== GLOBAL VARIABLES ==========
let uploadedImages = {
  faceFront: null,
  face45: null,
  faceSide: null,
  faceVideo: null,
  makeup: [],
  bodyFront: null,
  body45: null,
  bodySide: null,
  bodyVideo: null,
  fashion: []
};

// ========== PAGE INIT ==========
document.addEventListener('DOMContentLoaded', function() {
  setupPhoneInput();
  updatePhoneEmailByLang(getCurrentLang());

  // Face photo upload area click
  const faceUploadArea = document.getElementById('faceUploadArea');
  if (faceUploadArea) {
    faceUploadArea.addEventListener('click', function() {
      openFacePhotosModal();
    });
  }

  // Body photo upload area click
  const bodyUploadArea = document.getElementById('bodyUploadArea');
  if (bodyUploadArea) {
    bodyUploadArea.addEventListener('click', function() {
      openBodyPhotosModal();
    });
  }

  // Face photo edit button
  const editFacePhotosBtn = document.getElementById('editFacePhotosBtn');
  if (editFacePhotosBtn) {
    editFacePhotosBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      openFacePhotosModal();
    });
  }

  // Body photo edit button
  const editBodyPhotosBtn = document.getElementById('editBodyPhotosBtn');
  if (editBodyPhotosBtn) {
    editBodyPhotosBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      openBodyPhotosModal();
    });
  }
});

// ========== PHONE INPUT ==========
function setupPhoneInput() {
  const phone2 = document.getElementById('phone2');
  const phone3 = document.getElementById('phone3');

  phone2.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
    if (this.value.length === 4) phone3.focus();
  });

  phone3.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
  });

  // International phone: digits, spaces, dashes only
  const phoneIntlNumber = document.getElementById('phoneIntlNumber');
  phoneIntlNumber.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9\s\-()]/g, '');
  });

  // Set default country code based on language
  const phoneCountryCode = document.getElementById('phoneCountryCode');
  const langCountryMap = { en: '+1', ja: '+81', zh: '+86', ko: '+82' };
  const lang = getCurrentLang();
  if (langCountryMap[lang]) phoneCountryCode.value = langCountryMap[lang];
}

// ========== PHONE/EMAIL SWITCHING BY LANGUAGE ==========
function updatePhoneEmailByLang(lang) {
  const isKorean = (lang === 'ko');

  // Phone format toggle
  const phoneKorean = document.getElementById('phoneKorean');
  const phoneIntl = document.getElementById('phoneIntl');
  const phoneHintKo = document.getElementById('phoneHintKo');
  const phoneHintIntl = document.getElementById('phoneHintIntl');
  const phone2 = document.getElementById('phone2');
  const phone3 = document.getElementById('phone3');
  const phoneIntlNumber = document.getElementById('phoneIntlNumber');

  if (isKorean) {
    phoneKorean.style.display = 'flex';
    phoneIntl.style.display = 'none';
    phoneHintKo.style.display = '';
    phoneHintIntl.style.display = 'none';
    phone2.required = true;
    phone3.required = true;
    phoneIntlNumber.required = false;
  } else {
    phoneKorean.style.display = 'none';
    phoneIntl.style.display = 'block';
    phoneHintKo.style.display = 'none';
    phoneHintIntl.style.display = '';
    phone2.required = false;
    phone3.required = false;
    phoneIntlNumber.required = true;

    // Set country code default for language
    const langCountryMap = { en: '+1', ja: '+81', zh: '+86' };
    const phoneCountryCode = document.getElementById('phoneCountryCode');
    if (langCountryMap[lang]) phoneCountryCode.value = langCountryMap[lang];
  }

  // Email required toggle
  const emailInput = document.getElementById('email');
  const emailLabel = document.getElementById('emailLabel');
  const emailRequiredHint = document.getElementById('emailRequiredHint');

  if (isKorean) {
    emailInput.required = false;
    emailLabel.classList.remove('required');
    emailLabel.setAttribute('data-i18n', 'ci_field_email');
    emailRequiredHint.style.display = 'none';
  } else {
    emailInput.required = true;
    emailLabel.classList.add('required');
    emailLabel.setAttribute('data-i18n', 'ci_field_email_required');
    emailRequiredHint.style.display = '';
  }

  // Re-apply translations for the changed label
  const t = translations[lang] || translations.en;
  const emailKey = emailLabel.getAttribute('data-i18n');
  if (t[emailKey]) emailLabel.innerHTML = t[emailKey];
}

// ========== IMAGE COMPRESSION ==========
async function compressImage(file) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error('Image compression failed:', error);
    return file;
  }
}

// ========== REFERENCE SLOT UPLOAD (2-box click-to-upload) ==========
async function handleRefSlotUpload(input, type, slotIndex) {
  const file = input.files[0];
  if (!file) return;

  const compressedFile = await compressImage(file);

  // Initialize array if needed
  if (!Array.isArray(uploadedImages[type])) uploadedImages[type] = [];
  uploadedImages[type][slotIndex] = compressedFile;

  const placeholder = document.getElementById(type + 'Slot' + slotIndex);
  const preview = document.getElementById(type + 'Preview' + slotIndex);

  const reader = new FileReader();
  reader.onload = function(e) {
    preview.innerHTML = '';
    const img = document.createElement('img');
    img.src = e.target.result;
    preview.appendChild(img);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'ref-remove-btn';
    removeBtn.innerHTML = '&times;';
    removeBtn.onclick = function(ev) {
      ev.stopPropagation();
      removeRefSlot(type, slotIndex);
    };
    preview.appendChild(removeBtn);

    preview.classList.add('active');
    placeholder.style.display = 'none';
  };
  reader.readAsDataURL(compressedFile);
}

function removeRefSlot(type, slotIndex) {
  if (Array.isArray(uploadedImages[type])) {
    uploadedImages[type][slotIndex] = null;
  }
  const placeholder = document.getElementById(type + 'Slot' + slotIndex);
  const preview = document.getElementById(type + 'Preview' + slotIndex);
  const input = document.getElementById(type + 'Image' + slotIndex);

  preview.innerHTML = '';
  preview.classList.remove('active');
  placeholder.style.display = '';
  if (input) input.value = '';
}

// ========== MODAL IMAGE UPLOAD ==========
async function handleModalImageUpload(input, type) {
  const file = input.files[0];
  if (!file) return;

  const compressedFile = await compressImage(file);

  const placeholder = document.getElementById(type + 'Placeholder');
  const preview = document.getElementById(type + 'Preview');

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = document.createElement('img');
    img.src = e.target.result;
    preview.innerHTML = '';
    preview.appendChild(img);
    preview.classList.add('active');
    placeholder.style.display = 'none';
  };
  reader.readAsDataURL(compressedFile);

  uploadedImages[type] = compressedFile;

  const category = type.startsWith('face') ? 'face' : 'body';
  updateSaveButton(category);
}

// ========== SAVE BUTTON STATE ==========
function updateSaveButton(category) {
  const requiredField = category === 'face' ? 'faceFront' : 'bodyFront';
  const saveBtn = document.getElementById(`save${category.charAt(0).toUpperCase() + category.slice(1)}PhotosBtn`);
  saveBtn.disabled = !uploadedImages[requiredField];
}

// ========== FACE PHOTOS MODAL ==========
function openFacePhotosModal() {
  document.getElementById('facePhotosModal').style.display = 'flex';
  updateSaveButton('face');
}

function closeFacePhotosModal() {
  document.getElementById('facePhotosModal').style.display = 'none';
}

function saveFacePhotos() {
  if (!uploadedImages.faceFront) {
    alert(getTranslation('ci_alert_face_required'));
    return;
  }
  closeFacePhotosModal();
  updateFaceThumbnails();
}

function updateFaceThumbnails() {
  const placeholder = document.getElementById('facePlaceholder');
  const summary = document.getElementById('facePreviewSummary');
  const thumbnailsContainer = document.getElementById('faceThumbnails');

  placeholder.style.display = 'none';
  summary.style.display = 'flex';
  thumbnailsContainer.innerHTML = '';

  ['faceFront', 'face45', 'faceSide'].forEach(type => {
    if (uploadedImages[type]) {
      const thumbDiv = document.createElement('div');
      thumbDiv.className = 'thumbnail-item';
      const img = document.createElement('img');
      img.src = URL.createObjectURL(uploadedImages[type]);
      thumbDiv.appendChild(img);
      thumbnailsContainer.appendChild(thumbDiv);
    }
  });
}

// ========== BODY PHOTOS MODAL ==========
function openBodyPhotosModal() {
  document.getElementById('bodyPhotosModal').style.display = 'flex';
  updateSaveButton('body');
}

function closeBodyPhotosModal() {
  document.getElementById('bodyPhotosModal').style.display = 'none';
}

function saveBodyPhotos() {
  if (!uploadedImages.bodyFront) {
    alert(getTranslation('ci_alert_body_required'));
    return;
  }
  closeBodyPhotosModal();
  updateBodyThumbnails();
}

function updateBodyThumbnails() {
  const placeholder = document.getElementById('bodyPlaceholder');
  const summary = document.getElementById('bodyPreviewSummary');
  const thumbnailsContainer = document.getElementById('bodyThumbnails');

  placeholder.style.display = 'none';
  summary.style.display = 'flex';
  thumbnailsContainer.innerHTML = '';

  ['bodyFront', 'body45', 'bodySide'].forEach(type => {
    if (uploadedImages[type]) {
      const thumbDiv = document.createElement('div');
      thumbDiv.className = 'thumbnail-item';
      const img = document.createElement('img');
      img.src = URL.createObjectURL(uploadedImages[type]);
      thumbDiv.appendChild(img);
      thumbnailsContainer.appendChild(thumbDiv);
    }
  });
}

// ========== VIDEO GUIDE MODALS ==========
function openFaceVideoGuide() {
  document.getElementById('faceVideoModal').style.display = 'flex';
}

function closeFaceVideoGuide() {
  document.getElementById('faceVideoModal').style.display = 'none';
}

function openBodyVideoGuide() {
  document.getElementById('bodyVideoModal').style.display = 'flex';
}

function closeBodyVideoGuide() {
  document.getElementById('bodyVideoModal').style.display = 'none';
}

// ========== VIDEO UPLOAD FROM MODAL ==========
function handleVideoUploadFromModal(input, type) {
  const file = input.files[0];
  if (!file) return;

  if (file.size > 50 * 1024 * 1024) {
    alert(getTranslation('ci_alert_video_size'));
    input.value = '';
    return;
  }

  const previewContainer = document.getElementById(type + 'Preview');
  const uploadArea = document.getElementById(type + 'UploadArea');

  if (previewContainer) {
    previewContainer.innerHTML = '';
    previewContainer.style.display = 'block';

    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.controls = true;
    video.muted = true;
    video.style.width = '100%';
    video.style.maxWidth = '300px';
    video.style.borderRadius = '8px';
    previewContainer.appendChild(video);

    const placeholder = uploadArea.querySelector('.upload-placeholder');
    if (placeholder) placeholder.style.display = 'none';
  }

  const modalPreview = document.getElementById(type + 'PreviewModal');
  if (modalPreview) {
    modalPreview.innerHTML = '';
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.controls = true;
    video.muted = true;
    modalPreview.appendChild(video);
  }

  uploadedImages[type] = file;
  alert(getTranslation('ci_alert_video_uploaded'));
}

// ========== REFERENCE PHOTO MODALS (Makeup / Fashion) ==========
function openRefModal(type) {
  document.getElementById(type + 'RefModal').style.display = 'flex';
}

function closeRefModal(type) {
  document.getElementById(type + 'RefModal').style.display = 'none';
}

function saveRefPhotos(type) {
  closeRefModal(type);
  updateRefThumbnails(type);
}

function updateRefThumbnails(type) {
  const placeholder = document.getElementById(type + 'Placeholder');
  const summary = document.getElementById(type + 'PreviewSummary');
  const thumbnailsContainer = document.getElementById(type + 'Thumbnails');

  const files = (uploadedImages[type] || []).filter(Boolean);

  if (files.length === 0) {
    placeholder.style.display = '';
    summary.style.display = 'none';
    return;
  }

  placeholder.style.display = 'none';
  summary.style.display = 'flex';
  thumbnailsContainer.innerHTML = '';

  files.forEach(file => {
    const thumbDiv = document.createElement('div');
    thumbDiv.className = 'thumbnail-item';
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    thumbDiv.appendChild(img);
    thumbnailsContainer.appendChild(thumbDiv);
  });
}

// ========== MODAL OUTSIDE CLICK ==========
document.addEventListener('click', function(e) {
  const modals = ['facePhotosModal', 'bodyPhotosModal', 'faceVideoModal', 'bodyVideoModal', 'makeupRefModal', 'fashionRefModal'];
  modals.forEach(id => {
    const modal = document.getElementById(id);
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});

// ========== GO TO CONFIRM PAGE ==========
function goToConfirmPage() {
  if (!document.getElementById('privacyConsent').checked) {
    alert(getTranslation('ci_alert_privacy'));
    return;
  }

  const form = document.getElementById('customerForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  displayConfirmData();

  document.getElementById('inputPage').style.display = 'none';
  document.getElementById('confirmPage').style.display = 'block';
  window.scrollTo(0, 0);
}

// ========== DISPLAY CONFIRM DATA ==========
function displayConfirmData() {
  const name = document.getElementById('customerName').value;
  const genderRadio = document.querySelector('input[name="gender"]:checked');

  const lang = getCurrentLang();
  let genderLabel = '';
  if (genderRadio) {
    genderLabel = genderRadio.value === 'female'
      ? getTranslation('ci_gender_female')
      : getTranslation('ci_gender_male');
  }

  const age = document.getElementById('age').value;

  let phone;
  if (lang === 'ko') {
    phone = '010-' + document.getElementById('phone2').value + '-' + document.getElementById('phone3').value;
  } else {
    const countryCode = document.getElementById('phoneCountryCode').value;
    const number = document.getElementById('phoneIntlNumber').value.trim();
    phone = countryCode + ' ' + number;
  }

  const email = document.getElementById('email').value || '-';
  const occupation = document.getElementById('occupation').value || '-';
  const height = document.getElementById('height').value;
  const weight = document.getElementById('weight').value;
  const clothingSize = document.getElementById('clothingSize').value;
  const reason = document.getElementById('reason').value;
  const stylePreference = document.getElementById('stylePreference').value;

  document.getElementById('confirmName').textContent = name;
  document.getElementById('confirmNameValue').textContent = name;
  document.getElementById('confirmGender').textContent = genderLabel;
  document.getElementById('confirmAge').textContent = age;
  document.getElementById('confirmPhone').textContent = phone;
  document.getElementById('confirmEmail').textContent = email;
  document.getElementById('confirmOccupation').textContent = occupation;
  document.getElementById('confirmHeight').textContent = height + 'cm';
  document.getElementById('confirmWeight').textContent = weight + 'kg';
  document.getElementById('confirmClothingSize').textContent = clothingSize;
  document.getElementById('confirmReason').textContent = reason;
  document.getElementById('confirmStyle').textContent = stylePreference;

  displayConfirmImages();
}

// ========== DISPLAY CONFIRM IMAGES ==========
function displayConfirmImages() {
  const container = document.getElementById('confirmImages');
  container.innerHTML = '';

  ['faceFront', 'face45', 'faceSide', 'bodyFront', 'body45', 'bodySide'].forEach(type => {
    if (uploadedImages[type]) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(uploadedImages[type]);
      container.appendChild(img);
    }
  });

  ['makeup', 'fashion'].forEach(type => {
    uploadedImages[type].filter(Boolean).forEach(file => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      container.appendChild(img);
    });
  });
}

// ========== GO BACK TO INPUT ==========
function goBackToInput() {
  document.getElementById('confirmPage').style.display = 'none';
  document.getElementById('inputPage').style.display = 'block';
  window.scrollTo(0, 0);
}

// ========== COLLECT FORM DATA ==========
function collectFormData() {
  const genderRadio = document.querySelector('input[name="gender"]:checked');
  const lang = getCurrentLang();

  let phone;
  if (lang === 'ko') {
    phone = '010-' + document.getElementById('phone2').value + '-' + document.getElementById('phone3').value;
  } else {
    const countryCode = document.getElementById('phoneCountryCode').value;
    const number = document.getElementById('phoneIntlNumber').value.trim();
    phone = countryCode + ' ' + number;
  }

  return {
    customerName: document.getElementById('customerName').value,
    gender: genderRadio ? genderRadio.value : '',
    age: document.getElementById('age').value,
    phone: phone,
    email: document.getElementById('email').value,
    occupation: document.getElementById('occupation').value,
    height: document.getElementById('height').value,
    weight: document.getElementById('weight').value,
    clothingSize: document.getElementById('clothingSize').value,
    reason: document.getElementById('reason').value,
    stylePreference: document.getElementById('stylePreference').value,
    submittedAt: new Date().toISOString()
  };
}

// ========== SPINNER ==========
function showSpinner() {
  document.getElementById('spinnerOverlay').style.display = 'flex';
}

function hideSpinner() {
  document.getElementById('spinnerOverlay').style.display = 'none';
}

// ========== SUBMIT DATA ==========
async function submitData() {
  showSpinner();

  try {
    const formData = collectFormData();

    // 1. Create customer record
    const customerResponse = await createCustomerRecord(formData);
    if (!customerResponse.success) {
      throw new Error(customerResponse.message || 'Customer registration failed.');
    }

    const customerId = customerResponse.customerId;

    // 2. Upload images to S3
    const uploadResult = await uploadImagesToS3(customerId);

    // 3. Update customer with photo keys
    await updateCustomerPhotos(customerId, uploadResult);

    // 4. Save to localStorage
    const customer = customerResponse.data;
    customer.customerPhotos = uploadResult.customerPhotos;
    customer.mediaMetadata = uploadResult.mediaMetadata;

    saveCurrentCustomer(customer);
    setSelectedCustomerId(customerId);

    // Move to complete page
    hideSpinner();
    document.getElementById('confirmPage').style.display = 'none';
    document.getElementById('completePage').style.display = 'block';
    document.getElementById('completeName').textContent = customer.customerInfo.name;
    window.scrollTo(0, 0);

  } catch (error) {
    hideSpinner();
    console.error('Submit error:', error);
    alert(getTranslation('ci_alert_submit_error') + ': ' + error.message);
  }
}

// ========== API: Create Customer Record ==========
async function createCustomerRecord(formData) {
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CUSTOMERS), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerInfo: {
        name: formData.customerName,
        gender: formData.gender,
        age: parseInt(formData.age),
        phone: formData.phone,
        email: formData.email || '',
        occupation: formData.occupation || '',
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        clothingSize: formData.clothingSize,
        diagnosisReason: formData.reason,
        stylePreference: formData.stylePreference
      }
    })
  });

  return await response.json();
}

// ========== S3 UPLOAD ==========
async function uploadImagesToS3(customerId) {
  const filesToUpload = [];
  let totalSizeBytes = 0;

  const faceMapping = {
    faceFront: { category: 'face', type: 'front', ext: 'jpg' },
    face45: { category: 'face', type: 'angle45', ext: 'jpg' },
    faceSide: { category: 'face', type: 'side', ext: 'jpg' },
    faceVideo: { category: 'face', type: 'video', ext: 'mp4' }
  };

  const bodyMapping = {
    bodyFront: { category: 'body', type: 'front', ext: 'jpg' },
    body45: { category: 'body', type: 'angle45', ext: 'jpg' },
    bodySide: { category: 'body', type: 'side', ext: 'jpg' },
    bodyVideo: { category: 'body', type: 'video', ext: 'mp4' }
  };

  for (const [key, mapping] of Object.entries({ ...faceMapping, ...bodyMapping })) {
    if (uploadedImages[key]) {
      const file = uploadedImages[key];
      const isVideo = key.includes('Video');
      const ext = isVideo ? 'mp4' : 'jpg';
      const contentType = isVideo ? 'video/mp4' : 'image/jpeg';

      filesToUpload.push({
        file, category: mapping.category, type: mapping.type,
        filename: `${mapping.type}.${ext}`, contentType
      });
      totalSizeBytes += file.size;
    }
  }

  uploadedImages.makeup.filter(Boolean).forEach((file, index) => {
    filesToUpload.push({
      file, category: 'reference', type: 'makeup',
      filename: `${String(index + 1).padStart(3, '0')}.jpg`,
      contentType: 'image/jpeg'
    });
    totalSizeBytes += file.size;
  });

  uploadedImages.fashion.filter(Boolean).forEach((file, index) => {
    filesToUpload.push({
      file, category: 'reference', type: 'fashion',
      filename: `${String(index + 1).padStart(3, '0')}.jpg`,
      contentType: 'image/jpeg'
    });
    totalSizeBytes += file.size;
  });

  if (filesToUpload.length === 0) {
    return {
      customerPhotos: {
        face: { front: '', angle45: '', side: '', video: '' },
        body: { front: '', angle45: '', side: '', video: '' },
        reference: { makeup: [], fashion: [] }
      },
      mediaMetadata: { totalSizeBytes: 0, uploadedAt: null, processingStatus: 'completed' }
    };
  }

  const presignedResponse = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PRESIGNED_URL), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerId,
      files: filesToUpload.map(f => ({
        category: f.category, type: f.type,
        filename: f.filename, contentType: f.contentType
      }))
    })
  });

  const presignedData = await presignedResponse.json();
  if (!presignedData.success) {
    throw new Error('Failed to get upload URLs.');
  }

  const uploadPromises = filesToUpload.map(async (fileInfo, index) => {
    const presigned = presignedData.data[index];
    await fetch(presigned.presignedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': fileInfo.contentType },
      body: fileInfo.file
    });
    return { category: fileInfo.category, type: fileInfo.type, s3Key: presigned.s3Key };
  });

  const uploadResults = await Promise.all(uploadPromises);

  const customerPhotos = {
    face: { front: '', angle45: '', side: '', video: '' },
    body: { front: '', angle45: '', side: '', video: '' },
    reference: { makeup: [], fashion: [] }
  };

  uploadResults.forEach(result => {
    if (result.category === 'reference') {
      customerPhotos.reference[result.type].push(result.s3Key);
    } else {
      customerPhotos[result.category][result.type] = result.s3Key;
    }
  });

  return {
    customerPhotos,
    mediaMetadata: {
      totalSizeBytes,
      uploadedAt: new Date().toISOString(),
      processingStatus: 'completed'
    }
  };
}

// ========== API: Update Customer Photos ==========
async function updateCustomerPhotos(customerId, uploadResult) {
  const response = await fetch(
    getApiUrl(API_CONFIG.ENDPOINTS.CUSTOMERS) + `/${customerId}/photos`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uploadResult)
    }
  );

  const data = await response.json();
  if (!data.success) {
    console.error('Photo info update failed:', data.message);
  }
  return data;
}


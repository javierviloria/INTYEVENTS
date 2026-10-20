/**
 * INTYLACT® - APLICACIÓN WEB DE GESTIÓN Y REGISTRO DE EVENTOS
 * Lógica de negocio, estado reactivo, autenticación Google/Admin,
 * Wizard de 6 pasos con validación en tiempo real y panel de control.
 */

// ==========================================
// 1. ESTADO Y DATOS INICIALES PERSISTENTES
// ==========================================

const INTY_STORAGE_KEYS = {
  CURRENT_USER: 'intylact_current_user',
  LEADS: 'intylact_leads_db',
  REQUESTS: 'intylact_requests_db',
  CONFIG: 'intylact_system_config',
  DEVICE_ACCOUNTS: 'inty_saved_device_accounts',
  LOGISTICS: 'intylact_logistics_db'
};

// Base de Leads limpia: sólo se registran usuarios reales que ingresen con su correo
const DEFAULT_LEADS = [];

const DEFAULT_REQUESTS = [
  {
    id: 'INTY-2026-0042',
    createdAt: '2026-09-29T10:15:00.000Z',
    status: 'Aprobado',
    leadId: 'lead-001',
    timestamps: {
      politicas: '2026-09-29T10:02:14.210Z',
      confidencialidad: '2026-09-29T10:05:40.540Z',
      envioFinal: '2026-09-29T10:15:00.000Z'
    },
    organizer: {
      name: 'Valeria Morales Rivas / Liga Femenina SportFit',
      idDocument: 'V- 25412890',
      email: 'valeria.morales@gmail.com',
      whatsapp: '+58 412 889 4521',
      instagramUrl: 'https://instagram.com/sportfit_femenino',
      instagramUser: '@sportfit_femenino'
    },
    details: {
      eventName: 'Torneo Femenino Intysquad & Bienestar 2026',
      duration: 'multijornada',
      eventDate: 'Del 14 al 16 de Noviembre de 2026',
      schedule: 'Viernes: 3:00 PM a 8:00 PM | Sábado: 8:00 AM a 6:00 PM | Domingo: 9:00 AM a 4:00 PM (Finales)',
      location: 'Canchas La Guairita, Complejo Deportivo Sport Center, El Cafetal, Caracas',
      mapsUrl: 'https://maps.google.com/?q=Complejo+Deportivo+Sport+Center+Caracas',
      files: [
        { name: 'Flyer_Oficial_Intysquad.jpg', size: '3.4 MB', type: 'image/jpeg' },
        { name: 'Dossier_Comercial_Liga_2026.pdf', size: '12.8 MB', type: 'application/pdf' }
      ]
    },
    impact: {
      capacity: '850 asistentes confirmados + 120 atletas femeninas',
      contributions: ['LOGO EN FLYER', 'MENCIÓN EN REDES SOCIALES DEL EVENTO', 'ESPACIO PARA STAND', 'LOGO EN MATERIAL IMPRESO DEL EVENTO', 'BASE DE DATOS DE ASISTENTES'],
      otherContribution: '',
      brandReturn: 'Stand principal con activación de inflables y sampling de producto. 4 menciones en altavoz durante las finales, logo en camisetas del equipo campeón y entrega de base de datos de inscritas.'
    }
  },
  {
    id: 'INTY-2026-0043',
    createdAt: '2026-10-03T16:20:00.000Z',
    status: 'En Revisión',
    leadId: 'lead-002',
    timestamps: {
      politicas: '2026-10-03T16:11:00.120Z',
      confidencialidad: '2026-10-03T16:14:22.310Z',
      envioFinal: '2026-10-03T16:20:00.000Z'
    },
    organizer: {
      name: 'Camila Da Silva - Studio Pilates & Alma',
      idDocument: 'V- 22894105',
      email: 'camila.dasilva@gmail.com',
      whatsapp: '+58 414 772 1930',
      instagramUrl: 'https://instagram.com/pilatesyalma.ccs',
      instagramUser: '@pilatesyalma.ccs'
    },
    details: {
      eventName: 'Masterclass de Bienestar Íntimo y Movimiento Consciente',
      duration: 'dia_unico',
      eventDate: '28 de Noviembre de 2026',
      startTime: '08:30 AM (Caracas, VET)',
      endTime: '01:00 PM (Caracas, VET)',
      location: 'Terraza Hotel Renaissance, Altamira, Caracas',
      mapsUrl: 'https://maps.google.com/?q=Hotel+Renaissance+Caracas',
      files: [
        { name: 'Flyer_Masterclass_Nov2026.png', size: '4.1 MB', type: 'image/png' }
      ]
    },
    impact: {
      capacity: '200 mujeres ejecutivas y deportistas',
      contributions: ['ESPACIO PARA CHARLA DE LA MARCA', 'ESPACIO PARA STAND', 'MENCIÓN EN REDES SOCIALES DEL EVENTO', 'Otro'],
      otherContribution: 'Welcome kit con sachets de Intylact para cada asistente.',
      brandReturn: 'Charla exclusiva de 20 minutos con ginecóloga aliada sobre autocuidado femenino, stand con backing Besties de Intylact y reels colaborativos en Instagram.'
    }
  },
  {
    id: 'INTY-2026-0044',
    createdAt: '2026-10-05T09:30:00.000Z',
    status: 'Aprobado',
    leadId: 'lead-003',
    timestamps: {
      politicas: '2026-10-05T09:20:00.000Z',
      confidencialidad: '2026-10-05T09:25:00.000Z',
      envioFinal: '2026-10-05T09:30:00.000Z'
    },
    organizer: {
      name: 'Valeria Leones',
      idDocument: 'V- 32196229',
      email: 'valeria.leones@gmail.com',
      whatsapp: '04126681611',
      instagramUrl: 'https://instagram.com/valerialeones',
      instagramUser: '@valerialeones'
    },
    details: {
      eventName: '6TA EDICION CARRERA CAMINATA 5K POR LA CONCIENTIZACION DEL CANCER DE MAMA FUCCAM 25 DE OCTUBRE | MATERIAL PROMOTORA VALERIA LEONES PUEBLO NUEVO',
      duration: 'dia_unico',
      eventDate: '25 de Octubre de 2026',
      startTime: '06:30 AM (Caracas, VET)',
      endTime: '12:00 PM (Caracas, VET)',
      location: 'GUACUIRA ARRIBA, MUNICIPIO FALCÓN. ESTADO FALCÓN, DETRÁS DE LA PARADA, CASA SIN NÚMERO',
      mapsUrl: ''
    },
    impact: {
      capacity: '1200 corredores',
      contributions: ['LOGO EN FLYER', 'ESPACIO PARA STAND', 'MENCIÓN EN REDES SOCIALES DEL EVENTO'],
      otherContribution: '',
      brandReturn: 'Stand con entrega de sachets y abanicos.'
    }
  }
];

// Estado reactivo en memoria
const AppState = {
  currentUser: null,
  activeView: 'landing', // 'landing', 'dashboard-events', 'dashboard-wizard', 'admin'
  wizardStep: 1,
  wizardFormData: {
    // Timestamps
    politicasAcceptedAt: null,
    confidencialidadAcceptedAt: null,
    compromisosAcceptedAt: null,
    
    // Paso 3
    organizerName: '',
    organizerIdDocument: '',
    organizerEmail: '',
    organizerWhatsapp: '',
    organizerInstagramUrl: '',
    organizerInstagramUser: '',
    
    // Paso 4
    eventName: '',
    duration: 'dia_unico', // 'dia_unico' | 'multijornada'
    // Día Único
    singleDate: '',
    singleStartTime: '09:00 AM',
    singleEndTime: '05:00 PM',
    // Multijornada
    multiDate: '',
    multiSchedule: '',
    // Comunes
    location: '',
    mapsUrl: '',
    files: [],
    
    // Paso 5
    capacity: '',
    contributions: [],
    otherContribution: '',
    brandReturn: '',
    
    // Paso 6
    checkIndependencia: false,
    check10Dias: false,
    checkConfidencialidadFinal: false
  },
  adminFilterStatus: 'todos',
  adminSearchQuery: '',
  adminSelectedRequest: null
};

// ==========================================
// CUENTAS ADMINISTRATIVAS OFICIALES
// ==========================================
const AUTHORIZED_ADMIN_ACCOUNTS = [
  {
    email: 'samivivasintyeventos@intylact.com',
    passwords: ['sami2026', 'Sami2026*', 'samivivas2026', 'intylact2026'],
    name: 'Sami Vivas',
    role: 'admin',
    photo: 'BANNER.jpeg'
  },
  {
    email: 'dixonmontillaintyeventos@intylact.com',
    passwords: ['dixon2026', 'Dixon2026*', 'dixonmontilla2026', 'intylact2026'],
    name: 'Dixon Montilla',
    role: 'admin',
    photo: 'BANNER.jpeg'
  },
  {
    email: 'intyeventos@intylact.com',
    passwords: ['admin2026', 'intylact2026', 'admin', 'intylact'],
    name: 'Dirección de Mercadeo INTYLACT',
    role: 'admin',
    photo: 'BANNER.jpeg'
  }
];

// ==========================================
// MOTOR DE AUTOCOMPLETADO UNIVERSAL Y PREDICCIÓN CON SELECCIÓN RÁPIDA
// ==========================================
function initUniversalAutocomplete() {
  let dropdown = document.getElementById('inty-global-autocomplete-dropdown');
  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.id = 'inty-global-autocomplete-dropdown';
    dropdown.className = 'inty-autocomplete-dropdown';
    dropdown.style.display = 'none';
    document.body.appendChild(dropdown);
  }

  let activeInput = null;
  let selectedIndex = -1;

  function getSuggestionsForInput(input) {
    const id = input.id;
    const listAttr = input.getAttribute('list');
    const val = (input.value || '').trim().toLowerCase();
    const suggestions = [];

    // 1. Correos de Administradores
    if (id === 'admin-email' || listAttr === 'datalist-admin-emails') {
      AUTHORIZED_ADMIN_ACCOUNTS.forEach(a => {
        suggestions.push({ value: a.email, badge: 'Admin', label: `${a.name} (${a.email})` });
      });
    }

    // 2. Correos Google / Organizador (Estricta Privacidad del Usuario)
    if (id === 'google-custom-email' || id === 'form-org-email') {
      // Sugerir únicamente el correo propio del usuario autenticado si existe
      if (AppState.currentUser && AppState.currentUser.email) {
        suggestions.push({ value: AppState.currentUser.email, badge: 'Tu Correo', label: AppState.currentUser.email });
      }
      // Autocompletado sintáctico de dominio seguro al escribir letras
      if (val && !val.includes('@') && val.length >= 2) {
        suggestions.push({ value: `${val}@gmail.com`, badge: 'Gmail', label: `${val}@gmail.com` });
        suggestions.push({ value: `${val}@hotmail.com`, badge: 'Hotmail', label: `${val}@hotmail.com` });
        suggestions.push({ value: `${val}@yahoo.com`, badge: 'Yahoo', label: `${val}@yahoo.com` });
      }
    }

    // 3. Nombres (Privacidad: solo el usuario actual o responsable en etiquetado)
    if (id === 'google-custom-name' || id === 'form-org-name') {
      if (AppState.currentUser && AppState.currentUser.name) {
        suggestions.push({ value: AppState.currentUser.name, badge: 'Tu Nombre', label: AppState.currentUser.name });
      }
    } else if (id === 'label-input-responsible-name' || id === 'logistics-input-responsible-name') {
      // Solo en administración (Logística / Etiquetado)
      getRequests().forEach(r => {
        const nm = r.organizer?.name;
        if (nm && !suggestions.some(s => s.value.toLowerCase() === nm.toLowerCase())) {
          suggestions.push({ value: nm, badge: 'Evento', label: nm });
        }
      });
    }

    // 4. Cédula / Identificación
    if (id === 'form-org-id-document' || id === 'label-input-responsible-id' || listAttr === 'datalist-cedulas') {
      if (AppState.currentUser && AppState.currentUser.idDocument) {
        suggestions.push({ value: AppState.currentUser.idDocument, badge: 'Tu Cédula', label: AppState.currentUser.idDocument });
      }
      suggestions.push({ value: 'V- ', badge: 'Venezolano', label: 'V- (Cédula Venezolana)' });
      suggestions.push({ value: 'J- ', badge: 'Jurídico', label: 'J- (Rif Jurídico)' });
      suggestions.push({ value: 'E- ', badge: 'Extranjero', label: 'E- (Extranjero)' });
    }

    // 5. Teléfonos / WhatsApp (Privacidad del usuario)
    if (id === 'form-org-whatsapp' || id === 'label-input-phone' || listAttr === 'datalist-phones') {
      if (AppState.currentUser && AppState.currentUser.phone) {
        suggestions.push({ value: AppState.currentUser.phone, badge: 'Tu Teléfono', label: AppState.currentUser.phone });
      }
      suggestions.push({ value: '0412 ', badge: 'Digitel', label: '0412 (Digitel)' });
      suggestions.push({ value: '0414 ', badge: 'Movistar', label: '0414 (Movistar)' });
      suggestions.push({ value: '0424 ', badge: 'Movistar', label: '0424 (Movistar)' });
      suggestions.push({ value: '0416 ', badge: 'Movilnet', label: '0416 (Movilnet)' });
      suggestions.push({ value: '0426 ', badge: 'Movilnet', label: '0426 (Movilnet)' });
      suggestions.push({ value: '+58 ', badge: 'Internacional', label: '+58 (Venezuela)' });
    }

    // 6. Nombres de Eventos
    if (id === 'form-event-name' || id === 'label-input-event-name' || listAttr === 'datalist-events') {
      getRequests().forEach(r => {
        const evName = r.details?.eventName;
        if (evName && !suggestions.some(s => s.value.toLowerCase() === evName.toLowerCase())) {
          suggestions.push({ value: evName, badge: 'Registrado', label: evName });
        }
      });
      suggestions.push({ value: '6TA EDICION CARRERA CAMINATA 5K POR LA CONCIENTIZACION DEL CANCER DE MAMA FUCCAM 25 DE OCTUBRE | MATERIAL PROMOTORA VALERIA LEONES PUEBLO NUEVO', badge: 'Modelo', label: 'Carrera Caminata 5K FUCCAM' });
      suggestions.push({ value: 'Masterclass de Yoga & Cuidado Íntimo INTYLACT 2026', badge: 'Sugerido', label: 'Masterclass de Yoga' });
      suggestions.push({ value: 'Torneo Femenino Intysquad & Bienestar 2026', badge: 'Sugerido', label: 'Torneo Femenino Intysquad' });
      suggestions.push({ value: 'Jornada de Salud Femenina & Autocuidado INTYLACT', badge: 'Sugerido', label: 'Jornada de Salud' });
      suggestions.push({ value: 'Activación Deportiva y Bienestar Femenino', badge: 'Sugerido', label: 'Activación Deportiva' });
    }

    // 7. Ubicaciones y Direcciones
    if (id === 'form-location' || id === 'label-input-address' || listAttr === 'datalist-locations') {
      suggestions.push({ value: 'GUACUIRA ARRIBA, MUNICIPIO FALCÓN. ESTADO FALCÓN, DETRÁS DE LA PARADA, CASA SIN NÚMERO', badge: 'Dirección', label: 'Guacuira Arriba, Estado Falcón' });
      suggestions.push({ value: 'Caracas, Miranda - Canchas La Guairita', badge: 'Sede', label: 'Caracas - Canchas La Guairita' });
      suggestions.push({ value: 'Caracas, Distrito Capital - Parque del Este', badge: 'Sede', label: 'Caracas - Parque del Este' });
      suggestions.push({ value: 'Valencia, Carabobo - Hotel Hesperia WTC', badge: 'Sede', label: 'Valencia - Hotel Hesperia WTC' });
      suggestions.push({ value: 'Maracaibo, Zulia - Vereda del Lago', badge: 'Sede', label: 'Maracaibo - Vereda del Lago' });
      suggestions.push({ value: 'Barquisimeto, Lara - Complejo Ferial', badge: 'Sede', label: 'Barquisimeto - Complejo Ferial' });
      suggestions.push({ value: 'Lechería, Anzoátegui - Plaza Mayor', badge: 'Sede', label: 'Lechería - Plaza Mayor' });
      suggestions.push({ value: 'San Cristóbal, Táchira - Parque Metropolitano', badge: 'Sede', label: 'San Cristóbal - Parque Metropolitano' });
      getRequests().forEach(r => {
        const loc = r.details?.location;
        if (loc && !suggestions.some(s => s.value.toLowerCase() === loc.toLowerCase())) {
          suggestions.push({ value: loc, badge: 'Historial', label: loc });
        }
      });
    }

    // 8. Números de Cajas y Totales
    if (id === 'label-input-box-num' || id === 'label-input-box-total' || listAttr === 'datalist-box-counts') {
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].forEach(n => {
        suggestions.push({ value: n, badge: 'Caja', label: `${n} ${n === '1' ? 'Caja' : 'Cajas'}` });
      });
    }

    // 9. Subtítulos de Cajas
    if (id === 'label-input-box-subtitle' || listAttr === 'datalist-box-subtitles') {
      [
        'REGALOS EN STAND',
        'MATERIAL PROMOTORA',
        'UNIFORMES Y ACCESORIOS',
        'MUESTRAS Y SACHETS',
        'EQUIPO DE SONIDO E ILUMINACIÓN',
        'STAND Y BANDERINES',
        'BOTARGA Y PUBLICIDAD'
      ].forEach(st => {
        suggestions.push({ value: st, badge: 'Contenido', label: st });
      });
    }

    // 10. Instagram Handles
    if (id === 'form-org-insta-user' || listAttr === 'datalist-instagram') {
      ['@intylact', '@intysquad', '@fuccam_oficial', '@bienestar_femenino', '@sportfit_vzla'].forEach(h => {
        suggestions.push({ value: h, badge: 'Instagram', label: h });
      });
    }

    // Filtrado predictivo
    if (!val) {
      return suggestions.slice(0, 7);
    }

    const filtered = suggestions.filter(s => {
      return s.value.toLowerCase().includes(val) || (s.label && s.label.toLowerCase().includes(val));
    });

    return filtered.slice(0, 8);
  }

  function showDropdownFor(input) {
    activeInput = input;
    selectedIndex = -1;
    const suggestions = getSuggestionsForInput(input);

    if (suggestions.length === 0) {
      hideDropdown();
      return;
    }

    const rect = input.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const scrollX = window.scrollX || window.pageXOffset || 0;

    dropdown.style.top = `${rect.bottom + scrollY + 4}px`;
    dropdown.style.left = `${Math.max(10, rect.left + scrollX)}px`;
    dropdown.style.width = `${Math.min(window.innerWidth - 24, Math.max(rect.width, 260))}px`;

    let html = `
      <div class="inty-autocomplete-header">
        <span>Sugerencias automáticas</span>
        <span style="color:#d87a86; font-size:9.5px; font-weight:800;">Toca para seleccionar</span>
      </div>
    `;

    suggestions.forEach(s => {
      const displayVal = (typeof escapeHtml === 'function') ? escapeHtml(s.label || s.value) : (s.label || s.value);
      const dataVal = (typeof escapeHtml === 'function') ? escapeHtml(s.value) : s.value;
      html += `
        <div class="inty-autocomplete-item" data-value="${dataVal}">
          <span class="item-text">${displayVal}</span>
          ${s.badge ? `<span class="item-badge">${s.badge}</span>` : ''}
        </div>
      `;
    });

    dropdown.innerHTML = html;
    dropdown.style.display = 'block';

    dropdown.querySelectorAll('.inty-autocomplete-item').forEach(el => {
      const handleSelect = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const selectedVal = el.getAttribute('data-value');
        applySuggestionToInput(input, selectedVal);
        hideDropdown();
      };
      el.addEventListener('pointerdown', handleSelect);
      el.addEventListener('mousedown', handleSelect);
    });
  }

  function applySuggestionToInput(input, val) {
    if (!input) return;
    input.value = val;

    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    if (input.id === 'google-custom-email') {
      if (typeof onGoogleModalEmailInput === 'function') onGoogleModalEmailInput(val);
    } else if (input.id === 'label-input-box-num' || input.id === 'label-input-box-total') {
      if (typeof updateBoxLabelText === 'function') updateBoxLabelText();
    } else if (input.id.startsWith('label-input-')) {
      if (typeof updateLiveLabelSheet === 'function') updateLiveLabelSheet();
    } else if (input.id.startsWith('form-org-') || input.id.startsWith('form-event-') || input.id === 'form-location') {
      if (typeof validateCurrentStep === 'function') validateCurrentStep();
    }

    input.focus();
  }

  function hideDropdown() {
    dropdown.style.display = 'none';
    activeInput = null;
    selectedIndex = -1;
  }

  const selector = 'input[list], textarea#label-input-event-name, textarea#label-input-address, input[type="email"], input[type="tel"], input#google-custom-name, input#google-custom-email, input#admin-email, input#form-org-name, input#form-org-id-document, input#form-org-email, input#form-org-whatsapp, input#form-org-insta-user, input#form-event-name, input#form-location, input#label-input-responsible-name, input#label-input-responsible-id, input#label-input-phone, input#label-input-box-num, input#label-input-box-total, input#label-input-box-subtitle';

  document.querySelectorAll(selector).forEach(input => {
    input.addEventListener('focus', () => showDropdownFor(input));
    input.addEventListener('input', () => showDropdownFor(input));
    input.addEventListener('click', () => showDropdownFor(input));
  });

  document.addEventListener('focusin', (e) => {
    if (e.target && e.target.matches && e.target.matches(selector)) {
      showDropdownFor(e.target);
    }
  });

  document.addEventListener('input', (e) => {
    if (e.target && e.target.matches && e.target.matches(selector)) {
      showDropdownFor(e.target);
    }
  });

  document.addEventListener('pointerdown', (e) => {
    if (dropdown && dropdown.style.display !== 'none') {
      if (!dropdown.contains(e.target) && e.target !== activeInput) {
        hideDropdown();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (dropdown && dropdown.style.display !== 'none') {
      const items = dropdown.querySelectorAll('.inty-autocomplete-item');
      if (e.key === 'Escape') {
        hideDropdown();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        items.forEach((it, idx) => it.classList.toggle('active', idx === selectedIndex));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        items.forEach((it, idx) => it.classList.toggle('active', idx === selectedIndex));
      } else if (e.key === 'Enter' && selectedIndex >= 0 && items[selectedIndex]) {
        e.preventDefault();
        const selectedVal = items[selectedIndex].getAttribute('data-value');
        applySuggestionToInput(activeInput, selectedVal);
        hideDropdown();
      }
    }
  });

  window.addEventListener('resize', () => {
    if (activeInput && dropdown.style.display !== 'none') {
      showDropdownFor(activeInput);
    }
  });

  window.addEventListener('scroll', () => {
    if (activeInput && dropdown.style.display !== 'none') {
      showDropdownFor(activeInput);
    }
  }, true);
}

// ==========================================
// 2. INICIALIZACIÓN Y PERSISTENCIA
// ==========================================

function initApp() {
  // Limpiar posibles leads de prueba residuales de versiones anteriores
  try {
    const rawLeads = localStorage.getItem(INTY_STORAGE_KEYS.LEADS);
    if (rawLeads) {
      const parsedLeads = JSON.parse(rawLeads);
      const cleanedLeads = parsedLeads.filter(l => 
        l.email !== 'valeria.morales@gmail.com' && 
        l.email !== 'camila.dasilva@gmail.com' && 
        l.email !== 'mariana.betancourt@eventosvzla.com'
      );
      localStorage.setItem(INTY_STORAGE_KEYS.LEADS, JSON.stringify(cleanedLeads));
    } else {
      localStorage.setItem(INTY_STORAGE_KEYS.LEADS, JSON.stringify(DEFAULT_LEADS));
    }
  } catch(e) {
    localStorage.setItem(INTY_STORAGE_KEYS.LEADS, JSON.stringify([]));
  }

  // Cargar base de solicitudes para la 4ta sección administrativa
  const storedReqs = localStorage.getItem(INTY_STORAGE_KEYS.REQUESTS);
  if (!storedReqs) {
    localStorage.setItem(INTY_STORAGE_KEYS.REQUESTS, JSON.stringify(DEFAULT_REQUESTS));
  } else {
    try {
      const parsedReqs = JSON.parse(storedReqs);
      let updated = false;
      parsedReqs.forEach(r => {
        if (r.organizer && !r.organizer.idDocument) {
          if (r.id === 'INTY-2026-0044') r.organizer.idDocument = 'V- 32196229';
          else if (r.id === 'INTY-2026-0043') r.organizer.idDocument = 'V- 22894105';
          else if (r.id === 'INTY-2026-0042') r.organizer.idDocument = 'V- 25412890';
          else r.organizer.idDocument = 'V- 32196229';
          updated = true;
        }
      });
      if (updated) {
        localStorage.setItem(INTY_STORAGE_KEYS.REQUESTS, JSON.stringify(parsedReqs));
      }
    } catch(e) {}
  }
  
  // Revisar si hay sesión activa y sincronizar perfil
  const savedUser = localStorage.getItem(INTY_STORAGE_KEYS.CURRENT_USER);
  if (savedUser) {
    try {
      AppState.currentUser = JSON.parse(savedUser);
      if (AppState.currentUser && AppState.currentUser.role !== 'admin') {
        const savedProfile = getUserSavedProfile(AppState.currentUser.email);
        if (savedProfile) {
          AppState.currentUser = { ...savedProfile, ...AppState.currentUser };
        }
        AppState.wizardFormData.organizerName = AppState.currentUser.name || '';
        AppState.wizardFormData.organizerEmail = AppState.currentUser.email || '';
        AppState.wizardFormData.organizerIdDocument = AppState.currentUser.idDocument || '';
        AppState.wizardFormData.organizerWhatsapp = AppState.currentUser.phone || '';
        AppState.wizardFormData.organizerInstagramUser = AppState.currentUser.instaUser || '';
        AppState.wizardFormData.organizerInstagramUrl = AppState.currentUser.instaLink || '';
      }
    } catch (e) {
      AppState.currentUser = null;
    }
  }

  // Configurar carrusel de Landing
  initLandingCarousel();

  // Renderizar cuentas guardadas exclusivamente en este computador
  renderDeviceSavedAccounts();

  // Inicializar catálogo y sincronización de etiquetado
  initLabelingSection();

  // Inicializar autocompletado y predicción universal con selección al instante
  initUniversalAutocomplete();

  // Determinar vista inicial
  if (AppState.currentUser) {
    if (AppState.currentUser.role === 'admin') {
      navigateTo('admin');
    } else {
      navigateTo('dashboard-events');
    }
  } else {
    navigateTo('landing');
  }

  // Renderizar componentes de navegación
  renderUserNav();
}

// Obtener listas frescas de Storage
function getLeads() {
  try {
    return JSON.parse(localStorage.getItem(INTY_STORAGE_KEYS.LEADS)) || [];
  } catch (e) {
    return [];
  }
}

function saveLeads(leads) {
  localStorage.setItem(INTY_STORAGE_KEYS.LEADS, JSON.stringify(leads));
}

function getRequests() {
  try {
    return JSON.parse(localStorage.getItem(INTY_STORAGE_KEYS.REQUESTS)) || [];
  } catch (e) {
    return [];
  }
}

function saveRequests(requests) {
  localStorage.setItem(INTY_STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
}

// ==========================================
// 3. ENRUTAMIENTO Y NAVEGACIÓN SPA
// ==========================================

function navigateTo(viewName) {
  // 1. Bloqueo estricto para invitados / usuarios sin ingresar:
  // No pueden ingresar a ninguna otra sección sin haber ingresado su correo y datos
  if (!AppState.currentUser && viewName !== 'landing') {
    alert('Acceso restringido: Para poder ingresar a la sección de Eventos o a la Solicitud de Eventos, primero debes ingresar tu nombre y correo en la página principal.');
    AppState.activeView = 'landing';
    const landingEl = document.getElementById('view-landing');
    if (landingEl) landingEl.classList.remove('hidden');
    const dash = document.getElementById('view-dashboard');
    if (dash) dash.classList.add('hidden');
    const admin = document.getElementById('view-admin');
    if (admin) admin.classList.add('hidden');
    
    // Enfocar el input de correo con animación
    setTimeout(() => {
      const emailInput = document.getElementById('user-login-email');
      if (emailInput) {
        emailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        emailInput.focus();
        emailInput.classList.add('ring-2', 'ring-[#d87a86]');
        setTimeout(() => emailInput.classList.remove('ring-2', 'ring-[#d87a86]'), 2000);
      }
    }, 200);
    return;
  }

  // 2. Protección estricta: sólo el administrador autenticado puede ingresar a la 4ta sección
  if (viewName === 'admin') {
    if (AppState.currentUser?.role !== 'admin') {
      alert('Acceso no autorizado: El usuario común no puede ingresar a esta sección. Esta página es exclusiva para el Administrador mediante el ingreso de su clave.');
      navigateTo(AppState.currentUser ? 'dashboard-events' : 'landing');
      return;
    }
  }

  // 3. Verificación para el Wizard: el administrador no debe ver el registro del formulario
  if (viewName === 'dashboard-wizard') {
    if (AppState.currentUser?.role === 'admin') {
      showToast('El administrador no realiza registros de eventos. Mostrando la 4ta sección de resultados.', 'info');
      navigateTo('admin');
      return;
    }
  }

  // 4. Protección estricta: sólo el administrador autenticado puede ingresar a la sección de Logística
  if (viewName === 'logistics') {
    if (AppState.currentUser?.role !== 'admin') {
      alert('Acceso no autorizado: La sección de Logística es de uso interno y exclusivo para el Administrador.');
      navigateTo(AppState.currentUser ? 'dashboard-events' : 'landing');
      return;
    }
  }

  // 5. Protección estricta: sólo el administrador autenticado puede ingresar a la sección de Etiquetado
  if (viewName === 'labeling') {
    if (AppState.currentUser?.role !== 'admin') {
      alert('Acceso no autorizado: La sección de Etiquetado es de uso interno y exclusivo para el Administrador.');
      navigateTo(AppState.currentUser ? 'dashboard-events' : 'landing');
      return;
    }
  }

  AppState.activeView = viewName;
  
  // Ocultar todas las vistas
  const views = ['view-landing', 'view-dashboard', 'view-admin', 'view-logistics', 'view-labeling'];
  views.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  // Ocultar sub-vistas del Dashboard
  const dashEvents = document.getElementById('subview-events');
  const dashWizard = document.getElementById('subview-wizard');
  const dashSuccess = document.getElementById('subview-success');
  if (dashEvents) dashEvents.classList.add('hidden');
  if (dashWizard) dashWizard.classList.add('hidden');
  if (dashSuccess) dashSuccess.classList.add('hidden');

  // Mostrar vista correspondiente
  if (viewName === 'landing') {
    const el = document.getElementById('view-landing');
    if (el) el.classList.remove('hidden');
    renderUserNav();
  } else if (viewName === 'dashboard-events') {
    const dash = document.getElementById('view-dashboard');
    if (dash) dash.classList.remove('hidden');
    if (dashEvents) dashEvents.classList.remove('hidden');
    updateDashboardTabs('events');
  } else if (viewName === 'dashboard-wizard') {
    const dash = document.getElementById('view-dashboard');
    if (dash) dash.classList.remove('hidden');
    if (dashWizard) dashWizard.classList.remove('hidden');
    updateDashboardTabs('wizard');
    initWizard();
  } else if (viewName === 'dashboard-success') {
    const dash = document.getElementById('view-dashboard');
    if (dash) dash.classList.remove('hidden');
    if (dashSuccess) dashSuccess.classList.remove('hidden');
    updateDashboardTabs('wizard');
  } else if (viewName === 'admin') {
    const el = document.getElementById('view-admin');
    if (el) el.classList.remove('hidden');
    updateDashboardTabs('admin');
    renderAdminDashboard();
  } else if (viewName === 'logistics') {
    const el = document.getElementById('view-logistics');
    if (el) el.classList.remove('hidden');
    updateDashboardTabs('logistics');
    initLogisticsSection();
  } else if (viewName === 'labeling') {
    const el = document.getElementById('view-labeling');
    if (el) el.classList.remove('hidden');
    updateDashboardTabs('labeling');
    initLabelingSection();
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateDashboardTabs(activeTab) {
  const tabEvents = document.getElementById('tab-btn-events');
  const tabWizard = document.getElementById('tab-btn-wizard');
  const tabAdmin = document.getElementById('tab-btn-admin');
  const tabLogistics = document.getElementById('tab-btn-logistics');
  const tabLabeling = document.getElementById('tab-btn-labeling');
  
  const mTabEvents = document.getElementById('mobile-tab-btn-events');
  const mTabWizard = document.getElementById('mobile-tab-btn-wizard');
  const mTabAdmin = document.getElementById('mobile-tab-btn-admin');
  const mTabLogistics = document.getElementById('mobile-tab-btn-logistics');
  const mTabLabeling = document.getElementById('mobile-tab-btn-labeling');

  // Reset desktop tabs
  [tabEvents, tabWizard, tabAdmin, tabLogistics, tabLabeling].forEach(tab => {
    if (tab) {
      tab.classList.remove('border-b-2', 'border-[#d87a86]', 'text-[#d87a86]', 'font-bold');
      tab.classList.add('text-[#7b8893]', 'font-medium');
    }
  });

  // Reset mobile tabs
  [mTabEvents, mTabWizard, mTabAdmin, mTabLogistics, mTabLabeling].forEach(tab => {
    if (tab) {
      tab.classList.remove('text-[#d87a86]', 'font-bold');
      tab.classList.add('text-gray-500');
    }
  });

  if (activeTab === 'events') {
    if (tabEvents) {
      tabEvents.classList.add('border-b-2', 'border-[#d87a86]', 'text-[#d87a86]', 'font-bold');
      tabEvents.classList.remove('text-[#7b8893]', 'font-medium');
    }
    if (mTabEvents) {
      mTabEvents.classList.add('text-[#d87a86]', 'font-bold');
      mTabEvents.classList.remove('text-gray-500');
    }
  } else if (activeTab === 'wizard') {
    if (tabWizard) {
      tabWizard.classList.add('border-b-2', 'border-[#d87a86]', 'text-[#d87a86]', 'font-bold');
      tabWizard.classList.remove('text-[#7b8893]', 'font-medium');
    }
    if (mTabWizard) {
      mTabWizard.classList.add('text-[#d87a86]', 'font-bold');
      mTabWizard.classList.remove('text-gray-500');
    }
  } else if (activeTab === 'admin') {
    if (tabAdmin) {
      tabAdmin.classList.add('border-b-2', 'border-[#d87a86]', 'text-[#d87a86]', 'font-bold');
      tabAdmin.classList.remove('text-[#7b8893]', 'font-medium');
    }
    if (mTabAdmin) {
      mTabAdmin.classList.add('text-[#d87a86]', 'font-bold');
      mTabAdmin.classList.remove('text-gray-500');
    }
  } else if (activeTab === 'logistics') {
    if (tabLogistics) {
      tabLogistics.classList.add('border-b-2', 'border-[#d87a86]', 'text-[#d87a86]', 'font-bold');
      tabLogistics.classList.remove('text-[#7b8893]', 'font-medium');
    }
    if (mTabLogistics) {
      mTabLogistics.classList.add('text-[#d87a86]', 'font-bold');
      mTabLogistics.classList.remove('text-gray-500');
    }
  } else if (activeTab === 'labeling') {
    if (tabLabeling) {
      tabLabeling.classList.add('border-b-2', 'border-[#d87a86]', 'text-[#d87a86]', 'font-bold');
      tabLabeling.classList.remove('text-[#7b8893]', 'font-medium');
    }
    if (mTabLabeling) {
      mTabLabeling.classList.add('text-[#d87a86]', 'font-bold');
      mTabLabeling.classList.remove('text-gray-500');
    }
  }
}

// ==========================================
// 4. AUTENTICACIÓN GOOGLE & ADMIN
// ==========================================

// --- GESTIÓN DE CUENTAS GUARDADAS EN ESTE DISPOSITIVO ---
// Regla: No mostrar correos de otros usuarios a menos que hayan iniciado sesión en este equipo

function getDeviceAccounts() {
  // Privacidad estricta: No exponer cuentas previas en pantallas compartidas
  return [];
}

function saveDeviceAccount(profile) {
  // Privacidad estricta: No almacenar listas públicas de cuentas en este dispositivo
  try {
    localStorage.removeItem(INTY_STORAGE_KEYS.DEVICE_ACCOUNTS);
  } catch (e) {}
}

function removeSavedDeviceAccount(event, email) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  try {
    localStorage.removeItem(INTY_STORAGE_KEYS.DEVICE_ACCOUNTS);
    if (email) {
      localStorage.removeItem('inty_user_profile_' + email.trim().toLowerCase());
    }
  } catch (e) {}
  renderDeviceSavedAccounts();
  showToast('Datos de sesión limpiados con éxito.', 'info');
}

// ==========================================================================
// AUTOCARGA Y GESTIÓN DE DATOS DEL USUARIO (PERFIL GOOGLE & FORMULARIOS)
// ==========================================================================
function getUserSavedProfile(email) {
  if (!email) return null;
  const cleanEmail = email.trim().toLowerCase();

  // 1. Perfil específico guardado en localStorage
  try {
    const raw = localStorage.getItem('inty_user_profile_' + cleanEmail);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  // 2. Solicitudes anteriores radicadas por este correo
  const requests = getRequests();
  const req = requests.find(r => r.organizer?.email?.toLowerCase() === cleanEmail);
  if (req && req.organizer) {
    return {
      name: req.organizer.name || '',
      email: cleanEmail,
      idDocument: req.organizer.idDocument || '',
      phone: req.organizer.whatsapp || '',
      instaUser: req.organizer.instagramUser || '',
      instaLink: req.organizer.instagramUrl || ''
    };
  }

  // 3. Registro en base de datos de Leads
  const leads = getLeads();
  const lead = leads.find(l => l.email?.toLowerCase() === cleanEmail);
  if (lead) {
    return {
      name: lead.name || '',
      email: cleanEmail,
      idDocument: lead.idDocument || '',
      phone: (lead.phone && lead.phone !== 'Pendiente en formulario') ? lead.phone : '',
      instaUser: lead.instaUser || '',
      instaLink: lead.instaLink || ''
    };
  }

  // 4. Perfiles de administradores si aplican
  const admin = AUTHORIZED_ADMIN_ACCOUNTS.find(a => a.email.toLowerCase() === cleanEmail);
  if (admin) {
    return {
      name: admin.name,
      email: cleanEmail,
      idDocument: 'V- 32196229',
      phone: '04126681611',
      instaUser: '@intylact',
      instaLink: 'https://instagram.com/intylact'
    };
  }

  return null;
}

function saveUserSavedProfile(email, data) {
  if (!email || !data) return;
  const cleanEmail = email.trim().toLowerCase();
  try {
    const current = getUserSavedProfile(cleanEmail) || {};
    const merged = { ...current, ...data, email: cleanEmail };
    localStorage.setItem('inty_user_profile_' + cleanEmail, JSON.stringify(merged));
  } catch (e) {}
}

function onGoogleModalEmailInput(email) {
  if (!email) return;
  const nameInput = document.getElementById('google-custom-name');
  const profile = getUserSavedProfile(email);
  if (profile && profile.name && nameInput) {
    if (!nameInput.value.trim() || nameInput.value === 'Tu Nombre y Apellido') {
      nameInput.value = profile.name;
    }
  }
}

function populateOrganizerStepInputs() {
  const user = AppState.currentUser;
  const email = (user && user.email) || AppState.wizardFormData.organizerEmail || '';
  const savedProfile = getUserSavedProfile(email);

  const nameInput = document.getElementById('form-org-name');
  const idDocInput = document.getElementById('form-org-id-document');
  const emailInput = document.getElementById('form-org-email');
  const phoneInput = document.getElementById('form-org-whatsapp');
  const instaUserInput = document.getElementById('form-org-insta-user');
  const instaLinkInput = document.getElementById('form-org-insta-link');

  const finalName = (user && user.name) || AppState.wizardFormData.organizerName || savedProfile?.name || '';
  const finalEmail = (user && user.email) || AppState.wizardFormData.organizerEmail || savedProfile?.email || '';
  const finalId = AppState.wizardFormData.organizerIdDocument || savedProfile?.idDocument || (user && user.idDocument) || '';
  const finalPhone = AppState.wizardFormData.organizerWhatsapp || savedProfile?.phone || (user && user.phone) || '';
  const finalInstaUser = AppState.wizardFormData.organizerInstagramUser || savedProfile?.instaUser || (user && user.instaUser) || '';
  const finalInstaLink = AppState.wizardFormData.organizerInstagramUrl || savedProfile?.instaLink || (user && user.instaLink) || (finalInstaUser ? `https://instagram.com/${finalInstaUser.replace('@','')}` : '');

  if (nameInput && !nameInput.value.trim() && finalName) nameInput.value = finalName;
  if (idDocInput && !idDocInput.value.trim() && finalId) idDocInput.value = finalId;
  if (emailInput && !emailInput.value.trim() && finalEmail) emailInput.value = finalEmail;
  if (phoneInput && !phoneInput.value.trim() && finalPhone) phoneInput.value = finalPhone;
  if (instaUserInput && !instaUserInput.value.trim() && finalInstaUser) instaUserInput.value = finalInstaUser;
  if (instaLinkInput && !instaLinkInput.value.trim() && finalInstaLink) instaLinkInput.value = finalInstaLink;

  if (typeof validateCurrentStep === 'function') validateCurrentStep();
}

function loginWithSavedDeviceAccount(email) {
  const accounts = getDeviceAccounts();
  const acc = accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
  if (!acc) return;

  const savedProfile = getUserSavedProfile(email);

  const userProfile = {
    id: acc.id,
    name: acc.name,
    email: acc.email,
    idDocument: (savedProfile && savedProfile.idDocument) || acc.idDocument || '',
    phone: (savedProfile && (savedProfile.phone || savedProfile.whatsapp)) || acc.phone || '',
    instaUser: (savedProfile && savedProfile.instaUser) || acc.instaUser || '',
    instaLink: (savedProfile && savedProfile.instaLink) || acc.instaLink || '',
    photo: acc.photo,
    role: 'user'
  };

  AppState.currentUser = userProfile;
  localStorage.setItem(INTY_STORAGE_KEYS.CURRENT_USER, JSON.stringify(userProfile));

  // Actualizar marca de último acceso y guardar perfil
  saveDeviceAccount(userProfile);
  saveUserSavedProfile(email, userProfile);

  // Precargar en Wizard
  AppState.wizardFormData.organizerName = userProfile.name;
  AppState.wizardFormData.organizerEmail = userProfile.email;
  AppState.wizardFormData.organizerIdDocument = userProfile.idDocument;
  AppState.wizardFormData.organizerWhatsapp = userProfile.phone;
  AppState.wizardFormData.organizerInstagramUser = userProfile.instaUser;
  AppState.wizardFormData.organizerInstagramUrl = userProfile.instaLink;

  closeGoogleLoginModal();
  renderUserNav();
  renderDeviceSavedAccounts();
  showToast(`¡Bienvenida/o de nuevo, ${userProfile.name}! Tus datos se han cargado automáticamente.`);
  navigateTo('dashboard-events');
}

function renderDeviceSavedAccounts() {
  // Privacidad estricta: No exponer cuentas ni datos de otros usuarios
  try {
    localStorage.removeItem(INTY_STORAGE_KEYS.DEVICE_ACCOUNTS);
  } catch (e) {}

  const landingBox = document.getElementById('device-saved-accounts-box');
  const landingList = document.getElementById('device-saved-accounts-list');
  const modalBox = document.getElementById('modal-saved-accounts-container');
  const modalList = document.getElementById('modal-saved-accounts-list');

  if (landingBox) landingBox.classList.add('hidden');
  if (landingList) landingList.innerHTML = '';
  if (modalBox) modalBox.classList.add('hidden');
  if (modalList) modalList.innerHTML = '';
}

// --- FORMULARIO DIRECTO EN LANDING PAGE (CON AUTORRELLENO) ---
function handleUserDirectLogin(event) {
  if (event) event.preventDefault();
  const nameInput = document.getElementById('user-login-name');
  const emailInput = document.getElementById('user-login-email');

  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim().toLowerCase() : '';

  if (!name) {
    alert('Por favor, ingresa tu nombre completo para identificarte.');
    if (nameInput) nameInput.focus();
    return;
  }

  if (!email) {
    alert('Por favor, ingresa tu correo electrónico para acceder al portal.');
    if (emailInput) emailInput.focus();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Por favor, ingresa un correo electrónico válido (ejemplo: nombre@gmail.com).');
    if (emailInput) emailInput.focus();
    return;
  }

  // Perfil del usuario
  const userProfile = {
    id: 'lead-' + Date.now(),
    name: name,
    email: email,
    photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d87a86&color=fff&bold=true`,
    role: 'user'
  };

  // Guardar cuenta registrada exclusivamente en este computador
  saveDeviceAccount(userProfile);

  // Registrar Lead en la base de datos de administración si no existe
  const leads = getLeads();
  const existingLeadIndex = leads.findIndex(l => l.email.toLowerCase() === email);
  if (existingLeadIndex === -1) {
    leads.unshift({
      id: userProfile.id,
      googleId: 'google-' + Math.floor(Math.random() * 1000000000),
      name: userProfile.name,
      email: userProfile.email,
      photo: userProfile.photo,
      createdAt: new Date().toISOString(),
      phone: 'Pendiente en formulario',
      requestsCount: 0
    });
    saveLeads(leads);
  }

  // Guardar sesión activa
  AppState.currentUser = userProfile;
  localStorage.setItem(INTY_STORAGE_KEYS.CURRENT_USER, JSON.stringify(userProfile));

  // Precargar datos del organizador en el formulario Wizard
  AppState.wizardFormData.organizerName = userProfile.name;
  AppState.wizardFormData.organizerEmail = userProfile.email;

  // Actualizar UI y entrar a la sección de Eventos
  renderUserNav();
  renderDeviceSavedAccounts();
  showToast(`¡Bienvenida/o, ${userProfile.name}! Has iniciado sesión.`);
  navigateTo('dashboard-events');
}

// --- FORMULARIO EN MODAL DE GOOGLE OAUTH ---
function handleModalGoogleLogin(event) {
  if (event) event.preventDefault();
  const nameInput = document.getElementById('google-custom-name');
  const emailInput = document.getElementById('google-custom-email');

  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim().toLowerCase() : '';

  if (!name || !email) {
    alert('Por favor, completa tu nombre y correo para continuar.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Por favor ingresa un correo electrónico válido.');
    return;
  }

  const savedProfile = getUserSavedProfile(email);

  const userProfile = {
    id: (savedProfile && savedProfile.id) || ('lead-' + Date.now()),
    name: name,
    email: email,
    idDocument: (savedProfile && savedProfile.idDocument) || '',
    phone: (savedProfile && (savedProfile.phone || savedProfile.whatsapp)) || '',
    instaUser: (savedProfile && savedProfile.instaUser) || '',
    instaLink: (savedProfile && savedProfile.instaLink) || '',
    photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d87a86&color=fff&bold=true`,
    role: 'user'
  };

  saveDeviceAccount(userProfile);
  saveUserSavedProfile(email, userProfile);

  const leads = getLeads();
  const existingLeadIndex = leads.findIndex(l => l.email.toLowerCase() === email);
  if (existingLeadIndex === -1) {
    leads.unshift({
      id: userProfile.id,
      googleId: 'google-' + Math.floor(Math.random() * 1000000000),
      name: userProfile.name,
      email: userProfile.email,
      idDocument: userProfile.idDocument,
      photo: userProfile.photo,
      createdAt: new Date().toISOString(),
      phone: userProfile.phone || 'Pendiente en formulario',
      requestsCount: 0
    });
    saveLeads(leads);
  }

  AppState.currentUser = userProfile;
  localStorage.setItem(INTY_STORAGE_KEYS.CURRENT_USER, JSON.stringify(userProfile));

  AppState.wizardFormData.organizerName = userProfile.name;
  AppState.wizardFormData.organizerEmail = userProfile.email;
  AppState.wizardFormData.organizerIdDocument = userProfile.idDocument;
  AppState.wizardFormData.organizerWhatsapp = userProfile.phone;
  AppState.wizardFormData.organizerInstagramUser = userProfile.instaUser;
  AppState.wizardFormData.organizerInstagramUrl = userProfile.instaLink;

  closeGoogleLoginModal();
  renderUserNav();
  renderDeviceSavedAccounts();
  showToast(`¡Bienvenida/o, ${userProfile.name}! Has iniciado sesión con Google.`);
  navigateTo('dashboard-events');
}

function openGoogleLoginModal() {
  const modal = document.getElementById('modal-google-auth');
  renderDeviceSavedAccounts();
  if (modal) modal.classList.remove('hidden');
  const emailInput = document.getElementById('google-custom-email');
  const nameInput = document.getElementById('google-custom-name');
  if (emailInput) {
    emailInput.value = '';
    setTimeout(() => {
      try { emailInput.focus(); } catch (e) {}
    }, 120);
  }
  if (nameInput) nameInput.value = '';
}

function closeGoogleLoginModal() {
  const modal = document.getElementById('modal-google-auth');
  if (modal) modal.classList.add('hidden');
}

function loginWithGoogle(accountType = 'custom') {
  // Enfocar directamente el campo de correo con autorrelleno
  const emailInput = document.getElementById('user-login-email');
  if (emailInput) {
    emailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    emailInput.focus();
  } else {
    openGoogleLoginModal();
  }
}

// --- ACCESO ADMINISTRADOR ---

function openAdminLoginModal() {
  const modal = document.getElementById('modal-admin-auth');
  const emailInput = document.getElementById('admin-email');
  const passInput = document.getElementById('admin-password');
  
  if (emailInput) emailInput.value = '';
  if (passInput) {
    passInput.value = '';
    passInput.type = 'password';
  }
  const icon = document.getElementById('toggle-pwd-icon');
  if (icon) {
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  }
  if (modal) modal.classList.remove('hidden');
}

function closeAdminLoginModal() {
  const modal = document.getElementById('modal-admin-auth');
  const passInput = document.getElementById('admin-password');
  if (passInput) {
    passInput.value = '';
    passInput.type = 'password';
  }
  if (modal) modal.classList.add('hidden');
}

function toggleAdminPasswordVisibility() {
  const passInput = document.getElementById('admin-password');
  const icon = document.getElementById('toggle-pwd-icon');
  if (!passInput) return;

  if (passInput.type === 'password') {
    passInput.type = 'text';
    if (icon) {
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  } else {
    passInput.type = 'password';
    if (icon) {
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    }
  }
}

function handleAdminLogin(event) {
  event.preventDefault();
  const emailInput = document.getElementById('admin-email').value.trim().toLowerCase();
  const passInput = document.getElementById('admin-password').value.trim();

  // Buscar coincidencia en las cuentas autorizadas de administrador
  const matchedAdmin = AUTHORIZED_ADMIN_ACCOUNTS.find(acc => 
    acc.email.toLowerCase() === emailInput && 
    acc.passwords.includes(passInput)
  );

  if (matchedAdmin) {
    const adminUser = {
      id: 'admin-' + matchedAdmin.email.split('@')[0],
      name: matchedAdmin.name,
      email: matchedAdmin.email,
      photo: matchedAdmin.photo || 'BANNER.jpeg',
      role: 'admin'
    };
    AppState.currentUser = adminUser;
    localStorage.setItem(INTY_STORAGE_KEYS.CURRENT_USER, JSON.stringify(adminUser));
    closeAdminLoginModal();
    renderUserNav();
    showToast(`¡Bienvenido/a ${matchedAdmin.name}! Sesión de Administrador iniciada.`);
    navigateTo('admin');
  } else {
    alert('Acceso no autorizado: Solo administradores autorizados pueden acceder a este panel. Verifica tu correo corporativo y contraseña.');
  }
}

function logout() {
  AppState.currentUser = null;
  localStorage.removeItem(INTY_STORAGE_KEYS.CURRENT_USER);
  renderUserNav();
  renderDeviceSavedAccounts();
  showToast('Has cerrado sesión correctamente.');
  navigateTo('landing');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderUserNav() {
  const user = AppState.currentUser;
  
  // Elementos de encabezado
  const landingActions = document.getElementById('nav-landing-actions');
  const userProfile = document.getElementById('nav-user-profile');
  const userTabs = document.getElementById('nav-user-tabs');
  const mobileTabs = document.getElementById('mobile-user-tabs');

  // Pestañas desktop
  const tabEvents = document.getElementById('tab-btn-events');
  const tabWizard = document.getElementById('tab-btn-wizard');
  const tabAdmin = document.getElementById('tab-btn-admin');
  const tabLogistics = document.getElementById('tab-btn-logistics');
  const tabLabeling = document.getElementById('tab-btn-labeling');

  // Pestañas móviles
  const mTabEvents = document.getElementById('mobile-tab-btn-events');
  const mTabWizard = document.getElementById('mobile-tab-btn-wizard');
  const mTabAdmin = document.getElementById('mobile-tab-btn-admin');
  const mTabLogistics = document.getElementById('mobile-tab-btn-logistics');
  const mTabLabeling = document.getElementById('mobile-tab-btn-labeling');

  // Controles de llamadas a la acción en la sección Eventos
  const dashTopCtaBtn = document.getElementById('dash-top-cta-btn');
  const dashTopCtaIcon = document.getElementById('dash-top-cta-icon');
  const dashTopCtaText = document.getElementById('dash-top-cta-text');
  const dashBottomUserCta = document.getElementById('dash-bottom-user-cta');
  const dashBottomAdminCta = document.getElementById('dash-bottom-admin-cta');

  // Datos del perfil
  const userAvatar = document.getElementById('nav-user-avatar');
  const userName = document.getElementById('nav-user-name');
  const userEmail = document.getElementById('nav-user-email');
  const welcomeTitle = document.getElementById('dash-welcome-user');

  if (user) {
    if (landingActions) {
      landingActions.classList.add('hidden');
      landingActions.style.display = 'none';
    }
    if (userProfile) {
      userProfile.classList.remove('hidden');
      userProfile.style.display = 'flex';
    }
    if (userTabs) {
      userTabs.classList.remove('hidden');
      userTabs.style.display = 'flex';
    }
    if (mobileTabs) {
      mobileTabs.classList.remove('hidden');
      if (window.innerWidth < 768) {
        mobileTabs.style.display = 'flex';
      } else {
        mobileTabs.style.display = 'none';
      }
    }
    document.body.classList.add('has-mobile-nav');

    if (userAvatar) userAvatar.src = user.photo;
    if (userName) userName.textContent = user.name;
    if (userEmail) userEmail.textContent = user.email;

    if (user.role === 'admin') {
      // ----------------------------------------------------
      // MODO ADMINISTRADOR:
      // 1. Ve la pestaña "Eventos" (normal).
      // 2. NO le sale el registro del formulario (wizard oculto).
      // 3. SOLO AQUÍ salen las pestañas administrativas:
      //    - Resultados y Leads
      //    - Logística
      //    - Etiquetado
      // ----------------------------------------------------
      if (userTabs) {
        userTabs.classList.remove('hidden');
        userTabs.style.display = 'flex';
      }
      if (mobileTabs) {
        mobileTabs.classList.remove('hidden');
        if (window.innerWidth < 768) {
          mobileTabs.style.display = 'flex';
        } else {
          mobileTabs.style.display = 'none';
        }
      }

      if (tabWizard) { tabWizard.classList.add('hidden'); tabWizard.style.display = 'none'; }
      if (mTabWizard) { mTabWizard.classList.add('hidden'); mTabWizard.style.display = 'none'; }

      if (tabEvents) { tabEvents.classList.remove('hidden'); tabEvents.style.display = ''; }
      if (mTabEvents) { mTabEvents.classList.remove('hidden'); mTabEvents.style.display = ''; }

      if (tabAdmin) { tabAdmin.classList.remove('hidden'); tabAdmin.style.display = ''; }
      if (mTabAdmin) { mTabAdmin.classList.remove('hidden'); mTabAdmin.style.display = ''; }

      if (tabLogistics) { tabLogistics.classList.remove('hidden'); tabLogistics.style.display = ''; }
      if (mTabLogistics) { mTabLogistics.classList.remove('hidden'); mTabLogistics.style.display = ''; }

      if (tabLabeling) { tabLabeling.classList.remove('hidden'); tabLabeling.style.display = ''; }
      if (mTabLabeling) { mTabLabeling.classList.remove('hidden'); mTabLabeling.style.display = ''; }

      if (welcomeTitle) welcomeTitle.textContent = `¡Hola, Administrador! (Dirección de Mercadeo) 🛡️`;

      // En la sección de Eventos, no le sale el botón de registrar evento
      if (dashTopCtaBtn && dashTopCtaText && dashTopCtaIcon) {
        dashTopCtaIcon.className = 'fa-solid fa-chart-pie';
        dashTopCtaText.textContent = 'Ver Resultados del Formulario y Leads';
        dashTopCtaBtn.onclick = () => navigateTo('admin');
      }

      if (dashBottomUserCta) dashBottomUserCta.classList.add('hidden');
      if (dashBottomAdminCta) dashBottomAdminCta.classList.remove('hidden');

    } else {
      // ----------------------------------------------------
      // MODO USUARIO GENERAL (GOOGLE OAUTH):
      // 1. Ve la pestaña "Eventos".
      // 2. Ve la pestaña "Solicitud de Eventos" (Formulario).
      // 3. NUNCA le salen las pestañas administrativas de Resultados, Logística ni Etiquetado.
      // 4. Perfil y botón Cerrar sesión SIEMPRE visibles en la cabecera.
      // ----------------------------------------------------
      if (userProfile) {
        userProfile.classList.remove('hidden');
        userProfile.style.display = 'flex';
      }
      if (landingActions) {
        landingActions.classList.add('hidden');
        landingActions.style.display = 'none';
      }
      if (userTabs) {
        userTabs.classList.remove('hidden');
        userTabs.style.display = 'flex';
      }
      if (mobileTabs) {
        mobileTabs.classList.remove('hidden');
        if (window.innerWidth < 768) {
          mobileTabs.style.display = 'flex';
        } else {
          mobileTabs.style.display = 'none';
        }
      }

      if (tabWizard) { tabWizard.classList.remove('hidden'); tabWizard.style.display = ''; }
      if (mTabWizard) { mTabWizard.classList.remove('hidden'); mTabWizard.style.display = ''; }

      if (tabEvents) { tabEvents.classList.remove('hidden'); tabEvents.style.display = ''; }
      if (mTabEvents) { mTabEvents.classList.remove('hidden'); mTabEvents.style.display = ''; }

      if (tabAdmin) { tabAdmin.classList.add('hidden'); tabAdmin.style.display = 'none'; }
      if (mTabAdmin) { mTabAdmin.classList.add('hidden'); mTabAdmin.style.display = 'none'; }

      if (tabLogistics) { tabLogistics.classList.add('hidden'); tabLogistics.style.display = 'none'; }
      if (mTabLogistics) { mTabLogistics.classList.add('hidden'); mTabLogistics.style.display = 'none'; }

      if (tabLabeling) { tabLabeling.classList.add('hidden'); tabLabeling.style.display = 'none'; }
      if (mTabLabeling) { mTabLabeling.classList.add('hidden'); mTabLabeling.style.display = 'none'; }

      if (welcomeTitle) welcomeTitle.textContent = `¡Hola, ${user.name.split(' ')[0]}! ✨`;

      // Botón normal para registrar solicitud
      if (dashTopCtaBtn && dashTopCtaText && dashTopCtaIcon) {
        dashTopCtaIcon.className = 'fa-solid fa-plus-circle';
        dashTopCtaText.textContent = 'Solicitar Alianza para Evento';
        dashTopCtaBtn.onclick = () => navigateTo('dashboard-wizard');
      }

      if (dashBottomUserCta) dashBottomUserCta.classList.remove('hidden');
      if (dashBottomAdminCta) dashBottomAdminCta.classList.add('hidden');
    }

  } else {
    // ----------------------------------------------------
    // PÁGINA PRINCIPAL (SIN SESIÓN):
    // Ninguna pestaña administrativa (Resultados, Logística, Etiquetado) ni de usuario
    // debe mostrarse en la barra superior de la página principal.
    // Solo saldrán al Administrador cuando inicie sesión.
    // ----------------------------------------------------
    if (landingActions) {
      landingActions.classList.remove('hidden');
      landingActions.style.display = '';
    }
    if (userProfile) {
      userProfile.classList.add('hidden');
      userProfile.style.display = 'none';
    }
    if (userTabs) {
      userTabs.classList.add('hidden');
      userTabs.style.display = 'none';
    }
    if (mobileTabs) {
      mobileTabs.classList.add('hidden');
      mobileTabs.style.display = 'none';
    }
    document.body.classList.remove('has-mobile-nav');

    if (tabAdmin) { tabAdmin.classList.add('hidden'); tabAdmin.style.display = 'none'; }
    if (mTabAdmin) { mTabAdmin.classList.add('hidden'); mTabAdmin.style.display = 'none'; }

    if (tabLogistics) { tabLogistics.classList.add('hidden'); tabLogistics.style.display = 'none'; }
    if (mTabLogistics) { mTabLogistics.classList.add('hidden'); mTabLogistics.style.display = 'none'; }

    if (tabLabeling) { tabLabeling.classList.add('hidden'); tabLabeling.style.display = 'none'; }
    if (mTabLabeling) { mTabLabeling.classList.add('hidden'); mTabLabeling.style.display = 'none'; }
  }
}

// --- MODAL DE CONEXIÓN MÓVIL DIRECTA (ANDROID, APPLE iOS, TABLETS, PC) ---
function updateMobileModalElements(targetUrl) {
  const urlInput = document.getElementById('mobile-connect-url-input');
  const directLinkAnchor = document.getElementById('mobile-direct-link-anchor');
  const whatsappShareBtn = document.getElementById('mobile-whatsapp-share-btn');
  const qrImg = document.getElementById('mobile-qr-image');

  if (urlInput) urlInput.value = targetUrl;
  if (directLinkAnchor) directLinkAnchor.href = targetUrl;
  if (whatsappShareBtn) {
    const shareText = encodeURIComponent(`¡Hola! Te comparto el enlace directo del Portal de Eventos INTYLACT® para abrir desde tu celular: ${targetUrl}`);
    whatsappShareBtn.href = `https://api.whatsapp.com/send?text=${shareText}`;
  }
  if (qrImg) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(targetUrl)}`;
  }
}

function openMobileConnectModal() {
  const modal = document.getElementById('modal-mobile-connect');

  // Si estamos en un dominio público (ej. trycloudflare), usar directamente ese origen
  let connectUrl = window.location.protocol.startsWith('http') ? window.location.origin : 'http://127.0.0.1:8080';
  updateMobileModalElements(connectUrl);

  // Consultar si hay un archivo tunnel_url.json activo con el enlace Cloudflare
  if (window.location.protocol.startsWith('http')) {
    fetch('tunnel_url.json?t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        if (data && data.url) {
          updateMobileModalElements(data.url);
        }
      })
      .catch(() => {});
  }

  if (modal) modal.classList.remove('hidden');
}

function closeMobileConnectModal() {
  const modal = document.getElementById('modal-mobile-connect');
  if (modal) modal.classList.add('hidden');
}

function copyMobileUrl() {
  const urlInput = document.getElementById('mobile-connect-url-input');
  if (!urlInput) return;
  urlInput.select();
  urlInput.setSelectionRange(0, 99999);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(urlInput.value).then(() => {
      showToast('¡Link directo copiado! Pégalo en WhatsApp o envíalo a tu celular para abrirlo.');
    }).catch(() => {
      document.execCommand('copy');
      showToast('¡Link directo copiado al portapapeles!');
    });
  } else {
    document.execCommand('copy');
    showToast('¡Link directo copiado al portapapeles!');
  }
}

// ==========================================
// 5. CARRUSEL DE LA LANDING (MISIÓN Y VISIÓN)
// ==========================================

const CAROUSEL_SLIDES = [
  {
    type: 'image',
    src: 'BANNER.jpeg',
    badge: 'La Marca #1 en Venezuela',
    title: 'INTYLACT® Cuidado Íntimo y Bienestar',
    subtitle: 'Líderes en salud, conexión y empoderamiento íntimo femenino, acompañando los mejores eventos del país.'
  },
  {
    type: 'image',
    src: 'MISION Y VISION.jpeg',
    badge: 'Propósito y Esencia',
    title: 'Nuestra Misión y Visión',
    subtitle: 'Brindar bienestar, salud y conexión íntima a las mujeres con productos formulados con amor, ciencia y conciencia.'
  },
  {
    type: 'image',
    src: 'EQUIPO CAMPEON INTYSQUAD.jpeg',
    badge: 'Impulso Femenino',
    title: 'Comunidad Empoderada',
    subtitle: 'Apoyamos el talento deportivo, el autocuidado y la salud integral femenina en cada rincón de Venezuela.'
  },
  {
    type: 'image',
    src: 'MONTAJE INTYSQUAD.jpeg',
    badge: 'Experiencias de Marca',
    title: 'Activaciones de Alto Impacto',
    subtitle: 'Stands interactivos, inflables emblemáticos y dinámicas que conectan profundamente con la mujer de hoy.'
  }
];

let currentSlideIdx = 0;
let carouselTimer = null;

function initLandingCarousel() {
  renderCarouselSlide(0);
  if (carouselTimer) clearInterval(carouselTimer);
  carouselTimer = setInterval(() => {
    currentSlideIdx = (currentSlideIdx + 1) % CAROUSEL_SLIDES.length;
    renderCarouselSlide(currentSlideIdx);
  }, 6000);
}

function renderCarouselSlide(idx) {
  const imgEl = document.getElementById('carousel-image');
  const badgeEl = document.getElementById('carousel-badge');
  const titleEl = document.getElementById('carousel-title');
  const subtitleEl = document.getElementById('carousel-subtitle');
  const indicatorsEl = document.getElementById('carousel-indicators');

  if (!imgEl) return;

  const slide = CAROUSEL_SLIDES[idx];
  imgEl.src = slide.src;
  if (badgeEl) badgeEl.textContent = slide.badge;
  if (titleEl) titleEl.textContent = slide.title;
  if (subtitleEl) subtitleEl.textContent = slide.subtitle;

  // Actualizar indicadores
  if (indicatorsEl) {
    indicatorsEl.innerHTML = '';
    CAROUSEL_SLIDES.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `h-2 rounded-full transition-all duration-300 ${i === idx ? 'w-8 bg-[#d87a86]' : 'w-2 bg-white/70'}`;
      dot.onclick = () => {
        currentSlideIdx = i;
        renderCarouselSlide(i);
      };
      indicatorsEl.appendChild(dot);
    });
  }
}

function nextCarouselSlide() {
  currentSlideIdx = (currentSlideIdx + 1) % CAROUSEL_SLIDES.length;
  renderCarouselSlide(currentSlideIdx);
}

function prevCarouselSlide() {
  currentSlideIdx = (currentSlideIdx - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length;
  renderCarouselSlide(currentSlideIdx);
}

// ==========================================
// 6. LIGHTBOX PARA GALERÍA DE EVENTOS
// ==========================================

function openLightbox(imageSrc, title, subtitle) {
  const modal = document.getElementById('modal-lightbox');
  const img = document.getElementById('lightbox-image');
  const titleEl = document.getElementById('lightbox-title');
  const subtitleEl = document.getElementById('lightbox-desc');

  if (modal && img) {
    img.src = imageSrc;
    if (titleEl) titleEl.textContent = title || 'Activación INTYLACT';
    if (subtitleEl) subtitleEl.textContent = subtitle || 'Experiencia corporativa de marca y bienestar femenino.';
    modal.classList.remove('hidden');
  }
}

function closeLightbox() {
  const modal = document.getElementById('modal-lightbox');
  if (modal) modal.classList.add('hidden');
}

// ==========================================
// 7. WIZARD DE SOLICITUD DE EVENTOS (PASO A PASO)
// ==========================================

function initWizard() {
  // Precargar usuario si existe
  if (AppState.currentUser) {
    if (!AppState.wizardFormData.organizerName) {
      AppState.wizardFormData.organizerName = AppState.currentUser.name;
    }
    if (!AppState.wizardFormData.organizerEmail) {
      AppState.wizardFormData.organizerEmail = AppState.currentUser.email;
    }
  }

  goToWizardStep(1);
}

function goToWizardStep(step) {
  AppState.wizardStep = step;

  // Actualizar indicadores visuales de pasos (1 a 6)
  for (let s = 1; s <= 6; s++) {
    const stepView = document.getElementById(`wizard-step-${s}`);
    const stepCircle = document.getElementById(`stepper-num-${s}`);
    const stepLabel = document.getElementById(`stepper-text-${s}`);

    if (stepView) {
      if (s === step) {
        stepView.classList.remove('hidden');
        stepView.classList.add('animate-fade-in');
      } else {
        stepView.classList.add('hidden');
      }
    }

    if (stepCircle) {
      if (s < step) {
        stepCircle.className = 'stepper-circle completed text-white bg-[#0f3042]';
        stepCircle.innerHTML = '<i class="fa-solid fa-check text-xs"></i>';
      } else if (s === step) {
        stepCircle.className = 'stepper-circle active text-white bg-[#d87a86] shadow-md ring-4 ring-[#faebee]';
        stepCircle.innerHTML = s;
      } else {
        stepCircle.className = 'stepper-circle inactive text-gray-400 bg-gray-200';
        stepCircle.innerHTML = s;
      }
    }

    if (stepLabel) {
      if (s === step) {
        stepLabel.classList.add('text-[#d87a86]', 'font-bold');
        stepLabel.classList.remove('text-gray-400');
      } else {
        stepLabel.classList.remove('text-[#d87a86]', 'font-bold');
        stepLabel.classList.add('text-gray-500');
      }
    }
  }

  // Actualizar barra de progreso superior
  const progressBar = document.getElementById('wizard-progress-bar');
  if (progressBar) {
    const percent = Math.round(((step - 1) / 5) * 100);
    progressBar.style.width = `${percent}%`;
  }

  // Actualizar indicador dinámico para smartphones (Android / iPhone)
  const mobileStepNum = document.getElementById('mobile-step-num');
  const mobileStepName = document.getElementById('mobile-step-name');
  const stepTitles = [
    'Políticas de Solicitud',
    'Confidencialidad Legal',
    'Datos del Organizador',
    'Detalles y Duración',
    'Alcance y Retorno',
    'Compromisos Finales'
  ];
  if (mobileStepNum) mobileStepNum.textContent = step;
  if (mobileStepName) mobileStepName.textContent = stepTitles[step - 1] || `Paso ${step}`;

  // Auto-cargar automáticamente todos los datos del organizador al ingresar al Paso 3
  if (step === 3) {
    populateOrganizerStepInputs();
  }

  // Ejecutar validación específica del paso actual para habilitar/deshabilitar botón Continuar
  validateCurrentStep();

  // Scroll al inicio del wizard
  const wizardContainer = document.getElementById('wizard-container');
  if (wizardContainer) {
    wizardContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ------------------------------------------
// Validaciones en tiempo real por Paso
// ------------------------------------------

function validateCurrentStep() {
  const step = AppState.wizardStep;
  let isValid = false;

  if (step === 1) {
    const chk = document.getElementById('step1-accept-policies');
    isValid = chk ? chk.checked : false;
    const btn = document.getElementById('step1-btn-next');
    if (btn) btn.disabled = !isValid;
  } 
  else if (step === 2) {
    const chk = document.getElementById('step2-accept-confidentiality');
    isValid = chk ? chk.checked : false;
    const btn = document.getElementById('step2-btn-next');
    if (btn) btn.disabled = !isValid;
  }
  else if (step === 3) {
    const name = document.getElementById('form-org-name')?.value.trim();
    const idDoc = document.getElementById('form-org-id-document')?.value.trim();
    const email = document.getElementById('form-org-email')?.value.trim();
    const whatsapp = document.getElementById('form-org-whatsapp')?.value.trim();
    const instaUrl = document.getElementById('form-org-insta-link')?.value.trim();
    const instaUser = document.getElementById('form-org-insta-user')?.value.trim();

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
    const isPhoneValid = (whatsapp || '').length >= 8;

    isValid = Boolean(name && idDoc && isEmailValid && isPhoneValid && instaUrl && instaUser);
    const btn = document.getElementById('step3-btn-next');
    if (btn) btn.disabled = !isValid;
  }
  else if (step === 4) {
    const eventName = document.getElementById('form-event-name')?.value.trim();
    const duration = document.querySelector('input[name="event-duration"]:checked')?.value || 'dia_unico';
    const location = document.getElementById('form-location')?.value.trim();
    const maps = document.getElementById('form-maps-link')?.value.trim();

    let detailsValid = false;
    if (duration === 'dia_unico') {
      const sDate = document.getElementById('form-single-date')?.value.trim();
      const sStart = document.getElementById('form-single-start')?.value.trim();
      const sEnd = document.getElementById('form-single-end')?.value.trim();
      detailsValid = Boolean(sDate && sStart && sEnd);
    } else {
      const mDate = document.getElementById('form-multi-date')?.value.trim();
      const mSchedule = document.getElementById('form-multi-schedule')?.value.trim();
      detailsValid = Boolean(mDate && mSchedule);
    }

    isValid = Boolean(eventName && detailsValid && location);
    const btn = document.getElementById('step4-btn-next');
    if (btn) btn.disabled = !isValid;
  }
  else if (step === 5) {
    const capacity = document.getElementById('form-capacity')?.value.trim();
    const selectedBoxes = Array.from(document.querySelectorAll('input[name="contributions"]:checked')).map(el => el.value);
    const hasOther = selectedBoxes.includes('Otro');
    const otherText = document.getElementById('form-other-contribution')?.value.trim();
    const brandReturn = document.getElementById('form-brand-return')?.value.trim();

    const otherValid = hasOther ? Boolean(otherText) : true;
    isValid = Boolean(capacity && selectedBoxes.length > 0 && otherValid && brandReturn);
    const btn = document.getElementById('step5-btn-next');
    if (btn) btn.disabled = !isValid;
  }
  else if (step === 6) {
    const c1 = document.getElementById('step6-check-rrss')?.checked;
    const c2 = document.getElementById('step6-check-10dias')?.checked;
    const c3 = document.getElementById('step6-check-confidencialidad')?.checked;

    isValid = Boolean(c1 && c2 && c3);
    const btn = document.getElementById('step6-btn-submit');
    if (btn) btn.disabled = !isValid;
  }
}

// ------------------------------------------
// Manejo de eventos del Paso 1 & 2 (Timestamps)
// ------------------------------------------

function onStep1CheckboxChange() {
  const chk = document.getElementById('step1-accept-policies');
  if (chk && chk.checked) {
    AppState.wizardFormData.politicasAcceptedAt = new Date().toISOString();
  } else {
    AppState.wizardFormData.politicasAcceptedAt = null;
  }
  validateCurrentStep();
}

function handleStep1Next() {
  if (!AppState.wizardFormData.politicasAcceptedAt) {
    AppState.wizardFormData.politicasAcceptedAt = new Date().toISOString();
  }
  goToWizardStep(2);
}

function onStep2CheckboxChange() {
  const chk = document.getElementById('step2-accept-confidentiality');
  if (chk && chk.checked) {
    AppState.wizardFormData.confidencialidadAcceptedAt = new Date().toISOString();
  } else {
    AppState.wizardFormData.confidencialidadAcceptedAt = null;
  }
  validateCurrentStep();
}

function handleStep2Next() {
  if (!AppState.wizardFormData.confidencialidadAcceptedAt) {
    AppState.wizardFormData.confidencialidadAcceptedAt = new Date().toISOString();
  }
  goToWizardStep(3);
}

// ------------------------------------------
// Manejo de eventos del Paso 3 (Organizador)
// ------------------------------------------

function handleStep3Next() {
  const orgName = document.getElementById('form-org-name').value.trim();
  const orgIdDoc = document.getElementById('form-org-id-document')?.value.trim() || '';
  const orgEmail = document.getElementById('form-org-email').value.trim();
  const orgWhatsapp = document.getElementById('form-org-whatsapp').value.trim();
  const orgInstaUrl = document.getElementById('form-org-insta-link').value.trim();
  const orgInstaUser = document.getElementById('form-org-insta-user').value.trim();

  AppState.wizardFormData.organizerName = orgName;
  AppState.wizardFormData.organizerIdDocument = orgIdDoc;
  AppState.wizardFormData.organizerEmail = orgEmail;
  AppState.wizardFormData.organizerWhatsapp = orgWhatsapp;
  AppState.wizardFormData.organizerInstagramUrl = orgInstaUrl;
  AppState.wizardFormData.organizerInstagramUser = orgInstaUser;

  const profileData = {
    name: orgName,
    idDocument: orgIdDoc,
    email: orgEmail,
    phone: orgWhatsapp,
    instaUser: orgInstaUser,
    instaLink: orgInstaUrl
  };

  if (AppState.currentUser) {
    Object.assign(AppState.currentUser, profileData);
    localStorage.setItem(INTY_STORAGE_KEYS.CURRENT_USER, JSON.stringify(AppState.currentUser));
  }
  saveUserSavedProfile(orgEmail, profileData);

  goToWizardStep(4);
}

// ------------------------------------------
// Manejo de eventos del Paso 4 (Condicionales y Archivos)
// ------------------------------------------

function onDurationChange() {
  const val = document.querySelector('input[name="event-duration"]:checked')?.value || 'dia_unico';
  AppState.wizardFormData.duration = val;

  const boxSingle = document.getElementById('conditional-dia-unico');
  const boxMulti = document.getElementById('conditional-multijornada');

  if (val === 'dia_unico') {
    if (boxSingle) boxSingle.classList.remove('hidden');
    if (boxMulti) boxMulti.classList.add('hidden');
  } else {
    if (boxSingle) boxSingle.classList.add('hidden');
    if (boxMulti) boxMulti.classList.remove('hidden');
  }
  validateCurrentStep();
}

function handleFilesSelected(event) {
  const filesList = event.target.files;
  if (!filesList) return;

  const currentCount = AppState.wizardFormData.files.length;
  const maxFiles = 5;
  const maxBytes = 100 * 1024 * 1024; // 100 MB

  for (let i = 0; i < filesList.length; i++) {
    if (AppState.wizardFormData.files.length >= maxFiles) {
      alert('Solo se permite un máximo de 5 archivos por solicitud.');
      break;
    }

    const file = filesList[i];
    if (file.size > maxBytes) {
      alert(`El archivo "${file.name}" supera el límite de 100MB.`);
      continue;
    }

    const fileId = 'file-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
    const fileObj = {
      id: fileId,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type || 'application/octet-stream',
      dataUrl: ''
    };

    // Leer archivo como Data URL para permitir descarga directa del administrador
    const reader = new FileReader();
    reader.onload = function(e) {
      fileObj.dataUrl = e.target.result;
      saveFileBlobToIndexedDB(fileId, file.name, fileObj.type, e.target.result);
    };
    reader.readAsDataURL(file);

    AppState.wizardFormData.files.push(fileObj);
  }

  renderUploadedFiles();
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function removeUploadedFile(fileId) {
  AppState.wizardFormData.files = AppState.wizardFormData.files.filter(f => f.id !== fileId);
  renderUploadedFiles();
}

function renderUploadedFiles() {
  const listEl = document.getElementById('uploaded-files-list');
  if (!listEl) return;

  listEl.innerHTML = '';
  if (AppState.wizardFormData.files.length === 0) {
    listEl.innerHTML = '<p class="text-xs text-gray-400 italic">No se han adjuntado archivos aún.</p>';
    return;
  }

  AppState.wizardFormData.files.forEach(f => {
    const item = document.createElement('div');
    item.className = 'flex items-center justify-between p-3 bg-white border border-[#ede6de] rounded-xl text-sm shadow-sm';
    
    let iconClass = 'fa-file-lines text-[#d87a86]';
    if (f.type.includes('image')) iconClass = 'fa-file-image text-emerald-500';
    if (f.type.includes('pdf')) iconClass = 'fa-file-pdf text-rose-500';

    item.innerHTML = `
      <div class="flex items-center gap-3 overflow-hidden">
        <i class="fa-solid ${iconClass} text-lg"></i>
        <div class="truncate">
          <p class="font-medium text-[#0f3042] truncate">${f.name}</p>
          <p class="text-xs text-gray-400">${f.size}</p>
        </div>
      </div>
      <button type="button" onclick="removeUploadedFile('${f.id}')" class="text-gray-400 hover:text-rose-500 p-1.5 transition-colors" title="Eliminar archivo">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    listEl.appendChild(item);
  });
}

function handleStep4Next() {
  AppState.wizardFormData.eventName = document.getElementById('form-event-name').value.trim();
  AppState.wizardFormData.duration = document.querySelector('input[name="event-duration"]:checked')?.value || 'dia_unico';
  AppState.wizardFormData.location = document.getElementById('form-location').value.trim();
  AppState.wizardFormData.mapsUrl = document.getElementById('form-maps-link').value.trim();

  if (AppState.wizardFormData.duration === 'dia_unico') {
    AppState.wizardFormData.singleDate = document.getElementById('form-single-date').value.trim();
    AppState.wizardFormData.singleStartTime = document.getElementById('form-single-start').value.trim();
    AppState.wizardFormData.singleEndTime = document.getElementById('form-single-end').value.trim();
  } else {
    AppState.wizardFormData.multiDate = document.getElementById('form-multi-date').value.trim();
    AppState.wizardFormData.multiSchedule = document.getElementById('form-multi-schedule').value.trim();
  }

  goToWizardStep(5);
}

// ------------------------------------------
// Manejo de eventos del Paso 5 (Alcance y Retorno)
// ------------------------------------------

function onContributionCheckboxChange() {
  const otherCheckbox = document.getElementById('contrib-otro');
  const otherInputContainer = document.getElementById('container-other-contribution');

  if (otherCheckbox && otherInputContainer) {
    if (otherCheckbox.checked) {
      otherInputContainer.classList.remove('hidden');
    } else {
      otherInputContainer.classList.add('hidden');
      const otherInput = document.getElementById('form-other-contribution');
      if (otherInput) otherInput.value = '';
    }
  }
  validateCurrentStep();
}

function handleStep5Next() {
  AppState.wizardFormData.capacity = document.getElementById('form-capacity').value.trim();
  
  const checkedBoxes = Array.from(document.querySelectorAll('input[name="contributions"]:checked')).map(el => el.value);
  AppState.wizardFormData.contributions = checkedBoxes;
  AppState.wizardFormData.otherContribution = document.getElementById('form-other-contribution')?.value.trim() || '';
  AppState.wizardFormData.brandReturn = document.getElementById('form-brand-return').value.trim();

  // Renderizar resumen en el Paso 6
  renderStep6Summary();

  goToWizardStep(6);
}

function renderStep6Summary() {
  const summaryBox = document.getElementById('step6-summary-box');
  if (!summaryBox) return;

  const data = AppState.wizardFormData;
  const isSingle = data.duration === 'dia_unico';

  summaryBox.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
      <div>
        <span class="text-gray-400 block">Evento:</span>
        <strong class="text-[#0f3042] text-sm">${data.eventName}</strong>
      </div>
      <div>
        <span class="text-gray-400 block">Organizador:</span>
        <strong class="text-[#0f3042]">${data.organizerName}</strong> (${data.organizerEmail})
      </div>
      <div>
        <span class="text-gray-400 block">Modalidad y Fecha:</span>
        <strong class="text-[#0f3042]">${isSingle ? 'Día Único (' + data.singleDate + ')' : 'Multijornada (' + data.multiDate + ')'}</strong>
      </div>
      <div>
        <span class="text-gray-400 block">Aforo Estimado:</span>
        <strong class="text-[#0f3042]">${data.capacity}</strong>
      </div>
    </div>
  `;
}

// ------------------------------------------
// Manejo del Paso 6 (Aceptación Final y Envío)
// ------------------------------------------

function onStep6CheckboxesChange() {
  validateCurrentStep();
}

function submitEventProposal() {
  const btn = document.getElementById('step6-btn-submit');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Procesando tu solicitud...';
  }

  // Generar ID único de seguimiento
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  const newTicketId = `INTY-2026-${randomCode}`;
  const nowIso = new Date().toISOString();

  // Formatear fechas y horarios según duración
  const isSingle = AppState.wizardFormData.duration === 'dia_unico';
  const eventDateFormatted = isSingle ? AppState.wizardFormData.singleDate : AppState.wizardFormData.multiDate;
  const scheduleFormatted = isSingle 
    ? `Inicio: ${AppState.wizardFormData.singleStartTime} | Fin: ${AppState.wizardFormData.singleEndTime} (Hora Caracas)`
    : AppState.wizardFormData.multiSchedule;

  // Objeto de solicitud completo
  const newRequest = {
    id: newTicketId,
    createdAt: nowIso,
    status: 'Pendiente',
    leadId: AppState.currentUser ? AppState.currentUser.id : 'lead-anon',
    timestamps: {
      politicas: AppState.wizardFormData.politicasAcceptedAt || nowIso,
      confidencialidad: AppState.wizardFormData.confidencialidadAcceptedAt || nowIso,
      envioFinal: nowIso
    },
    organizer: {
      name: AppState.wizardFormData.organizerName,
      idDocument: AppState.wizardFormData.organizerIdDocument || 'V- 32196229',
      email: AppState.wizardFormData.organizerEmail,
      whatsapp: AppState.wizardFormData.organizerWhatsapp,
      instagramUrl: AppState.wizardFormData.organizerInstagramUrl,
      instagramUser: AppState.wizardFormData.organizerInstagramUser
    },
    details: {
      eventName: AppState.wizardFormData.eventName,
      duration: AppState.wizardFormData.duration,
      eventDate: eventDateFormatted,
      schedule: scheduleFormatted,
      location: AppState.wizardFormData.location,
      mapsUrl: AppState.wizardFormData.mapsUrl,
      files: AppState.wizardFormData.files.map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        type: f.type,
        dataUrl: f.dataUrl || ''
      }))
    },
    impact: {
      capacity: AppState.wizardFormData.capacity,
      contributions: [...AppState.wizardFormData.contributions],
      otherContribution: AppState.wizardFormData.otherContribution,
      brandReturn: AppState.wizardFormData.brandReturn
    }
  };

  // Guardar en Storage
  const requests = getRequests();
  requests.unshift(newRequest);
  saveRequests(requests);

  // Actualizar contador del Lead
  const leads = getLeads();
  const leadIndex = leads.findIndex(l => l.email.toLowerCase() === newRequest.organizer.email.toLowerCase());
  if (leadIndex !== -1) {
    leads[leadIndex].requestsCount = (leads[leadIndex].requestsCount || 0) + 1;
    leads[leadIndex].phone = newRequest.organizer.whatsapp;
    saveLeads(leads);
  }

  // Simular envío a webhook si está configurado
  dispatchWebhookSync(newRequest);

  // Disparar celebración
  setTimeout(() => {
    // Canvas Confetti
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#d87a86', '#0f3042', '#e5b850', '#ffffff', '#faebee']
      });
    }

    // Actualizar pantalla de éxito
    const ticketEl = document.getElementById('success-ticket-id');
    const orgEl = document.getElementById('success-org-email');
    if (ticketEl) ticketEl.textContent = newTicketId;
    if (orgEl) orgEl.textContent = newRequest.organizer.email;

    // Resetear formulario para futuras solicitudes
    resetWizardFormData();

    // Redirigir a vista de éxito
    navigateTo('dashboard-success');

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane mr-2"></i> Enviar evento';
    }
  }, 1000);
}

function resetWizardFormData() {
  AppState.wizardFormData = {
    politicasAcceptedAt: null,
    confidencialidadAcceptedAt: null,
    compromisosAcceptedAt: null,
    organizerName: AppState.currentUser ? AppState.currentUser.name : '',
    organizerEmail: AppState.currentUser ? AppState.currentUser.email : '',
    organizerWhatsapp: '',
    organizerInstagramUrl: '',
    organizerInstagramUser: '',
    eventName: '',
    duration: 'dia_unico',
    singleDate: '',
    singleStartTime: '09:00 AM',
    singleEndTime: '05:00 PM',
    multiDate: '',
    multiSchedule: '',
    location: '',
    mapsUrl: '',
    files: [],
    capacity: '',
    contributions: [],
    otherContribution: '',
    brandReturn: '',
    checkIndependencia: false,
    check10Dias: false,
    checkConfidencialidadFinal: false
  };
}

// ==========================================
// 8. PANEL DE ADMINISTRACIÓN (SOLO ADMINS)
// ==========================================

function renderAdminDashboard() {
  // Asegurar que solo administradores o visualizadores autorizados puedan ver
  renderAdminRequestsTable();
  renderAdminLeadsTable();
  updateAdminMetrics();
}

function setAdminEventsFilter(status) {
  const statusSelect = document.getElementById('admin-filter-status');
  if (statusSelect) {
    statusSelect.value = status;
  }

  // Sincronizar estilo visual de los botones de filtro rápido
  const btnAll = document.getElementById('btn-filter-all');
  const btnApproved = document.getElementById('btn-filter-approved');

  if (status === 'Aprobado') {
    if (btnApproved) {
      btnApproved.className = 'px-3 py-1.5 rounded-xl text-xs font-black transition-all bg-emerald-600 text-white shadow-xs flex items-center gap-1.5';
    }
    if (btnAll) {
      btnAll.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-white border border-[#ede6de] text-gray-700 hover:bg-gray-50 flex items-center gap-1.5';
    }
    showToast('Filtro activado: Contabilizando solo eventos APROBADOS.', 'info');
  } else {
    if (btnAll) {
      btnAll.className = 'px-3 py-1.5 rounded-xl text-xs font-black transition-all bg-[#0f3042] text-white shadow-xs flex items-center gap-1.5';
    }
    if (btnApproved) {
      btnApproved.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 flex items-center gap-1.5';
    }
    if (status === 'todos') {
      showToast('Filtro activado: Contabilizando todos los eventos solicitados.', 'info');
    }
  }

  filterAdminRequests();
}

function updateAdminMetrics() {
  const requests = getRequests();
  const leads = getLeads();

  const totalReqCount = requests.length;
  const approvedReqCount = requests.filter(r => r.status === 'Aprobado').length;
  const pendingReqCount = requests.filter(r => r.status === 'Pendiente').length;

  const totalReq = document.getElementById('metric-total-requests');
  const pendingReq = document.getElementById('metric-pending-requests');
  const approvedReq = document.getElementById('metric-approved-requests');
  const totalLeads = document.getElementById('metric-total-leads');

  // Tarjetas métricas
  if (totalReq) totalReq.textContent = totalReqCount;
  if (pendingReq) pendingReq.textContent = pendingReqCount;
  if (approvedReq) approvedReq.textContent = approvedReqCount;
  if (totalLeads) totalLeads.textContent = leads.length;

  // Contabilizadores en la barra de filtro
  const countTotal = document.getElementById('admin-count-total');
  const countApproved = document.getElementById('admin-count-approved');
  const pillCountAll = document.getElementById('pill-count-all');
  const pillCountApproved = document.getElementById('pill-count-approved');

  if (countTotal) countTotal.textContent = totalReqCount;
  if (countApproved) countApproved.textContent = approvedReqCount;
  if (pillCountAll) pillCountAll.textContent = totalReqCount;
  if (pillCountApproved) pillCountApproved.textContent = approvedReqCount;
}

function filterAdminRequests() {
  const query = document.getElementById('admin-search-input')?.value.toLowerCase().trim() || '';
  const status = document.getElementById('admin-filter-status')?.value || 'todos';
  const duration = document.getElementById('admin-filter-duration')?.value || 'todos';

  AppState.adminSearchQuery = query;
  AppState.adminFilterStatus = status;

  // Sincronizar botones de filtro si se cambió desde el select
  const btnAll = document.getElementById('btn-filter-all');
  const btnApproved = document.getElementById('btn-filter-approved');
  if (btnAll && btnApproved) {
    if (status === 'Aprobado') {
      btnApproved.className = 'px-3 py-1.5 rounded-xl text-xs font-black transition-all bg-emerald-600 text-white shadow-xs flex items-center gap-1.5';
      btnAll.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-white border border-[#ede6de] text-gray-700 hover:bg-gray-50 flex items-center gap-1.5';
    } else if (status === 'todos') {
      btnAll.className = 'px-3 py-1.5 rounded-xl text-xs font-black transition-all bg-[#0f3042] text-white shadow-xs flex items-center gap-1.5';
      btnApproved.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 flex items-center gap-1.5';
    } else {
      btnAll.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-white border border-[#ede6de] text-gray-700 hover:bg-gray-50 flex items-center gap-1.5';
      btnApproved.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 flex items-center gap-1.5';
    }
  }

  renderAdminRequestsTable(query, status, duration);
}

function renderAdminRequestsTable(query = '', status = 'todos', duration = 'todos') {
  const tbody = document.getElementById('admin-requests-tbody');
  if (!tbody) return;

  let requests = getRequests();

  // Filtrado
  if (status !== 'todos') {
    requests = requests.filter(r => r.status.toLowerCase() === status.toLowerCase());
  }
  if (duration !== 'todos') {
    requests = requests.filter(r => r.details.duration === duration);
  }
  if (query) {
    requests = requests.filter(r => 
      r.id.toLowerCase().includes(query) ||
      r.details.eventName.toLowerCase().includes(query) ||
      r.organizer.name.toLowerCase().includes(query) ||
      r.organizer.email.toLowerCase().includes(query)
    );
  }

  // Orden cronológico por defecto (más recientes primero)
  requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  tbody.innerHTML = '';

  if (requests.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-gray-400">
          <i class="fa-solid fa-folder-open text-3xl mb-2 text-gray-300 block"></i>
          No se encontraron solicitudes con los filtros aplicados.
        </td>
      </tr>
    `;
    return;
  }

  requests.forEach(req => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-[#ede6de] hover:bg-[#faf7f2] transition-colors';

    let badgeClass = 'badge-pendiente';
    if (req.status === 'En Revisión') badgeClass = 'badge-revision';
    if (req.status === 'Aprobado') badgeClass = 'badge-aprobado';
    if (req.status === 'Rechazado') badgeClass = 'badge-rechazado';

    const formattedDate = new Date(req.createdAt).toLocaleDateString('es-VE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const isSingle = req.details.duration === 'dia_unico';

    tr.innerHTML = `
      <td class="py-3 px-4 font-mono font-bold text-[#d87a86] text-xs">
        ${req.id}
      </td>
      <td class="py-3 px-4">
        <div class="font-semibold text-[#0f3042] text-sm">${req.details.eventName}</div>
        <div class="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
          <i class="fa-solid ${isSingle ? 'fa-calendar-day text-[#5fa8bc]' : 'fa-calendar-days text-[#e5b850]'}"></i>
          ${isSingle ? 'Día Único' : 'Multijornada'} • ${req.details.eventDate}
        </div>
      </td>
      <td class="py-3 px-4">
        <div class="text-sm font-medium text-[#0f3042]">${req.organizer.name}</div>
        <div class="text-xs text-gray-400">${req.organizer.email}</div>
      </td>
      <td class="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">
        ${formattedDate}
      </td>
      <td class="py-3 px-4 text-xs font-semibold text-[#0f3042]">
        ${req.impact.capacity}
      </td>
      <td class="py-3 px-4">
        <span class="badge-status ${badgeClass}">
          ${req.status}
        </span>
      </td>
      <td class="py-3 px-4 text-right">
        <div class="flex items-center justify-end gap-1.5">
          <button onclick="openRequestDetailModal('${req.id}')" class="px-2.5 py-1.5 bg-[#0f3042] text-white hover:bg-[#163f53] rounded-lg text-xs font-semibold inline-flex items-center transition-all" title="Ver ficha completa">
            <span>Ver</span>
          </button>
          <button onclick="openLabelForEvent('${req.id}')" class="px-2.5 py-1.5 bg-[#faebee] hover:bg-[#f4d3d8] text-[#0f3042] rounded-lg text-xs font-bold inline-flex items-center transition-all" title="Etiquetar y rotular caja para este evento">
            <span>Etiquetar</span>
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function renderAdminLeadsTable() {
  const tbody = document.getElementById('admin-leads-tbody');
  if (!tbody) return;

  const leads = getLeads();
  tbody.innerHTML = '';

  if (leads.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="py-6 text-center text-gray-400 text-sm">
          No hay leads registrados aún.
        </td>
      </tr>
    `;
    return;
  }

  leads.forEach(lead => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-[#ede6de] hover:bg-[#faf7f2] transition-colors';

    const loginDate = new Date(lead.createdAt).toLocaleDateString('es-VE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    tr.innerHTML = `
      <td class="py-3 px-4">
        <div class="flex items-center gap-3">
          <img src="${lead.photo}" alt="${lead.name}" class="w-9 h-9 rounded-full object-cover border border-[#d87a86]/30 shadow-xs">
          <div>
            <div class="font-semibold text-sm text-[#0f3042]">${lead.name}</div>
            <div class="text-xs text-gray-400">ID Google: ${lead.googleId}</div>
          </div>
        </div>
      </td>
      <td class="py-3 px-4 text-sm text-gray-700">
        <a href="mailto:${lead.email}" class="text-[#d87a86] hover:underline">${lead.email}</a>
      </td>
      <td class="py-3 px-4 text-sm text-gray-600">
        ${lead.phone || '<span class="text-gray-400 italic">No proporcionado</span>'}
      </td>
      <td class="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">
        ${loginDate}
      </td>
      <td class="py-3 px-4 text-center">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${lead.requestsCount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}">
          ${lead.requestsCount} ${lead.requestsCount === 1 ? 'evento' : 'eventos'}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ------------------------------------------
// Almacenamiento y Descarga Automática de Archivos Adjuntos (Flyers / Imágenes)
// ------------------------------------------
const INTY_DB_NAME = 'IntyEventsFilesDB';
const INTY_DB_STORE = 'event_files';

function openIntyFilesDB() {
  return new Promise((resolve) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = indexedDB.open(INTY_DB_NAME, 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(INTY_DB_STORE)) {
          db.createObjectStore(INTY_DB_STORE, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch(e) {
      resolve(null);
    }
  });
}

async function saveFileBlobToIndexedDB(id, name, type, dataUrl) {
  try {
    const db = await openIntyFilesDB();
    if (!db) return;
    const tx = db.transaction(INTY_DB_STORE, 'readwrite');
    const store = tx.objectStore(INTY_DB_STORE);
    store.put({ id, name, type, dataUrl, savedAt: Date.now() });
  } catch (e) {
    console.warn('Error guardando en IndexedDB:', e);
  }
}

async function getFileBlobFromIndexedDB(id) {
  try {
    const db = await openIntyFilesDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(INTY_DB_STORE, 'readonly');
      const store = tx.objectStore(INTY_DB_STORE);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result ? req.result.dataUrl : null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

function dataURLtoBlob(dataurl) {
  try {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (e) {
    console.error('Error convirtiendo DataURL a Blob:', e);
    return null;
  }
}

function ensureImageExtension(fileName, mimeType) {
  let name = (fileName || 'flyer_evento').trim();
  const lower = name.toLowerCase();

  // Si ya tiene extensión válida de imagen, respetarla
  if (lower.match(/\.(jpg|jpeg|png|webp|gif|svg)$/)) {
    return name;
  }

  // Asignar extensión adecuada según el tipo MIME
  if (mimeType === 'image/png') {
    return name.replace(/\.[a-zA-Z0-9]+$/, '') + '.png';
  }
  if (mimeType === 'image/webp') {
    return name.replace(/\.[a-zA-Z0-9]+$/, '') + '.webp';
  }
  if (mimeType === 'image/gif') {
    return name.replace(/\.[a-zA-Z0-9]+$/, '') + '.gif';
  }
  if (mimeType === 'image/svg+xml') {
    return name.replace(/\.[a-zA-Z0-9]+$/, '') + '.svg';
  }
  
  // Por defecto para imágenes, asegurar extensión .jpg
  return name.replace(/\.[a-zA-Z0-9]+$/, '') + '.jpg';
}

function triggerDirectDownload(url, fileName) {
  const safeName = (fileName || 'flyer_evento.jpg').replace(/[/\\?%*:|"<>]/g, '_');
  const a = document.createElement('a');
  a.href = url;
  a.download = safeName;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    if (a.parentNode) a.parentNode.removeChild(a);
  }, 400);
}

async function downloadEventFile(requestId, fileIndex, fileName) {
  try {
    const requests = getRequests();
    const req = requests.find(r => r.id === requestId);
    const fileMeta = req?.details?.files?.[fileIndex];
    let dataUrl = fileMeta?.dataUrl;

    if (!dataUrl && fileMeta?.id) {
      try {
        dataUrl = await getFileBlobFromIndexedDB(fileMeta.id);
      } catch (e) {}
    }

    let finalName = fileName || fileMeta?.name || 'flyer_evento.jpg';
    let fileMime = fileMeta?.type || '';

    // CASO 1: Archivo real subido por el usuario con Data URL (en memoria o IndexedDB)
    if (dataUrl && dataUrl.startsWith('data:')) {
      const mimeMatch = dataUrl.match(/^data:([^;]+);/);
      if (mimeMatch) fileMime = mimeMatch[1];

      // Si es una imagen o flyer, asegurar formato y extensión correspondiente (.jpg, .png, etc.)
      const isImg = fileMime.startsWith('image/') || finalName.match(/\.(jpg|jpeg|png|webp|gif)$/i);
      if (isImg) {
        finalName = ensureImageExtension(finalName, fileMime);
      }

      // Convertir Data URL a Blob nativo para máxima compatibilidad con visores de imágenes y sistemas operativos
      const blob = dataURLtoBlob(dataUrl);
      if (blob) {
        const objUrl = URL.createObjectURL(blob);
        triggerDirectDownload(objUrl, finalName);
        setTimeout(() => URL.revokeObjectURL(objUrl), 6000);
        showToast(`Descarga completada: ${finalName}`, 'success');
        return;
      }
      triggerDirectDownload(dataUrl, finalName);
      showToast(`Descarga completada: ${finalName}`, 'success');
      return;
    }

    // CASO 2: Archivo de demostración o imagen preinstalada en el sistema
    const isImageFile = finalName.match(/\.(jpg|jpeg|png|webp|gif)$/i) || (fileMime && fileMime.startsWith('image/'));
    if (isImageFile) {
      finalName = ensureImageExtension(finalName, fileMime || 'image/jpeg');
      const targetLocalImage = finalName.toLowerCase().endsWith('.png') ? 'LOGO_TRANSPARENT.png' : 'EQUIPO CAMPEON INTYSQUAD.jpeg';
      try {
        const resp = await fetch(targetLocalImage);
        const blob = await resp.blob();
        const objUrl = URL.createObjectURL(blob);
        triggerDirectDownload(objUrl, finalName);
        setTimeout(() => URL.revokeObjectURL(objUrl), 6000);
        showToast(`Descarga completada: ${finalName}`, 'success');
        return;
      } catch (e) {
        console.warn('Fallback imagen local:', e);
      }
    }

    // CASO 3: Documento general
    const docContent = `INTYLACT(R) - ARCHIVO ADJUNTO DE SOLICITUD DE EVENTO\n\n` +
      `ID Solicitud: ${req?.id || requestId}\n` +
      `Evento: ${req?.details?.eventName || 'Evento'}\n` +
      `Organizador: ${req?.organizer?.name || 'N/A'}\n` +
      `Archivo: ${finalName}\n` +
      `Fecha: ${new Date().toLocaleString('es-VE')}\n`;
    const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8' });
    const objUrl = URL.createObjectURL(blob);
    triggerDirectDownload(objUrl, finalName.endsWith('.txt') ? finalName : finalName + '.txt');
    setTimeout(() => URL.revokeObjectURL(objUrl), 6000);
    showToast(`Descarga completada: ${finalName}`, 'success');

  } catch (err) {
    console.error('Error al descargar archivo:', err);
    alert('Error al descargar el archivo: ' + err.message);
  }
}

// ------------------------------------------
// Modal de Detalle de Solicitud de Evento
// ------------------------------------------

function openRequestDetailModal(requestId) {
  const requests = getRequests();
  const req = requests.find(r => r.id === requestId);
  if (!req) return;

  AppState.adminSelectedRequest = req;

  const modal = document.getElementById('modal-request-detail');
  const content = document.getElementById('detail-modal-body');

  const polDate = req.timestamps?.politicas ? new Date(req.timestamps.politicas).toLocaleString('es-VE') : 'Registrado';
  const confDate = req.timestamps?.confidencialidad ? new Date(req.timestamps.confidencialidad).toLocaleString('es-VE') : 'Registrado';
  const subDate = req.timestamps?.envioFinal ? new Date(req.timestamps.envioFinal).toLocaleString('es-VE') : new Date(req.createdAt).toLocaleString('es-VE');

  let filesHtml = '<p class="text-xs text-gray-400 italic">No se adjuntaron archivos en esta propuesta.</p>';
  if (req.details.files && req.details.files.length > 0) {
    filesHtml = `
      <div class="space-y-2">
        ${req.details.files.map((f, idx) => `
          <div class="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs">
            <div class="flex items-center gap-2 truncate">
              <span class="font-medium text-[#0f3042] truncate">${escapeHtml(f.name)}</span>
              <span class="text-gray-400">(${f.size})</span>
            </div>
            <button type="button" onclick="downloadEventFile('${req.id}', ${idx}, '${escapeHtml(f.name).replace(/'/g, "\\'")}');" class="px-3 py-1.5 bg-[#0f3042] hover:bg-[#163f53] text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer" title="Descargar en este dispositivo">
              Descargar
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }

  const contributionsBadges = req.impact.contributions.map(c => `
    <span class="px-2.5 py-1 bg-[#faebee] text-[#ba5763] rounded-md font-semibold text-xs inline-block">
      ${c}
    </span>
  `).join('');

  content.innerHTML = `
    <!-- Header del Ticket -->
    <div class="flex flex-wrap items-center justify-between pb-4 border-b border-gray-200 gap-3">
      <div>
        <span class="text-xs font-mono font-bold text-[#d87a86] bg-[#faebee] px-2.5 py-1 rounded-md">${req.id}</span>
        <h3 class="text-xl font-bold text-[#0f3042] mt-1">${req.details.eventName}</h3>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-xs font-semibold text-gray-500">Estado Actual:</label>
        <select id="detail-status-select" onchange="updateRequestStatus('${req.id}', this.value)" class="form-input text-xs font-bold py-1.5 px-3">
          <option value="Pendiente" ${req.status === 'Pendiente' ? 'selected' : ''}>⏳ Pendiente</option>
          <option value="En Revisión" ${req.status === 'En Revisión' ? 'selected' : ''}>🔍 En Revisión</option>
          <option value="Aprobado" ${req.status === 'Aprobado' ? 'selected' : ''}>✅ Aprobado</option>
          <option value="Rechazado" ${req.status === 'Rechazado' ? 'selected' : ''}>❌ Rechazado</option>
        </select>
      </div>
    </div>

    <!-- Sección 1: Datos del Organizador -->
    <div class="pt-4">
      <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">1. Datos de Contacto y Organización</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-gray-50 rounded-xl text-xs">
        <div>
          <span class="text-gray-400 block">Responsable / Empresa:</span>
          <strong class="text-[#0f3042] text-sm">${req.organizer.name}</strong>
        </div>
        <div>
          <span class="text-gray-400 block">Correo Electrónico:</span>
          <a href="mailto:${req.organizer.email}" class="text-[#d87a86] font-semibold">${req.organizer.email}</a>
        </div>
        <div>
          <span class="text-gray-400 block">WhatsApp de Contacto:</span>
          <a href="https://wa.me/${req.organizer.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="text-emerald-600 font-semibold inline-flex items-center gap-1">
            <i class="fa-brands fa-whatsapp"></i> ${req.organizer.whatsapp}
          </a>
        </div>
        <div>
          <span class="text-gray-400 block">Instagram del Evento:</span>
          <a href="${req.organizer.instagramUrl}" target="_blank" class="text-[#d87a86] font-semibold inline-flex items-center gap-1">
            <i class="fa-brands fa-instagram"></i> ${req.organizer.instagramUser || req.organizer.instagramUrl}
          </a>
        </div>
      </div>
    </div>

    <!-- Sección 2: Logística y Ubicación -->
    <div class="pt-4">
      <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">2. Logística, Fechas y Ubicación</h4>
      <div class="space-y-2 p-3.5 bg-gray-50 rounded-xl text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span class="text-gray-400 block">Modalidad:</span>
            <strong class="text-[#0f3042]">${req.details.duration === 'dia_unico' ? 'Día Único' : 'Multijornada'}</strong>
          </div>
          <div>
            <span class="text-gray-400 block">Fecha(s):</span>
            <strong class="text-[#0f3042]">${req.details.eventDate}</strong>
          </div>
        </div>
        <div>
          <span class="text-gray-400 block">Horarios detallados:</span>
          <p class="text-gray-700 font-medium">${req.details.schedule}</p>
        </div>
        <div>
          <span class="text-gray-400 block">Ubicación física:</span>
          <p class="text-gray-700 font-medium">${req.details.location}</p>
        </div>
        <div>
          <span class="text-gray-400 block">Enlace de Google Maps:</span>
          ${req.details.mapsUrl ? `
            <a href="${req.details.mapsUrl}" target="_blank" rel="noopener noreferrer" class="text-[#5fa8bc] font-semibold hover:underline">
              Ver ubicación en Google Maps
            </a>
          ` : `<span class="text-gray-400 italic text-xs">No especificado (Opcional)</span>`}
        </div>
      </div>
    </div>

    <!-- Sección 3: Alcance y Retorno para INTYLACT -->
    <div class="pt-4">
      <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">3. Alcance, Modalidad de Aporte y Retorno</h4>
      <div class="p-3.5 bg-gray-50 rounded-xl text-xs space-y-3">
        <div>
          <span class="text-gray-400 block">Aforo Estimado:</span>
          <strong class="text-[#0f3042] text-sm">${req.impact.capacity}</strong>
        </div>
        <div>
          <span class="text-gray-400 block mb-1.5">Formas de Participación Solicitadas:</span>
          <div class="flex flex-wrap gap-1.5">
            ${contributionsBadges}
          </div>
          ${req.impact.otherContribution ? `
            <div class="mt-2 text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
              <strong>Detalle de 'Otro':</strong> ${req.impact.otherContribution}
            </div>
          ` : ''}
        </div>
        <div>
          <span class="text-gray-400 block">Beneficio / Retorno propuesto hacia INTYLACT:</span>
          <p class="text-gray-700 font-medium whitespace-pre-line mt-1 bg-white p-2.5 rounded-lg border border-gray-200">
            ${req.impact.brandReturn}
          </p>
        </div>
      </div>
    </div>

    <!-- Sección 4: Archivos Adjuntos -->
    <div class="pt-4">
      <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">4. Archivos Adjuntos (Flyer / Dossier)</h4>
      ${filesHtml}
    </div>

    <!-- Sección 5: Verificaciones Legales y Timestamps -->
    <div class="pt-4">
      <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">5. Trazabilidad Legal y Marcas de Tiempo</h4>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-[#faebee]/50 border border-[#faebee] rounded-xl text-[11px]">
        <div>
          <span class="text-gray-500 block">Políticas Aceptadas:</span>
          <span class="font-mono text-emerald-700 font-semibold"><i class="fa-solid fa-check mr-1"></i>${polDate}</span>
        </div>
        <div>
          <span class="text-gray-500 block">Confidencialidad:</span>
          <span class="font-mono text-emerald-700 font-semibold"><i class="fa-solid fa-check mr-1"></i>${confDate}</span>
        </div>
        <div>
          <span class="text-gray-500 block">Envío de Solicitud:</span>
          <span class="font-mono text-emerald-700 font-semibold"><i class="fa-solid fa-clock mr-1"></i>${subDate}</span>
        </div>
      </div>
    </div>
  `;

  if (modal) modal.classList.remove('hidden');
}

function closeRequestDetailModal() {
  const modal = document.getElementById('modal-request-detail');
  if (modal) modal.classList.add('hidden');
}

function updateRequestStatus(requestId, newStatus) {
  const requests = getRequests();
  const idx = requests.findIndex(r => r.id === requestId);
  if (idx !== -1) {
    requests[idx].status = newStatus;
    saveRequests(requests);
    showToast(`Estado de la solicitud ${requestId} actualizado a: ${newStatus}`);
    renderAdminRequestsTable();
    updateAdminMetrics();
  }
}

// ==========================================
// 9. EXPORTACIÓN A EXCEL (.XLSX) E INTEGRACIONES
// ==========================================

function exportRequestsToExcel() {
  const requests = getRequests();
  if (requests.length === 0) {
    alert('No hay solicitudes para exportar.');
    return;
  }

  if (typeof XLSX === 'undefined') {
    alert('Librería de exportación no cargada. Verifique su conexión a internet.');
    return;
  }

  // Estructurar filas limpias y profesionales para Excel
  const excelData = requests.map(r => ({
    'Código de Solicitud': r.id,
    'Estado': r.status,
    'Fecha de Registro': new Date(r.createdAt).toLocaleDateString('es-VE'),
    'Nombre del Evento': r.details.eventName,
    'Organizador / Empresa': r.organizer.name,
    'Correo de Contacto': r.organizer.email,
    'WhatsApp': r.organizer.whatsapp,
    'Instagram': r.organizer.instagramUser,
    'Link Instagram': r.organizer.instagramUrl,
    'Modalidad': r.details.duration === 'dia_unico' ? 'Día Único' : 'Multijornada',
    'Fecha(s) del Evento': r.details.eventDate,
    'Horarios': r.details.schedule,
    'Ubicación': r.details.location,
    'Link Google Maps': r.details.mapsUrl,
    'Aforo Estimado': r.impact.capacity,
    'Modalidades de Aporte': r.impact.contributions.join(', '),
    'Aporte (Otro)': r.impact.otherContribution || 'N/A',
    'Beneficio para INTYLACT': r.impact.brandReturn,
    'Archivos Adjuntos': r.details.files ? r.details.files.map(f => f.name).join('; ') : 'Ninguno',
    'Timestamp Políticas': r.timestamps?.politicas || '',
    'Timestamp Confidencialidad': r.timestamps?.confidencialidad || '',
    'Timestamp Envío': r.timestamps?.envioFinal || ''
  }));

  // Generar Hoja de Cálculo
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  
  // Auto-ajustar anchos de columnas
  const colWidths = [
    { wch: 18 }, { wch: 14 }, { wch: 16 }, { wch: 35 }, { wch: 30 },
    { wch: 28 }, { wch: 18 }, { wch: 20 }, { wch: 30 }, { wch: 14 },
    { wch: 25 }, { wch: 30 }, { wch: 35 }, { wch: 30 }, { wch: 20 },
    { wch: 35 }, { wch: 20 }, { wch: 45 }, { wch: 30 }, { wch: 24 },
    { wch: 24 }, { wch: 24 }
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Solicitudes INTYLACT');

  // Descarga instantánea
  const todayStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `INTYLACT_Solicitudes_Eventos_${todayStr}.xlsx`);

  showToast('¡Archivo Excel (.xlsx) exportado exitosamente!');
}

function openIntegrationSettingsModal() {
  const modal = document.getElementById('modal-integrations');
  if (modal) modal.classList.remove('hidden');
}

function closeIntegrationSettingsModal() {
  const modal = document.getElementById('modal-integrations');
  if (modal) modal.classList.add('hidden');
}

function testWebhookConnection() {
  const webhookUrl = document.getElementById('config-webhook-url')?.value.trim();
  if (!webhookUrl) {
    alert('Por favor ingrese la URL del Webhook (ej. Google Apps Script, Zapier o Make).');
    return;
  }

  showToast('Enviando paquete de prueba JSON al Webhook...');

  const samplePayload = {
    test: true,
    timestamp: new Date().toISOString(),
    marca: 'INTYLACT® Venezuela',
    mensaje: 'Conexión de prueba exitosa desde INTYEVENTS Portal.'
  };

  fetch(webhookUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(samplePayload)
  })
  .then(() => {
    alert('¡Petición enviada al Webhook! Revise el historial de ejecuciones en su servicio de integración.');
  })
  .catch(err => {
    alert('Nota: Debido a políticas CORS en navegadores locales, el webhook fue despachado. Verifique la recepción en Zapier/Make.');
  });
}

function dispatchWebhookSync(requestData) {
  const savedWebhook = localStorage.getItem('intylact_webhook_url');
  if (!savedWebhook) return;

  try {
    fetch(savedWebhook, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });
  } catch (e) {
    console.warn('Webhook dispatch skipped or silent error:', e);
  }
}

function saveWebhookConfig() {
  const url = document.getElementById('config-webhook-url')?.value.trim();
  if (url) {
    localStorage.setItem('intylact_webhook_url', url);
    showToast('Configuración de integración guardada.');
    closeIntegrationSettingsModal();
  }
}

// ==========================================
// 10. UTILITARIOS DE UI Y NOTIFICACIONES
// ==========================================

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `p-4 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-3 transition-all duration-300 transform translate-y-2 opacity-0 animate-fade-in ${
    type === 'success' 
      ? 'bg-white border-[#d87a86] text-[#0f3042] shadow-[0_10px_25px_rgba(216,122,134,0.25)]' 
      : 'bg-rose-50 border-rose-300 text-rose-800'
  }`;

  toast.innerHTML = `
    <div class="w-7 h-7 rounded-full bg-[#faebee] text-[#d87a86] flex items-center justify-center flex-shrink-0">
      <i class="fa-solid fa-bell text-xs"></i>
    </div>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);

  // Animación entrada
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  // Desvanecer después de 4 segundos
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==========================================
// 11. GESTIÓN Y ROTULADO DE ETIQUETAS DE CAJAS (SOLO ADMINISTRADOR)
// ==========================================

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const LABEL_PRODUCT_CATALOG = [
  { id: 'p1', name: 'SACHETS DE JABON ÍNTIMO', category: 'Muestras' },
  { id: 'p2', name: 'SACHETS DE GEL ÍNTIMO', category: 'Muestras' },
  { id: 'p3', name: 'BOLSOS ROSADOS ECOLOGICOS', category: 'Bolsos' },
  { id: 'p4', name: 'BOLSOS ROSADOS ECOLOGICOS CON ABANICO Y UNA MUESTRA DE GEL', category: 'Bolsos' },
  { id: 'p5', name: 'BOLSOS ROSADOS ECOLOGICOS CON ABANICO Y UNA MUESTRA DE JABON', category: 'Bolsos' },
  { id: 'p6', name: 'BOLSOS ROSADOS ECOLOGICOS CON ABANICO Y UNA MUESTRA DE JABON Y GEL', category: 'Bolsos' },
  { id: 'p7', name: 'ABANICOS POP', category: 'Abanicos' },
  { id: 'p8', name: 'ABANICOS TIPO ACORDEON', category: 'Abanicos' },
  { id: 'p9', name: 'BOLSOS ROSADOS DE TELA', category: 'Bolsos' },
  { id: 'p10', name: 'BOLSOS ROSADOS DE TELA CON ABANICO Y UNA MUESTRA DE GEL', category: 'Bolsos' },
  { id: 'p11', name: 'BOLSOS ROSADOS DE TELA CON ABANICO Y UNA MUESTRA DE JABON', category: 'Bolsos' },
  { id: 'p12', name: 'BOLSOS ROSADOS DE TELA CON ABANICO Y UNA MUESTRA DE JABON Y GEL', category: 'Bolsos' },
  { id: 'p13', name: 'TOALLAS HUMEDAS', category: 'Cuidado Personal' },
  { id: 'p14', name: 'GEL ÍNTIMO HIDRATANTE', category: 'Cuidado Personal' },
  { id: 'p15', name: 'JABON ÍNTIMO', category: 'Cuidado Personal' },
  { id: 'p16', name: 'JABON LIQUIDO PARA ROPA INTIMA', category: 'Cuidado Personal' },
  { id: 'p17', name: 'TRAVELSIZE ROPA INTIMA', category: 'Cuidado Personal' },
  { id: 'p18', name: 'TRAVELSIZE JABON ÍNTIMO', category: 'Cuidado Personal' },
  { id: 'p19', name: 'IGLU CON MOTOR', category: 'Logística' },
  { id: 'p20', name: 'EXTENSION', category: 'Logística' },
  { id: 'p21', name: 'PLANTA ELECTRICA', category: 'Logística' },
  { id: 'p22', name: 'STAND', category: 'Logística' },
  { id: 'p23', name: 'BANDERINES', category: 'Material POP' },
  { id: 'p24', name: 'GLITTER BAR', category: 'Activaciones' },
  { id: 'p25', name: 'BACKING TIPO ARAÑA', category: 'Logística' },
  { id: 'p26', name: 'FRANELA UNIFORME', category: 'Uniformes' },
  { id: 'p27', name: 'PANTALON UNIFORME', category: 'Uniformes' },
  { id: 'p28', name: 'VESTIDO UNIFORME', category: 'Uniformes' },
  { id: 'p29', name: 'GORRAS', category: 'Uniformes' },
  { id: 'p30', name: 'VISERAS', category: 'Uniformes' },
  { id: 'p31', name: 'BOLSAS DE REGALO', category: 'Material POP' },
  { id: 'p32', name: 'BOLSAS PLASTICAS', category: 'Material POP' },
  { id: 'p33', name: 'MUESTRAS DE GEL Y JABON INTIMO', category: 'Muestras' },
  { id: 'p34', name: 'INTYPROB', category: 'Suplementos' },
  { id: 'p35', name: 'INTYPURE', category: 'Suplementos' },
  { id: 'p36', name: 'BOTARGA CON KIT DE LIMPIEZA Y VENTILADOR', category: 'Logística' },
  { id: 'p37', name: 'CAVA', category: 'Logística' },
  { id: 'p38', name: 'BATA MEDICA', category: 'Uniformes' },
  { id: 'p39', name: 'CARPETAS', category: 'Oficina' },
  { id: 'p40', name: 'LAPICEROS', category: 'Oficina' },
  { id: 'p41', name: 'LIBRETAS', category: 'Oficina' },
  { id: 'p42', name: 'OTRO:', category: 'Personalizado', isCustom: true }
];

let labelBoxesData = {
  1: {
    quantities: {},
    customName: '',
    boxSubtitle: 'REGALOS EN STAND'
  }
};
let currentEditingBox = 1;
let currentPreviewBox = 'all'; // 'all' o número de caja (1, 2, ...)
let labelProductsQuantities = {};
let labelCustomItemName = '';
let labelSectionInitialized = false;
let currentLabelCategory = '';
let intylactPrintBannerDataUrl = 'LOGO_BANNER_PRINT.png';

function ensureBoxDataExists(boxNum) {
  if (!labelBoxesData[boxNum]) {
    labelBoxesData[boxNum] = {
      quantities: {},
      customName: '',
      boxSubtitle: ''
    };
    LABEL_PRODUCT_CATALOG.forEach(p => {
      labelBoxesData[boxNum].quantities[p.id] = 0;
    });
  }
}

// Pre-cargar y convertir el banner oficial a DataURL para uso instantáneo en pestañas y Word
(function preloadBannerDataUrl() {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      intylactPrintBannerDataUrl = canvas.toDataURL('image/png');
    } catch (e) {
      intylactPrintBannerDataUrl = 'LOGO_BANNER_PRINT.png';
    }
  };
  img.src = 'LOGO_BANNER_PRINT.png';
})();

function setCustomItemName(value) {
  ensureBoxDataExists(currentEditingBox);
  labelBoxesData[currentEditingBox].customName = value || '';
  labelCustomItemName = value || '';
  updateLabelSelectedSummary();
  updateLiveLabelSheet();
}

function initLabelingSection() {
  populateLabelEventSelector();
  
  if (!labelSectionInitialized) {
    labelBoxesData = {
      1: { quantities: {}, customName: '', boxSubtitle: 'REGALOS EN STAND' }
    };
    LABEL_PRODUCT_CATALOG.forEach(p => {
      labelBoxesData[1].quantities[p.id] = 0;
      labelProductsQuantities[p.id] = 0;
    });
    labelCustomItemName = '';
    currentEditingBox = 1;
    currentPreviewBox = 'all';
    labelSectionInitialized = true;
  }
  renderBoxSelectorTabs();
  renderLabelProductCatalog();
  updateLabelSelectedSummary();
  updateLiveLabelSheet();
}

function renderBoxSelectorTabs() {
  const container = document.getElementById('box-tabs-container');
  if (!container) return;

  const total = Math.max(1, parseInt(document.getElementById('label-input-box-total')?.value, 10) || 1);

  for (let b = 1; b <= total; b++) {
    ensureBoxDataExists(b);
  }

  let html = '';
  for (let b = 1; b <= total; b++) {
    const boxData = labelBoxesData[b];
    let unitCount = 0;
    let itemCount = 0;
    LABEL_PRODUCT_CATALOG.forEach(p => {
      if (!p.isBoxOption) {
        const q = boxData.quantities[p.id] || 0;
        if (q > 0) {
          itemCount++;
          unitCount += q;
        }
      }
    });

    const isActive = (b === currentEditingBox);
    const badgeText = itemCount > 0 ? `${unitCount} un.` : '0 un.';
    const activeClasses = isActive
      ? 'bg-[#0f3042] text-white shadow-sm ring-2 ring-[#d87a86]'
      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200';

    html += `
      <button type="button" onclick="selectBoxToEdit(${b})" class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeClasses}">
        <span>Caja ${b}/${total}</span>
        <span class="text-[10px] px-1.5 py-0.5 rounded font-semibold ${isActive ? 'bg-[#d87a86] text-white' : 'bg-gray-100 text-gray-600'}">
          ${badgeText}
        </span>
      </button>
    `;
  }

  container.innerHTML = html;
}

function selectBoxToEdit(b) {
  const total = Math.max(1, parseInt(document.getElementById('label-input-box-total')?.value, 10) || 1);
  currentEditingBox = Math.max(1, Math.min(total, b));
  ensureBoxDataExists(currentEditingBox);

  const numInput = document.getElementById('label-input-box-num');
  if (numInput) numInput.value = currentEditingBox;
  const labelInput = document.getElementById('label-input-box-label');
  if (labelInput) labelInput.value = `CAJA ${currentEditingBox}/${total}`;

  const subInput = document.getElementById('label-input-box-subtitle');
  if (subInput && labelBoxesData[currentEditingBox].boxSubtitle !== undefined && labelBoxesData[currentEditingBox].boxSubtitle !== '') {
    subInput.value = labelBoxesData[currentEditingBox].boxSubtitle;
  }

  labelProductsQuantities = labelBoxesData[currentEditingBox].quantities;
  labelCustomItemName = labelBoxesData[currentEditingBox].customName || '';

  const customInput = document.getElementById('label-custom-item-name');
  if (customInput) customInput.value = labelCustomItemName;

  const searchInput = document.getElementById('label-product-search');
  renderLabelProductCatalog(searchInput ? searchInput.value : '');
  renderBoxSelectorTabs();
  updateLabelSelectedSummary();

  if (currentPreviewBox !== 'all') {
    currentPreviewBox = currentEditingBox;
  }
  updateLiveLabelSheet();
}

function copyCurrentBoxItemsToAll() {
  const total = Math.max(1, parseInt(document.getElementById('label-input-box-total')?.value, 10) || 1);
  if (total <= 1) {
    showToast('Aumenta el "Total Cajas" para configurar varias cajas.', 'info');
    return;
  }
  ensureBoxDataExists(currentEditingBox);
  const currentQtys = { ...labelBoxesData[currentEditingBox].quantities };
  const currentCustom = labelBoxesData[currentEditingBox].customName || '';

  for (let b = 1; b <= total; b++) {
    ensureBoxDataExists(b);
    labelBoxesData[b].quantities = { ...currentQtys };
    labelBoxesData[b].customName = currentCustom;
  }

  renderBoxSelectorTabs();
  updateLabelSelectedSummary();
  updateLiveLabelSheet();
  showToast(`Ítems de Caja ${currentEditingBox}/${total} copiados a todas las cajas.`, 'success');
}

function clearCurrentBoxItems() {
  ensureBoxDataExists(currentEditingBox);
  LABEL_PRODUCT_CATALOG.forEach(p => {
    labelBoxesData[currentEditingBox].quantities[p.id] = 0;
  });
  labelBoxesData[currentEditingBox].customName = '';
  labelCustomItemName = '';

  const customInput = document.getElementById('label-custom-item-name');
  if (customInput) customInput.value = '';

  const searchInput = document.getElementById('label-product-search');
  renderLabelProductCatalog(searchInput ? searchInput.value : '');
  renderBoxSelectorTabs();
  updateLabelSelectedSummary();
  updateLiveLabelSheet();
  showToast(`Ítems de Caja ${currentEditingBox} restablecidos a 0.`, 'info');
}

function resetAllProductQtys() {
  clearCurrentBoxItems();
}

function populateLabelEventSelector() {
  const select = document.getElementById('label-select-event');
  if (!select) return;

  const currentVal = select.value;
  select.innerHTML = '<option value="">-- Seleccionar evento registrado --</option>';

  const requests = getRequests();
  requests.forEach(req => {
    const opt = document.createElement('option');
    opt.value = req.id;
    opt.textContent = `${req.id} - ${req.details?.eventName || 'Evento'} (${req.organizer?.name || 'Organizador'})`;
    select.appendChild(opt);
  });

  const optManual = document.createElement('option');
  optManual.value = 'manual';
  optManual.textContent = '+ Ingresar datos de evento manualmente';
  select.appendChild(optManual);

  if (currentVal) select.value = currentVal;
}

function onSelectLabelEvent(requestId) {
  if (!requestId) return;
  if (requestId === 'manual') {
    clearLabelForm();
    showToast('Formulario listo para ingreso manual.', 'info');
    return;
  }
  loadEventIntoLabel(requestId);
}

function openLabelForEvent(requestId) {
  navigateTo('labeling');
  setTimeout(() => {
    const select = document.getElementById('label-select-event');
    if (select) select.value = requestId;
    loadEventIntoLabel(requestId);
  }, 100);
}

function loadEventIntoLabel(requestId) {
  const requests = getRequests();
  const req = requests.find(r => r.id === requestId);
  if (!req) return;

  const nameInput = document.getElementById('label-input-event-name');
  const respNameInput = document.getElementById('label-input-responsible-name');
  const respIdInput = document.getElementById('label-input-responsible-id');
  const phoneInput = document.getElementById('label-input-phone');
  const addressInput = document.getElementById('label-input-address');

  if (nameInput) nameInput.value = req.details?.eventName || '';
  if (respNameInput) respNameInput.value = req.organizer?.name || '';
  if (respIdInput) respIdInput.value = req.organizer?.idDocument || 'V- 32196229';
  if (phoneInput) phoneInput.value = req.organizer?.whatsapp || '';
  if (addressInput) addressInput.value = req.details?.location || '';

  updateLiveLabelSheet();
  showToast(`Datos de "${(req.details?.eventName || 'Evento').substring(0, 30)}..." cargados y reflejados en el rótulo.`, 'success');
}

function updateBoxLabelText() {
  const numInput = document.getElementById('label-input-box-num');
  const totalInput = document.getElementById('label-input-box-total');
  const labelInput = document.getElementById('label-input-box-label');

  if (numInput && totalInput && labelInput) {
    const total = Math.max(1, parseInt(totalInput.value, 10) || 1);
    let num = Math.max(1, Math.min(total, parseInt(numInput.value, 10) || 1));
    numInput.value = num;
    totalInput.value = total;
    labelInput.value = `CAJA ${num}/${total}`;

    currentEditingBox = num;
    for (let b = 1; b <= total; b++) {
      ensureBoxDataExists(b);
    }
  }

  renderBoxSelectorTabs();
  updateLiveLabelSheet();
}

function modifyBoxNum(delta) {
  const numInput = document.getElementById('label-input-box-num');
  if (!numInput) return;
  const current = parseInt(numInput.value, 10) || 1;
  const total = parseInt(document.getElementById('label-input-box-total')?.value, 10) || 1;
  numInput.value = Math.max(1, Math.min(total, current + delta));
  updateBoxLabelText();
}

function modifyBoxTotal(delta) {
  const totalInput = document.getElementById('label-input-box-total');
  if (!totalInput) return;
  const current = parseInt(totalInput.value, 10) || 1;
  totalInput.value = Math.max(1, current + delta);
  updateBoxLabelText();
}

function onInlineBoxChange() {
  const inlineNum = document.getElementById('inline-box-num');
  const inlineTotal = document.getElementById('inline-box-total');
  const numInput = document.getElementById('label-input-box-num');
  const totalInput = document.getElementById('label-input-box-total');

  if (inlineNum && numInput) numInput.value = inlineNum.value;
  if (inlineTotal && totalInput) totalInput.value = inlineTotal.value;
  updateBoxLabelText();
}

function filterLabelCategory(category) {
  currentLabelCategory = category ? category.toLowerCase().trim() : '';

  // Actualizar estado visual de los chips de categoría
  const chips = document.querySelectorAll('.category-chip');
  chips.forEach(chip => {
    const onclickAttr = chip.getAttribute('onclick') || '';
    if ((!category && onclickAttr.includes("('')")) || (category && onclickAttr.includes(`('${category}')`))) {
      chip.className = 'category-chip active text-[10px] px-2.5 py-1 rounded-full border border-[#d87a86] bg-[#d87a86] text-white font-bold transition-all';
    } else {
      chip.className = 'category-chip text-[10px] px-2.5 py-1 rounded-full border border-gray-200 bg-white text-gray-600 font-bold hover:border-[#d87a86] transition-all';
    }
  });

  const searchInput = document.getElementById('label-product-search');
  renderLabelProductCatalog(searchInput ? searchInput.value : '');
}

function filterLabelProducts(query) {
  renderLabelProductCatalog(query);
}

function renderLabelProductCatalog(filterQuery = '') {
  const container = document.getElementById('label-products-container');
  if (!container) return;

  container.innerHTML = '';
  const query = (filterQuery || '').toLowerCase().trim();

  const filtered = LABEL_PRODUCT_CATALOG.filter(p => {
    // Filtro por categoría seleccionada
    if (currentLabelCategory) {
      const pCat = p.category.toLowerCase();
      const pName = p.name.toLowerCase();
      if (!pCat.includes(currentLabelCategory) && !pName.includes(currentLabelCategory)) {
        return false;
      }
    }
    // Filtro por texto de búsqueda
    if (!query) return true;
    return p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="py-8 text-center text-gray-400 text-xs">
        <i class="fa-solid fa-box-open text-2xl text-gray-300 mb-2 block"></i>
        No se encontraron productos coincidentes con "${escapeHtml(query || currentLabelCategory)}".
        <button type="button" onclick="filterLabelCategory(''); document.getElementById('label-product-search').value='';" class="mt-2 block mx-auto text-[11px] text-[#d87a86] font-bold hover:underline">Ver todos los 42 ítems</button>
      </div>
    `;
    return;
  }

  filtered.forEach(prod => {
    const originalIndex = LABEL_PRODUCT_CATALOG.findIndex(p => p.id === prod.id);
    const itemNumber = originalIndex >= 0 ? originalIndex + 1 : 1;
    const qty = labelProductsQuantities[prod.id] || 0;
    const hasQty = qty > 0;

    const row = document.createElement('div');
    row.id = `label-prod-row-${prod.id}`;
    row.className = `label-product-row p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all ${
      hasQty ? 'has-qty border-[#d87a86] bg-[#faebee]/30 shadow-xs' : 'border-gray-100 bg-white hover:border-gray-200'
    }`;

    // Ítem personalizado OTRO: con espacio para escribir el nombre
    if (prod.isCustom) {
      row.innerHTML = `
        <div class="flex-grow min-w-0 pr-2">
          <div class="flex items-center gap-2 mb-1.5">
            <span class="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${hasQty ? 'bg-[#d87a86] text-white' : 'bg-gray-100 text-gray-500'} flex-shrink-0">
              ${itemNumber}
            </span>
            <span class="text-xs font-black uppercase text-[#0f3042] flex-shrink-0">
              OTRO:
            </span>
            <span class="text-[10px] text-gray-400 font-medium">(Ítem Adicional)</span>
          </div>
          <div class="pl-7">
            <input type="text" id="label-custom-item-name" 
                   value="${escapeHtml(labelCustomItemName)}" 
                   placeholder="Escriba aquí el nombre del producto..." 
                   oninput="setCustomItemName(this.value)" 
                   class="w-full py-1.5 px-3 text-xs font-bold uppercase rounded-lg border ${hasQty ? 'border-[#d87a86] bg-white text-[#0f3042]' : 'border-gray-300 bg-white text-gray-800 focus:border-[#d87a86]'} placeholder-gray-400 outline-none transition-all shadow-2xs">
          </div>
          <div class="flex items-center gap-2 mt-1 pl-7">
            <span id="label-prod-badge-${prod.id}" class="text-[10px] font-bold text-[#d87a86] ${hasQty ? '' : 'hidden'}">
              • ${qty} un. asignadas
            </span>
          </div>
        </div>

        <div class="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-center pl-7 sm:pl-0">
          <div class="hidden sm:flex items-center gap-1 mr-1">
            <button type="button" onclick="quickAddProductQty('${prod.id}', 10)" class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 hover:bg-[#faebee] hover:text-[#d87a86] text-gray-600 transition-colors" title="Sumar 10">+10</button>
            <button type="button" onclick="quickAddProductQty('${prod.id}', 50)" class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 hover:bg-[#faebee] hover:text-[#d87a86] text-gray-600 transition-colors" title="Sumar 50">+50</button>
            <button type="button" onclick="quickAddProductQty('${prod.id}', 100)" class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 hover:bg-[#faebee] hover:text-[#d87a86] text-gray-600 transition-colors" title="Sumar 100">+100</button>
          </div>

          <button type="button" onclick="updateProductQty('${prod.id}', -1)" class="label-qty-btn" title="Restar 1">-</button>
          <input type="number" min="0" max="99999" id="label-prod-input-${prod.id}" value="${hasQty ? qty : ''}" placeholder="0" 
                 oninput="setProductQty('${prod.id}', this.value)" 
                 class="w-16 py-1 px-1.5 text-center text-xs font-black rounded-lg border ${hasQty ? 'border-[#d87a86] bg-white text-[#d87a86]' : 'border-gray-200 bg-gray-50 text-gray-700 focus:bg-white'}">
          <button type="button" onclick="updateProductQty('${prod.id}', 1)" class="label-qty-btn" title="Sumar 1">+</button>

          <button type="button" onclick="quickClearProductQty('${prod.id}')" id="label-prod-clear-${prod.id}" class="text-xs text-gray-300 hover:text-red-500 p-1 transition-colors ${hasQty ? '' : 'hidden'}" title="Quitar este producto">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `;
    } else {
      row.innerHTML = `
        <div class="flex-grow min-w-0">
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${hasQty ? 'bg-[#d87a86] text-white' : 'bg-gray-100 text-gray-500'} flex-shrink-0">
              ${itemNumber}
            </span>
            <span class="text-xs font-bold uppercase text-[#0f3042] truncate" title="${escapeHtml(prod.name)}">
              ${escapeHtml(prod.name)}
            </span>
          </div>
          <div class="flex items-center gap-2 mt-1 pl-7">
            <span class="text-[10px] text-gray-400 font-medium">${prod.category}</span>
            <span id="label-prod-badge-${prod.id}" class="text-[10px] font-bold text-[#d87a86] ${hasQty ? '' : 'hidden'}">
              • ${qty} un. asignadas
            </span>
          </div>
        </div>

        <div class="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-center pl-7 sm:pl-0">
          <!-- Presets rápidos para agilizar cantidades grandes -->
          <div class="hidden sm:flex items-center gap-1 mr-1">
            <button type="button" onclick="quickAddProductQty('${prod.id}', 10)" class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 hover:bg-[#faebee] hover:text-[#d87a86] text-gray-600 transition-colors" title="Sumar 10">+10</button>
            <button type="button" onclick="quickAddProductQty('${prod.id}', 50)" class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 hover:bg-[#faebee] hover:text-[#d87a86] text-gray-600 transition-colors" title="Sumar 50">+50</button>
            <button type="button" onclick="quickAddProductQty('${prod.id}', 100)" class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 hover:bg-[#faebee] hover:text-[#d87a86] text-gray-600 transition-colors" title="Sumar 100">+100</button>
          </div>

          <button type="button" onclick="updateProductQty('${prod.id}', -1)" class="label-qty-btn" title="Restar 1">-</button>
          <input type="number" min="0" max="99999" id="label-prod-input-${prod.id}" value="${hasQty ? qty : ''}" placeholder="0" 
                 oninput="setProductQty('${prod.id}', this.value)" 
                 class="w-16 py-1 px-1.5 text-center text-xs font-black rounded-lg border ${hasQty ? 'border-[#d87a86] bg-white text-[#d87a86]' : 'border-gray-200 bg-gray-50 text-gray-700 focus:bg-white'}">
          <button type="button" onclick="updateProductQty('${prod.id}', 1)" class="label-qty-btn" title="Sumar 1">+</button>

          <button type="button" onclick="quickClearProductQty('${prod.id}')" id="label-prod-clear-${prod.id}" class="text-xs text-gray-300 hover:text-red-500 p-1 transition-colors ${hasQty ? '' : 'hidden'}" title="Quitar este producto">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `;
    }

    container.appendChild(row);
  });
}

function updateLabelRowState(productId) {
  const qty = labelProductsQuantities[productId] || 0;
  const row = document.getElementById(`label-prod-row-${productId}`);
  const input = document.getElementById(`label-prod-input-${productId}`);
  const badge = document.getElementById(`label-prod-badge-${productId}`);
  const clearBtn = document.getElementById(`label-prod-clear-${productId}`);

  if (row) {
    if (qty > 0) {
      row.className = 'label-product-row p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all has-qty border-[#d87a86] bg-[#faebee]/30 shadow-xs';
    } else {
      row.className = 'label-product-row p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all border-gray-100 bg-white hover:border-gray-200';
    }
  }

  if (input && document.activeElement !== input) {
    input.value = qty > 0 ? qty : '';
    input.className = `w-16 py-1 px-1.5 text-center text-xs font-black rounded-lg border ${qty > 0 ? 'border-[#d87a86] bg-white text-[#d87a86]' : 'border-gray-200 bg-gray-50 text-gray-700 focus:bg-white'}`;
  }

  if (badge) {
    badge.textContent = `• ${qty} un. asignadas`;
    if (qty > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  if (clearBtn) {
    if (qty > 0) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }
}

function setProductQty(productId, value) {
  const parsed = parseInt(value, 10);
  const qty = isNaN(parsed) || parsed < 0 ? 0 : parsed;
  ensureBoxDataExists(currentEditingBox);
  labelBoxesData[currentEditingBox].quantities[productId] = qty;
  labelProductsQuantities = labelBoxesData[currentEditingBox].quantities;
  updateLabelRowState(productId);
  renderBoxSelectorTabs();
  updateLabelSelectedSummary();
  updateLiveLabelSheet();
}

function updateProductQty(productId, delta) {
  ensureBoxDataExists(currentEditingBox);
  const current = labelBoxesData[currentEditingBox].quantities[productId] || 0;
  const next = Math.max(0, current + delta);
  labelBoxesData[currentEditingBox].quantities[productId] = next;
  labelProductsQuantities = labelBoxesData[currentEditingBox].quantities;

  const input = document.getElementById(`label-prod-input-${productId}`);
  if (input) input.value = next > 0 ? next : '';

  updateLabelRowState(productId);
  renderBoxSelectorTabs();
  updateLabelSelectedSummary();
  updateLiveLabelSheet();
}

function quickAddProductQty(productId, amount) {
  updateProductQty(productId, amount);
}

function quickClearProductQty(productId) {
  ensureBoxDataExists(currentEditingBox);
  labelBoxesData[currentEditingBox].quantities[productId] = 0;
  labelProductsQuantities = labelBoxesData[currentEditingBox].quantities;
  const input = document.getElementById(`label-prod-input-${productId}`);
  if (input) input.value = '';
  updateLabelRowState(productId);
  renderBoxSelectorTabs();
  updateLabelSelectedSummary();
  updateLiveLabelSheet();
}

function getBoxProducts(boxNum) {
  ensureBoxDataExists(boxNum);
  const boxData = labelBoxesData[boxNum];
  const list = [];
  LABEL_PRODUCT_CATALOG.forEach(p => {
    if (!p.isBoxOption) {
      const q = boxData.quantities[p.id] || 0;
      if (q > 0) {
        let displayName = p.name;
        if (p.isCustom) {
          const customText = (boxData.customName || '').trim();
          displayName = customText ? customText.toUpperCase() : 'PRODUCTO ADICIONAL';
        }
        list.push({
          id: p.id,
          name: displayName,
          qty: q
        });
      }
    }
  });
  return list;
}

function updateLabelSelectedSummary() {
  const counterEl = document.getElementById('label-products-counter');
  const totalUnitsEl = document.getElementById('label-total-units-badge');
  const previewListEl = document.getElementById('label-selected-list-preview');
  const totalBoxes = Math.max(1, parseInt(document.getElementById('label-input-box-total')?.value, 10) || 1);

  ensureBoxDataExists(currentEditingBox);
  const currentBoxData = labelBoxesData[currentEditingBox];

  let selectedCount = 0;
  let totalUnits = 0;
  const selectedItems = [];

  LABEL_PRODUCT_CATALOG.forEach(p => {
    if (!p.isBoxOption) {
      const qty = currentBoxData.quantities[p.id] || 0;
      if (qty > 0) {
        selectedCount++;
        totalUnits += qty;
        let displayName = p.name;
        if (p.isCustom) {
          const customText = (currentBoxData.customName || '').trim();
          displayName = customText ? customText.toUpperCase() : 'PRODUCTO ADICIONAL';
        }
        selectedItems.push({ name: displayName, qty: qty });
      }
    }
  });

  if (counterEl) counterEl.textContent = `Caja ${currentEditingBox}/${totalBoxes}: ${selectedCount} item${selectedCount === 1 ? '' : 's'}`;
  if (totalUnitsEl) totalUnitsEl.textContent = `${totalUnits} un. en Caja ${currentEditingBox}`;

  if (previewListEl) {
    if (selectedItems.length === 0) {
      previewListEl.innerHTML = `<span class="text-gray-400 italic">No hay productos seleccionados para Caja ${currentEditingBox}/${totalBoxes}. Ingresa cantidades en los campos de arriba.</span>`;
    } else {
      previewListEl.innerHTML = selectedItems.map(item => `
        <div class="flex items-center justify-between text-xs py-0.5 border-b border-gray-100 last:border-b-0">
          <span class="truncate font-semibold text-[#0f3042]">• ${escapeHtml(item.name)}</span>
          <span class="font-extrabold text-[#d87a86] ml-2 flex-shrink-0">${item.qty} un.</span>
        </div>
      `).join('');
    }
  }
}

function setPreviewBox(boxChoice) {
  currentPreviewBox = boxChoice;
  updateLiveLabelSheet();
}

function renderLivePreviewBoxSelector(totalBoxes) {
  const container = document.getElementById('live-pv-box-selector');
  if (!container) return;

  const isAll = (currentPreviewBox === 'all');
  let html = `
    <button type="button" onclick="setPreviewBox('all')" class="text-[10px] px-2.5 py-1 rounded-lg font-bold transition-all ${
      isAll
        ? 'bg-[#0f3042] text-white shadow-xs'
        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
    }">
      Todas (${totalBoxes})
    </button>
  `;

  for (let b = 1; b <= totalBoxes; b++) {
    const isSel = (!isAll && parseInt(currentPreviewBox, 10) === b);
    const boxQtys = labelBoxesData[b]?.quantities || {};
    let uCount = 0;
    Object.values(boxQtys).forEach(v => { uCount += (v || 0); });

    html += `
      <button type="button" onclick="setPreviewBox(${b})" class="text-[10px] px-2.5 py-1 rounded-lg font-bold transition-all ${
        isSel
          ? 'bg-[#d87a86] text-white shadow-xs'
          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
      }">
        Caja ${b}/${totalBoxes} (${uCount} un.)
      </button>
    `;
  }

  container.innerHTML = html;
}

function renderSingleSheetPreviewCard(data, box) {
  const pCount = box.products.length;
  let listItemsHtml = '';
  if (pCount === 0) {
    listItemsHtml = '<li class="italic text-gray-400 font-normal">Sin productos asignados a esta caja. Haz clic en "Configurar ítems" para cargarle productos.</li>';
  } else {
    listItemsHtml = box.products.map(p => `
      <li style="margin-bottom: 4px;">
        <span class="font-black text-black">${p.qty}</span> ${escapeHtml(p.name)}
      </li>
    `).join('');
  }

  const isCurrentBox = (box.boxNum === currentEditingBox);

  return `
    <div class="bg-white rounded-xl shadow-md border ${isCurrentBox ? 'border-[#d87a86] ring-2 ring-[#d87a86]/20' : 'border-gray-200'} p-3.5 sm:p-5 transition-all">
      <div class="flex items-center justify-between pb-2.5 mb-3 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase ${isCurrentBox ? 'bg-[#d87a86] text-white' : 'bg-[#0f3042] text-white'}">
            Caja ${box.boxNum}/${data.boxTotal}
          </span>
          <span class="text-xs text-gray-500 font-medium">
            (${pCount} ${pCount === 1 ? 'ítem' : 'ítems'} registrados)
          </span>
        </div>
        <button type="button" onclick="selectBoxToEdit(${box.boxNum})" class="text-[11px] font-bold ${isCurrentBox ? 'text-[#d87a86]' : 'text-[#0f3042] hover:text-[#d87a86]'} hover:underline">
          ${isCurrentBox ? '✓ Editando ahora' : 'Configurar ítems'}
        </button>
      </div>

      <div class="mb-3">
        <img src="LOGO_BANNER_PRINT.png" alt="INTYLACT - La marca #1 de cuidado íntimo en Venezuela" class="h-9 sm:h-11 w-auto max-w-full object-contain">
      </div>

      <div class="border-[2.5px] border-black rounded-sm overflow-hidden text-xs sm:text-sm">
        <table class="w-full border-collapse">
          <tbody>
            <tr class="border-b-2 border-black">
              <td class="w-[34%] p-2.5 sm:p-3 font-black text-black border-r-2 border-black bg-white uppercase text-[11px] sm:text-xs tracking-wide">
                NOMBRE DEL EVENTO
              </td>
              <td class="w-[66%] p-2.5 sm:p-3 font-black text-black text-xs sm:text-sm uppercase leading-snug">
                ${escapeHtml(data.eventName || 'NOMBRE DEL EVENTO (SIN ASIGNAR)')}
              </td>
            </tr>
            <tr class="border-b-2 border-black">
              <td class="w-[34%] p-2.5 sm:p-3 font-black text-black border-r-2 border-black bg-white uppercase text-[11px] sm:text-xs">
                RESPONSABLE QUE RETIRA:
              </td>
              <td class="w-[66%] p-2.5 sm:p-3 font-medium text-black">
                <div class="font-bold text-xs sm:text-sm text-black">${escapeHtml(data.responsibleName || '—')}</div>
                ${data.responsibleId ? `<div class="font-black text-xs sm:text-sm text-black font-mono mt-0.5">${escapeHtml(data.responsibleId)}</div>` : ''}
              </td>
            </tr>
            <tr class="border-b-2 border-black">
              <td class="w-[34%] p-2.5 sm:p-3 font-black text-black border-r-2 border-black bg-white uppercase text-[11px] sm:text-xs">
                TELÉFONO:
              </td>
              <td class="w-[66%] p-2.5 sm:p-3 font-extrabold text-black">
                ${escapeHtml(data.phone || '—')}
              </td>
            </tr>
            <tr class="border-b-2 border-black">
              <td class="w-[34%] p-2.5 sm:p-3 font-black text-black border-r-2 border-black bg-white uppercase text-[11px] sm:text-xs">
                DIRECCION:
              </td>
              <td class="w-[66%] p-2.5 sm:p-3 font-bold text-black uppercase leading-snug text-[11px] sm:text-xs">
                ${escapeHtml(data.address || '—')}
              </td>
            </tr>
            <tr class="border-b-2 border-black">
              <td class="w-[34%] p-2.5 sm:p-3 font-black text-black border-r-2 border-black bg-white uppercase text-[11px] sm:text-xs">
                PRODUCTOS EN ESTA CAJA:
              </td>
              <td class="w-[66%] p-2.5 sm:p-3">
                <div class="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase mb-1 leading-none font-['Neue_Machina_Bold',sans-serif]">
                  CAJA ${box.boxNum}/${data.boxTotal}
                </div>
                ${box.boxSubtitle ? `<div class="text-xs sm:text-sm font-black text-black uppercase tracking-wider mb-2">${escapeHtml(box.boxSubtitle)}</div>` : ''}
                <ul class="list-disc pl-5 font-bold uppercase text-[11px] sm:text-xs text-black space-y-1">
                  ${listItemsHtml}
                </ul>
              </td>
            </tr>
            <tr>
              <td class="w-[34%] p-2.5 sm:p-3 font-black text-black border-r-2 border-black bg-white uppercase text-[11px] sm:text-xs">
                NOTA IMPORTANTE:
              </td>
              <td class="w-[66%] p-2.5 sm:p-3 font-black text-black text-[11px] sm:text-xs uppercase leading-snug">
                ${escapeHtml(data.note)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function updateLiveLabelSheet() {
  const data = getLabelFormData();
  const totalBoxes = data.boxTotal;

  renderLivePreviewBoxSelector(totalBoxes);

  const wrapper = document.getElementById('live-pv-sheets-wrapper');
  if (wrapper) {
    let boxesToRender = [];
    if (currentPreviewBox === 'all') {
      boxesToRender = data.boxes;
    } else {
      const bNum = Math.max(1, Math.min(totalBoxes, parseInt(currentPreviewBox, 10) || 1));
      boxesToRender = [data.boxes[bNum - 1]];
    }

    wrapper.innerHTML = boxesToRender.map(box => renderSingleSheetPreviewCard(data, box)).join('');
  }

  const pvEvent = document.getElementById('pv-event-name');
  if (pvEvent) pvEvent.textContent = data.eventName || 'NOMBRE DEL EVENTO (SIN ASIGNAR)';
}

function loadModelFuccamExample(notify = true) {
  const nameInput = document.getElementById('label-input-event-name');
  const respNameInput = document.getElementById('label-input-responsible-name');
  const respIdInput = document.getElementById('label-input-responsible-id');
  const phoneInput = document.getElementById('label-input-phone');
  const addressInput = document.getElementById('label-input-address');
  const boxNumInput = document.getElementById('label-input-box-num');
  const boxTotalInput = document.getElementById('label-input-box-total');
  const boxLabelInput = document.getElementById('label-input-box-label');
  const boxSubInput = document.getElementById('label-input-box-subtitle');
  const noteInput = document.getElementById('label-input-note');

  if (nameInput) nameInput.value = "6TA EDICION CARRERA CAMINATA 5K POR LA CONCIENTIZACION DEL CANCER DE MAMA FUCCAM 25 DE OCTUBRE | MATERIAL PROMOTORA VALERIA LEONES PUEBLO NUEVO";
  if (respNameInput) respNameInput.value = "Valeria Leones";
  if (respIdInput) respIdInput.value = "V- 32196229";
  if (phoneInput) phoneInput.value = "04126681611";
  if (addressInput) addressInput.value = "GUACUIRA ARRIBA, MUNICIPIO FALCÓN. ESTADO FALCÓN, DETRÁS DE LA PARADA, CASA SIN NÚMERO";
  if (boxNumInput) boxNumInput.value = "1";
  if (boxTotalInput) boxTotalInput.value = "1";
  if (boxLabelInput) boxLabelInput.value = "CAJA 1/1";
  if (boxSubInput) boxSubInput.value = "REGALOS EN STAND";
  if (noteInput) noteInput.value = "POR FAVOR AL RETIRAR ESTE PAQUETE, NOTIFICAR AL EQUIPO DE RELACIONES PÚBLICAS";

  labelBoxesData = {
    1: { quantities: {}, customName: '', boxSubtitle: 'REGALOS EN STAND' }
  };
  LABEL_PRODUCT_CATALOG.forEach(p => {
    labelBoxesData[1].quantities[p.id] = 0;
  });
  labelBoxesData[1].quantities['p1'] = 100;
  labelBoxesData[1].quantities['p7'] = 100;
  labelBoxesData[1].quantities['p4'] = 20;
  labelBoxesData[1].quantities['p13'] = 15;
  labelProductsQuantities = labelBoxesData[1].quantities;
  labelCustomItemName = '';
  currentEditingBox = 1;
  currentPreviewBox = 'all';

  const customNameInput = document.getElementById('label-custom-item-name');
  if (customNameInput) customNameInput.value = '';

  renderBoxSelectorTabs();
  renderLabelProductCatalog();
  updateLabelSelectedSummary();
  updateLiveLabelSheet();

  if (notify) {
    showToast('Formato modelo FUCCAM 5K cargado y reflejado en el rotulado.', 'success');
  }
}

function clearLabelForm() {
  const ids = [
    'label-input-event-name',
    'label-input-responsible-name',
    'label-input-responsible-id',
    'label-input-phone',
    'label-input-address'
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  const select = document.getElementById('label-select-event');
  if (select) select.value = '';

  const boxNumInput = document.getElementById('label-input-box-num');
  const boxTotalInput = document.getElementById('label-input-box-total');
  const boxLabelInput = document.getElementById('label-input-box-label');
  const boxSubInput = document.getElementById('label-input-box-subtitle');

  if (boxNumInput) boxNumInput.value = '1';
  if (boxTotalInput) boxTotalInput.value = '1';
  if (boxLabelInput) boxLabelInput.value = 'CAJA 1/1';
  if (boxSubInput) boxSubInput.value = 'REGALOS EN STAND';

  labelBoxesData = {
    1: { quantities: {}, customName: '', boxSubtitle: 'REGALOS EN STAND' }
  };
  LABEL_PRODUCT_CATALOG.forEach(p => {
    labelBoxesData[1].quantities[p.id] = 0;
  });
  labelProductsQuantities = labelBoxesData[1].quantities;
  labelCustomItemName = '';
  currentEditingBox = 1;
  currentPreviewBox = 'all';

  const customInput = document.getElementById('label-custom-item-name');
  if (customInput) customInput.value = '';

  renderBoxSelectorTabs();
  renderLabelProductCatalog('');
  updateLabelSelectedSummary();
  updateLiveLabelSheet();
}

function getLabelFormData() {
  const eventName = (document.getElementById('label-input-event-name')?.value || '').trim();
  const responsibleName = (document.getElementById('label-input-responsible-name')?.value || '').trim();
  const responsibleId = (document.getElementById('label-input-responsible-id')?.value || '').trim();
  const phone = (document.getElementById('label-input-phone')?.value || '').trim();
  const address = (document.getElementById('label-input-address')?.value || '').trim();
  const boxNum = Math.max(1, parseInt(document.getElementById('label-input-box-num')?.value, 10) || 1);
  const boxTotal = Math.max(1, parseInt(document.getElementById('label-input-box-total')?.value, 10) || 1);
  const boxLabel = (document.getElementById('label-input-box-label')?.value || `CAJA ${boxNum}/${boxTotal}`).trim();
  const boxSubtitle = (document.getElementById('label-input-box-subtitle')?.value || '').trim();
  const note = (document.getElementById('label-input-note')?.value || 'POR FAVOR AL RETIRAR ESTE PAQUETE, NOTIFICAR AL EQUIPO DE RELACIONES PÚBLICAS').trim();

  const boxes = [];
  for (let b = 1; b <= boxTotal; b++) {
    ensureBoxDataExists(b);
    const boxData = labelBoxesData[b];
    boxes.push({
      boxNum: b,
      boxTotal: boxTotal,
      boxLabel: `CAJA ${b}/${boxTotal}`,
      boxSubtitle: (boxData.boxSubtitle !== undefined && boxData.boxSubtitle !== '') ? boxData.boxSubtitle : boxSubtitle,
      products: getBoxProducts(b)
    });
  }

  const currentProducts = getBoxProducts(currentEditingBox);

  return {
    eventName,
    responsibleName,
    responsibleId,
    phone,
    address,
    boxNum,
    boxTotal,
    boxLabel,
    boxSubtitle,
    note,
    products: currentProducts,
    boxes
  };
}

function generatePrintWindowHtml(data, autoPrint = false) {
  const totalBoxes = Math.max(1, data.boxTotal || 1);
  const bannerUrl = (typeof intylactPrintBannerDataUrl !== 'undefined' && intylactPrintBannerDataUrl) ? intylactPrintBannerDataUrl : 'LOGO_BANNER_PRINT.png';

  const boxes = [];
  for (let b = 1; b <= totalBoxes; b++) {
    boxes.push((data.boxes && data.boxes[b - 1]) || {
      boxNum: b,
      boxTotal: totalBoxes,
      boxLabel: `CAJA ${b}/${totalBoxes}`,
      boxSubtitle: data.boxSubtitle,
      products: []
    });
  }

  // Función constructora de bloque de rótulo para 1 caja
  function renderBoxTable(box, isCompact) {
    const pCount = (box.products || []).length;
    let tdPad = isCompact ? '3.5pt 7pt' : '8pt 11pt';
    let eventSize = isCompact ? '8.5pt' : '11pt';
    let boxTitleSize = isCompact ? '18pt' : '28pt';
    let subTitleSize = isCompact ? '8pt' : '9.5pt';
    let listSize = isCompact ? '8.5pt' : '10.5pt';
    let listLineHeight = isCompact ? '1.2' : '1.35';
    let listGridStyle = '';
    let logoHeight = isCompact ? '24px' : '38px';
    let logoMb = isCompact ? '3px' : '6px';
    let noteSize = isCompact ? '7.5pt' : '9.5pt';

    if (!isCompact) {
      if (pCount >= 7 && pCount <= 11) {
        tdPad = '6.5pt 9.5pt';
        eventSize = '10pt';
        boxTitleSize = '23pt';
        subTitleSize = '9pt';
        listSize = '9.5pt';
        listLineHeight = '1.25';
      } else if (pCount >= 12 && pCount <= 22) {
        tdPad = '4.5pt 7.5pt';
        eventSize = '9pt';
        boxTitleSize = '20pt';
        subTitleSize = '8.5pt';
        listSize = '8.5pt';
        listLineHeight = '1.16';
        listGridStyle = 'display: grid; grid-template-columns: 1fr 1fr; gap: 2pt 12pt; list-style-position: inside; padding-left: 0;';
      } else if (pCount > 22) {
        tdPad = '3.5pt 6.5pt';
        eventSize = '8pt';
        boxTitleSize = '18pt';
        subTitleSize = '8pt';
        listSize = '7.5pt';
        listLineHeight = '1.1';
        listGridStyle = 'display: grid; grid-template-columns: 1fr 1fr; gap: 1.5pt 8pt; list-style-position: inside; padding-left: 0;';
      }
    }

    let productsHtml = '';
    if (pCount === 0) {
      productsHtml = '<li style="font-style: italic; color: #666;">Sin productos registrados en esta caja</li>';
    } else {
      productsHtml = box.products.map(p => `
        <li style="margin-bottom: 2pt; word-break: break-word;">
          <span style="font-weight: 900;">${p.qty}</span> ${escapeHtml(p.name)}
        </li>
      `).join('');
    }

    return `
      <div class="box-label-block ${isCompact ? 'box-label-compact' : 'box-label-full'}">
        <div style="display: flex; align-items: center; margin-bottom: ${logoMb}; margin-top: 0; padding-top: 0;">
          <img src="${bannerUrl}" alt="INTYLACT - La marca #1 de cuidado íntimo en Venezuela" style="height: ${logoHeight}; width: auto; max-width: 320px; object-fit: contain; display: block;">
        </div>

        <table class="label-official-table">
          <tr>
            <td class="td-label-col" style="padding: ${tdPad};">NOMBRE DEL EVENTO</td>
            <td class="td-val-col" style="padding: ${tdPad}; font-weight: 900; font-size: ${eventSize}; text-transform: uppercase; line-height: 1.22;">
              ${escapeHtml(data.eventName)}
            </td>
          </tr>
          <tr>
            <td class="td-label-col" style="padding: ${tdPad};">RESPONSABLE QUE RETIRA:</td>
            <td class="td-val-col" style="padding: ${tdPad};">
              <div style="font-size: ${isCompact ? '8.5pt' : '10.5pt'}; font-weight: 600;">${escapeHtml(data.responsibleName || '—')}</div>
              ${data.responsibleId ? `<div style="font-size: ${isCompact ? '8.5pt' : '10.5pt'}; font-weight: 900; margin-top: 2px; font-family: monospace;">${escapeHtml(data.responsibleId)}</div>` : ''}
            </td>
          </tr>
          <tr>
            <td class="td-label-col" style="padding: ${tdPad};">TELÉFONO:</td>
            <td class="td-val-col" style="padding: ${tdPad}; font-weight: 800; font-size: ${isCompact ? '8.5pt' : '10.5pt'};">
              ${escapeHtml(data.phone || '—')}
            </td>
          </tr>
          <tr>
            <td class="td-label-col" style="padding: ${tdPad};">DIRECCION:</td>
            <td class="td-val-col" style="padding: ${tdPad}; font-weight: 700; font-size: ${isCompact ? '8pt' : '9.5pt'}; text-transform: uppercase; line-height: 1.25;">
              ${escapeHtml(data.address || '—')}
            </td>
          </tr>
          <tr>
            <td class="td-label-col" style="padding: ${tdPad};">PRODUCTOS EN ESTA CAJA:</td>
            <td class="td-val-col" style="padding: ${tdPad};">
              <div style="font-size: ${boxTitleSize}; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; line-height: 1.05; margin-bottom: 2px; font-family: 'Neue Machina Bold', 'Neue Machina', Arial, sans-serif;">
                CAJA ${box.boxNum}/${totalBoxes}
              </div>
              ${box.boxSubtitle ? `<div style="font-weight: 800; font-size: ${subTitleSize}; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px; color: #111;">${escapeHtml(box.boxSubtitle)}</div>` : ''}
              <ul style="margin: 0; padding-left: 18px; font-weight: 700; font-size: ${listSize}; text-transform: uppercase; line-height: ${listLineHeight}; ${listGridStyle}">
                ${productsHtml}
              </ul>
            </td>
          </tr>
          <tr>
            <td class="td-label-col" style="padding: ${tdPad};">NOTA IMPORTANTE:</td>
            <td class="td-val-col" style="padding: ${tdPad}; font-weight: 900; font-size: ${noteSize}; text-transform: uppercase; line-height: 1.2;">
              ${escapeHtml(data.note)}
            </td>
          </tr>
        </table>
      </div>
    `;
  }

  // Función para construir hojas según el modo (Ahorro de papel o 1 por hoja)
  function buildSheets(savingMode) {
    let sheets = [];
    if (savingMode) {
      let i = 0;
      while (i < boxes.length) {
        const b1 = boxes[i];
        const b1Compact = (b1.products || []).length <= 5;

        if (b1Compact && (i + 1 < boxes.length)) {
          const b2 = boxes[i + 1];
          const b2Compact = (b2.products || []).length <= 5;
          if (b2Compact) {
            // Combinar 2 cajas compactas en 1 hoja carta con guía de corte
            sheets.push({
              type: 'double',
              boxes: [b1, b2]
            });
            i += 2;
            continue;
          }
        }

        // Si una caja es grande (>5 ítems) o impar, ocupa su propia hoja
        sheets.push({
          type: 'single',
          boxes: [b1]
        });
        i += 1;
      }
    } else {
      for (let b = 0; b < boxes.length; b++) {
        sheets.push({
          type: 'single',
          boxes: [boxes[b]]
        });
      }
    }
    return sheets;
  }

  // Generar render inicial en Modo Ahorro
  const initialSheets = buildSheets(true);
  let sheetsHtml = '';
  initialSheets.forEach(sheet => {
    if (sheet.type === 'double') {
      sheetsHtml += `
        <div class="sheet-page sheet-double">
          ${renderBoxTable(sheet.boxes[0], true)}
          <div class="print-cut-guide">
            <span class="cut-scissors">✂</span>
            <span class="cut-dash"></span>
            <span class="cut-text">LÍNEA DE CORTE • CORTAR POR AQUÍ PARA SEPARAR RÓTULOS (CAJA ${sheet.boxes[0].boxNum} Y CAJA ${sheet.boxes[1].boxNum})</span>
            <span class="cut-dash"></span>
            <span class="cut-scissors">✂</span>
          </div>
          ${renderBoxTable(sheet.boxes[1], true)}
        </div>
      `;
    } else {
      sheetsHtml += `
        <div class="sheet-page sheet-single">
          ${renderBoxTable(sheet.boxes[0], false)}
        </div>
      `;
    }
  });

  const serializedData = JSON.stringify(data).replace(/</g, '\\u003c');
  const initialPageCount = initialSheets.length;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <base href="${window.location.origin}${window.location.pathname}">
  <title>Rótulos de Cajas (${totalBoxes} ${totalBoxes === 1 ? 'Caja' : 'Cajas'} en ${initialPageCount} ${initialPageCount === 1 ? 'Hoja' : 'Hojas'}) - INTYLACT</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    @page {
      size: letter portrait;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      font-family: 'Neue Machina Bold', 'Neue Machina', Arial, Helvetica, sans-serif;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #eef1f5;
      color: #000000;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .print-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(15, 48, 66, 0.97);
      backdrop-filter: blur(12px);
      color: #ffffff;
      padding: 10px 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    }
    .t-btn {
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 11.5px;
      font-weight: 800;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .t-btn-print { background: #d87a86; color: #ffffff; }
    .t-btn-print:hover { background: #ba5763; transform: translateY(-1px); }
    .t-btn-toggle { background: #1e3a5f; color: #ffffff; }
    .t-btn-toggle:hover { background: #2d556e; transform: translateY(-1px); }
    .t-btn-pdf { background: #dc2626; color: #ffffff; }
    .t-btn-pdf:hover { background: #b91c1c; transform: translateY(-1px); }
    .t-btn-word { background: #1d4ed8; color: #ffffff; }
    .t-btn-word:hover { background: #1e40af; transform: translateY(-1px); }
    .t-btn-close { background: #374151; color: #ffffff; }
    .t-btn-close:hover { background: #4b5563; }

    .sheets-wrapper {
      padding: 24px 0 60px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
    }

    .sheet-page {
      width: 8.5in;
      height: 11in;
      max-height: 11in;
      box-sizing: border-box;
      padding: 0.18in 0.45in 0.20in 0.45in;
      background: #ffffff;
      box-shadow: 0 8px 25px rgba(0,0,0,0.12);
      border: 1px solid #d1d5db;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
    }

    .sheet-single {
      justify-content: flex-start;
      gap: 8px;
    }

    .sheet-double {
      justify-content: space-between;
      gap: 0;
    }

    .sheet-page:last-child {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }

    .label-official-table {
      width: 100%;
      border-collapse: collapse;
      border: 2.2px solid #000000;
      color: #000000;
    }
    .label-official-table td {
      border: 1.8px solid #000000;
      vertical-align: top;
      color: #000000;
    }
    .td-label-col {
      width: 34%;
      font-weight: 900;
      text-transform: uppercase;
      font-size: 9.5pt;
      letter-spacing: 0.02em;
    }
    .td-val-col {
      width: 66%;
    }

    .print-cut-guide {
      width: 100%;
      margin: 4px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #6b7280;
      font-size: 7.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      user-select: none;
    }
    .cut-dash {
      flex: 1;
      border-top: 1.5px dashed #9ca3af;
    }
    .cut-scissors {
      font-size: 10.5pt;
      color: #374151;
    }

    @media print {
      .no-print {
        display: none !important;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        width: 8.5in !important;
        height: auto !important;
      }
      .sheets-wrapper {
        padding: 0 !important;
        margin: 0 !important;
        gap: 0 !important;
        display: block !important;
      }
      .sheet-page {
        margin: 0 !important;
        box-shadow: none !important;
        border: none !important;
        width: 8.5in !important;
        height: 11in !important;
        max-height: 11in !important;
        padding: 0.18in 0.45in 0.20in 0.45in !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        page-break-after: always !important;
        break-after: page !important;
        overflow: hidden !important;
      }
      .sheet-page:last-child {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
    }
  </style>
</head>
<body>
  <!-- Barra Superior de Acciones (No se imprime) -->
  <div class="print-toolbar no-print">
    <div style="display: flex; align-items: center; gap: 8px;">
      <div style="width: 10px; height: 10px; border-radius: 50%; background: #d87a86;"></div>
      <span style="font-size: 13px; font-weight: 800;">INTYLACT • Rótulos de Cajas Oficiales</span>
      <span id="badge-saving-status" style="background: rgba(216,122,134,0.25); border: 1px solid #d87a86; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; color: #faebee;">
        Ahorro de Papel (2 por Hoja)
      </span>
    </div>

    <div style="display: flex; align-items: center; gap: 8px;">
      <button id="btn-toggle-layout" onclick="togglePaperSavingMode()" class="t-btn t-btn-toggle" title="Alternar entre 2 cajas por hoja o 1 caja por hoja">
        <i class="fa-solid fa-file-lines"></i>
        <span id="btn-toggle-text">Ver 1 Caja por Hoja</span>
      </button>
      <button id="btn-main-print" onclick="window.print()" class="t-btn t-btn-print" title="Imprimir directamente en hoja tamaño carta">
        <i class="fa-solid fa-print"></i>
        <span>Imprimir (${initialPageCount} ${initialPageCount === 1 ? 'Hoja' : 'Hojas'})</span>
      </button>
      <button onclick="savePdfInstructions()" class="t-btn t-btn-pdf" title="Guardar en PDF tamaño carta">
        <i class="fa-solid fa-file-pdf"></i>
        <span>Guardar PDF</span>
      </button>
      <button onclick="downloadWordDoc()" class="t-btn t-btn-word" title="Descargar archivo Word (.doc) con todas las cajas">
        <i class="fa-solid fa-file-word"></i>
        <span>Exportar Word</span>
      </button>
      <button onclick="window.close()" class="t-btn t-btn-close" title="Cerrar pestaña">
        <i class="fa-solid fa-xmark"></i>
        <span>Cerrar</span>
      </button>
    </div>
  </div>

  <!-- Contenedor con todas las hojas físicas tamaño Carta -->
  <div id="sheets-container" class="sheets-wrapper">
    ${sheetsHtml}
  </div>

  <script>
    const labelData = ${serializedData};
    const bannerUrl = '${bannerUrl}';
    let isSavingMode = true;

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function renderBoxHtml(box, isCompact) {
      const pCount = (box.products || []).length;
      let tdPad = isCompact ? '3.5pt 7pt' : '8pt 11pt';
      let eventSize = isCompact ? '8.5pt' : '11pt';
      let boxTitleSize = isCompact ? '18pt' : '28pt';
      let subTitleSize = isCompact ? '8pt' : '9.5pt';
      let listSize = isCompact ? '8.5pt' : '10.5pt';
      let listLineHeight = isCompact ? '1.2' : '1.35';
      let listGridStyle = '';
      let logoHeight = isCompact ? '24px' : '38px';
      let logoMb = isCompact ? '3px' : '6px';
      let noteSize = isCompact ? '7.5pt' : '9.5pt';

      if (!isCompact) {
        if (pCount >= 7 && pCount <= 11) {
          tdPad = '6.5pt 9.5pt';
          eventSize = '10pt';
          boxTitleSize = '23pt';
          subTitleSize = '9pt';
          listSize = '9.5pt';
          listLineHeight = '1.25';
        } else if (pCount >= 12 && pCount <= 22) {
          tdPad = '4.5pt 7.5pt';
          eventSize = '9pt';
          boxTitleSize = '20pt';
          subTitleSize = '8.5pt';
          listSize = '8.5pt';
          listLineHeight = '1.16';
          listGridStyle = 'display: grid; grid-template-columns: 1fr 1fr; gap: 2pt 12pt; list-style-position: inside; padding-left: 0;';
        } else if (pCount > 22) {
          tdPad = '3.5pt 6.5pt';
          eventSize = '8pt';
          boxTitleSize = '18pt';
          subTitleSize = '8pt';
          listSize = '7.5pt';
          listLineHeight = '1.1';
          listGridStyle = 'display: grid; grid-template-columns: 1fr 1fr; gap: 1.5pt 8pt; list-style-position: inside; padding-left: 0;';
        }
      }

      let productsHtml = '';
      if (pCount === 0) {
        productsHtml = '<li style="font-style: italic; color: #666;">Sin productos registrados en esta caja</li>';
      } else {
        productsHtml = box.products.map(p => 
          '<li style="margin-bottom: 2pt; word-break: break-word;"><span style="font-weight: 900;">' + p.qty + '</span> ' + escapeHtml(p.name) + '</li>'
        ).join('');
      }

      return '<div class="box-label-block ' + (isCompact ? 'box-label-compact' : 'box-label-full') + '">' +
        '<div style="display: flex; align-items: center; margin-bottom: ' + logoMb + '; margin-top: 0; padding-top: 0;">' +
          '<img src="' + bannerUrl + '" alt="INTYLACT" style="height: ' + logoHeight + '; width: auto; max-width: 320px; object-fit: contain; display: block;">' +
        '</div>' +
        '<table class="label-official-table">' +
          '<tr><td class="td-label-col" style="padding: ' + tdPad + ';">NOMBRE DEL EVENTO</td><td class="td-val-col" style="padding: ' + tdPad + '; font-weight: 900; font-size: ' + eventSize + '; text-transform: uppercase; line-height: 1.22;">' + escapeHtml(labelData.eventName) + '</td></tr>' +
          '<tr><td class="td-label-col" style="padding: ' + tdPad + ';">RESPONSABLE QUE RETIRA:</td><td class="td-val-col" style="padding: ' + tdPad + ';"><div style="font-size: ' + (isCompact ? '8.5pt' : '10.5pt') + '; font-weight: 600;">' + escapeHtml(labelData.responsibleName || '—') + '</div>' + (labelData.responsibleId ? '<div style="font-size: ' + (isCompact ? '8.5pt' : '10.5pt') + '; font-weight: 900; margin-top: 2px; font-family: monospace;">' + escapeHtml(labelData.responsibleId) + '</div>' : '') + '</td></tr>' +
          '<tr><td class="td-label-col" style="padding: ' + tdPad + ';">TELÉFONO:</td><td class="td-val-col" style="padding: ' + tdPad + '; font-weight: 800; font-size: ' + (isCompact ? '8.5pt' : '10.5pt') + ';">' + escapeHtml(labelData.phone || '—') + '</td></tr>' +
          '<tr><td class="td-label-col" style="padding: ' + tdPad + ';">DIRECCION:</td><td class="td-val-col" style="padding: ' + tdPad + '; font-weight: 700; font-size: ' + (isCompact ? '8pt' : '9.5pt') + '; text-transform: uppercase; line-height: 1.25;">' + escapeHtml(labelData.address || '—') + '</td></tr>' +
          '<tr><td class="td-label-col" style="padding: ' + tdPad + ';">PRODUCTOS EN ESTA CAJA:</td><td class="td-val-col" style="padding: ' + tdPad + ';"><div style="font-size: ' + boxTitleSize + '; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; line-height: 1.05; margin-bottom: 2px; font-family: \'Neue Machina Bold\', \'Neue Machina\', Arial, sans-serif;">CAJA ' + box.boxNum + '/' + (labelData.boxTotal || 1) + '</div>' + (box.boxSubtitle ? '<div style="font-weight: 800; font-size: ' + subTitleSize + '; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px; color: #111;">' + escapeHtml(box.boxSubtitle) + '</div>' : '') + '<ul style="margin: 0; padding-left: 18px; font-weight: 700; font-size: ' + listSize + '; text-transform: uppercase; line-height: ' + listLineHeight + '; ' + listGridStyle + '">' + productsHtml + '</ul></td></tr>' +
          '<tr><td class="td-label-col" style="padding: ' + tdPad + ';">NOTA IMPORTANTE:</td><td class="td-val-col" style="padding: ' + tdPad + '; font-weight: 900; font-size: ' + noteSize + '; text-transform: uppercase; line-height: 1.2;">' + escapeHtml(labelData.note) + '</td></tr>' +
        '</table>' +
      '</div>';
    }

    function togglePaperSavingMode() {
      isSavingMode = !isSavingMode;
      const boxes = labelData.boxes || [];
      const container = document.getElementById('sheets-container');
      const toggleText = document.getElementById('btn-toggle-text');
      const printBtn = document.getElementById('btn-main-print');
      const badge = document.getElementById('badge-saving-status');

      let sheetsHtml = '';
      let pageCount = 0;

      if (isSavingMode) {
        let i = 0;
        while (i < boxes.length) {
          const b1 = boxes[i];
          const b1Compact = (b1.products || []).length <= 5;
          if (b1Compact && (i + 1 < boxes.length)) {
            const b2 = boxes[i + 1];
            const b2Compact = (b2.products || []).length <= 5;
            if (b2Compact) {
              pageCount++;
              sheetsHtml += '<div class="sheet-page sheet-double">' +
                renderBoxHtml(b1, true) +
                '<div class="print-cut-guide"><span class="cut-scissors">✂</span><span class="cut-dash"></span><span class="cut-text">LÍNEA DE CORTE • CORTAR POR AQUÍ PARA SEPARAR RÓTULOS (CAJA ' + b1.boxNum + ' Y CAJA ' + b2.boxNum + ')</span><span class="cut-dash"></span><span class="cut-scissors">✂</span></div>' +
                renderBoxHtml(b2, true) +
                '</div>';
              i += 2;
              continue;
            }
          }
          pageCount++;
          sheetsHtml += '<div class="sheet-page sheet-single">' + renderBoxHtml(b1, false) + '</div>';
          i += 1;
        }
        if (toggleText) toggleText.textContent = 'Ver 1 Caja por Hoja';
        if (badge) {
          badge.style.display = 'inline-block';
          badge.textContent = 'Ahorro de Papel (2 por Hoja)';
        }
      } else {
        for (let b = 0; b < boxes.length; b++) {
          pageCount++;
          sheetsHtml += '<div class="sheet-page sheet-single">' + renderBoxHtml(boxes[b], false) + '</div>';
        }
        if (toggleText) toggleText.textContent = 'Activar Ahorro (2 por Hoja)';
        if (badge) {
          badge.style.display = 'inline-block';
          badge.textContent = 'Modo Completo (1 por Hoja)';
        }
      }

      container.innerHTML = sheetsHtml;
      if (printBtn) {
        printBtn.innerHTML = '<i class="fa-solid fa-print"></i> <span>Imprimir (' + pageCount + (pageCount === 1 ? ' Hoja)' : ' Hojas)') + '</span>';
      }
    }

    function savePdfInstructions() {
      alert('Para guardar en PDF:\\n\\n1. En la ventana de impresión, selecciona "Guardar como PDF" en Destino.\\n2. Selecciona tamaño de papel "Carta" (Letter).\\n3. Haz clic en Guardar.');
      window.print();
    }

    function downloadWordDoc() {
      const total = Math.max(1, labelData.boxTotal || 1);
      let boxesWord = '';
      for (let b = 1; b <= total; b++) {
        const box = (labelData.boxes && labelData.boxes[b - 1]) || {
          boxNum: b,
          boxTotal: total,
          boxSubtitle: labelData.boxSubtitle,
          products: labelData.products || []
        };

        let prodItems = '';
        if (!box.products || box.products.length === 0) {
          prodItems = '<li style="font-style: italic; color: #666;">Sin productos registrados</li>';
        } else {
          box.products.forEach(p => {
            prodItems += '<li style="margin-bottom: 4pt; font-weight: bold; text-transform: uppercase; font-size: 11pt;"><span style="font-weight: 900;">' + p.qty + '</span> ' + p.name + '</li>';
          });
        }

        if (b > 1) {
          boxesWord += '<br clear="all" style="page-break-before: always; mso-break-type: section-break;">';
        }
        boxesWord += '<div style="margin-bottom: 8pt;"><img src="' + bannerUrl + '" alt="INTYLACT" style="height: 32pt; width: auto; max-width: 270pt; display: block;"></div>' +
          '<table style="width: 100%; border-collapse: collapse; border: 2pt solid #000000; margin-top: 6pt;">' +
            '<tr><td style="width: 35%; border: 1.5pt solid #000; padding: 8pt 10pt; font-weight: bold;">NOMBRE DEL EVENTO</td><td style="width: 65%; border: 1.5pt solid #000; padding: 8pt 10pt; font-weight: bold; text-transform: uppercase;">' + (labelData.eventName || '') + '</td></tr>' +
            '<tr><td style="width: 35%; border: 1.5pt solid #000; padding: 8pt 10pt; font-weight: bold;">RESPONSABLE QUE RETIRA:</td><td style="width: 65%; border: 1.5pt solid #000; padding: 8pt 10pt;">' + (labelData.responsibleName || '—') + (labelData.responsibleId ? '<div style="font-weight: bold; margin-top: 3pt;">' + labelData.responsibleId + '</div>' : '') + '</td></tr>' +
            '<tr><td style="width: 35%; border: 1.5pt solid #000; padding: 8pt 10pt; font-weight: bold;">TELÉFONO:</td><td style="width: 65%; border: 1.5pt solid #000; padding: 8pt 10pt; font-weight: bold;">' + (labelData.phone || '—') + '</td></tr>' +
            '<tr><td style="width: 35%; border: 1.5pt solid #000; padding: 8pt 10pt; font-weight: bold;">DIRECCION:</td><td style="width: 65%; border: 1.5pt solid #000; padding: 8pt 10pt; font-weight: bold; text-transform: uppercase;">' + (labelData.address || '—') + '</td></tr>' +
            '<tr><td style="width: 35%; border: 1.5pt solid #000; padding: 8pt 10pt; font-weight: bold;">PRODUCTOS EN ESTA CAJA:</td><td style="width: 65%; border: 1.5pt solid #000; padding: 8pt 10pt;"><div style="font-size: 26pt; font-weight: bold; margin-bottom: 4pt;">CAJA ' + b + '/' + total + '</div>' + (box.boxSubtitle ? '<div style="font-size: 11pt; font-weight: bold; margin-bottom: 6pt; text-transform: uppercase;">' + box.boxSubtitle + '</div>' : '') + '<ul style="margin: 0; padding-left: 20pt;">' + prodItems + '</ul></td></tr>' +
            '<tr><td style="width: 35%; border: 1.5pt solid #000; padding: 8pt 10pt; font-weight: bold;">NOTA IMPORTANTE:</td><td style="width: 65%; border: 1.5pt solid #000; padding: 8pt 10pt; font-weight: bold; text-transform: uppercase;">' + (labelData.note || '') + '</td></tr>' +
          '</table>';
      }

      const wordDoc = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">' +
        '<head><meta charset="utf-8"><title>Etiquetas de Cajas</title>' +
        '<style>@page Section1 { size: 8.5in 11.0in; margin: 0.6in 0.7in 0.6in 0.7in; } div.Section1 { page: Section1; } body { font-family: Arial, sans-serif; color: #000000; }</style>' +
        '</head><body><div class="Section1">' + boxesWord + '</div></body></html>';

      const blob = new Blob(['\\ufeff' + wordDoc], { type: 'application/msword;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeEvent = (labelData.eventName || 'Evento').substring(0, 18).replace(/[^a-zA-Z0-9]/g, '_');
      a.download = 'Etiquetas_' + total + 'Cajas_' + safeEvent + '.doc';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    ${autoPrint ? "window.addEventListener('load', () => { setTimeout(() => window.print(), 350); });" : ''}
  </script>
</body>
</html>`;
}

function processLabelSheet(autoPrint = false) {
  const data = getLabelFormData();

  if (!data.eventName) {
    alert('Por favor, ingresa el Nombre del Evento para continuar.');
    const el = document.getElementById('label-input-event-name');
    if (el) el.focus();
    return;
  }

  let totalUnits = 0;
  data.boxes.forEach(b => {
    b.products.forEach(p => {
      totalUnits += p.qty;
    });
  });

  if (totalUnits === 0) {
    const proceed = confirm('No has asignado unidades a ningún producto en ninguna caja. ¿Deseas procesar el rótulo de todos modos?');
    if (!proceed) return;
  }

  // Generar HTML completo con todas las cajas (1/N a N/N) y abrir en OTRA PESTAÑA
  const fullHtml = generatePrintWindowHtml(data, autoPrint);
  const printWindow = window.open('', '_blank');

  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(fullHtml);
    printWindow.document.close();
  } else {
    alert('Por favor, permite ventanas emergentes en tu navegador para abrir el rótulo en la nueva pestaña.');
    return;
  }

  // REQUISITO: Al proceder el etiquetado a la otra pestaña,
  // automáticamente en la sección de etiquetado se borra la que ya se procesó
  // para iniciar con otro etiquetado nuevo.
  clearLabelForm();

  showToast(`¡Rótulo (${data.boxTotal} ${data.boxTotal === 1 ? 'caja' : 'cajas'}) abierto en nueva pestaña! Formulario listo para otro etiquetado.`, 'success');
}

function printLabelSheet() {
  processLabelSheet(true);
}

function exportLabelToPdf() {
  processLabelSheet(true);
}

function exportLabelToWord() {
  const data = getLabelFormData();
  const total = Math.max(1, data.boxTotal || 1);

  let boxesWord = '';
  for (let b = 1; b <= total; b++) {
    const box = (data.boxes && data.boxes[b - 1]) || {
      boxNum: b,
      boxTotal: total,
      boxSubtitle: data.boxSubtitle,
      products: []
    };

    let productsListHtml = '';
    if (!box.products || box.products.length === 0) {
      productsListHtml = '<li style="font-style: italic; color: #666;">Sin productos registrados</li>';
    } else {
      box.products.forEach(p => {
        productsListHtml += `<li style="margin-bottom: 4pt; font-weight: bold; text-transform: uppercase; font-size: 11pt;"><span style="font-weight: 900;">${p.qty}</span> ${escapeHtml(p.name)}</li>`;
      });
    }

    if (b > 1) {
      boxesWord += '<br clear="all" style="page-break-before: always; mso-break-type: section-break;">';
    }
    boxesWord += `
      <div style="margin-bottom: 10pt;">
        <img src="${intylactPrintBannerDataUrl || 'LOGO_BANNER_PRINT.png'}" alt="INTYLACT - La marca #1 de cuidado íntimo en Venezuela" style="height: 32pt; width: auto; max-width: 270pt; display: block;">
      </div>
      <table style="width: 100%; border-collapse: collapse; border: 2pt solid #000000; margin-top: 10pt;">
        <tr>
          <td style="width: 35%; border: 1.5pt solid #000; padding: 8pt 10pt; font-weight: bold; text-transform: uppercase;">NOMBRE DEL EVENTO</td>
          <td style="width: 65%; border: 1.5pt solid #000; padding: 8pt 10pt; font-weight: bold; text-transform: uppercase;">
            ${escapeHtml(data.eventName)}
          </td>
        </tr>
        <tr>
          <td style="width: 35%; border: 1.5pt solid #000; padding: 8pt 10pt; font-weight: bold; text-transform: uppercase;">RESPONSABLE QUE RETIRA:</td>
          <td style="width: 65%; border: 1.5pt solid #000; padding: 8pt 10pt;">
            <div style="font-size: 11pt;">${escapeHtml(data.responsibleName || '—')}</div>
            ${data.responsibleId ? `<div style="font-size: 11pt; font-weight: bold; margin-top: 4pt;">${escapeHtml(data.responsibleId)}</div>` : ''}
          </td>
        </tr>
        <tr>
          <td style="width: 35%; border: 1.5pt solid #000; padding: 8pt 10pt; font-weight: bold; text-transform: uppercase;">TELÉFONO:</td>
          <td style="width: 65%; border: 1.5pt solid #000; padding: 8pt 10pt; font-weight: bold;">
            ${escapeHtml(data.phone || '—')}
          </td>
        </tr>
        <tr>
          <td style="width: 35%; border: 1.5pt solid #000; padding: 8pt 10pt; font-weight: bold; text-transform: uppercase;">DIRECCION:</td>
          <td style="width: 65%; border: 1.5pt solid #000; padding: 8pt 10pt; font-weight: bold; text-transform: uppercase;">
            ${escapeHtml(data.address || '—')}
          </td>
        </tr>
        <tr>
          <td style="width: 35%; border: 1.5pt solid #000; padding: 8pt 10pt; font-weight: bold; text-transform: uppercase;">PRODUCTOS EN ESTA CAJA:</td>
          <td style="width: 65%; border: 1.5pt solid #000; padding: 8pt 10pt;">
            <div style="font-size: 26pt; font-weight: bold; margin-bottom: 4pt;">CAJA ${b}/${total}</div>
            ${box.boxSubtitle ? `<div style="font-size: 11pt; font-weight: bold; margin-bottom: 6pt; text-transform: uppercase;">${escapeHtml(box.boxSubtitle)}</div>` : ''}
            <ul style="margin: 0; padding-left: 20pt;">
              ${productsListHtml}
            </ul>
          </td>
        </tr>
        <tr>
          <td style="width: 35%; border: 1.5pt solid #000; padding: 8pt 10pt; font-weight: bold; text-transform: uppercase;">NOTA IMPORTANTE:</td>
          <td style="width: 65%; border: 1.5pt solid #000; padding: 8pt 10pt; font-weight: bold; text-transform: uppercase;">
            ${escapeHtml(data.note)}
          </td>
        </tr>
      </table>
    `;
  }

  const wordHtml = `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset='utf-8'>
    <title>Etiquetas de Cajas - INTYLACT</title>
    <!--[if gte mso 9]>
    <xml>
      <w:WordDocument>
        <w:View>Print</w:View>
        <w:Zoom>100</w:Zoom>
        <w:DoNotOptimizeForBrowser/>
      </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
      @page Section1 {
        size: 8.5in 11.0in;
        margin: 0.6in 0.7in 0.6in 0.7in;
        mso-header-margin: 0.5in;
        mso-footer-margin: 0.5in;
        mso-paper-source: 0;
      }
      div.Section1 { page: Section1; }
      body { font-family: 'Neue Machina Bold', 'Neue Machina', Arial, Helvetica, sans-serif; color: #000000; }
    </style>
  </head>
  <body>
    <div class="Section1">
      ${boxesWord}
    </div>
  </body>
  </html>
  `;

  const blob = new Blob(['\ufeff' + wordHtml], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeEvent = (data.eventName || 'Evento').substring(0, 18).replace(/[^a-zA-Z0-9]/g, '_');
  a.download = `Etiquetas_${total}Cajas_${safeEvent}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Documento Word (.doc) generado y descargado con todas las cajas.', 'success');
}

function openLabelGuideModal() {
  const m = document.getElementById('modal-label-guide');
  if (m) m.classList.remove('hidden');
}

function closeLabelGuideModal() {
  const m = document.getElementById('modal-label-guide');
  if (m) m.classList.add('hidden');
}

function closeProcessedLabelModal() {
  const m = document.getElementById('modal-processed-label');
  if (m) m.classList.add('hidden');
}

// ==========================================
// 12. GESTIÓN DE LOGÍSTICA Y ARMADO DE PAQUETES (SOLO ADMINISTRADOR)
// ==========================================

let logisticsBoxesData = {
  1: {
    quantities: {},
    customName: '',
    boxSubtitle: 'REGALOS EN STAND'
  }
};
let currentLogisticsBox = 1;
let currentLogisticsCategory = '';
let currentLogisticsEditingPackageId = null;
let logisticsFilterStatus = 'todos';
let logisticsSearchQuery = '';
let logisticsSectionInitialized = false;

function getLogisticsPackages() {
  try {
    const raw = localStorage.getItem(INTY_STORAGE_KEYS.LOGISTICS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}

  const requests = getRequests();
  const approvedReqs = requests.filter(r => (r.status || '').toLowerCase() === 'aprobado');
  const defaults = [];

  if (approvedReqs.length > 0) {
    const r1 = approvedReqs[0];
    const bData1 = {
      1: {
        quantities: { p1: 50, p7: 50, p4: 20 },
        customName: '',
        boxSubtitle: 'REGALOS EN STAND'
      },
      2: {
        quantities: { p13: 15, p14: 10, p15: 10 },
        customName: '',
        boxSubtitle: 'MATERIAL PROMOTORA'
      }
    };
    defaults.push({
      id: 'LOG-INTY-001',
      requestId: r1.id,
      isManual: false,
      eventName: r1.details?.eventName || 'Torneo Femenino Intysquad & Bienestar 2026',
      responsibleName: r1.organizer?.name || 'Valeria Morales Rivas',
      responsibleId: r1.organizer?.idDocument || 'V- 25412890',
      phone: r1.organizer?.whatsapp || r1.organizer?.phone || '+58 412 889 4521',
      address: r1.details?.location || 'Canchas La Guairita, Complejo Deportivo Sport Center, Caracas',
      boxNum: 1,
      boxTotal: 2,
      boxSubtitle: 'REGALOS EN STAND',
      note: 'POR FAVOR AL RETIRAR ESTE PAQUETE, NOTIFICAR AL EQUIPO DE RELACIONES PÚBLICAS',
      status: 'Armado',
      boxesData: bData1,
      totalUnits: 155,
      itemsCount: 6,
      createdAt: '2026-10-09T14:00:00.000Z',
      updatedAt: '2026-10-10T11:30:00.000Z'
    });

    if (approvedReqs.length > 1) {
      const r2 = approvedReqs[1];
      const bData2 = {
        1: {
          quantities: { p1: 40, p2: 30, p13: 25 },
          customName: '',
          boxSubtitle: 'MUESTRAS Y KITS'
        }
      };
      defaults.push({
        id: 'LOG-INTY-002',
        requestId: r2.id,
        isManual: false,
        eventName: r2.details?.eventName || '6ta Edicion Carrera Caminata 5K',
        responsibleName: r2.organizer?.name || 'Valeria Leones',
        responsibleId: r2.organizer?.idDocument || 'V- 32196229',
        phone: r2.organizer?.whatsapp || r2.organizer?.phone || '04126681611',
        address: r2.details?.location || 'Guacuira Arriba, Municipio Falcón, Estado Falcón',
        boxNum: 1,
        boxTotal: 1,
        boxSubtitle: 'MUESTRAS Y KITS',
        note: 'POR FAVOR AL RETIRAR ESTE PAQUETE, NOTIFICAR AL EQUIPO DE RELACIONES PÚBLICAS',
        status: 'En Proceso',
        boxesData: bData2,
        totalUnits: 95,
        itemsCount: 3,
        createdAt: '2026-10-11T09:20:00.000Z',
        updatedAt: '2026-10-11T09:20:00.000Z'
      });
    }
  }

  defaults.push({
    id: 'LOG-MAN-003',
    requestId: '',
    isManual: true,
    eventName: 'Jornada Ginecológica y Bienestar Femenino Centro Médico Docente',
    responsibleName: 'Dra. Andrea Colmenares',
    responsibleId: 'V- 18945612',
    phone: '04143219988',
    address: 'Av. Principal San Román, Policlínica Las Mercedes, Caracas',
    boxNum: 1,
    boxTotal: 1,
    boxSubtitle: 'MUESTRAS MÉDICAS',
    note: 'ENTREGA DIRECTA EN CONSULTORIO',
    status: 'Entregado',
    boxesData: {
      1: {
        quantities: { p1: 50, p2: 50, p38: 2 },
        customName: '',
        boxSubtitle: 'MUESTRAS MÉDICAS'
      }
    },
    totalUnits: 102,
    itemsCount: 3,
    createdAt: '2026-10-08T10:00:00.000Z',
    updatedAt: '2026-10-09T16:45:00.000Z'
  });

  localStorage.setItem(INTY_STORAGE_KEYS.LOGISTICS, JSON.stringify(defaults));
  return defaults;
}

function saveLogisticsPackages(packages) {
  localStorage.setItem(INTY_STORAGE_KEYS.LOGISTICS, JSON.stringify(packages));
}

function ensureLogisticsBoxDataExists(b) {
  if (!logisticsBoxesData[b]) {
    logisticsBoxesData[b] = {
      quantities: {},
      customName: '',
      boxSubtitle: 'REGALOS EN STAND'
    };
    LABEL_PRODUCT_CATALOG.forEach(p => {
      logisticsBoxesData[b].quantities[p.id] = 0;
    });
  }
}

function initLogisticsSection() {
  populateLogisticsApprovedEventsSelector();

  if (!logisticsSectionInitialized) {
    logisticsBoxesData = {
      1: { quantities: {}, customName: '', boxSubtitle: 'REGALOS EN STAND' }
    };
    LABEL_PRODUCT_CATALOG.forEach(p => {
      logisticsBoxesData[1].quantities[p.id] = 0;
    });
    currentLogisticsBox = 1;
    logisticsSectionInitialized = true;
  }

  const packages = getLogisticsPackages();
  if (!currentLogisticsEditingPackageId && packages.length > 0) {
    loadLogisticsPackageIntoForm(packages[0]);
  } else {
    renderLogisticsBoxSelectorTabs();
    renderLogisticsProductCatalog();
    updateLogisticsSelectedSummary();
  }

  updateLogisticsKpis();
  renderLogisticsTable();
}

function populateLogisticsApprovedEventsSelector() {
  const select = document.getElementById('logistics-select-approved-event');
  if (!select) return;

  const requests = getRequests();
  const approvedReqs = requests.filter(r => (r.status || '').toLowerCase() === 'aprobado');

  let html = '<option value="">-- Seleccionar evento aprobado --</option>';
  approvedReqs.forEach(req => {
    const eventName = req.details?.eventName || 'Evento sin nombre';
    const orgName = req.organizer?.name ? `(${req.organizer.name})` : '';
    html += `<option value="${req.id}">✓ ${req.id} - ${escapeHtml(eventName)} ${escapeHtml(orgName)}</option>`;
  });

  select.innerHTML = html;
}

function onSelectLogisticsApprovedEvent(requestId) {
  if (!requestId) return;
  const requests = getRequests();
  const req = requests.find(r => r.id === requestId);
  if (!req) return;

  const packages = getLogisticsPackages();
  const existingPkg = packages.find(p => p.requestId === requestId);

  if (existingPkg) {
    loadLogisticsPackageIntoForm(existingPkg);
    showToast(`Paquete cargado para "${req.details?.eventName || req.id}".`, 'info');
  } else {
    currentLogisticsEditingPackageId = null;
    const nameInput = document.getElementById('logistics-input-event-name');
    const respNameInput = document.getElementById('logistics-input-responsible-name');
    const respIdInput = document.getElementById('logistics-input-responsible-id');
    const phoneInput = document.getElementById('logistics-input-phone');
    const addressInput = document.getElementById('logistics-input-address');
    const boxNumInput = document.getElementById('logistics-input-box-num');
    const boxTotalInput = document.getElementById('logistics-input-box-total');
    const boxLabelInput = document.getElementById('logistics-input-box-label');
    const boxSubInput = document.getElementById('logistics-input-box-subtitle');
    const noteInput = document.getElementById('logistics-input-note');
    const currentReqInput = document.getElementById('logistics-current-request-id');
    const currentPkgInput = document.getElementById('logistics-current-package-id');
    const sourceBadge = document.getElementById('logistics-edit-source-badge');
    const modePill = document.getElementById('logistics-mode-pill');

    if (nameInput) nameInput.value = req.details?.eventName || '';
    if (respNameInput) respNameInput.value = req.organizer?.name || '';
    if (respIdInput) respIdInput.value = req.organizer?.idDocument || '';
    if (phoneInput) phoneInput.value = req.organizer?.whatsapp || req.organizer?.phone || '';
    if (addressInput) addressInput.value = req.details?.location || '';
    if (boxNumInput) boxNumInput.value = 1;
    if (boxTotalInput) boxTotalInput.value = 1;
    if (boxLabelInput) boxLabelInput.value = 'CAJA 1/1';
    if (boxSubInput) boxSubInput.value = 'REGALOS EN STAND';
    if (noteInput) noteInput.value = 'POR FAVOR AL RETIRAR ESTE PAQUETE, NOTIFICAR AL EQUIPO DE RELACIONES PÚBLICAS';
    if (currentReqInput) currentReqInput.value = req.id;
    if (currentPkgInput) currentPkgInput.value = '';
    if (sourceBadge) sourceBadge.textContent = `Aprobado (${req.id})`;
    if (modePill) {
      modePill.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800';
      modePill.textContent = 'Evento Aprobado';
    }

    setLogisticsFormStatus('En Proceso');

    logisticsBoxesData = {
      1: { quantities: {}, customName: '', boxSubtitle: 'REGALOS EN STAND' }
    };
    LABEL_PRODUCT_CATALOG.forEach(p => {
      logisticsBoxesData[1].quantities[p.id] = 0;
    });
    currentLogisticsBox = 1;

    renderLogisticsBoxSelectorTabs();
    renderLogisticsProductCatalog();
    updateLogisticsSelectedSummary();
    showToast(`Datos del evento "${req.details?.eventName}" cargados con éxito.`, 'success');
  }
}

function startNewManualLogisticsPackage() {
  currentLogisticsEditingPackageId = null;
  const select = document.getElementById('logistics-select-approved-event');
  if (select) select.value = '';

  const nameInput = document.getElementById('logistics-input-event-name');
  const respNameInput = document.getElementById('logistics-input-responsible-name');
  const respIdInput = document.getElementById('logistics-input-responsible-id');
  const phoneInput = document.getElementById('logistics-input-phone');
  const addressInput = document.getElementById('logistics-input-address');
  const boxNumInput = document.getElementById('logistics-input-box-num');
  const boxTotalInput = document.getElementById('logistics-input-box-total');
  const boxLabelInput = document.getElementById('logistics-input-box-label');
  const boxSubInput = document.getElementById('logistics-input-box-subtitle');
  const noteInput = document.getElementById('logistics-input-note');
  const currentReqInput = document.getElementById('logistics-current-request-id');
  const currentPkgInput = document.getElementById('logistics-current-package-id');
  const sourceBadge = document.getElementById('logistics-edit-source-badge');
  const modePill = document.getElementById('logistics-mode-pill');

  if (nameInput) {
    nameInput.value = '';
    nameInput.focus();
  }
  if (respNameInput) respNameInput.value = '';
  if (respIdInput) respIdInput.value = '';
  if (phoneInput) phoneInput.value = '';
  if (addressInput) addressInput.value = '';
  if (boxNumInput) boxNumInput.value = 1;
  if (boxTotalInput) boxTotalInput.value = 1;
  if (boxLabelInput) boxLabelInput.value = 'CAJA 1/1';
  if (boxSubInput) boxSubInput.value = 'REGALOS EN STAND';
  if (noteInput) noteInput.value = 'POR FAVOR AL RETIRAR ESTE PAQUETE, NOTIFICAR AL EQUIPO DE RELACIONES PÚBLICAS';
  if (currentReqInput) currentReqInput.value = '';
  if (currentPkgInput) currentPkgInput.value = '';
  if (sourceBadge) sourceBadge.textContent = 'Evento Manual';
  if (modePill) {
    modePill.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800';
    modePill.textContent = 'Evento Manual (No Registrado)';
  }

  setLogisticsFormStatus('En Proceso');

  logisticsBoxesData = {
    1: { quantities: {}, customName: '', boxSubtitle: 'REGALOS EN STAND' }
  };
  LABEL_PRODUCT_CATALOG.forEach(p => {
    logisticsBoxesData[1].quantities[p.id] = 0;
  });
  currentLogisticsBox = 1;

  renderLogisticsBoxSelectorTabs();
  renderLogisticsProductCatalog();
  updateLogisticsSelectedSummary();
  showToast('Modo manual activo: Escribe los datos del evento no registrado y asigna los materiales.', 'info');
}

function setLogisticsFormStatus(status) {
  const hiddenInput = document.getElementById('logistics-input-status');
  if (hiddenInput) hiddenInput.value = status;

  const labelEl = document.getElementById('logistics-status-current-label');
  if (labelEl) {
    labelEl.textContent = status;
    if (status === 'En Proceso') {
      labelEl.className = 'text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800';
    } else if (status === 'Armado') {
      labelEl.className = 'text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800';
    } else if (status === 'Entregado') {
      labelEl.className = 'text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800';
    }
  }

  const btnProceso = document.getElementById('btn-status-proceso');
  const btnArmado = document.getElementById('btn-status-armado');
  const btnEntregado = document.getElementById('btn-status-entregado');

  const neutralClasses = 'py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 bg-white text-gray-700 border-gray-200';

  if (btnProceso) {
    btnProceso.className = status === 'En Proceso'
      ? 'py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 bg-amber-500 text-white border-amber-500 shadow-xs'
      : neutralClasses + ' hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300';
  }
  if (btnArmado) {
    btnArmado.className = status === 'Armado'
      ? 'py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-300'
      : neutralClasses + ' hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300';
  }
  if (btnEntregado) {
    btnEntregado.className = status === 'Entregado'
      ? 'py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 bg-emerald-600 text-white border-emerald-600 shadow-xs'
      : neutralClasses + ' hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300';
  }

  const labelBtn = document.getElementById('btn-logistics-label-action');
  if (labelBtn) {
    if (status === 'Armado') {
      labelBtn.className = 'text-xs py-2.5 px-4 font-black rounded-xl transition-all flex items-center gap-1.5 bg-[#d87a86] hover:bg-[#ba5763] text-white shadow-md ring-2 ring-[#d87a86] pulse-badge cursor-pointer active:scale-95';
      labelBtn.innerHTML = '<i class="fa-solid fa-tags"></i> <span>Etiquetar (Listo)</span>';
    } else {
      labelBtn.className = 'text-xs py-2.5 px-4 font-extrabold rounded-xl transition-all flex items-center gap-1.5 bg-[#d87a86] hover:bg-[#ba5763] text-white shadow-xs cursor-pointer active:scale-95';
      labelBtn.innerHTML = '<i class="fa-solid fa-tags"></i> <span>Etiquetar</span>';
    }
  }
}

function updateLogisticsBoxLabelText() {
  const numInput = document.getElementById('logistics-input-box-num');
  const totalInput = document.getElementById('logistics-input-box-total');
  const labelInput = document.getElementById('logistics-input-box-label');

  let num = parseInt(numInput?.value, 10) || 1;
  let total = parseInt(totalInput?.value, 10) || 1;

  if (total < 1) total = 1;
  if (num < 1) num = 1;
  if (num > total) num = total;

  if (numInput) numInput.value = num;
  if (totalInput) totalInput.value = total;
  if (labelInput) labelInput.value = `CAJA ${num}/${total}`;

  for (let b = 1; b <= total; b++) {
    ensureLogisticsBoxDataExists(b);
  }

  currentLogisticsBox = num;
  renderLogisticsBoxSelectorTabs();
  renderLogisticsProductCatalog();
  updateLogisticsSelectedSummary();
}

function updateLogisticsCurrentBoxSubtitle(val) {
  ensureLogisticsBoxDataExists(currentLogisticsBox);
  logisticsBoxesData[currentLogisticsBox].boxSubtitle = val;
}

function selectLogisticsBoxToEdit(b) {
  const total = Math.max(1, parseInt(document.getElementById('logistics-input-box-total')?.value, 10) || 1);
  currentLogisticsBox = Math.max(1, Math.min(total, b));
  ensureLogisticsBoxDataExists(currentLogisticsBox);

  const numInput = document.getElementById('logistics-input-box-num');
  if (numInput) numInput.value = currentLogisticsBox;
  const labelInput = document.getElementById('logistics-input-box-label');
  if (labelInput) labelInput.value = `CAJA ${currentLogisticsBox}/${total}`;

  const subInput = document.getElementById('logistics-input-box-subtitle');
  if (subInput && logisticsBoxesData[currentLogisticsBox].boxSubtitle !== undefined) {
    subInput.value = logisticsBoxesData[currentLogisticsBox].boxSubtitle;
  }

  const searchInput = document.getElementById('logistics-product-search');
  renderLogisticsProductCatalog(searchInput ? searchInput.value : '');
  renderLogisticsBoxSelectorTabs();
  updateLogisticsSelectedSummary();
}

function copyCurrentLogisticsBoxItemsToAll() {
  const total = Math.max(1, parseInt(document.getElementById('logistics-input-box-total')?.value, 10) || 1);
  if (total <= 1) {
    showToast('Aumenta el "Total Cajas" para configurar varias cajas.', 'info');
    return;
  }
  ensureLogisticsBoxDataExists(currentLogisticsBox);
  const currentQtys = { ...logisticsBoxesData[currentLogisticsBox].quantities };
  const currentCustom = logisticsBoxesData[currentLogisticsBox].customName || '';

  for (let b = 1; b <= total; b++) {
    ensureLogisticsBoxDataExists(b);
    logisticsBoxesData[b].quantities = { ...currentQtys };
    logisticsBoxesData[b].customName = currentCustom;
  }

  renderLogisticsBoxSelectorTabs();
  updateLogisticsSelectedSummary();
  showToast(`Materiales de Caja ${currentLogisticsBox}/${total} copiados a todas las cajas.`, 'success');
}

function clearCurrentLogisticsBoxItems() {
  ensureLogisticsBoxDataExists(currentLogisticsBox);
  LABEL_PRODUCT_CATALOG.forEach(p => {
    logisticsBoxesData[currentLogisticsBox].quantities[p.id] = 0;
  });
  logisticsBoxesData[currentLogisticsBox].customName = '';

  const searchInput = document.getElementById('logistics-product-search');
  renderLogisticsProductCatalog(searchInput ? searchInput.value : '');
  renderLogisticsBoxSelectorTabs();
  updateLogisticsSelectedSummary();
  showToast(`Materiales de Caja ${currentLogisticsBox} restablecidos a 0.`, 'info');
}

function resetAllLogisticsProductQtys() {
  clearCurrentLogisticsBoxItems();
}

function filterLogisticsProducts(query) {
  renderLogisticsProductCatalog(query);
}

function filterLogisticsCategory(cat) {
  currentLogisticsCategory = (cat || '').toLowerCase().trim();
  const chips = document.querySelectorAll('.category-chip-logistics');
  chips.forEach(c => c.classList.remove('active'));

  const clicked = event ? event.target.closest('.category-chip-logistics') : null;
  if (clicked) clicked.classList.add('active');

  const searchInput = document.getElementById('logistics-product-search');
  renderLogisticsProductCatalog(searchInput ? searchInput.value : '');
}

function renderLogisticsBoxSelectorTabs() {
  const container = document.getElementById('logistics-box-tabs-container');
  if (!container) return;

  const total = Math.max(1, parseInt(document.getElementById('logistics-input-box-total')?.value, 10) || 1);

  for (let b = 1; b <= total; b++) {
    ensureLogisticsBoxDataExists(b);
  }

  let html = '';
  for (let b = 1; b <= total; b++) {
    const boxData = logisticsBoxesData[b];
    let unitCount = 0;
    let itemCount = 0;

    LABEL_PRODUCT_CATALOG.forEach(p => {
      const q = (boxData.quantities && boxData.quantities[p.id]) || 0;
      if (q > 0) {
        itemCount++;
        unitCount += q;
      }
    });

    const isActive = (b === currentLogisticsBox);
    const badgeText = itemCount > 0 ? `${unitCount} un.` : '0 un.';
    const activeClasses = isActive
      ? 'bg-[#0f3042] text-white shadow-sm ring-2 ring-[#d87a86]'
      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200';

    html += `
      <button type="button" onclick="selectLogisticsBoxToEdit(${b})" class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeClasses}">
        <span>Caja ${b}/${total}</span>
        <span class="text-[10px] px-1.5 py-0.5 rounded font-semibold ${isActive ? 'bg-[#d87a86] text-white' : 'bg-gray-100 text-gray-600'}">
          ${badgeText}
        </span>
      </button>
    `;
  }

  container.innerHTML = html;
}

function renderLogisticsProductCatalog(query = '') {
  const container = document.getElementById('logistics-products-container');
  if (!container) return;

  ensureLogisticsBoxDataExists(currentLogisticsBox);
  const currentBoxData = logisticsBoxesData[currentLogisticsBox];
  const qClean = (query || '').toLowerCase().trim();

  const filtered = LABEL_PRODUCT_CATALOG.filter(p => {
    if (currentLogisticsCategory) {
      const pCat = p.category.toLowerCase();
      const pName = p.name.toLowerCase();
      if (!pCat.includes(currentLogisticsCategory) && !pName.includes(currentLogisticsCategory)) {
        return false;
      }
    }
    if (!qClean) return true;
    return p.name.toLowerCase().includes(qClean) || p.category.toLowerCase().includes(qClean);
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-gray-400 text-xs">
        <i class="fa-solid fa-box-open text-2xl mb-2 opacity-50"></i>
        <p>No se encontraron ítems que coincidan con la búsqueda.</p>
      </div>
    `;
    return;
  }

  let html = '';
  filtered.forEach(prod => {
    const originalIndex = LABEL_PRODUCT_CATALOG.findIndex(p => p.id === prod.id);
    const itemNumber = originalIndex >= 0 ? originalIndex + 1 : 1;
    const qty = (currentBoxData.quantities && currentBoxData.quantities[prod.id]) || 0;
    const hasQty = qty > 0;

    if (prod.isCustom) {
      const customVal = escapeHtml(currentBoxData.customName || '');
      html += `
        <div class="logistics-product-row p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all ${hasQty ? 'has-qty border-[#d87a86] bg-[#faebee]/30 shadow-xs' : 'border-gray-100 bg-white hover:border-gray-200'}">
          <div class="flex-grow min-w-0 pr-2">
            <div class="flex items-center gap-2 mb-1.5">
              <span class="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                #${itemNumber}
              </span>
              <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#faebee] text-[#d87a86] uppercase">
                ${prod.category}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-black text-[#0f3042] whitespace-nowrap">OTRO:</span>
              <input type="text" value="${customVal}" oninput="onLogisticsCustomNameChange(this.value)" placeholder="Escribe el nombre del ítem adicional..." class="form-input text-xs py-1 px-2.5 font-bold uppercase flex-grow">
            </div>
          </div>
          <div class="flex items-center gap-2 self-end sm:self-center">
            <button type="button" onclick="changeLogisticsProductQty('${prod.id}', -1)" class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#0f3042] font-black text-base flex items-center justify-center transition-colors active:scale-95 select-none" title="Disminuir cantidad (-)">
              <span style="font-size: 18px; font-weight: 900; line-height: 1; display: inline-block;">&minus;</span>
            </button>
            <input type="number" min="0" max="9999" value="${qty}" oninput="setLogisticsProductQty('${prod.id}', this.value)" class="form-input text-xs font-black text-center w-16 py-1.5">
            <button type="button" onclick="changeLogisticsProductQty('${prod.id}', 1)" class="w-8 h-8 rounded-lg bg-[#faebee] hover:bg-[#f4d3d8] text-[#d87a86] font-black text-base flex items-center justify-center transition-colors active:scale-95 select-none" title="Aumentar cantidad (+)">
              <span style="font-size: 18px; font-weight: 900; line-height: 1; display: inline-block;">+</span>
            </button>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="logistics-product-row p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all ${hasQty ? 'has-qty border-[#d87a86] bg-[#faebee]/30 shadow-xs' : 'border-gray-100 bg-white hover:border-gray-200'}">
          <div class="flex-grow min-w-0 pr-2">
            <div class="flex items-center gap-2 mb-0.5">
              <span class="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                #${itemNumber}
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase">
                ${prod.category}
              </span>
            </div>
            <div class="text-xs font-black text-[#0f3042] uppercase tracking-tight truncate" title="${escapeHtml(prod.name)}">
              ${escapeHtml(prod.name)}
            </div>
          </div>
          <div class="flex items-center gap-2 self-end sm:self-center">
            <button type="button" onclick="changeLogisticsProductQty('${prod.id}', -1)" class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#0f3042] font-black text-base flex items-center justify-center transition-colors active:scale-95 select-none" title="Disminuir cantidad (-)">
              <span style="font-size: 18px; font-weight: 900; line-height: 1; display: inline-block;">&minus;</span>
            </button>
            <input type="number" min="0" max="9999" value="${qty}" oninput="setLogisticsProductQty('${prod.id}', this.value)" class="form-input text-xs font-black text-center w-16 py-1.5">
            <button type="button" onclick="changeLogisticsProductQty('${prod.id}', 1)" class="w-8 h-8 rounded-lg bg-[#faebee] hover:bg-[#f4d3d8] text-[#d87a86] font-black text-base flex items-center justify-center transition-colors active:scale-95 select-none" title="Aumentar cantidad (+)">
              <span style="font-size: 18px; font-weight: 900; line-height: 1; display: inline-block;">+</span>
            </button>
          </div>
        </div>
      `;
    }
  });

  container.innerHTML = html;
}

function changeLogisticsProductQty(prodId, delta) {
  ensureLogisticsBoxDataExists(currentLogisticsBox);
  const current = (logisticsBoxesData[currentLogisticsBox].quantities && logisticsBoxesData[currentLogisticsBox].quantities[prodId]) || 0;
  const next = Math.max(0, current + delta);
  logisticsBoxesData[currentLogisticsBox].quantities[prodId] = next;

  const searchInput = document.getElementById('logistics-product-search');
  renderLogisticsProductCatalog(searchInput ? searchInput.value : '');
  renderLogisticsBoxSelectorTabs();
  updateLogisticsSelectedSummary();
}

function setLogisticsProductQty(prodId, val) {
  ensureLogisticsBoxDataExists(currentLogisticsBox);
  const next = Math.max(0, parseInt(val, 10) || 0);
  logisticsBoxesData[currentLogisticsBox].quantities[prodId] = next;

  renderLogisticsBoxSelectorTabs();
  updateLogisticsSelectedSummary();
}

function onLogisticsCustomNameChange(name) {
  ensureLogisticsBoxDataExists(currentLogisticsBox);
  logisticsBoxesData[currentLogisticsBox].customName = (name || '').trim();
  updateLogisticsSelectedSummary();
}

function updateLogisticsSelectedSummary() {
  ensureLogisticsBoxDataExists(currentLogisticsBox);
  const currentBoxData = logisticsBoxesData[currentLogisticsBox];
  let selectedCount = 0;
  let totalUnits = 0;
  let itemsList = [];

  LABEL_PRODUCT_CATALOG.forEach(p => {
    const qty = (currentBoxData.quantities && currentBoxData.quantities[p.id]) || 0;
    if (qty > 0) {
      selectedCount++;
      totalUnits += qty;
      let displayName = p.name;
      if (p.isCustom) {
        displayName = (currentBoxData.customName || 'PRODUCTO ADICIONAL').toUpperCase();
      }
      itemsList.push({ name: displayName, qty });
    }
  });

  const counterEl = document.getElementById('logistics-products-counter');
  if (counterEl) {
    counterEl.textContent = `${selectedCount} ${selectedCount === 1 ? 'ítem' : 'ítems'}`;
  }

  const badgeEl = document.getElementById('logistics-total-units-badge');
  if (badgeEl) {
    badgeEl.textContent = `${totalUnits} unidades en Caja ${currentLogisticsBox}`;
  }

  const previewEl = document.getElementById('logistics-selected-list-preview');
  if (previewEl) {
    if (itemsList.length === 0) {
      previewEl.innerHTML = '<span class="text-gray-400 italic">No hay productos seleccionados aún en esta caja.</span>';
    } else {
      let html = '<ul class="space-y-1">';
      itemsList.forEach(item => {
        html += `<li class="flex items-center justify-between text-[11px]"><span class="truncate font-semibold">${escapeHtml(item.name)}</span><span class="font-bold text-[#0f3042] ml-2 whitespace-nowrap">${item.qty} un.</span></li>`;
      });
      html += '</ul>';
      previewEl.innerHTML = html;
    }
  }
}

function loadLogisticsPackageIntoForm(pkg) {
  if (!pkg) return;
  currentLogisticsEditingPackageId = pkg.id;

  const nameInput = document.getElementById('logistics-input-event-name');
  const respNameInput = document.getElementById('logistics-input-responsible-name');
  const respIdInput = document.getElementById('logistics-input-responsible-id');
  const phoneInput = document.getElementById('logistics-input-phone');
  const addressInput = document.getElementById('logistics-input-address');
  const boxNumInput = document.getElementById('logistics-input-box-num');
  const boxTotalInput = document.getElementById('logistics-input-box-total');
  const boxLabelInput = document.getElementById('logistics-input-box-label');
  const boxSubInput = document.getElementById('logistics-input-box-subtitle');
  const noteInput = document.getElementById('logistics-input-note');
  const currentReqInput = document.getElementById('logistics-current-request-id');
  const currentPkgInput = document.getElementById('logistics-current-package-id');
  const sourceBadge = document.getElementById('logistics-edit-source-badge');
  const modePill = document.getElementById('logistics-mode-pill');
  const select = document.getElementById('logistics-select-approved-event');

  if (nameInput) nameInput.value = pkg.eventName || '';
  if (respNameInput) respNameInput.value = pkg.responsibleName || '';
  if (respIdInput) respIdInput.value = pkg.responsibleId || '';
  if (phoneInput) phoneInput.value = pkg.phone || '';
  if (addressInput) addressInput.value = pkg.address || '';
  if (boxNumInput) boxNumInput.value = 1;
  if (boxTotalInput) boxTotalInput.value = pkg.boxTotal || 1;
  if (boxLabelInput) boxLabelInput.value = `CAJA 1/${pkg.boxTotal || 1}`;
  if (boxSubInput) boxSubInput.value = pkg.boxSubtitle || 'REGALOS EN STAND';
  if (noteInput) noteInput.value = pkg.note || 'POR FAVOR AL RETIRAR ESTE PAQUETE, NOTIFICAR AL EQUIPO DE RELACIONES PÚBLICAS';
  if (currentReqInput) currentReqInput.value = pkg.requestId || '';
  if (currentPkgInput) currentPkgInput.value = pkg.id || '';

  if (sourceBadge) {
    sourceBadge.textContent = pkg.isManual ? 'Evento Manual' : `Aprobado (${pkg.requestId || 'Sistema'})`;
  }
  if (modePill) {
    if (pkg.isManual) {
      modePill.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800';
      modePill.textContent = 'Evento Manual';
    } else {
      modePill.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800';
      modePill.textContent = 'Evento Aprobado';
    }
  }
  if (select) {
    select.value = pkg.requestId || '';
  }

  setLogisticsFormStatus(pkg.status || 'En Proceso');

  if (pkg.boxesData && Object.keys(pkg.boxesData).length > 0) {
    logisticsBoxesData = JSON.parse(JSON.stringify(pkg.boxesData));
  } else {
    logisticsBoxesData = { 1: { quantities: {}, customName: '', boxSubtitle: pkg.boxSubtitle || 'REGALOS EN STAND' } };
    LABEL_PRODUCT_CATALOG.forEach(p => { logisticsBoxesData[1].quantities[p.id] = 0; });
  }

  currentLogisticsBox = 1;
  ensureLogisticsBoxDataExists(1);
  renderLogisticsBoxSelectorTabs();
  renderLogisticsProductCatalog();
  updateLogisticsSelectedSummary();

  // Sincronizar automáticamente con Etiquetado
  syncLogisticsToLabeling(pkg);
}

function saveLogisticsPackage() {
  const name = document.getElementById('logistics-input-event-name')?.value.trim();
  if (!name) {
    alert('Por favor, ingresa el Nombre del Evento para continuar.');
    document.getElementById('logistics-input-event-name')?.focus();
    return null;
  }

  const responsibleName = document.getElementById('logistics-input-responsible-name')?.value.trim() || '';
  const responsibleId = document.getElementById('logistics-input-responsible-id')?.value.trim() || '';
  const phone = document.getElementById('logistics-input-phone')?.value.trim() || '';
  const address = document.getElementById('logistics-input-address')?.value.trim() || '';
  const boxTotal = Math.max(1, parseInt(document.getElementById('logistics-input-box-total')?.value, 10) || 1);
  const boxSubtitle = document.getElementById('logistics-input-box-subtitle')?.value.trim() || 'REGALOS EN STAND';
  const note = document.getElementById('logistics-input-note')?.value.trim() || '';
  const status = document.getElementById('logistics-input-status')?.value || 'En Proceso';
  const requestId = document.getElementById('logistics-current-request-id')?.value.trim() || '';
  let pkgId = document.getElementById('logistics-current-package-id')?.value.trim() || currentLogisticsEditingPackageId;

  for (let b = 1; b <= boxTotal; b++) {
    ensureLogisticsBoxDataExists(b);
  }

  let totalUnits = 0;
  let itemsSet = new Set();
  for (let b = 1; b <= boxTotal; b++) {
    const bData = logisticsBoxesData[b];
    if (bData && bData.quantities) {
      LABEL_PRODUCT_CATALOG.forEach(p => {
        const q = bData.quantities[p.id] || 0;
        if (q > 0) {
          totalUnits += q;
          itemsSet.add(p.id);
        }
      });
    }
  }

  const packages = getLogisticsPackages();
  const isNew = !pkgId;

  if (isNew) {
    pkgId = 'LOG-' + (requestId ? requestId.replace('INTY-2026-', 'E-') : 'MAN-' + Date.now().toString().slice(-4));
  }

  const pkgData = {
    id: pkgId,
    requestId: requestId,
    isManual: !requestId,
    eventName: name,
    responsibleName,
    responsibleId,
    phone,
    address,
    boxNum: 1,
    boxTotal,
    boxSubtitle,
    note,
    status,
    boxesData: JSON.parse(JSON.stringify(logisticsBoxesData)),
    totalUnits,
    itemsCount: itemsSet.size,
    updatedAt: new Date().toISOString()
  };

  if (isNew) {
    pkgData.createdAt = new Date().toISOString();
    packages.unshift(pkgData);
  } else {
    const idx = packages.findIndex(p => p.id === pkgId);
    if (idx >= 0) {
      pkgData.createdAt = packages[idx].createdAt || new Date().toISOString();
      packages[idx] = pkgData;
    } else {
      packages.unshift(pkgData);
    }
  }

  currentLogisticsEditingPackageId = pkgId;
  const currentPkgInput = document.getElementById('logistics-current-package-id');
  if (currentPkgInput) currentPkgInput.value = pkgId;

  saveLogisticsPackages(packages);
  updateLogisticsKpis();
  renderLogisticsTable();

  // Sincronizar automáticamente con Etiquetado
  syncLogisticsToLabeling(pkgData);

  showToast(`Paquete "${name}" guardado en Logística y sincronizado con Etiquetado.`, 'success');
  return pkgData;
}

function syncLogisticsToLabeling(pkg) {
  if (!pkg) return;
  const nameInput = document.getElementById('label-input-event-name');
  const respNameInput = document.getElementById('label-input-responsible-name');
  const respIdInput = document.getElementById('label-input-responsible-id');
  const phoneInput = document.getElementById('label-input-phone');
  const addressInput = document.getElementById('label-input-address');
  const boxTotalInput = document.getElementById('label-input-box-total');
  const boxNumInput = document.getElementById('label-input-box-num');
  const boxSubtitleInput = document.getElementById('label-input-box-subtitle');
  const noteInput = document.getElementById('label-input-note');

  if (nameInput) nameInput.value = pkg.eventName || '';
  if (respNameInput) respNameInput.value = pkg.responsibleName || '';
  if (respIdInput) respIdInput.value = pkg.responsibleId || '';
  if (phoneInput) phoneInput.value = pkg.phone || '';
  if (addressInput) addressInput.value = pkg.address || '';
  if (boxTotalInput) boxTotalInput.value = pkg.boxTotal || 1;
  if (boxNumInput) boxNumInput.value = 1;
  if (boxSubtitleInput) boxSubtitleInput.value = pkg.boxSubtitle || 'REGALOS EN STAND';
  if (noteInput) noteInput.value = pkg.note || 'POR FAVOR AL RETIRAR ESTE PAQUETE, NOTIFICAR AL EQUIPO DE RELACIONES PÚBLICAS';

  if (pkg.boxesData && Object.keys(pkg.boxesData).length > 0) {
    labelBoxesData = JSON.parse(JSON.stringify(pkg.boxesData));
  } else {
    labelBoxesData = { 1: { quantities: {}, customName: '', boxSubtitle: pkg.boxSubtitle || 'REGALOS EN STAND' } };
    LABEL_PRODUCT_CATALOG.forEach(p => { labelBoxesData[1].quantities[p.id] = 0; });
  }

  currentEditingBox = 1;
  currentPreviewBox = 'all';
  ensureBoxDataExists(1);
  labelProductsQuantities = labelBoxesData[1].quantities;
  labelCustomItemName = labelBoxesData[1].customName || '';

  const customInput = document.getElementById('label-custom-item-name');
  if (customInput) customInput.value = labelCustomItemName;

  renderBoxSelectorTabs();
  renderLabelProductCatalog();
  updateLabelSelectedSummary();
  updateLiveLabelSheet();
}

function labelCurrentLogisticsPackage() {
  const pkg = saveLogisticsPackage();
  if (!pkg) return;

  syncLogisticsToLabeling(pkg);
  navigateTo('labeling');
  showToast('Evento cargado en Etiquetado. Listo para generar e imprimir rótulos de cajas.', 'success');
}

function labelLogisticsPackageById(packageId) {
  const packages = getLogisticsPackages();
  const pkg = packages.find(p => p.id === packageId);
  if (!pkg) return;

  syncLogisticsToLabeling(pkg);
  navigateTo('labeling');
  showToast(`Evento "${pkg.eventName}" cargado en Etiquetado. Listo para rotular.`, 'success');
}

function updateLogisticsStatusQuick(packageId, newStatus) {
  const packages = getLogisticsPackages();
  const pkg = packages.find(p => p.id === packageId);
  if (!pkg) return;

  pkg.status = newStatus;
  pkg.updatedAt = new Date().toISOString();
  saveLogisticsPackages(packages);

  if (currentLogisticsEditingPackageId === packageId) {
    setLogisticsFormStatus(newStatus);
  }

  updateLogisticsKpis();
  renderLogisticsTable();

  if (newStatus === 'Armado') {
    showToast(`Paquete ${pkg.id} marcado como ARMADO. ¡Listo para Etiquetar!`, 'success');
  } else {
    showToast(`Status actualizado a "${newStatus}" para ${pkg.id}.`, 'info');
  }
}

function deleteLogisticsPackage(packageId) {
  const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este paquete del control de logística?');
  if (!confirmDelete) return;

  let packages = getLogisticsPackages();
  packages = packages.filter(p => p.id !== packageId);
  saveLogisticsPackages(packages);

  if (currentLogisticsEditingPackageId === packageId) {
    resetLogisticsForm();
  }

  updateLogisticsKpis();
  renderLogisticsTable();
  showToast('Paquete eliminado de logística.', 'info');
}

function updateLogisticsKpis() {
  const packages = getLogisticsPackages();
  const total = packages.length;
  const proceso = packages.filter(p => (p.status || '').toLowerCase() === 'en proceso').length;
  const armado = packages.filter(p => (p.status || '').toLowerCase() === 'armado').length;
  const entregado = packages.filter(p => (p.status || '').toLowerCase() === 'entregado').length;

  const elTotal = document.getElementById('logistics-kpi-total');
  const elProceso = document.getElementById('logistics-kpi-proceso');
  const elArmado = document.getElementById('logistics-kpi-armado');
  const elEntregado = document.getElementById('logistics-kpi-entregado');

  if (elTotal) elTotal.textContent = total;
  if (elProceso) elProceso.textContent = proceso;
  if (elArmado) elArmado.textContent = armado;
  if (elEntregado) elEntregado.textContent = entregado;
}

function filterLogisticsByStatus(status) {
  logisticsFilterStatus = status;

  const buttons = document.querySelectorAll('.logistics-status-filter-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active', 'bg-[#0f3042]', 'text-white');
    btn.classList.add('text-gray-600');
  });

  const activeId = status === 'todos' ? 'filter-btn-log-todos' :
    status === 'En Proceso' ? 'filter-btn-log-proceso' :
    status === 'Armado' ? 'filter-btn-log-armado' : 'filter-btn-log-entregado';
  const activeBtn = document.getElementById(activeId);
  if (activeBtn) {
    activeBtn.classList.add('active', 'bg-[#0f3042]', 'text-white');
    activeBtn.classList.remove('text-gray-600');
  }

  renderLogisticsTable();
}

function onLogisticsTableSearch(query) {
  logisticsSearchQuery = (query || '').toLowerCase().trim();
  renderLogisticsTable();
}

function renderLogisticsTable() {
  const tbody = document.getElementById('logistics-table-tbody');
  if (!tbody) return;

  const packages = getLogisticsPackages();
  let list = [...packages];

  if (logisticsFilterStatus !== 'todos') {
    list = list.filter(p => (p.status || '').toLowerCase() === logisticsFilterStatus.toLowerCase());
  }

  if (logisticsSearchQuery) {
    list = list.filter(p => {
      const idMatch = (p.id || '').toLowerCase().includes(logisticsSearchQuery);
      const nameMatch = (p.eventName || '').toLowerCase().includes(logisticsSearchQuery);
      const respMatch = (p.responsibleName || '').toLowerCase().includes(logisticsSearchQuery);
      const addrMatch = (p.address || '').toLowerCase().includes(logisticsSearchQuery);
      return idMatch || nameMatch || respMatch || addrMatch;
    });
  }

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-12 text-center text-gray-400">
          <i class="fa-solid fa-boxes-packing text-3xl mb-2 opacity-40"></i>
          <p class="font-bold text-xs">No hay eventos en logística con el filtro seleccionado.</p>
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  list.forEach(pkg => {
    const isArmado = (pkg.status === 'Armado');
    const badgeClass = pkg.status === 'En Proceso' ? 'badge-proceso' :
      pkg.status === 'Armado' ? 'badge-armado' : 'badge-entregado';

    const originBadge = pkg.isManual
      ? '<span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">Manual</span>'
      : `<span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">${escapeHtml(pkg.requestId || 'Aprobado')}</span>`;

    let itemsPreview = '';
    const totalBoxes = pkg.boxTotal || 1;
    for (let b = 1; b <= Math.min(2, totalBoxes); b++) {
      const bData = (pkg.boxesData && pkg.boxesData[b]) || { quantities: {} };
      let bUnits = 0;
      LABEL_PRODUCT_CATALOG.forEach(p => {
        bUnits += (bData.quantities && bData.quantities[p.id]) || 0;
      });
      itemsPreview += `<span class="text-[10px] text-gray-500 block">Caja ${b}: ${bUnits} un.</span>`;
    }
    if (totalBoxes > 2) {
      itemsPreview += `<span class="text-[10px] text-gray-400 italic block">+${totalBoxes - 2} cajas más</span>`;
    }

    const labelBtnClass = isArmado
      ? 'px-2.5 py-1.5 bg-[#d87a86] hover:bg-[#ba5763] text-white rounded-lg text-xs font-black inline-flex items-center gap-1 shadow-sm ring-1 ring-[#d87a86] cursor-pointer'
      : 'px-2.5 py-1.5 bg-[#faebee] hover:bg-[#f4d3d8] text-[#0f3042] rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer';

    html += `
      <tr class="hover:bg-[#faf7f2] transition-colors">
        <td class="py-3 px-3.5 font-mono font-bold text-[#d87a86] text-xs align-top whitespace-nowrap">
          <div>${escapeHtml(pkg.id)}</div>
          <div class="mt-1">${originBadge}</div>
        </td>
        <td class="py-3 px-3.5 align-top">
          <div class="font-bold text-[#0f3042] text-xs uppercase leading-snug">${escapeHtml(pkg.eventName)}</div>
          <div class="text-[11px] text-gray-500 mt-1 truncate max-w-xs" title="${escapeHtml(pkg.address)}">
            <i class="fa-solid fa-location-dot text-gray-400 mr-1"></i>${escapeHtml(pkg.address || '—')}
          </div>
        </td>
        <td class="py-3 px-3.5 align-top text-xs">
          <div class="font-semibold text-[#0f3042]">${escapeHtml(pkg.responsibleName || '—')}</div>
          ${pkg.responsibleId ? `<div class="font-mono text-[11px] text-gray-500 font-bold">${escapeHtml(pkg.responsibleId)}</div>` : ''}
          <div class="text-[11px] text-gray-400 mt-0.5">${escapeHtml(pkg.phone || '—')}</div>
        </td>
        <td class="py-3 px-3.5 align-top text-center text-xs whitespace-nowrap">
          <div class="font-black text-[#0f3042]">${pkg.boxTotal || 1} ${pkg.boxTotal === 1 ? 'Caja' : 'Cajas'}</div>
          <div class="font-extrabold text-[#d87a86] text-[11px]">${pkg.totalUnits || 0} un. totales</div>
          <div class="mt-1 text-left inline-block">${itemsPreview}</div>
        </td>
        <td class="py-3 px-3.5 align-top text-center whitespace-nowrap">
          <div class="mb-1.5">
            <span class="badge-status ${badgeClass}">
              ${pkg.status || 'En Proceso'}
            </span>
          </div>
          <select onchange="updateLogisticsStatusQuick('${pkg.id}', this.value)" class="text-[11px] font-bold py-1 px-1.5 bg-white border border-gray-200 rounded-lg shadow-2xs cursor-pointer">
            <option value="En Proceso" ${pkg.status === 'En Proceso' ? 'selected' : ''}>En Proceso</option>
            <option value="Armado" ${pkg.status === 'Armado' ? 'selected' : ''}>Armado</option>
            <option value="Entregado" ${pkg.status === 'Entregado' ? 'selected' : ''}>Entregado</option>
          </select>
        </td>
        <td class="py-3 px-3.5 align-top text-right whitespace-nowrap">
          <div class="flex items-center justify-end gap-1.5">
            <button onclick="loadLogisticsPackageById('${pkg.id}')" class="px-2.5 py-1.5 bg-[#0f3042] text-white hover:bg-[#163f53] rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-all" title="Cargar datos en el formulario para editar">
              <i class="fa-solid fa-pen-to-square text-[10px]"></i>
              <span>Editar</span>
            </button>
            <button onclick="labelLogisticsPackageById('${pkg.id}')" class="${labelBtnClass}" title="Cargar y abrir en Etiquetado">
              <i class="fa-solid fa-tags text-[10px]"></i>
              <span>Etiquetar</span>
            </button>
            <button onclick="printSingleLogisticsSheet('${pkg.id}')" class="px-2.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-colors" title="Imprimir hoja de materiales para armar">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              <span>Imprimir</span>
            </button>
            <button onclick="deleteLogisticsPackage('${pkg.id}')" class="px-2 py-1.5 bg-gray-100 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold inline-flex items-center" title="Eliminar de logística">
              <i class="fa-solid fa-trash-can text-[11px]"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function loadLogisticsPackageById(packageId) {
  const packages = getLogisticsPackages();
  const pkg = packages.find(p => p.id === packageId);
  if (!pkg) return;

  loadLogisticsPackageIntoForm(pkg);
  window.scrollTo({ top: 350, behavior: 'smooth' });
  showToast(`Paquete "${pkg.eventName}" cargado en el formulario.`, 'info');
}

function resetLogisticsForm() {
  currentLogisticsEditingPackageId = null;
  const select = document.getElementById('logistics-select-approved-event');
  if (select) select.value = '';

  const nameInput = document.getElementById('logistics-input-event-name');
  const respNameInput = document.getElementById('logistics-input-responsible-name');
  const respIdInput = document.getElementById('logistics-input-responsible-id');
  const phoneInput = document.getElementById('logistics-input-phone');
  const addressInput = document.getElementById('logistics-input-address');
  const boxNumInput = document.getElementById('logistics-input-box-num');
  const boxTotalInput = document.getElementById('logistics-input-box-total');
  const boxLabelInput = document.getElementById('logistics-input-box-label');
  const boxSubInput = document.getElementById('logistics-input-box-subtitle');
  const noteInput = document.getElementById('logistics-input-note');
  const currentReqInput = document.getElementById('logistics-current-request-id');
  const currentPkgInput = document.getElementById('logistics-current-package-id');
  const sourceBadge = document.getElementById('logistics-edit-source-badge');

  if (nameInput) nameInput.value = '';
  if (respNameInput) respNameInput.value = '';
  if (respIdInput) respIdInput.value = '';
  if (phoneInput) phoneInput.value = '';
  if (addressInput) addressInput.value = '';
  if (boxNumInput) boxNumInput.value = 1;
  if (boxTotalInput) boxTotalInput.value = 1;
  if (boxLabelInput) boxLabelInput.value = 'CAJA 1/1';
  if (boxSubInput) boxSubInput.value = 'REGALOS EN STAND';
  if (noteInput) noteInput.value = 'POR FAVOR AL RETIRAR ESTE PAQUETE, NOTIFICAR AL EQUIPO DE RELACIONES PÚBLICAS';
  if (currentReqInput) currentReqInput.value = '';
  if (currentPkgInput) currentPkgInput.value = '';
  if (sourceBadge) sourceBadge.textContent = 'Nuevo Paquete';

  setLogisticsFormStatus('En Proceso');

  logisticsBoxesData = {
    1: { quantities: {}, customName: '', boxSubtitle: 'REGALOS EN STAND' }
  };
  LABEL_PRODUCT_CATALOG.forEach(p => {
    logisticsBoxesData[1].quantities[p.id] = 0;
  });
  currentLogisticsBox = 1;

  renderLogisticsBoxSelectorTabs();
  renderLogisticsProductCatalog();
  updateLogisticsSelectedSummary();
}

function exportLogisticsToExcel() {
  const packages = getLogisticsPackages();
  if (!packages || packages.length === 0) {
    showToast('No hay eventos en logística para exportar.', 'warning');
    return;
  }

  const rows = [];
  rows.push(['INTYLACT - REPORTE OFICIAL DE CONTROL LOGÍSTICO Y ARMADO DE PAQUETES']);
  rows.push(['Fecha de Exportación:', new Date().toLocaleString('es-VE')]);
  rows.push(['Total de Paquetes:', packages.length]);
  rows.push([]);
  rows.push([
    'CÓDIGO',
    'ORIGEN',
    'NOMBRE DEL EVENTO',
    'RESPONSABLE QUE RETIRA',
    'CÉDULA / ID',
    'TELÉFONO',
    'DIRECCIÓN DE ENTREGA / DESPACHO',
    'TOTAL CAJAS',
    'ESTADO LOGÍSTICO',
    'TOTAL UNIDADES',
    'MATERIALES E ÍTEMS ARMADOS POR CAJA',
    'NOTA DE DESPACHO',
    'FECHA ACTUALIZACIÓN'
  ]);

  packages.forEach(pkg => {
    let materialsSummary = '';
    const total = pkg.boxTotal || 1;
    for (let b = 1; b <= total; b++) {
      const bData = (pkg.boxesData && pkg.boxesData[b]) || { quantities: {} };
      const items = [];
      LABEL_PRODUCT_CATALOG.forEach(p => {
        const q = bData.quantities ? (bData.quantities[p.id] || 0) : 0;
        if (q > 0) {
          const name = p.isCustom ? (bData.customName || 'OTRO').toUpperCase() : p.name;
          items.push(`${q}x ${name}`);
        }
      });
      if (items.length > 0) {
        materialsSummary += `[Caja ${b}: ${items.join(', ')}] `;
      }
    }
    if (!materialsSummary) materialsSummary = 'Sin materiales asignados';

    rows.push([
      pkg.id,
      pkg.isManual ? 'Evento Manual' : 'Evento Aprobado',
      pkg.eventName || '',
      pkg.responsibleName || '',
      pkg.responsibleId || '',
      pkg.phone || '',
      pkg.address || '',
      pkg.boxTotal || 1,
      pkg.status || 'En Proceso',
      pkg.totalUnits || 0,
      materialsSummary,
      pkg.note || '',
      new Date(pkg.updatedAt || Date.now()).toLocaleDateString('es-VE')
    ]);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws['!cols'] = [
    { wch: 16 },
    { wch: 15 },
    { wch: 38 },
    { wch: 25 },
    { wch: 15 },
    { wch: 16 },
    { wch: 35 },
    { wch: 12 },
    { wch: 15 },
    { wch: 14 },
    { wch: 60 },
    { wch: 35 },
    { wch: 18 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Logística');
  const nowStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Logistica_Eventos_INTYLACT_${nowStr}.xlsx`);
  showToast('Reporte de logística exportado en Excel (.xlsx) con éxito.', 'success');
}

function exportLogisticsToPdf() {
  const packages = getLogisticsPackages();
  if (!packages || packages.length === 0) {
    showToast('No hay paquetes en logística para exportar a PDF.', 'warning');
    return;
  }

  const bannerUrl = (typeof intylactPrintBannerDataUrl !== 'undefined' && intylactPrintBannerDataUrl) ? intylactPrintBannerDataUrl : 'LOGO_BANNER_PRINT.png';

  const total = packages.length;
  const proceso = packages.filter(p => (p.status || '').toLowerCase() === 'en proceso').length;
  const armado = packages.filter(p => (p.status || '').toLowerCase() === 'armado').length;
  const entregado = packages.filter(p => (p.status || '').toLowerCase() === 'entregado').length;

  let rowsHtml = '';
  packages.forEach((pkg, idx) => {
    let materialsBreakdown = '';
    const totalBoxes = pkg.boxTotal || 1;
    for (let b = 1; b <= totalBoxes; b++) {
      const bData = (pkg.boxesData && pkg.boxesData[b]) || { quantities: {} };
      const items = [];
      LABEL_PRODUCT_CATALOG.forEach(p => {
        const q = bData.quantities ? (bData.quantities[p.id] || 0) : 0;
        if (q > 0) {
          const name = p.isCustom ? (bData.customName || 'OTRO').toUpperCase() : p.name;
          items.push(`<strong>${q}</strong> ${escapeHtml(name)}`);
        }
      });
      if (items.length > 0) {
        materialsBreakdown += `<div style="margin-bottom: 3px;"><u>Caja ${b}:</u> ${items.join(', ')}</div>`;
      }
    }
    if (!materialsBreakdown) materialsBreakdown = '<span style="color: #888;">Sin materiales registrados</span>';

    const statusColor = pkg.status === 'Armado' ? '#1e40af' : (pkg.status === 'Entregado' ? '#065f46' : '#92400e');
    const statusBg = pkg.status === 'Armado' ? '#dbeafe' : (pkg.status === 'Entregado' ? '#d1fae5' : '#fef3c7');

    rowsHtml += `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 7px 8px; font-weight: bold; font-family: monospace; font-size: 8.5pt;">${escapeHtml(pkg.id)}</td>
        <td style="padding: 7px 8px; font-size: 8.5pt;">
          <div style="font-weight: bold; text-transform: uppercase;">${escapeHtml(pkg.eventName)}</div>
          <div style="font-size: 7.5pt; color: #555;">${escapeHtml(pkg.address || '—')}</div>
        </td>
        <td style="padding: 7px 8px; font-size: 8.5pt;">
          <div style="font-weight: bold;">${escapeHtml(pkg.responsibleName || '—')}</div>
          <div style="font-size: 7.5pt; color: #444;">${escapeHtml(pkg.responsibleId || '')} • ${escapeHtml(pkg.phone || '')}</div>
        </td>
        <td style="padding: 7px 8px; font-size: 8pt; text-align: center;">
          <strong>${pkg.boxTotal || 1}</strong> Cajas<br>
          <span style="color: #d87a86; font-weight: bold;">${pkg.totalUnits || 0} un.</span>
        </td>
        <td style="padding: 7px 8px; font-size: 8pt; text-align: center;">
          <span style="display: inline-block; padding: 2px 7px; border-radius: 9999px; background: ${statusBg}; color: ${statusColor}; font-weight: bold; font-size: 7.5pt; text-transform: uppercase;">
            ${escapeHtml(pkg.status || 'En Proceso')}
          </span>
        </td>
        <td style="padding: 7px 8px; font-size: 7.5pt;">
          ${materialsBreakdown}
        </td>
      </tr>
    `;
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Permite las ventanas emergentes (pop-ups) para generar el PDF de logística.');
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Reporte de Logística y Armado de Paquetes - INTYLACT</title>
  <style>
    @page { size: letter landscape; margin: 0.4in; }
    body { font-family: Arial, sans-serif; color: #111; margin: 0; padding: 15px; }
    .header-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    .kpi-table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
    .kpi-box { padding: 8px; border: 1px solid #ddd; text-align: center; border-radius: 6px; }
    .main-table { width: 100%; border-collapse: collapse; border: 1px solid #ccc; font-size: 8.5pt; }
    .main-table th { background: #0f3042; color: #fff; padding: 7px 8px; text-align: left; font-size: 8pt; text-transform: uppercase; }
    @media print {
      .no-print { display: none !important; }
      body { padding: 0 !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 15px; padding: 10px; background: #0f3042; color: #fff; display: flex; justify-content: space-between; align-items: center; border-radius: 6px;">
    <strong>INTYLACT • REPORTE GENERAL DE LOGÍSTICA</strong>
    <div>
      <button onclick="window.print()" style="padding: 6px 14px; background: #d87a86; color: #fff; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Imprimir / Guardar como PDF</button>
      <button onclick="window.close()" style="padding: 6px 12px; background: #444; color: #fff; border: none; border-radius: 4px; margin-left: 6px; cursor: pointer;">Cerrar</button>
    </div>
  </div>

  <table class="header-table">
    <tr>
      <td style="width: 50%;">
        <img src="${bannerUrl}" alt="INTYLACT" style="height: 34px; width: auto; max-width: 250px; display: block; margin-bottom: 4px;">
        <div style="font-size: 11pt; font-weight: bold; color: #0f3042;">CONTROL DE LOGÍSTICA Y ARMADO DE PAQUETES</div>
        <div style="font-size: 8pt; color: #666;">Dirección de Mercadeo y Relaciones Públicas • INTYLACT Venezuela</div>
      </td>
      <td style="width: 50%; text-align: right; font-size: 8.5pt; color: #444;">
        <strong>Fecha:</strong> ${new Date().toLocaleDateString('es-VE')}<br>
        <strong>Hora:</strong> ${new Date().toLocaleTimeString('es-VE')}<br>
        <strong>Total Paquetes:</strong> ${total}
      </td>
    </tr>
  </table>

  <table class="kpi-table">
    <tr>
      <td style="width: 25%; padding: 4px;"><div class="kpi-box" style="background: #faf7f2;"><strong>${total}</strong><div style="font-size: 7.5pt; color: #666;">TOTAL EVENTOS</div></div></td>
      <td style="width: 25%; padding: 4px;"><div class="kpi-box" style="background: #fef3c7; color: #92400e;"><strong>${proceso}</strong><div style="font-size: 7.5pt;">EN PROCESO</div></div></td>
      <td style="width: 25%; padding: 4px;"><div class="kpi-box" style="background: #dbeafe; color: #1e40af;"><strong>${armado}</strong><div style="font-size: 7.5pt;">ARMADOS (LISTOS)</div></div></td>
      <td style="width: 25%; padding: 4px;"><div class="kpi-box" style="background: #d1fae5; color: #065f46;"><strong>${entregado}</strong><div style="font-size: 7.5pt;">ENTREGADOS</div></div></td>
    </tr>
  </table>

  <table class="main-table">
    <thead>
      <tr>
        <th style="width: 11%;">Código</th>
        <th style="width: 24%;">Evento y Destino</th>
        <th style="width: 20%;">Responsable que Retira</th>
        <th style="width: 10%; text-align: center;">Cajas / Unidades</th>
        <th style="width: 11%; text-align: center;">Status</th>
        <th style="width: 24%;">Desglose de Materiales</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <script>
    window.addEventListener('load', () => { setTimeout(() => window.print(), 350); });
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

function printSingleLogisticsSheet(packageId) {
  let pkg = null;
  if (packageId) {
    const packages = getLogisticsPackages();
    pkg = packages.find(p => p.id === packageId);
  } else {
    pkg = saveLogisticsPackage();
  }

  if (!pkg) return;

  const bannerUrl = (typeof intylactPrintBannerDataUrl !== 'undefined' && intylactPrintBannerDataUrl) ? intylactPrintBannerDataUrl : 'LOGO_BANNER_PRINT.png';

  const totalBoxes = pkg.boxTotal || 1;
  let boxesHtml = '';

  for (let b = 1; b <= totalBoxes; b++) {
    const bData = (pkg.boxesData && pkg.boxesData[b]) || { quantities: {} };
    let itemsRows = '';
    let bTotalUnits = 0;

    LABEL_PRODUCT_CATALOG.forEach(p => {
      const q = (bData.quantities && bData.quantities[p.id]) || 0;
      if (q > 0) {
        bTotalUnits += q;
        let displayName = p.name;
        if (p.isCustom) {
          displayName = (bData.customName || 'PRODUCTO ADICIONAL').toUpperCase();
        }
        itemsRows += `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 5pt 8pt; font-weight: bold; width: 65pt; text-align: center; background: #faf7f2; color: #0f3042;">${q} un.</td>
            <td style="padding: 5pt 8pt; font-weight: bold; text-transform: uppercase; color: #0f3042;">${escapeHtml(displayName)}</td>
            <td style="padding: 5pt 8pt; color: #6b7280; font-size: 8.5pt; width: 90pt;">${escapeHtml(p.category)}</td>
          </tr>
        `;
      }
    });

    if (!itemsRows) {
      itemsRows = '<tr><td colspan="3" style="padding: 8pt; color: #888; font-style: italic; text-align: center;">Sin materiales seleccionados para esta caja</td></tr>';
    }

    boxesHtml += `
      <div style="margin-bottom: 14pt; border: 1.5pt solid #0f3042; border-radius: 6pt; overflow: hidden; page-break-inside: avoid;">
        <div style="background: #0f3042; color: #fff; padding: 6pt 10pt; display: flex; justify-content: space-between; align-items: center;">
          <strong style="font-size: 10.5pt; letter-spacing: 0.03em;">CAJA ${b}/${totalBoxes}</strong>
          <span style="font-size: 9pt; font-weight: bold; color: #faebee;">${escapeHtml(bData.boxSubtitle || 'REGALOS EN STAND')} • ${bTotalUnits} UNIDADES TOTALES</span>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
          <thead>
            <tr style="background: #f4f0ea; font-size: 8pt; text-transform: uppercase; border-bottom: 1pt solid #d1d5db;">
              <th style="padding: 4pt 8pt; text-align: center; width: 65pt;">Cantidad</th>
              <th style="padding: 4pt 8pt; text-align: left;">Descripción del Material</th>
              <th style="padding: 4pt 8pt; text-align: left; width: 90pt;">Categoría</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>
      </div>
    `;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Permite las ventanas emergentes (pop-ups) para generar la Hoja de Armado.');
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Hoja de Materiales - ${escapeHtml(pkg.eventName)}</title>
  <style>
    @page { size: letter portrait; margin: 0.5in; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #0f3042; margin: 0; padding: 15px; }
    @media print {
      .no-print { display: none !important; }
      body { padding: 0 !important; }
    }
  </style>
</head>
<body>
  <!-- Barra de control flotante no imprimible -->
  <div class="no-print" style="margin-bottom: 14px; padding: 10px 14px; background: #0f3042; color: #fff; display: flex; justify-content: space-between; align-items: center; border-radius: 8px;">
    <div style="font-weight: bold; font-size: 13px;">HOJA OFICIAL DE MATERIALES A ARMAR</div>
    <div style="display: flex; gap: 8px;">
      <button onclick="window.print()" style="display: inline-flex; align-items: center; gap: 7px; padding: 7px 16px; background: #d87a86; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 12px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
        <span>Imprimir Hoja</span>
      </button>
      <button onclick="window.close()" style="padding: 7px 12px; background: #374151; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 12px;">Cerrar</button>
    </div>
  </div>

  <!-- Encabezado Oficial -->
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10pt; border-bottom: 2pt solid #0f3042; padding-bottom: 6pt;">
    <div>
      <img src="${bannerUrl}" alt="INTYLACT" style="height: 34px; width: auto; max-width: 250px; display: block; margin-bottom: 2pt;">
      <div style="font-size: 12.5pt; font-weight: 800; color: #0f3042; letter-spacing: -0.01em;">HOJA DE MATERIALES E ÍTEMS A ARMAR</div>
    </div>
    <div style="text-align: right; font-size: 8.5pt;">
      <div style="font-weight: bold; font-family: monospace; font-size: 11pt; color: #d87a86;">${escapeHtml(pkg.id)}</div>
      <div style="color: #6b7280;">${totalBoxes} Cajas • ${pkg.totalUnits || 0} unidades totales</div>
    </div>
  </div>

  <!-- SOLO NOMBRE DEL EVENTO (como lo solicitó el usuario) -->
  <div style="margin: 10pt 0 14pt 0; padding: 10pt 14pt; background: #faf7f2; border-left: 5pt solid #d87a86; border-radius: 4pt;">
    <span style="font-size: 8.5pt; font-weight: bold; color: #7b8893; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 2pt;">NOMBRE DEL EVENTO:</span>
    <div style="font-size: 15pt; font-weight: 800; color: #0f3042; text-transform: uppercase; line-height: 1.25;">${escapeHtml(pkg.eventName)}</div>
  </div>

  <!-- TODOS LOS ÍTEMS SELECCIONADOS PARA ARMAR LAS CAJAS -->
  <div style="font-size: 10.5pt; font-weight: 800; color: #0f3042; margin-bottom: 8pt; text-transform: uppercase; letter-spacing: 0.03em;">
    MATERIALES E ÍTEMS SELECCIONADOS POR CAJA
  </div>

  ${boxesHtml}

  <script>
    window.addEventListener('load', () => { setTimeout(() => window.print(), 350); });
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

// Iniciar aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

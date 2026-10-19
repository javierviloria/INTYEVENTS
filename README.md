# INTYLACT® | Plataforma Web de Gestión y Registro de Eventos

> **"La marca #1 de cuidado íntimo en Venezuela"**  
> Aplicación web moderna, responsiva, orientada al bienestar femenino y con arquitectura de **Cero Instalación (1 Clic)**.

---

## 🚀 Cómo Iniciar la Aplicación (1 Solo Clic)

No necesitas instalar **Node.js**, **Python**, bases de datos pesadas ni paquetes por consola.

1. **En tu Computadora (PC o Mac):** Haz doble clic en **`ABRIR_APP.bat`** o **`ABRIR_CON_LINK_MOVIL.bat`**.
2. **En tu Celular (Android o Apple iPhone / iPad) SIN escanear código QR:**
   - Haz doble clic en **`ABRIR_CON_LINK_MOVIL.bat`** (o **`CONECTAR_CELULAR.bat`**).
   - El sistema generará automáticamente un **Link Seguro HTTPS** público para tu celular.
   - **¡El link se copia automáticamente a tu portapapeles!** Solo abre WhatsApp Web, Telegram o tu correo, presiona `Ctrl + V` y envíatelo.
   - Toca el link en tu teléfono (Android o iPhone) y la página abrirá directamente, con datos móviles o cualquier Wi-Fi, sin necesidad de escanear ningún código QR.
   - También se guardará en la carpeta el archivo **`LINK_PARA_COMPARTIR.txt`** con el enlace directo listo.

---

## 📱 Compatibilidad Universal Multidispositivo y Adaptación de Imágenes

La aplicación ha sido probada y optimizada para verse perfecta en todos los dispositivos y pantallas:

- **Celulares Android (Samsung, Xiaomi, Motorola, Google Pixel, etc.):**
  - Acceso directo mediante enlace web en Chrome, Edge o Samsung Internet.
  - Teclados numéricos y de contacto optimizados (`inputmode="tel"`, `inputmode="email"`).
  - Imágenes y banners con escalado proporcional automático para no desbordar la pantalla.
- **Apple iOS (iPhone & iPad):**
  - Compatibilidad total con Safari y Chrome en iOS.
  - Prevención de zoom forzado al tocar campos (`font-size: 16px`).
  - Safe Areas para Dynamic Island y Notch (`env(safe-area-inset-top)` / `bottom`).
  - Streaming de video optimizado con soporte de `Range: bytes` y reproducción fluida `playsinline`.
- **Computadores de Escritorio, Laptops e iMac (Pantallas 2K, 4K y 5K Retina):**
  - Contenedores adaptativos con límites máximos ergonómicos (`max-w-imac-container`).
  - El carrusel de Misión y Visión (`MISION Y VISION.jpeg`) utiliza encuadre `object-fit: contain` sobre fondo corporativo, asegurando que todos los textos, logotipos y diagramas se lean completos sin recortes en ningún monitor.
  - Las 8 fotografías de activaciones se organizan en cuadrícula de 2 columnas en móviles, 3 columnas en iPad/Tablets y 4 columnas en computadores/iMac.

## 🌸 Identidad de Marca y UX/UI
- **Colores Corporativos:**
  - **Rosa Intylact:** `#D87A86` / `#BA5763` (Suavidad, cuidado y feminidad).
  - **Azul Petróleo / Corporativo:** `#0F3042` / `#163F53` (Rigor médico, solidez institucional).
  - **Crema y Fondo Neutro:** `#FAF7F2` (Sensación de spa y pureza).
  - **Acentos:** Menta suave `#5FA8BC` y Dorado `#E5B850`.
- **Tipografía:** *Plus Jakarta Sans* y *Playfair Display*.
- **Diseño Mobile-First:** 100% adaptable para teléfonos móviles, tablets y monitores de escritorio.

---

## 🏛️ Estructura de la Aplicación (4 Secciones)

### 1. Landing Page y Autenticación (Split Screen)
- **Lado Izquierdo:**
  - Banner oficial `BANNER.jpeg` con el lema de la marca.
  - Carrusel interactivo automático y manual con `MISION Y VISION.jpeg`, `EQUIPO CAMPEON INTYSQUAD.jpeg` y `MONTAJE INTYSQUAD.jpeg`.
- **Lado Derecho:**
  - Panel centralizado de acceso.
  - Botón oficial de **"Iniciar sesión con Google" (OAuth)**. Al hacer clic, se despliega una ventana de autenticación con cuentas predeterminadas o para escribir los datos propios.
  - **Aviso de privacidad obligatorio:**  
    > *"Al iniciar sesión, tu nombre, correo y foto asociados a tu cuenta de Google se registrarán automáticamente para agilizar tu solicitud."*
  - Acceso alternativo para administradores mediante modal protegido.

### 2. Dashboard del Usuario (Post-Login)
- **Barra de navegación:**
  - Pestaña 1: **"Eventos" (Inicio)** con bienvenida personalizada.
  - Pestaña 2: **"Solicitud de Eventos"** (Redirecciona al Wizard).
  - Perfil de usuario con avatar de Google y botón para cerrar sesión.
- **Showcase Multimedia:**
  - Reproductor con el video oficial corporativo: **`VIDEO CLX.mp4`**.
  - Galería fotográfica interactiva con visor **Lightbox**:
    - `INICIO INTYSQUAD.jpeg`
    - `INTYSQUAD.jpeg`
    - `EQUIPO CAMPEON INTYSQUAD.jpeg`
    - `TROFEO INTYSQUAD.jpeg`
    - `MONTAJE INTYSQUAD.jpeg`
    - `STAND CON BACKING.jpeg`
    - `STAND-BACKING-INFLABLES.jpeg`
    - `PROMOTORA.jpeg`
  - Banner interactivo de llamada a la acción (CTA).

### 3. Wizard de Solicitud de Eventos (Paso a Paso)
*Validación en tiempo real. No permite avanzar al siguiente paso sin completar los campos requeridos.*

- **Paso 1: Políticas de Solicitud**
  - Mínimo 10 días hábiles previos para evaluación.
  - Protocolo estricto de comunicación (descarte por insistencia previa).
  - Planificación logística (no eventos de último minuto).
  - Checkbox obligatorio que registra la **marca de tiempo (timestamp ISO)** exacta de aceptación.
- **Paso 2: Confidencialidad**
  - Términos de protección de marca, propiedad intelectual y secreto comercial.
  - Checkbox obligatorio con registro de timestamp.
- **Paso 3: Datos del Organizador**
  - Nombre del responsable o empresa (precargado con Google).
  - Correo electrónico de contacto (precargado con Google).
  - Número de WhatsApp con formato internacional.
  - Link de Instagram y usuario (`@`).
- **Paso 4: Detalles Generales y Lógica Condicional**
  - Nombre del Evento / Activación.
  - Selector de duración: **Día Único** vs. **Multijornada**.
  - **Condicional Día Único:** Fecha, Hora de inicio (Caracas, VE), Hora de fin, Ubicación y Google Maps.
  - **Condicional Multijornada:** Días/fechas del evento, Horarios detallados por día, Ubicación y Google Maps.
  - **Subida de Archivos:** Foto del Flyer y Brochure/Dossier (PDF, JPG, PNG, máx. 5 archivos, hasta 100MB por archivo con vista previa y opción de eliminar).
- **Paso 5: Alcance y Aporte**
  - Aforo estimado / flujo de personas.
  - Opciones de aporte: Logo en Flyer, Mención en RRSS, Base de Datos, Espacio para Charla, Logo Impreso, Espacio para Stand, y "Otro" con campo dinámico.
  - Beneficio y retorno hacia INTYLACT.
- **Paso 6: Aceptación Final y Envío**
  - Tres checkboxes independientes y obligatorios con los textos exactos requeridos.
  - Generación de código único de seguimiento (`INTY-2026-XXXX`).
  - Animación festiva con **Canvas Confetti** y pantalla de confirmación.

### 4. Cuarta Sección: Panel de Administración, Resultados del Formulario y Leads (Solo Administrador)
- **Acceso Exclusivo Protegido:** Los usuarios generales no pueden ingresar ni ver esta sección. Solo ingresa el administrador con su correo y clave autorizada.
- **Credenciales del Administrador:**
  - **Correo Oficial:** `intyeventos@intylact.com`
  - **Contraseña:** `admin2026`
- **Navegación según Rol:**
  - **Administrador:** Ve la sección "Eventos" (sin formulario de registro) y la cuarta sección "Resultados y Leads".
  - **Usuario Común:** Ve "Eventos" y "Solicitud de Eventos" (Wizard de registro). No puede ingresar a la administración.
- **Resultados del Formulario (DataGrid):** Tabla dinámica con todas las propuestas recibidas, ordenadas cronológicamente, con buscador y filtros de estado.
- **Directorio de Leads:** Tabla con usuarios registrados vía Google OAuth (avatar, nombre, correo, fecha, número de postulaciones).
- **Exportación a Excel (.xlsx):** Descarga inmediata con un solo clic usando SheetJS.
- **Integración con Google Sheets / Webhooks:** Conexión para automatizaciones en tiempo real.

---

## 🗄️ Esquema de Base de Datos (Producción)

### Esquema Relacional SQL (PostgreSQL / Supabase)

```sql
-- 1. Tabla de Usuarios y Leads generados con Google
CREATE TABLE leads_usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    foto_url TEXT,
    telefono_whatsapp VARCHAR(50),
    total_solicitudes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Solicitudes de Eventos
CREATE TABLE solicitudes_eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_seguimiento VARCHAR(50) UNIQUE NOT NULL, -- Ej: INTY-2026-0042
    lead_id UUID REFERENCES leads_usuarios(id) ON DELETE SET NULL,
    
    -- Timestamps Legales Auditables
    politicas_aceptadas_at TIMESTAMP WITH TIME ZONE NOT NULL,
    confidencialidad_aceptada_at TIMESTAMP WITH TIME ZONE NOT NULL,
    compromisos_finales_aceptados_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Datos del Organizador
    nombre_responsable VARCHAR(255) NOT NULL,
    email_contacto VARCHAR(255) NOT NULL,
    whatsapp_contacto VARCHAR(50) NOT NULL,
    instagram_link TEXT NOT NULL,
    instagram_user VARCHAR(100) NOT NULL,
    
    -- Detalles del Evento
    nombre_evento VARCHAR(255) NOT NULL,
    tipo_duracion VARCHAR(20) NOT NULL CHECK (tipo_duracion IN ('dia_unico', 'multijornada')),
    fecha_evento TEXT NOT NULL,
    horarios_evento TEXT NOT NULL,
    ubicacion_direccion TEXT NOT NULL,
    google_maps_url TEXT NOT NULL,
    
    -- Archivos (Metadatos hacia Cloud Storage)
    archivos_adjuntos JSONB DEFAULT '[]'::jsonb,
    
    -- Alcance y Retorno
    aforo_estimado VARCHAR(100) NOT NULL,
    modalidades_aporte TEXT[] NOT NULL,
    aporte_otro TEXT,
    beneficio_retorno_marca TEXT NOT NULL,
    
    -- Estado Administrativo
    estado VARCHAR(30) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'En Revisión', 'Aprobado', 'Rechazado')),
    notas_admin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas del Panel Admin
CREATE INDEX idx_solicitudes_estado ON solicitudes_eventos(estado);
CREATE INDEX idx_solicitudes_fecha ON solicitudes_eventos(created_at DESC);
CREATE INDEX idx_leads_email ON leads_usuarios(email);
```

---

## ☁️ Arquitectura para Archivos Pesados (Hasta 100MB)

Para admitir archivos pesados como **Brochures de alta resolución (PDF)** y **Flyers sin comprimir** sin saturar los servidores web:

1. **Subida Directa a Bucket (Client-to-Storage):**  
   El navegador solicita al backend una **Presigned URL (URL prefirmada)** con tiempo de expiración (ej. 15 minutos).
2. **Transferencia HTTP PUT:**  
   El navegador realiza la carga directa hacia el bucket de almacenamiento (AWS S3, Supabase Storage o Firebase Storage) mediante subidas multipart, reportando la barra de progreso en tiempo real.
3. **Persistencia Ligera:**  
   Una vez completada la carga en la nube, el frontend envía únicamente la URL del archivo y sus metadatos (nombre, peso, tipo MIME) a la base de datos.

### Ejemplo de Integración con AWS S3 (Node / Python Backend):
```javascript
// Generación de URL prefirmada en el servidor
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

async function getUploadUrl(fileName, fileType) {
  const s3 = new S3Client({ region: 'us-east-1' });
  const command = new PutObjectCommand({
    Bucket: 'intylact-event-dossiers',
    Key: `solicitudes/${Date.now()}_${fileName}`,
    ContentType: fileType
  });
  return await getSignedUrl(s3, command, { expiresIn: 900 });
}
```

---

## 📊 Conexión con Google Sheets y Zapier / Make

En el Panel de Administración (botón **"Integrar API / Sheets"**):
1. Pega la URL de tu **Webhook** (de un Google Apps Script o disparador Webhook de Make/Zapier).
2. Cada vez que un usuario envíe una propuesta, el sistema despacha automáticamente el objeto JSON completo con los datos del organizador, fechas y aforo.
3. El webhook puede añadir una nueva fila en una hoja de cálculo compartida en Google Sheets para el equipo de ventas y marketing.

---

© 2026 INTYLACT® — Todos los derechos reservados.

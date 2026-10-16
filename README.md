# 🛡️ OMNEX Conecta Interior — Sistema Táctico Humanitario

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Producci%C3%B3n%20En%20Vivo-success?style=for-the-badge&logo=vercel)](https://omnex-conecta-interior.vercel.app)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline--First%20Ready-2DD4BF?style=for-the-badge&logo=pwa)](https://omnex-conecta-interior.vercel.app)
[![Ciberseguridad](https://img.shields.io/badge/Criptograf%C3%ADa-AES--GCM--256%20%2B%20PBKDF2-blue?style=for-the-badge)](https://omnex-conecta-interior.vercel.app)
[![Ley 81](https://img.shields.io/badge/Cumplimiento-Ley%2081%20Panam%C3%A1%20(ANTAI)-emerald?style=for-the-badge)](https://omnex-conecta-interior.vercel.app)

Plataforma táctica de gestión humanitaria, censo territorial offline-first, motor GIS de geocercas y validación criptográfica anti-fraude diseñada para operaciones de emergencia en provincias del interior de la República de Panamá (Región Azuero: Los Santos y Herrera).

---

## 🌐 Enlaces Oficiales

* **Plataforma en Producción:** [https://omnex-conecta-interior.vercel.app](https://omnex-conecta-interior.vercel.app)
* **Repositorio Oficial:** [https://github.com/smtechnologyapps-dotcom/omnex-conecta-interior](https://github.com/smtechnologyapps-dotcom/omnex-conecta-interior)

---

## 🏛️ Arquitectura de Misión Crítica ($51,500 USD)

Auditada bajo el estándar **Zero-Trust** por el Equipo AVENGER (NVIDIA NIM), la plataforma implementa 9 módulos de grado institucional:

| Módulo | Alcance Técnico | Estado |
| :--- | :--- | :---: |
| **M1. Núcleo PWA Offline-First** | Service Worker con precache estricto, Web Manifest táctico, iconos vectoriales y ciclo de vida de actualización en caliente (`SKIP_WAITING`) sin pérdida de datos en IndexedDB. | ✅ 100% |
| **M2. Motor de Sincronización Outbox** | Cola transaccional cliente en IndexedDB con reconciliación determinista automática ante recuperación de enlace celular o satelital (Starlink). | ✅ 100% |
| **M3. DAL Desacoplado Database-Agnostic** | Contratos de interfaz `IDataRepository<T>` con soporte inmediato para Dexie (IndexedDB local) y conector híbrido Supabase/PostgreSQL sin alterar la UI. | ✅ 100% |
| **M4. Motor GIS & Geocercas Offline** | Algoritmo Haversine (WGS84) para distancias geodésicas y Ray-Casting (Point-in-Polygon) para detección de cuencas de riesgo (*Río Tonosí, Río Oria, Río La Villa*), con cálculo de accesibilidad para convoyes 4x4 y enlaces Waze SOS. | ✅ 100% |
| **M5. Despacho Humanitario & Quema Atómica QR** | Prevención de fraude y doble cobro de raciones en albergues mediante Nullifier Sets locales. El token se invalida irreversiblemente en el primer escaneo. | ✅ 100% |
| **M6. Bóveda Cifrada Ley 81 & Trazabilidad ARCO** | Cifrado en reposo con WebCrypto AES-GCM-256 + PBKDF2 (600,000 iteraciones), cálculo en vivo de raíz Merkle SHA-256, purga verificable (Crypto-shredding) y exportación de Dossier Oficial para ANTAI/SINAPROC. | ✅ 100% |
| **M7. Centro de Mando Táctico (COE)** | Telemetría en tiempo real, mapas satelitales de afectación por corregimiento, monitoreo de vados anegados y despacho de brigadas 4x4. | ✅ 100% |
| **M8. Bus de Eventos & Webhooks HMAC** | Endpoints de integración para n8n con verificación de firma HMAC-SHA256 (`x-omnex-signature`), despacho de alertas y acuse de recibo transaccional. | ✅ 100% |
| **M9. Hardening Militar & UI Ergonomía** | Sistema de diseño Luxury Dark (`#050B14`, `#0A1626`, `#2DD4BF`), eliminación estricta de desbordamiento horizontal (`overflow-x: hidden`), barra táctica inferior para uso con guantes o una sola mano y CSP estricto. | ✅ 100% |

---

## 📱 Instalación como PWA en Dispositivos Móviles

1. Ingresa a [https://omnex-conecta-interior.vercel.app](https://omnex-conecta-interior.vercel.app) desde Google Chrome (Android) o Safari (iOS).
2. Toca el menú del navegador y selecciona **"Instalar aplicación"** o **"Agregar a pantalla de inicio"**.
3. El sistema operará como una aplicación nativa. Puedes activar el **Modo Avión** y comprobar que el censo, la consulta y el motor de geocercas se mantienen 100% operativos.

---

## 🧪 Arnés de Automatización y Pruebas

El proyecto cuenta con un arnés de automatización integral con 14 suites de pruebas:

```bash
npm run test:harness
```

Resultados certificados:
* ✅ CERO menciones de entidades no deseadas (Auditoría Negativa).
* ✅ CERO exposición de datos personales privados o RUC.
* ✅ Algoritmos criptográficos SHA-256, WebCrypto y Quema Atómica validados.
* ✅ Motor GIS Haversine y Ray-Casting validados.
* ✅ Precache PWA, SVG icons y Service Worker verificados.
* ✅ **14 / 14 Suites Aprobadas (100% PASS)**.

---

## 💻 Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/smtechnologyapps-dotcom/omnex-conecta-interior.git
cd omnex-conecta-interior

# 2. Instalar dependencias
npm install

# 3. Iniciar entorno de desarrollo
npm run dev

# 4. Compilar para producción
npm run build
npm run start
```

---

## 🏛️ Entidad Titular y Contacto

* **Entidad Legal:** Soluciones Integrales y Globales SM
* **Plataforma:** OMNEX Conecta Interior
* **Contacto Institucional:** [contacto@omnexpa.com](mailto:contacto@omnexpa.com)
* **Jurisdicción:** República de Panamá

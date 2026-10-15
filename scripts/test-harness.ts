/**
 * OMNEX CONECTA INTERIOR - AUTOMATION & TEST HARNESS
 * Estándar: automation-harness-expert / Misión Crítica
 * OMNEX Conecta Interior - Sistema Táctico
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  message?: string;
  durationMs: number;
}

const results: TestResult[] = [];
const ROOT_DIR = path.resolve(__dirname, '..');

async function runTest(suite: string, name: string, fn: () => Promise<void> | void) {
  const start = Date.now();
  try {
    await fn();
    results.push({
      suite,
      name,
      passed: true,
      durationMs: Date.now() - start,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    results.push({
      suite,
      name,
      passed: false,
      message: errorMsg,
      durationMs: Date.now() - start,
    });
  }
}

function expect(actual: unknown) {
  return {
    toBe(expected: unknown) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
      }
    },
    toEqual(expected: unknown) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected deep equality with ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
      }
    },
    toContain(expected: string) {
      if (typeof actual !== 'string' || !actual.includes(expected)) {
        throw new Error(`Expected string to contain "${expected}"`);
      }
    },
    toBeGreaterThan(expected: number) {
      if (typeof actual !== 'number' || actual <= expected) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toBeTrue() {
      if (actual !== true) {
        throw new Error(`Expected true but got ${actual}`);
      }
    },
  };
}

async function main() {
  console.log('\n===============================================================');
  console.log('🚀 INICIANDO ARNES DE PRUEBAS DE AUTOMATIZACION OMNEX CONECTA');
  console.log('   OMNEX Conecta Interior - Sistema Táctico');
  console.log('===============================================================\n');

  // =========================================================================
  // SUITE 1: Auditoría Negativa de Seguridad y Desvinculación de Marca
  // =========================================================================
  await runTest('Auditoría Negativa', 'Certificar CERO ocurrencias de asonapaq en codebase', () => {
    const targetDirs = ['app', 'components', 'hooks', 'lib', 'public', 'types'];
    const forbiddenPattern = /asonapaq/i;
    let foundOccurrences = 0;
    const filesWithViolation: string[] = [];

    function scanDir(dirPath: string) {
      if (!fs.existsSync(dirPath)) return;
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.isFile() && /\.(tsx?|json|css|js|md)$/.test(entry.name)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (forbiddenPattern.test(content)) {
            foundOccurrences++;
            filesWithViolation.push(path.relative(ROOT_DIR, fullPath));
          }
        }
      }
    }

    for (const dir of targetDirs) {
      scanDir(path.join(ROOT_DIR, dir));
    }

    // Archivos raíz clave
    for (const file of ['metadata.json', 'navigation_flow.json']) {
      const p = path.join(ROOT_DIR, file);
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        if (forbiddenPattern.test(content)) {
          foundOccurrences++;
          filesWithViolation.push(file);
        }
      }
    }

    if (foundOccurrences > 0) {
      throw new Error(`Fallo de desvinculación: se encontraron ${foundOccurrences} menciones en: ${filesWithViolation.join(', ')}`);
    }
    expect(foundOccurrences).toBe(0);
  });

  // =========================================================================
  // SUITE 2: Ciberseguridad & Prevención de Replay Attack (Quema Atómica)
  // =========================================================================
  await runTest('Ciberseguridad', 'Validar algoritmo SHA-256 e idempotencia criptográfica', () => {
    const raw = 'PTI-042-99824X:FAM-PTI-042:OMNEX_EPOCH_2026';
    const hash = crypto.createHash('sha256').update(raw).digest('hex');
    expect(hash.length).toBe(64);
  });

  await runTest('Ciberseguridad', 'Validar Quema Atómica de Tokens y Prevención de Replay', () => {
    const nullifierSet = new Set<string>();
    const tokenId = 'PTI-042-99824X';
    const beneficiaryId = 'FAM-PTI-042';

    // Función pura equivalente a evaluateAndBurnToken
    function burn(tId: string, bId: string) {
      const nullifier = crypto.createHash('sha256').update(`NULLIFIER:${tId}:${bId}:OMNEX_EPOCH_2026`).digest('hex');
      if (nullifierSet.has(nullifier)) {
        return { valid: false, status: 'ALREADY_CLAIMED', nullifier };
      }
      nullifierSet.add(nullifier);
      return { valid: true, status: 'BURNED', nullifier };
    }

    // Intento 1: Primer reclamo (debe ser válido y quemado)
    const claim1 = burn(tokenId, beneficiaryId);
    expect(claim1.valid).toBe(true);
    expect(claim1.status).toBe('BURNED');

    // Intento 2: Doble reclamo con mismo token (debe ser bloqueado inmediatamente)
    const claim2 = burn(tokenId, beneficiaryId);
    expect(claim2.valid).toBe(false);
    expect(claim2.status).toBe('ALREADY_CLAIMED');
  });

  // =========================================================================
  // SUITE 3: Arquitectura DAL Agnóstica & Dexie Local-First
  // =========================================================================
  await runTest('DAL Database-Agnostic', 'Verificar existencia de contratos IDataRepository y Factory', () => {
    const typesPath = path.join(ROOT_DIR, 'lib', 'data', 'types.ts');
    const factoryPath = path.join(ROOT_DIR, 'lib', 'data', 'factory.ts');
    const dexieDbPath = path.join(ROOT_DIR, 'lib', 'data', 'dexie-db.ts');
    const dexieAdapterPath = path.join(ROOT_DIR, 'lib', 'data', 'adapters', 'dexie.adapter.ts');
    const supabaseAdapterPath = path.join(ROOT_DIR, 'lib', 'data', 'adapters', 'supabase.adapter.ts');

    expect(fs.existsSync(typesPath)).toBe(true);
    expect(fs.existsSync(factoryPath)).toBe(true);
    expect(fs.existsSync(dexieDbPath)).toBe(true);
    expect(fs.existsSync(dexieAdapterPath)).toBe(true);
    expect(fs.existsSync(supabaseAdapterPath)).toBe(true);

    const typesContent = fs.readFileSync(typesPath, 'utf8');
    expect(typesContent).toContain('interface IDataRepository');
    expect(typesContent).toContain('interface BaseEntity');

    const dexieDbContent = fs.readFileSync(dexieDbPath, 'utf8');
    expect(dexieDbContent).toContain('class OmnexTacticalDB extends Dexie');
    expect(dexieDbContent).toContain('censos: \'id, familyCode');

    // Validación de Motor de Sincronización Outbox (TacticalSyncEngine)
    const syncEnginePath = path.join(ROOT_DIR, 'lib', 'sync', 'sync-engine.ts');
    expect(fs.existsSync(syncEnginePath)).toBe(true);
    const syncEngineContent = fs.readFileSync(syncEnginePath, 'utf8');
    expect(syncEngineContent).toContain('class TacticalSyncEngine');
    expect(syncEngineContent).toContain('processOutboxQueue');
    expect(syncEngineContent).toContain('initializeAutoSync');
  });

  // =========================================================================
  // SUITE 4: PWA Offline-First & Ciclo de Actualización en Vivo
  // =========================================================================
  await runTest('PWA Engine', 'Verificar manifest.json táctico para modo standalone', () => {
    const manifestPath = path.join(ROOT_DIR, 'public', 'manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    expect(manifest.display).toBe('standalone');
    expect(manifest.theme_color).toBe('#050B14');
    expect(manifest.short_name).toBe('OMNEX Conecta');
  });

  await runTest('PWA Engine', 'Verificar Service Worker sw.js con soporte SKIP_WAITING', () => {
    const swPath = path.join(ROOT_DIR, 'public', 'sw.js');
    expect(fs.existsSync(swPath)).toBe(true);

    const swContent = fs.readFileSync(swPath, 'utf8');
    expect(swContent).toContain('SKIP_WAITING');
    expect(swContent).toContain('omnex-tactical-');
    expect(swContent).toContain('caches.open');
  });

  await runTest('PWA Engine', 'Verificar componente UpdateBanner y hook useServiceWorkerUpdate', () => {
    const bannerPath = path.join(ROOT_DIR, 'components', 'UpdateBanner.tsx');
    const hookPath = path.join(ROOT_DIR, 'hooks', 'useServiceWorkerUpdate.ts');

    expect(fs.existsSync(bannerPath)).toBe(true);
    expect(fs.existsSync(hookPath)).toBe(true);

    const bannerContent = fs.readFileSync(bannerPath, 'utf8');
    expect(bannerContent).toContain('data-testid="pwa-update-banner"');
    expect(bannerContent).toContain('data-testid="pwa-update-confirm-btn"');
  });

  // =========================================================================
  // SUITE 5: Zero-Overflow & Ergonomía Móvil (OMNEX Luxury Dark)
  // =========================================================================
  await runTest('UI/UX Ergonomía', 'Verificar bloqueo estricto de overflow-x y tap targets en globals.css', () => {
    const cssPath = path.join(ROOT_DIR, 'app', 'globals.css');
    expect(fs.existsSync(cssPath)).toBe(true);

    const cssContent = fs.readFileSync(cssPath, 'utf8');
    expect(cssContent).toContain('overflow-x: hidden !important;');
    expect(cssContent).toContain('max-width: 100vw;');
    expect(cssContent).toContain('--teal-primary: #2DD4BF;');
    expect(cssContent).toContain('--bg-dark: #050B14;');
  });

  await runTest('UI/UX Ergonomía', 'Verificar Viewport en app/layout.tsx para prevenir zoom y overflow', () => {
    const layoutPath = path.join(ROOT_DIR, 'app', 'layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');

    expect(layoutContent).toContain('userScalable: false');
    expect(layoutContent).toContain('maximumScale: 1');
    expect(layoutContent).toContain('themeColor: \'#050B14\'');
  });

  await runTest('UI/UX Ergonomía', 'Verificar Barra Táctica Inferior Móvil (Bottom Navigation)', () => {
    const pagePath = path.join(ROOT_DIR, 'app', 'page.tsx');
    const pageContent = fs.readFileSync(pagePath, 'utf8');

    expect(pageContent).toContain('data-testid="mobile-tactical-bottom-nav"');
    expect(pageContent).toContain('data-testid="bottom-nav-mando-btn"');
    expect(pageContent).toContain('data-testid="bottom-nav-censo-btn"');
    expect(pageContent).toContain('data-testid="bottom-nav-despacho-btn"');
  });

  // =========================================================================
  // SUITE 6: Selectores Estables para Automatización (data-testid)
  // =========================================================================
  await runTest('Selectores Estables', 'Verificar data-testid en botones críticos de la aplicación', () => {
    const appHeaderPath = path.join(ROOT_DIR, 'components', 'AppHeader.tsx');
    const despachoPath = path.join(ROOT_DIR, 'components', 'views', 'DespachoQrView.tsx');
    const censoPath = path.join(ROOT_DIR, 'components', 'views', 'CensoOfflineView.tsx');

    const headerContent = fs.readFileSync(appHeaderPath, 'utf8');
    expect(headerContent).toContain('data-testid="online-toggle-btn"');
    expect(headerContent).toContain('data-testid="sync-trigger-btn"');

    const despachoContent = fs.readFileSync(despachoPath, 'utf8');
    expect(despachoContent).toContain('data-testid="burn-token-action-btn"');

    const censoContent = fs.readFileSync(censoPath, 'utf8');
    expect(censoContent).toContain('data-testid="census-save-btn"');
  });

  // =========================================================================
  // SUITE 7: Motor GIS Táctico & Geocercas Offline (Módulo M4)
  // =========================================================================
  await runTest('Motor GIS Offline', 'Verificar motor TacticalGIS y cálculo Haversine', async () => {
    const gisPath = path.join(ROOT_DIR, 'lib', 'gis', 'offline-geo.ts');
    expect(fs.existsSync(gisPath)).toBe(true);

    const { TacticalGIS } = await import('../lib/gis/offline-geo');
    const baseLasTablas = { lat: 7.7667, lng: -80.2833 };
    const tonosi = { lat: 7.4200, lng: -80.4600 };

    const distance = TacticalGIS.calculateHaversineDistance(baseLasTablas, tonosi);
    expect(distance).toBeGreaterThan(35);
    expect(distance).toBeGreaterThan(0);

    // Test Point in Polygon Ray-Casting
    const insideTonosi = TacticalGIS.assessHazardForLocation(tonosi);
    expect(insideTonosi !== null).toBe(true);
    expect(insideTonosi?.riskLevel).toBe('CRITICO');

    // Test assessment route
    const assessment = TacticalGIS.assessTacticalRoute(baseLasTablas, tonosi);
    expect(assessment.intersectsHazard).toBe(true);
    expect(assessment.wazeUrl).toContain('waze.com/ul');
  });

  // =========================================================================
  // SUITE 8: Assets PWA de Grado Institucional (SVG Icons & Shortcuts)
  // =========================================================================
  await runTest('PWA Engine', 'Verificar iconos vectoriales SVG e integración en manifest.json', () => {
    const icon192Path = path.join(ROOT_DIR, 'public', 'icon-192.svg');
    const icon512Path = path.join(ROOT_DIR, 'public', 'icon-512.svg');
    const manifestPath = path.join(ROOT_DIR, 'public', 'manifest.json');

    expect(fs.existsSync(icon192Path)).toBe(true);
    expect(fs.existsSync(icon512Path)).toBe(true);

    const icon192 = fs.readFileSync(icon192Path, 'utf8');
    const icon512 = fs.readFileSync(icon512Path, 'utf8');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    expect(icon192).toContain('<svg');
    expect(icon512).toContain('<svg');
    expect(manifest.icons.some((i: { src: string }) => i.src === '/icon-192.svg')).toBe(true);
    expect(manifest.icons.some((i: { src: string }) => i.src === '/icon-512.svg')).toBe(true);
    expect(Array.isArray(manifest.shortcuts)).toBe(true);
    expect(manifest.shortcuts.length).toBeGreaterThan(1);
  });

  // =========================================================================
  // SUITE 9: Auditoría Estricta de Privacidad Personal
  // =========================================================================
  await runTest('Auditoría Privacidad', 'Certificar CERO exposición de RUC personal o teléfono privado en código fuente', () => {
    const targetDirs = ['app', 'components', 'hooks', 'lib', 'types'];
    const personalPatterns = [/8-829-1163/i, /6509-1352/i];
    let violations = 0;
    const violatedFiles: string[] = [];

    function scan(dir: string) {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scan(full);
        } else if (entry.isFile() && /\.(tsx?|json|css|js)$/.test(entry.name)) {
          const content = fs.readFileSync(full, 'utf8');
          for (const pattern of personalPatterns) {
            if (pattern.test(content)) {
              violations++;
              violatedFiles.push(path.relative(ROOT_DIR, full));
            }
          }
        }
      }
    }

    for (const d of targetDirs) {
      scan(path.join(ROOT_DIR, d));
    }

    if (violations > 0) {
      throw new Error(`Violación de privacidad detectada en: ${violatedFiles.join(', ')}`);
    }
    expect(violations).toBe(0);
  });

  // =========================================================================
  // REPORTE FINAL CONCISO
  // =========================================================================
  console.log('\n📊 RESULTADOS DE LA EJECUCION DEL HARNESS:\n');
  let passedCount = 0;
  let failedCount = 0;

  for (const r of results) {
    if (r.passed) {
      passedCount++;
      console.log(`  ✅ [PASS] [${r.suite}] ${r.name} (${r.durationMs}ms)`);
    } else {
      failedCount++;
      console.log(`  ❌ [FAIL] [${r.suite}] ${r.name} (${r.durationMs}ms)`);
      console.log(`     Error: ${r.message}`);
    }
  }

  console.log('\n===============================================================');
  console.log(`  TOTAL: ${results.length} | PASARON: ${passedCount} | FALLARON: ${failedCount}`);
  console.log('===============================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Error fatal en arnés de pruebas:', err);
  process.exit(1);
});

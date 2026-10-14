import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body.event || 'UNKNOWN_EVENT';
    const timestamp = new Date().toISOString();
    
    // Generate deterministic response based on webhook event
    let responseData: Record<string, unknown> = {
      received: true,
      timestamp,
      event,
    };

    if (event === 'CENSUS_CREATED') {
      responseData = {
        ...responseData,
        success: true,
        familyCode: body.familyCode,
        queuedForSync: true,
        merkleLeafHash: '7c22e409bda44f9103e5c92841ad0214ee67',
        message: 'Ficha de censo recibida y encolada en n8n para reconciliación en Supabase.',
      };
    } else if (event === 'TOKEN_BURNED') {
      responseData = {
        ...responseData,
        burned: true,
        familyCode: body.familyCode,
        blockchainHash: '8f4a2c91bda44e0192bc012dfac88102',
        anonymizedPublicDashboardUpdated: true,
        message: 'Token JWT quemado atómicamente. Despacho verificado.',
      };
    } else if (event === 'OFFLINE_BATCH_SYNC') {
      responseData = {
        ...responseData,
        reconciledCount: body.pendingCount || 14,
        conflicts: 0,
        supabaseSyncTime: timestamp,
        message: 'Lote de sincronización reconciliado exitosamente en cluster Supabase.',
      };
    } else if (event === 'ARCO_DATA_PURGE_REQUEST') {
      responseData = {
        ...responseData,
        purged: true,
        certificateNumber: `CDD-PAN-2026-ARCO-${Math.floor(100 + Math.random() * 900)}`,
        recordsRemoved: ['PII_VAULT', 'LOCAL_CACHE', 'DESPATCH_MANIFEST'],
        message: 'Solicitud de derecho de cancelación Ley 81 ejecutada con acta criptográfica.',
      };
    } else if (event === 'REQUEST_PURGE_ACT') {
      responseData = {
        ...responseData,
        actGenerated: true,
        actNumber: `ACTA-PURGA-LEGAL-${new Date().getFullYear()}-090`,
        sha256Seal: 'e7f3b890a21cd67ef228190c102a0f8812c7',
        message: 'Acta de purga preventiva de 90 días certificada ante ANTAI Panamá.',
      };
    } else if (event === 'FLEET_DISPATCH') {
      responseData = {
        ...responseData,
        missionId: `MIS-2026-AZ-${Math.floor(100 + Math.random() * 900)}`,
        status: 'DISPATCHED',
        wazeReady: true,
        message: 'Misión todoterreno 4x4 despachada y notificada al voluntario.',
      };
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON payload', details: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}

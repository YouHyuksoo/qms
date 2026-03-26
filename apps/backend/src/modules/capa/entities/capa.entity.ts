/**
 * @file capa.entity.ts
 * @description Entity enum definitions
 */

export enum CapaType { CORRECTIVE = 'CORRECTIVE', PREVENTIVE = 'PREVENTIVE', BOTH = 'BOTH' }
export enum CapaPriority { LOW = 'LOW', MEDIUM = 'MEDIUM', HIGH = 'HIGH', CRITICAL = 'CRITICAL' }
export enum CapaStatus { OPEN = 'OPEN', IN_PROGRESS = 'IN_PROGRESS', VERIFICATION = 'VERIFICATION', CLOSED = 'CLOSED', CANCELLED = 'CANCELLED' }

/**
 * @file customer-complaint.entity.ts
 * @description Entity enum definitions
 */

export enum ComplaintType { QUALITY = 'QUALITY', DELIVERY = 'DELIVERY', PACKAGING = 'PACKAGING', DOCUMENTATION = 'DOCUMENTATION', SERVICE = 'SERVICE', OTHER = 'OTHER' }
export enum ComplaintSeverity { CRITICAL = 'CRITICAL', MAJOR = 'MAJOR', MINOR = 'MINOR' }
export enum ComplaintStatus { RECEIVED = 'RECEIVED', INVESTIGATING = 'INVESTIGATING', UNDER_INVESTIGATION = 'UNDER_INVESTIGATION', RESOLVED = 'RESOLVED', CLOSED = 'CLOSED', CANCELLED = 'CANCELLED' }

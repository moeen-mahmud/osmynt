// ====================== TYPE DEFINITIONS ======================

import type { ErrorCode } from "../formatters/response.enums";

/**
 * Standard success response format
 */
export interface SuccessResponse<T = any> {
	success: true;
	data: T;
	message: string;
	meta?: ResponseMeta;
	timestamp: string;
	requestId?: string;
}

/**
 * Paginated response format
 */
export interface PaginatedResponse<T = any> extends SuccessResponse<T[]> {
	pagination: PaginationMeta;
}

/**
 * Standard error response format following RFC7807 Problem Details
 */
export interface ErrorResponse {
	success: false;
	error: {
		type: string;
		title: string;
		status: number;
		detail: string;
		instance?: string;
		code: ErrorCode;
		timestamp: string;
		requestId?: string;
		errors?: ValidationError[];
		stack?: string;
	};
}

/**
 * Response metadata
 */
export interface ResponseMeta {
	processingTime?: number;
	version?: string;
	[key: string]: any;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

/**
 * Validation error structure
 */
export interface ValidationError {
	field: string;
	message: string;
	code: string;
	value?: any;
}

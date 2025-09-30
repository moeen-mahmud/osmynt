import { ErrorCode } from "./response.enums";
import type {
	ErrorResponse,
	PaginatedResponse,
	PaginationMeta,
	SuccessResponse,
	ValidationError,
	ResponseMeta,
} from "./response.types";
import { generateRequestId, getErrorCodeFromStatus, getErrorTitle } from "../functions/response.function";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

// ====================== SUCCESS RESPONSE FORMATTERS ======================

/**
 * Standard success response
 */
export const respondSuccess = <T>(
	c: Context,
	data: T,
	message = "Operation completed successfully",
	meta?: ResponseMeta,
	status = 200
) => {
	const requestId = c.get("requestId") || generateRequestId();
	const startTime = c.get("startTime");
	const processingTime = startTime ? Date.now() - startTime : undefined;

	const response: SuccessResponse<T> = {
		success: true,
		data,
		message,
		timestamp: new Date().toISOString(),
		requestId,
		meta: {
			...meta,
			...(processingTime && { processingTime }),
		},
	};

	return c.json(response, status as any);
};

/**
 * Created response (201)
 */
export const respondCreated = <T>(
	c: Context,
	data: T,
	message = "Resource created successfully",
	meta?: ResponseMeta
) => {
	return respondSuccess(c, data, message, meta, 201);
};

/**
 * No content response (204)
 */
export const respondNoContent = (c: Context) => {
	const requestId = c.get("requestId") || generateRequestId();
	c.header("X-Request-ID", requestId);
	return c.body(null, { status: 204 });
};

/**
 * Paginated response
 */
export const respondPaginated = <T>(
	c: Context,
	data: T[],
	pagination: PaginationMeta,
	message = "Data retrieved successfully",
	status = 200,
	meta?: ResponseMeta
) => {
	const requestId = c.get("requestId") || generateRequestId();
	const startTime = c.get("startTime");
	const processingTime = startTime ? Date.now() - startTime : undefined;

	const response: PaginatedResponse<T> = {
		success: true,
		data,
		message,
		timestamp: new Date().toISOString(),
		requestId,
		pagination,
		meta: {
			...meta,
			...(processingTime && { processingTime }),
		},
	};

	return c.json(response, { status: status as any });
};

// ====================== ERROR RESPONSE FORMATTERS ======================

/**
 * Standard error response
 */
export const respondError = (
	c: Context,
	status: number,
	detail: unknown,
	code?: ErrorCode,
	errors?: ValidationError[],
	instance?: string
) => {
	const requestId = c.get("requestId") || generateRequestId();
	const errorCode = code || getErrorCodeFromStatus(status);
	const title = getErrorTitle(status);

	const response: ErrorResponse = {
		success: false,
		error: {
			type: `https://httpstatuses.com/${status}`,
			title,
			status,
			detail,
			code: errorCode,
			timestamp: new Date().toISOString(),
			requestId,
			...(instance && { instance }),
			...(errors && { errors }),
			...(process.env.NODE_ENV !== "production" &&
				c.get("errorStack") && {
					stack: c.get("errorStack"),
				}),
		},
	};

	return c.json(response, { status: status as any });
};

/**
 * Bad request error (400)
 */
export const respondBadRequest = (c: Context, detail = "The request is invalid", errors?: ValidationError[]) => {
	return respondError(c, 400, detail, ErrorCode.BAD_REQUEST, errors);
};

/**
 * Unauthorized error (401)
 */
export const respondUnauthorized = (c: Context, detail = "Authentication is required") => {
	return respondError(c, 401, detail, ErrorCode.UNAUTHORIZED);
};

/**
 * Forbidden error (403)
 */
export const respondForbidden = (c: Context, detail = "Access to this resource is forbidden") => {
	return respondError(c, 403, detail, ErrorCode.FORBIDDEN);
};

/**
 * Not found error (404)
 */
export const respondNotFound = (c: Context, detail = "The requested resource was not found") => {
	return respondError(c, 404, detail, ErrorCode.NOT_FOUND);
};

/**
 * Validation error (422)
 */
export const respondValidationError = (
	c: Context,
	errors: ValidationError[],
	detail = "The request contains invalid data"
) => {
	return respondError(c, 422, detail, ErrorCode.VALIDATION_ERROR, errors);
};

/**
 * Internal server error (500)
 */
export const respondInternalError = (c: Context, detail = "An internal server error occurred", error?: Error) => {
	// Log the error for debugging
	console.error("Internal Server Error:", error);

	if (error) {
		c.set("errorStack", error.stack);
	}

	return respondError(c, 500, detail, ErrorCode.INTERNAL_SERVER_ERROR);
};

// ====================== HELPER FUNCTIONS ======================

/**
 * Helper to create pagination metadata
 */
export const createPagination = (page: number, limit: number, total: number): PaginationMeta => {
	const totalPages = Math.ceil(total / limit);

	return {
		page,
		limit,
		total,
		totalPages,
		hasNext: page < totalPages,
		hasPrev: page > 1,
	};
};

/**
 * Helper to format Zod validation errors
 */
export const formatZodErrors = (zodError: any): ValidationError[] => {
	if (!zodError.errors) return [];

	return zodError.errors.map((error: any) => ({
		field: error.path.join("."),
		message: error.message,
		code: error.code,
		value: error.received,
	}));
};

/**
 * Handle HTTPException and convert to standard error response
 */
export const handleHTTPException = (c: Context, error: HTTPException) => {
	const code = getErrorCodeFromStatus(error.status);
	return respondError(c, error.status, error.message, code);
};

/**
 * Global error handler for Hono
 */
export const globalErrorHandler = (error: Error, c: Context) => {
	// Handle HTTPException
	if (error instanceof HTTPException) {
		return handleHTTPException(c, error);
	}

	// Handle Zod validation errors
	if (error.name === "ZodError") {
		const validationErrors = formatZodErrors(error);
		return respondValidationError(c, validationErrors);
	}

	// Handle other known errors
	if (error.message.includes("ECONNREFUSED")) {
		return respondError(c, 503, "External service unavailable", ErrorCode.EXTERNAL_SERVICE_ERROR);
	}

	if (error.message.includes("timeout")) {
		return respondError(c, 504, "Request timeout", ErrorCode.TIMEOUT);
	}

	// Default to internal server error
	return respondInternalError(c, "An unexpected error occurred", error);
};

import { ErrorCode } from "../formatters/response.enums";

/**
 * Generate a correlation ID for request tracking
 */
export const generateRequestId = (): string => {
	return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get error code from HTTP status
 */
export const getErrorCodeFromStatus = (status: number): ErrorCode => {
	const errorMap: Record<number, ErrorCode> = {
		400: ErrorCode.BAD_REQUEST,
		401: ErrorCode.UNAUTHORIZED,
		403: ErrorCode.FORBIDDEN,
		404: ErrorCode.NOT_FOUND,
		405: ErrorCode.METHOD_NOT_ALLOWED,
		409: ErrorCode.CONFLICT,
		422: ErrorCode.VALIDATION_ERROR,
		429: ErrorCode.RATE_LIMITED,
		413: ErrorCode.PAYLOAD_TOO_LARGE,
		500: ErrorCode.INTERNAL_SERVER_ERROR,
		503: ErrorCode.SERVICE_UNAVAILABLE,
		504: ErrorCode.TIMEOUT,
	};
	return errorMap[status] || ErrorCode.INTERNAL_SERVER_ERROR;
};

/**
 * Get error title from status code
 */
export const getErrorTitle = (status: number): string => {
	const titleMap: Record<number, string> = {
		400: "Bad Request",
		401: "Unauthorized",
		403: "Forbidden",
		404: "Not Found",
		405: "Method Not Allowed",
		409: "Conflict",
		422: "Validation Error",
		429: "Too Many Requests",
		413: "Payload Too Large",
		500: "Internal Server Error",
		503: "Service Unavailable",
		504: "Gateway Timeout",
	};
	return titleMap[status] || "Unknown Error";
};

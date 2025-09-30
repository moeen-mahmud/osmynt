import chalk from "chalk";

export class Logger {
	constructor(private readonly logger: Console) {}

	private colors = {
		info: chalk.blue,
		error: chalk.red,
		warn: chalk.yellow,
		debug: chalk.gray,
		success: chalk.green,
	};

	private formatMessage(message: string, metadata: Record<string, any>, color: keyof typeof this.colors) {
		const colorFn = this.colors[color];
		const timestamp = new Date().toISOString();
		const formattedMessage = `${colorFn(timestamp)} ${colorFn(message)} ${JSON.stringify(metadata)}`;
		return formattedMessage;
	}

	public info(message: string, metadata: Record<string, any> = {}) {
		this.logger.info(this.formatMessage(message, metadata, "info"));
	}

	public error(message: string, metadata: Record<string, any> = {}) {
		this.logger.error(this.formatMessage(message, metadata, "error"));
	}

	public warn(message: string, metadata: Record<string, any> = {}) {
		this.logger.warn(this.formatMessage(message, metadata, "warn"));
	}

	public debug(message: string, metadata: Record<string, any> = {}) {
		this.logger.debug(this.formatMessage(message, metadata, "debug"));
	}

	public success(message: string, metadata: Record<string, any> = {}) {
		this.logger.log(this.formatMessage(message, metadata, "success"));
	}
}

export const logger = new Logger(console);

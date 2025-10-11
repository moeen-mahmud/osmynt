// Browser-compatible storage implementation
export class BrowserStorage {
	private secrets: Map<string, string> = new Map();

	async store(key: string, value: string): Promise<void> {
		this.secrets.set(key, value);
		console.log(`Stored secret: ${key} (in-memory only for VS Code web extension)`);
		// Note: VS Code web extensions have limited storage options
		// In a real implementation, you might use VS Code's secret storage API
	}

	async get(key: string): Promise<string | undefined> {
		// Check in-memory cache
		if (this.secrets.has(key)) {
			return this.secrets.get(key);
		}

		console.log(`Secret not found: ${key}`);
		return undefined;
	}

	async delete(key: string): Promise<void> {
		this.secrets.delete(key);
		console.log(`Deleted secret: ${key}`);
	}

	async update(key: string, value: any): Promise<void> {
		await this.store(key, JSON.stringify(value));
	}

	async getState(key: string): Promise<any> {
		const value = await this.get(key);
		if (value) {
			try {
				return JSON.parse(value);
			} catch {
				return value;
			}
		}
		return undefined;
	}
}

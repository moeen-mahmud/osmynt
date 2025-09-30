const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT!;
const version = process.env.NEXT_PUBLIC_API_DOC_VERSION!;

// Create a simplified client that provides the expected method signatures
export const client = (name?: string, token?: string) => {
	const baseURL = `${baseUrl}/talinq-api-engine/${version}/${name || ""}`;
	const headers = {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};

	// Return an object that provides the expected method chains
	return new Proxy({} as any, {
		get(target, prop) {
			if (typeof prop === "string") {
				// Return another proxy for method chaining
				return new Proxy({} as any, {
					get(target, method) {
						if (
							method === "$post" ||
							method === "$get" ||
							method === "$patch" ||
							method === "$put" ||
							method === "$delete"
						) {
							return async (options?: any) => {
								const url = prop === "/" ? baseURL : `${baseURL}/${prop}`;
								const fetchOptions: RequestInit = {
									method: method.substring(1).toUpperCase(),
									headers,
								};

								if (options?.json) {
									fetchOptions.body = JSON.stringify(options.json);
								}

								if (options?.query) {
									const searchParams = new URLSearchParams(options.query);
									const urlWithQuery = `${url}?${searchParams.toString()}`;
									return fetch(urlWithQuery, fetchOptions);
								}

								return fetch(url, fetchOptions);
							};
						}
						return target[method];
					},
				});
			}
			return target[prop];
		},
	});
};

export type Client = typeof client;

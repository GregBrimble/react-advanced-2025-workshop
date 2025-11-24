import { AsyncLocalStorage } from "node:async_hooks";

export const envStorage = new AsyncLocalStorage<Env>();
export const requestStorage = new AsyncLocalStorage<Request>();

export function getEnv(): Env {
	const env = envStorage.getStore();
	if (!env) {
		throw new Error(
			"Environment not available. Make sure the request is running within the env context.",
		);
	}
	return env;
}

export function getRequest(): Request {
	const request = requestStorage.getStore();
	if (!request) {
		throw new Error(
			"Request not available. Make sure the request is running within the request context.",
		);
	}
	return request;
}

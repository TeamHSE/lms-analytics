import axios, { CreateAxiosDefaults } from 'axios';

import { ErrorsEnum, errorCatch } from '@/api/error-catcher';

import { getAccessToken, removeAccessToken } from '@/services/auth-token.service';
import { authService } from '@/services/auth.service';

const options: CreateAxiosDefaults = {
	baseURL: 'http://localhost:5220/',
	timeout: 60,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
};

const clientUnauthenticated = axios.create(options);

const client = axios.create(options);
client.interceptors.request.use(config => {
	const accessToken = getAccessToken();

	if (config?.headers && accessToken) {
		config.headers.Authorization = `Bearer ${ accessToken }`;
	}

	return config;
});

client.interceptors.response.use(
	config => config,
	async error => {
		const originalRequest = error.config;

		if (
			(error?.response?.status[0] === '4' || errorCatch(error) === ErrorsEnum.JWT_EXPIRED || errorCatch(error) === ErrorsEnum.JWT_MUST_BE_PROVIDED) &&
			error.config &&
			!error.config._isRetry
		) {
			originalRequest._isRetr = true;
			try {
				await authService.getNewTokens();
				return client.request(originalRequest);
			} catch (error) {
				if (errorCatch(error) === ErrorsEnum.JWT_EXPIRED) {
					removeAccessToken();
				}
			}
		}
	},
);

export { client, clientUnauthenticated };

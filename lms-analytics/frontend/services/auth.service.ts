import { API_CONSTANTS } from '@/constants/api.constants';

import { AuthResponse, ILoginForm, IRegisterForm, ITokensResponse } from '@/types/auth.types';

import { client, clientUnauthenticated } from '@/api/interceptors';

import { removeAccessToken, saveAccessToken } from '@/services/auth-token.service';

export const authService = {
	async login(data: ILoginForm) {
		const response = await clientUnauthenticated.post<AuthResponse>(API_CONSTANTS.LOGIN, data);

		if (response.data.accessToken) {
			saveAccessToken(response.data.accessToken);
		}

		return response;
	},

	async register(data: IRegisterForm) {
		const response = await clientUnauthenticated.post<AuthResponse>(API_CONSTANTS.REGISTER, data);

		if (response.data.accessToken) {
			saveAccessToken(response.data.accessToken);
		}

		return response;
	},

	async getNewTokens() {
		const response = await client.post<ITokensResponse>(API_CONSTANTS.TOKENS);

		if (response.data.accessToken) {
			saveAccessToken(response.data.accessToken);
		}

		return response;
	},

	async logout() {
		removeAccessToken();
	},
};

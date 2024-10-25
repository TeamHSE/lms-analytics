import { API_CONSTANTS } from '@/constants/api.constants';

import { IUser } from '@/types/auth.types';

import { client } from '@/api/interceptors';

class UserService {
	async getUser() {
		const response = await client.get<IUser>(API_CONSTANTS.USER);
		return response.data;
	}
}

export const userService = new UserService();

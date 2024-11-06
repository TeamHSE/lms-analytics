import axios, { CreateAxiosDefaults } from 'axios';
import { toast } from 'sonner';
import { errorCatch } from '@/api/error-catcher';
import { getAccessToken, removeAccessToken } from '@/services/auth-token.service';

const options: CreateAxiosDefaults = {
	baseURL: 'http://localhost:5220',
	timeout: 60 * 1000,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
};

const clientUnauthenticated = axios.create(options);
clientUnauthenticated.interceptors.response.use(
	config => config,
	async error => {
		if (error?.response?.status === 422 || error?.response?.status === 400) {
			if (error.response.data.errors) {
				const validationErrors = error.response.data.errors.map((e: any) => '- ' + e.msg);
				toast.error('Ошибки валидации!',
					{
						duration: 10000,
						closeButton: true,
						important: true,
						description: validationErrors.join('\n'),
						style: {
							whiteSpace: 'pre-line',
						},
					});
			} else {
				toast.error(error.response.data.message);
			}
			throw error;
		}

		if (error?.response?.status.toString()[0] === 4) {
			toast.error(error?.response?.data?.message);
		}

		if (process.env.NODE_ENV == 'production') {
			toast.error('Произошла ошибка, обратитесь к разработчикам',
				{ duration: 10000, closeButton: true, important: true });
		}

		throw error;
	});

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
			error?.response?.status === 401
			&& error.config
			&& !error.config._isRetry
		) {
			originalRequest._isRetry = true;
			try {
				return client.request(originalRequest);
			} catch (error) {
				if (errorCatch(error) === 'jwt expired') {
					removeAccessToken();
				}
			}
		}

		if (error?.response?.status === 422) {
			if (error.response.data.errors) {
				const validationErrors = error.response.data.errors.map((e: any) => '- ' + e.msg);
				toast.error('Ошибки валидации!',
					{
						duration: 10000,
						closeButton: true,
						important: true,
						description: validationErrors.join('\n'),
						style: {
							whiteSpace: 'pre-line',
						},
					});
			} else {
				toast.error('Ошибки валидации');
			}
			return;
		}

		if (process.env.NODE_ENV == 'production') {
			toast.error('Произошла ошибка, обратитесь к разработчикам',
				{ duration: 10000, closeButton: true, important: true });
			return;
		}

		throw error;
	},
);

export { client, clientUnauthenticated };

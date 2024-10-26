/* eslint-disable @typescript-eslint/no-explicit-any */
export const errorCatch = (error: any): string => {
	const message = error?.response?.data?.message;

	return message
		? (typeof error.response.data.message === 'object'
			? message[0]
			: message)
		: error.message;
};

export const enum ErrorsEnum {
	JWT_EXPIRED = 'jwt expired',
	JWT_MUST_BE_PROVIDED = 'jwt must be provided',
}

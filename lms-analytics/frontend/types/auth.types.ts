export interface ILoginForm {
	username: string;
	password: string;
}

export interface IRegisterForm {
	email: string;
	username: string;
	password: string;
}

export interface IUser {
	id: number;
	username: string;
	email: string;
}

export interface ITokensResponse {
	accessToken: string;
	refreshToken: string;
}

export type AuthResponse = ITokensResponse & { user: IUser };

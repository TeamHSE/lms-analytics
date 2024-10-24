class ApiConstants {
	private apiRoot = 'api';
	private authRoot = `${ this.apiRoot }/auth`;

	PING = `${ this.apiRoot }/ping`;
	USER = `${ this.apiRoot }/user`;

	REGISTER = `${ this.authRoot }/register`;
	LOGIN = `${ this.authRoot }/login`;
	TOKENS = `${ this.authRoot }/tokens`;
}

export const API_CONSTANTS = new ApiConstants();

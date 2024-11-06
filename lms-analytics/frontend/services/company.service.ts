import { API_CONSTANTS } from '@/constants/api.constants';
import { client } from '@/api/interceptors';

class CompanyService {
	async getCompanies() {
		const response = await client.get<Company[]>(API_CONSTANTS.COMPANIES);

		return response.data;
	}

	async getCompany(id: number) {
		const response = await client.get<Company>(`${ API_CONSTANTS.COMPANIES }/${ id }`);

		return response.data;
	}

	async addCompany(request: CompanyRequest) {
		const response = await client.post<Company>(API_CONSTANTS.COMPANIES, request);

		return response.data;
	}

	async updateCompany(companyId: number, request: CompanyRequest) {
		const response = await client.put<Company>(`${ API_CONSTANTS.COMPANIES }/${ companyId }`, request);

		return response.data;
	}

	async deleteCompany(companyId: number) {
		await client.delete(`${ API_CONSTANTS.COMPANIES }/${ companyId }`);
	}
}

export const companyService = new CompanyService();
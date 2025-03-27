import createApiClient from './api.service'

class MuonSachService {
  constructor(baseUrl = '/api/muonsach') {
    this.api = createApiClient(baseUrl)
  }

  async getAll() {
    return (await this.api.get('/')).data
  }

  async create(data) {
    return (await this.api.post('/', data)).data
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data
  }

  async update(id, data) {
    const response = await this.api.patch(`/${id}`, data);
    return response.data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data
  }
}

export default new MuonSachService()
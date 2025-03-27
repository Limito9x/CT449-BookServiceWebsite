import createApiClient from './api.service'

class NhanVienService {
  constructor(baseUrl = '/api/nhanvien') {
    this.api = createApiClient(baseUrl)
  }

  async getAll() {
    return (await this.api.get('/')).data
  }

  async create(data) {
    return (await this.api.post('/', data)).data
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data.user
  }

  async update(id, data) {
    const response = await this.api.patch(`/${id}`, data);
    if(response) localStorage.setItem("user",JSON.stringify(response.data.user));
    return response.data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data
  }
}

export default new NhanVienService()

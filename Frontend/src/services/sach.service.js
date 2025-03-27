import createApiClient from './api.service'

class SachService {
  constructor(baseUrl = '/api/sach') {
    this.api = createApiClient(baseUrl)
  }

  async getAll() {
    return (await this.api.get('/')).data
  }

  async create(data,file) {
    const formData = new FormData()

    // Thêm tất cả dữ liệu sách vào formData
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key])
    })

    // Nếu có file hình, thêm vào formData
    if (file) {
      formData.append('hinhanh', file)
    }

    return (
      await this.api.post('/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ).data
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data
  }

  async update(id, data,file) {
    const formData = new FormData()
    // Thêm tất cả dữ liệu sách vào formData
    Object.keys(data).forEach((key) => {
      if(key!=='hinhanh'){
        formData.append(key, data[key])
      }
    })
    // Nếu có file hình, thêm vào formData
    if (file) {
      formData.append('hinhanh', file);
    }
    return (
      await this.api.patch(`/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ).data
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data
  }
}

export default new SachService()

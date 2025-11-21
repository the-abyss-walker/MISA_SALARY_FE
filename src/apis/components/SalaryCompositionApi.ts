import BaseApi from '../base/BaseApi'
import api from '../config/ApiConfig'

class SalaryCompositionApi extends BaseApi {
  constructor() {
    super()
    this.controller = 'SalaryComposition'
  }

  updateStatus(id: string, status: number) {
    return api.patch(`${this.controller}/status/${id}`, { status })
  }

  defaultComposition(ids: Array<string | number>) {
    return api.post(`${this.controller}/default-composition`, ids)
  }

  createFromSystem(ids: Array<string | number>) {
    return api.post(`${this.controller}/from-system`, ids)
  }
}

export default new SalaryCompositionApi()

import BaseApi from '../base/BaseApi'
import api from '../config/ApiConfig'

class SalaryCompositionSystemApi extends BaseApi {
  constructor() {
    super()
    this.controller = 'SalaryCompositionSystem'
  }

  existCompositionCode(code: string) {
    return api.post(`${this.controller}/exist-composition-code?code=${code}`)
  }
}

export default new SalaryCompositionSystemApi()

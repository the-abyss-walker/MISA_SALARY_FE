import BaseApi from '../base/BaseApi'

class SalaryCompositionSystemApi extends BaseApi {
  constructor() {
    super()
    this.controller = 'SalaryCompositionSystem'
  }
}

export default new SalaryCompositionSystemApi()

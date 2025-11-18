import BaseApi from '../base/BaseApi'

class SalaryCompositionSystemApi extends BaseApi {
  constructor() {
    super()
    this.controller = 'salary-composition'
  }
}

export default new SalaryCompositionSystemApi()

import BaseApi from '../base/BaseApi'

class SalaryCompositionSystemApi extends BaseApi {
  constructor() {
    super()
    this.controller = 'salary-composition-system'
  }
}

export default new SalaryCompositionSystemApi()

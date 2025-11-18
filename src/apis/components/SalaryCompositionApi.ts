import BaseApi from '../base/BaseApi'

class SalaryCompositionApi extends BaseApi {
  constructor() {
    super()
    this.controller = 'SalaryComposition'
  }
}

export default new SalaryCompositionApi()

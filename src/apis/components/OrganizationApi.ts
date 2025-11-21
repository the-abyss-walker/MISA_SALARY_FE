import BaseApi from '../base/BaseApi'

class OrganizationApi extends BaseApi {
  constructor() {
    super()
    this.controller = 'OrganizationUnit'
  }
}

export default new OrganizationApi()

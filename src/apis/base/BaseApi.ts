import api from '../config/ApiConfig'

export default class BaseApi {
  protected controller: string | null
  constructor() {
    this.controller = null
  }

  /**
   * Hàm lấy tất cả dữ liệu
   * createdby: VanViet (18/11/2025)
   */
  getAll() {
    return api.get(`${this.controller}`)
  }

  /**
   * Hàm lấy dữ liệu theo Id
   * createdby: VanViet (18/11/2025)
   * @param id Id của bản ghi cần lấy
   */
  getById(id: string | number) {
    return api.get(`${this.controller}/${id}`)
  }

  /**
   * Hàm cập nhật dữ liệu theo Id
   * createdby: VanViet (18/11/2025)
   * @param id Id của bản ghi cần cập nhật
   * @param data Dữ liệu cần cập nhật
   */
  update(id: string | number, data: any) {
    return api.put(`${this.controller}/${id}`, data)
  }

  /**
   * Hàm tạo mới dữ liệu
   * createdby: VanViet (18/11/2025)
   * @param data Dữ liệu cần tạo mới
   */
  create(data: any) {
    return api.post(`${this.controller}`, data)
  }

  /**
   * Hàm xóa dữ liệu theo Id
   * createdby: VanViet (18/11/2025)
   * @param id Id của bản ghi cần xóa
   */
  delete(id: string | number) {
    return api.delete(`${this.controller}/${id}`)
  }

  /**
   * Hàm xóa nhiều bản ghi
   * createdby: VanViet (18/11/2025)
   * @param ids Mảng Id của các bản ghi cần xóa
   */
  bulkDelete(ids: Array<string | number>) {
    return api.delete(`${this.controller}`, { data: ids })
  }

  /**
   * Hàm lấy dữ liệu phân trang
   * createdby: VanViet (18/11/2025)
   * @param pageIndex Số trang hiện tại
   * @param pageSize Số bản ghi trên trang
   */
  paging(pageIndex: number, pageSize: number) {
    return api.get(`${this.controller}/all?pageIndex=${pageIndex}&pageSize=${pageSize}`)
  }
}

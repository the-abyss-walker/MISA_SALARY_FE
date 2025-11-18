export enum CompositionType {
  EmployeeInfomation = 1,
  Timekeeping = 2,
  Sales = 3,
  KPI = 4,
  Product = 5,
  Salary = 6,
  PersonalIncomeTax = 7,
  Insurance = 8,
  Other = 9,
}

export const CompositionTypeLabel: Record<CompositionType, string> = {
  [CompositionType.EmployeeInfomation]: 'Thông tin nhân viên',
  [CompositionType.Timekeeping]: 'Chấm công',
  [CompositionType.Sales]: 'Doanh số',
  [CompositionType.KPI]: 'KPI',
  [CompositionType.Product]: 'Sản phẩm',
  [CompositionType.Salary]: 'Lương',
  [CompositionType.PersonalIncomeTax]: 'Thuế TNCN',
  [CompositionType.Insurance]: 'Bảo hiểm - công đoàn',
  [CompositionType.Other]: 'Khác',
}

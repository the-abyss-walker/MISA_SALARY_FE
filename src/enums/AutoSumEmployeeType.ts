export enum AutoSumEmployeeType {
  SameWorkingUnit = 1,
  UnderAuthority = 2,
  BelongToOrganization = 3,
}

export const AutoSumEmployeeTypeLabel: Record<AutoSumEmployeeType, string> = {
  [AutoSumEmployeeType.SameWorkingUnit]: 'Nhân viên cùng đơn vị công tác',
  [AutoSumEmployeeType.UnderAuthority]: 'Nhân viên thuộc quyền quản lý',
  [AutoSumEmployeeType.BelongToOrganization]: 'Nhân viên thuộc tổ chức',
}

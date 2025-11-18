export enum AutoSumEmployeeType {
  SameWorkingUnit = 1,
  UnderAuthority = 2,
  BelongToOrganization = 3,
}

export const AutoSumEmployeeTypeLabel: Record<AutoSumEmployeeType, string> = {
  [AutoSumEmployeeType.SameWorkingUnit]: 'Trong cùng đơn vị công tác',
  [AutoSumEmployeeType.UnderAuthority]: 'Dưới quyền',
  [AutoSumEmployeeType.BelongToOrganization]: 'Thuộc cơ cấu tổ chức',
}

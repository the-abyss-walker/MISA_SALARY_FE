export enum ValueType {
  Number = 1,
  Money = 2,
  Percent = 3,
  Word = 4,
  Day = 5,
}

export const ValueTypeLabel: Record<ValueType, string> = {
  [ValueType.Number]: 'Số',
  [ValueType.Money]: 'Tiền',
  [ValueType.Percent]: 'Phần trăm',
  [ValueType.Word]: 'Chữ',
  [ValueType.Day]: 'Ngày',
}

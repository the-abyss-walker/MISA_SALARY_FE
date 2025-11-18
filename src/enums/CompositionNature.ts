export enum CompositionNature {
  Income = 1,
  Deduction = 2,
  Other = 3,
}

export const CompositionNatureLabel: Record<CompositionNature, string> = {
  [CompositionNature.Income]: 'Thu nhập',
  [CompositionNature.Deduction]: 'Khấu trừ',
  [CompositionNature.Other]: 'Khác',
}

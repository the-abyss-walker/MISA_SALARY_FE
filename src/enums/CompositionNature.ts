export enum CompositionNature {
  Income = 1,
  Deduction = 2,
  Other = 3,
}

export const CompositionNatureLabel: Record<CompositionNature, string> = {
  [CompositionNature.Income]: 'Khoản thu',
  [CompositionNature.Deduction]: 'Khoản giảm trừ',
  [CompositionNature.Other]: 'Khác',
}

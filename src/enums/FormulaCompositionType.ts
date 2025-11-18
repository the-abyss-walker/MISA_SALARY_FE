export enum FormulaCompositionType {
  DefaultFormula = 1,
  AutoSumFormula = 2,
  CustomFormula = 3,
}

export const FormulaCompositionTypeLabel: Record<FormulaCompositionType, string> = {
  [FormulaCompositionType.DefaultFormula]: 'Công thức mặc định',
  [FormulaCompositionType.AutoSumFormula]: 'Công thức tự động cộng',
  [FormulaCompositionType.CustomFormula]: 'Công thức tùy chỉnh',
}

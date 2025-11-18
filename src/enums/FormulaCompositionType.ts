export enum FormulaCompositionType {
  DefaultFormula = 1,
  AutoSumFormula = 2,
  CustomFormula = 3,
}

export const FormulaCompositionTypeLabel: Record<FormulaCompositionType, string> = {
  [FormulaCompositionType.DefaultFormula]: 'Theo công thức mặc định của chương trình',
  [FormulaCompositionType.AutoSumFormula]: 'Tự động cộng các giá trị của nhân viên',
  [FormulaCompositionType.CustomFormula]: 'Tính theo công thức tự đặt',
}

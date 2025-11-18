export enum OptionShowPaycheck {
  Yes = 1,
  No = 2,
  ShowWhenNonZero = 3,
}

export const OptionShowPaycheckLabel: Record<OptionShowPaycheck, string> = {
  [OptionShowPaycheck.Yes]: 'Hiển thị',
  [OptionShowPaycheck.No]: 'Không hiển thị',
  [OptionShowPaycheck.ShowWhenNonZero]: 'Hiển thị khi khác 0',
}

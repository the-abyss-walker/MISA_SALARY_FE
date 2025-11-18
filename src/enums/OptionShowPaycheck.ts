export enum OptionShowPaycheck {
  Yes = 1,
  No = 2,
  ShowWhenNonZero = 3,
}

export const OptionShowPaycheckLabel: Record<OptionShowPaycheck, string> = {
  [OptionShowPaycheck.Yes]: 'Có',
  [OptionShowPaycheck.No]: 'Không',
  [OptionShowPaycheck.ShowWhenNonZero]: 'Chỉ hiển thị nếu giá trị khác không',
}

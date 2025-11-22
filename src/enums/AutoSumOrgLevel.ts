export enum AutoSumOrgLevel {
  Level1 = 1,
  Level2 = 2,
  Level3 = 3,
  Level4 = 4,
}

export const AutoSumOrgLevelLabel: Record<AutoSumOrgLevel, string> = {
  [AutoSumOrgLevel.Level1]: 'Cấp 1',
  [AutoSumOrgLevel.Level2]: 'Cấp 2',
  [AutoSumOrgLevel.Level3]: 'Cấp 3',
  [AutoSumOrgLevel.Level4]: 'Cấp 4',
}

export enum Status {
  Following = 1,
  Stopped = 2,
}

export const StatusLabel: Record<Status, string> = {
  [Status.Following]: 'Đang theo dõi',
  [Status.Stopped]: 'Ngừng theo dõi',
}

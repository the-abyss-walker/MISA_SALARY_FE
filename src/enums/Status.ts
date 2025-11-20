export enum Status {
  Following = 0,
  Stopped = 1,
}

export const StatusLabel: Record<Status, string> = {
  [Status.Following]: 'Đang theo dõi',
  [Status.Stopped]: 'Ngừng theo dõi',
}

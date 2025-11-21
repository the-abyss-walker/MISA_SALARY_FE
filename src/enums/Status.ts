export enum Status {
  Following = 1,
  UnFollowing = 2,
}

export const StatusLabel: Record<Status, string> = {
  [Status.Following]: 'Đang theo dõi',
  [Status.UnFollowing]: 'Ngừng theo dõi',
}

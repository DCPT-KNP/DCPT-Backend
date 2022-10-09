export enum SNSType {
  KAKAO = 'kakao',
  NAVER = 'naver',
  GOOGLE = 'google',
}

export enum ShapeType {
  I = 'I',
  T = 'T',
  PI = 'PI',
}

export enum SkillType {
  UXD = 'UXD',
  UXR = 'UXR',
  UXW = 'UXW',
  UID = 'UID',
  IXD = 'IXD',
  BXD = 'BXD',
  GRD = 'GRD',
}

export enum CardStatusType {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

export interface DuplicateCard {
  uuid: string;
  title: string;
}

export interface SkillCardInfo {
  title: string;
  description: string;
  tip: string;
}

export interface SkillInfo {
  name: string;
  full_name: string;
  description: string;
  recommend_skill?: SkillType[];
  default?: SkillCardInfo;
  other?: SkillCardInfo[];
}

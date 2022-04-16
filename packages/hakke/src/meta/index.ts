export interface GameInfo {
  name: string
  author: string
  description: string

  // 游戏版本 major.minor.patch
  // major: 存档无法兼容 e.g. 升级主引擎导致数据不兼容
  // minor: 存档可兼容化 e.g. 新增子引擎，且可自动初始化数据
  // patch: 存档完全兼容 e.g. 文案调整
  version: GaveVersion
}

export interface GaveVersion {
  major: number
  minor: number
  patch: number
}

// 游戏包
export interface GamePackage<
  GameEngineLabel extends string = string
> {
  info: GameInfo

  // 主引擎版本 major.minor.patch
  // major: e.g. 删除子引擎
  // minor: e.g. 新增子引擎
  // patch: e.g. 问题修复
  version: GaveVersion
  // 子引擎元数据
  engines: Record<GameEngineLabel, GameEngineMeta>
  // 游戏模式
  mode: string[]
  // 初始化
  init: {
    newGame: {
      save: GameInitSaveData
      start: GameEngineLabel[]
    }
    newGamePlus?: {
      // TODO: 继承存档
      start: GameEngineLabel[]
    }
  }
  menu: {
    // TODO: cg?: string
    skipIfNoSaveData: boolean
  }
}

export const CORE_VERSION_META: GaveVersion = {
  major: 0,
  minor: 0,
  patch: 0,
};
export const fmtVerion = (ver: GaveVersion) => `${
  ver.major}.${ver.minor}.${ver.patch}` as const;
export type GameEngineType =
  // Galgame
  | 'gal'
  // 三消
  | 'match3';

// 子引擎元数据
export interface GameEngineMeta {
  type: GameEngineType
  // 子引擎版本 major.minor.patch
  // major: 实现完全变更 e.g. gal引擎版本为 `1.${number}.${number}` gal2引擎版本为 `2.${number}.${number}`
  // minor: e.g. 新增功能
  // patch: e.g. 问题修复
  version: GaveVersion
}

// 游戏存档
export interface GameInitSaveData {
  core: GameCoreSaveData
  engines: Record<string, GameEngineSaveData>
}
export interface GameSaveData extends GameInitSaveData {
  info: GameInfo
}
export interface GameCoreSaveData {
  // TODO: impl
  tmp: number
}
export interface GameEngineSaveData {
  // TODO: impl
  tmp: number
}

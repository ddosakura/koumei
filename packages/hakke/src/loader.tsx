import { GamePackage, GameSaveData, CORE_VERSION_META, fmtVerion } from './meta';

export const GameEngine: React.FC<{
  pkg: GamePackage
  saveDataList: GameSaveData[]
}> = ({ pkg, saveDataList }) => {
  if (pkg.version.major > CORE_VERSION_META.major) {
    return <div>当前引擎版本过低，请升级至{fmtVerion(pkg.version)}</div>;
  }
  if (pkg.version.minor > CORE_VERSION_META.minor) {
    return <div>当前引擎版本较低，请升级至{fmtVerion(pkg.version)}</div>;
  }
  if (pkg.version.patch > CORE_VERSION_META.patch) {
    return <div>当前引擎有补丁可使用，请升级至{fmtVerion(pkg.version)}</div>;
  }
  const hasSaveData = saveDataList.length > 0;
  if (pkg.menu.skipIfNoSaveData && !hasSaveData) {
    return <GameCoreEngine pkg={pkg} />;
  }
  return <GameMenu pkg={pkg} saveDataList={saveDataList} />;
};

const GameMenu: React.FC<{
  pkg: GamePackage
  saveDataList: GameSaveData[]
}> = ({}) => {
  console.log('xxx');
  return <div>GameMenu</div>;
};

const GameCoreEngine: React.FC<{
  pkg: GamePackage
  saveData?: GameSaveData
}> = ({}) => {
  console.log('xxx');
  return <div>GameCoreEngine</div>;
};

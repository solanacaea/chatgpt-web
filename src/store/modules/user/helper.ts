import { ss } from '@/utils/storage'
import { meInfo } from '@/api'

const LOCAL_NAME = 'userStorage'
const LOCAL_NAME_DEFAULT = 'userStorageDefault'

export interface UserInfo {
  avatar: string
  name: string
  description: string
  usage: String
}

export interface UserState {
  userInfo: UserInfo
}

export function defaultSetting(): UserState {
  return ss.get(LOCAL_NAME_DEFAULT)
  // return {
  //   userInfo: {
  //     avatar: 'https://raw.githubusercontent.com/Chanzhaoyu/chatgpt-web/main/src/assets/avatar.jpg',
  //     name: 'ChenZhaoYu',
  //     description: 'Star on <a href="https://github.com/Chanzhaoyu/chatgpt-bot" class="text-blue-500" target="_blank" >Github</a>',
  //     usage: '0/0',
  //   },
  // }
}

export async function getRemoteState(): Promise<UserState> {
  const me = await meInfo()
  const meState = {
    userInfo: {
      avatar: '',
      name: me.name,
      description: '',
      usage: `${me.usage.askCount}/${me.memberInfo.reqCount}`,
    },
  }
  return { ...meState }
}

export function getLocalState(): UserState {
  // const localSetting: UserState | undefined = ss.get(LOCAL_NAME)
  // const me = await meInfo()
  // const meState = {
  //   userInfo: {
  //     avatar: '',
  //     name: me.name,
  //     description: '',
  //     usage: `${me.usage.askCount}/${me.memberInfo.reqCount}`,
  //   },
  // }
  return { ...defaultSetting() }
}

export function setLocalState(setting: UserState): void {
  ss.set(LOCAL_NAME, setting)
}

export function setDefaultState(setting: UserState): void {
  ss.set(LOCAL_NAME_DEFAULT, setting)
}

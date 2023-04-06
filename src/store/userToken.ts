import { ss } from '@/utils/storage'

const LOCAL_NAME = 'USER_TOKEN'

export function getUserToken() {
  return ss.get(LOCAL_NAME)
}

export function setUserToken(token: string) {
  return ss.set(LOCAL_NAME, token)
}

export function removeUserToken() {
  return ss.remove(LOCAL_NAME)
}

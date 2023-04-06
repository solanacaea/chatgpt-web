import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from './helper'
import { store } from '@/store'
// import { fetchSession } from '@/api'

interface SessionResponse {
  auth: boolean
  model: 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI'
}

export interface AuthState {
  token: string | undefined
  session: SessionResponse | null
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    session: null,
  }),

  getters: {
    isChatGPTAPI(state): boolean {
      return state.session?.model === 'ChatGPTAPI'
    },
  },

  actions: {
    // async getSession() {
    //   try {
    //     const { data } = await fetchSession<SessionResponse>()
    //     this.session = { ...data }
    //     return Promise.resolve(data)
    //   }
    //   catch (error) {
    //     return Promise.reject(error)
    //   }
    // },

    setToken(token: string) {
      this.token = token
      setToken(token)
      this.session = { auth: true, model: 'ChatGPTAPI' }
    },

    removeToken() {
      this.token = undefined
      this.session = null
      removeToken()
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}

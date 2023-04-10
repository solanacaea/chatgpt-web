import type { Router } from 'vue-router'
import storage from 'store'
import { useAuthStoreWithout } from '@/store/modules/auth'
// import NProgress from 'nprogress'
import { setUserToken } from '@/store/userToken'
import { validteMe } from '@/api'

// NProgress.configure({ showSpinner: false })
export const ACCESS_TOKEN = 'Authorization'
export const ACCESS_TOKEN_USER = 'AuthorizationUser'

export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    // NProgress.start()
    // const userToken = getUserToken()
    let userToken = storage.get(ACCESS_TOKEN)
    const loginRoutePath = '/login'
    const authStore = useAuthStoreWithout()

    const { status, message } = await validteMe()
    if (status == 'failed') {
      userToken = null
    } 

    if (to.path != loginRoutePath && !userToken) {
      const loginRoutePathWithUser = `${loginRoutePath}?query1=${JSON.stringify(to.query)}&param1=${JSON.stringify(to.params)}`
      // console.log('loginRoutePathWithUser', loginRoutePathWithUser)
      next({ path: loginRoutePathWithUser, query: to.query })
      // NProgress.done()
    }
    else {
      if (to.path == loginRoutePath && userToken) {
        next('/chat')
      } else {
        setUserToken(userToken)
        next()
      }
    }
    // const authStore = useAuthStoreWithout()
    // if (!authStore.session) {
    //   try {
    //     const data = await authStore.getSession()
    //     if (String(data.auth) === 'false' && authStore.token)
    //       authStore.removeToken()
    //     if (to.path === '/500')
    //       next({ name: 'Root' })
    //     else
    //       next()
    //   }
    //   catch (error) {
    //     if (to.path !== '/500')
    //       next({ name: '500' })
    //     else
    //       next()
    //   }
    // }
    // else {
    //   next()
    // }

    router.afterEach(() => {
      // NProgress.done() // finish progress bar
    })
  })
}

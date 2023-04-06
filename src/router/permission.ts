import type { Router } from 'vue-router'
import storage from 'store'
import { useAuthStoreWithout } from '@/store/modules/auth'
// import NProgress from 'nprogress'
import { setUserToken } from '@/store/userToken'

// NProgress.configure({ showSpinner: false })
export const ACCESS_TOKEN = 'Authorization'

export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    // NProgress.start()
    // const userToken = getUserToken()
    const userToken = storage.get(ACCESS_TOKEN)
    setUserToken(userToken)
    const loginRoutePath = '/login'
    const authStore = useAuthStoreWithout()
    // eslint-disable-next-line eqeqeq
    if (to.path != loginRoutePath && !userToken) {
      const loginRoutePathWithUser = `${loginRoutePath}?query1=${JSON.stringify(to.query)}&param1=${JSON.stringify(to.params)}`
      // console.log('loginRoutePathWithUser', loginRoutePathWithUser)
      next({ path: loginRoutePathWithUser, query: to.query })
      // NProgress.done()
    }
    else {
      // console.log('loginRoutePathWithUser', 'success')
      next()
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

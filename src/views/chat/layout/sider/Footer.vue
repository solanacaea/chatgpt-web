<script setup lang='ts'>
import { defineAsyncComponent, ref } from 'vue'
import { HoverButton, SvgIcon, UserAvatar } from '@/components/common'
import { ACCESS_TOKEN, ACCESS_TOKEN_USER } from '@/router/permission'
import storage from 'store'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const router = useRouter()
const Setting = defineAsyncComponent(() => import('@/components/common/Setting/index.vue'))
const show = ref(false)

function logout(): void {
  storage.remove(ACCESS_TOKEN)
  storage.remove(ACCESS_TOKEN_USER)
  router.push('/login')
  userStore.remove()
}
</script>

<template>
  <footer class="flex items-center justify-between min-w-0 p-3 overflow-hidden border-t dark:border-neutral-800">
    <div class="flex-1 flex-shrink-0 overflow-hidden">
      <Suspense>
        <UserAvatar />
      </Suspense>
    </div>

    <HoverButton @click="show = true">
      <span class="text-2xl text-[#4f555e] dark:text-white">
        <SvgIcon icon="ri:settings-4-line" />
      </span>
    </HoverButton>
    <HoverButton @click="logout()">
      <span class="text-2xl text-[#4f555e] dark:text-white">
        <SvgIcon icon="material-symbols:logout-sharp" />
      </span>
    </HoverButton>
    <Setting v-if="show" v-model:visible="show" />
  </footer>
</template>

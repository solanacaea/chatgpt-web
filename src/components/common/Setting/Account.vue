<script lang="ts" setup>
import { computed, ref } from 'vue'
import { NButton, NInput, NPopconfirm, NSelect, NText, useMessage } from 'naive-ui'
import type { Language, Theme } from '@/store/modules/app/helper'
import { SvgIcon } from '@/components/common'
import { useAppStore, useUserStore } from '@/store'
import { getLocalState, setDefaultState } from '@/store/modules/user/helper'
import type { UserInfo } from '@/store/modules/user/helper'
import { getCurrentDate } from '@/utils/functions'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { t } from '@/locales'
import { updateMe, updatePwd } from '@/api'
import { ACCESS_TOKEN_USER } from '@/router/permission'
import storage from 'store'

interface FormState {
  username: string
  password: string
}

const appStore = useAppStore()
// const remoteStore = await getRemoteState()
// setDefaultState(remoteStore)

// const userStore = useUserStore()

const { isMobile } = useBasicLayout()

const ms = useMessage()

const theme = computed(() => appStore.theme)

// const userInfo = computed(() => userStore.userInfo)

const userInfo = getLocalState()

// const avatar = userInfo.userInfo.avatar
const username = ref(userInfo.userInfo.username ?? '')
const usernameDisabled = true
const name = ref(userInfo.userInfo.name ?? '')
// const description = userInfo.userInfo.description
const usage = ref(userInfo.userInfo.usage ?? '')
// const avatar = ref(userInfo.avatar ?? '')
// const name = ref(userInfo.name ?? '')
// const description = ref(userInfo.description ?? '')
const prePassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const ph1 = computed(() => t('setting.pwdPrePlaceholder'))
const ph2 = computed(() => t('setting.pwdNewPlaceholder'))
const ph3 = computed(() => t('setting.pwdConfirmPlaceholder'))

// function updateUserInfo(options: Partial<UserInfo>) {
//   userStore.updateUserInfo(options)
//   ms.success(t('common.success'))
// }

const loading = ref(false)
async function updateUserInfo(options: Partial<UserInfo>) {
  ms.loading(t('common.editing'))
  loading.value = true
  try {
    const { success, message } = await updateMe(options.name)
    if (success) {
      ms.success(t('common.editSuccess'))
      // userInfo.value.usage = '90/100'
      userInfo.value.name = options.name
      setDefaultState(userInfo.value)
    }
    else {
      ms.error(t('common.editFailed'))
    }
  }
  catch (error) {
    ms.error(t('common.editFailed'))
  }
  finally {
    loading.value = false
  }
}

async function updateUserPwd() {
  // ms.loading(t('common.editing'))
  loading.value = true
  try {
    if (prePassword.value.length < 6) {
      ms.error(t('message.wrongPwd'))
      return
    }
    else if (newPassword.value != confirmPassword.value) {
      ms.error(t('message.inconstantPwd'))
      return
    }
    else if (newPassword.value.length < 6) {
      ms.error(t('message.minSizePwd'))
      return
    }
    else if (newPassword.value == '123456') {
      ms.error(t('message.updatePwd'))
      return
    } else if (newPassword.value == prePassword.value) {
      ms.error(t('message.updatePwd'))
      return
    }

    const params: FormState = {
      username: username.value,
      password: newPassword.value,
    }

    const { status, message } = await updatePwd(params)
    if (status == 'success') {
      ms.success(t('common.editSuccess'))
    }
    else if (status == 'failed') {
      if (message == 'pwdWrong') {
        ms.error(t('message.wrongPwd'))
      } else {
        ms.error(t('common.editFailed'))
      }
    }
    else
      ms.error(t('common.editFailed'))
  }
  catch (error) {
    ms.error(t('common.editFailed'))
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-4 space-y-5 min-h-[200px]">
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.account') }}</span>
        <div class="w-[200px]">
          <NInput v-model:value="username" placeholder="" :disabled="usernameDisabled" />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.name') }}</span>
        <div class="w-[200px]">
          <NInput v-model:value="name" placeholder="" />
        </div>
        <NButton size="tiny" text type="primary" :loading="loading" :disabled="loading"
                 @click="updateUserInfo({ name })" >
          {{ $t('common.save') }}
        </NButton>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.pwdPre') }}</span>
        <div class="w-[200px]">
          <NInput v-model:value="prePassword" type="password" :placeholder="ph1" />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.pwdNew') }}</span>
        <div class="w-[200px]">
          <NInput v-model:value="newPassword" type="password" :placeholder="ph2" />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.pwdConfirm') }}</span>
        <div class="w-[200px]">
          <NInput v-model:value="confirmPassword" type="password" :placeholder="ph3" />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]"></span>
        <div class="w-[200px]">
        </div>
        <NButton size="tiny" text type="primary" :loading="loading" :disabled="loading"
                 @click="updateUserPwd()" >
          {{ $t('common.save') }}
        </NButton>
      </div>
    </div>
  </div>
</template>

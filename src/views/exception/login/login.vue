<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LockClosedOutline, PersonOutline } from '@vicons/ionicons5'
// eslint-disable-next-line import/no-duplicates
import { NButton, NForm, NFormItem, NIcon, NInput } from 'naive-ui'
// eslint-disable-next-line import/no-duplicates
import { useMessage } from 'naive-ui'
// import { useUserStore } from '@/store/modules/user'
// import { ResultEnum } from '@/enums/httpEnum'
import storage from 'store'
import { PageEnum } from '@/enums/pageEnum'
import { websiteConfig } from '@/config/website.config'
import { signin } from '@/api'
import { useAuthStore } from '@/store'
import { ACCESS_TOKEN, ACCESS_TOKEN_USER } from '@/router/permission'
import { t } from '@/locales'

interface FormState {
  username: string
  password: string
}
interface LoginResponse {
  tokenType: string
  accessToken: string
  status: string
  message: string
}

const formRef = ref()
const message = useMessage()
const loading = ref(false)
const LOGIN_NAME = PageEnum.BASE_LOGIN_NAME
const formInline = reactive({
  username: '',
  password: '',
  isCaptcha: false,
})
const rules = {
  username: { required: true, message: t('login.placeholderUser'), trigger: 'blur' },
  password: { required: true, message: t('login.placeholderPwd'), trigger: 'blur' },
}
const router = useRouter()
const route = useRoute()
const handleSubmit = (e: { preventDefault: () => void }) => {
  e.preventDefault()
  formRef.value.validate(async (errors: any) => {
    if (!errors) {
      const { username, password } = formInline
      message.loading(t('login.logining'))
      loading.value = true
      const params: FormState = {
        username,
        password,
      }
      try {
        const resp: LoginResponse = await signin(params)
        if (resp.status == 'failed') {
          if (resp.message == 'moss_expired')
            message.error('Moss账号已停用')
          else
            message.error(t('login.failed'))
          return
        }
        storage.set(ACCESS_TOKEN, `${resp.tokenType} ${resp.accessToken}`, new Date().getTime() + 24 * 60 * 60 * 1000)
        storage.set(ACCESS_TOKEN_USER, username)
        const authStore = useAuthStore()
        authStore.setToken(resp.accessToken)
        message.destroyAll()
        const toPath = decodeURIComponent((route.query?.redirect || '/') as string)
        message.success(t('login.success'))
        if (route.name === LOGIN_NAME)
          router.replace('/')
        else router.replace(toPath)
        // if (code == ResultEnum.SUCCESS) {
        //   const toPath = decodeURIComponent((route.query?.redirect || '/') as string)
        //   message.success('登录成功，即将进入系统')
        //   if (route.name === LOGIN_NAME) {
        //     router.replace('/')
        //   } else router.replace(toPath)
        // } else {
        //   message.info(msg || '登录失败')
        // }
      }
      catch (error) {
        if (error.response.status === 401)
          message.error(t('login.wrong'))
        else
          message.error(t('login.failed'))
      }
      finally {
        loading.value = false
      }
    }
    else {
      message.error(t('login.missing'))
    }
  })
}
</script>

<template>
  <div class="view-account">
    <!-- <div class="view-account-header"></div> -->
    <div class="view-account-container">
      <div class="view-account-top">
        <img :src="websiteConfig.loginImage" class="logo" alt="">
        <div class="view-account-top-logo">
          <div class="title">
            {{ websiteConfig.title }}
          </div>
        </div>
        <div class="view-account-top-desc">
          {{ websiteConfig.loginDesc }}
        </div>
      </div>
      <div class="view-account-form">
        <n-form
          ref="formRef"
          label-placement="left"
          size="large"
          :model="formInline"
          :rules="rules"
        >
          <n-form-item path="username">
            <n-input v-model:value="formInline.username" :placeholder="t('login.placeholderUser')">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <PersonOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="password">
            <n-input
              v-model:value="formInline.password"
              type="password"
              showPasswordOn="click"
              :placeholder="t('login.placeholderPwd')"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <!-- <n-form-item class="default-color">
            <div class="flex justify-between">
              <div class="flex-initial">
                <n-checkbox v-model:checked="autoLogin">自动登录</n-checkbox>
              </div>
              <div class="flex-initial order-last">
                <a href="javascript:">忘记密码</a>
              </div>
            </div>
          </n-form-item> -->
          <n-form-item>
            <n-button type="primary" @click="handleSubmit" size="large"
              :disabled="loading" :loading="loading" block>
              {{ $t('login.loginBtn') }}
            </n-button>
          </n-form-item>
          <!-- <n-form-item class="default-color">
            <div class="flex view-account-other">
              <div class="flex-initial">
                <span>其它登录方式</span>
              </div>
              <div class="flex-initial" style="margin-left: auto">
                <a href="javascript:">注册账号</a>
              </div>
            </div>
          </n-form-item> -->
        </n-form>
        <div style="display: flex; color: red;">
          <div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="copyright">
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .view-account {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: auto;
    &-container {
      flex: 1;
      padding: 32px 12px;
      max-width: 384px;
      min-width: 320px;
      margin: 0 auto;
    }
    &-top {
      padding: 32px 0;
      text-align: center;
      &-desc {
        font-size: 14px;
        color: #808695;
      }
      &-logo {
        text-align: center;
      }
    }
    &-other {
      width: 100%;
    }
    .default-color {
      color: #515a6e;
      .ant-checkbox-wrapper {
        color: #515a6e;
      }
    }
  }
  @media (min-width: 768px) {
    .view-account {
      background-image: url('@/assets/images/login.svg');
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: 100%;
    }
    .page-account-container {
      padding: 32px 0 24px 0;
    }
  }
  .logo {
    height: 60px;
    position: relative;
    border-style: none;
    text-align: center;
    margin:0 auto;
  }
  .title {
    font-size: 28px;
    color: rgba(0, 0, 0, .85);
    font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
    font-weight: 600;
    position: relative;
    top: 2px;
  }
  .user-layout-content {
      padding: 32px 0 24px;
  }

  .footer {
    width: 100%;
    bottom: 0;
    padding: 0 16px;
    margin: 48px 0 24px;
    text-align: center;
  }

  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
</style>

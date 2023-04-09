<script lang="ts" setup>
import { ref } from 'vue'
import { NButton, NInput, useMessage, NSwitch } from 'naive-ui'
import { useSettingStore } from '@/store'
import type { SettingsState } from '@/store/modules/settings/helper'
import { t } from '@/locales'
import { Context } from 'html2canvas/dist/types/core/context'
import { useUsingContext } from '@/views/chat/hooks/useUsingContext'

const { usingContext, toggleUsingContext } = useUsingContext()
const settingStore = useSettingStore()
const ms = useMessage()

const systemMessage = ref(settingStore.systemMessage ?? '')
const enableContext = ref(usingContext.value ?? false)
const completeContext = ref(settingStore.complete ?? false)
const enableStream = ref(settingStore.stream ?? false)

function updateSettings() {
  const newSetting = {
    systemMessage: systemMessage.value,
    complete: completeContext.value,
    stream: enableStream.value,
  }
  settingStore.updateSetting(newSetting)
  ms.success(t('common.success'))
}

function handleReset() {
  settingStore.resetSetting()
  ms.success(t('common.success'))
  // window.location.reload()
}
</script>

<template>
  <div class="p-4 space-y-5 min-h-[200px]">
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.role') }}</span>
        <div class="flex-1">
          <NInput v-model:value="systemMessage" type="textarea" :autosize="{ minRows: 1, maxRows: 4 }" />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('config.enableContext') }}</span>
        <div class="w-[200px]">
          <NSwitch v-model:value="enableContext" :round="false" @click="toggleUsingContext" />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('config.completeContext') }}</span>
        <div class="w-[200px]">
          <NSwitch v-model:value="completeContext" :round="false" />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('config.enableStream') }}</span>
        <div class="w-[200px]">
          <NSwitch v-model:value="enableStream" :round="false" />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">&nbsp;</span>
        <NButton size="small" @click="handleReset">
          {{ $t('common.reset') }}
        </NButton>

        <NButton size="small" @click="updateSettings()">
          {{ $t('common.save') }}
        </NButton>
      </div>
    </div>
  </div>
</template>

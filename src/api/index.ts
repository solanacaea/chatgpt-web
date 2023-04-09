import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { get, post } from '@/utils/request'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options: Chat.ConversationRequest
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  return post<T>({
    url: '/ask',
    data: {
      question: params.prompt,
      conversationId: params.options.conversationId,
      msgId: params.options.msgId,
      stream: params.options.stream,
      context: params.options.context,
      questionType: params.options.questionType,
    },
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  return post<T>({
    url: '/session',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}

export function signin<T>(params: any) {
  return post<T>({
    url: '/auth/signin',
    data: params,
  })
}

export function meInfo<T>() {
  return get<T>({
    url: '/user/me',
  })
}

export function updateMe<T>(name: string) {
  return post<T>({
    url: '/user/update/name',
    data: { name },
  })
}

export function updatePwd<T>(params: any) {
  return post<T>({
    url: '/auth/change',
    data: params,
  })
}

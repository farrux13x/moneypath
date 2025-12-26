<template>
  <div class="chat-page">
    <div class="chat-shell">
      <header class="chat-header">
        <div class="chat-header-text">
          <h1 class="chat-title">{{ t('chat.title') }}</h1>
          <p class="chat-subtitle">{{ t('chat.subtitle') }}</p>
        </div>
      </header>

      <div ref="threadRef" class="chat-thread">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message', `message--${message.role}`]"
        >
          <div class="message-content">
            {{ message.content }}
          </div>
          <div v-if="message.role === 'assistant'" class="message-actions">
            <button
              type="button"
              class="message-action"
              :aria-label="copiedMessageId === message.id ? t('chat.copied') : t('chat.copy')"
              :title="copiedMessageId === message.id ? t('chat.copied') : t('chat.copy')"
              @click="copyMessage(message)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H10V7h9v14z"
                />
              </svg>
            </button>
            <span v-if="copiedMessageId === message.id" class="message-copied">
              {{ t('chat.copied') }}
            </span>
          </div>
        </div>
      </div>

      <form class="chat-input-bar" @submit.prevent="handleSend">
        <button type="button" class="chat-action" :aria-label="t('chat.attach')">
          +
        </button>
        <input
          v-model="draft"
          type="text"
          class="chat-input"
          :placeholder="t('chat.placeholder')"
          @keydown.enter.exact.prevent="handleSend"
        />
        <button type="submit" class="chat-send" :disabled="isSending || !draft.trim()">
          {{ isSending ? t('chat.sending') : t('chat.send') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { GoogleGenAI } from '@google/genai'
import { useI18n } from '@/shared/i18n'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const STORAGE_KEY = 'chatMessages'

const messages = ref<Message[]>([])
const draft = ref('')
const threadRef = ref<HTMLElement | null>(null)
const isSending = ref(false)
const copiedMessageId = ref<string | null>(null)
const { t } = useI18n()
let copiedTimeout: number | undefined

const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null

const getDefaultMessages = (): Message[] => [
  {
    id: 'welcome',
    role: 'assistant',
    content: t('chat.welcome'),
  },
]

const persistMessages = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
}

const scrollToBottom = async () => {
  await nextTick()
  if (threadRef.value) {
    threadRef.value.scrollTop = threadRef.value.scrollHeight
  }
}

const loadMessages = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Message[]
      messages.value = parsed.length ? parsed : getDefaultMessages()
      return
    } catch {
      messages.value = getDefaultMessages()
      return
    }
  }
  messages.value = getDefaultMessages()
}

const copyMessage = async (message: Message) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(message.content)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = message.content
      textarea.setAttribute('readonly', 'true')
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    copiedMessageId.value = message.id
    if (copiedTimeout) window.clearTimeout(copiedTimeout)
    copiedTimeout = window.setTimeout(() => {
      if (copiedMessageId.value === message.id) {
        copiedMessageId.value = null
      }
    }, 2000)
  } catch (error) {
    console.error('Failed to copy message', error)
  }
}

const handleSend = async () => {
  const content = draft.value.trim()
  if (!content || isSending.value) return

  messages.value.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role: 'user',
    content,
  })

  const assistantId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  messages.value.push({
    id: assistantId,
    role: 'assistant',
    content: '...',
  })

  draft.value = ''
  isSending.value = true
  persistMessages()
  scrollToBottom()

  if (!ai) {
    const fallback = messages.value.find((message) => message.id === assistantId)
    if (fallback) {
      fallback.content = t('chat.missingApiKey')
    }
    isSending.value = false
    persistMessages()
    return
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: content,
    })
    const reply = response.text || t('chat.noResponse')
    const assistant = messages.value.find((message) => message.id === assistantId)
    if (assistant) {
      assistant.content = reply
    }
  } catch (error) {
    const assistant = messages.value.find((message) => message.id === assistantId)
    if (assistant) {
      assistant.content = t('chat.failedResponse')
    }
    console.error('Gemini request failed', error)
  } finally {
    isSending.value = false
    persistMessages()
    scrollToBottom()
  }
}

onMounted(() => {
  loadMessages()
  scrollToBottom()
})

watch(messages, () => {
  persistMessages()
})

</script>

<style scoped src="./ChatPage.css"></style>

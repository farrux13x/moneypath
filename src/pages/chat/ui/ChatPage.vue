<template>
  <div :class="$style['chat-page']">
    <div :class="$style['chat-shell']">
      <header :class="$style['chat-header']">
        <h1 :class="$style['chat-title']">Chat</h1>
        <p :class="$style['chat-subtitle']">Start a conversation</p>
      </header>

      <div ref="threadRef" :class="$style['chat-thread']">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="[$style.message, $style[`message--${message.role}`]]"
        >
          <div :class="$style['message-content']">
            {{ message.content }}
          </div>
        </div>
      </div>

      <form :class="$style['chat-input-bar']" @submit.prevent="handleSend">
        <button type="button" :class="$style['chat-action']" aria-label="Attach">
          +
        </button>
        <input
          v-model="draft"
          type="text"
          :class="$style['chat-input']"
          placeholder="Type a message..."
          @keydown.enter.exact.prevent="handleSend"
        />
        <button type="submit" :class="$style['chat-send']" :disabled="isSending || !draft.trim()">
          {{ isSending ? 'Sending...' : 'Send' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { GoogleGenAI } from '@google/genai'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const STORAGE_KEY = 'chatMessages'

const defaultMessages: Message[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content:
      'Ask one question at a time and I will answer step by step. Focus on the topics you want to practice.',
  },
]

const messages = ref<Message[]>([])
const draft = ref('')
const threadRef = ref<HTMLElement | null>(null)
const isSending = ref(false)

const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null

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
      messages.value = parsed.length ? parsed : defaultMessages
      return
    } catch {
      messages.value = defaultMessages
      return
    }
  }
  messages.value = defaultMessages
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
      fallback.content = 'Missing API key in .env. Add apiKey or GOOGLE_GENAI_API_KEY and reload.'
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
    const reply = response.text || 'No response.'
    const assistant = messages.value.find((message) => message.id === assistantId)
    if (assistant) {
      assistant.content = reply
    }
  } catch (error) {
    const assistant = messages.value.find((message) => message.id === assistantId)
    if (assistant) {
      assistant.content = 'Failed to get response. Try again.'
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

<style module src="./ChatPage.module.css"></style>

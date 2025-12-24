<template>
  <div class="chat-page">
    <div class="chat-shell">
      <header class="chat-header">
        <h1 class="chat-title">Chat</h1>
        <p class="chat-subtitle">Start a conversation</p>
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
        </div>
      </div>

      <form class="chat-input-bar" @submit.prevent="handleSend">
        <button type="button" class="chat-action" aria-label="Attach">
          +
        </button>
        <input
          v-model="draft"
          type="text"
          class="chat-input"
          placeholder="Type a message..."
          @keydown.enter.exact.prevent="handleSend"
        />
        <button type="submit" class="chat-send" :disabled="isSending || !draft.trim()">
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

<style scoped>
.chat-page {
  width: 100%;
  min-height: calc(100vh - 120px);
  display: flex;
  justify-content: center;
  padding: 1.5rem 1rem 2.5rem;
}

.chat-shell {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.chat-header {
  text-align: left;
  color: white;
}

.chat-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.chat-subtitle {
  font-size: 1rem;
  opacity: 0.8;
}

.chat-thread {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 1.5rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 320px;
  max-height: 60vh;
  overflow-y: auto;
}

.message {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: white;
  font-size: 1rem;
  line-height: 1.6;
}

.message--assistant .message-content {
  max-width: 70%;
}

.message--user {
  align-items: flex-end;
}

.message--user .message-content {
  max-width: 70%;
  background: linear-gradient(135deg, #0b5fff, #0a4cc3);
  padding: 1rem 1.25rem;
  border-radius: 1.25rem;
  border-top-right-radius: 0.5rem;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.35);
}

.chat-input-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 2rem;
  padding: 0.5rem 0.75rem;
}

.chat-action {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(148, 163, 184, 0.2);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.chat-input {
  flex: 1;
  border: none;
  background: transparent;
  color: white;
  font-size: 1rem;
  outline: none;
}

.chat-input::placeholder {
  color: rgba(226, 232, 240, 0.6);
}

.chat-send {
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  color: white;
  border: none;
  border-radius: 1.5rem;
  padding: 0.5rem 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chat-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .chat-page {
    padding: 1rem 1rem 6rem;
  }

  .chat-thread {
    padding: 1.25rem;
    max-height: 55vh;
  }

  .message--assistant .message-content,
  .message--user .message-content {
    max-width: 100%;
  }
}
</style>

import { ref, onMounted, nextTick, watch } from 'vue'
import { GoogleGenAI } from '@google/genai'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { useI18n } from '@/shared/i18n'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type ModelId = 'gemini' | 'openai' | 'deepseek' | 'anthropic'

const STORAGE_KEY = 'chatMessages'

export function useChatPage() {
  const messages = ref<Message[]>([])
  const draft = ref('')
  const threadRef = ref<HTMLElement | null>(null)
  const isSending = ref(false)
  const copiedMessageId = ref<string | null>(null)
  const selectedModel = ref<ModelId>('deepseek')
  const { t } = useI18n()
  let copiedTimeout: number | undefined

  const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null
  const openAiApiKey = import.meta.env.VITE_OPENAI_API_KEY
  const openAiClient = openAiApiKey
    ? new OpenAI({ apiKey: openAiApiKey, dangerouslyAllowBrowser: true, baseURL: 'https://api.deepseek.com' })
    : null
  
  const anthropicApiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  const anthropicClient = anthropicApiKey
    ? new Anthropic({ apiKey: anthropicApiKey, dangerouslyAllowBrowser: true })
    : null

  const modelOptions: Array<{ id: ModelId }> = [
    { id: 'deepseek' },
    { id: 'gemini' },
    { id: 'openai' },
    { id: 'anthropic' },
  ]

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

    const missingKeyMessage = (() => {
      if (selectedModel.value === 'gemini' && !ai) {
        return t('chat.missingGeminiKey')
      }
      if (
        (selectedModel.value === 'openai' || selectedModel.value === 'deepseek') &&
        !openAiClient
      ) {
        return t('chat.missingOpenAiKey')
      }
      if (selectedModel.value === 'anthropic' && !anthropicClient) {
        return t('chat.missingAnthropicKey')
      }
      return null
    })()

    if (missingKeyMessage) {
      const fallback = messages.value.find((message) => message.id === assistantId)
      if (fallback) {
        fallback.content = missingKeyMessage
      }
      isSending.value = false
      persistMessages()
      return
    }

    switch (selectedModel.value) {
      case 'gemini':
        await sendMessageToAssistantGemini(content, assistantId)
        break
      case 'openai':
        await sendMessageToAssistantOpenAI(content, assistantId)
        break
      case 'anthropic':
        await sendMessageToAssistantAnthropic(content, assistantId)
        break
      case 'deepseek':
      default:
        await sendMessageToAssistantDeepSeek(content, assistantId)
        break
    }
  }

  const sendMessageToAssistantGemini = async (content: string, assistantId: string) => {
    try {
      if (!ai) {
        throw new Error('AI instance is not initialized')
      }
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

  const sendMessageToAssistantOpenAI = async (content: string, assistantId: string) => {
    try {
      if (!openAiClient) {
        throw new Error('OpenAI client is not initialized')
      }
      const response = await openAiClient.responses.create({
        model: 'o3-mini',
        input: content,
      })
      const reply = response.output_text || t('chat.noResponse')
      const assistant = messages.value.find((message) => message.id === assistantId)
      if (assistant) {
        assistant.content = reply
      }
    } catch (error) {
      const assistant = messages.value.find((message) => message.id === assistantId)
      if (assistant) {
        assistant.content = t('chat.failedResponse')
      }
      console.error('OpenAI request failed', error)
    } finally {
      isSending.value = false
      persistMessages()
      scrollToBottom()
    }
  }

  const sendMessageToAssistantDeepSeek = async (content: string, assistantId: string) => {
    try {
      if (!openAiClient) {
        throw new Error('OpenAI client is not initialized')
      }
      const response = await openAiClient.chat.completions.create({
        model: 'deepseek-chat',
        messages: [{ role: "system", content: content }],
      })
      const reply = response.choices[0].message.content || t('chat.noResponse')
      const assistant = messages.value.find((message) => message.id === assistantId)
      if (assistant) {
        assistant.content = reply
      }
    } catch (error) {
      const assistant = messages.value.find((message) => message.id === assistantId)
      if (assistant) {
        assistant.content = t('chat.failedResponse')
      }
      console.error('OpenAI request failed', error)
    } finally {
      isSending.value = false
      persistMessages()
      scrollToBottom()
    }
  }

  const sendMessageToAssistantAnthropic = async (content: string, assistantId: string) => {
    try {
      if (!anthropicClient) {
        throw new Error('Anthropic client is not initialized')
      }
      const response = await anthropicClient.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content,
          },
        ],
      })
      const reply =
        response.content
          .filter((block) => block.type === 'text')
          .map((block) => block.text)
          .join('\n') || t('chat.noResponse')
      const assistant = messages.value.find((message) => message.id === assistantId)
      if (assistant) {
        assistant.content = reply
      }
    } catch (error) {
      const assistant = messages.value.find((message) => message.id === assistantId)
      if (assistant) {
        assistant.content = t('chat.failedResponse')
      }
      console.error('Anthropic request failed', error)
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

  return {
    t,
    messages,
    draft,
    threadRef,
    isSending,
    copiedMessageId,
    selectedModel,
    modelOptions,
    copyMessage,
    handleSend,
  }
}

<template>
  <div class="chat-page">
    <div class="chat-shell">
      <HomeMobileHeader
        :title="t('chat.title')"
      />

      <div class="page-container">
        <header class="chat-header desktop-only">
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

        <div class="chat-input-area">
          <div v-if="showActions" class="chat-actions">
            <button
              type="button"
              class="chat-action-button"
              :aria-expanded="showModelMenu"
              @click="toggleModelMenu"
            >
              {{ t('chat.modelLabel') }}
            </button>
            <button type="button" class="chat-action-button" disabled>
              {{ t('chat.importImage') }}
            </button>
          </div>
          <div v-if="showModelMenu" class="model-menu">
            <button
              v-for="model in modelOptions"
              :key="model.id"
              type="button"
              :class="[
                'model-option',
                { 'model-option--active': selectedModel === model.id },
              ]"
              :aria-pressed="selectedModel === model.id"
              :disabled="!model.enabled"
              @click="selectModel(model)"
            >
              {{ t(`chat.models.${model.id}`) }}
            </button>
          </div>
          <form class="chat-input-bar" @submit.prevent="handleSend">
            <button
              type="button"
              class="chat-action"
              :aria-label="t('chat.attach')"
              :aria-expanded="showActions"
              @click="toggleActions"
            >
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HomeMobileHeader } from '@/features/home-header/ui'
import { useChatPage } from '../model/useChatPage'

const {
  t,
  messages,
  draft,
  isSending,
  copiedMessageId,
  selectedModel,
  modelOptions,
  copyMessage,
  handleSend,
} = useChatPage()

const showActions = ref(false)
const showModelMenu = ref(false)

const toggleActions = () => {
  showActions.value = !showActions.value
  if (!showActions.value) {
    showModelMenu.value = false
  }
}

const toggleModelMenu = () => {
  showModelMenu.value = !showModelMenu.value
  if (!showActions.value) {
    showActions.value = true
  }
}

const selectModel = (model: (typeof modelOptions)[number]) => {
  if (!model.enabled) return
  selectedModel.value = model.id
  showModelMenu.value = false
  showActions.value = false
}
</script>

<style scoped src="./ChatPage.css"></style>

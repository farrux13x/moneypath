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
import { useChatPage } from './useChatPage'

const {
  t,
  messages,
  draft,
  threadRef,
  isSending,
  copiedMessageId,
  copyMessage,
  handleSend,
} = useChatPage()
</script>

<style scoped src="./ChatPage.css"></style>

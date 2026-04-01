<template>
  <view class="wrap">
    <!-- 背景渐变 -->
    <view class="bg-gradient" />

    <scroll-view scroll-y class="scroll-wrap">
      <view class="content-layer">

        <!-- Header -->
        <view class="header">
          <view class="header-top">
            <text class="logo">✦ Luna</text>
            <view class="badge" :class="{ premium: isPremium }">
              {{ isPremium ? '✦ Premium' : 'Free' }}
            </view>
          </view>
          <text class="sub">{{ greeting }}</text>
        </view>

        <!-- 牌阵切换 -->
        <view class="spread-tabs">
          <view
            class="spread-tab"
            :class="{ active: spreadMode === 'single' }"
            @tap="switchSpread('single')"
          >Single Card</view>
          <view
            class="spread-tab"
            :class="{ active: spreadMode === 'three' }"
            @tap="switchSpread('three')"
          >Three Card</view>
        </view>

        <!-- 单牌模式 -->
        <view v-if="spreadMode === 'single'" class="single-section">
          <!-- 问题输入 -->
          <view class="question-box">
            <text class="question-label">What's on your mind?</text>
            <textarea
              v-model="question"
              class="question-input"
              placeholder="Ask your question or leave blank for a general reading..."
              placeholderClass="q-placeholder"
              :maxlength="300"
              auto-height
            />
          </view>

          <!-- 牌区 -->
          <view class="card-area">
            <view v-if="!cardFlipped" class="card-back" @tap="handleCardTap">
              <view class="card-back-inner" :class="{ shuffling: isShuffling }">
                <text class="card-back-symbol">🌙</text>
                <text class="card-back-text">{{ isShuffling ? 'Shuffling...' : 'Tap to Draw' }}</text>
              </view>
            </view>

            <view v-if="cardFlipped && currentCard" class="card-front">
              <image :src="currentCard.img" class="card-img" mode="aspectFit" />
              <view class="card-info">
                <text class="card-name">{{ currentCard.name }}</text>
                <text class="card-tag">{{ currentCard.tag }}</text>
              </view>
            </view>
          </view>

          <!-- AI解读 -->
          <view v-if="aiReading" class="ai-section">
            <text class="ai-label">✦ Luna's Reading</text>
            <view class="convo-wrap">
              <view
                v-for="(msg, i) in conversation"
                :key="i"
                class="bubble"
                :class="msg.type"
              >
                <text class="bubble-text">{{ msg.text }}</text>
              </view>
              <view v-if="isLoading" class="bubble luna loading-bubble">
                <text class="bubble-text">Luna is reading the cards...</text>
              </view>
            </view>

            <!-- 追问 -->
            <view class="followup-wrap">
              <input
                v-model="followupText"
                class="followup-input"
                placeholder="Ask Luna a follow-up..."
                placeholderClass="q-placeholder"
                :disabled="isLoading"
                @confirm="sendFollowUp"
              />
              <view class="followup-btn" @tap="sendFollowUp">
                <text class="followup-btn-text">→</text>
              </view>
            </view>
          </view>

          <!-- Reset -->
          <view v-if="cardFlipped" class="reset-btn" @tap="resetReading">
            <text class="reset-text">✦ Draw Another Card</text>
          </view>
        </view>

        <!-- 三牌阵模式 -->
        <view v-if="spreadMode === 'three'" class="three-section">
          <view class="question-box">
            <text class="question-label">What's on your mind?</text>
            <textarea
              v-model="questionThree"
              class="question-input"
              placeholder="Ask your question..."
              placeholderClass="q-placeholder"
              :maxlength="300"
              auto-height
            />
          </view>

          <view class="three-cards-row">
            <view
              v-for="(card, i) in threeCards"
              :key="i"
              class="three-card-slot"
              @tap="handleThreeCardTap(i)"
            >
              <view v-if="!card.flipped" class="three-card-back">
                <text class="three-card-label">{{ ['Past', 'Present', 'Future'][i] }}</text>
                <text class="three-card-moon">🌙</text>
              </view>
              <view v-else class="three-card-front">
                <image :src="card.img" class="three-card-img" mode="aspectFit" />
                <text class="three-card-pos">{{ ['Past', 'Present', 'Future'][i] }}</text>
                <text class="three-card-name">{{ card.name }}</text>
              </view>
            </view>
          </view>

          <!-- 三牌AI解读 -->
          <view v-if="threeAiReading" class="ai-section">
            <text class="ai-label">✦ Luna's Reading</text>
            <view class="convo-wrap">
              <view
                v-for="(msg, i) in conversationThree"
                :key="i"
                class="bubble"
                :class="msg.type"
              >
                <text class="bubble-text">{{ msg.text }}</text>
              </view>
              <view v-if="isLoadingThree" class="bubble luna loading-bubble">
                <text class="bubble-text">Luna is reading the spread...</text>
              </view>
            </view>

            <view class="followup-wrap">
              <input
                v-model="followupTextThree"
                class="followup-input"
                placeholder="Ask Luna a follow-up..."
                placeholderClass="q-placeholder"
                :disabled="isLoadingThree"
                @confirm="sendThreeFollowUp"
              />
              <view class="followup-btn" @tap="sendThreeFollowUp">
                <text class="followup-btn-text">→</text>
              </view>
            </view>
          </view>

          <view v-if="threeAllFlipped" class="reset-btn" @tap="resetThree">
            <text class="reset-text">✦ New Spread</text>
          </view>
        </view>

      </view>
    </scroll-view>

    <!-- Paywall Modal -->
    <view v-if="showPaywall" class="paywall-overlay" @tap.self="closePaywall">
      <view class="paywall-sheet" :class="{ visible: paywallVisible }">
        <view class="pw-handle" />
        <text class="pw-title">Unlock Luna Premium</text>
        <text class="pw-sub">Unlimited follow-up questions & deeper readings</text>

        <view class="pw-plans">
          <view
            v-for="plan in plans"
            :key="plan.id"
            class="pw-plan"
            :class="{ selected: selectedPlan === plan.id }"
            @tap="selectedPlan = plan.id"
          >
            <view class="pw-plan-top">
              <text class="pw-plan-name">{{ plan.name }}</text>
              <view v-if="plan.best" class="pw-best">BEST VALUE</view>
            </view>
            <text class="pw-plan-price">{{ plan.price }}</text>
            <text class="pw-plan-sub">{{ plan.sub }}</text>
          </view>
        </view>

        <button class="btn-gold pw-btn" @tap="handleSubscribe">Start Free Trial</button>
        <text class="pw-restore" @tap="restorePurchase">Restore Purchase</text>
        <text class="pw-legal">3-day free trial, then auto-renews. Cancel anytime.</text>
        <view class="pw-links">
          <text class="pw-link" @tap="openPrivacy">Privacy Policy</text>
          <text class="pw-link-sep"> · </text>
          <text class="pw-link" @tap="openTerms">Terms of Use</text>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import { deck, pickOne, pickUnique, getTarotReading, getFollowUp, storage, history } from '../../utils/api.js';

export default {
  data() {
    return {
      isPremium: false,
      greeting: 'The cards are ready for you.',
      spreadMode: 'single',

      // 单牌
      question: '',
      isShuffling: false,
      cardFlipped: false,
      currentCard: null,
      conversation: [],
      aiReading: false,
      isLoading: false,
      followupText: '',
      followupMessages: [],

      // 三牌
      questionThree: '',
      threeCards: [
        { flipped: false }, { flipped: false }, { flipped: false }
      ],
      threeAllFlipped: false,
      conversationThree: [],
      threeAiReading: false,
      isLoadingThree: false,
      followupTextThree: '',
      followupMessagesThree: [],

      // Paywall
      showPaywall: false,
      paywallVisible: false,
      selectedPlan: 'annual',
      plans: [
        { id: 'annual', name: 'Annual', price: '$39.99/yr', sub: '$3.33/month · Best value', best: true },
        { id: 'monthly', name: 'Monthly', price: '$9.99/mo', sub: 'Billed monthly', best: false },
        { id: 'weekly', name: 'Weekly', price: '$4.99/wk', sub: 'Billed weekly', best: false }
      ]
    };
  },

  onLoad() {
    this.isPremium = !!storage.get('luna_premium');
    const name = storage.get('luna_name');
    if (name) this.greeting = `Welcome back, ${name}. The cards are ready for you.`;
  },

  methods: {
    switchSpread(mode) {
      this.spreadMode = mode;
    },

    handleCardTap() {
      if (this.isShuffling) return;
      this.startShuffle();
    },

    startShuffle() {
      this.isShuffling = true;
      setTimeout(() => {
        this.isShuffling = false;
        this.flipAndReveal();
      }, 1200);
    },

    flipAndReveal() {
      this.currentCard = pickOne(deck);
      this.cardFlipped = true;
      this.getReading();
    },

    async getReading() {
      this.isLoading = true;
      this.aiReading = true;
      try {
        const data = await getTarotReading(this.question, this.currentCard);
        const reading = data.reading || this.currentCard.meaning;
        this.conversation.push({ type: 'luna', text: reading });
        this.followupMessages = [
          { role: 'user', content: `Question: ${this.question || 'General reading'}. Card: ${this.currentCard.name}` },
          { role: 'assistant', content: reading }
        ];
        history.add(this.currentCard, this.question, reading);
      } catch {
        this.conversation.push({ type: 'luna', text: this.currentCard.meaning });
      }
      this.isLoading = false;
    },

    async sendFollowUp() {
      if (!this.followupText.trim() || this.isLoading) return;
      if (!this.isPremium && this.conversation.length >= 2) {
        this.openPaywall();
        return;
      }
      const text = this.followupText.trim();
      this.followupText = '';
      this.conversation.push({ type: 'user', text });
      this.followupMessages.push({ role: 'user', content: text });
      this.isLoading = true;
      try {
        const data = await getFollowUp(this.followupMessages);
        const reply = data.reply || '';
        this.conversation.push({ type: 'luna', text: reply });
        this.followupMessages.push({ role: 'assistant', content: reply });
      } catch {
        this.conversation.push({ type: 'luna', text: 'Luna is momentarily unavailable. Please try again.' });
      }
      this.isLoading = false;
    },

    resetReading() {
      this.cardFlipped = false;
      this.currentCard = null;
      this.conversation = [];
      this.aiReading = false;
      this.question = '';
      this.followupText = '';
      this.followupMessages = [];
    },

    // 三牌方法
    handleThreeCardTap(index) {
      if (this.threeCards[index].flipped) return;
      const cards = pickUnique(3);
      const card = { ...cards[index], flipped: true };
      this.threeCards.splice(index, 1, card);

      const allFlipped = this.threeCards.every(c => c.flipped);
      if (allFlipped) {
        this.threeAllFlipped = true;
        this.getThreeReading();
      }
    },

    async getThreeReading() {
      this.isLoadingThree = true;
      this.threeAiReading = true;
      try {
        const data = await getTarotReading(
          this.questionThree,
          this.threeCards[1],
          { isThreeCard: true, cards: this.threeCards.map(c => ({ name: c.name, tag: c.tag })) }
        );
        const reading = data.reading || '';
        this.conversationThree.push({ type: 'luna', text: reading });
        this.followupMessagesThree = [
          { role: 'user', content: `Three card spread. Question: ${this.questionThree || 'General'}` },
          { role: 'assistant', content: reading }
        ];
      } catch {
        this.conversationThree.push({ type: 'luna', text: 'The cards have spoken. Reflect on their combined energy.' });
      }
      this.isLoadingThree = false;
    },

    async sendThreeFollowUp() {
      if (!this.followupTextThree.trim() || this.isLoadingThree) return;
      if (!this.isPremium && this.conversationThree.length >= 2) {
        this.openPaywall();
        return;
      }
      const text = this.followupTextThree.trim();
      this.followupTextThree = '';
      this.conversationThree.push({ type: 'user', text });
      this.followupMessagesThree.push({ role: 'user', content: text });
      this.isLoadingThree = true;
      try {
        const data = await getFollowUp(this.followupMessagesThree);
        const reply = data.reply || '';
        this.conversationThree.push({ type: 'luna', text: reply });
        this.followupMessagesThree.push({ role: 'assistant', content: reply });
      } catch {
        this.conversationThree.push({ type: 'luna', text: 'Luna is momentarily unavailable.' });
      }
      this.isLoadingThree = false;
    },

    resetThree() {
      this.threeCards = [{ flipped: false }, { flipped: false }, { flipped: false }];
      this.threeAllFlipped = false;
      this.conversationThree = [];
      this.threeAiReading = false;
      this.questionThree = '';
      this.followupTextThree = '';
      this.followupMessagesThree = [];
    },

    // Paywall
    openPaywall() {
      this.showPaywall = true;
      setTimeout(() => { this.paywallVisible = true; }, 50);
    },

    closePaywall() {
      this.paywallVisible = false;
      setTimeout(() => { this.showPaywall = false; }, 450);
    },

    handleSubscribe() {
      // MVP：模拟订阅，正式接RevenueCat
      this.isPremium = true;
      storage.set('luna_premium', '1');
      this.closePaywall();
    },

    restorePurchase() {
      uni.showToast({ title: 'Restore available after App Store integration', icon: 'none' });
    },

    openPrivacy() {
      uni.navigateTo({ url: '/pages/privacy/privacy' });
    },

    openTerms() {
      uni.navigateTo({ url: '/pages/privacy/privacy?tab=terms' });
    }
  }
};
</script>

<style scoped>
.wrap {
  min-height: 100vh;
  background: #06040f;
  position: relative;
}

.bg-gradient {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background:
    radial-gradient(ellipse 700rpx 500rpx at 15% 0%, rgba(124,92,191,0.35) 0%, transparent 60%),
    radial-gradient(ellipse 600rpx 450rpx at 85% 10%, rgba(74,184,196,0.2) 0%, transparent 55%),
    radial-gradient(ellipse 500rpx 350rpx at 50% 100%, rgba(200,96,122,0.15) 0%, transparent 55%);
  z-index: 0;
  pointer-events: none;
}

.scroll-wrap {
  height: 100vh;
  position: relative;
  z-index: 1;
}

.content-layer {
  padding: 80rpx 32rpx 60rpx;
}

/* Header */
.header { margin-bottom: 48rpx; }

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.logo {
  font-size: 56rpx;
  color: #d4af69;
  letter-spacing: 8rpx;
  text-shadow: 0 0 30rpx rgba(212,175,105,0.4);
}

.badge {
  font-size: 22rpx;
  color: rgba(255,248,235,0.5);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(212,175,105,0.2);
  border-radius: 40rpx;
  padding: 8rpx 20rpx;
  letter-spacing: 1rpx;
}

.badge.premium { color: #f0d090; border-color: rgba(212,175,105,0.5); }

.sub {
  font-size: 26rpx;
  color: rgba(255,248,235,0.55);
  font-style: italic;
}

/* Spread tabs */
.spread-tabs {
  display: flex;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(212,175,105,0.2);
  border-radius: 50rpx;
  padding: 6rpx;
  margin-bottom: 40rpx;
}

.spread-tab {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  border-radius: 44rpx;
  font-size: 26rpx;
  color: rgba(255,248,235,0.5);
  transition: all 0.3s;
}

.spread-tab.active {
  background: rgba(212,175,105,0.15);
  color: #d4af69;
  border: 1px solid rgba(212,175,105,0.3);
}

/* Question */
.question-box {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(212,175,105,0.2);
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 40rpx;
}

.question-label {
  font-size: 24rpx;
  color: rgba(212,175,105,0.7);
  letter-spacing: 2rpx;
  text-transform: uppercase;
  display: block;
  margin-bottom: 16rpx;
}

.question-input {
  width: 100%;
  font-size: 28rpx;
  color: rgba(255,248,235,0.9);
  background: transparent;
  border: none;
  min-height: 80rpx;
  line-height: 1.6;
}

.q-placeholder { color: rgba(255,248,235,0.25); }

/* Card area */
.card-area {
  display: flex;
  justify-content: center;
  margin-bottom: 40rpx;
}

.card-back {
  width: 280rpx;
  height: 460rpx;
  background: linear-gradient(135deg, rgba(124,92,191,0.3), rgba(74,184,196,0.2));
  border: 2px solid rgba(212,175,105,0.3);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-back-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.card-back-inner.shuffling .card-back-symbol {
  animation: spin 0.4s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.card-back-symbol { font-size: 72rpx; }
.card-back-text { font-size: 24rpx; color: rgba(212,175,105,0.7); letter-spacing: 2rpx; }

.card-front {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.card-img {
  width: 280rpx;
  height: 460rpx;
  border-radius: 16rpx;
  border: 1px solid rgba(212,175,105,0.3);
}

.card-info { text-align: center; }
.card-name { display: block; font-size: 32rpx; color: #d4af69; margin-bottom: 8rpx; }
.card-tag { display: block; font-size: 24rpx; color: rgba(255,248,235,0.5); }

/* AI section */
.ai-section {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(212,175,105,0.15);
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
}

.ai-label {
  font-size: 22rpx;
  color: rgba(212,175,105,0.6);
  letter-spacing: 3rpx;
  text-transform: uppercase;
  display: block;
  margin-bottom: 24rpx;
}

.convo-wrap { display: flex; flex-direction: column; gap: 20rpx; margin-bottom: 32rpx; }

.bubble {
  max-width: 85%;
  padding: 24rpx 28rpx;
  border-radius: 20rpx;
  line-height: 1.7;
}

.bubble.luna {
  background: rgba(124,92,191,0.15);
  border: 1px solid rgba(124,92,191,0.25);
  align-self: flex-start;
  border-bottom-left-radius: 4rpx;
}

.bubble.user {
  background: rgba(212,175,105,0.1);
  border: 1px solid rgba(212,175,105,0.2);
  align-self: flex-end;
  border-bottom-right-radius: 4rpx;
}

.bubble-text { font-size: 28rpx; color: rgba(255,248,235,0.9); }

.loading-bubble { opacity: 0.6; }

/* Followup */
.followup-wrap {
  display: flex;
  gap: 16rpx;
  align-items: center;
}

.followup-input {
  flex: 1;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(212,175,105,0.2);
  border-radius: 50rpx;
  padding: 20rpx 28rpx;
  font-size: 26rpx;
  color: rgba(255,248,235,0.9);
}

.followup-btn {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #d4af69, #c8a050);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.followup-btn-text { font-size: 32rpx; color: #06040f; font-weight: bold; }

/* Reset */
.reset-btn {
  text-align: center;
  padding: 32rpx;
  border: 1px solid rgba(212,175,105,0.2);
  border-radius: 50rpx;
  margin-bottom: 32rpx;
}

.reset-text { font-size: 26rpx; color: rgba(212,175,105,0.7); letter-spacing: 2rpx; }

/* Three cards */
.three-cards-row {
  display: flex;
  gap: 16rpx;
  margin-bottom: 40rpx;
}

.three-card-slot { flex: 1; }

.three-card-back {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(212,175,105,0.2);
  border-radius: 12rpx;
  padding: 24rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  min-height: 260rpx;
  justify-content: center;
}

.three-card-label { font-size: 22rpx; color: rgba(212,175,105,0.6); letter-spacing: 1rpx; }
.three-card-moon { font-size: 48rpx; }

.three-card-front {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.three-card-img {
  width: 100%;
  height: 200rpx;
  border-radius: 10rpx;
}

.three-card-pos { font-size: 20rpx; color: rgba(212,175,105,0.6); }
.three-card-name { font-size: 20rpx; color: rgba(255,248,235,0.8); text-align: center; }

/* Paywall */
.paywall-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.paywall-sheet {
  width: 100%;
  background: linear-gradient(180deg, #1a0f3a 0%, #0d0820 100%);
  border-top: 1px solid rgba(212,175,105,0.3);
  border-radius: 32rpx 32rpx 0 0;
  padding: 32rpx 48rpx 80rpx;
  transform: translateY(100%);
  transition: transform 0.45s cubic-bezier(0.32,0.72,0,1);
}

.paywall-sheet.visible { transform: translateY(0); }

.pw-handle {
  width: 80rpx;
  height: 8rpx;
  background: rgba(255,255,255,0.2);
  border-radius: 4rpx;
  margin: 0 auto 40rpx;
}

.pw-title {
  font-size: 44rpx;
  color: #d4af69;
  font-family: Georgia, serif;
  display: block;
  text-align: center;
  margin-bottom: 16rpx;
}

.pw-sub {
  font-size: 26rpx;
  color: rgba(255,248,235,0.6);
  display: block;
  text-align: center;
  margin-bottom: 40rpx;
}

.pw-plans { display: flex; flex-direction: column; gap: 16rpx; margin-bottom: 32rpx; }

.pw-plan {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(212,175,105,0.2);
  border-radius: 16rpx;
  padding: 24rpx 28rpx;
}

.pw-plan.selected {
  border: 2px solid #d4af69;
  background: rgba(212,175,105,0.08);
}

.pw-plan-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8rpx; }
.pw-plan-name { font-size: 28rpx; color: rgba(255,248,235,0.9); }
.pw-best { font-size: 20rpx; color: #06040f; background: #d4af69; padding: 4rpx 12rpx; border-radius: 20rpx; font-weight: bold; }
.pw-plan-price { font-size: 36rpx; color: #d4af69; display: block; margin-bottom: 4rpx; }
.pw-plan-sub { font-size: 22rpx; color: rgba(255,248,235,0.4); display: block; }

.pw-btn { width: 100%; margin-bottom: 24rpx; }

.pw-restore {
  display: block;
  text-align: center;
  font-size: 26rpx;
  color: rgba(255,248,235,0.4);
  text-decoration: underline;
  margin-bottom: 16rpx;
}

.pw-legal {
  display: block;
  text-align: center;
  font-size: 20rpx;
  color: rgba(255,248,235,0.25);
  margin-bottom: 16rpx;
}

.pw-links {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pw-link {
  font-size: 20rpx;
  color: rgba(255,248,235,0.35);
  text-decoration: underline;
}

.pw-link-sep {
  font-size: 20rpx;
  color: rgba(255,248,235,0.2);
}
</style>

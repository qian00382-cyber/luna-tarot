<template>
  <view class="ob-wrap">
    <!-- 背景 -->
    <view class="ob-bg" />

    <!-- 进度点 -->
    <view class="ob-dots">
      <view
        v-for="(_, i) in 4"
        :key="i"
        class="ob-dot"
        :class="{ active: i === step, done: i < step }"
      />
    </view>

    <!-- Step 0: Why are you here? -->
    <view v-if="step === 0" class="ob-step">
      <text class="ob-luna">✦ Luna</text>
      <text class="ob-title">Why are you seeking guidance today?</text>
      <view class="ob-options">
        <view
          v-for="opt in step0Options"
          :key="opt.value"
          class="ob-option"
          :class="{ selected: userData.reason === opt.value }"
          @tap="select('reason', opt.value)"
        >
          <text class="ob-opt-icon">{{ opt.icon }}</text>
          <text class="ob-opt-label">{{ opt.label }}</text>
        </view>
      </view>
      <button class="btn-gold ob-btn" :disabled="!userData.reason" @tap="nextStep">Continue</button>
    </view>

    <!-- Step 1: What to focus on -->
    <view v-if="step === 1" class="ob-step">
      <text class="ob-luna">✦ Luna</text>
      <text class="ob-title">What area of life do you want to explore?</text>
      <view class="ob-options">
        <view
          v-for="opt in step1Options"
          :key="opt.value"
          class="ob-option"
          :class="{ selected: userData.focus === opt.value }"
          @tap="select('focus', opt.value)"
        >
          <text class="ob-opt-icon">{{ opt.icon }}</text>
          <text class="ob-opt-label">{{ opt.label }}</text>
        </view>
      </view>
      <button class="btn-gold ob-btn" :disabled="!userData.focus" @tap="nextStep">Continue</button>
    </view>

    <!-- Step 2: Zodiac -->
    <view v-if="step === 2" class="ob-step">
      <text class="ob-luna">✦ Luna</text>
      <text class="ob-title">What's your zodiac sign?</text>
      <view class="ob-zodiac-grid">
        <view
          v-for="z in zodiacs"
          :key="z.value"
          class="ob-zodiac-btn"
          :class="{ selected: userData.zodiac === z.value }"
          @tap="select('zodiac', z.value)"
        >
          <text class="ob-zodiac-icon">{{ z.icon }}</text>
          <text class="ob-zodiac-name">{{ z.label }}</text>
        </view>
      </view>
      <button class="btn-gold ob-btn" :disabled="!userData.zodiac" @tap="nextStep">Continue</button>
      <text class="ob-skip" @tap="nextStep">Skip for now</text>
    </view>

    <!-- Step 3: Name -->
    <view v-if="step === 3" class="ob-step">
      <text class="ob-luna">✦ Luna</text>
      <text class="ob-title">What shall Luna call you?</text>
      <text class="ob-sub">Optional — leave blank to remain anonymous</text>
      <input
        v-model="userData.name"
        class="ob-input"
        placeholder="Your name..."
        placeholderClass="ob-placeholder"
        maxlength="30"
      />
      <button class="btn-gold ob-btn" @tap="finish">Begin Reading</button>
      <view class="ob-legal">
        <text class="ob-legal-text">By continuing, you agree to our </text>
        <text class="ob-legal-link" @tap="openPrivacy">Privacy Policy</text>
        <text class="ob-legal-text"> and </text>
        <text class="ob-legal-link" @tap="openTerms">Terms of Use</text>
      </view>
    </view>
  </view>
</template>

<script>
import { storage } from '../../utils/api.js';

export default {
  data() {
    return {
      step: 0,
      userData: {
        reason: '',
        focus: '',
        zodiac: '',
        name: ''
      },
      step0Options: [
        { value: 'clarity', icon: '🔮', label: 'Seeking clarity' },
        { value: 'love', icon: '💫', label: 'Love & relationships' },
        { value: 'career', icon: '⚡', label: 'Career & purpose' },
        { value: 'curiosity', icon: '✨', label: 'Pure curiosity' }
      ],
      step1Options: [
        { value: 'love', icon: '❤️', label: 'Love' },
        { value: 'career', icon: '💼', label: 'Career' },
        { value: 'finance', icon: '💰', label: 'Finance' },
        { value: 'spirit', icon: '🌙', label: 'Spirituality' },
        { value: 'health', icon: '🌿', label: 'Health' },
        { value: 'general', icon: '🌟', label: 'General' }
      ],
      zodiacs: [
        { value: 'Aries', icon: '♈', label: 'Aries' },
        { value: 'Taurus', icon: '♉', label: 'Taurus' },
        { value: 'Gemini', icon: '♊', label: 'Gemini' },
        { value: 'Cancer', icon: '♋', label: 'Cancer' },
        { value: 'Leo', icon: '♌', label: 'Leo' },
        { value: 'Virgo', icon: '♍', label: 'Virgo' },
        { value: 'Libra', icon: '♎', label: 'Libra' },
        { value: 'Scorpio', icon: '♏', label: 'Scorpio' },
        { value: 'Sagittarius', icon: '♐', label: 'Sagittarius' },
        { value: 'Capricorn', icon: '♑', label: 'Capricorn' },
        { value: 'Aquarius', icon: '♒', label: 'Aquarius' },
        { value: 'Pisces', icon: '♓', label: 'Pisces' }
      ]
    };
  },
  methods: {
    select(field, value) {
      this.userData[field] = value;
    },
    nextStep() {
      if (this.step < 3) this.step++;
    },
    finish() {
      storage.set('luna_onboarded', '1');
      if (this.userData.zodiac) storage.set('luna_zodiac', this.userData.zodiac);
      if (this.userData.name) storage.set('luna_name', this.userData.name);
      if (this.userData.focus) storage.set('luna_focus', this.userData.focus);
      uni.reLaunch({ url: '/pages/index/index' });
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
.ob-wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 48rpx 60rpx;
  background: #06040f;
  position: relative;
}

.ob-bg {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background:
    radial-gradient(ellipse 600rpx 400rpx at 20% 10%, rgba(124,92,191,0.3) 0%, transparent 60%),
    radial-gradient(ellipse 500rpx 350rpx at 80% 20%, rgba(74,184,196,0.15) 0%, transparent 55%),
    radial-gradient(ellipse 500rpx 300rpx at 50% 90%, rgba(200,96,122,0.12) 0%, transparent 55%);
  z-index: 0;
}

.ob-dots {
  display: flex;
  gap: 16rpx;
  margin-bottom: 80rpx;
  position: relative;
  z-index: 1;
}

.ob-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: rgba(212,175,105,0.2);
  border: 1px solid rgba(212,175,105,0.3);
  transition: all 0.3s;
}

.ob-dot.active {
  background: #d4af69;
  box-shadow: 0 0 16rpx rgba(212,175,105,0.5);
  width: 40rpx;
  border-radius: 8rpx;
}

.ob-dot.done {
  background: rgba(212,175,105,0.5);
}

.ob-step {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.ob-luna {
  font-size: 48rpx;
  color: #d4af69;
  letter-spacing: 8rpx;
  margin-bottom: 32rpx;
  text-shadow: 0 0 30rpx rgba(212,175,105,0.4);
}

.ob-title {
  font-size: 38rpx;
  color: rgba(255,248,235,0.95);
  text-align: center;
  line-height: 1.5;
  margin-bottom: 56rpx;
  font-family: Georgia, serif;
}

.ob-sub {
  font-size: 26rpx;
  color: rgba(255,248,235,0.5);
  text-align: center;
  margin-bottom: 40rpx;
}

.ob-options {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  margin-bottom: 48rpx;
}

.ob-option {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(212,175,105,0.2);
  border-radius: 16rpx;
  padding: 32rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  transition: all 0.2s;
}

.ob-option.selected {
  border: 2px solid #d4af69;
  background: rgba(212,175,105,0.1);
}

.ob-opt-icon { font-size: 48rpx; }
.ob-opt-label {
  font-size: 26rpx;
  color: rgba(255,248,235,0.85);
  text-align: center;
}

.ob-zodiac-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  margin-bottom: 48rpx;
}

.ob-zodiac-btn {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(212,175,105,0.2);
  border-radius: 12rpx;
  padding: 20rpx 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.ob-zodiac-btn.selected {
  border: 2px solid #d4af69;
  background: rgba(212,175,105,0.1);
}

.ob-zodiac-icon { font-size: 36rpx; }
.ob-zodiac-name { font-size: 20rpx; color: rgba(255,248,235,0.7); }

.ob-input {
  width: 100%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(212,175,105,0.3);
  border-radius: 16rpx;
  padding: 32rpx;
  color: rgba(255,248,235,0.95);
  font-size: 30rpx;
  margin-bottom: 48rpx;
}

.ob-placeholder { color: rgba(255,248,235,0.3); }

.ob-btn {
  width: 100%;
  margin-bottom: 24rpx;
}

.ob-btn[disabled] {
  opacity: 0.4;
}

.ob-skip {
  font-size: 26rpx;
  color: rgba(255,248,235,0.4);
  text-decoration: underline;
  margin-top: 8rpx;
}

.ob-legal {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20rpx;
  gap: 0;
}

.ob-legal-text {
  font-size: 20rpx;
  color: rgba(255,248,235,0.3);
}

.ob-legal-link {
  font-size: 20rpx;
  color: rgba(255,248,235,0.45);
  text-decoration: underline;
}
</style>

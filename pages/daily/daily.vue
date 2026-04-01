<template>
  <view class="wrap">
    <view class="bg-gradient" />
    <scroll-view scroll-y class="scroll-wrap">
      <view class="content-layer">

        <view class="header">
          <text class="title">✦ Daily Card</text>
          <text class="date-text">{{ todayStr }}</text>
        </view>

        <!-- 星座选择 -->
        <view class="zodiac-row">
          <picker
            :value="zodiacIndex"
            :range="zodiacLabels"
            @change="onZodiacChange"
          >
            <view class="zodiac-picker">
              <text class="zodiac-icon">{{ currentZodiac.icon }}</text>
              <text class="zodiac-name">{{ currentZodiac.label }}</text>
              <text class="zodiac-arrow">▾</text>
            </view>
          </picker>
        </view>

        <!-- 今日牌 -->
        <view v-if="dailyCard" class="daily-card-box">
          <image :src="dailyCard.img" class="daily-card-img" mode="aspectFit" />
          <view class="daily-card-info">
            <text class="daily-card-name">{{ dailyCard.name }}</text>
            <text class="daily-card-tag">{{ dailyCard.tag }}</text>
          </view>
        </view>

        <!-- AI解读 -->
        <view class="reading-box">
          <text class="reading-label">✦ Today's Message</text>
          <text v-if="isLoading" class="reading-text muted">Luna is reading today's energy...</text>
          <text v-else class="reading-text">{{ dailyReading }}</text>
          <text v-if="zodiacNote" class="zodiac-note">{{ zodiacNote }}</text>
        </view>

      </view>
    </scroll-view>
  </view>
</template>

<script>
import { getDailyCard, getTarotReading, storage } from '../../utils/api.js';

export default {
  data() {
    return {
      todayStr: '',
      dailyCard: null,
      dailyReading: '',
      zodiacNote: '',
      isLoading: false,
      zodiacIndex: 0,
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

  computed: {
    zodiacLabels() {
      return this.zodiacs.map(z => `${z.icon} ${z.label}`);
    },
    currentZodiac() {
      return this.zodiacs[this.zodiacIndex];
    }
  },

  onLoad() {
    const today = new Date();
    this.todayStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    this.dailyCard = getDailyCard();

    const savedZodiac = storage.get('luna_zodiac');
    if (savedZodiac) {
      const idx = this.zodiacs.findIndex(z => z.value === savedZodiac);
      if (idx >= 0) this.zodiacIndex = idx;
    }

    this.loadReading();
  },

  methods: {
    onZodiacChange(e) {
      this.zodiacIndex = e.detail.value;
      storage.set('luna_zodiac', this.currentZodiac.value);
      this.loadReading();
    },

    async loadReading() {
      this.isLoading = true;
      this.zodiacNote = '';
      try {
        const zodiac = this.currentZodiac.value;
        const data = await getTarotReading(
          `Daily horoscope for ${zodiac}`,
          this.dailyCard,
          { isDailyCard: true, zodiac }
        );
        this.dailyReading = data.reading || this.dailyCard.meaning;
        this.zodiacNote = `✦ Personalized for ${zodiac}`;
      } catch {
        this.dailyReading = this.dailyCard.meaning;
      }
      this.isLoading = false;
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
    radial-gradient(ellipse 600rpx 400rpx at 80% 10%, rgba(74,184,196,0.2) 0%, transparent 55%),
    radial-gradient(ellipse 500rpx 350rpx at 20% 80%, rgba(124,92,191,0.25) 0%, transparent 55%);
  z-index: 0;
  pointer-events: none;
}

.scroll-wrap { height: 100vh; position: relative; z-index: 1; }
.content-layer { padding: 80rpx 32rpx 60rpx; }

.header { margin-bottom: 40rpx; }
.title { display: block; font-size: 52rpx; color: #d4af69; letter-spacing: 6rpx; margin-bottom: 8rpx; }
.date-text { font-size: 26rpx; color: rgba(255,248,235,0.45); }

.zodiac-row { margin-bottom: 40rpx; }

.zodiac-picker {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(212,175,105,0.25);
  border-radius: 50rpx;
  padding: 16rpx 28rpx;
}

.zodiac-icon { font-size: 32rpx; }
.zodiac-name { font-size: 28rpx; color: rgba(255,248,235,0.85); }
.zodiac-arrow { font-size: 24rpx; color: rgba(212,175,105,0.6); }

.daily-card-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 40rpx;
}

.daily-card-img {
  width: 240rpx;
  height: 380rpx;
  border-radius: 16rpx;
  border: 1px solid rgba(212,175,105,0.3);
  box-shadow: 0 0 40rpx rgba(212,175,105,0.15);
}

.daily-card-info { text-align: center; }
.daily-card-name { display: block; font-size: 34rpx; color: #d4af69; margin-bottom: 8rpx; }
.daily-card-tag { display: block; font-size: 26rpx; color: rgba(255,248,235,0.5); }

.reading-box {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(212,175,105,0.15);
  border-radius: 16rpx;
  padding: 40rpx;
}

.reading-label {
  display: block;
  font-size: 22rpx;
  color: rgba(212,175,105,0.6);
  letter-spacing: 3rpx;
  text-transform: uppercase;
  margin-bottom: 24rpx;
}

.reading-text {
  display: block;
  font-size: 30rpx;
  color: rgba(255,248,235,0.9);
  line-height: 1.8;
  margin-bottom: 24rpx;
}

.reading-text.muted { color: rgba(255,248,235,0.4); font-style: italic; }

.zodiac-note {
  display: block;
  font-size: 22rpx;
  color: rgba(212,175,105,0.5);
  letter-spacing: 1rpx;
}
</style>

<template>
  <view class="wrap">
    <view class="bg-gradient" />
    <scroll-view scroll-y class="scroll-wrap">
      <view class="content-layer">

        <view class="header">
          <text class="title">✦ Reading History</text>
          <text v-if="items.length" class="clear-btn" @tap="clearHistory">Clear All</text>
        </view>

        <view v-if="!items.length" class="empty">
          <text class="empty-icon">🌙</text>
          <text class="empty-text">No readings yet.</text>
          <text class="empty-sub">Draw your first card to begin.</text>
        </view>

        <view v-else class="history-list">
          <view v-for="(item, i) in items" :key="i" class="history-item">
            <view class="history-top">
              <text class="history-card">{{ item.card }}</text>
              <text class="history-date">{{ item.date }}</text>
            </view>
            <text class="history-tag">{{ item.tag }}</text>
            <text v-if="item.question" class="history-question">Q: {{ item.question }}</text>
            <text v-if="item.reading" class="history-reading">{{ item.reading }}</text>
          </view>
        </view>

      </view>
    </scroll-view>
  </view>
</template>

<script>
import { history } from '../../utils/api.js';

export default {
  data() {
    return { items: [] };
  },
  onShow() {
    this.items = history.getAll();
  },
  methods: {
    clearHistory() {
      uni.showModal({
        title: 'Clear History',
        content: 'Remove all past readings?',
        success: (res) => {
          if (res.confirm) {
            history.clear();
            this.items = [];
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.wrap { min-height: 100vh; background: #06040f; position: relative; }

.bg-gradient {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(ellipse 500rpx 400rpx at 50% 20%, rgba(124,92,191,0.2) 0%, transparent 60%);
  z-index: 0;
  pointer-events: none;
}

.scroll-wrap { height: 100vh; position: relative; z-index: 1; }
.content-layer { padding: 80rpx 32rpx 60rpx; }

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.title { font-size: 44rpx; color: #d4af69; letter-spacing: 4rpx; }

.clear-btn { font-size: 24rpx; color: rgba(255,248,235,0.35); text-decoration: underline; }

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
  gap: 20rpx;
}

.empty-icon { font-size: 80rpx; }
.empty-text { font-size: 32rpx; color: rgba(255,248,235,0.6); }
.empty-sub { font-size: 26rpx; color: rgba(255,248,235,0.3); }

.history-list { display: flex; flex-direction: column; gap: 24rpx; }

.history-item {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(212,175,105,0.15);
  border-radius: 16rpx;
  padding: 32rpx;
}

.history-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8rpx;
}

.history-card { font-size: 28rpx; color: #d4af69; flex: 1; }
.history-date { font-size: 22rpx; color: rgba(255,248,235,0.3); flex-shrink: 0; margin-left: 16rpx; }
.history-tag { display: block; font-size: 22rpx; color: rgba(255,248,235,0.4); margin-bottom: 16rpx; }
.history-question { display: block; font-size: 26rpx; color: rgba(255,248,235,0.6); margin-bottom: 12rpx; font-style: italic; }
.history-reading {
  display: block;
  font-size: 26rpx;
  color: rgba(255,248,235,0.75);
  line-height: 1.7;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>

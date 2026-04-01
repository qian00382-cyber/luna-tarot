<template>
  <view class="wrap">
    <view class="bg-gradient" />

    <!-- 顶部导航 -->
    <view class="nav-bar">
      <text class="nav-back" @tap="goBack">← Back</text>
      <view class="nav-tabs">
        <text class="nav-tab" :class="{ active: tab === 'privacy' }" @tap="tab = 'privacy'">Privacy</text>
        <text class="nav-tab" :class="{ active: tab === 'terms' }" @tap="tab = 'terms'">Terms</text>
      </view>
      <view class="nav-placeholder" />
    </view>

    <scroll-view scroll-y class="scroll-wrap">
      <view class="content-layer">

        <!-- 隐私政策 -->
        <view v-if="tab === 'privacy'">
          <text class="doc-title">Privacy Policy</text>
          <text class="doc-date">Last updated: March 31, 2026</text>

          <text class="section-title">1. Information We Collect</text>
          <text class="section-body">Luna collects minimal information to provide you with personalized tarot readings. This includes your name (optional), zodiac sign (optional), and the questions or intentions you choose to share during a reading session.</text>

          <text class="section-title">2. How We Use Your Information</text>
          <text class="section-body">Your information is used solely to generate personalized AI tarot readings. Questions you submit are sent to our AI provider (Moonshot/Kimi) to generate responses. We do not sell, rent, or share your personal information with third parties for marketing purposes.</text>

          <text class="section-title">3. Data Storage</text>
          <text class="section-body">Reading history and preferences are stored locally on your device. We do not maintain a server-side database of your personal readings. Your name and zodiac sign preferences are saved only on your device.</text>

          <text class="section-title">4. AI Processing</text>
          <text class="section-body">Questions and card information are transmitted to our AI API (api.moonshot.cn) to generate readings. Please do not include sensitive personal information such as financial details, passwords, or identification numbers in your questions.</text>

          <text class="section-title">5. In-App Purchases</text>
          <text class="section-body">Subscription purchases are processed through Apple's App Store. We do not collect or store your payment information. All billing is handled by Apple in accordance with their privacy practices.</text>

          <text class="section-title">6. Children's Privacy</text>
          <text class="section-body">Luna is rated 17+ and is not intended for children under 17. We do not knowingly collect information from children.</text>

          <text class="section-title">7. Changes to This Policy</text>
          <text class="section-body">We may update this privacy policy from time to time. Continued use of the app after changes constitutes acceptance of the updated policy.</text>

          <text class="section-title">8. Contact</text>
          <text class="section-body">For privacy-related questions, contact us at: privacy@taotalisman.com</text>
        </view>

        <!-- 使用条款 -->
        <view v-if="tab === 'terms'">
          <text class="doc-title">Terms of Use</text>
          <text class="doc-date">Last updated: March 31, 2026</text>

          <text class="section-title">1. Entertainment Purpose Only</text>
          <text class="section-body">Luna is provided for entertainment and personal reflection purposes only. Tarot readings are not a substitute for professional advice. Do not use Luna's readings to make medical, legal, financial, or other important life decisions.</text>

          <text class="section-title">2. Subscription Terms</text>
          <text class="section-body">Luna Premium is available as a weekly ($4.99), monthly ($9.99), or annual ($39.99) subscription. A 3-day free trial is offered for new subscribers. Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period.</text>

          <text class="section-title">3. Cancellation</text>
          <text class="section-body">You may cancel your subscription at any time through your Apple ID Account Settings. Cancellation takes effect at the end of the current billing period. No refunds are provided for partial subscription periods.</text>

          <text class="section-title">4. Acceptable Use</text>
          <text class="section-body">You agree not to misuse the app, attempt to reverse-engineer the AI system, or use the service in any way that violates applicable laws or regulations.</text>

          <text class="section-title">5. Disclaimer</text>
          <text class="section-body">Luna is provided "as is" without warranties of any kind. We do not guarantee the accuracy or reliability of any AI-generated readings. Use at your own discretion.</text>

          <text class="section-title">6. Contact</text>
          <text class="section-body">For terms-related questions: support@taotalisman.com</text>
        </view>

      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return { tab: 'privacy' };
  },
  onLoad(options) {
    if (options.tab === 'terms') this.tab = 'terms';
  },
  methods: {
    goBack() {
      uni.navigateBack();
    }
  }
};
</script>

<style scoped>
.wrap { min-height: 100vh; background: #06040f; position: relative; }

.bg-gradient {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(ellipse 500rpx 400rpx at 50% 10%, rgba(124,92,191,0.15) 0%, transparent 60%);
  z-index: 0;
  pointer-events: none;
}

.nav-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80rpx 32rpx 24rpx;
  background: rgba(6,4,15,0.9);
  backdrop-filter: blur(20rpx);
  border-bottom: 1px solid rgba(212,175,105,0.1);
}

.nav-back { font-size: 28rpx; color: rgba(212,175,105,0.7); min-width: 80rpx; }
.nav-placeholder { min-width: 80rpx; }

.nav-tabs { display: flex; gap: 0; }

.nav-tab {
  font-size: 26rpx;
  color: rgba(255,248,235,0.4);
  padding: 12rpx 32rpx;
  border: 1px solid rgba(212,175,105,0.15);
  transition: all 0.2s;
}

.nav-tab:first-child { border-radius: 40rpx 0 0 40rpx; }
.nav-tab:last-child { border-radius: 0 40rpx 40rpx 0; border-left: none; }

.nav-tab.active {
  color: #d4af69;
  background: rgba(212,175,105,0.1);
  border-color: rgba(212,175,105,0.3);
}

.scroll-wrap { height: calc(100vh - 140rpx); position: relative; z-index: 1; }
.content-layer { padding: 48rpx 40rpx 80rpx; }

.doc-title { display: block; font-size: 44rpx; color: #d4af69; margin-bottom: 12rpx; font-family: Georgia, serif; }
.doc-date { display: block; font-size: 22rpx; color: rgba(255,248,235,0.3); margin-bottom: 48rpx; }

.section-title {
  display: block;
  font-size: 28rpx;
  color: rgba(212,175,105,0.85);
  margin-top: 40rpx;
  margin-bottom: 16rpx;
  font-weight: bold;
}

.section-body {
  display: block;
  font-size: 26rpx;
  color: rgba(255,248,235,0.65);
  line-height: 1.8;
}
</style>

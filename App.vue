<script>
export default {
  onLaunch() {
    // 检查是否已完成onboarding
    const onboarded = uni.getStorageSync('luna_onboarded');
    if (!onboarded) {
      uni.reLaunch({ url: '/pages/onboarding/onboarding' });
    }
  },
  onShow() {},
  onHide() {}
};
</script>

<style>
@import './static/global.css';

/* 全局reset */
* { box-sizing: border-box; }

page {
  background-color: #06040f;
}
</style>

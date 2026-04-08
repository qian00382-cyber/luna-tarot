<script>
import { storage } from './utils/api'
import { getTheme } from './utils/theme'

export default {
	onLaunch() {
		const onboarded = storage.get('luna_onboarded')
		if (!onboarded) {
			uni.reLaunch({ url: '/pages/onboarding/onboarding' })
		}
	},
	onShow() {},
	onHide() {}
}
</script>

<style>
page {
	background-color: #06040f;
}

* {
	box-sizing: border-box;
}

button::after {
	border: none;
}

.btn-gold {
	background: linear-gradient(135deg, #d4af69, #c8a050);
	color: #06040f;
	font-weight: 700;
	border-radius: 50px;
	border: none;
	padding: 14px 0;
	font-size: 15px;
	letter-spacing: 1px;
	text-align: center;
	width: 100%;
}

.btn-gold[disabled] {
	opacity: 0.4;
}
</style>

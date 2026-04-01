# Luna Tarot — UniApp 项目

## 项目结构

```
luna-uniapp/
├── App.vue                    # 入口，检查onboarding状态
├── manifest.json              # App配置（包名、版本等）
├── pages.json                 # 路由 + TabBar配置
├── package.json
├── pages/
│   ├── onboarding/
│   │   └── onboarding.vue     # 4步引导问卷
│   ├── index/
│   │   └── index.vue          # 主页：单牌 + 三牌阵 + Paywall
│   ├── daily/
│   │   └── daily.vue          # 每日运势 + 星座选择
│   └── history/
│       └── history.vue        # 历史记录
├── utils/
│   └── api.js                 # 塔罗牌数据 + API调用 + 本地存储
└── static/
    └── global.css             # 全局样式变量
```

## 使用方法

### 1. 用HBuilderX打开
- 下载 HBuilderX（DCloud官网）
- 文件 → 导入 → 本地项目 → 选择此文件夹

### 2. API地址配置
编辑 `utils/api.js` 第5行：
```js
const API_BASE = 'https://www.taotalisman.com'; // 改成你的域名
```

### 3. 打包iOS
- HBuilderX → 发行 → 原生App-云打包
- 选择iOS证书（已有：com.taotalisman.lunatarot）
- 勾选"上传到AppStore"

### 4. TabBar图标
需要在 `static/` 目录放入TabBar图标（40x40px PNG）：
- tab-reading.png / tab-reading-active.png
- tab-daily.png / tab-daily-active.png  
- tab-history.png / tab-history-active.png

## 内购接入（上线后）
`pages/index/index.vue` 中 `handleSubscribe()` 方法：
- 替换为 `uni.requestPayment()` + RevenueCat SDK
- 或直接调用Apple StoreKit

## 关键配置
- 包名：com.taotalisman.lunatarot
- Kimi API Key：配置在Vercel环境变量 KIMI_API_KEY
- 证书密码：com.taotalisman.lunatarot

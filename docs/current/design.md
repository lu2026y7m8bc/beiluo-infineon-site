# Design — BeiLuo「Infineon distributor」UI/UX 设计文档

| 项 | 内容 |
|----|------|
| 文档版本 | v1.0 |
| 创建日期 | 2026-06-30 |
| 依据 | docs/current/prd.md |
| 设计模式 | Enterprise Gateway（企业门户） |
| 设计风格 | Trust & Authority（信任与权威） |
| 范围 | 视觉系统 + 布局 + 组件 + 各模板线框 + 交互 + 响应式 + 可访问性 + SVG 方向 |
| 不含 | 开发步骤、实现代码（见 plan.md / 代码阶段） |
| 状态 | ✅ 定稿：自检 + spec-reviewer(4+1) + Codex v1(3项修复) + Codex v2(Approved) |

> 说明：本文件仅描述"设计是什么样、为什么"。令牌值、线框、组件解剖均为**设计规格**，不是实现代码。

---

## 目录
1. 设计原则与品牌方向
2. 设计令牌（颜色/字体/间距/圆角/阴影/层级/断点）
3. 布局系统（栅格/容器/响应式策略）
4. 全局组件库（导航/页脚/面包屑/侧边栏/浮层/按钮/卡片/徽章/表格/Tab/表单/分页/标签）
5. 页面模板线框（12 套）
6. 交互与动效规范
7. 响应式行为矩阵
8. 可访问性规范（WCAG AA）
9. SVG 资源设计方向
10. 设计↔PRD 验收映射

---

## 1. 设计原则与品牌方向

**定位**：面向国际工程师/采购的 B2B 半导体分销门户。第一印象必须传达 **专业、权威、可信、库存与技术实力**。

**五条原则**
1. **信任优先（Trust-first）**：资质徽章、报关单、客户 Logo、FAE 实名、库存状态在视觉上前置且醒目。
2. **现代极简（Minimal）**：大量留白、克制装饰、清晰层级；避免花哨渐变（禁 AI 紫/粉渐变）。
3. **转化导向（Conversion）**：每个内容页都有明确 CTA 路径（报价/样品/手册/咨询 FAE）；橙色 CTA 在蓝/灰背景上形成高对比焦点。
4. **数据清晰（Data-clarity）**：型号参数表是核心资产，表格可读、可筛选、可扫描。
5. **一致性（Consistency）**：全站同一套令牌与组件，12 套模板共享导航/页脚/面包屑。

**反模式（禁止）**：playful 卡通风、隐藏资质、AI 紫粉渐变、emoji 当图标、装饰性无限动画。

---

## 2. 设计令牌（Design Tokens）

> 以 CSS 自定义属性命名表达设计意图（值为设计规格）。主色与字体来自 PRD 铁律，优先级高于通用推荐。

### 2.1 颜色

| 令牌 | 值 | 用途 |
|------|----|------|
| `--c-primary` | `#0072CE` | 科技蓝主色：链接、强调、H 标题点缀、主按钮描边 |
| `--c-primary-dark` | `#005BA3` | 主色 hover/active |
| `--c-primary-tint` | `#E6F1FB` | 浅蓝底：标签、信息块、表头 hover |
| `--c-cta` | `#F5821F` | 橙色 CTA：主转化按钮（获取报价/申请样品） |
| `--c-cta-dark` | `#D96D10` | CTA hover/active |
| `--c-bg` | `#FFFFFF` | 页面主背景 |
| `--c-bg-alt` | `#F8F9FA` | 中性灰区块背景（隔行/卡片区/斑马纹偶数行） |
| `--c-text` | `#1A2433` | 正文主文本（对白底对比 ≈ 13:1） |
| `--c-text-muted` | `#5B6B7F` | 辅助文本/说明（对白底 ≈ 4.8:1，达 AA） |
| `--c-border` | `#E2E8F0` | 描边、分隔线、卡片边框 |
| `--c-success` | `#1F9D55` | 库存"有货"绿 |
| `--c-success-tint` | `#E6F6EE` | 有货徽章底 |
| `--c-warn` | `#E8820C` | 库存"询价"橙 |
| `--c-warn-tint` | `#FBEFD9` | 询价徽章底 |
| `--c-ink-banner` | `#0B1B2B` | 新闻 Banner 深色叠加（文字白+阴影） |

**对比度核查**：正文 `#1A2433`/白 ≈ 13:1（AAA）；muted `#5B6B7F`/白 ≈ 4.8:1（AA）。**CTA 按钮**：橙底 `#F5821F` 上**必须用深色文字 `--c-text #1A2433`（≈5.95:1，全尺寸达 AA）**；**禁用白字**（白/橙仅 ≈2.6:1，未达 AA，连大文本 3:1 都不过）。hover 态 `#D96D10` 上深色字 ≈4.58:1，仍达标。

### 2.2 字体（PRD 铁律：Inter/Roboto，font-display:swap）

| 令牌 | 值 | 用途 |
|------|----|------|
| `--font-heading` | `'Inter', system-ui, sans-serif` | H1–H4、按钮、导航 |
| `--font-body` | `'Roboto', system-ui, sans-serif` | 正文、表格、说明 |

**字阶（Type scale，1.25 比例，移动端正文 ≥16px）**

| 级别 | 桌面 | 移动 | 字重 | 行高 |
|------|------|------|------|------|
| H1 | 40px | 30px | 700 | 1.2 |
| H2 | 30px | 24px | 700 | 1.25 |
| H3 | 23px | 20px | 600 | 1.3 |
| H4 | 18px | 17px | 600 | 1.4 |
| Body | 16px | 16px | 400 | 1.7（长文 1.8） |
| Small | 14px | 14px | 400 | 1.5 |
| Caption | 12px | 12px | 500 | 1.4 |

长文正文（tech/news/solution detail）：`max-width: 800px`，行高 1.8，段间距 24px（PRD 模板10.2）。

### 2.3 间距 / 圆角 / 阴影 / 层级 / 断点

**间距（8px 基准）**：4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96。

**圆角**：`--r-base: 8px`（按钮/输入/标签）、`--r-card: 12px`（卡片/面板）、`--r-pill: 999px`（徽章/胶囊标签）。

**阴影**：
- `--sh-sm: 0 1px 2px rgba(0,0,0,.06)`
- `--sh-card: 0 4px 6px rgba(0,0,0,.07)`（PRD 指定）
- `--sh-hover: 0 10px 20px rgba(0,0,0,.10)`
- `--sh-nav: 0 2px 8px rgba(0,0,0,.06)`（滚动后导航）

**Z-index 阶梯**（避免任意大值）：`10` sticky（nav/TOC）、`20` 下拉/Mega 菜单、`30` 右侧联系浮层、`40` 遮罩、`50` 模态/移动抽屉。

**断点**（PRD）：移动 `<768px`、平板 `768–1199px`、桌面 `≥1200px`；容器 `--container-max: 1319px` 居中。

---

## 3. 布局系统

- **栅格**：12 列，gutter 24px，CSS Grid 实现；容器 `max-width:1319px`，左右内边距移动 16px / 平板 24px / 桌面 32px。
- **节奏**：区块（section）垂直间距桌面 80px、移动 48px；卡片内边距 24px。
- **常用栅格映射**：
  - 产品分类卡网格：桌面 4 列 / 平板 2 列 / 移动 1 列。
  - 特性 Feature Grid：桌面 3 列 / 平板 2 列 / 移动 1 列。
  - 内容+侧栏（tech/solution detail）：桌面 `1fr 300px` / 移动单列（侧栏移到文末）。
  - 产品详情首屏：桌面 `1fr 1fr` 双栏 / 移动单列。
- **固定导航补偿**：`body` 顶部预留 = 导航高度（桌面 72px / 移动 60px），内容不被遮挡。

---

## 4. 全局组件库

### 4.1 顶部导航 Nav + Mega Menu
```
┌───────────────────────────────────────────────────────────────────────┐
│ [LOGO]  BeiLuo                         Home Products▾ Solutions Support  │
│  └ Top 8 Electronic Component          News About  [ Get a Quote ]      │
│    Distributor in China                                                  │
└───────────────────────────────────────────────────────────────────────┘
        ▼ (hover Products → Mega Menu)
   ┌────────────────────────────────────────────────────┐
   │ MCU 微 │ IGBT │ MOSFET │ Sensors   + 每类 2 个热门型号 │
   └────────────────────────────────────────────────────┘
```
- 高度桌面 72 / 移动 60；滚动后 `position:sticky`，背景半透明白 `rgba(255,255,255,.88)` + `backdrop-filter:blur(8px)` + `--sh-nav`。
- 左：SVG Logo + 标语（标语移动端隐藏）。右：一级导航 + 橙色 "Get a Quote" 按钮。
- Products 悬停展开 Mega Menu（z-20），列出 4 分类 + 每类 "Featured models" 入口。**数据来源**：Featured = 该分类 `products.json` 现有型号列表的前 2 项（不新增数据字段）；无型号时仅显示分类入口。
- 移动端：汉堡图标 → 右侧抽屉（z-50，全高，含全部导航 + CTA）。所有可点项 ≥44px。

### 4.2 页脚 Footer
4 列（移动 1 列堆叠）：①品牌+标语+一句话简介 ②Products 链接 ③Support/Solutions/News 链接 ④Contact（WhatsApp/WeChat + 询价入口）。底部版权条 + sitemap/robots 链接。深色底 `#0B1B2B`，文字浅灰，链接 hover 变白。

### 4.3 面包屑 Breadcrumbs
`Home / Products / IGBT / IKW40N120H3`，分隔符 `/`，末项当前页不可点（`aria-current="page"`）。与 BreadcrumbList JSON-LD 对应。位于内容区顶部、H1 上方。

### 4.4 侧边栏 Sidebar（列表/分类/方案详情/支持详情）
- 产品分类导航树（高亮当前分类）。
- 详情页：相关条目列表 / 支持详情含 Sticky TOC（`position:sticky;top:100px`，z-10）。
- 移动端：移到主内容下方（折叠面板）。

### 4.5 右侧固定联系浮层（全站）
竖向胶囊（z-30，`position:fixed;right:16px;top:40%`）：WhatsApp 图标 + WeChat 图标；点击展开号码/二维码气泡。移动端缩为右下角悬浮按钮，不遮挡正文。

### 4.6 按钮
| 类型 | 样式 | 用途 |
|------|------|------|
| Primary CTA | 橙实心 `--c-cta`，**深色加粗字 `--c-text`（AA 5.95:1，非白字）**，`--r-base`，hover→`--c-cta-dark`+`--sh-hover` | 获取报价/申请样品 |
| Secondary | 蓝描边 `--c-primary`，蓝字，透明底，hover→浅蓝底 | 下载数据手册 |
| Ghost/Text | 无边框蓝字 + 箭头 | "Selection Guide →" 等内链 |
所有按钮 `cursor:pointer`、过渡 200ms、焦点态可见蓝色 focus ring（2px）。

### 4.7 卡片 Card
圆角 12px、边框 `--c-border`、`--sh-card`；hover 上浮 4px + `--sh-hover`（用 `transform:translateY` 不引起重排）。变体：产品分类卡（图标+标题+简介+链接）、文章卡（封面 SVG+标签+标题+摘要+日期）、料号卡（型号+关键参数+库存徽章）。

### 4.8 徽章 Badge
胶囊形 `--r-pill`，12px 500 字：库存"In Stock"（绿 `--c-success`/底 tint）、"RFQ/询价"（橙 `--c-warn`/底 tint）、分类标签（浅蓝 `--c-primary-tint`/蓝字）、新闻分类（"Industry News"）。

### 4.9 规格表 `.spec-table`（斑马纹）
```
┌─Part No.─┬─Series─┬─VCE(V)─┬─IC(A)─┬─Package─┬─Stock─┐
│ IKW40..H3│ H3     │ 1200   │ 40    │ TO-247  │ ●In   │  ← 行 hover 浅蓝
├──────────┼────────┼────────┼───────┼─────────┼───────┤
│ IKW25..H3│ H3     │ 1200   │ 25    │ TO-247  │ ●RFQ  │  ← 偶数行 --c-bg-alt
└──────────┴────────┴────────┴───────┴─────────┴───────┘
```
- 表头加粗、灰底 `--c-bg-alt`、sticky（横向滚动时表头列名保留）。
- 偶数行斑马纹 `--c-bg-alt`；行 hover 浅蓝 `--c-primary-tint`。
- 第一列型号为蓝色链接（→详情页）。
- **动态列**：列集合由分类数据驱动（IGBT 与 MCU 列不同）。
- **每列筛选**：列头下方筛选控件（下拉/范围/多选），纯前端过滤。
- 移动端：`overflow-x:auto` 横向滚动，首列型号 `position:sticky;left:0` 冻结。

### 4.10 Tab `.tab-container`
横向 tab 条（下划线高亮当前，蓝色），切换面板（产品详情：Overview/Specs/Application/Documents；支持列表：4 分类）。键盘可达（role=tablist，箭头切换）。移动端 tab 可横向滚动。

### 4.11 表单（询价/向工程师提问）
字段：Name / Email / Part No. / Message；每字段有 `<label for>`；必填校验 + 错误提示就近显示（红字+边框）。提交按钮为 Primary CTA，提交态禁用+spinner。纯前端校验（静态站，提交后展示成功提示/邮件链接）。

### 4.12 标签云 / 分页
- 标签：胶囊 `--c-primary-tint`，点击 → 标签聚合页。
- 分页：列表页底部数字分页（≥44px 点击区，当前页高亮）。

---

## 5. 页面模板线框（12 套）

> 通用：所有模板含 Nav / Footer / 右侧联系浮层 / SEO Meta 占位符；**面包屑仅非首页模板**（首页 home 无面包屑）。侧边栏按 §3.1 PRD 规则（news/product detail 无侧边栏）。

### 5.1 首页 `home`
```
[Nav]
[HERO]  抽象电路科技背景(SVG)
        H1: Your Trusted Infineon Distributor
        副文案 + [Get a Quote] [Browse Products]
        信任条: ISO badge | 10+ yrs | Global Logistics
[WHY CHOOSE US]  3–4 列 Feature Grid（库存深度/FAE技术/物流/正品）
[PRODUCTS]       4 分类卡网格 → 各分类页
[SOLUTIONS]      精选方案卡 3 列
[SUPPORT]        最新技术文章 3 卡
[NEWS]           Latest News 3 卡
[FINAL CTA]      橙底/深底大区块 + [Contact Sales]
[Footer]
[JSON-LD: Organization + WebSite]
```

### 5.2 产品列表页 `products-list`
Breadcrumb → H1 + 200字行业介绍 → 4 分类大卡（图标+简介+"View Models →"）网格。侧边栏分类导航。

### 5.3 产品二级分类页 `product-category`（核心）
```
[Breadcrumb] [Sidebar▸分类树] │ H1: Infineon IGBT Distributor
                              │ 200–300字原创描述（系列/优势/应用+关键词）
                              │ [Download Category Selection Guide] [Selection Guide →]
                              │ ── FAE 应用解读（引述块）──
                              │ 图文卡片: 关键参数 | 典型型号 | 应用领域 | 优势对比
                              │ ┌ .spec-table 动态列 + 每列筛选 ──────────┐
                              │ │ 型号(链接) … 参数 … 封装 … 库存徽章       │
                              │ └──────────────────────────────────────┘
[JSON-LD: ItemList + 每型号 Product]
```

### 5.4 产品详情页 `product-detail`（无侧边栏，电商级）
```
[Breadcrumb]
┌── 左: 产品大图区 ──┬── 右: 核心信息栏 ───────────────┐
│  主图(SVG)         │ H1 型号                          │
│  [缩略图画廊预留]   │ ●In Stock / ●RFQ 徽章            │
│                    │ 简短描述                          │
│                    │ [Get a Quote(橙)] [Download Datasheet(蓝描边)] │
└────────────────────┴─────────────────────────────────┘
[.tab-container] Overview | Specifications(斑马表) | Application | Documents
[FAQ 3–5 问 手风琴]
[Alternative & Companion Parts — 卡片轮播 → 内链产品页]
[多 CTA 区: 下载手册 | 申请样品 | 获取报价 | 咨询FAE]
[JSON-LD: Product]
```

### 5.5 解决方案列表页 `solutions-list`
Breadcrumb → H1 → 方案卡列表（每卡：行业图标 + 标题 + Summary 摘要 + "Read →"）。侧边栏行业导航。

### 5.6 解决方案详情页 `solution-detail`（含侧边栏）
```
[Breadcrumb] H1: 行业 + Solution
[Block Diagram 方案框图(SVG, 详细alt)]
[H2 Core Advantages] [H2 Recommended BOM List → 型号内链表]
[H2 Application Scenarios]   正文≥800字
侧边栏: 相关方案 / 相关产品 / [Get BOM Quote]
[结尾 Distributor CTA]
[JSON-LD: BreadcrumbList（无专用类型，依 §10；不引入超范围 Schema）]
```

### 5.7 支持总览列表页 `support-list`
Breadcrumb → H1 → `.tab-container`(4 分类) → 各 tab 文章卡 + "View all in {category} →" 链接到分类索引页。

### 5.8 支持分类索引页（复用 `support-list` 模板，数据子集）
`/support/guides/` 等 4 个。H1=分类名+关键词，列出该分类全部文章卡。

### 5.9 支持标签聚合页（复用 `support-list` 模板）
`/support/tags/<tag>/`。H1=`Articles tagged "IGBT"`，列出带该标签文章。

### 5.10 技术支持详情页 `tech-detail`（沉浸阅读 + Sticky 侧栏）
```
[Breadcrumb]
┌── 左: 文章区(max-width 800px) ──┬── 右: Sticky 侧栏(300px) ──┐
│ [FAE 作者栏: 头像/姓名/日期]     │ ▸ Table of Contents (sticky) │
│ H1                              │ ▸ Related PDF Download       │
│ 正文: H2/H3 左竖线              │ ▸ Ask an Engineer (表单入口)  │
│   <pre><code> 灰底               │                              │
│   <blockquote> 左边框            │                              │
│   行高1.8 段距24 ≥800字          │                              │
│ [标签] [型号内链≥1][概念内链≥1]  │                              │
│ [相关文章 3–5]                   │                              │
└─────────────────────────────────┴──────────────────────────────┘
[结尾 Distributor CTA]   [JSON-LD: TechArticle]
```

### 5.11 新闻列表页 `news-list`
Breadcrumb → H1 → 两分区：**Company News** 与 **Industry News**（分区标题 + 各自卡片网格，不混排）。侧边栏新闻导航。

### 5.12 新闻详情页 `news-detail`（单栏杂志风，无侧边栏，依 C7）
```
[全宽 Header Banner(背景图/色块 + 文字阴影)]
   H1 + 日期 + [分类标签]
[单栏居中正文 ≥800字]
[社交分享栏]
[Latest News — 3 图文卡（最近 3 篇，排除当前，承担新闻导航）]
[结尾 Distributor CTA]   [JSON-LD: NewsArticle]
```

### 5.13 关于我们 `about`
Breadcrumb → Hero 简介 → 公司简介&发展历程（时间线）→ 优势 Feature Grid → 客户案例 Logo 墙 → 报关单展示区（信任）→ 团队/FAE 入口 → CTA。模块化网格布局。

### 5.14 联系我们 `contact`（独立模板）
Breadcrumb → H1 → 网格：左 联系卡（WhatsApp/WeChat + 二维码 SVG）/ 右 询价表单。底部地图占位/营业说明。右侧浮层同全站。

### 5.15 作者简介页（FAE）
**独立页面**，URL `/about/authors/<slug>/`，**复用 `about` 模板**（数据驱动的轻量变体，不新增第 13 套模板）。内容：FAE 头像(SVG)/真实姓名/技术专长/从业经验 + 其撰写文章列表。由 `tech-detail` 顶部作者栏链接至此页（E-E-A-T）。

---

## 6. 交互与动效规范

| 场景 | 规范 |
|------|------|
| 微交互时长 | 150–300ms，`ease`/`ease-out` |
| 按钮 hover | 颜色加深 + 阴影加深（不缩放变形） |
| 卡片 hover | `translateY(-4px)` + `--sh-hover`（transform/opacity，不动 width/height） |
| 导航滚动 | 滚动 >40px 加 `--sh-nav` + 半透明背景 |
| Tab/手风琴 | 面板淡入 + 高度过渡 |
| Sticky TOC | 当前阅读章节高亮 |
| 加载/提交 | 按钮 spinner + 禁用；异步内容预留空间防跳动 |
| 动画约束 | 无装饰性无限动画；尊重 `prefers-reduced-motion:reduce`（关闭过渡） |

---

## 7. 响应式行为矩阵

| 模板 | 桌面 ≥1200 | 平板 768–1199 | 移动 <768 |
|------|-----------|--------------|----------|
| 全局 Nav | 横向 + Mega | 横向（精简） | 汉堡 + 抽屉 |
| 首页网格 | 4/3 列 | 2 列 | 1 列 |
| 产品分类表格 | 全列展示 | 横向滚动 | 横向滚动 + 首列冻结 |
| 产品详情首屏 | 双栏 1:1 | 双栏 | 单栏堆叠 |
| tech/solution detail | 内容+侧栏 1fr/300 | 内容+侧栏 | 侧栏移到文末 |
| news detail | 单栏居中 | 单栏 | 单栏 |
| 联系浮层 | 右侧竖胶囊 | 右侧 | 右下角悬浮按钮 |

所有交互元素 ≥44px；正文移动 ≥16px；无横向溢出。

---

## 8. 可访问性规范（WCAG AA）

- 颜色对比：正文/背景 ≥4.5:1；**CTA 橙底用深色文字（≥4.5:1，禁白字）**，已核查 §2.1。
- 焦点态：所有可交互元素可见 focus ring（2px 蓝）；Tab 顺序匹配视觉顺序。
- 图标按钮加 `aria-label`；图片有描述性 `alt`（含关键词）。
- 表单 `<label for>` 关联；错误信息文本化（不只用颜色）。
- 语义化标签：`<header><nav><main><article><aside><footer>`；单一 H1；H2/H3 层级不跳级。
- 表格 `<th scope>`；Tab `role=tablist/tab/tabpanel`。
- `prefers-reduced-motion` 关闭非必要动画。

---

## 9. SVG 资源设计方向（全 AI 生成，统一风格）

**统一规范**：24×24 viewBox 图标线宽 2、圆角端点、单色描边 `currentColor`（默认 `--c-primary`）；插画用蓝/灰主色 + 橙点缀，扁平科技风。

| 资源 | 设计方向 |
|------|---------|
| 产品分类图标 | MCU(芯片+引脚) / IGBT(功率模块) / MOSFET(晶体管符号) / Sensors(波形+传感) —同族线性图标 |
| Logo | "BeiLuo" 文字 + 抽象元件/芯片标记；右侧英文标语 "Top 8 Electronic Component Distributor in China"；横排，移动端可省标语 |
| 抽象背景 | Hero/Banner 用电路板纹理、PCB 走线、节点连线，低饱和蓝灰，作底纹不抢内容 |
| 方案框图 | Block Diagram：模块盒+连线+标注，清晰可读，详细 alt |
| 插画/封面 | News/About/Contact：扁平科技小插画（仓储/物流/团队/握手/信封定位） |
| 信任徽章 | ISO/资质/质保 线性徽章 |
| 列表/详情配图 | 每列表项与详情页配同族 SVG（PRD 要求） |

---

## 10. 设计 ↔ PRD 验收映射

| PRD 验收点 | 本设计落点 |
|-----------|-----------|
| 色板/圆角/阴影/字体 token | §2 设计令牌 |
| 12 列栅格 + 响应式三档 | §3 + §7 |
| nav 滚动固定半透明 | §4.1 |
| 面包屑 + BreadcrumbList | §4.3 |
| 动态列规格表 + 每列筛选 + 点型号 | §4.9 + §5.3 |
| 产品详情 双栏/Tab/斑马表/双CTA/FAQ/料号 | §5.4 |
| 支持 Sticky TOC + 作者 + 标签 + 分类页 + 标签页 | §4.4/§5.7–5.10 |
| 方案 框图+BOM内链 | §5.6 |
| 新闻 单栏Banner（无侧栏 C7） | §5.12 |
| 联系 独立模板 + WhatsApp/WeChat + 浮层 | §4.5/§5.14 |
| 多样化 CTA（分类级+型号级） | §4.6/§5.3/§5.4 |
| WCAG AA + ≥44px + 键盘 | §8 |
| SVG 全套统一风格 | §9 |
| JSON-LD（7 类，逐模板归属） | 见下表 |

**JSON-LD 类型 → 模板归属**

| Schema 类型 | 归属模板 |
|------------|---------|
| `Organization` + `WebSite` | 首页 `home`（§5.1） |
| `BreadcrumbList` | 全部非首页模板（面包屑，§4.3） |
| `ItemList` + 每型号 `Product` | 产品二级分类页 `product-category`（§5.3） |
| `Product` | 产品详情页 `product-detail`（§5.4） |
| `TechArticle` | 技术支持详情页 `tech-detail`（§5.10） |
| `NewsArticle` | 新闻详情页 `news-detail`（§5.12） |

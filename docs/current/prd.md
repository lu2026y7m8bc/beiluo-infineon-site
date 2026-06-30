# PRD — BeiLuo「Infineon distributor」英文 SEO/GEO 网站

| 项 | 内容 |
|----|------|
| 文档版本 | v1.0 |
| 创建日期 | 2026-06-30 |
| 品牌 | BeiLuo |
| Logo 标语 | Top 8 Electronic Component Distributor in China |
| 核心关键词 | infineon distributor |
| 技术形态 | HTML + 原生 CSS 纯静态站；模板 + JSON + Node 构建脚本生成 |
| 部署 | GitHub 仓库 → Cloudflare Pages（**强制交付项**；凭证为前置条件，就绪即自动执行、不询问） |
| 语言 | 全站纯英文 |
| 文档位置 | docs/current/prd.md |
| 状态 | 自检 + Codex 复检 v1(5)+v2(6)+v3(收敛,2项增值采纳) 全部处理 |

---

## 1. 项目背景与目标

BeiLuo 是电子元件分销商，需要一个面向**国际买家/工程师**的纯英文营销网站，主打关键词 **infineon distributor**，通过以下三方面获取流量与询盘：

1. **SEO**：让 Google 对核心词及长尾词排名靠前（结构化 URL、Meta、Schema、内链、sitemap）。
2. **GEO**（Generative Engine Optimization）：让 AI 搜索/助手在回答"infineon distributor"相关问题时引用并推荐本站（事实性内容、FAQ、权威表述、结构化数据）。
3. **转化**：以专业内容 + 多样化 CTA（获取报价/申请样品/下载手册/咨询 FAE）引导询盘。

**总体目标**：交付一个可复制的模板化静态站。换品牌只需复制仓库 → 替换 JSON 数据 → 重新构建。

### 1.1 关键词体系
- 核心词：`infineon distributor`
- 地域长尾：infineon distributor USA / India / Japan / Korea / Germany / Vietnam / Mexico / Russia / Turkey
- 产品长尾：Infineon IGBT distributor / Infineon MOSFET distributor / Infineon MCU distributor 等
- 资质长尾：Infineon authorized distributor / Infineon authorized agent
- 问题型长尾：how to select Infineon MCU / Infineon distributor list / Infineon official distributor query 等

> 说明：prompt.md 中的中文关键词列表（"英飞凌IGBT代理"等）仅作为英文翻译目标，页面落地一律英文。

### 1.2 需求冲突与决议（来自 prompt.md 内部矛盾，已裁定）

| # | 冲突 | prompt 出处 | 决议 |
|---|------|-----------|------|
| C1 | 内容语言：全站纯英文 vs "中文介绍" | 铁律#1 vs 第67行 | **全站纯英文**；"中文介绍"判为模板残留 |
| C2 | 解决方案详情：5 个 vs 4 个 | 第95行 vs 第232行 | **落地 5 个**（满足第95行"发布5个"）；里程碑验收门槛 ≥4（第232行）。数据与生成按 5 个执行 |
| C3 | 详情页发布数：各 1 篇 vs 各 4 篇 | 第115行 vs 第232行 | **各 4 篇**（取验证里程碑，更具体且靠后） |
| C4 | 4 个产品分类未点名 | 第67行举例 | **MCU / IGBT / MOSFET / Sensors** |
| C5 | 审查工具 codex/reviewer/playwright | 全文多处 | **codex CLI 实测可用**（codex-cli 0.142.0），用于各阶段复检（只读、不改文件，结论交 Claude 裁定）；`spec/plan-document-reviewer` 专用 agent 与 playwright 本会话无 → 用 Claude 自带审查技能 + 浏览器 skill 替代 |
| C6 | 详情页侧边栏 vs 产品详情模板无侧边栏 | 第116行 vs 第128–138行 | 产品详情按模板10.1用**底部"配套料号"轮播**承担"相关"职能；方案/支持详情用**侧边栏相关条目** |
| C7 | 新闻详情"单栏居中" vs "侧边栏新闻导航" | 第29/116行 vs 第151–158行（模板10.3） | 新闻详情**单栏居中**（取模板10.3，无左侧边栏）；"新闻导航/相关"由**底部"Latest News"3卡**（最近3篇，排除当前，任意类型）承担 |

### 1.3 页数口径表（prompt 行 → 最终数量，消除中文乱码歧义）

| 交付项 | prompt 出处 | 最终数量（裁定） |
|--------|-----------|----------------|
| 产品分类页 | 第230行 | **4**（MCU/IGBT/MOSFET/Sensors） |
| 产品详情页 | 第231行"每分类2篇" | **8**（4×2） |
| 解决方案详情页 | 第95行(5) / 第232行(4) | **5**（门槛≥4，见 C2） |
| 新闻详情页 | 第115行(各1) / 第232行(4) | **4**（第115"1篇"被里程碑取代，见 C3） |
| 技术支持详情页 | 第115行(各1) / 第232行(4) | **4** |
| 技术支持分类索引页 | 第87行 | **4**（guides/app-notes/troubleshooting/reviews） |
| 技术支持标签聚合页 | 第88行 | 按出现的标签**自动生成** |
| 列表页 | 第230行 | home/about/products/solutions/support/news/contact **全部** |
| 模板 | 第235–237行 + §3.8 | **12**（11 点名 + contact） |

### 1.4 决策溯源（流程合规）

本 PRD 前置流程已完成：**brainstorming 技能 + AskUserQuestion 澄清轮（2026-06-30）**，用户确认 4 项关键决策（品牌 BeiLuo / 全站纯英文 / 跳过缺失工具 / 仅 WhatsApp+WeChat）。冲突裁定 **C1–C7** 及工具替代（playwright→browser/ui-test、部署凭证前置、codex 用于复检）均为该澄清轮口径下的**已批准决策**，非单方假设。

---

## 2. 用户角色与典型场景

| 角色 | 描述 | 核心诉求 |
|------|------|---------|
| 采购工程师 | 已知型号，找现货与报价 | 快速查参数、库存、获取报价 |
| 研发/硬件工程师 | 选型阶段 | 按参数筛选型号、读选型指南、咨询 FAE |
| 采购经理 | 评估供应商 | 判断资质、库存深度、物流、信任背书 |
| AI 搜索引擎 | 代用户检索答案 | 抓取结构化、事实性、权威内容并引用本站 |

**端到端场景**：工程师 Google 搜索 "infineon igbt distributor" → 落地产品分类页 → 用动态列表格按封装/电压筛选 → 点型号进详情页 → 看参数/FAQ/替代料号 → 点"Get a Quote" → 提交询价表单。

---

## 3. 功能需求

> 每个模块按 **功能 / 场景 / 验收** 描述。验收项即后续测试与 verification 的勾选清单。

### 3.1 全局框架（导航 / 页脚 / 面包屑 / 侧边栏）

**功能**
- 统一顶部 `<nav>`：Logo + 标语、一级导航（Home / Products / Solutions / Support / News / About Us / Contact）、滚动时固定且半透明背景。
- 统一 `<footer>`：品牌信息、栏目链接、联系方式（WhatsApp/WeChat）、版权。
- 全站面包屑导航（Breadcrumbs），与 BreadcrumbList JSON-LD 对应。
- 侧边栏规则（解决 C6/C7）：列表页、产品二级分类页、**方案详情、支持详情**含侧边栏（分类导航/相关条目/TOC）；**新闻详情单栏无侧边栏**（底部相关卡承担）；**产品详情无侧边栏**（Tab + 底部配套料号轮播承担）。
- 右侧固定联系浮层：WhatsApp +86 15013702378、WeChat +86 18612518271。

**场景**：用户在任意页面都能一键回首页、看到当前位置、随时发起联系。

**验收**
- [ ] 所有页面 nav/footer 完全一致，链接全部有效（无 404、无空 `#` 链接）。
- [ ] 面包屑在每个非首页页面出现且路径正确。
- [ ] nav 滚动固定 + 半透明生效。
- [ ] 右侧联系浮层在所有页面可见，移动端不遮挡内容。

### 3.2 首页 Homepage

**功能**：Hero Banner（专业文案 + 抽象科技背景 SVG）、Why Choose Us（核心优势）、Solutions 精选、Support 最新文章、Latest News、底部 Final CTA。

**场景**：新访客 30 秒内理解"BeiLuo = 专业 Infineon 分销商"并找到下一步入口。

**验收**
- [ ] 含全部 6 个模块且内容来自 `home.json`。
- [ ] `<title>` 形如 `Infineon distributor | BeiLuo`，Description 含 `infineon distributor` + `BeiLuo`。
- [ ] 含 Organization JSON-LD。
- [ ] 自然嵌入核心词与 "Infineon authorized distributor / Infineon stock" 等表述。

### 3.3 产品中心

**3.3.1 产品列表页 `/products/`**
- **功能**：以图文卡片展示 4 个产品分类（MCU / IGBT / MOSFET / Sensors），每卡含 SVG 图标、简介、入口。
- **验收**：4 张分类卡，标题唯一含关键词，卡片链接有效，数据来自 `products.json`。

**3.3.2 二级产品分类页 `/products/<category>/`（核心）**
- **功能**：
  - H1 + H1 下方 200–300 字原创分类描述（介绍系列如 AURIX™/XMC™/PSoC™、优势、应用，融入 "Infineon MCU distributor / Infineon MCU selection" 等英文关键词）。
  - "Selection Guide" 入口链接到对应支持文章。
  - FAE 撰写的"代理商点评/应用解读"段落。
  - 分类级图文卡片：关键参数概览、典型型号列表、应用领域（Applications）、优势对比（Advantage comparison）、配套料号推荐。
  - **动态列型号表格**：列由该分类参数决定（型号/系列/各参数/封装），每列可作为筛选项；点型号跳详情页。移动端横向滚动。
  - 侧边栏产品分类导航。
  - 分类级 CTA（信息收集阶段）："Download Category Selection Guide"（下载产品分类选型手册）。
  - 结构化数据：页面输出 **`ItemList`**（列出型号项），每个型号项关联 **`Product`** JSON-LD（含 name/sku/brand 等），明确告诉搜索引擎表格数据。
- **场景**：工程师按"封装=TO-247、电压≥1200V"筛选 IGBT，快速定位候选型号并进入详情。
- **验收**
  - [ ] 4 个分类页全部发布。
  - [ ] 每页有 200–300 字原创描述 + 选型指南入口 + FAE 点评。
  - [ ] 表格列随分类动态变化（不同分类列不同），每列可筛选，点型号正确打开详情页。
  - [ ] 移动端表格可横向滚动，不破版。
  - [ ] 标题唯一、含关键词、准确描述内容。
  - [ ] 含 `ItemList` + 每型号 `Product` JSON-LD，且通过结构校验。

**3.3.3 产品详情页 `/products/<category>/<model>/`（每分类 2 个，共 8）**
- **功能**（按 product-detail 模板）：
  - 首屏双栏：左产品大图区（预留缩略图画廊），右核心信息栏（H1 型号、库存标签 绿色有货/橙色询价、简短描述、双 CTA：橙色实心"Get a Quote" + 蓝色描边"Download Datasheet"）。
  - Tab 选项卡：Overview / Specifications（斑马纹表，表头加粗灰底，移动端横向滚动）/ Application / Documents。
  - 针对该型号的 FAQ（3–5 问）。
  - 替代料号 + 配套料号推荐（卡片轮播），均内链到对应产品页。
  - 多样化 CTA：下载选型手册 / 申请样品 / 获取报价 / 咨询技术问题（转 FAE）。
  - Product 类型 JSON-LD。
- **场景**：采购工程师确认参数、看库存状态、一键获取报价。
- **验收**
  - [ ] 每分类 2 个详情页发布（共 8）。
  - [ ] 双栏首屏 + 库存标签 + 双 CTA 齐全。
  - [ ] 4 个 Tab 切换正常，规格表为斑马纹、移动端可滚。
  - [ ] FAQ 3–5 条；替代/配套料号链接有效。
  - [ ] 含有效的 Product JSON-LD。

### 3.4 解决方案 Solutions

**3.4.1 列表页 `/solutions/`**
- **功能**：每个方案一段 Summary（含核心词与应用场景）+ 卡片入口。
- **验收**：列表展示全部方案，每项有摘要，链接有效。

**3.4.2 详情页 `/solutions/<slug>/`（发布 5 个，里程碑门槛 ≥4）**
- **功能**：围绕"行业 + Solution"；H2/H3 分块：Block Diagram（配图 + 详细 alt）/ Core Advantages / Recommended BOM List（关键 IC 型号内链到产品页）/ Application Scenarios；正文 ≥800 字；侧边栏相关详情；结尾"distributor" CTA。
- **场景**：行业客户查"BLDC motor solution"，看框图与 BOM，点型号进产品页询价。
- **验收**
  - [ ] 5 个方案详情发布（里程碑门槛 ≥4），URL 独立静态。
  - [ ] 每篇含框图（带 alt）、4 个结构化模块、≥800 字。
  - [ ] BOM 中型号内链有效。
  - [ ] 侧边栏含相关条目；结尾含 CTA。

### 3.5 技术支持 Support

**3.5.1 总览列表页 `/support/`**
- **功能**：选项卡切换 4 分类预览：Selection Guides / Application Notes / Troubleshooting / New Product Reviews；每个 tab 链接到对应**分类索引页**。
- **验收**：4 分类 tab 可切换，文章卡来自 `support.json`，每个 tab/分类标题链接到 3.5.2 分类页。

**3.5.2 分类索引页 `/support/<category>/`（4 个：guides / application-notes / troubleshooting / reviews）**（依 prompt 第87行）
- **功能**：每个分类**独立 URL 与独立页面**，聚合该分类全部文章卡，围绕更具体的分类关键词优化 Title/H1/Description；复用 `support-list` 模板（不新增模板）。
- **验收**
  - [ ] 4 个分类索引页全部发布，URL 形如 `/support/guides/`。
  - [ ] 每页 Title/H1/Description 唯一、含分类关键词。
  - [ ] 列出该分类全部文章且链接有效。

**3.5.3 标签聚合页 `/support/tags/<tag>/`**（依 prompt 第88行）
- **功能**：为每个技术标签（IGBT / AURIX / BLDC motor / CAN bus 等）自动生成聚合页，列出带该标签的全部文章；点文章内/卡片上的标签可达；复用 `support-list` 模板。
- **验收**
  - [ ] 每个出现过的标签都有对应聚合页，URL 形如 `/support/tags/igbt/`。
  - [ ] 文章中的标签可点击跳转到对应聚合页；聚合页文章链接有效（零空链接）。

**3.5.4 详情页 `/support/<category>/<slug>/`（发布 4 个，覆盖各分类）**
- **功能**（tech-detail 模板）：左文章区（max-width 800px、line-height 1.8、段距 24px；H2/H3 左竖线、`<pre><code>` 灰底、`<blockquote>` 左边框）+ 顶部 FAE 作者栏（头像/姓名/日期）；右 Sticky 侧边栏（文章目录 TOC `position:sticky;top:100px` + 相关 PDF 下载 + 向工程师提问表单）；标签（IGBT/AURIX/BLDC/CAN 等，可聚合）；上下文内链；文末"相关文章"3–5 篇；作者关联作者简介页；≥800 字；TechArticle JSON-LD；结尾 CTA。
- **场景**：工程师读《How to select the right Infineon MCU》，通过 TOC 跳转，点标签看同主题文章。
- **验收**
  - [ ] 4 篇支持详情发布（覆盖各分类）。
  - [ ] Sticky TOC 随滚动可见；移动端侧边栏移到文末。
  - [ ] 排版样式（竖线/代码块/引用块）生效；≥800 字。
  - [ ] 上下文内链：每篇 ≥1 个型号内链（指向产品分类表格页）+ ≥1 个概念内链（指向相关文章）。
  - [ ] 标签可点聚合（跳 3.5.3）；相关文章 3–5 篇；作者链接到作者页。
  - [ ] 含 TechArticle JSON-LD。

### 3.6 新闻中心 News

**3.6.1 列表页 `/news/`**
- **功能**：区分 Company News 与 Industry News（不混排），每条独立详情页。
- **验收**：两类分区展示，卡片链接有效。

**3.6.2 详情页 `/news/<slug>/`（发布 4 个）**
- **功能**（news-detail 模板）：Header Banner（全宽背景图/色块叠加 H1 + 日期 + 分类标签，文字带阴影）；**单栏居中**正文（≥800 字，无左侧边栏，聚焦阅读，依 C7）；社交分享栏；底部"Latest News"3 卡（最近 3 篇，排除当前，任意类型）（承担新闻导航/相关职能）；NewsArticle JSON-LD；结尾 CTA。
- **场景**：访客读行业动态（含权威来源引用 + 本站解读），获得富媒体摘要点击。
- **验收**
  - [ ] 4 篇新闻详情发布（含公司新闻与行业动态）。
  - [ ] Banner 叠加标题/日期/标签且可读；单栏居中布局（无左侧边栏）。
  - [ ] 分享栏 + 底部"Latest News"3 卡（最近 3 篇，排除当前，任意类型）齐全（即新闻导航机制）。
  - [ ] 含 NewsArticle JSON-LD；≥800 字。

### 3.7 关于我们 About `/about/`
- **功能**：模块化布局，含公司简介与发展历程、优势（库存深度/技术支持/物流）、服务客户案例、每个产品的报关单展示（信任背书）；自然嵌入 "Infineon authorized distributor / Infineon stock"。
- **场景**：采购经理评估供应商资质与实力。
- **验收**：含全部模块；报关单区块存在；关键词自然嵌入；现代模块化布局。

### 3.8 联系我们 Contact `/contact/`
- **功能**：**独立页 + 独立 `contact` 模板**（共享 nav/footer/breadcrumb/Meta 占位符）；现代网格布局；询价表单（姓名/邮箱/型号/留言）；右侧固定联系浮层。
- **数据来源（条件式，依 prompt 第119行）**：若工作区存在 `contact.txt` → 解析其联系方式并同步进 `site.json.contact`；当前工作区**未发现** `contact.txt`（已 Glob 确认），故回退使用 prompt 指定的 WhatsApp +86 15013702378、WeChat +86 18612518271。联系方式集中存于 `site.json.contact`（供 nav/footer/浮层/contact 页复用），不单设 `contact.json`。
- **场景**：用户提交询价或扫码加 WeChat / 点 WhatsApp。
- **验收**：Contact 为独立模板生成的独立页；联系方式取自 `site.json` 并正确显示；表单字段完整且前端校验；无空链接。

### 3.9 作者简介页（FAE）
- **功能**：FAE 真实姓名、照片(SVG)、技术专长、从业经验；被支持文章作者处链接。
- **验收**：作者页存在且被对应文章引用（E-E-A-T）。

---

## 4. 全局非功能需求

### 4.1 SEO
- **功能**：结构化静态干净 URL（目录 + index.html）；每页唯一 Title + Description + 单一 H1；语义化 H1>H2>H3；面包屑；`sitemap.xml`；`robots.txt`；全图 `alt`（含关键词）；内链网络。
- **验收**
  - [ ] 每页 Title/Description 唯一且含相应关键词。
  - [ ] sitemap.xml 含全部页面且可访问；robots.txt 存在。
  - [ ] 全站零 404、零空链接（铁律#2）。
  - [ ] 所有 `<img>`/内联图含描述性 alt。

### 4.2 GEO（AI 推荐优化）
- **功能**：事实性可引用内容、FAQ 模块、权威表述、Schema.org JSON-LD（Product / TechArticle / NewsArticle / Organization / BreadcrumbList）。
- **验收**：关键页面含对应 JSON-LD 且通过结构校验；FAQ 以问答结构呈现。

### 4.3 响应式与可访问性
- **功能**：CSS Grid + Flex、12 列网格；桌面 ≤1319px 居中、平板 768–1199px、移动 <768px 全屏；交互元素 ≥44px；WCAG AA 对比度；键盘可导航；语义化标签。图片用现代格式（WebP）+ 降级方案（`<picture>`/回退），图标与插图优先 SVG。
- **验收**
  - [ ] 三档断点下布局正确（产品双栏→单栏，技术页侧边栏→文末）。
  - [ ] 关键文本对比度达 AA；可 Tab 导航。
  - [ ] 位图含 WebP + 降级方案；图标/插图为 SVG。

### 4.4 视觉与样式（原生 CSS）
- **功能**：CSS 变量统一；主色科技蓝 `#0072ce`、中性灰 `#f8f9fa`、CTA 橙；圆角 8px/组件 12px；阴影 `0 4px 6px rgba(0,0,0,.07)`；现代极简、留白充足；卡片/按钮 hover 效果；页面切换平滑过渡。纯原生 CSS，无框架。**字体**：现代无衬线，Inter/Roboto（Google Fonts），回退系统字体，加载策略避免 FOIT（`font-display:swap`）。
- **验收**：style.css 用 CSS 变量；色板/圆角/阴影符合规范；hover 与过渡生效；字体为 Inter/Roboto 且 `font-display:swap`。

### 4.5 SVG 资源（全 AI 生成）
- **功能**：产品分类图标（MCU/IGBT/MOSFET/Sensors 等，统一风格）；News/About/Contact 插图与封面；抽象科技背景（电路板纹理/科技线条）用于 Banner；文本/基本形状的 Logo + 右侧英文标语 "Top 8 Electronic Component Distributor in China"；列表页/详情页配套 SVG。
- **验收**：图标风格统一专业；Logo 含标语；每个列表/详情页有匹配 SVG；全部 SVG 格式。

---

## 5. 技术架构（概述，细节见 design.md / architecture.md）

- **构建模型**：`/src/templates/*.html`（占位符）+ `/src/data/*.json`（内容）+ `/src/build.js`（Node）→ 生成最终 HTML 到仓库根。
- **JSON 数据文件**：`site.json`（全局：nav/footer/联系/品牌标语）、`home.json`、`products.json`、`solutions.json`、`support.json`、`news.json`、`about.json`。内容全 AI 生成、**品牌差异化**（防降权）。
- **模板清单（11 套 prompt 点名 + Contact = 12 套）**：
  1. 首页 `home` 2. 产品中心列表 `products-list` 3. 解决方案列表 `solutions-list` 4. 技术支持列表 `support-list` 5. 新闻列表 `news-list` 6. 产品二级分类页 `product-category`（动态列表格） 7. 产品详情 `product-detail` 8. 解决方案详情 `solution-detail` 9. 技术支持详情 `tech-detail` 10. 新闻详情 `news-detail` 11. 关于我们 `about`
  12. 联系我们 `contact`（独立模板，依 §3.8）
  - 所有模板共享 nav/footer/breadcrumb/Meta 占位符；**侧边栏组件**仅用于列表页/产品分类页/方案详情/支持详情（news-detail 与 product-detail 不用，依 §3.1 侧边栏规则）。
  - 分类索引页（3.5.2）与标签聚合页（3.5.3）复用 `support-list` 模板，不新增模板。
- **复用**：换品牌 = 复制仓库 → 改 JSON（+必要模板）→ 重新 build。
- **关键 CSS 类（design.md 细化）**：`.tab-container`（详情 Tab 切换）、`.spec-table`（斑马纹规格表）、`.sticky-sidebar`（技术页 Sticky 侧边栏/TOC）、`.article-content`（长文正文排版）。
- **检查清单（最小覆盖标准）**：
  - `check_list1.md`（模板样式/布局）：须逐项覆盖 12 套模板 × {nav/footer/breadcrumb 一致性、色板/圆角/阴影/字体 token、三档断点响应式、关键 CSS 类生效、SVG 配图、SEO Meta 占位符、对应 JSON-LD、CTA、零空链接}。
  - `check_list2.md`（JSON 数据）：须逐项覆盖 7 个 JSON 文件 × {必填字段完整、内容纯英文、品牌差异化、关键词自然嵌入、数量达里程碑（分类4/详情各4/产品详情8）、字段与模板占位符一一对应、无残留中文/占位符}。

---

## 6. 验证里程碑（首期，核心词 infineon distributor）

| 交付 | 数量 |
|------|------|
| 列表页 home/about/products/solutions/support（+contact/news 列表） | 全部发布 |
| 产品分类页 | 4 篇 |
| 产品详情页 | 每分类 2 篇（共 8） |
| 解决方案详情页 | 5 篇（里程碑门槛 ≥4） |
| 新闻详情页 | 4 篇 |
| 技术支持详情页 | 4 篇 |
| 模板补全 | 12 套全部（11 点名 + contact） |
| JSON 数据 | 7 个独立文件全部 |
| 检查清单 | check_list1.md + check_list2.md |

**里程碑验收**：以上全部发布；用浏览器验证页面样式/布局/响应式符合本 PRD；全站零 404/空链接；模板与 JSON 清单逐项通过。

---

## 7. 交付物清单

1. 网站源文件（templates / data / build.js / assets-CSS / assets-SVG）存到工作区。
2. 生成的静态 HTML 全站（首期页面集）。
3. `sitemap.xml` / `robots.txt`。
4. `check_list1.md` / `check_list2.md`。
5. 文档：`docs/current/` 下 prd / design / architecture / plan / todo_write / dev-status。
6. `CLAUDE.md`（项目规则与文档入口）。
7. （凭证就绪后）GitHub 仓库 + Cloudflare Pages 部署。

---

## 8. 强制项的前置条件 / 范围外

**强制交付项（非可选，仅前置条件未满足时阻塞）**
- GitHub 上传 + Cloudflare 部署：**必做**（铁律#9）。前置条件 = 用户提供 GitHub token / Cloudflare 凭证。凭证就绪后自动执行、不询问。凭证缺失时此项标记为 Blocked（非 Skipped）。
- codex 复检：**必做**且**不可替代/忽略**（prompt 第399行）。codex CLI 已可用（C5），各阶段用 `codex exec -s read-only` 复检，结论交 Claude 裁定，codex 不改代码。

**用替代方案覆盖（专用工具本会话不可用）**
- `spec-document-reviewer` / `plan-document-reviewer` / playwright：用 Claude 自带 `requesting/receiving-code-review`、`verification-before-completion` 及浏览器 skill（browser/ui-test）替代。

**范围外 / 后续**
- 其他品牌网站：基于本模板复制 + 改 JSON，后续迭代。
- 后端/CMS/动态服务：不在本期（纯静态）。

---

## 9. 铁律（贯穿全程，必须满足）

1. 全站纯英文。
2. 不放 404 或空链接。
3. 列表/分类/详情页标题独特、含关键词、准确描述内容。
4. 二级产品分类页 = 该分类全部型号/参数/封装的动态列表格，点型号开详情页。
5. 完全按开发步骤，不遗漏。
6. 每个单元模块完成即审查测试，失败即修复重测，通过才继续；全部单元通过后做集成测试。
7. 每模块用 requesting/receiving-code-review 审查并测试。
8. 用 verification-before-completion 验证所有单元。
9. GitHub 上传 + Cloudflare 部署完全自动化（凭证就绪后），不询问。

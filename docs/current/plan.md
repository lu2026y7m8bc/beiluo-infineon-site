# BeiLuo「Infineon distributor」网站 开发计划 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: 用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 按任务逐个执行。任务用 `- [ ]` 复选框跟踪。
> **本计划为任务级**（阶段/任务/优先级/依赖/TDD/验收）；代码级执行步骤见 `docs/current/todo_write.md`。

**Goal:** 用 HTML + 原生 CSS + 模板/JSON/Node 构建脚本，交付 BeiLuo 纯英文 SEO/GEO 静态站（核心词 infineon distributor），并部署到 GitHub + Cloudflare Pages。

**Architecture:** `/src`（12 模板 + 共享 partial + JSON 数据 + 构建库）→ `node src/build.js` 渲染 → 输出 `/dist`（可部署纯静态站）。换品牌只改 `/src/data/*.json` 重新构建。构建逻辑（渲染/slug/sitemap/schema）用 TDD；模板/内容/样式/SVG 用检查清单 + 浏览器验证。

**Tech Stack:** HTML5、原生 CSS（CSS 变量，无框架）、Vanilla JS（表格筛选/Tab/TOC/导航）、Node.js 构建脚本（零运行时依赖，内置 `node:test` 做单测）。

依据：`docs/current/prd.md`、`docs/current/design.md`（均已定稿）。

---

## Global Constraints（每个任务的隐含要求，逐字取自 PRD/design 铁律）

- **G1** 全站纯英文（页面可见文字与 JSON 内容）。
- **G2** 零 404、零空链接（无 `href="#"` 占位）。
- **G3** 列表/分类/详情页 Title 独特、含关键词、准确描述内容；每页单一 H1。
- **G4** 二级产品分类页 = 动态列规格表，列由分类数据驱动，每列可筛选，点型号开详情页。
- **G5** 设计令牌：`--c-primary:#0072CE`、`--c-bg-alt:#F8F9FA`、`--c-cta:#F5821F`（**CTA 用深色字 `#1A2433`，禁白字**）、`--font-heading:Inter`、`--font-body:Roboto`、`font-display:swap`。
- **G6** 纯原生 CSS，无框架；圆角 8/12px；阴影 `0 4px 6px rgba(0,0,0,.07)`。
- **G7** 响应式：容器 ≤1319px；断点 768 / 1200；交互元素 ≥44px；正文移动 ≥16px；WCAG AA。
- **G8** 7 类 JSON-LD：Organization、WebSite、BreadcrumbList、ItemList、Product、TechArticle、NewsArticle（归属见 design §10）。
- **G9** 面包屑仅非首页；侧边栏规则依 design §3.1（news/product detail 无侧边栏）。
- **G10** 数量：4 分类 / 产品详情 8（2×4）/ solutions 5（门槛≥4）/ news 4 / support 详情 4 / support 分类索引页 4 / 标签聚合页自动 / 模板 12 + 作者页（复用 about）。
- **G11** 全图 `alt`（含关键词）；SVG 图标/插画统一风格，全 AI 生成。
- **G12** SEO：静态干净 URL（目录 + index.html）、sitemap.xml、robots.txt、Meta 优化。

---

## 文件结构（决定任务分解）

```
/src
  build.js                      # 构建编排入口
  /lib
    render.js                   # 模板引擎：占位符/partial/循环/条件
    slugify.js                  # 标题→URL slug
    sitemap.js                  # 生成 sitemap.xml
    robots.js                   # 生成 robots.txt
    schema.js                   # 7 类 JSON-LD 构造器
    pages.js                    # 数据→页面清单映射（含 support 分类/标签页、产品详情、作者页）
    links.js                    # 内链解析 + 死链/空链校验
  /templates                    # 12 套 + partial
    home.html products-list.html product-category.html product-detail.html
    solutions-list.html solution-detail.html support-list.html tech-detail.html
    news-list.html news-detail.html about.html contact.html
    /partials  head-meta.html nav.html footer.html breadcrumb.html
               sidebar.html contact-float.html cta-block.html card.html
  /data
    site.json home.json products.json solutions.json support.json news.json about.json
  /assets
    /css   tokens.css  style.css
    /js    nav.js  table-filter.js  tabs.js  toc.js  form.js
    /svg   /icons /logo /backgrounds /illustrations /badges
/dist                           # 构建输出（可部署）
/tests                          # node:test 单测（构建逻辑）
check_list1.md  check_list2.md  # 模板/JSON 检查清单
```

**Cloudflare Pages**：build command `node src/build.js`，output dir `dist`。

**TDD 适用判定**：构建库 `/src/lib/*`（render/slugify/sitemap/schema/pages/links）= **TDD**；模板/JSON 内容/CSS/SVG/交互 JS = **非 TDD**（检查清单 + 浏览器/ui-test 验证）。

---

## 优先级定义
- **P0** 阻塞性基础（无它后续无法进行）
- **P1** 核心交付（里程碑必需）
- **P2** 增强/收尾（不阻塞核心但里程碑要求）

## 单元审查测试门（铁律 #6/#7，每个任务的完成定义 DoD）

> 适用于**本计划每一个任务**（除纯文档任务）。Phase 9 的整体审查/集成测试**不替代**单元门，且**仅在全部单元门通过后**才开始。

每个任务的 **Definition of Done**：
1. **实现** scope 内内容。
2. **测试**：TDD 任务 → `npm test` 该单元全绿；非 TDD 任务 → 浏览器/检查清单即时自查通过。
3. **审查**：用 `requesting-code-review` + `receiving-code-review` 审查该单元；高风险单元（构建库 T1.\*、动态表格 T5.3/T6.1）额外做 **codex 只读预审**。
4. **修复重测**：失败立即修复并重新测试，**通过后才继续下一个任务**；不跳过、不提前做后续任务。
5. **记录**：发现的遗漏只记为新增 todo 候选，不直接实现。

**每阶段出口门**：该阶段所有任务 DoD 通过 + 阶段级自查，方可进入下一阶段。

---

## 阶段 0：项目脚手架与基线

| ID | 任务 | 优先级 | 依赖 | TDD | 交付/验收 |
|----|------|--------|------|-----|----------|
| T0.1 | 初始化目录结构（/src、/tests、/dist 占位、.gitignore、package.json type=module、README） | P0 | — | 否 | 目录与 package.json 就位；`node --version` 可用 |
| T0.2 | 建立 `node:test` 测试运行脚本（`npm test` → `node --test`） | P0 | T0.1 | 否 | `npm test` 能跑空测试套件并通过 |
| T0.3 | 约定 JSON 数据 schema 草案（字段清单，供模板/校验对齐） | P0 | T0.1 | 否 | `/src/data/*.schema.md` 字段约定文档（与 design 占位符对应） |
| T0.4 | 定义模板↔交互JS 的 **markup 契约**（data 属性/容器/类名约定：`.spec-table`/`data-col`/`.tab-container`/`data-tab`/`.sticky-sidebar`/`[data-toc]`/`form[data-validate]`） | P0 | T0.1 | 否 | `/src/markup-contract.md`；模板与 T6.x 双方据此对齐，解耦但不失约定 |
| T0.5 | **前置编写 `check_list1.md`**（12模板×9维，依 design §5 + PRD §5），作为模板验收**准绳**（先于阶段5，governs 模板交付） | P1 | T0.1, design.md | 否 | 清单覆盖全模板/断点/CSS类/SVG/Meta/JSON-LD/CTA/空链接 |
| T0.6 | **前置编写 `check_list2.md`**（7JSON×7维，依 T0.3 schema + PRD），作为 JSON 验收**准绳**（先于阶段4，governs 内容交付） | P1 | T0.3 | 否 | 清单覆盖字段/纯英文/差异化/关键词/数量/占位符对应/无残留 |

---

## 阶段 1：构建引擎核心（TDD）

| ID | 任务 | 优先级 | 依赖 | TDD | 交付/验收 |
|----|------|--------|------|-----|----------|
| T1.1 | `slugify.js`：标题/型号→小写连字符 slug，去特殊字符，去重 | P0 | T0.2 | **是** | 单测覆盖大小写/空格/特殊字符/中文剔除/重复加序号 |
| T1.2 | `render.js`：占位符 `{{x}}`、嵌套字段、`{{#each}}` 循环、`{{#if}}` 条件、partial 包含、HTML 转义 | P0 | T0.2 | **是** | 单测覆盖各语法 + 缺失字段报错（不静默） |
| T1.3 | `schema.js`：7 类 JSON-LD 构造器（Organization/WebSite/BreadcrumbList/ItemList/Product/TechArticle/NewsArticle） | P0 | T0.2 | **是** | 单测断言各类型 JSON 结构与必填字段；输出合法 JSON |
| T1.4 | `links.js`：收集站内链接，校验目标页存在、无空 `#`、无死链 | P0 | T0.2 | **是** | 单测：给定页面集与链接，正确报出死链/空链（支撑 G2） |
| T1.5 | `sitemap.js` + `robots.js`：由页面清单生成 sitemap.xml / robots.txt | P1 | T1.1 | **是** | 单测：URL 列表→合法 sitemap；robots 含 sitemap 行 |
| T1.6 | `pages.js`：数据→页面清单映射（首页/列表/分类/详情/support 分类页/标签页/产品详情/作者页 URL 与模板绑定，落实 G10） | P0 | T1.1 | **是** | 单测：给定样例 JSON，产出正确 URL 集与计数（4 分类/8 详情/5 方案/4 news/4 support/4 分类页/标签页/作者页） |
| T1.7 | `build.js`：编排（读 data→**校验 data（T4.7 接入）**→渲染→写 dist→生成 sitemap/robots→跑 links 校验，校验失败/死链则非零退出） | P0 | T1.2–T1.6 | 否（集成） | `node src/build.js` 端到端跑通空数据骨架，dist 生成，死链校验生效 |

**阶段 1 出口**：`npm test` 全绿；`node src/build.js` 用占位数据生成可访问骨架站。

---

## 阶段 2：设计系统与全局组件

| ID | 任务 | 优先级 | 依赖 | TDD | 交付/验收 |
|----|------|--------|------|-----|----------|
| T2.1 | `tokens.css`：CSS 变量（颜色/字体/间距/圆角/阴影/层级/断点，逐字对齐 design §2） | P0 | T0.1 | 否 | 变量齐全；色值/字体符合 G5/G6 |
| T2.2 | `style.css` 基线：reset、排版字阶、容器/12 列栅格、按钮/卡片/徽章/表单基础类 | P0 | T2.1 | 否 | 视觉符合 design §2/§3/§4；AA 对比（CTA 深色字） |
| T2.3 | partial `head-meta.html`：Meta/Title/Description/canonical/OG/字体预连接占位 | P0 | T1.2 | 否 | 渲染出唯一 Title/Description（G3）；font-display:swap |
| T2.4 | partial `nav.html` + `nav.js`：固定半透明导航 + Products Mega Menu + 移动抽屉（≥44px） | P0 | T2.2, T0.3（先按 JSON schema 构建，与阶段4 并行）；T4.2 仅 Featured models **最终数据绑定**，缺则回退仅显示分类入口 | 否 | 桌面 Mega/移动抽屉可用；滚动加阴影；键盘可达 |
| T2.5 | partial `footer.html`：4 列页脚 + 联系 + sitemap/robots 链接 | P0 | T2.2 | 否 | 链接有效（G2）；移动堆叠 |
| T2.6 | partial `breadcrumb.html`：面包屑 + BreadcrumbList JSON-LD（仅非首页，G9） | P1 | T1.3,T2.2 | 否 | 路径正确；末项 aria-current；JSON-LD 合法 |
| T2.7 | partial `sidebar.html`、`contact-float.html`、`cta-block.html`、`card.html` | P1 | T2.2 | 否 | 按 design §4 落地；浮层 z-30 不遮挡；CTA 深色字 |

**阶段 2 出口**：全局组件渲染正确，AA 通过，移动端无横向溢出。

---

## 阶段 3：SVG 资源（全 AI 生成，统一风格）

| ID | 任务 | 优先级 | 依赖 | TDD | 交付/验收 |
|----|------|--------|------|-----|----------|
| T3.1 | Logo（BeiLuo 文字 + 标记）+ 右侧标语 "Top 8 Electronic Component Distributor in China" | P0 | T2.1 | 否 | 横排 SVG；移动可省标语 |
| T3.2 | 4 分类图标（MCU/IGBT/MOSFET/Sensors）同族线性 24×24 | P1 | T2.1 | 否 | 风格统一；currentColor |
| T3.3 | 抽象科技背景（Hero/Banner：PCB 走线/节点）低饱和蓝灰 | P1 | T2.1 | 否 | 作底纹不抢内容 |
| T3.4 | 插画/封面（News/About/Contact）+ 信任徽章 + 方案框图模板 | P1 | T2.1 | 否 | 扁平科技风；方案框图带详细 alt（G11） |
| T3.5 | 列表/详情条目配图 SVG（与内容匹配） | P1 | T3.2 | 否 | 每列表/详情有匹配 SVG（PRD 必需项） |

---

## 阶段 4：JSON 数据（内容创作，纯英文，AI 生成，品牌差异化）

| ID | 任务 | 优先级 | 依赖 | TDD | 交付/验收 |
|----|------|--------|------|-----|----------|
| T4.1 | `site.json`：品牌/标语/nav/footer/联系（WhatsApp/WeChat，依 PRD §3.8 条件式） | P0 | T0.3 | 否 | 字段齐全；联系数据可被全局复用 |
| T4.2 | `products.json`：4 分类 + 每分类动态列定义 + 型号行（含 8 个详情型号的完整参数）+ 200–300 字描述 + FAE 点评 + 替代/配套料号 + FAQ | P0 | T0.3 | 否 | 满足 G4/G10；列定义驱动表格；型号字段够生成详情 |
| T4.3 | `solutions.json`：5 个方案（摘要 + 框图引用 + 优势 + BOM 型号内链 + 应用，正文 ≥800 字） | P1 | T0.3 | 否 | 5 个（门槛≥4）；BOM 型号对应 products |
| T4.4 | `support.json`：4 分类 + 4 篇详情（≥800 字）+ 标签 + `authors[]`（name/photo(SVG)/expertise/experience/文章列表）+ 上下文内链（≥1 型号+≥1 概念）+ 相关文章 | P1 | T0.3 | 否 | 满足 §3.5；标签可聚合；**作者 bio 字段齐全，可数据驱动生成 `/about/authors/<slug>/`** |
| T4.5 | `news.json`：4 篇（公司+行业分区，≥800 字，Banner 图引用，分类标签） | P1 | T0.3 | 否 | 分区不混排；字段够 NewsArticle |
| T4.6 | `home.json` + `about.json`：首页 6 模块内容 + 关于（简介/历程/优势/案例/报关单/团队） | P1 | T0.3 | 否 | 首页 6 模块齐；about 含报关单与 FAE 入口 |
| T4.7 | `/src/lib/validate-data.js`：JSON 校验器（依 T0.3 schema + check_list2 维度：字段完整/纯英文/无残留中文/占位/与模板占位符一一对应/数量口径），**接入 `npm test`（单测）与 `build.js`（校验失败→构建非零退出）** | P0 | T0.3, T0.6, T4.1–T4.6 | **是** | validate-data.js 有单测；`npm test` 含该校验；build 阻断非法数据；覆盖 check_list2 全维度 |

---

## 阶段 5：模板实现（12 套 + 作者页）

> 每个模板任务交付：HTML 模板 + 接入 partial + 对应 JSON-LD 占位 + 样式类，渲染后即时浏览器自查。

| ID | 任务 | 优先级 | 依赖 | TDD | 交付/验收 |
|----|------|--------|------|-----|----------|
| T5.1 | `home.html`（Hero/Why/Products/Solutions/Support/News/FinalCTA + Organization+WebSite JSON-LD） | P1 | 阶段2,T4.6,T1.3 | 否 | 6 模块；唯一 Title；JSON-LD 合法 |
| T5.2 | `products-list.html`（4 分类卡 + 行业介绍 + 侧边栏） | P1 | 阶段2,T4.2 | 否 | 4 卡链接有效；标题含关键词 |
| T5.3 | `product-category.html`（200–300字描述/FAE/动态列斑马表/每列筛选/分类CTA/ItemList+Product JSON-LD/侧边栏） | **P1 核心** | 阶段2,T4.2,T1.3（输出 T6.1 所需 markup 钩子；筛选行为运行期由 T6.1 接入，无构建顺序依赖） | 否 | 满足 G4；表格动态列+筛选；点型号→详情 |
| T5.4 | `product-detail.html`（双栏首屏/库存徽章/双CTA/Tab/斑马规格表/FAQ/替代+配套料号/多CTA/Product JSON-LD，无侧边栏） | **P1 核心** | 阶段2,T4.2,T1.3（输出 T6.2 所需 Tab markup 钩子；切换行为运行期接入） | 否 | 满足 design §5.4；Tab/FAQ 交互；料号内链有效 |
| T5.5 | `solutions-list.html` + `solution-detail.html`（框图/BOM内链/≥800字/侧边栏/CTA/BreadcrumbList） | P1 | 阶段2,T4.3 | 否 | 5 详情；BOM 型号内链有效；≥800 字 |
| T5.6 | `support-list.html`（Tab 4 分类 + 链接到分类页）+ 分类索引页 + 标签聚合页（复用本模板） | P1 | 阶段2,T4.4,T1.6 | 否 | 4 分类页 + 标签页生成；零空链接 |
| T5.7 | `tech-detail.html`（作者栏/Sticky TOC/排版/标签/内链/相关文章/TechArticle JSON-LD） | P1 | 阶段2,T4.4,T1.3（输出 T6.3 所需 TOC markup 钩子；高亮行为运行期接入） | 否 | 满足 §3.5.4；Sticky TOC；内链达标 |
| T5.8 | `news-list.html`（公司/行业分区）+ `news-detail.html`（单栏 Banner/分享/底部3卡/NewsArticle，无侧栏） | P1 | 阶段2,T4.5,T1.3 | 否 | 分区不混排；单栏；NewsArticle 合法 |
| T5.9 | `about.html`（简介/历程/优势/案例/报关单/团队）+ 作者页（复用 about，URL `/about/authors/<slug>/`） | P1 | 阶段2,T4.6,T4.4 | 否 | 报关单区块；作者页被 tech-detail 链接 |
| T5.10 | `contact.html`（独立模板：联系网格 + 询价表单 + 浮层） | P1 | 阶段2,T4.1（输出 T6.4 所需表单 markup 钩子；校验行为运行期接入，无构建顺序依赖） | 否 | 联系取自 site.json；表单校验 |

---

## 阶段 6：交互 JS（Vanilla，非 TDD，浏览器验证）

| ID | 任务 | 优先级 | 依赖 | TDD | 交付/验收 |
|----|------|--------|------|-----|----------|
| T6.1 | `table-filter.js`：动态列读取 + 每列筛选（下拉/范围/多选）+ 移动横向滚动 + 首列冻结 | **P1 核心** | T0.4(markup契约), T2.2（消费 T5.3 模板钩子） | 否（浏览器） | 筛选正确；移动可滚；型号链接保留 |
| T6.2 | `tabs.js`：产品详情/支持列表 Tab 切换（role=tablist，键盘可达） | P1 | T0.4, T2.2（消费 T5.4/T5.6 钩子） | 否 | 切换正常；ARIA；移动可滚 |
| T6.3 | `toc.js`：技术详情 Sticky TOC + 当前章节高亮 | P1 | T0.4, T2.2（消费 T5.7 钩子） | 否 | 滚动高亮；移动降级 |
| T6.4 | `form.js`：询价/提问表单前端校验 + 提交态 + 成功提示 | P1 | T0.4, T2.2（消费 T5.10 钩子） | 否 | 必填/邮箱校验；就近错误提示 |

---

## 阶段 7：SEO/GEO 产物接线

| ID | 任务 | 优先级 | 依赖 | TDD | 交付/验收 |
|----|------|--------|------|-----|----------|
| T7.1 | 全页 Meta/Title/Description 接线（唯一、含关键词，G3/G12） | P1 | 阶段5 | 否 | 抽检每页 Title/Description 唯一 |
| T7.2 | 7 类 JSON-LD 全站接线 + 结构校验 | P1 | 阶段5,T1.3 | 否（校验） | 各页含正确 JSON-LD 且校验通过（G8） |
| T7.3 | sitemap.xml / robots.txt 接入构建产物 | P1 | T1.5,阶段5 | 否 | 含全部页面；可访问 |
| T7.4 | GEO：FAQ 结构化 + 权威表述自查（事实可引用） | P2 | 阶段5 | 否 | 关键页含 FAQ；表述事实化 |
| T7.5 | 全图 alt 审计（含关键词，G11） | P1 | 阶段3,阶段5 | 否（脚本+人工） | 无缺 alt 图片 |

---

## 阶段 8：检查清单最终扫查

> 检查清单已在 T0.5/T0.6 **前置编写并贯穿阶段4/5 验收**；本阶段为**最终逐项扫查 + 修复**。

| ID | 任务 | 优先级 | 依赖 | TDD | 交付/验收 |
|----|------|--------|------|-----|----------|
| T8.1 | 按 `check_list1.md`（T0.5）对全部模板逐项最终核对并修复 | P1 | T0.5, 阶段5 | 否 | check_list1 全勾选 |
| T8.2 | 按 `check_list2.md`（T0.6）对全部 JSON 逐项最终核对并修复 | P1 | T0.6, 阶段4 | 否 | check_list2 全勾选 |

---

## 阶段 9：集成测试与验证

> 前置：**所有单元审查测试门（见上）已通过**。本阶段为集成层审查，不替代单元门（铁律 #6）。

| ID | 任务 | 优先级 | 依赖 | TDD | 交付/验收 |
|----|------|--------|------|-----|----------|
| T9.1 | 全量构建 `node src/build.js` + 死链/空链零容忍校验（links.js） | P0 | 全部 | 否 | 构建零错误；零死链（G2） |
| T9.2 | 浏览器/ui-test 验证：响应式三档、Tab/筛选/TOC/表单、AA 对比、≥44px | P1 | T9.1 | 否 | 关键页通过 ui-test |
| T9.3 | `requesting/receiving-code-review` 整体代码审查 + 处理反馈 | P1 | T9.1 | 否 | 审查反馈全处理 |
| T9.4 | `verification-before-completion`：对照 PRD/design 逐功能验证里程碑数量 | P0 | T9.1–T9.3 | 否 | 里程碑数量与功能全达成 |
| T9.5 | Codex 复检（只读）整体产物与文档一致性 | P1 | T9.4 | 否 | Codex 结论交 Claude 裁定 |

---

## 阶段 10：部署（强制项，凭证为前置条件）

| ID | 任务 | 优先级 | 依赖 | TDD | 交付/验收 |
|----|------|--------|------|-----|----------|
| T10.1 | 创建 GitHub 仓库（命名品牌）+ 推送源码与 dist（GitHub REST API token） | P1（Blocked 待 token） | T9.4 | 否 | 仓库创建；代码上传成功 |
| T10.2 | Cloudflare Pages 部署（build `node src/build.js`，output `dist`） | P1（Blocked 待凭证） | T10.1 | 否 | 站点可公网访问 |
| T10.3 | 部署后 smoke 验证（首页/分类/详情/sitemap 可达） | P1 | T10.2 | 否 | 线上关键页 200，sitemap 可访问 |

---

## 阶段 11：收尾与文档

| ID | 任务 | 优先级 | 依赖 | TDD | 交付/验收 |
|----|------|--------|------|-----|----------|
| T11.1 | 更新 `CLAUDE.md`（项目规则/文档入口/AI 边界） | P1 | T9.4 | 否 | 含入口规则与 current 文件列表 |
| T11.2 | 更新 `docs/current/dev-status.md`（状态/已完成/in_progress/pending/测试结果/Codex 结论/下一步） | P1 | 持续 | 否 | dev-status 反映真实状态 |
| T11.3 | `finishing-a-development-branch` 收尾（未完成/未提交/未跑测试防漏） | P1 | T9.4 | 否 | 分支干净合并 |
| T11.4 | memory 更新（关键项目事实/偏好） | P2 | T11.3 | 否 | memory 文件 + 索引更新 |

---

## 关键依赖链（拓扑）

```
T0.* → T1.*(构建库,TDD) → T1.7(build) ─┐
T2.1→T2.2→T2.3..T2.7(全局组件) ────────┤
T3.*(SVG) ─────────────────────────────┤→ 阶段5(模板) ⇄ 阶段6(交互JS) → 阶段7(SEO)
T4.*(JSON 内容) ───────────────────────┘   (模板出 markup 钩子, JS 运行期接入)
                                            → 阶段8(清单) → 阶段9(验证)
                                            → 阶段10(部署,待凭证) → 阶段11(收尾)
```

**模板 ⇄ 交互 JS 关系**：阶段5 模板渲染**不依赖运行时 JS**，仅输出 JS 所需的 markup 钩子（data 属性/容器）；阶段6 的 T6.1/T6.2/T6.3 提供**运行期行为**，二者**可并行开发**，无构建顺序依赖（消除原 T5.x→T6.x 与"阶段5→阶段6"的顺序矛盾）。

**并行机会**：阶段 2（CSS/组件）、阶段 3（SVG）、阶段 4（JSON 内容）在阶段 1 完成后可并行；模板（阶段5）需三者就绪；阶段6 交互 JS 与阶段5 模板并行。

---

## 范围裁定（闭合无主验收项）

- **SC1 位图/WebP（PRD §4.3）**：本期**全部视觉资源为 SVG**（Logo/图标/背景/插画/Banner/框图，见阶段3），**无位图**，故 WebP+`<picture>` 降级在本期**不适用/范围外**；如后续引入位图，再补"位图格式+回退"任务。该裁定使 PRD §4.3"位图含 WebP 降级"验收项闭合（以"无位图"满足）。
- **SC2 页面切换平滑过渡（PRD §4.4 / prompt 第207行）**：纯静态多页站为整页刷新，跨页过渡动画**范围外**；本期仅实现**页面内**微交互过渡（hover/Tab 淡入/手风琴），符合 design §6。View Transitions API 作为可选渐进增强，不纳入里程碑验收。

## Self-Review（写后自检）

- **Spec 覆盖**：PRD 每模块（首页/产品三级/方案/支持含分类+标签+作者/新闻/关于/联系）→ 均有任务（阶段4数据 + 阶段5模板）。SEO/GEO→阶段7。SVG→阶段3。检查清单→阶段8。部署→阶段10。✅ 无缺口。
- **占位符扫描**：无 TBD/TODO；任务均有交付与验收。✅
- **类型/命名一致**：构建库函数名（slugify/render/schema/links/sitemap/pages）跨任务一致；模板名与 design §10/文件结构一致。✅
- **TDD 标注**：构建库与校验脚本=TDD；模板/内容/样式/交互=非 TDD（清单+浏览器）。✅

# Template ↔ Interaction-JS Markup Contract

| 项目 | 内容 |
|------|------|
| 文档版本 | v1.0 |
| 创建日期 | 2026-06-30 |
| 依据 | docs/current/design.md §4.4 / §4.9 / §4.10 / §4.11 |
| 适用阶段 | 阶段 5（模板）输出 HTML；阶段 6（JS）运行时挂载行为 |
| 状态 | 初稿 |

> 本文件是**唯一的**模板↔JS 契约。模板作者与 JS 作者都须遵守此处约定的元素结构、属性名、类名，不得单方面修改。变更须同步更新本文件。

---

## 目录

1. [动态列规格表（table-filter.js / T6.1）](#1-动态列规格表)
2. [Tab（tabs.js / T6.2）](#2-tab)
3. [Sticky TOC（toc.js / T6.3）](#3-sticky-toc)
4. [表单（form.js / T6.4）](#4-表单)

---

## 1. 动态列规格表

**Design 依据**：design.md §4.9（`.spec-table`，动态列 + 每列筛选）、§5.3（产品二级分类页）

### 1.1 DOM 结构

```html
<!-- 外层：负责横向滚动 -->
<div class="spec-table-wrap">

  <!-- 筛选控件挂载点（JS 写入筛选 UI） -->
  <div data-filter-bar></div>

  <!-- 规格表主体 -->
  <table class="spec-table">
    <thead>
      <tr>
        <!-- 型号列：首列冻结 -->
        <th
          class="col-sticky"
          data-col="partNo"
          data-type="text"
          data-filter="select"
          scope="col"
        >Part No.</th>

        <!-- 其余参数列，data-type / data-filter 按列语义填写 -->
        <th
          data-col="series"
          data-type="text"
          data-filter="select"
          scope="col"
        >Series</th>

        <th
          data-col="vce"
          data-type="number"
          data-filter="range"
          scope="col"
        >VCE (V)</th>

        <th
          data-col="ic"
          data-type="number"
          data-filter="range"
          scope="col"
        >IC (A)</th>

        <th
          data-col="package"
          data-type="enum"
          data-filter="multi"
          scope="col"
        >Package</th>

        <th
          data-col="stock"
          data-type="enum"
          data-filter="select"
          scope="col"
        >Stock</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <!-- 型号单元格：首列冻结，值为内链 -->
        <td class="col-sticky" data-col="partNo">
          <a href="/products/igbt/ikw40n120h3/">IKW40N120H3</a>
        </td>
        <td data-col="series">H3</td>
        <td data-col="vce">1200</td>
        <td data-col="ic">40</td>
        <td data-col="package">TO-247</td>
        <!-- 库存徽章由模板输出，JS 不修改徽章内容 -->
        <td data-col="stock">
          <span class="badge badge--stock-in">In Stock</span>
        </td>
      </tr>
      <!-- 更多 <tr> 行 -->
    </tbody>
  </table>
</div>
```

### 1.2 属性规范

| 属性 / 类名 | 载体 | 允许值 | 说明 |
|------------|------|--------|------|
| `class="spec-table-wrap"` | 外层 `<div>` | 固定值 | JS 通过此类定位组件根节点 |
| `class="spec-table"` | `<table>` | 固定值 | JS 在此表格内操作行的显示/隐藏 |
| `data-filter-bar` | `<div>`（在 `.spec-table-wrap` 内，`<table>` 之前） | 无值属性 | JS 在此挂载筛选控件 DOM |
| `data-col="<key>"` | `<th>` 和对应 `<td>` | 驼峰字段键（如 `partNo`、`vce`） | 同一列的 `<th>` 与 `<td>` 必须使用相同 `data-col` 值 |
| `data-type="text\|number\|enum"` | `<th>` | `text` / `number` / `enum` | 决定 JS 如何解析单元格值（字符串比较 / 数值比较 / 枚举匹配） |
| `data-filter="select\|range\|multi"` | `<th>` | `select` / `range` / `multi` | 决定 JS 生成哪种筛选控件；`select`=单选下拉，`range`=最小-最大范围，`multi`=多选复选 |
| `class="col-sticky"` | `<th>` 和 `<td>`（首列） | 固定值 | CSS 负责 `position:sticky;left:0`；JS 不修改此类 |

### 1.3 JS 读取与写入

**JS 读取（只读，不修改）：**
- `.spec-table-wrap` → 定位组件
- `[data-filter-bar]` → 确定控件插入位置
- `.spec-table thead th[data-col]` → 读取列定义（key / type / filter）
- `.spec-table tbody tr td[data-col]` → 读取单元格值用于过滤

**JS 写入（运行时动态）：**
- 向 `[data-filter-bar]` 内插入筛选控件 DOM（下拉/范围/复选）
- 过滤后：对不匹配的 `<tr>` 添加 `hidden` 属性（或 `aria-hidden="true"`）
- 筛选控件 `aria-label` 由 JS 拼接（格式：`"Filter by " + th.textContent`）
- 无匹配时：在 `<tbody>` 后插入 `<tr class="spec-table__empty-row"><td colspan="N">No results found.</td></tr>` 并在清空筛选时移除

**JS 不写入以下内容：**
- 不修改 `data-col`、`data-type`、`data-filter` 属性
- 不修改库存徽章内容
- 不修改首列链接 `href`

### 1.4 降级行为

| 场景 | 行为 |
|------|------|
| JS 未加载 / 禁用 | `[data-filter-bar]` 为空，表格正常展示所有行；`hidden` 属性均未设置，全部行可见 |
| 某列缺少 `data-filter` | JS 跳过该列，不为其生成筛选控件 |
| 分类无型号数据（`<tbody>` 为空） | 表格头部正常渲染；JS 初始化后在 `<tbody>` 中插入空状态行并标注 `data-empty-state` |
| 数值列值为非数字字符串 | JS 解析失败时按 `text` 类型处理，不抛出错误 |

---

## 2. Tab

**Design 依据**：design.md §4.10（`.tab-container`，键盘可达，role=tablist/tab/tabpanel）、§5.4（产品详情 Tab）、§5.7（支持列表 Tab）

### 2.1 DOM 结构

```html
<div class="tab-container">

  <!-- Tab 条 -->
  <div role="tablist" aria-label="Product information tabs">

    <button
      role="tab"
      data-tab="overview"
      aria-selected="true"
      aria-controls="tabpanel-overview"
      id="tab-overview"
    >Overview</button>

    <button
      role="tab"
      data-tab="specs"
      aria-selected="false"
      aria-controls="tabpanel-specs"
      id="tab-specs"
      tabindex="-1"
    >Specifications</button>

    <button
      role="tab"
      data-tab="application"
      aria-selected="false"
      aria-controls="tabpanel-application"
      id="tab-application"
      tabindex="-1"
    >Application</button>

    <button
      role="tab"
      data-tab="documents"
      aria-selected="false"
      aria-controls="tabpanel-documents"
      id="tab-documents"
      tabindex="-1"
    >Documents</button>

  </div><!-- /[role=tablist] -->

  <!-- Tab 面板 -->
  <div
    role="tabpanel"
    data-tabpanel="overview"
    id="tabpanel-overview"
    aria-labelledby="tab-overview"
  >
    <!-- 面板内容：默认不加 hidden，初始可见 -->
  </div>

  <div
    role="tabpanel"
    data-tabpanel="specs"
    id="tabpanel-specs"
    aria-labelledby="tab-specs"
    hidden
  >
    <!-- 面板内容 -->
  </div>

  <div
    role="tabpanel"
    data-tabpanel="application"
    id="tabpanel-application"
    aria-labelledby="tab-application"
    hidden
  >
    <!-- 面板内容 -->
  </div>

  <div
    role="tabpanel"
    data-tabpanel="documents"
    id="tabpanel-documents"
    aria-labelledby="tab-documents"
    hidden
  >
    <!-- 面板内容 -->
  </div>

</div><!-- /.tab-container -->
```

### 2.2 属性规范

| 属性 / 类名 | 载体 | 允许值 | 说明 |
|------------|------|--------|------|
| `class="tab-container"` | 外层 `<div>` | 固定值 | JS 通过此类定位组件根节点 |
| `role="tablist"` | `<div>` | 固定值 | ARIA 角色，JS 识别 Tab 条 |
| `aria-label` | `[role=tablist]` | 描述字符串 | 由模板填写，描述 Tab 组用途 |
| `role="tab"` | `<button>` | 固定值 | ARIA 角色，JS 识别可点击 Tab 项 |
| `data-tab="<id>"` | `[role=tab]` | 不含空格的 ASCII 标识符（如 `overview`、`specs`） | 与对应面板 `data-tabpanel` 值一一对应 |
| `aria-selected` | `[role=tab]` | `"true"` / `"false"` | 模板输出初始值；JS 运行时更新 |
| `aria-controls` | `[role=tab]` | 对应面板的 `id` 值 | 格式固定为 `tabpanel-<id>`，模板与 JS 共同约定 |
| `id` | `[role=tab]` | `tab-<id>` | 与面板 `aria-labelledby` 对应 |
| `tabindex="-1"` | 非活动 `[role=tab]` | `"-1"` | 模板为非默认 Tab 输出；JS 根据选中状态维护 |
| `role="tabpanel"` | `<div>` | 固定值 | ARIA 角色，JS 识别面板容器 |
| `data-tabpanel="<id>"` | `[role=tabpanel]` | 与对应 Tab 的 `data-tab` 值相同 | JS 通过此属性匹配面板 |
| `id` | `[role=tabpanel]` | `tabpanel-<id>` | 与 Tab 按钮 `aria-controls` 对应 |
| `aria-labelledby` | `[role=tabpanel]` | 对应 Tab 按钮的 `id` | 格式固定为 `tab-<id>` |
| `hidden` | 非活动 `[role=tabpanel]` | 无值属性 | 模板为非默认面板输出；JS 运行时切换 |

### 2.3 JS 读取与写入

**JS 读取（只读）：**
- `.tab-container` → 定位组件根节点
- `[role=tablist]` 内所有 `[role=tab]` → 读取 `data-tab` 值和初始 `aria-selected`
- 所有 `[role=tabpanel]` → 读取 `data-tabpanel` 值和初始 `hidden` 状态

**JS 写入（运行时动态）：**

切换 Tab 时，JS 对同一 `.tab-container` 内的所有 Tab/面板执行：

| 目标 | 操作 |
|------|------|
| 非选中 `[role=tab]` | 设 `aria-selected="false"`，设 `tabindex="-1"` |
| 选中 `[role=tab]` | 设 `aria-selected="true"`，移除 `tabindex`（或设为 `"0"`） |
| 非活动 `[role=tabpanel]` | 添加 `hidden` 属性 |
| 活动 `[role=tabpanel]` | 移除 `hidden` 属性 |

**键盘交互（JS 实现）：**
- `←` / `→` 方向键：在 `[role=tablist]` 内循环移动焦点并激活 Tab
- `Home` / `End`：跳到第一/最后一个 Tab
- `Enter` / `Space`：激活当前焦点 Tab（若已在 Tab 上则焦点管理同上）

**JS 不写入以下内容：**
- 不修改面板内部内容
- 不修改 `data-tab`、`data-tabpanel`、`id`、`aria-controls`、`aria-labelledby` 属性

### 2.4 降级行为

| 场景 | 行为 |
|------|------|
| JS 未加载 | 所有面板均按 HTML 初始状态显示（第一个面板无 `hidden`，后续面板有 `hidden`）；用户可见默认 Tab 内容，其余面板不可见。若需无 JS 全显，模板可选择不加 `hidden`（与 JS 团队协商后可调整） |
| 单个 Tab（仅一个面板） | JS 初始化时检测到仅一个 Tab，跳过键盘交互绑定，不报错 |
| `data-tab` 与 `data-tabpanel` 不匹配 | JS 在控制台输出警告，跳过无法匹配的 Tab，不影响其余 Tab 功能 |

---

## 3. Sticky TOC

**Design 依据**：design.md §4.4（`.sticky-sidebar`，`position:sticky`，`top:100px`，z-10）、§5.10（技术支持详情页，沉浸阅读 + Sticky 侧栏）

### 3.1 DOM 结构

```html
<!-- 内容区：文章正文（JS 从此处抓取标题） -->
<main>
  <article class="article-content">
    <!-- 正文 H2 / H3 必须有 id 属性（锚点），供 TOC 链接跳转 -->
    <h2 id="section-igbt-basics">IGBT Basics</h2>
    <p>...</p>
    <h3 id="section-gate-drive">Gate Drive Design</h3>
    <p>...</p>
    <h2 id="section-thermal-management">Thermal Management</h2>
    <p>...</p>
  </article>
</main>

<!-- 侧栏 -->
<aside class="sticky-sidebar">

  <!-- TOC 容器：JS 在此生成目录列表 -->
  <nav data-toc aria-label="Table of contents">
    <!-- JS 生成内容，模板留空或输出占位注释 -->
    <!-- 生成后结构示例：
    <ol>
      <li>
        <a href="#section-igbt-basics">IGBT Basics</a>
        <ol>
          <li><a href="#section-gate-drive">Gate Drive Design</a></li>
        </ol>
      </li>
      <li>
        <a href="#section-thermal-management">Thermal Management</a>
      </li>
    </ol>
    -->
  </nav>

  <!-- 其他侧栏内容（不属于 TOC 契约） -->
  <!-- 如：Related PDF Download / Ask an Engineer 入口 -->

</aside>
```

### 3.2 属性规范

| 属性 / 类名 | 载体 | 允许值 | 说明 |
|------------|------|--------|------|
| `class="article-content"` | `<article>` 或内容区块 | 固定值 | JS 的标题扫描范围；只采集此元素内的 `h2`、`h3` |
| `id="<anchor>"` | `.article-content` 内的 `<h2>`、`<h3>` | 唯一的 slug（如 `section-igbt-basics`） | 模板负责生成并保证同页面唯一；JS 生成 `href="#<anchor>"` 链接 |
| `class="sticky-sidebar"` | `<aside>` | 固定值 | CSS 负责 `position:sticky;top:100px;z-index:10`；JS 不修改此类 |
| `data-toc` | `<nav>`（在 `.sticky-sidebar` 内） | 无值属性 | JS 定位 TOC 挂载点；JS 在此元素内部写入目录 DOM |
| `aria-label` | `[data-toc]` | `"Table of contents"` | 由模板输出，JS 不修改 |
| `class="toc-active"` | JS 写入到 `[data-toc]` 内的 `<a>` 或 `<li>` | 固定值 | 当前可见章节的对应 TOC 条目高亮；CSS 负责样式 |

### 3.3 JS 读取与写入

**JS 读取（只读）：**
- `.article-content` → 定位正文容器
- `.article-content h2, .article-content h3` → 按 DOM 顺序读取，提取 `id` 属性和 `textContent`
- `[data-toc]` → 定位 TOC 挂载点

**JS 写入（运行时动态）：**

| 时机 | 操作 |
|------|------|
| 初始化 | 在 `[data-toc]` 内部生成 `<ol>/<li>/<a>` 目录树（H2 为顶层，H3 嵌套在其 H2 的子 `<ol>` 内） |
| 页面滚动 | 使用 `IntersectionObserver` 监测 `.article-content h2, h3` 的可见性；当前可见的最近标题对应的 TOC 链接添加 `toc-active` 类；其余链接移除 `toc-active` |

**生成 TOC 的 `<a>` 链接格式：**
```html
<a href="#<heading-id>" class="">标题文字</a>
```
初始状态无 `toc-active`；JS 根据滚动位置动态添加/移除。

**JS 不写入以下内容：**
- 不修改 `.article-content` 内的任何内容
- 不修改或生成标题的 `id`
- 不修改 `.sticky-sidebar` 内 TOC 以外的其他侧栏内容

### 3.4 降级行为

| 场景 | 行为 |
|------|------|
| JS 未加载 | `[data-toc]` 为空（或含占位注释），侧栏不显示目录；正文正常渲染，用户仍可通过浏览器书签/锚链接导航 |
| `.article-content` 内无 `h2` 或 `h3` | JS 初始化时检测到空标题列表，`[data-toc]` 保持空，不报错；可选：JS 对 `[data-toc]` 添加 `hidden` 属性隐藏空 TOC 容器 |
| 标题缺少 `id` 属性 | JS 跳过该标题（不生成 TOC 条目）并在控制台输出警告，通知模板作者补充 `id` |
| `IntersectionObserver` 不可用（极旧浏览器） | JS 降级：跳过滚动高亮，TOC 链接仍可点击跳转，无 `toc-active` 高亮效果 |

---

## 4. 表单

**Design 依据**：design.md §4.11（询价/向工程师提问表单，纯前端校验，静态站提交后展示成功提示）

### 4.1 DOM 结构

```html
<form data-validate action="#" method="post" novalidate>

  <!-- 字段组：Name -->
  <div class="form-group">
    <label for="field-name">Name <span aria-hidden="true">*</span></label>
    <input
      type="text"
      id="field-name"
      name="name"
      required
      data-rule="text"
      autocomplete="name"
      aria-required="true"
      aria-describedby="error-name"
      placeholder="Your full name"
    >
    <!-- 错误容器：JS 写入错误文本 -->
    <span id="error-name" data-error-for="name" role="alert" aria-live="polite"></span>
  </div>

  <!-- 字段组：Email -->
  <div class="form-group">
    <label for="field-email">Email <span aria-hidden="true">*</span></label>
    <input
      type="email"
      id="field-email"
      name="email"
      required
      data-rule="email"
      autocomplete="email"
      aria-required="true"
      aria-describedby="error-email"
      placeholder="you@company.com"
    >
    <span id="error-email" data-error-for="email" role="alert" aria-live="polite"></span>
  </div>

  <!-- 字段组：Part No. -->
  <div class="form-group">
    <label for="field-partno">Part No. <span aria-hidden="true">*</span></label>
    <input
      type="text"
      id="field-partno"
      name="partNo"
      required
      data-rule="partno"
      aria-required="true"
      aria-describedby="error-partno"
      placeholder="e.g. IKW40N120H3"
    >
    <span id="error-partno" data-error-for="partNo" role="alert" aria-live="polite"></span>
  </div>

  <!-- 字段组：Message -->
  <div class="form-group">
    <label for="field-message">Message</label>
    <textarea
      id="field-message"
      name="message"
      data-rule="text"
      aria-describedby="error-message"
      rows="4"
      placeholder="Describe your requirement..."
    ></textarea>
    <span id="error-message" data-error-for="message" role="alert" aria-live="polite"></span>
  </div>

  <!-- 提交按钮 -->
  <button type="submit" data-submit class="btn btn--primary">
    Get a Quote
  </button>

  <!-- 成功提示（初始隐藏） -->
  <div data-success hidden role="status" aria-live="polite">
    <p>Thank you! We will contact you within 24 hours.</p>
    <p>Or email us directly at <a href="mailto:sales@beiluo.com">sales@beiluo.com</a>.</p>
  </div>

</form>
```

### 4.2 属性规范

| 属性 / 类名 | 载体 | 允许值 | 说明 |
|------------|------|--------|------|
| `data-validate` | `<form>` | 无值属性 | JS 定位需要挂载校验逻辑的表单；页面可有多个表单，只有带此属性的会被 JS 接管 |
| `novalidate` | `<form>` | 无值属性 | 禁用浏览器原生校验气泡，由 JS 统一控制校验 UI |
| `required` | `<input>`/`<textarea>` | 无值属性 | 模板标记必填；JS 校验时读取此属性 |
| `data-rule="email\|text\|partno"` | `<input>`/`<textarea>` | `email` / `text` / `partno` | JS 依此选择校验规则：`email`=标准邮箱格式、`text`=非空字符串（去除首尾空格）、`partno`=非空且仅允许字母数字连字符 |
| `aria-required="true"` | 必填 `<input>`/`<textarea>` | `"true"` | 语义化声明，JS 不修改 |
| `aria-describedby="<error-id>"` | `<input>`/`<textarea>` | 对应 `[data-error-for]` 元素的 `id` | 值格式固定为 `error-<fieldName>`（`fieldName` 与 `name` 属性值一致） |
| `data-error-for="<fieldName>"` | `<span>`（错误容器） | 对应字段的 `name` 属性值 | JS 通过此属性定位错误展示容器，写入错误文本 |
| `id="error-<fieldName>"` | `[data-error-for]` 的 `<span>` | `error-` 前缀 + 字段 `name` | 与字段 `aria-describedby` 对应 |
| `role="alert"` | `[data-error-for]` | 固定值 | 确保屏幕阅读器在错误写入时立即播报 |
| `aria-live="polite"` | `[data-error-for]` | `"polite"` | 与 `role="alert"` 配合；`polite` 适合表单错误 |
| `data-submit` | `<button type="submit">` | 无值属性 | JS 定位提交按钮，用于提交时设置 `disabled` 和 spinner |
| `data-success` | `<div>` | 无值属性 | JS 定位成功提示容器；初始状态必须有 `hidden` 属性 |
| `hidden` | `[data-success]` | 无值属性 | 模板输出初始状态；JS 在提交成功后移除 |
| `role="status"` | `[data-success]` | 固定值 | 确保屏幕阅读器在成功提示出现时播报 |

### 4.3 `data-rule` 校验规则定义

| 规则值 | 校验逻辑 | 错误提示文案（参考） |
|--------|---------|-----------------|
| `text` | `value.trim().length > 0` | "This field is required." |
| `email` | `text` 规则 + 符合 RFC 5322 简化正则（含 `@` 和有效域名部分） | "Please enter a valid email address." |
| `partno` | `text` 规则 + 仅含字母（A-Z/a-z）、数字、连字符（`-`），长度 2–50 | "Please enter a valid part number (letters, numbers, and hyphens only)." |

> 错误提示文案由 JS 内置，模板不输出；如需国际化，由 JS 读取 `<html lang>` 属性决定语言（当前仅英文）。

### 4.4 JS 读取与写入

**JS 读取（只读）：**
- `[data-validate]` → 定位所有受管理的表单
- `input[required], textarea[required]` → 确定必填字段
- `input[data-rule], textarea[data-rule]` → 读取字段校验规则
- `[data-error-for]` → 读取 `data-error-for` 值以匹配字段
- `[data-submit]` → 定位提交按钮
- `[data-success]` → 定位成功提示容器

**JS 写入（运行时动态）：**

| 事件 | 目标 | 操作 |
|------|------|------|
| 字段失焦（`blur`）或提交时 | 校验不通过的 `<input>`/`<textarea>` | 添加 `is-invalid` 类 |
| 字段失焦（`blur`）或提交时 | 对应 `[data-error-for]` | 写入错误文本 |
| 字段通过校验 | `<input>`/`<textarea>` | 移除 `is-invalid` 类 |
| 字段通过校验 | 对应 `[data-error-for]` | 清空文本内容 |
| 提交中 | `[data-submit]` | 添加 `disabled` 属性，按钮内插入 spinner（`<span class="spinner" aria-hidden="true"></span>`） |
| 提交成功 | `<form>` | 隐藏表单字段区（添加 `hidden` 或 CSS 类） |
| 提交成功 | `[data-success]` | 移除 `hidden` 属性，使成功提示可见 |
| 提交失败（网络错误等） | `[data-submit]` | 移除 `disabled` 和 spinner，恢复可点击状态 |

**JS 不写入以下内容：**
- 不修改 `<label>` 文本
- 不修改 `placeholder` 属性
- 不修改 `data-rule`、`aria-describedby`、`id` 等结构属性

### 4.5 降级行为

| 场景 | 行为 |
|------|------|
| JS 未加载 | `novalidate` 使浏览器不做原生校验气泡，但 `required` 属性仍阻止提交（HTML5 原生行为，无 `novalidate` 时生效）。**模板不应同时加 `novalidate` 与依赖 JS 校验**：若静态站有 fallback action（如 Netlify Forms / mailto:），去掉 `novalidate` 让浏览器原生校验兜底；若无任何 server 端处理，`action="#"` 提交后页面刷新，效果为空操作 |
| `[data-success]` 未在 DOM 中（遗漏） | JS 校验通过提交后，查不到成功容器时直接跳转 `action` URL，不报错 |
| 字段缺少 `data-error-for` 对应的错误容器 | JS 跳过该字段的错误 UI 写入，字段校验逻辑仍执行，控制台输出警告 |
| 字段缺少 `data-rule` | JS 对该字段仅做 `required` 检查（非空），跳过格式校验 |

---

## 附录：契约速查表

| 单元 | 模板必须输出 | JS 写入（动态） | CSS 负责 |
|------|------------|----------------|---------|
| 规格表 | `.spec-table-wrap` > `[data-filter-bar]` + `.spec-table`（含 `data-col`/`data-type`/`data-filter`/`.col-sticky`） | `[data-filter-bar]` 内插入控件；`<tr hidden>` 过滤；空状态行 | `.spec-table-wrap` 横向滚动；`.col-sticky` 首列冻结；斑马纹；行 hover |
| Tab | `.tab-container` > `[role=tablist]` > `[role=tab][data-tab]` + `[role=tabpanel][data-tabpanel]`（含初始 `aria-selected`/`hidden`/`id`/`aria-controls`/`aria-labelledby`） | `aria-selected`；`tabindex`；`hidden` 属性 | Tab 条下划线高亮；面板淡入过渡 |
| Sticky TOC | `.article-content`（含 `h2[id]`/`h3[id]`）；`.sticky-sidebar` > `[data-toc]` | `[data-toc]` 内生成目录树 `<ol>/<li>/<a>`；`.toc-active` 类 | `.sticky-sidebar` position:sticky；`.toc-active` 高亮色 |
| 表单 | `<form data-validate>` > 字段 `[required][data-rule]` + `[data-error-for]` + `[data-submit]` + `[data-success hidden]` | `is-invalid` 类；错误文本；`disabled`/spinner；`[data-success]` `hidden` 切换 | `.is-invalid` 红色边框；`.spinner` 动画；`.form-group` 布局 |

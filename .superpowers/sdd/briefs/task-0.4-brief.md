# Task Brief — T0.4 模板↔交互JS markup 契约

## 背景
模板（阶段5）输出 HTML 的 data 属性/容器/类名钩子；交互 JS（阶段6：table-filter/tabs/toc/form）运行期据此挂载行为。二者解耦，靠本契约对齐。本任务**只写一份契约文档**，不写 HTML/JS/CSS。

## 依据
`docs/current/design.md` §4.9（.spec-table 动态列+每列筛选）、§4.10（.tab-container）、§4.4（.sticky-sidebar / TOC）、§4.11（表单）、§5.3/5.4/5.7/5.10。

## scope：创建 `src/markup-contract.md`
为 4 个交互单元各定义稳定契约：

1. **动态列规格表（table-filter.js / T6.1）**
   - 容器：`.spec-table`（外层 `.spec-table-wrap` 负责横向滚动）
   - 列定义：`<th data-col="<key>" data-type="text|number|enum" data-filter="select|range|multi">`
   - 行：`<tr>`；型号单元格 `<td data-col="partNo"><a href="...">`
   - 首列冻结类：`.col-sticky`
   - 筛选控件挂载点：表头下 `[data-filter-bar]`
2. **Tab（tabs.js / T6.2）**
   - `.tab-container > [role=tablist] > [role=tab][data-tab="<id>"]` + `[role=tabpanel][data-tabpanel="<id>"]`
   - 当前态：`aria-selected="true"` / `[hidden]` 控制面板
3. **Sticky TOC（toc.js / T6.3）**
   - 侧栏 `.sticky-sidebar`，TOC 容器 `[data-toc]`，自动从文章区 `.article-content h2,h3` 生成锚点
   - 当前章节高亮类：`.toc-active`
4. **表单（form.js / T6.4）**
   - `<form data-validate>`，字段 `<input required data-rule="email|text|partno">`，错误容器 `[data-error-for="<fieldName>"]`，提交按钮 `[data-submit]`，成功提示 `[data-success]`

## 每条契约写明
- 元素/属性/类名
- JS 读什么、写什么（状态类、ARIA）
- 无数据/降级行为（如表格无列、表单 JS 未加载仍可提交占位）

## 完成标准（acceptance）
- `src/markup-contract.md` 存在，4 单元契约齐全且与 design §4.9/4.10/4.4/4.11 一致
- 模板作者与 JS 作者都能据此独立实现
- 提交：`git add -A && git commit -m "docs(T0.4): template↔JS markup contract"`

## 约束
- 只写 src/markup-contract.md；不写 HTML/CSS/JS 实现
- 类名/属性与 design 已命名的 `.spec-table/.tab-container/.sticky-sidebar/.article-content` 一致

## 报告
报告写入 `.superpowers/sdd/briefs/task-0.4-report.md`，返回仅 status、commit、一行结论、concerns。

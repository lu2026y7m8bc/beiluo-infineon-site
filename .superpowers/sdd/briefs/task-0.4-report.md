# Task Report — T0.4 Template↔JS Markup Contract

| 项 | 内容 |
|----|------|
| 状态 | DONE |
| Commit | 76c643b |
| 分支 | feat/beiluo-infineon-site |
| 产出文件 | src/markup-contract.md |

## 一行结论

创建 `src/markup-contract.md`，为规格表（table-filter.js）、Tab（tabs.js）、Sticky TOC（toc.js）、表单（form.js）四个交互单元定义完整的模板↔JS 元素/属性/类名契约，与 design.md §4.9/4.10/4.4/4.11 保持一致。

## Concerns

无。所有类名（`.spec-table`、`.spec-table-wrap`、`.col-sticky`、`.tab-container`、`.sticky-sidebar`、`.article-content`、`.toc-active`）均与 design.md 已命名的约定一致；每条契约均包含元素结构、属性规范、JS 读/写说明、降级行为四节内容，满足验收标准。

# Task Brief — T0.3 JSON 数据 schema 草案

## 项目背景
BeiLuo「Infineon distributor」纯英文静态站。构建模型：`/src/data/*.json` → `node src/build.js`（用 `/src/templates`）→ `/dist`。本任务**只产出 schema 约定文档**，不写真实 JSON 数据（那是 T4.x），不写代码。

## 依据（必读，提取字段）
- `docs/current/design.md`（§4 组件、§5 各模板线框 5.1–5.15、§10 JSON-LD 归属）
- `docs/current/prd.md`（§3 功能模块、§5 数据文件清单、§1.3 页数口径表）

## 本任务 scope
为以下 7 个数据文件各写一份字段约定文档（Markdown），放在 `src/data/` 下，命名 `*.schema.md`：

1. `site.schema.md` — 全局：brand{name,slogan}、nav[]、footer{}、contact{whatsapp,wechat}、seo 默认值、logo 引用
2. `home.schema.md` — hero{}、whyChooseUs[]、productsTeaser[]、solutionsTeaser[]、supportTeaser[]、newsTeaser[]、finalCta{}
3. `products.schema.md` — categories[]{slug,name,title,description(200-300w),faeNote,icon,columns[](动态列定义:key,label,type,filter),models[]{partNo,series,params{},package,stock,...详情字段:overview,specs[],applications,documents[],faq[],alternativeParts[],companionParts[]}}
4. `solutions.schema.md` — solutions[]{slug,title,summary,industry,blockDiagram,advantages[],bomList[]{partNo,link},scenarios,body(≥800w),related[]}
5. `support.schema.md` — categories[]{slug,name}、tags[]、authors[]{slug,name,photo,expertise,experience}、articles[]{slug,title,category,tags[],author,body(≥800w),toc[],internalLinks[]{model+concept},relatedArticles[],pdf[]}
6. `news.schema.md` — articles[]{slug,title,type(company/industry),date,bannerImage,categoryTag,body(≥800w),share}
7. `about.schema.md` — intro、history[](timeline)、advantages[]、cases[]、customsDeclarations[](报关单)、team[]/FAE 入口

## 每个 schema 文档要求
- 列出每个字段：名称、类型、必填/可选、含义、与哪个模板占位符/JSON-LD 对应
- 标注数量口径（依 §1.3）：products 4 分类、每分类 ≥2 详情型号(共8)；solutions 5；news 4；support 4 详情 + 4 分类 + authors；
- 标注纯英文、品牌差异化要求
- 字段命名用 camelCase，供 render.js 占位符与 validate-data.js 校验对齐

## 完成标准（acceptance）
- 7 个 `src/data/*.schema.md` 全部存在
- 每个文件字段齐全、与 design §5 对应模板占位符可对齐、含数量口径
- 纯英文或中英说明均可（文档本身可中文注释，但字段名英文）
- 提交：`git add -A && git commit -m "docs(T0.3): JSON data schema drafts (7 files)"`

## 约束
- 不写真实数据 JSON、不写任何 .js 代码、不写模板
- 只在 src/data/ 下创建 *.schema.md

## 报告
报告写入 `.superpowers/sdd/briefs/task-0.3-report.md`，返回仅 status、commit、一行结论、concerns。

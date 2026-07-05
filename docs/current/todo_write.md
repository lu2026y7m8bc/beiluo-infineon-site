# todo_write — BeiLuo「Infineon distributor」执行任务清单

> 来源：`docs/current/plan.md`（已定稿）。本清单只拆解执行任务，不重新设计。按实际执行顺序排列，每个任务含完成标准，仅一个 `in_progress`，其余 `pending`。冲突项已在 prd.md C1–C7 裁定；唯一外部不确定项（部署凭证）拆为"确认"任务。

> **覆盖裁定（design 对照）**：(1) 分页组件 design §4.12 —— 里程碑各列表 ≤5 项不触发分页，**本期延后（YAGNI）**，模板留 hook，数据超单页时启用；(2) `prefers-reduced-motion` 并入 T2.2 实现与 T9.2 验收；(3) 缩略图画廊预留位并入 T5.4。

```json
[
  { "content": "T0.1 初始化项目结构(/src{templates,partials,data,lib,assets/{css,js,svg}},/tests,/dist,package.json type=module,.gitignore,README) 并 git init 建立基线首次提交 — 完成标准：目录与 package.json 就位，git 仓库已初始化且有首次提交，node/npm 可用", "status": "completed" },
  { "content": "T0.2 配置测试运行器(npm test → node --test) — 完成标准：npm test 能运行空测试套件并通过", "status": "completed" },
  { "content": "T0.3 编写 JSON 数据 schema 草案 /src/data/*.schema.md(各文件字段清单,与 design 占位符对应) — 完成标准：site/home/products/solutions/support/news/about 字段约定齐全可作模板/校验对齐依据", "status": "completed" },
  { "content": "T0.4 编写模板↔交互JS 的 markup 契约 /src/markup-contract.md(.spec-table/data-col、.tab-container/data-tab、.sticky-sidebar/[data-toc]、form[data-validate]) — 完成标准：契约文档定义全部 data 属性/容器/类名,供模板与 T6.x 对齐", "status": "completed" },
  { "content": "T0.5 前置编写 check_list1.md(12模板×9维:nav/footer/breadcrumb一致性、令牌、三档断点、关键CSS类、SVG、Meta、JSON-LD、CTA、零空链接) — 完成标准：清单覆盖全模板全维度,作为阶段5模板验收准绳", "status": "completed" },
  { "content": "T0.6 前置编写 check_list2.md(7JSON×7维:字段完整、纯英文、品牌差异化、关键词嵌入、数量口径、占位符一一对应、无残留中文/占位) — 完成标准：清单覆盖全 JSON 全维度,作为阶段4内容验收准绳", "status": "completed" },

  { "content": "T1.1 [TDD] /src/lib/slugify.js(标题/型号→小写连字符slug,去特殊字符,去重加序号) — 完成标准：单测覆盖大小写/空格/特殊字符/非ASCII剔除/重复,npm test 该单元全绿", "status": "completed" },
  { "content": "T1.2 [TDD] /src/lib/render.js(占位符{{x}}/嵌套/{{#each}}/{{#if}}/partial包含/HTML转义,缺失字段报错不静默) — 完成标准：单测覆盖各语法+缺字段抛错,全绿", "status": "completed" },
  { "content": "T1.3 [TDD] /src/lib/schema.js(7类JSON-LD构造器:Organization/WebSite/BreadcrumbList/ItemList/Product/TechArticle/NewsArticle) — 完成标准：单测断言各类型结构与必填字段,输出合法JSON,全绿", "status": "completed" },
  { "content": "T1.4 [TDD] /src/lib/links.js(收集站内链接,校验目标存在、无空#、无死链) — 完成标准：单测对给定页面集正确报死链/空链,全绿(支撑G2零空链接)", "status": "completed" },
  { "content": "T1.5 [TDD] /src/lib/sitemap.js + robots.js(由页面清单生成sitemap.xml/robots.txt) — 完成标准：单测URL列表→合法sitemap,robots含sitemap行,全绿", "status": "completed" },
  { "content": "T1.6 [TDD] /src/lib/pages.js(数据→页面清单映射:首页/列表/分类/详情/support分类页/标签页/产品详情/作者页 URL与模板绑定) — 完成标准：单测对样例JSON产出正确URL集与计数(4分类/8详情/5方案/4news/4support/4分类页/标签页/作者页),全绿", "status": "completed" },
  { "content": "T1.7 /src/build.js 编排(读data→校验data(T4.7接入点)→渲染→写dist→生成sitemap/robots→links校验,失败非零退出) — 完成标准：node src/build.js 用占位数据端到端跑通,dist生成,死链校验生效", "status": "completed" },

  { "content": "T2.1 /src/assets/css/tokens.css(CSS变量:颜色#0072CE/#F8F9FA/CTA#F5821F、字体Inter+Roboto、间距/圆角8-12px/阴影/层级/断点,逐字对齐design§2) — 完成标准：变量齐全且色值/字体符合G5/G6", "status": "completed" },
  { "content": "T2.2 /src/assets/css/style.css 基线(reset、字阶、容器≤1319px、12列栅格、按钮/卡片/徽章/表单基础类,CTA深色字AA,prefers-reduced-motion关闭非必要动画) — 完成标准：视觉符合design§2-4,CTA对比≥4.5:1,移动正文≥16px,reduced-motion生效", "status": "completed" },
  { "content": "T2.3 partial head-meta.html(Title/Description/canonical/OG/字体预连接占位,font-display:swap) — 完成标准：渲染出唯一Title/Description(G3),字体swap生效", "status": "completed" },
  { "content": "T2.4 partial nav.html + nav.js(固定半透明导航+Products Mega Menu(Featured取products前2型号,缺则仅分类入口)+移动抽屉≥44px,滚动加阴影,键盘可达) — 完成标准：桌面Mega/移动抽屉可用,键盘可达,无横向溢出", "status": "completed" },
  { "content": "T2.5 partial footer.html(4列页脚+联系WhatsApp/WeChat+sitemap/robots链接,移动堆叠) — 完成标准：链接全部有效(G2),移动单列", "status": "completed" },
  { "content": "T2.6 partial breadcrumb.html + BreadcrumbList JSON-LD(仅非首页,末项aria-current) — 完成标准：路径正确,JSON-LD合法,首页不含面包屑", "status": "completed" },
  { "content": "T2.7 partial sidebar.html/contact-float.html/cta-block.html/card.html(依design§4,浮层z-30不遮挡,CTA深色字) — 完成标准：组件渲染正确,浮层移动端右下角不遮正文", "status": "completed" },

  { "content": "T3.1 SVG Logo(BeiLuo文字+标记)+右侧标语'Top 8 Electronic Component Distributor in China' — 完成标准：横排SVG,移动可省标语", "status": "completed" },
  { "content": "T3.2 4分类SVG图标(MCU/IGBT/MOSFET/Sensors)同族线性24×24 currentColor — 完成标准：风格统一专业", "status": "completed" },
  { "content": "T3.3 抽象科技背景SVG(Hero/Banner:PCB走线/节点,低饱和蓝灰) — 完成标准：作底纹不抢内容", "status": "completed" },
  { "content": "T3.4 SVG插画/封面(News/About/Contact)+信任徽章+方案框图模板(带详细alt) — 完成标准：扁平科技风统一,框图alt描述完整(G11)", "status": "completed" },
  { "content": "T3.5 列表/详情条目配图SVG(与内容匹配,PRD必需项) — 完成标准：每列表/详情有匹配SVG", "status": "completed" },

  { "content": "T4.1 /src/data/site.json(品牌/标语/nav/footer/联系site.json.contact:WhatsApp+86 15013702378/WeChat+86 18612518271) — 完成标准：字段齐全,联系数据可被全局复用,纯英文", "status": "completed" },
  { "content": "T4.2 /src/data/products.json(4分类+每分类动态列定义+型号行(含8个详情型号完整参数)+200-300字描述+FAE点评+替代/配套料号+FAQ) — 完成标准：满足G4/G10,列定义驱动表格,型号字段够生成详情页,纯英文差异化", "status": "completed" },
  { "content": "T4.3 /src/data/solutions.json(5个方案:摘要+框图引用+优势+BOM型号内链+应用,正文≥800字) — 完成标准：5个(门槛≥4),BOM型号对应products存在,纯英文", "status": "completed" },
  { "content": "T4.4 /src/data/support.json(4分类+4篇详情≥800字+标签+authors[](name/photo/expertise/experience/文章列表)+上下文内链(≥1型号+≥1概念)+相关文章3-5) — 完成标准：满足§3.5,标签可聚合,作者bio可生成作者页,纯英文", "status": "completed" },
  { "content": "T4.5 /src/data/news.json(4篇:公司+行业分区,≥800字,Banner图引用,分类标签) — 完成标准：分区不混排,字段够NewsArticle,纯英文", "status": "completed" },
  { "content": "T4.6 /src/data/home.json + about.json(首页6模块内容+关于:简介/历程/优势/案例/报关单/团队FAE入口) — 完成标准：首页6模块齐,about含报关单区块,纯英文差异化", "status": "completed" },
  { "content": "T4.7 [TDD] /src/lib/validate-data.js(依T0.3 schema+check_list2维度校验,接入npm test与build.js,失败构建非零退出) — 完成标准：validate-data有单测,npm test含校验,build阻断非法数据,覆盖check_list2全维度", "status": "completed" },

  { "content": "T5.1 templates/home.html(Hero/Why/Products/Solutions/Support/News/FinalCTA+Organization+WebSite JSON-LD) — 完成标准：6模块来自home.json,唯一Title形如'Infineon distributor | BeiLuo',JSON-LD合法,渲染后浏览器自查通过", "status": "completed" },
  { "content": "T5.2 templates/products-list.html(4分类卡+行业介绍+侧边栏) — 完成标准：4卡链接有效,标题唯一含关键词", "status": "completed" },
  { "content": "T5.3 [核心] templates/product-category.html(200-300字描述/FAE/动态列斑马表+每列筛选钩子/分类CTA/ItemList+每型号Product JSON-LD/侧边栏) — 完成标准：满足G4,表格动态列,点型号→详情,JSON-LD通过校验,4分类页全生成", "status": "completed" },
  { "content": "T5.4 [核心] templates/product-detail.html(双栏首屏:左产品大图+缩略图画廊预留位/右核心信息栏库存徽章/双CTA/Tab钩子/斑马规格表/FAQ/替代+配套料号轮播/多CTA/Product JSON-LD,无侧边栏) — 完成标准：满足design§5.4(含缩略图画廊预留),料号内链有效,8个详情页全生成", "status": "completed" },
  { "content": "T5.5 templates/solutions-list.html + solution-detail.html(框图/BOM型号内链/≥800字/侧边栏/CTA/BreadcrumbList) — 完成标准：5详情生成,BOM内链有效,≥800字", "status": "completed" },
  { "content": "T5.6 templates/support-list.html(Tab4分类+链接分类页)+分类索引页+标签聚合页(复用本模板) — 完成标准：4分类索引页+各标签页生成,零空链接", "status": "completed" },
  { "content": "T5.7 templates/tech-detail.html(作者栏/Sticky TOC钩子/排版竖线-代码块-引用块/标签/内链/相关文章/TechArticle JSON-LD) — 完成标准：满足§3.5.4,内链达标,4篇生成", "status": "completed" },
  { "content": "T5.8 templates/news-list.html(公司/行业分区)+news-detail.html(单栏Banner/分享/底部3卡/NewsArticle,无侧栏) — 完成标准：分区不混排,单栏,4篇生成,JSON-LD合法", "status": "completed" },
  { "content": "T5.9 templates/about.html(简介/历程/优势/案例/报关单/团队)+作者页(复用about,URL/about/authors/<slug>/) — 完成标准：报关单区块存在,作者页生成且被tech-detail链接", "status": "completed" },
  { "content": "T5.10 templates/contact.html(独立模板:联系网格+询价表单钩子+浮层) — 完成标准：联系取自site.json,表单字段完整,无空链接", "status": "completed" },

  { "content": "T6.1 [核心] /src/assets/js/table-filter.js(动态列读取+每列筛选下拉/范围/多选+移动横向滚动+首列冻结) — 完成标准：浏览器验证筛选正确,移动可滚,型号链接保留", "status": "completed" },
  { "content": "T6.2 /src/assets/js/tabs.js(产品详情/支持列表Tab切换,role=tablist键盘可达) — 完成标准：切换正常,ARIA正确,移动可滚", "status": "completed" },
  { "content": "T6.3 /src/assets/js/toc.js(技术详情Sticky TOC+当前章节高亮) — 完成标准：滚动高亮,移动端降级到文末", "status": "completed" },
  { "content": "T6.4 /src/assets/js/form.js(询价/提问表单前端校验+提交态+成功提示) — 完成标准：必填/邮箱校验,就近错误提示,提交态禁用", "status": "completed" },

  { "content": "T7.1 全页Meta/Title/Description接线(唯一、含关键词) — 完成标准：抽检每页Title/Description唯一不重复", "status": "completed" },
  { "content": "T7.2 7类JSON-LD全站接线+结构校验 — 完成标准：各页含正确JSON-LD且通过结构校验(G8)", "status": "completed" },
  { "content": "T7.3 sitemap.xml/robots.txt接入构建产物 — 完成标准：sitemap含全部页面且可访问,robots存在", "status": "completed" },
  { "content": "T7.4 GEO:FAQ结构化+权威事实表述自查 — 完成标准：关键页含FAQ问答结构,表述事实可引用", "status": "completed" },
  { "content": "T7.5 全图alt审计(含关键词) — 完成标准：脚本+人工核查无缺alt图片(G11)", "status": "completed" },

  { "content": "T8.1 按check_list1.md(T0.5)对全部模板逐项最终扫查并修复 — 完成标准：check_list1全部勾选 — 用户决定：已完成3处系统性根因修复(见dev-status.md §3/§6)，剩余大范围CSS补写等工作暂缓，待后续任务处理，本条暂停(状态改回pending，非新增todo跳过)", "status": "pending" },
  { "content": "T8.2 按check_list2.md(T0.6)对全部JSON逐项最终扫查并修复 — 完成标准：check_list2全部勾选 — 进度：已完成3处最严重问题修复(已提交e95bc7f) + §6.A孤儿字段接线批次(已提交ea42b34) + §6.B/C内容质量与数量配额批次(已提交9162d67) + products.json孤儿字段批次(已提交e4a3afb) + Product JSON-LD绝对URL修复(已提交590dcf0) + 绝对URL回归测试(已提交732165d) + ItemList绝对URL修复+配套测试(待提交，见dev-status.md §3/§6)，其余约13处较小发现记为候选(微信二维码JS/Home Appliance新方案/共享SVG插画)，本条继续保持in_progress(非完成，check_list2远未全部勾选)", "status": "in_progress" },

  { "content": "T9.1 全量构建node src/build.js+死链/空链零容忍校验 — 完成标准：构建零错误,links校验零死链(G2)", "status": "pending" },
  { "content": "T9.2 浏览器/ui-test验证(响应式三档、Tab/筛选/TOC/表单、AA对比、≥44px、prefers-reduced-motion) — 完成标准：关键页通过ui-test无阻塞缺陷,reduced-motion下动画关闭", "status": "pending" },
  { "content": "T9.3 用requesting-code-review+receiving-code-review做整体代码审查并处理反馈 — 完成标准：审查反馈全部处理,无遗漏", "status": "pending" },
  { "content": "T9.4 用verification-before-completion对照PRD/design逐功能验证里程碑数量 — 完成标准：里程碑数量(4分类/8详情/5方案/4news/4support/4分类页)与功能全达成", "status": "pending" },
  { "content": "T9.5 Codex只读复检整体产物与文档一致性 — 完成标准：Codex结论交Claude裁定,问题处理完毕", "status": "pending" },

  { "content": "[确认] 获取部署凭证:GitHub REST API token + Cloudflare 账号/凭证 — 完成标准：用户提供凭证或明确授权方式;未提供则T10.x标记Blocked暂缓(不阻塞前序交付)", "status": "pending" },
  { "content": "T10.1 创建GitHub仓库(品牌命名)+推送源码与dist(GitHub REST API) — 完成标准：仓库创建成功,代码上传成功(依赖确认凭证)", "status": "pending" },
  { "content": "T10.2 Cloudflare Pages部署(build:node src/build.js,output:dist) — 完成标准：站点公网可访问(依赖凭证)", "status": "pending" },
  { "content": "T10.3 部署后smoke验证(首页/分类/详情/sitemap可达) — 完成标准：线上关键页返回200,sitemap可访问", "status": "pending" },

  { "content": "T11.1 更新CLAUDE.md(项目规则/文档入口/AI边界/current文件列表) — 完成标准：含入口规则与有效文件列表", "status": "pending" },
  { "content": "T11.2 更新docs/current/dev-status.md(状态/已完成/in_progress/pending/测试结果/Codex结论/下一步) — 完成标准：dev-status反映真实状态", "status": "pending" },
  { "content": "T11.3 用finishing-a-development-branch收尾(防未完成/未提交/未跑测试/文档未同步) — 完成标准：分支干净,所有文件提交,测试已跑", "status": "pending" },
  { "content": "T11.4 更新memory(关键项目事实/偏好)+索引 — 完成标准：memory文件与MEMORY.md索引更新", "status": "pending" }
]
```

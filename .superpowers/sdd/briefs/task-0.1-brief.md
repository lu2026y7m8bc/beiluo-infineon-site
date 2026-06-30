# Task Brief — T0.1 项目脚手架

## 项目背景
BeiLuo「Infineon distributor」纯英文 SEO/GEO 静态站。技术栈：HTML + 原生 CSS + Vanilla JS + Node.js 构建脚本（零运行时依赖，内置 `node:test`）。源在 `/src`，构建输出 `/dist`。工作目录 `D:\初始\web国外`，已在分支 `feat/beiluo-infineon-site`。

## 已由控制器完成（不要重复）
- `git init` 完成，已在 `feat/beiluo-infineon-site` 分支
- `.gitignore` 已创建（含 node_modules/.worktrees/.codex 等）
- 规划文档 `docs/current/{prd,design,plan,todo_write}.md` 已基线提交

## 本任务 scope（仅以下，不做后续 todo 的内容）
创建项目骨架目录与基础文件：

1. 目录结构（空目录用 `.gitkeep` 占位）：
   ```
   src/templates/partials/
   src/data/
   src/lib/
   src/assets/css/
   src/assets/js/
   src/assets/svg/icons/
   src/assets/svg/logo/
   src/assets/svg/backgrounds/
   src/assets/svg/illustrations/
   src/assets/svg/badges/
   tests/
   dist/        (.gitkeep；dist 为构建产物目录，本期保留可提交)
   ```
2. `package.json`：
   - `"type": "module"`
   - `"name": "beiluo-infineon-site"`, `"version": "0.1.0"`, `"private": true`
   - scripts：`"test": "node --test"`、`"build": "node src/build.js"`
   - 无运行时依赖（dependencies 为空或省略）
3. `README.md`：简述项目（英文）、目录结构、`npm run build` / `npm test` 用法、品牌 BeiLuo / 核心词 infineon distributor。
4. 不创建 build.js、lib、模板、数据等实现文件（那是后续 todo）。

## 完成标准（acceptance）
- 上述目录全部存在（含 .gitkeep）
- `package.json` 合法（`node -e "JSON.parse(require('fs').readFileSync('package.json'))"` 不报错），含 type=module 与 test/build 脚本
- `npm test` 能运行（即使 0 测试也应正常退出，不报错）
- `README.md` 为英文且包含构建/测试说明
- 不含任何后续 todo 的实现文件

## 约束
- 纯英文文件内容（README 英文）
- 不引入第三方依赖
- 提交：`git add -A && git commit -m "chore(T0.1): project scaffold (dirs, package.json, README)"`

## 报告
把完整报告写入 `.superpowers/sdd/briefs/task-0.1-report.md`，返回仅：status（DONE/DONE_WITH_CONCERNS/BLOCKED/NEEDS_CONTEXT）、commit 短哈希、一行测试结论、concerns。

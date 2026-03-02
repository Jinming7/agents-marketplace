# ONES Marketplace - WBS 任务清单

> 基于 commit 9190ceb，所有任务原子化（执行时间<5分钟）

---

## Sprint 1: 核心功能完善

### [TASK-101] 验证数据库连接
- **负责**: Backend Architect
- **依赖**: 无
- **输入**: 数据库连接字符串
- **输出**: 连接测试报告
- **验收**: 成功连接数据库，可查询表结构
- **预估**: 2分钟

### [TASK-102] 检查现有API路由
- **负责**: Backend Architect
- **依赖**: TASK-101
- **输入**: /apps/frontend/src/app/api/* 
- **输出**: API路由清单文档
- **验收**: 列出所有API端点及其功能
- **预估**: 3分钟

### [TASK-103] 验证用户注册API
- **负责**: QA Architect
- **依赖**: TASK-102
- **输入**: POST /api/auth/register
- **输出**: 测试报告（成功/失败用例）
- **验收**: 注册功能正常，返回token
- **预估**: 3分钟

### [TASK-104] 验证用户登录API
- **负责**: QA Architect
- **依赖**: TASK-102
- **输入**: POST /api/auth/login
- **输出**: 测试报告（成功/失败用例）
- **验收**: 登录功能正常，返回token
- **预估**: 3分钟

### [TASK-105] 验证应用列表API
- **负责**: QA Architect
- **依赖**: TASK-102
- **输入**: GET /api/plugins
- **输出**: 测试报告
- **验收**: 返回应用列表，分页正常
- **预估**: 2分钟

### [TASK-106] 验证分类列表API
- **负责**: QA Architect
- **依赖**: TASK-102
- **输入**: GET /api/categories
- **输出**: 测试报告
- **验收**: 返回分类列表
- **预估**: 2分钟

### [TASK-107] 检查首页组件结构
- **负责**: Frontend Architect
- **依赖**: 无
- **输入**: /apps/frontend/src/app/page.tsx
- **输出**: 组件结构文档
- **验收**: 列出所有组件及其职责
- **预估**: 3分钟

### [TASK-108] 检查认证上下文
- **负责**: Frontend Architect
- **依赖**: 无
- **输入**: /apps/frontend/src/context/AuthContext.tsx
- **输出**: 认证流程文档
- **验收**: 说明登录状态管理方式
- **预估**: 3分钟

### [TASK-109] 检查API客户端
- **负责**: Frontend Architect
- **依赖**: 无
- **输入**: /apps/frontend/src/lib/api.ts
- **输出**: API调用方式文档
- **验收**: 列出所有API调用方法
- **预估**: 2分钟

### [TASK-110] 检查数据库Schema
- **负责**: Backend Architect
- **依赖**: TASK-101
- **输入**: /packages/db/src/schema/index.ts
- **输出**: 表结构文档
- **验收**: 列出所有表及其字段
- **预估**: 3分钟

---

## Sprint 2: 功能迭代（待Sprint 1完成后细化）

### [TASK-201] 添加应用评价功能 - API
- **负责**: Backend Architect
- **依赖**: TASK-110
- **状态**: 待细化

### [TASK-202] 添加应用评价功能 - 前端
- **负责**: Frontend Architect
- **依赖**: TASK-201
- **状态**: 待细化

### [TASK-203] 添加应用收藏功能
- **负责**: Frontend + Backend
- **依赖**: TASK-110
- **状态**: 待细化

---

## 执行顺序

```
TASK-101 ─┬─► TASK-102 ─┬─► TASK-103
          │             ├─► TASK-104
          │             ├─► TASK-105
          │             └─► TASK-106
          │
          └─► TASK-110

TASK-107 (并行)
TASK-108 (并行)
TASK-109 (并行)
```

---

## 下一步
1. 执行 TASK-101 验证数据库连接
2. 并行执行 TASK-107/108/109 检查前端结构
3. 根据检查结果细化后续任务
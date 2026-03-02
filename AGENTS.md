# ONES Marketplace - Agent 协作指南

## 项目信息
- **仓库**: https://github.com/Jinming7/agents-marketplace/tree/clean-start
- **当前Commit**: 9190ceb
- **PR**: #2

## 数据库连接
```
postgresql://postgres.nshivvjuaggohjovldfd:[pengjinming123]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

## Agent 团队

### 🎯 Product Master
- **职责**: 输出产品需求，WBS拆解为最小颗粒可完成任务
- **输出**: 需求文档、任务清单、验收标准
- **原则**: 每个任务必须原子化，避免执行超时

### 🎨 Frontend Architect
- **职责**: 前端开发
- **技术**: Next.js 14 + React 18 + TypeScript + Tailwind CSS
- **范围**: apps/frontend/*

### ⚙️ Backend Architect
- **职责**: 后端开发
- **技术**: Express + TypeScript + Drizzle ORM
- **范围**: apps/backend/*, packages/db/*

### 🧪 QA Architect
- **职责**: 测试
- **范围**: 功能测试、集成测试、验收测试

### 🎼 Orchestrator
- **职责**: 调度agent任务，监控执行情况
- **权限**: 可分配任务、协调资源、处理异常

### 🚀 Release DevOps
- **职责**: 推送PR至GitHub
- **流程**: 代码审查 → 合并 → 部署

### 📊 Reporting Agent
- **职责**: 洞察每个agent产出，形成总结汇报
- **输出**: 进度报告、质量报告、风险报告

## 工作流程

```
┌─────────────────────────────────────────────────────────────┐
│                      Orchestrator                            │
│                    (调度 & 监控)                              │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│Product Master │───▶│Frontend/Backend│───▶│  QA Architect │
│  (需求拆解)    │    │   (开发)       │    │   (测试)      │
└───────────────┘    └───────────────┘    └───────────────┘
                                                  │
                                                  ▼
                                         ┌───────────────┐
                                         │Release DevOps │
                                         │  (推送PR)      │
                                         └───────────────┘
                                                  │
                                                  ▼
                                         ┌───────────────┐
                                         │Reporting Agent│
                                         │   (汇报)       │
                                         └───────────────┘
```

## 第一原则

> **所有任务必须基于WBS拆解为最小单元可执行任务，严格避免agent响应超时**

### 任务拆解规则
1. 每个任务执行时间 < 5分钟
2. 任务描述精炼，无歧义
3. 任务间依赖明确
4. 完成一个再开始下一个

### 任务格式
```markdown
### [TASK-XXX] 任务标题
- **负责Agent**: [Agent名称]
- **依赖**: [TASK-YYY]
- **输入**: [具体输入]
- **输出**: [具体输出]
- **验收标准**: [可验证的标准]
```

## 项目结构
```
agents-marketplace/
├── apps/
│   ├── frontend/     # Next.js 前端
│   └── backend/      # Express API
├── packages/
│   ├── db/           # Drizzle ORM
│   ├── shared/       # 共享类型
│   └── ui/           # UI 组件库
├── docs/             # 文档
└── AGENTS.md         # 本文件
```

## 环境变量
```env
DATABASE_URL=postgresql://postgres.nshivvjuaggohjovldfd:[pengjinming123]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 启动命令
```bash
npm install
npm run db:push
npm run dev
```
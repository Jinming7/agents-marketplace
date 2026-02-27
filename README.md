# ONES Marketplace

> 企业级应用商店平台，对标 Atlassian Marketplace

## 项目结构

```
ones-marketplace/
├── apps/
│   ├── frontend/          # Next.js 前端应用
│   └── backend/           # Express API 服务
├── packages/
│   ├── db/                # 数据库层 (Drizzle ORM)
│   ├── shared/            # 共享类型和工具
│   └── ui/                # 共享 UI 组件库
├── docs/                  # 项目文档
└── infra/                 # 基础设施配置
```

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 14 + React 18 + TypeScript + Tailwind CSS |
| 后端 | Express + TypeScript |
| 数据库 | PostgreSQL (Supabase) + Drizzle ORM |
| 部署 | Vercel (Frontend) + Vercel Serverless Functions (API) |

## 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env

# 初始化数据库
npm run db:push

# 启动开发服务器
npm run dev
```

## 环境变量

```env
# 数据库
DATABASE_URL=postgresql://postgres.xxx:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres

# JWT
JWT_SECRET=your-jwt-secret

# 应用
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 文档

- [产品规格](./docs/SPEC.md)
- [API 文档](./docs/API.md)
- [数据库设计](./docs/DATABASE.md)
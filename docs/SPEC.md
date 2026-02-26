# ONES Marketplace 产品规格文档

## 1. 产品概述

### 1.1 产品定位
ONES Marketplace 是一个面向企业的应用商店平台，允许用户发现、安装和管理第三方应用插件。与 Atlassian Marketplace 类似，为 ONES 平台提供扩展生态。

### 1.2 核心用户价值
- **发现价值**: 统一的应用发现入口，支持搜索和分类浏览
- - **安装价值**: 一键安装/卸载应用，即装即用
- **管理价值**: 统一管理已安装应用和个人设置

### 1.3 目标用户
- ONES 平台企业用户
- 需要扩展功能的项目经理和团队成员
- 管理员和普通团队成员

---

## 2. 功能架构

### 2.1 核心功能模块

```
┌─────────────────────────────────────────────────────────┐
│                    ONES Marketplace                      │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   应用发现    │  │   应用安装    │  │   用户中心    │  │
│  │  (Discovery) │  │ (Installation)│  │   (Profile)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────┤
│                      认证系统                             │
│              (Authentication)                            │
└─────────────────────────────────────────────────────────┘
```

### 2.2 功能清单

#### 2.2.1 应用发现模块
| 功能点 | 描述 | 优先级 |
|--------|------|--------|
| 应用列表展示 | 展示所有可用应用卡片 | P0 |
| 搜索功能 | 按名称/描述搜索应用 | P0 |
| 分类筛选 | 按类别筛选应用 | P0 |
| 排序功能 | 按安装量/评分排序 | P1 |
| 应用详情页 | 展示完整应用信息和截图 | P0 |

#### 2.2.2 应用安装模块
| 功能点 | 描述 | 优先级 |
|--------|------|--------|
| 安装应用 | 一键安装应用到用户账户 | P0 |
| 卸载应用 | 从用户账户移除应用 | P0 |
| 已安装列表 | 展示用户已安装的应用 | P0 |

#### 2.2.3 用户中心模块
| 功能点 | 描述 | 优先级 |
|--------|------|--------|
| 用户注册 | 新用户注册账户 | P0 |
| 用户登录 | 已有用户登录 | P0 |
| 个人资料管理 | 修改昵称、头像、个人简介 | P1 |
| 通知设置 | 开启/关闭通知 | P1 |

---

## 3. 页面结构

### 3.1 页面清单
| 页面 | 路由 | 功能 |
|------|------|------|
| 首页 | `/` | 应用列表、搜索、筛选 |
| 应用详情 | `/apps/:id` | 应用详情、安装按钮 |
| 登录 | `/login` | 用户登录 |
| 注册 | `/register` | 用户注册 |
| 我的应用 | `/my-apps` | 已安装应用列表 |
| 个人中心 | `/profile` | 用户资料管理 |

### 3.2 页面流转图
```
                    ┌──────────┐
                    │   首页   │
                    │  /      │
                    └────┬─────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │ 应用详情  │   │   登录   │   │  注册    │
    │ /apps/:id│   │ /login   │   │/register │
    └────┬─────┘   └────┬─────┘   └────┬─────┘
         │              │              │
         └──────────────┴──────────────┘
                         │
                         ▼
                  ┌──────────┐
                  │  我的应用 │
                  │ /my-apps │
                  └────┬─────┘
                         │
                         ▼
                  ┌──────────┐
                  │ 个人中心  │
                  │ /profile │
                  └──────────┘
```

---

## 4. API 接口设计

### 4.1 应用接口

#### 4.1.1 获取应用列表
```
GET /api/apps
Query Parameters:
  - q?: string        // 搜索关键词
  - category?: string // 分类筛选
  - sort?: 'installs' | 'rating' | 'name'  // 排序方式

Response:
{
  "apps": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "category": "string",
      "installs": number,
      "rating": number
    }
  ],
  "total": number
}
```

#### 4.1.2 获取应用详情
```
GET /api/apps/:id

Response:
{
  "id": "string",
  "name": "string",
  "description": "string",
  "category": "string",
  "installs": number,
  "rating": number,
  "version": "string",
  "developer": "string",
  "lastUpdated": "string"  // ISO date
}
```

#### 4.1.3 获取分类列表
```
GET /api/categories

Response:
{
  "categories": string[]
}
```

### 4.2 认证接口

#### 4.2.1 用户注册
```
POST /api/auth/register
Body: { "email": string, "password": string }

Response:
{
  "token": string,
  "user": { "email": string }
}
```

#### 4.2.2 用户登录
```
POST /api/auth/login
Body: { "email": string, "password": string }

Response:
{
  "token": string,
  "user": { "email": string }
}
```

### 4.3 用户接口

#### 4.3.1 获取已安装应用
```
GET /api/user/installations
Headers: { "Authorization": "Bearer <token>" }

Response:
{
  "apps": App[],
  "total": number
}
```

#### 4.3.2 安装应用
```
POST /api/user/installations
Headers: { "Authorization": "Bearer <token>" }
Body: { "appId": string }

Response:
{
  "success": boolean,
  "message": string
}
```

#### 4.3.3 卸载应用
```
DELETE /api/user/installations/:appId
Headers: { "Authorization": "Bearer <token>" }

Response:
{
  "success": boolean,
  "message": string
}
```

#### 4.3.4 获取用户资料
```
GET /api/user/profile
Headers: { "Authorization": "Bearer <token>" }

Response:
{
  "email": string,
  "name": string,
  "avatar"?: string,
  "bio"?: string,
  "notifications": boolean
}
```

#### 4.3.5 更新用户资料
```
PUT /api/user/profile
Headers: { "Authorization": "Bearer <token>" }
Body: { "name"?: string, "bio"?: string, "notifications"?: boolean }

Response:
{
  "success": boolean,
  "message": string
}
```

---

## 5. 数据模型

### 5.1 应用 (App)
```typescript
interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  installs: number;
  rating: number;
  version?: string;
  developer?: string;
  lastUpdated?: string;
  screenshots?: string[];
}
```

### 5.2 用户 (User)
```typescript
interface User {
  email: string;
  password: string;
  name?: string;
  avatar?: string;
  bio?: string;
  notifications: boolean;
}
```

---

## 6. 技术架构

### 6.1 技术栈
| 层级 | 技术 |
|------|------|
| 前端框架 | React 18 + Vite + TypeScript |
| 后端框架 | Express + TypeScript |
| 样式方案 | CSS Modules / Styled Components |
| 部署平台 | Vercel |
| 数据存储 | Supabase (待接入) |

### 6.2 项目结构
```
agents-marketplace/
├── apps/
│   ├── frontend/          # React 前端
│   │   ├── src/
│   │   │   ├── pages/    # 页面组件
│   │   │   ├── components/  # 公共组件
│   │   │   └── App.tsx
│   │   └── package.json
│   └── backend/          # Express 后端
│       ├── src/
│       │   └── index.ts  # API 入口
│       └── package.json
├── package.json
└── vercel.json
```

---

## 7. 验收标准

### 7.1 功能验收
- [ ] 首页正确展示应用列表
- [ ] 搜索功能按名称/描述筛选
- [ ] 分类筛选正常工作
- [ ] 排序功能正常
- [ ] 应用详情页展示完整信息
- [ ] 用户可以注册/登录
- [ ] 已登录用户可以安装/卸载应用
- [ ] 我的应用页面展示已安装列表
- [ ] 个人资料可以修改

### 7.2 UI/UX 验收
- [ ] 页面加载时间 < 2s
- [ ] 响应式布局支持移动端
- [ ] 动画流畅，无明显卡顿

---

## 8. 后续规划

### Phase 2
- [ ] 接入 Supabase 真实数据
- [ ] 应用截图展示
- [ ] 用户评价功能
- [ ] 应用评分系统

### Phase 3
- [ ] 开发者中心（应用提交）
- [ ] 应用审核流程
- [ ] 支付/订阅功能
- [ ] 运营管理后台

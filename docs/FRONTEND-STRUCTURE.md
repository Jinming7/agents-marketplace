# 前端结构文档

## 页面结构

| 路由 | 文件 | 功能 |
|------|------|------|
| `/` | page.tsx | 首页 - 应用列表、搜索、分类筛选 |
| `/apps/[id]` | apps/[id]/page.tsx | 应用详情页 |
| `/category/[slug]` | category/[slug]/page.tsx | 分类页面 |
| `/search` | search/page.tsx | 搜索页面 |
| `/featured` | featured/page.tsx | 精选应用 |
| `/pricing` | pricing/page.tsx | 定价页面 |
| `/developers` | developers/page.tsx | 开发者页面 |
| `/login` | login/page.tsx | 登录页面 |
| `/register` | register/page.tsx | 注册页面 |
| `/my-apps` | my-apps/page.tsx | 我的应用 |
| `/wishlist` | wishlist/page.tsx | 收藏列表 |
| `/settings` | settings/page.tsx | 设置页面 |
| `/about` | about/page.tsx | 关于页面 |
| `/docs` | docs/page.tsx | 文档页面 |
| `/support` | support/page.tsx | 支持页面 |

## 核心模块

### /lib/api.ts
- `appsApi.list()` - 获取应用列表
- `appsApi.get(id)` - 获取应用详情
- `authApi.login()` - 登录
- `authApi.register()` - 注册
- `authApi.logout()` - 登出
- `authApi.me()` - 获取当前用户
- `userApi.getProfile()` - 获取用户资料
- `userApi.getInstallations()` - 获取已安装应用
- `userApi.installApp()` - 安装应用
- `userApi.uninstallApp()` - 卸载应用
- `categoriesApi.list()` - 获取分类列表

### /lib/db.ts
- `getDb()` - 获取数据库连接
- 导出表: `users, marketplaceApps, marketplaceCategories, marketplaceReviews`

### /lib/schema.ts
- 数据库 schema 定义

### /context/AuthContext.tsx
- `AuthProvider` - 认证上下文提供者
- `useAuth()` - 认证 Hook
- 功能: 登录、注册、登出、用户状态管理

## 状态管理
- 使用 React Context (AuthContext)
- Token 存储在 localStorage

## 样式
- Tailwind CSS
- globals.css - 全局样式

## 待完善
1. 应用安装/卸载功能未完全实现
2. 用户资料编辑功能
3. 评价功能
4. 搜索结果高亮
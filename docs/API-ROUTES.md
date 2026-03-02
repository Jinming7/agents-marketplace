# API 路由清单

## 认证 API

### POST /api/auth/register
- **功能**: 用户注册
- **输入**: `{ name, email, password }`
- **输出**: `{ token, user }`

### POST /api/auth/login
- **功能**: 用户登录
- **输入**: `{ email, password }`
- **输出**: `{ token, user }`

### POST /api/auth/logout
- **功能**: 用户登出
- **输入**: 无
- **输出**: `{ success: true }`

### GET /api/auth/me
- **功能**: 获取当前用户
- **输入**: Header: `Authorization: Bearer <token>`
- **输出**: `{ id, name, email, avatar }`

## 应用 API

### GET /api/plugins
- **功能**: 获取应用列表
- **参数**: `?category=&search=&sort=&page=&limit=`
- **输出**: `[{ id, name, description, category, downloads, rating, icon }]`

### GET /api/plugins/[id]
- **功能**: 获取应用详情
- **输出**: `{ id, name, description, category, downloads, rating, icon, version, developer, screenshots, reviews }`

### GET /api/app?id=xxx
- **功能**: 获取应用详情 (query param方式)
- **输出**: 同上

## 分类 API

### GET /api/categories
- **功能**: 获取分类列表
- **输出**: `[{ id, name, slug, icon, count }]`

---

## 状态总结

| API | 状态 | 说明 |
|-----|------|------|
| POST /api/auth/register | ✅ | 已实现 |
| POST /api/auth/login | ✅ | 已实现 |
| POST /api/auth/logout | ✅ | 已实现 |
| GET /api/auth/me | ✅ | 已实现 |
| GET /api/plugins | ✅ | 已实现 |
| GET /api/plugins/[id] | ✅ | 已实现 |
| GET /api/app | ✅ | 已实现 |
| GET /api/categories | ✅ | 已实现 |

## 待实现 API

| API | 优先级 | 说明 |
|-----|--------|------|
| GET /api/user/installations | P0 | 获取已安装应用 |
| POST /api/user/installations | P0 | 安装应用 |
| DELETE /api/user/installations/[id] | P0 | 卸载应用 |
| GET /api/user/profile | P1 | 获取用户资料 |
| PUT /api/user/profile | P1 | 更新用户资料 |
| POST /api/reviews | P2 | 提交评价 |
| GET /api/reviews?appId=xxx | P2 | 获取应用评价 |
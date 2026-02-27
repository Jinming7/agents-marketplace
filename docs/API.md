# API 文档

## 基础信息

- **Base URL**: `http://localhost:3001/api` (开发环境)
- **认证方式**: Bearer Token (JWT)

## 认证接口

### POST /auth/register
注册新用户

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "用户名"
}
```

**Response:**
```json
{
  "token": "jwt-token",
  "user": {
    "email": "user@example.com",
    "name": "用户名"
  }
}
```

### POST /auth/login
用户登录

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token",
  "user": {
    "email": "user@example.com",
    "name": "用户名"
  }
}
```

---

## 应用接口

### GET /apps
获取应用列表

**Query Parameters:**
- `q` (optional): 搜索关键词
- `category` (optional): 分类筛选
- `sort` (optional): 排序方式 (installs|rating|name)

**Response:**
```json
{
  "apps": [
    {
      "id": "uuid",
      "name": "应用名称",
      "description": "应用描述",
      "category": "分类",
      "installs": 1000,
      "rating": 4.5
    }
  ],
  "total": 10
}
```

### GET /apps/categories
获取分类列表

**Response:**
```json
{
  "categories": ["项目管理", "自动化", "开发工具"]
}
```

### GET /apps/:id
获取应用详情

**Response:**
```json
{
  "id": "uuid",
  "name": "应用名称",
  "description": "应用描述",
  "category": "分类",
  "installs": 1000,
  "rating": 4.5,
  "version": "1.0.0",
  "developer": "开发者",
  "lastUpdated": "2024-01-01T00:00:00Z"
}
```

---

## 用户接口

> 需要在 Header 中携带 Authorization: Bearer <token>

### GET /user/installations
获取已安装应用

**Response:**
```json
{
  "apps": ["app-id-1", "app-id-2"],
  "total": 2
}
```

### POST /user/installations
安装应用

**Request Body:**
```json
{
  "appId": "app-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "App installed successfully"
}
```

### DELETE /user/installations/:appId
卸载应用

**Response:**
```json
{
  "success": true,
  "message": "App uninstalled successfully"
}
```

### GET /user/profile
获取用户资料

**Response:**
```json
{
  "email": "user@example.com",
  "name": "用户名",
  "notifications": true
}
```

### PUT /user/profile
更新用户资料

**Request Body:**
```json
{
  "name": "新用户名",
  "notifications": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```
# ONES Marketplace 功能清单

> 最后更新: 2026-02-27

---

## 📋 总览

| 模块 | 功能数 | 完成度 |
|------|--------|--------|
| 应用发现 | 8 | 100% |
| 应用安装 | 3 | 100% |
| 用户认证 | 2 | 100% |
| 用户中心 | 4 | 100% |
| **总计** | **17** | **100%** |

---

## 🎯 功能详情

### 1. 应用发现 (Discovery)

#### 1.1 应用列表展示
- **描述**: 在首页展示所有可用应用的卡片列表
- **状态**: ✅ 已完成
- **前端页面**: `Home.tsx`
- **后端API**: `GET /api/apps`

#### 1.2 搜索功能
- **描述**: 根据应用名称和描述进行全文搜索
- **状态**: ✅ 已完成
- **前端组件**: Search input in `Home.tsx`
- **后端API**: `GET /api/apps?q=<keyword>`
- **筛选逻辑**: 
  - 模糊匹配 name 字段
  - 模糊匹配 description 字段

#### 1.3 分类筛选
- **描述**: 按应用类别筛选应用列表
- **状态**: ✅ 已完成
- **前端组件**: Category filter in `Home.tsx`
- **后端API**: `GET /api/apps?category=<category>`
- **可选分类**: Collaboration, Productivity, Knowledge, Development, Design

#### 1.4 排序功能
- **描述**: 按安装量或评分排序应用
- **状态**: ✅ 已完成
- **前端组件**: Sort dropdown in `Home.tsx`
- **后端API**: `GET /api/apps?sort=installs|rating`
- **排序规则**:
  - `installs`: 安装量降序
  - `rating`: 评分降序

#### 1.5 应用详情页
- **描述**: 展示单个应用的完整信息
- **状态**: ✅ 已完成
- **前端页面**: `AppDetail.tsx`
- **后端API**: `GET /api/apps/:id`
- **展示信息**:
  - 应用名称
  - 应用描述
  - 分类
  - 安装量
  - 评分
  - 版本号
  - 开发者
  - 最后更新时间

#### 1.6 分类列表获取
- **描述**: 获取所有可用分类
- **状态**: ✅ 已完成
- **后端API**: `GET /api/categories`

#### 1.7 应用详情增强
- **描述**: 在详情页展示定价、功能亮点、兼容性
- **状态**: ✅ 已完成
- **前端页面**: `AppDetail.tsx`
- **新增字段**: pricing, highlights, compatibility

#### 1.8 应用评价展示
- **描述**: 展示应用的用户评价和评分分布
- **状态**: ✅ 已完成
- **前端页面**: `AppDetail.tsx`
- **后端API**: `GET /api/apps/:id/reviews`
- **展示信息**:
  - 用户评价列表
  - 平均评分
  - 评分分布柱状图

---

### 2. 应用安装 (Installation)

#### 2.1 安装应用
- **描述**: 将应用安装到用户账户
- **状态**: ✅ 已完成
- **前端组件**: Install button in `AppDetail.tsx`
- **后端API**: `POST /api/user/installations`
- **前置条件**: 用户已登录
- **参数**: `{ "appId": "string" }`

#### 2.2 卸载应用
- **描述**: 从用户账户移除已安装应用
- **状态**: ✅ 已完成
- **前端组件**: Uninstall button in `AppDetail.tsx` / `MyApps.tsx`
- **后端API**: `DELETE /api/user/installations/:appId`
- **前置条件**: 用户已登录

#### 2.3 已安装列表
- **描述**: 展示用户已安装的所有应用
- **状态**: ✅ 已完成
- **前端页面**: `MyApps.tsx`
- **后端API**: `GET /api/user/installations`
- **前置条件**: 用户已登录
- **展示信息**: 应用卡片列表（与首页一致）

---

### 3. 用户认证 (Authentication)

#### 3.1 用户注册
- **描述**: 新用户创建账户
- **状态**: ✅ 已完成
- **前端页面**: `Register.tsx`
- **后端API**: `POST /api/auth/register`
- **参数**: `{ "email": string, "password": string }`
- **返回**: `{ "token": string, "user": { "email": string } }`
- **验证规则**:
  - 邮箱格式验证
  - 密码非空

#### 3.2 用户登录
- **描述**: 已注册用户登录
- **状态**: ✅ 已完成
- **前端页面**: `Login.tsx`
- **后端API**: `POST /api/auth/login`
- **参数**: `{ "email": string, "password": string }`
- **返回**: `{ "token": string, "user": { "email": string } }`
- **错误处理**: 邮箱或密码错误时返回 401

---

### 4. 用户中心 (User Profile)

#### 4.1 获取用户资料
- **描述**: 获取当前登录用户的信息
- **状态**: ✅ 已完成
- **前端组件**: Profile data in `Profile.tsx`
- **后端API**: `GET /api/user/profile`
- **Headers**: `{ "Authorization": "Bearer <token>" }`
- **返回字段**:
  ```json
  {
    "email": "string",
    "name": "string",
    "avatar"?: "string",
    "bio"?: "string",
    "notifications": boolean
  }
  ```

#### 4.2 更新用户资料
- **描述**: 修改用户的个人资料
- **状态**: ✅ 已完成
- **前端组件**: Profile form in `Profile.tsx`
- **后端API**: `PUT /api/user/profile`
- **Headers**: `{ "Authorization": "Bearer <token>" }`
- **可选参数**: `{ "name"?: string, "bio"?: string, "notifications"?: boolean }`

#### 4.3 通知设置
- **描述**: 开启或关闭通知
- **状态**: ✅ 已完成
- **前端组件**: Notification toggle in `Profile.tsx`
- **实现方式**: 集成在更新用户资料 API 中

#### 4.4 认证状态管理
- **描述**: 前端管理用户登录状态
- **状态**: ✅ 已完成
- **实现**: localStorage 存储 token，前端 Context API 管理登录状态

---

## 🔄 功能依赖关系

```
用户注册 ──┬──> 用户登录 ──┬──> 安装应用
           │               ├──> 卸载应用
           │               ├──> 已安装列表
           │               ├──> 获取用户资料
           │               └──> 更新用户资料
           │
           └──> 认证状态管理
```

---

## 📝 待实现功能 (Phase 2)

### 应用详情增强
- [x] 截图展示 (Screenshots Gallery) - 已添加数据结构
- [x] 用户评价 (Reviews) - 已完成
- [x] 评分系统 (Rating System) - 已完成

### 数据层
- [ ] 接入 Supabase 真实数据库
- [ ] 数据迁移脚本

### 用户体验
- [ ] Loading 状态优化
- [ ] Error handling 优化
- [ ] 空状态展示

---

## 📝 待实现功能 (Phase 3)

### 开发者中心
- [ ] 开发者注册/认证
- [ ] 应用提交表单
- [ ] 应用管理后台

### 运营功能
- [ ] 应用审核流程
- [ ] 支付/订阅系统
- [ ] 运营管理后台
- [ ] 数据统计分析

---

## 🧪 测试用例摘要

| 功能 | 测试场景 | 预期结果 |
|------|----------|----------|
| 搜索 | 输入 "Slack" | 返回包含 Slack 的结果 |
| 筛选 | 选择 "Productivity" | 仅显示 Productivity 分类应用 |
| 排序 | 选择 "installs" | 按安装量降序排列 |
| 注册 | 输入新邮箱和密码 | 注册成功，返回 token |
| 登录 | 输入正确邮箱密码 | 登录成功，返回 token |
| 安装 | 已登录状态点击安装 | 应用添加到已安装列表 |
| 卸载 | 已登录状态点击卸载 | 应用从已安装列表移除 |
| 资料 | 修改用户昵称 | 资料更新成功 |

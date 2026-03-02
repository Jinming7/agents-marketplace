# 数据库设计

## 数据库连接

```
postgresql://postgres.nshivvjuaggohjovldfd:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

## 表结构

### users (用户表)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| email | text | 邮箱 (唯一) |
| password | text | 密码 (加密) |
| name | text | 用户名 |
| avatar | text | 头像 URL |
| bio | text | 个人简介 |
| notifications | boolean | 通知开关 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

### apps (应用表)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| name | text | 应用名称 |
| description | text | 应用描述 |
| category | text | 分类 |
| icon | text | 图标 |
| version | text | 版本号 |
| developer | text | 开发者 |
| installs | integer | 安装量 |
| rating | decimal | 评分 |
| screenshots | text[] | 截图 URLs |
| last_updated | timestamp | 最后更新 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

### installations (安装记录表)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| user_id | uuid | 用户 ID (外键) |
| app_id | uuid | 应用 ID (外键) |
| installed_at | timestamp | 安装时间 |

### categories (分类表)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| name | text | 分类名称 |
| slug | text | URL slug |
| description | text | 分类描述 |
| icon | text | 图标 |
| sort_order | integer | 排序 |

### reviews (评价表)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| user_id | uuid | 用户 ID (外键) |
| app_id | uuid | 应用 ID (外键) |
| rating | integer | 评分 (1-5) |
| title | text | 标题 |
| content | text | 内容 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

### audit_logs (审计日志表)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| user_id | uuid | 用户 ID (外键) |
| action | text | 操作类型 |
| entity_type | text | 实体类型 |
| entity_id | uuid | 实体 ID |
| details | text | 详情 (JSON) |
| ip_address | text | IP 地址 |
| user_agent | text | User Agent |
| created_at | timestamp | 创建时间 |

## 索引

```sql
-- 用户邮箱索引
CREATE INDEX idx_users_email ON users(email);

-- 应用分类索引
CREATE INDEX idx_apps_category ON apps(category);

-- 安装记录用户索引
CREATE INDEX idx_installations_user_id ON installations(user_id);

-- 安装记录应用索引
CREATE INDEX idx_installations_app_id ON installations(app_id);

-- 审计日志用户索引
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);

-- 审计日志时间索引
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```
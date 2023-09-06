# Backend for Time-track app

https://time-tracker-4oaa.onrender.com

doc : https://github.com/koyablue/time-tracker-development-doc

# TimeTracker Backend API documentation

This is a documentation for the backend API of TimeTracker.

# URL

https://koyablue.github.io/time-tracker-api-doc/

# Built with

![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

# DB architecture

## Tables and relations

### Users

**users**
| id | email | password | created_at | updated_at |
| --- | --- | --- | --- | --- |
| | | | | |

#### Relations

- has many
  - WorkSessions
- has one
  - UserEmailVerification

### UserEmailVerification

**user_email_verifications**
| id | email | verification_token | created_at | updated_at |
| --- | --- | --- | --- | --- |
| | | | | |

#### Relations

- belongs to
  - User

### WorkSession

**work_sessions**
| id | user_id | start_at | end_at |
| --- | --- | --- | --- |
| | | | |

#### Relations

- has many
  - Tabs
- belongs to
  - User

### Tab

**tabs**
| id | work_session_id | name | display_order | created_at | updated_at |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

#### Relations

- belongs to
  - WorkSession
- has many
  - Lists

### List

**lists**
| id | tab_id | name | display_order | created_at | updated_at |
| --- | --- | --- | --- | --- | ---|
| | | | | | |

#### Relations

- has many
  - Tasks
- belongs to
  - Tabs

### Task

**tasks**
| id | list_id | display_order | name | description | total_time | created_at | updated_at |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

#### Relations

- belongs to
  - List

### Template

**templates**
| id | user_id | name | created_at | updated_at |
| --- | --- | --- | --- | --- |
| | | | |

#### Relations

- has many
  - Tabs
- belongs to
  - User

### TemplateTab

**template_tabs**
| id | template_id | name | display_order | created_at | updated_at |
| --- | --- | --- | --- | --- | --- |
| | | | | |

#### Relations

- has many
  - TemplateLists
- belongs to
  - Template

### TemplateList

**template_lists**
| id | template_tab_id | name | display_order | created_at | updated_at |
| --- | --- | --- | --- | --- | --- |
| | | | | |

#### Relations

- belongs to
  - TemplateTab

## ER diagram

![time_tracker drawio (3)](https://github.com/koyablue/time-management-proj-memo/assets/43242050/8d9da067-7be1-4037-add7-0ea518bb9631)

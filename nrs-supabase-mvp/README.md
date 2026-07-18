# NRS 疼痛評估系統（兩小時 MVP）

這是一個純 HTML、CSS、JavaScript 與 Supabase 製作的教學雛形。

## 您只需要修改一個檔案

完成 Supabase 設定後，開啟 `js/config.js`，貼上：

```javascript
const SUPABASE_URL = "您的 Project URL";
const SUPABASE_PUBLISHABLE_KEY = "您的 publishable key";
```

完整操作步驟請閱讀 `操作教學.md`。

## 頁面

- `index.html`：登入
- `assessment.html`：新增疼痛評估
- `records.html`：使用者查看自己的紀錄
- `admin.html`：管理員查看全部紀錄

## 注意

這是課程雛形。未經機構資安、個資與醫療法規審查前，請勿儲存真實病人資料。

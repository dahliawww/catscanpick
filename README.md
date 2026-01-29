# 🐱 Cats Can Pick

🌐 **Live Demo**: [https://catscanpick.com/](https://catscanpick.com/)

一個專為貓奴設計的貓罐頭比較工具，整合熱量計算機與營養成分比較表，幫助你為毛孩選擇最適合的罐頭。

## ✨ 功能特色

### 🔍 搜尋與篩選

- **即時搜尋**：支援產地、品牌、名稱、口味的關鍵字搜尋
- **多重篩選**：
  - 產地篩選（Made Filter）
  - 品牌篩選（Brand Filter）
  - 重量篩選（Weight Filter）
- **組合篩選**：可同時使用多個篩選條件，快速找到符合需求的罐頭

### 📊 營養成分比較表

- **完整營養資訊**：顯示每款貓罐頭的詳細營養成分
  - 重量 (g)
  - 熱量 (kcal)
  - 水分含量 (ml) - 自動計算
  - 蛋白質 (%)
  - 脂肪 (%)
  - 纖維 (%)
  - 灰分 (%)
  - 鈣 (Ca %)
  - 磷 (P %)
  - 牛磺酸 (mg)
- **多欄位排序**：點擊表頭即可排序，支援升冪/降冪切換
  - 重量、熱量、水分、蛋白質、脂肪、鈣、磷等
- **響應式設計**：完美適配手機與桌面版

### 💡 熱量計算機

- **RER 計算**：基礎代謝率 (Resting Energy Requirement)
  - 公式：RER = 70 × 體重(kg)^0.75
- **DER 調整**：根據貓咪狀態調整每日能量需求
  - 幼貓 (<4個月): DER 2.5-3.0
  - 幼貓 (4-12個月): DER 2.0-2.5
  - 成貓 (絕育): DER 1.2-1.4
  - 成貓 (未絕育): DER 1.4-1.6
  - 懷孕: DER 1.6-2.0
  - 哺乳: DER 2.0-6.0
  - 減重: DER 0.8-1.0
  - 增重: DER 1.2-1.8
- **水分需求計算**：每公斤體重 × 40-60 毫升
- **本地儲存**：自動記住上次輸入的體重

### 🎨 UI/UX 特色

- **可愛動畫**：
  - 背景貓爪印隨滾動動態顯示
  - 貓咪動畫（CatAni、CatTail）增加趣味性
  - 流暢的過渡動畫
- **現代化設計**：
  - 使用 Tailwind CSS 打造美觀介面
  - 自訂品牌色彩系統
  - 響應式佈局，完美適配各種裝置
- **載入狀態**：優雅的 Loading 動畫

## 🛠️ 技術

- **前端框架**: React 19.2.0
- **語言**: TypeScript 5.9.3
- **建置工具**: Vite 7.2.4
- **樣式**: Tailwind CSS 3.4.13
- **圖標**: Heroicons 2.2.0
- **代碼品質**: ESLint + TypeScript ESLint

## 📁 項目結構

```
catscanpick/
├── public/
│   ├── data/
│   │   └── catcan-list1.csv      # 貓罐頭資料
│   ├── fonts/                     # 自訂字體
│   └── *.svg                      # SVG 圖標
├── src/
│   ├── components/
│   │   ├── BrandFilter.tsx        # 品牌篩選器
│   │   ├── CalorieCalculator.tsx  # 熱量計算機
│   │   ├── CatAni.tsx             # 動畫貓咪組件
│   │   ├── CatCanTable.tsx        # 資料表格
│   │   ├── CatPawBackground.tsx   # 背景貓爪動畫
│   │   ├── CatTail.tsx            # 貓尾巴動畫
│   │   ├── Loading.tsx            # 載入動畫
│   │   ├── MadeFilter.tsx         # 產地篩選器
│   │   ├── SearchBar.tsx          # 搜尋欄
│   │   └── WeightFilter.tsx       # 重量篩選器
│   ├── Icon/
│   │   └── CatPawIcon.tsx         # 貓爪圖標
│   ├── partical/
│   │   ├── Header.tsx             # 頁首
│   │   └── Footer.tsx             # 頁尾
│   ├── App.tsx                    # 主應用組件
│   ├── main.tsx                   # 應用入口
│   ├── types.ts                   # TypeScript 類型定義
│   └── index.css                  # 全域樣式
└── package.json
```

## 🚀 開發指南

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

開發伺服器將在 `http://localhost:5173` 啟動（或顯示的端口）

### 建置生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

### 代碼檢查

```bash
npm run lint
```

## 📊 資料管理

### 資料來源

- 資料儲存在 `public/data/catcan-list1.csv`
- CSV 格式，支援引號內包含逗號的複雜資料

### 資料更新流程

1. 在 Google Sheet 編輯資料
2. 透過 Apps Script 執行 `uploadCsvToGitHub()` 上傳到 GitHub
3. GitHub 觸發自動部署，網站自動更新

### 資料欄位

- `made`: 產地
- `brand`: 品牌
- `name`: 名稱
- `flaver`: 口味
- `weight_g`: 重量 (g)
- `kcal`: 熱量 (kcal)
- `protein`: 蛋白質 (%)
- `fat`: 脂肪 (%)
- `fiber`: 纖維 (%)
- `ash`: 灰分 (%)
- `moisture`: 水分 (%)
- `moistureContent`: 水分含量 (ml) - 自動計算
- `Ca`: 鈣 (%)
- `P`: 磷 (%)
- `taurine`: 牛磺酸 (mg/kg)
- `taurineContent`: 牛磺酸含量 (mg)

## ⚠️ 注意事項

> **資料說明**：如果某欄位顯示為空白（"-"），表示網路上無公開資訊或罐頭上未標示該資訊。

## 🎯 核心功能說明

### 熱量計算原理

- **RER (Resting Energy Requirement)**: 基礎代謝率
  - 用於計算貓咪在休息狀態下所需的熱量
  - 公式：`RER = 70 × 體重(kg)^0.75`
- **DER (Daily Energy Requirement)**: 每日能量需求
  - 根據貓咪的年齡、狀態、活動量等因素調整
  - 實際所需熱量 = RER × DER 係數

### 水分含量計算

- 自動計算：`水分含量(ml) = 水分(%) × 重量(g) ÷ 100`
- 幫助評估罐頭的水分補充效果

## 📝 License

此專案為個人專案，僅供學習與參考使用。

## 👤 聯絡資訊

如有問題或建議，歡迎透過以下方式聯絡：

- Email: bobomom2022@gmail.com

---

Made with ❤️ for cat lovers 🐾

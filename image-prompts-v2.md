# image-prompts-v2.md — ひだまり介護ステーション（redesign/v2）

生成ツール: `node C:/Users/unear/openai-image-generator/generate-image.js "PROMPT" out.png --project=hanamizuki-care --purpose=<slug> --size=<size> --quality=medium`
生成元 PNG は `images/_source/<slug>.png`、配信用は `images/<slug>.webp`（Pillow, quality 82, 長辺 1600px 以下）。
すべて AI によるコンセプトイメージ（架空のポートフォリオサンプル）。ロゴ・文字を画像内に入れない。

## Style Anchor（全プロンプト共通の前置き）

```
Warm editorial lifestyle photograph taken in a small Japanese home-care facility, soft golden late-afternoon sunlight streaming through large windows, natural light only, 35mm lens look, shallow depth of field, gentle warm color grading with cream, soft orange and light wood tones, calm and kind atmosphere, photorealistic, Japanese people, no text, no logos, no watermarks.
```

## 画像一覧（11枚・すべて生成済み）

| # | slug | 用途 / 配置場所 | サイズ | 生成 |
|---|------|----------------|--------|------|
| 1 | hero-living | ヒーロー コラージュ1（メイン）／選ばれる理由 04 | 1536x1024 | 済 |
| 2 | hero-garden | ヒーロー コラージュ2 | 1536x1024 | 済 |
| 3 | tea-hands | ヒーロー コラージュ3（円形） | 1024x1024 | 済 |
| 4 | team | 法人案内 メイン写真 | 1536x1024 | 済 |
| 5 | service-visit | サービス紹介「訪問介護」カード | 1536x1024 | 済 |
| 6 | service-day | サービス紹介「通所介護（デイサービス）」カード | 1536x1024 | 済 |
| 7 | service-plan | サービス紹介「居宅介護支援」カード | 1536x1024 | 済 |
| 8 | album | 選ばれる理由 01（タイムライン） | 1536x1024 | 済 |
| 9 | lunch | 選ばれる理由 03（タイムライン） | 1536x1024 | 済 |
| 10 | exterior | 施設案内 外観写真 | 1536x1024 | 済 |
| 11 | bokeh | ご利用者様の声 セクション背景 | 1536x1024 | 済 |

既存画像の継続使用: `images/hero.jpg`（選ばれる理由 02）、`images/about.jpg`（法人案内 サブ写真）。削除していない。

## プロンプト全文（Style Anchor の後に続ける英文）

### 1. hero-living（1536x1024）
An elderly Japanese woman in her 80s laughing joyfully on a sofa in a bright living room, a female caregiver in her 30s wearing a light apron sits beside her smiling, both looking at each other, cream curtains, potted plants, wooden floor.

### 2. hero-garden（1536x1024）
A female caregiver gently supporting an elderly Japanese man as he walks along a small garden path, sunlight through trees, flowers along the path, he wears a cardigan and smiles, slow peaceful walk.

### 3. tea-hands（1024x1024）
Close-up of an elderly person's wrinkled hands holding a warm cup of Japanese green tea, a younger caregiver's hands gently cupped around them, sunlit wooden table, steam rising, very soft focus background.

### 4. team（1536x1024）
A friendly team of four Japanese care staff, two women and two men of mixed ages, wearing matching light orange polo shirts and aprons, standing together smiling warmly in front of a bright wooden facility entrance, relaxed group portrait.

### 5. service-visit（1536x1024）
A kind female nurse in her 30s in a pale uniform gently checking the blood pressure of an elderly Japanese man seated in an armchair at his home, both relaxed and smiling softly, sunlight on the tatami, warm living room.

### 6. service-day（1536x1024）
A bright day-service room where six elderly Japanese people sit in a circle on chairs doing light seated arm-stretching exercise led by a young staff member in a polo shirt, big windows, wooden floor, cheerful.

### 7. service-plan（1536x1024）
A care manager in her 40s listening attentively to an elderly Japanese woman at a wooden table, holding her hands gently, a notebook nearby, warm sunlight, close trusting moment.

### 8. album（1536x1024）
A female caregiver in an apron and an elderly Japanese woman sitting side by side by a sunny window looking at an old photo album together, smiling, the caregiver pointing at a photo, warm nostalgic moment.

### 9. lunch（1536x1024）
Shared lunch at a long wooden table in a day-service dining room, four elderly Japanese people and a staff member eating Japanese set meals together, laughing, sunlight across the table, bowls and chopsticks.

### 10. exterior（1536x1024）
Exterior of a warm one-story wooden Japanese care facility with a gentle sloped roof, flower beds with orange and yellow flowers in front, a wooden entrance ramp with handrail, blue sky, late afternoon light.

### 11. bokeh（1536x1024）
Abstract background: soft dreamy bokeh of golden sunlight filtering through green leaves, out of focus, warm cream and orange tones, gentle, no subject, suitable as a website background.

## 再生成時のメモ
- OpenAI 側の `input-images per min: 5` レート制限に当たりやすい。1枚ずつ 20〜30 秒空けて実行する。
- 高品質ツールで再生成する場合も Style Anchor は必ず前置きし、同じ光（午後の自然光）・同じレンズ感で統一する。
- `tea-hands` は正方形（円形トリミングで使用）。他は 3:2 で `object-fit: cover`。

# ملاذ شاهين — موقع خطاط وفنان الخط العربي

موقع شخصي من صفحة واحدة، بالعربية بالكامل واتجاه RTL، مبني كـ **رحلة بين ثماني غرف** داخل عالم ثلاثي الأبعاد واحد مستمر — لا كأقسام تظهر بالتلاشي فوق صفحة مسطّحة.

## الفكرة

خلف الصفحة كلها لوحة **WebGL** واحدة ثابتة: حقل من الحروف العربية موزّع في عمق حقيقي، والتمرير يحرّك الكاميرا **٥٨ وحدة** داخل هذا العمق. كل غرفة شبه شفافة، فتبقى داخل المكان نفسه طوال التصفّح.

ولكل غرفة فكرتها التفاعلية المستقلة، لا نمط واحد مكرّر:

| # | الغرفة | الفكرة |
|---|---|---|
| ٠١ | الاسم | الاسم على مستوى بمنظور، يُكشف بقناع حبر، ويذوب إلى الخلف عند المغادرة |
| ٠٢ | المرسم | ستارة تُرفع فوق العالم ثلاثي الأبعاد، وشبكة تحريرية غير متماثلة |
| ٠٣ | المعرض | الأعمال معلّقة على **أسطوانة ثلاثية الأبعاد** تُسحب وتُدار |
| ٠٤ | الخدمات | لا بطاقات — صفوف طباعية كبيرة مع لوحة معاينة تتبع المؤشر |
| ٠٥ | الرحلة | أربع مراحل مكدّسة في **العمق**، تندفع من الضباب وتمرّ من فوقك |
| ٠٦ | الأصوات | الغرفة المضيئة الوحيدة، بأسهم تنقّل يدوية |
| ٠٧ | الحبر | ورقة مؤطّرة تكتب عليها فعليًا، مع حفظ الرسم كصورة PNG |
| ٠٨ | التوقيع | زخرفة تُرسم بنفسها، وأزرار مغناطيسية |

## التقنيات

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Three.js** + **React Three Fiber** — حقل الحروف ثلاثي الأبعاد
- **Framer Motion** — الحركة المرتبطة بالتمرير
- خط **ثمانية (Thmanyah)** بعائلاته الثلاث عبر `@dawod/thmanyah-font-web`

## التشغيل

```bash
npm install
npm run dev
```

ثم افتح <http://localhost:3000>.

```bash
npm run build   # بناء الإنتاج
npm run lint    # الفحص
```

## تعديل المحتوى

كل النصوص والأعمال والخدمات وبيانات التواصل في ملف واحد:

```
src/lib/data.ts
```

> **تنبيه:** الأعمال والآراء والسير الذاتية في هذا الملف **محتوى تجريبي** وليست أعمالًا حقيقية — استبدلها قبل النشر. بيانات التواصل (واتساب والبريد) حقيقية.

## إمكانية الوصول

- يحترم `prefers-reduced-motion`: تُعطَّل اللوحة ثلاثية الأبعاد وأثر الحبر والحركات
- على الأجهزة اللمسية تُبسَّط المؤثرات، ويبقى التمرير ممكنًا فوق لوحة الكتابة
- تباين الألوان مضبوط: نص عاجي على رمادي دافئ داكن

---

## NEON HORIZON — 80's landing page (`/retro`)

A second, fully independent site lives in this repo: an English, left-to-right,
synthwave/80's one-page landing at **<http://localhost:3000/retro>**.

It does not share styling, fonts, layout or content with the calligraphy site.
Both are served by the same Next.js app through **multiple root layouts**:

```
src/app/
  (calligraphy)/layout.tsx   ← <html lang="ar" dir="rtl">, globals.css
  (calligraphy)/page.tsx     → /
  (retro)/layout.tsx         ← <html lang="en" dir="ltr">, retro.css
  (retro)/retro/page.tsx     → /retro
  globals.css                ← calligraphy theme
  retro.css                  ← retro theme
src/retro/                   ← everything the retro site needs
  data.ts                    ← all of its copy, in one file
  components/
```

### Sections

`Home` · `About` · `Process` · `Portfolio` · `Blog` · `Services` — one page,
anchor navigation, sticky nav with a scroll-position indicator.

### The 80's look

Every effect is CSS — no images, no canvas, no 3D:

- animated sunset grid horizon, banded sun and starfield
- CRT scanlines, vignette and a drifting refresh band
- chrome-gradient display type (Orbitron) over neon glow
- CRT terminal panel (VT323) for the About copy
- hover-only RGB glitch fringing on project titles
- infinite marquee ticker

### Editing content

Everything — brand, copy, projects, posts, prices, contact details — is in:

```
src/retro/data.ts
```

> **Note:** the studio name, projects, posts and prices in that file are
> **placeholder content** invented for the build. Replace them before publishing.
> Project and blog cards are deliberately not links yet — there are no case
> study or post pages behind them.

### Making it the front door

To serve the retro site at `/` instead, move the page and give the other site a
path of its own:

```
src/app/(retro)/retro/page.tsx      → src/app/(retro)/page.tsx
src/app/(calligraphy)/page.tsx      → src/app/(calligraphy)/calligraphy/page.tsx
```

Nothing else needs to change — each group keeps its own root layout.

### Accessibility

- `prefers-reduced-motion` disables the grid, ticker, starfield, CRT sweep and
  glitch effects
- skip link, visible cyan focus rings, `aria-current` on the active nav item
- portfolio filters are real `aria-pressed` buttons with a polite live region

---

## لوحة التحكم (`/dashboard`)

لوحة تحرير عربية لكامل محتوى موقع الخط، على **<http://localhost:3000/dashboard>**.

### ما الذي يمكن تعديله

| التبويب | المحتوى |
|---|---|
| الفنان | الاسم، الصفة، العبارة، الموقع، الفلسفة، **صورة الفنان**، النبذة، التخصصات، الأرقام |
| الأعمال | إضافة/حذف/إعادة ترتيب، عنوان وتصنيف وسنة ووصف و**صورة لكل عمل** |
| الخدمات | إضافة/حذف/ترتيب |
| الرحلة | مراحل العمل |
| الآراء | شهادات العملاء |
| التواصل | واتساب، البريد، روابط التواصل |
| نصوص الأقسام | أسماء الغرف والعناوين وأزرار كل قسم |
| الموقع | عنوان ووصف الموقع في نتائج البحث |

### الدخول

الحسابان المصرّح لهما مضبوطان في `ADMIN_EMAILS`. لتغيير كلمة المرور:

```bash
npm run set-password
```

يكتب البرنامج بصمة `scrypt` في `data/auth.json` ويطبع القيمة نفسها لتضعها في
`ADMIN_PASSWORD_HASH` عند النشر. **كلمة المرور نفسها لا تُكتب في أي ملف.**

`data/auth.json` مستثنى من git لأنه بيانات اعتماد وهذا المستودع عام.

### نسيت كلمة المرور

`/dashboard/forgot` يرسل رابطًا **للبريدين المصرّح لهما فقط**؛ أي بريد آخر يحصل
على نفس الرسالة المحايدة دون إرسال شيء. الرابط صالح ٣٠ دقيقة و**لمرة واحدة**
(موقّع بمفتاح مشتق من بصمة كلمة المرور الحالية، فتغييرها يُبطل كل الروابط).

بدون `RESEND_API_KEY` يُطبع الرابط في سجل الخادم — كافٍ للعمل محليًا. للإرسال
الحقيقي أضف:

```
RESEND_API_KEY=...
RESET_EMAIL_FROM=you@yourdomain.com
```

### أين يُحفظ المحتوى

```
data/content.json     ← المحتوى (يُرفع مع git ليصل إلى الاستضافة)
public/uploads/       ← الصور المرفوعة (تُرفع مع git أيضًا)
data/auth.json        ← بصمة كلمة المرور (لا يُرفع)
```

`src/lib/content/defaults.ts` هو الأساس، و`content.json` يُدمج فوقه — فلو نقص
حقل من ملف محفوظ قديم يبقى الموقع كاملًا.

### ⚠️ التخزين عند النشر

نظام الملفات على Vercel **للقراءة فقط**، لذلك لن تُحفظ التعديلات هناك. اللوحة
تكتشف ذلك وتعرض تنبيهًا بدل ادّعاء نجاح الحفظ.

سير العمل الحالي: **حرّر محليًا ← احفظ ← `git commit` و`push` ← تُنشر تلقائيًا.**

للتحرير مباشرة من الموقع المنشور يلزم مخزن دائم (Vercel Blob أو KV أو قاعدة
بيانات). نقطة التبديل الوحيدة هي `isWritable` و`getContent`/`saveContent` في
`src/lib/content/store.ts`.

import type { SiteContent } from "./types";

/**
 * The content the site ships with. `data/content.json` is layered on top of
 * this, so a half-filled or older saved file still renders a complete site.
 */
export const defaultContent: SiteContent = {
  artist: {
    name: "ملاذ شاهين",
    title: "خطاط وفنان الخط العربي",
    tagline: "الحبر، الصبر، وشكل الكلمة المقدسة.",
    location: "يعمل مع عملاء حول العالم",
    philosophy:
      "الخط ليس زخرفة. إنه نفَسٌ مرئي — والسكتة بين الحروف لا تقل أهمية عن الحبر ذاته.",
    bio: [
      "تدرّبت لأكثر من عقد على يد أساتذة خطّي الثلث والديواني، قبل أن أجد صوتي الخاص — صوتٌ يقف بين انضباط التقليد وحرّية التكوين المعاصر.",
      "كل عمل يبدأ بالطريقة ذاتها: ورقة بيضاء، قلمٌ مبريّ حديثًا، وعبارة تُقلَّب مرارًا حتى يتكشّف إيقاعها في الخط.",
    ],
    specialties: [
      "خط الثلث والديواني الكلاسيكي",
      "خط المناسبات والأعراس",
      "خط الهوية والعلامات التجارية",
      "التذهيب وتشميع الورق",
    ],
    portrait: "",
  },

  stats: [
    { id: "years", value: "١٤", label: "سنة خبرة" },
    { id: "scripts", value: "٤", label: "خطوط متقنة" },
    { id: "works", value: "٢٦٠", label: "عملًا مسلَّمًا" },
    { id: "countries", value: "١٤", label: "دولة" },
  ],

  works: [
    {
      id: "wedding-nour-omar",
      title: "نور وعمر",
      category: "أعراس",
      year: "٢٠٢٥",
      description:
        "مجموعة زفاف كاملة بخط الديواني المذهّب، من بطاقة الحفظ وحتى لفافة القسم الأخيرة.",
      image: "",
    },
    {
      id: "brand-almadina",
      title: "بيت الشاي — المدينة",
      category: "هوية تجارية",
      year: "٢٠٢٤",
      description:
        "شعار حديث متجذّر في خط الثلث الكلاسيكي، مُهيّأ للّافتات والتغليف والقوائم المنقوشة.",
      image: "",
    },
    {
      id: "invitation-royal-gala",
      title: "دعوة الحفل الملكي",
      category: "دعوات",
      year: "٢٠٢٤",
      description:
        "مجموعة دعوات مكتوبة يدويًا مع ختم شمعي وأوراق مُعرّقة لحفل استقبال رسمي.",
      image: "",
    },
    {
      id: "envelopes-hadeel",
      title: "مجموعة هديل",
      category: "كتابة المظاريف",
      year: "٢٠٢٣",
      description:
        "١٥٠ مظروفًا مكتوبًا يدويًا بخط الديواني الجلي المتدفّق، لكل منها لمسة فردية خفيّة.",
      image: "",
    },
    {
      id: "certificate-honor",
      title: "شهادة التكريم",
      category: "شهادات",
      year: "٢٠٢٣",
      description:
        "شهادة احتفالية لجائزة فنية وطنية، محاطة بزخرفة هندسية مرسومة يدويًا.",
      image: "",
    },
    {
      id: "editorial-quiet-ink",
      title: "حبر هادئ — سلسلة تحريرية",
      category: "أعمال تحريرية",
      year: "٢٠٢٢",
      description: "ست صفحات لمجلة تصميم تستكشف الفراغ في خط النسخ المعاصر.",
      image: "",
    },
    {
      id: "bespoke-family-tree",
      title: "لفافة شجرة العائلة",
      category: "قطع خاصة",
      year: "٢٠٢٢",
      description:
        "لفافة تراثية بتكليف خاص تتتبّع أربعة أجيال، بخط الرقعة وحدود مذهّبة.",
      image: "",
    },
    {
      id: "lettering-poem-of-return",
      title: "قصيدة العودة",
      category: "خط مخصص",
      year: "٢٠٢١",
      description: "بيت شعر مؤطّر بخط ديواني حر معبّر، مكوّن من سطر واحد متصل.",
      image: "",
    },
  ],

  services: [
    {
      id: "wedding",
      title: "قرطاسية الأعراس",
      description:
        "مجموعات الدعوات، وكتابة المظاريف، وخطط الطاولات، ولفافات القسم — مصمَّمة كمجموعة متكاملة.",
    },
    {
      id: "live",
      title: "الخط الحي في المناسبات",
      description:
        "كتابة الأسماء المباشرة وهدايا الضيوف التذكارية في الأعراس والحفلات والفعاليات المؤسسية.",
    },
    {
      id: "brand",
      title: "خط الهوية والشعارات",
      description:
        "شعارات وأنظمة خط مخصّصة للعلامات التي تريد أصالة تراثية بلمسة معاصرة.",
    },
    {
      id: "custom",
      title: "الأعمال الخاصة",
      description:
        "أبيات مؤطّرة، وأسماء عائلية، وقطع شخصية — أي عبارة، تتحوّل إلى عمل فني دائم.",
    },
    {
      id: "engraving",
      title: "الحفر",
      description:
        "تصاميم خطية مُهيّأة للحفر على الخشب والمعدن والحجر كقطع تذكارية.",
    },
    {
      id: "workshops",
      title: "ورش العمل",
      description:
        "جلسات خاصة وجماعية صغيرة للتعرّف على أدوات ووضعيات وخطوط الخط العربي.",
    },
  ],

  process: [
    {
      id: "sketch",
      step: "٠١",
      title: "التخطيط",
      description:
        "تكوينات أولية بالرصاص، لاختبار الإيقاع والتوازن قبل أن تلمس نقطة حبر واحدة الورقة.",
    },
    {
      id: "ink",
      step: "٠٢",
      title: "القلم والحبر",
      description: "يُرسم الخط المختار حرًّا بقلم مبريّ يدويًا، بمرور واحد متصل ومدروس.",
    },
    {
      id: "refine",
      step: "٠٣",
      title: "التنقيح",
      description:
        "تصحيح دقيق، وضبط للمسافات، وإضافة طبقات من الحركات والزخارف الثانوية.",
    },
    {
      id: "final",
      step: "٠٤",
      title: "العمل النهائي",
      description: "التذهيب أو التأطير أو الرقمنة — يُجهَّز العمل ليجد مكانه الأخير.",
    },
  ],

  testimonials: [
    {
      id: "layla",
      quote:
        "كل ضيف سأل من الذي خطّ دعواتنا. شعرنا وكأنها ليست قرطاسية بل عمل فني يحمل تفاصيل زفافنا.",
      name: "ليلى ح.",
      role: "عروس، عمّان",
    },
    {
      id: "noor",
      quote:
        "حوّل اسم علامتنا التجارية إلى شعار يبدو عريقًا وجديدًا في آنٍ واحد. استحق كل يوم انتظرناه.",
      name: "استوديو نور",
      role: "مديرة العلامة التجارية",
    },
    {
      id: "rami",
      quote:
        "مشاهدته يعمل مباشرة في حفلنا كانت أخّاذة — لا يزال ضيوفنا يتحدثون عن الخطاط أكثر من الكعكة.",
      name: "رامي ودانا",
      role: "عروسان",
    },
  ],

  contact: {
    // wa.me expects the international number with no "+" and no leading "00".
    whatsapp: "963980536940",
    whatsappDisplay: "+963 980 536 940",
    email: "mlaz.shaheen@gmail.com",
    socials: [
      { id: "instagram", label: "إنستغرام", href: "https://instagram.com/yourhandle" },
      { id: "behance", label: "بيهانس", href: "https://behance.net/yourhandle" },
      { id: "pinterest", label: "بينترست", href: "https://pinterest.com/yourhandle" },
    ],
  },

  sections: {
    hero: {
      ctaPrimary: "ادخل المعرض",
      ctaSecondary: "احجز مشروعًا",
      scrollHint: "٨ غرف",
    },
    studio: { label: "المرسم", heading: "", intro: "" },
    gallery: {
      label: "المعرض",
      heading: "اسحب لتدور بين الأعمال",
      intro: "",
      cardHint: "اضغط للتفاصيل",
      detailCta: "اطلب عملًا مشابهًا",
    },
    services: {
      label: "الخدمات",
      heading: "",
      intro:
        "كل خدمة تبدأ بمحادثة عن المناسبة والكلمات، وتنتهي بقطعة تحمل اسمك وحدك.",
    },
    journey: { label: "الرحلة", heading: "", intro: "" },
    voices: {
      label: "الأصوات",
      heading: "ما يقوله من حملوا أعمالي إلى بيوتهم",
      intro: "",
    },
    ink: {
      label: "الحبر",
      heading: "",
      intro:
        "الريشة في يدك الآن. حرّكها ببطء ليغزر الحبر، وبسرعة ليرقّ الخط — كما يفعل القلم الحقيقي على الورق.",
      canvasHint: "انقر للكتابة",
      clearLabel: "امسح الورقة",
      saveLabel: "احفظ الصورة",
    },
    signature: {
      label: "التوقيع",
      heading: "لنكتب شيئًا",
      headingAccent: " يبقى",
      intro:
        "حدّثني عن المناسبة والكلمات والشعور الذي تريده أن يحمله العمل. أرد شخصيًا على كل رسالة.",
    },
  },

  meta: {
    title: "ملاذ شاهين — خطاط وفنان الخط العربي",
    description:
      "خط عربي مخصّص للأعراس والعلامات التجارية والأعمال الخاصة — خط الثلث والديواني الكلاسيكي بخط اليد.",
  },
};

"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { saveSiteContent } from "@/lib/content/actions";
import type { SiteContent } from "@/lib/content/types";
import { Field, ImagePicker, ListEditor, StringListEditor, TextArea } from "./fields";

const TABS = [
  { id: "artist", label: "الفنان" },
  { id: "works", label: "الأعمال" },
  { id: "services", label: "الخدمات" },
  { id: "process", label: "الرحلة" },
  { id: "testimonials", label: "الآراء" },
  { id: "contact", label: "التواصل" },
  { id: "sections", label: "نصوص الأقسام" },
  { id: "meta", label: "الموقع" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function Editor({
  initialContent,
  writable,
  storageNotice,
}: {
  initialContent: SiteContent;
  writable: boolean;
  storageNotice: string;
}) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [tab, setTab] = useState<TabId>("artist");
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  /** Every edit funnels through here so the dirty flag stays accurate. */
  const patch = useCallback((update: Partial<SiteContent>) => {
    setContent((current) => ({ ...current, ...update }));
    setDirty(true);
    setMessage(null);
  }, []);

  // Warn before losing unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function save() {
    startTransition(async () => {
      const result = await saveSiteContent(content);
      setMessage({ ok: result.ok, text: result.message });
      if (result.ok) setDirty(false);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {!writable && (
        <p
          role="status"
          className="rounded-md border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 p-4 text-sm leading-relaxed"
        >
          {storageNotice}
        </p>
      )}

      <div
        role="tablist"
        aria-label="أقسام المحتوى"
        className="flex flex-wrap gap-2 border-b border-white/10 pb-4"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className="dash-tab"
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 pb-28">
        {tab === "artist" && (
          <ArtistTab content={content} patch={patch} />
        )}

        {tab === "works" && (
          <section className="flex flex-col gap-4">
            <SectionIntro
              title="الأعمال"
              description="تظهر في المعرض الدوّار. الترتيب هنا هو ترتيب ظهورها على الأسطوانة."
            />
            <ListEditor
              items={content.works}
              onChange={(works) => patch({ works })}
              addLabel="أضف عملًا"
              makeNew={() => ({
                id: newId("work"),
                title: "",
                category: "",
                year: "",
                description: "",
                image: "",
              })}
              summary={(w) => `${w.title}${w.category ? ` — ${w.category}` : ""}`}
              renderItem={(work, update) => (
                <>
                  <Field label="العنوان" value={work.title} onChange={(title) => update({ title })} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="التصنيف"
                      value={work.category}
                      onChange={(category) => update({ category })}
                    />
                    <Field label="السنة" value={work.year} onChange={(year) => update({ year })} />
                  </div>
                  <TextArea
                    label="الوصف"
                    value={work.description}
                    onChange={(description) => update({ description })}
                  />
                  <ImagePicker
                    label="صورة العمل"
                    value={work.image}
                    onChange={(image) => update({ image })}
                    hint="بدون صورة يظهر أول حرف من العنوان كعلامة ذهبية."
                  />
                </>
              )}
            />
          </section>
        )}

        {tab === "services" && (
          <section className="flex flex-col gap-4">
            <SectionIntro title="الخدمات" description="قائمة الخدمات في قسم الخدمات." />
            <ListEditor
              items={content.services}
              onChange={(services) => patch({ services })}
              addLabel="أضف خدمة"
              makeNew={() => ({ id: newId("service"), title: "", description: "" })}
              summary={(s) => s.title}
              renderItem={(service, update) => (
                <>
                  <Field
                    label="العنوان"
                    value={service.title}
                    onChange={(title) => update({ title })}
                  />
                  <TextArea
                    label="الوصف"
                    value={service.description}
                    onChange={(description) => update({ description })}
                  />
                </>
              )}
            />
          </section>
        )}

        {tab === "process" && (
          <section className="flex flex-col gap-4">
            <SectionIntro
              title="الرحلة"
              description="مراحل العمل التي تمرّ في العمق عند التمرير."
            />
            <ListEditor
              items={content.process}
              onChange={(process) => patch({ process })}
              addLabel="أضف مرحلة"
              makeNew={() => ({ id: newId("step"), step: "", title: "", description: "" })}
              summary={(s) => `${s.step} ${s.title}`}
              renderItem={(step, update) => (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="الرقم"
                      value={step.step}
                      onChange={(value) => update({ step: value })}
                    />
                    <Field
                      label="العنوان"
                      value={step.title}
                      onChange={(title) => update({ title })}
                    />
                  </div>
                  <TextArea
                    label="الوصف"
                    value={step.description}
                    onChange={(description) => update({ description })}
                  />
                </>
              )}
            />
          </section>
        )}

        {tab === "testimonials" && (
          <section className="flex flex-col gap-4">
            <SectionIntro title="الآراء" description="شهادات العملاء في قسم الأصوات." />
            <ListEditor
              items={content.testimonials}
              onChange={(testimonials) => patch({ testimonials })}
              addLabel="أضف رأيًا"
              makeNew={() => ({ id: newId("quote"), quote: "", name: "", role: "" })}
              summary={(t) => t.name}
              renderItem={(item, update) => (
                <>
                  <TextArea
                    label="النص"
                    value={item.quote}
                    onChange={(quote) => update({ quote })}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="الاسم" value={item.name} onChange={(name) => update({ name })} />
                    <Field label="الصفة" value={item.role} onChange={(role) => update({ role })} />
                  </div>
                </>
              )}
            />
          </section>
        )}

        {tab === "contact" && (
          <ContactTab content={content} patch={patch} />
        )}

        {tab === "sections" && (
          <SectionsTab content={content} patch={patch} />
        )}

        {tab === "meta" && (
          <section className="flex flex-col gap-4">
            <SectionIntro
              title="بيانات الموقع"
              description="العنوان والوصف اللذان يظهران في نتائج البحث وتبويب المتصفح."
            />
            <div className="dash-card flex flex-col gap-4">
              <Field
                label="عنوان الموقع"
                value={content.meta.title}
                onChange={(title) => patch({ meta: { ...content.meta, title } })}
              />
              <TextArea
                label="وصف الموقع"
                value={content.meta.description}
                onChange={(description) =>
                  patch({ meta: { ...content.meta, description } })
                }
              />
            </div>
          </section>
        )}
      </div>

      {/* Save bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-stone-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="text-sm">
            {message ? (
              <span
                role="status"
                style={{
                  color: message.ok ? "var(--color-success)" : "var(--color-danger)",
                }}
              >
                {message.text}
              </span>
            ) : dirty ? (
              <span className="text-ink-gold">تغييرات غير محفوظة</span>
            ) : (
              <span className="text-ink-sand/70">لا تغييرات</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="dash-btn dash-btn-ghost"
            >
              معاينة الموقع
            </a>
            <button
              type="button"
              onClick={save}
              disabled={pending || !dirty}
              className="dash-btn dash-btn-primary"
            >
              {pending ? "جارٍ الحفظ…" : "احفظ التغييرات"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionIntro({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-lg text-ink-ivory">{title}</h2>
      <p className="mt-1 text-sm text-ink-sand/80">{description}</p>
    </div>
  );
}

function ArtistTab({
  content,
  patch,
}: {
  content: SiteContent;
  patch: (update: Partial<SiteContent>) => void;
}) {
  const { artist } = content;
  const set = (update: Partial<SiteContent["artist"]>) =>
    patch({ artist: { ...artist, ...update } });

  return (
    <section className="flex flex-col gap-6">
      <SectionIntro
        title="الفنان"
        description="الاسم والعبارات التي تظهر في الواجهة وقسم المرسم."
      />

      <div className="dash-card flex flex-col gap-4">
        <Field label="الاسم" value={artist.name} onChange={(name) => set({ name })} />
        <Field label="الصفة" value={artist.title} onChange={(title) => set({ title })} />
        <Field
          label="العبارة تحت الاسم"
          value={artist.tagline}
          onChange={(tagline) => set({ tagline })}
        />
        <Field
          label="الموقع الجغرافي"
          value={artist.location}
          onChange={(location) => set({ location })}
        />
        <TextArea
          label="الفلسفة (العنوان الكبير في قسم المرسم)"
          value={artist.philosophy}
          onChange={(philosophy) => set({ philosophy })}
        />
        <ImagePicker
          label="صورة الفنان"
          value={artist.portrait}
          onChange={(portrait) => set({ portrait })}
          hint="بدون صورة يظهر أول حرف من الاسم بخط ذهبي."
        />
      </div>

      <div className="dash-card flex flex-col gap-5">
        <StringListEditor
          label="النبذة (كل فقرة على حدة)"
          items={artist.bio}
          onChange={(bio) => set({ bio })}
          addLabel="أضف فقرة"
          multiline
        />
        <StringListEditor
          label="التخصصات"
          items={artist.specialties}
          onChange={(specialties) => set({ specialties })}
          addLabel="أضف تخصصًا"
        />
      </div>

      <div className="flex flex-col gap-3">
        <SectionIntro title="الأرقام" description="الإحصاءات الأربع في قسم المرسم." />
        <ListEditor
          items={content.stats}
          onChange={(stats) => patch({ stats })}
          addLabel="أضف رقمًا"
          makeNew={() => ({ id: newId("stat"), value: "", label: "" })}
          summary={(s) => `${s.value} ${s.label}`}
          renderItem={(stat, update) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="الرقم"
                value={stat.value}
                onChange={(value) => update({ value })}
              />
              <Field
                label="التسمية"
                value={stat.label}
                onChange={(label) => update({ label })}
              />
            </div>
          )}
        />
      </div>
    </section>
  );
}

function ContactTab({
  content,
  patch,
}: {
  content: SiteContent;
  patch: (update: Partial<SiteContent>) => void;
}) {
  const { contact } = content;
  const set = (update: Partial<SiteContent["contact"]>) =>
    patch({ contact: { ...contact, ...update } });

  return (
    <section className="flex flex-col gap-6">
      <SectionIntro title="التواصل" description="الواتساب والبريد وروابط التواصل." />

      <div className="dash-card flex flex-col gap-4">
        <Field
          label="رقم واتساب (بالصيغة الدولية بلا + وبلا أصفار بادئة)"
          value={contact.whatsapp}
          onChange={(whatsapp) => set({ whatsapp })}
          dir="ltr"
          placeholder="963980536940"
        />
        <Field
          label="الرقم كما يُعرض للزائر"
          value={contact.whatsappDisplay}
          onChange={(whatsappDisplay) => set({ whatsappDisplay })}
          dir="ltr"
          placeholder="+963 980 536 940"
        />
        <Field
          label="البريد الإلكتروني"
          value={contact.email}
          onChange={(email) => set({ email })}
          dir="ltr"
          type="email"
        />
      </div>

      <div className="flex flex-col gap-3">
        <SectionIntro title="روابط التواصل" description="تظهر أسفل قسم التوقيع." />
        <ListEditor
          items={contact.socials}
          onChange={(socials) => set({ socials })}
          addLabel="أضف رابطًا"
          makeNew={() => ({ id: newId("social"), label: "", href: "" })}
          summary={(s) => s.label}
          renderItem={(social, update) => (
            <>
              <Field
                label="الاسم"
                value={social.label}
                onChange={(label) => update({ label })}
              />
              <Field
                label="الرابط"
                value={social.href}
                onChange={(href) => update({ href })}
                dir="ltr"
                placeholder="https://instagram.com/…"
              />
            </>
          )}
        />
      </div>
    </section>
  );
}

function SectionsTab({
  content,
  patch,
}: {
  content: SiteContent;
  patch: (update: Partial<SiteContent>) => void;
}) {
  const s = content.sections;
  const set = (update: Partial<SiteContent["sections"]>) =>
    patch({ sections: { ...s, ...update } });

  return (
    <section className="flex flex-col gap-6">
      <SectionIntro
        title="نصوص الأقسام"
        description="أسماء الغرف والعناوين والأزرار الظاهرة في كل قسم."
      />

      <div className="dash-card flex flex-col gap-4">
        <h3 className="text-ink-gold">الواجهة</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="زر أساسي"
            value={s.hero.ctaPrimary}
            onChange={(ctaPrimary) => set({ hero: { ...s.hero, ctaPrimary } })}
          />
          <Field
            label="زر ثانوي"
            value={s.hero.ctaSecondary}
            onChange={(ctaSecondary) => set({ hero: { ...s.hero, ctaSecondary } })}
          />
        </div>
        <Field
          label="تلميح التمرير"
          value={s.hero.scrollHint}
          onChange={(scrollHint) => set({ hero: { ...s.hero, scrollHint } })}
        />
      </div>

      <div className="dash-card flex flex-col gap-4">
        <h3 className="text-ink-gold">المعرض</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="اسم الغرفة"
            value={s.gallery.label}
            onChange={(label) => set({ gallery: { ...s.gallery, label } })}
          />
          <Field
            label="العنوان"
            value={s.gallery.heading}
            onChange={(heading) => set({ gallery: { ...s.gallery, heading } })}
          />
          <Field
            label="تلميح البطاقة"
            value={s.gallery.cardHint}
            onChange={(cardHint) => set({ gallery: { ...s.gallery, cardHint } })}
          />
          <Field
            label="زر التفاصيل"
            value={s.gallery.detailCta}
            onChange={(detailCta) => set({ gallery: { ...s.gallery, detailCta } })}
          />
        </div>
      </div>

      <div className="dash-card flex flex-col gap-4">
        <h3 className="text-ink-gold">الخدمات</h3>
        <Field
          label="اسم الغرفة"
          value={s.services.label}
          onChange={(label) => set({ services: { ...s.services, label } })}
        />
        <TextArea
          label="المقدمة"
          value={s.services.intro}
          onChange={(intro) => set({ services: { ...s.services, intro } })}
        />
      </div>

      <div className="dash-card flex flex-col gap-4">
        <h3 className="text-ink-gold">المرسم والرحلة</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="اسم غرفة المرسم"
            value={s.studio.label}
            onChange={(label) => set({ studio: { ...s.studio, label } })}
          />
          <Field
            label="اسم غرفة الرحلة"
            value={s.journey.label}
            onChange={(label) => set({ journey: { ...s.journey, label } })}
          />
        </div>
      </div>

      <div className="dash-card flex flex-col gap-4">
        <h3 className="text-ink-gold">الأصوات</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="اسم الغرفة"
            value={s.voices.label}
            onChange={(label) => set({ voices: { ...s.voices, label } })}
          />
          <Field
            label="العنوان"
            value={s.voices.heading}
            onChange={(heading) => set({ voices: { ...s.voices, heading } })}
          />
        </div>
      </div>

      <div className="dash-card flex flex-col gap-4">
        <h3 className="text-ink-gold">الحبر</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="اسم الغرفة"
            value={s.ink.label}
            onChange={(label) => set({ ink: { ...s.ink, label } })}
          />
          <Field
            label="تلميح اللوحة"
            value={s.ink.canvasHint}
            onChange={(canvasHint) => set({ ink: { ...s.ink, canvasHint } })}
          />
          <Field
            label="زر المسح"
            value={s.ink.clearLabel}
            onChange={(clearLabel) => set({ ink: { ...s.ink, clearLabel } })}
          />
          <Field
            label="زر الحفظ"
            value={s.ink.saveLabel}
            onChange={(saveLabel) => set({ ink: { ...s.ink, saveLabel } })}
          />
        </div>
        <TextArea
          label="المقدمة"
          value={s.ink.intro}
          onChange={(intro) => set({ ink: { ...s.ink, intro } })}
        />
      </div>

      <div className="dash-card flex flex-col gap-4">
        <h3 className="text-ink-gold">التوقيع</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="اسم الغرفة"
            value={s.signature.label}
            onChange={(label) => set({ signature: { ...s.signature, label } })}
          />
          <Field
            label="العنوان"
            value={s.signature.heading}
            onChange={(heading) => set({ signature: { ...s.signature, heading } })}
          />
          <Field
            label="تكملة العنوان (ذهبية)"
            value={s.signature.headingAccent}
            onChange={(headingAccent) =>
              set({ signature: { ...s.signature, headingAccent } })
            }
          />
        </div>
        <TextArea
          label="المقدمة"
          value={s.signature.intro}
          onChange={(intro) => set({ signature: { ...s.signature, intro } })}
        />
      </div>
    </section>
  );
}

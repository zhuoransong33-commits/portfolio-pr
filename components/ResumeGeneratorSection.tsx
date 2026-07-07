import React, { useMemo, useState } from 'react';
import { FileText, ImageDown, RotateCcw } from 'lucide-react';
import { CONTACT_DATA } from '../src/data/contact';
import { Language } from '../types';

interface ResumeGeneratorSectionProps {
  language: Language;
}

type Ability = 'graphic' | 'photo' | 'video' | 'interior' | 'personal';

interface FormState {
  ability: Ability;
  role: string;
  salary: string;
}

const abilityOptions: Array<{ id: Ability; zh: string; en: string }> = [
  { id: 'graphic', zh: '平面设计 / UI 视觉', en: 'Graphic / UI Visual' },
  { id: 'photo', zh: '摄影摄像 / 静态影像', en: 'Photography / Still Image' },
  { id: 'video', zh: '视频剪辑 / 拍摄', en: 'Video Editing / Shooting' },
  { id: 'interior', zh: '室内设计 / 环艺', en: 'Interior / Environmental Design' },
  { id: 'personal', zh: '个人综合能力', en: 'Personal General Ability' },
];

const abilityProfiles: Record<Ability, { title: string; summary: string; highlights: string[]; works: string[] }> = {
  graphic: {
    title: '平面设计 / UI 视觉方向',
    summary: '适合需要品牌视觉、信息图表、界面视觉、作品集排版与基础页面落地能力的设计岗位。',
    highlights: ['Adobe Photoshop / Illustrator / Lightroom', 'Figma 与 AI Web 设计', '信息整理、视觉传播与版式表达', '前端页面实现基础'],
    works: ['平面交互作品', '摄影集 PDF', '电影信息图表设计'],
  },
  photo: {
    title: '摄影摄像 / 静态影像方向',
    summary: '适合需要人物、空间、旅行与纪实影像拍摄，以及作品整理和视觉叙事能力的岗位。',
    highlights: ['静态摄影与平面摄影', '摄影暗房技术', '作品集排版 / 整理', '视觉观察与内容表达'],
    works: ['静态摄影合集', '摄影集 PDF', '个人影像档案'],
  },
  video: {
    title: '视频剪辑 / 拍摄方向',
    summary: '适合短片制作、视频剪辑、后期节奏控制与动态影像叙事相关岗位。',
    highlights: ['Adobe Premiere Pro', 'Adobe After Effects', '视频剪辑与动态影像剪辑', '影片调色与影像后期'],
    works: ['毕业设计作品《破茧》', '动态影像作品', '短片与叙事影像'],
  },
  interior: {
    title: '室内设计 / 环艺方向',
    summary: '适合空间概念、室内表达、环境设计、建模渲染与展厅设计相关岗位。',
    highlights: ['AutoCAD / SketchUp / 3ds Max', 'Blender / Lumion / D5 Render', '空间规划与室内设计表达', '建模与渲染表现'],
    works: ['创意办公空间项目', '南京爻石博物馆数字展厅', '环境 / 室内设计作品集'],
  },
  personal: {
    title: '个人综合能力方向',
    summary: '适合岗位不完全对口时，快速了解个人基础素质、学习能力、视觉表达、内容整理与跨方向协作能力。',
    highlights: ['学习能力与信息整理', '视觉审美与内容表达', '摄影、视频、平面、空间的综合经验', '基础前端页面实现与作品集管理'],
    works: ['个人作品网站', '摄影集 PDF', '毕业短片《破茧》', '环境 / 室内设计作品'],
  },
};

const initialForm: FormState = {
  ability: 'graphic',
  role: '',
  salary: '',
};

const label = (language: Language, zh: string, en: string) => (language === 'zh' ? zh : en);

export const ResumeGeneratorSection: React.FC<ResumeGeneratorSectionProps> = ({ language }) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const contact = CONTACT_DATA[language];
  const selectedAbility = useMemo(() => abilityProfiles[form.ability], [form.ability]);

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const fileBaseName = `zhuoran-song-resume-${form.role || selectedAbility.title}`.replace(/[\\/:*?"<>|\s]+/g, '-').toLowerCase();

  const downloadImage = async () => {
    const target = document.getElementById('resume-preview-card');
    if (!target) return;

    const width = target.offsetWidth;
    const height = target.offsetHeight;
    const cloned = target.cloneNode(true) as HTMLElement;
    cloned.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    cloned.style.width = `${width}px`;
    cloned.style.height = `${height}px`;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <foreignObject width="100%" height="100%">${new XMLSerializer().serializeToString(cloned)}</foreignObject>
      </svg>
    `;

    const image = new Image();
    const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width * 2;
      canvas.height = height * 2;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.scale(2, 2);
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0);
      URL.revokeObjectURL(svgUrl);

      const link = document.createElement('a');
      link.download = `${fileBaseName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    image.src = svgUrl;
  };

  const printPdf = () => {
    const target = document.getElementById('resume-preview-card');
    if (!target) return;
    const popup = window.open('', '_blank', 'width=900,height=1200');
    if (!popup) return;

    popup.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${fileBaseName}</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 24px; font-family: Arial, "Microsoft YaHei", sans-serif; background: #f3f3f0; }
            @page { size: A4; margin: 14mm; }
            @media print { body { padding: 0; background: #fff; } }
          </style>
        </head>
        <body>${target.outerHTML}</body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    window.setTimeout(() => popup.print(), 300);
  };

  return (
    <div className="mx-auto w-full max-w-[96vw] pb-20">
      <div className="grid gap-8 xl:grid-cols-[minmax(22rem,0.9fr)_minmax(30rem,1.1fr)]">
        <section className="border-t-2 border-black pt-6 dark:border-white">
          <div className="mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-gray-500">
              Interview Archive Tool
            </p>
            <h2 className="mt-3 text-4xl font-black leading-none tracking-[-0.04em] text-black dark:text-white md:text-6xl">
              {label(language, '简历生成问卷', 'Resume Generator')}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {label(
                language,
                '选择面试方最关注的能力方向，并填写岗位与薪资信息，页面会自动生成一份可下载的简历卡片。',
                'Select the role focus and fill in role and salary information to generate a downloadable resume card.'
              )}
            </p>
          </div>

          <div className="space-y-7">
            <Question title={label(language, '1. 需要哪方面能力？', '1. Which ability is needed?')}>
              <div className="grid gap-3 sm:grid-cols-2">
                {abilityOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => updateForm('ability', option.id)}
                    className={`border px-4 py-3 text-left text-sm font-bold transition-colors ${
                      form.ability === option.id
                        ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                        : 'border-gray-200 text-gray-500 hover:border-black hover:text-black dark:border-gray-800 dark:text-gray-400 dark:hover:border-white dark:hover:text-white'
                    }`}
                  >
                    {label(language, option.zh, option.en)}
                  </button>
                ))}
              </div>
            </Question>

            <Question title={label(language, '2. 面试的岗位是什么？', '2. What role is this interview for?')}>
              <TextInput value={form.role} placeholder={label(language, '岗位名称', 'Role title')} onChange={(value) => updateForm('role', value)} />
            </Question>

            <Question title={label(language, '3. 薪资范围或预算是多少？', '3. What salary range or budget?')}>
              <TextInput value={form.salary} placeholder={label(language, '期望薪资 / 面议 / 预算范围', 'Expected salary / Negotiable / Budget')} onChange={(value) => updateForm('salary', value)} />
            </Question>
          </div>
        </section>

        <section className="xl:sticky xl:top-28 xl:self-start">
          <ResumeCard
            language={language}
            form={form}
            contactEmail={contact.email}
            selectedAbility={selectedAbility}
          />

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <button onClick={downloadImage} className="inline-flex items-center justify-center gap-2 bg-black px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black">
              <ImageDown size={18} />
              {label(language, '下载图片', 'PNG')}
            </button>
            <button onClick={printPdf} className="inline-flex items-center justify-center gap-2 border border-black px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
              <FileText size={18} />
              {label(language, '保存 PDF', 'PDF')}
            </button>
            <button onClick={() => setForm(initialForm)} className="inline-flex items-center justify-center gap-2 border border-gray-200 px-4 py-3 text-sm font-bold text-gray-500 transition-colors hover:border-black hover:text-black dark:border-gray-800 dark:hover:border-white dark:hover:text-white">
              <RotateCcw size={18} />
              {label(language, '重置', 'Reset')}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

const Question = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="mb-3 text-base font-black text-black dark:text-white">{title}</h3>
    {children}
  </div>
);

const TextInput = ({ value, placeholder, onChange }: { value: string; placeholder: string; onChange: (value: string) => void }) => (
  <input
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder={placeholder}
    className="w-full border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-black dark:border-gray-800 dark:focus:border-white"
  />
);

const ResumeCard = ({
  language,
  form,
  contactEmail,
  selectedAbility,
}: {
  language: Language;
  form: FormState;
  contactEmail: string;
  selectedAbility: { title: string; summary: string; highlights: string[]; works: string[] };
}) => (
  <article
    id="resume-preview-card"
    className="bg-[#f7f7f3] p-7 text-black shadow-[0_18px_70px_rgba(0,0,0,0.10)] md:p-9"
  >
    <header className="flex items-start justify-between gap-6 border-b border-black pb-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-black/55">
          {label(language, '面试定制简历', 'Tailored Resume')}
        </p>
        <h3 className="mt-3 text-5xl font-black leading-[0.85] tracking-[-0.06em] md:text-7xl">
          ZHUORAN<br />SONG
        </h3>
      </div>
      <div className="grid h-24 w-20 place-items-center border border-black/25 bg-white font-mono text-xs uppercase tracking-[0.16em] text-black/45">
        Photo
      </div>
    </header>

    <section className="grid gap-5 border-b border-black/25 py-5 md:grid-cols-[1fr_0.85fr]">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-black/50">
          {selectedAbility.title}
        </p>
        <h4 className="mt-2 text-2xl font-black leading-tight md:text-3xl">
          {form.role || label(language, '面试岗位待填写', 'Interview role pending')}
        </h4>
        <p className="mt-4 text-sm leading-relaxed text-black/70">
          {selectedAbility.summary}
        </p>
      </div>
      <dl className="grid content-start gap-2 font-mono text-xs uppercase tracking-[0.08em] text-black/65">
        <InfoRow label={label(language, '能力', 'Ability')} value={selectedAbility.title} />
        <InfoRow label={label(language, '岗位', 'Role')} value={form.role || label(language, '待填写', 'Pending')} />
        <InfoRow label={label(language, '薪资', 'Salary')} value={form.salary || label(language, '面议', 'Negotiable')} />
      </dl>
    </section>

    <section className="grid gap-6 border-b border-black/25 py-5 md:grid-cols-2">
      <div>
        <h5 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-black/50">
          {label(language, '能力匹配', 'Matched Skills')}
        </h5>
        <ul className="space-y-2 text-sm font-semibold leading-snug">
          {selectedAbility.highlights.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-black" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h5 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-black/50">
          {label(language, '推荐查看作品', 'Recommended Works')}
        </h5>
        <ul className="space-y-2 text-sm leading-snug text-black/72">
          {selectedAbility.works.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>

    <footer className="flex flex-col justify-between gap-3 pt-5 font-mono text-xs uppercase tracking-[0.08em] text-black/58 md:flex-row">
      <span>{contactEmail}</span>
      <span>Portfolio: zhuoran song works</span>
    </footer>
  </article>
);

const InfoRow = ({ label: rowLabel, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 border-b border-black/15 pb-2">
    <dt className="text-black/42">{rowLabel}</dt>
    <dd className="truncate">{value}</dd>
  </div>
);

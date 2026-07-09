import React, { useMemo, useRef, useState } from 'react';
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

interface AbilityProfile {
  optionZh: string;
  optionEn: string;
  title: string;
  defaultRole: string;
  summary: string;
  strengths: string[];
  software: string[];
  projects: ResumeItem[];
  jd: {
    title: string;
    responsibilities: string[];
    requirements: string[];
  };
}

interface ResumeItem {
  title: string;
  meta: string;
  description: string;
}

const initialForm: FormState = {
  ability: 'graphic',
  role: '',
  salary: '',
};

const label = (language: Language, zh: string, en: string) => (language === 'zh' ? zh : en);

const abilityProfiles: Record<Ability, AbilityProfile> = {
  graphic: {
    optionZh: '平面设计 / UI 视觉',
    optionEn: 'Graphic / UI Visual',
    title: '平面设计 / UI 视觉方向',
    defaultRole: '平面设计实习生 / 视觉设计实习生',
    summary: '具备数字媒体艺术设计与环境设计复合背景，长期参与摄影、视觉设计、作品集排版和影像后期项目。能够从信息整理、图像拍摄、后期修图到平面物料输出形成完整流程，适合承担品牌视觉、宣传物料、社媒图文、作品集和基础 UI 视觉相关工作。',
    strengths: ['宣传物料与品牌视觉延展', '信息图表、作品集与图文版式整理', '摄影素材拍摄、筛选、调色与精修', '能够结合 Photoshop / Lightroom 输出统一视觉风格'],
    software: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe Lightroom', 'Figma', 'Premiere Pro'],
    projects: [
      {
        title: '本科毕设 | 基于计量电影学的影片信息图表设计',
        meta: '信息图表 / 视觉叙事 / Figma',
        description: '围绕电影数据进行信息结构整理、视觉编码和版面设计，完成可阅读的信息图表方案。',
      },
      {
        title: '摄影集 PDF 作品集',
        meta: '版式设计 / 图文编排 / 作品集整理',
        description: '完成摄影作品的筛选、叙事顺序组织和 PDF 作品集排版，用统一视觉语言呈现个人影像风格。',
      },
      {
        title: '广志路社区美好小店宣传拍摄',
        meta: '负责人 / 平面拍摄 / 视觉宣传',
        description: '为 16 家社区小店制定差异化拍摄方案，使用 Lightroom 调色与 Photoshop 精修强化产品质感，同步输出宣传海报和微信公众号展示图。',
      },
    ],
    jd: {
      title: '通用平面 / 视觉设计岗位 JD',
      responsibilities: ['参与品牌海报、活动物料、作品集、社媒图文等视觉设计', '协助完成页面视觉、信息图表和排版规范整理', '根据项目需求进行图片处理、视觉延展和设计交付'],
      requirements: ['熟练使用 Photoshop、Illustrator，了解 Figma 或 UI 设计流程', '具备良好的版式、色彩、信息层级和审美判断', '有作品集整理、视觉传播或图文内容设计经验优先'],
    },
  },
  photo: {
    optionZh: '摄影摄像 / 静态影像',
    optionEn: 'Photography / Still Image',
    title: '摄影摄像 / 静态影像方向',
    defaultRole: '摄影助理 / 摄影摄像实习生',
    summary: '具备人像、产品、空间与社区宣传类拍摄经验，熟悉拍摄前方案制定、现场灯光布置、素材整理、选片和后期精修。曾协助电商产品、写真、婚纱摄影拍摄，也独立统筹社区店铺宣传拍摄，能够根据不同商业场景调整构图、光线和后期风格。',
    strengths: ['人像、产品、空间与店铺宣传拍摄', '柔光箱、LED 补光灯等基础灯光协助', 'Lightroom 调色与 Photoshop 精修', '拍摄流程统筹、素材整理与后期筛选'],
    software: ['Adobe Photoshop', 'Adobe Lightroom', 'Adobe Illustrator', 'Premiere Pro', 'DaVinci Resolve'],
    projects: [
      {
        title: '洛阳夕木摄影工作室 | 摄影助理',
        meta: '2020.07 - 2020.09 / 灯光造型方向',
        description: '协助摄影师完成电商产品、写真及婚纱摄影的灯光布置与现场调试，参与素材整理和后期筛选。',
      },
      {
        title: '静态摄影与摄影集项目',
        meta: '摄影作品 / PDF 作品集',
        description: '持续整理个人摄影作品，涵盖人物、空间、旅行和纪实影像，形成可展示的作品集结构。',
      },
      {
        title: '广志路社区美好小店宣传拍摄',
        meta: '2023.03 - 2023.04 / 负责人',
        description: '统筹 16 家小店宣传拍摄，围绕餐饮、文创、零售等不同经营特色制定拍摄方案，项目成果用于社区年度宣传手册，个人获评优秀志愿者。',
      },
    ],
    jd: {
      title: '通用摄影摄像岗位 JD',
      responsibilities: ['参与产品、人像、空间、活动等拍摄执行', '协助布光、器材准备、现场调度和素材备份整理', '完成基础修图、调色、选片和影像资料归档'],
      requirements: ['熟悉摄影基础、构图、光线控制和相机基本操作', '熟练使用 Photoshop、Lightroom，了解 Premiere 或达芬奇优先', '具备良好的现场配合能力、审美判断和素材管理习惯'],
    },
  },
  video: {
    optionZh: '视频剪辑 / 拍摄',
    optionEn: 'Video Editing / Shooting',
    title: '视频剪辑 / 拍摄方向',
    defaultRole: '视频剪辑实习生 / 影视后期实习生',
    summary: '具备影视后期剪辑和动态影像创作经验，能参与素材整理、粗剪、精剪、调色、镜头衔接和版本交付。曾独立完成 4 部短剧单集后期剪辑流程，并多次协助主管审核成片与处理多机位素材，理解剧情节奏、画面连续性和团队交付要求。',
    strengths: ['短剧粗剪、精剪与节奏控制', '多机位素材整理、特效包装与版本交付', '基础调色、字幕和画面连续性处理', '短片叙事、动态影像氛围和镜头衔接'],
    software: ['Adobe Premiere Pro', 'Adobe After Effects', 'DaVinci Resolve', 'Adobe Photoshop', 'Adobe Illustrator'],
    projects: [
      {
        title: '洛阳江湖影视 | 影视后期剪辑师',
        meta: '2025.06 - 至今 / 影视传媒',
        description: '负责影视剧素材粗剪、精剪及调色，独立完成 4 部短剧单集后期流程，并协助多机位素材整理与特效包装。',
      },
      {
        title: '毕业设计作品《破茧》',
        meta: '动态影像 / 短片叙事 / 剪辑',
        description: '围绕人物状态与空间氛围完成影像叙事表达，包含素材组织、节奏设计、剪辑和后期调整。',
      },
    ],
    jd: {
      title: '通用视频剪辑 / 影视后期岗位 JD',
      responsibilities: ['负责短视频、宣传片、剧情短片等内容的粗剪、精剪和基础包装', '根据脚本或需求完成节奏调整、字幕、音频和调色处理', '协助素材整理、项目归档、版本修改和交付输出'],
      requirements: ['熟练使用 Premiere Pro，了解 After Effects 和 DaVinci Resolve', '具备镜头语言、剪辑节奏、画面审美和基础声音处理意识', '有短片、短剧、宣传片或动态影像作品经验优先'],
    },
  },
  interior: {
    optionZh: '室内设计 / 环艺',
    optionEn: 'Interior / Environmental Design',
    title: '室内设计 / 环艺方向',
    defaultRole: '室内设计实习生 / 环境设计实习生',
    summary: '环境设计本科在读，系统学习室内空间规划、材料工艺、照明设计和 3D 建模，具备方案设计、空间布局、动线规划、模型搭建和效果图表达能力。曾参与南京某企业奇石馆设计竞赛，承担展馆展示形式、空间规划和效果图制作相关工作。',
    strengths: ['室内空间布局、功能分区与动线规划', 'SketchUp 建模、Lumion 渲染与效果图表达', '材料参数、灯光环境和视觉效果优化', '展馆展示形式、静态展示区域与游览动线设计'],
    software: ['AutoCAD', 'SketchUp', '3ds Max', 'Blender', 'Lumion', 'D5 Render'],
    projects: [
      {
        title: '洛阳斌尘办公空间设计',
        meta: '本科毕业设计 / 620 平方米 / 办公空间',
        description: '围绕 620 平方米办公空间完成空间概念、平面分析、材料氛围与效果图表达；模型被优选出送展，并获得优秀毕业设计奖项。',
      },
      {
        title: '南京爻石博物馆数字展厅',
        meta: '展厅设计 / 数字空间 / 校企合作',
        description: '围绕石文化艺术收藏品鉴数字展厅进行展示形式、空间布局和效果图表达，协同团队完成动线规划和展示区域分区，方案经多轮迭代后获得竞赛二等奖。',
      },
    ],
    jd: {
      title: '通用室内 / 环境设计岗位 JD',
      responsibilities: ['协助完成平面方案、概念设计、空间分析和效果表达', '参与模型搭建、材质灯光调整、效果图渲染和图纸整理', '配合设计师进行资料收集、方案深化和项目汇报文件制作'],
      requirements: ['熟悉 AutoCAD、SketchUp、3ds Max、Blender 或 D5 Render 等工具', '具备空间尺度、材料、灯光、动线和版面表达基础', '有室内、展厅、办公空间或环境设计作品经验优先'],
    },
  },
  personal: {
    optionZh: '个人综合能力',
    optionEn: 'Personal General Ability',
    title: '个人综合能力方向',
    defaultRole: '视觉内容 / 设计综合实习生',
    summary: '拥有数字媒体艺术设计、环境设计、摄影、影视后期和平面视觉的复合经历，兼具项目执行、团队协作和内容整理能力。经历覆盖短剧后期、商业摄影协助、社区宣传拍摄、展馆空间竞赛和个人作品集整理，适合需要跨工具、多类型视觉内容执行的岗位。',
    strengths: ['跨摄影、视频、平面、空间项目的综合执行', '从素材采集、后期处理到成果归档的完整流程意识', '社团、班级和社区项目中的组织协作经验', '专业排名靠前，具备持续学习和快速适应不同项目的能力'],
    software: ['Photoshop', 'Illustrator', 'Premiere Pro', 'After Effects', 'Blender', 'SketchUp', 'AutoCAD', 'Figma'],
    projects: [
      {
        title: '个人作品网站',
        meta: '作品归档 / 前端页面 / 视觉整合',
        description: '独立整理摄影、动态影像、平面交互和室内设计作品，并完成个人网站页面内容维护。',
      },
      {
        title: '跨方向作品集整理',
        meta: '摄影 / 视频 / 平面 / 空间',
        description: '将多个创作方向的作品重新归类、命名和展示，形成适合不同岗位查看的作品路径。',
      },
    ],
    jd: {
      title: '通用视觉内容 / 设计助理岗位 JD',
      responsibilities: ['协助完成图片、视频、图文、空间资料等多类型视觉内容制作', '参与资料整理、作品集更新、项目文件归档和基础设计执行', '根据团队需求快速切换工具并完成辅助交付'],
      requirements: ['具备良好的审美、学习能力、沟通能力和信息整理能力', '熟悉至少一种平面、视频或空间设计工具，有跨方向经验优先', '能稳定推进任务，适应实习或项目制工作节奏'],
    },
  },
};

const abilityOptions = Object.entries(abilityProfiles).map(([id, profile]) => ({
  id: id as Ability,
  zh: profile.optionZh,
  en: profile.optionEn,
}));

const salaryOptions = [
  ...Array.from({ length: 28 }, (_, index) => `${index + 3}K / 月`),
  '30K 以上 / 月',
];

const resumeBase = {
  intentionCity: '江浙沪',
  education: [
    {
      title: '环境设计 | 本科',
      meta: '2024.08 - 2026.07 | 南通理工学院',
      description: '主修环境设计，系统学习室内空间规划、材料工艺、照明设计及 3D 建模等课程，专业排名前 10%。掌握 AutoCAD、SketchUp、3ds Max 等设计软件，具备方案设计和施工图深化基础。',
    },
    {
      title: '数字媒体艺术设计 | 大专',
      meta: '2021.09 - 2024.06 | 南京工业职业技术大学',
      description: '主修数字媒体艺术设计，学习数字创意、影视后期、视觉设计与数字艺术工具，系统接触 Photoshop、Premiere、Blender、UE 等软件，专业排名前 5%，多门实训课程全优。',
    },
  ],
  work: [
    {
      title: '影视后期剪辑师 | 洛阳江湖影视',
      meta: '2025.06 - 至今',
      description: '负责影视剧素材粗剪、精剪及调色工作，独立完成 4 部短剧单集后期剪辑流程，单集时长 3-5 分钟；能把控节奏与镜头衔接，多次协助主管审核成片并提交，配合团队完成季度项目交付。',
    },
    {
      title: '摄影助理 | 洛阳夕木摄影工作室',
      meta: '2020.07 - 2020.09',
      description: '协助摄影师完成电商产品、写真及婚纱摄影的灯光布置与现场调试，操作柔光箱、LED 补光灯等设备；通过光比控制与角度调整优化人像质感，并参与素材整理和后期筛选。',
    },
  ],
  campus: [
    '摄影社团社长，多次组织并参加省级、国家级设计与摄影比赛，积累美术基础、影像表达和跨领域设计经验。',
    '班级负责人，任职期间班级两次获得优秀班级称号，组织班级活动并推动成员参与志愿服务，累计时长约 93 小时。',
    '广志路社区美好小店宣传拍摄志愿项目优秀志愿者。',
  ],
  certificates: [
    '计算机多媒体技术助理工程师',
    'IITC 环艺设计师',
    '普通话二甲',
    '熟悉摄影摄像、影视后期、平面视觉、室内空间表达等复合流程。',
  ],
  awards: [
    '2023 年国家励志奖学金',
    '南京奇石馆校企合作空间设计竞赛 | 项目奖金 10,000 元',
    '第二届网络文化节摄影二等奖',
    '巨鲨杯江苏省大学生摄影优秀奖',
    '中国好创意摄影三等奖（国奖）',
    '国际雪雕大赛三等奖（国奖）',
    '专业实训课程全优成绩',
    '摄影社团社长',
  ],
};

export const ResumeGeneratorSection: React.FC<ResumeGeneratorSectionProps> = ({ language }) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState(1);
  const [isGenerated, setIsGenerated] = useState(false);
  const contact = CONTACT_DATA[language];
  const selectedAbility = useMemo(() => abilityProfiles[form.ability], [form.ability]);
  const resolvedRole = form.role || selectedAbility.defaultRole;
  const resolvedSalary = form.salary || salaryOptions[0];

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setIsGenerated(false);
  };

  const resetWizard = () => {
    setForm(initialForm);
    setStep(1);
    setIsGenerated(false);
  };

  const fileBaseName = `zhuoran-song-resume-${resolvedRole}`.replace(/[\\/:*?"<>|\s]+/g, '-').toLowerCase();

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
            body { margin: 0; padding: 24px; font-family: "San Francisco", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; font-variant-numeric: tabular-nums; background: #f3f3f0; }
            @page { size: A4; margin: 10mm; }
            @media print { body { padding: 0; background: #fff; } article { box-shadow: none !important; } }
          </style>
        </head>
        <body>${target.outerHTML}</body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    window.setTimeout(() => popup.print(), 300);
  };

  if (!isGenerated) {
    return (
      <div className="mx-auto flex min-h-[66vh] w-full max-w-3xl items-center justify-center px-4 pb-20">
        <section className="w-full text-center">
          <div className="mb-10 flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-gray-500">
            <span>{step}-3</span>
            <span className="h-px w-12 bg-gray-300 dark:bg-gray-700" />
            <span>{label(language, '共 3 题', '3 questions')}</span>
          </div>

          <div key={step} className="animate-[fadeIn_360ms_ease-out]">
            {step === 1 && (
              <Question title={label(language, '需要哪方面能力？', 'Which ability is needed?')}>
                <div className="mx-auto grid max-w-xl gap-3">
                  {abilityOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        updateForm('ability', option.id);
                        setStep(2);
                      }}
                      className={`border px-5 py-4 text-center text-sm font-bold transition-all duration-300 ${
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
            )}

            {step === 2 && (
              <Question title={label(language, '面试的岗位是什么？', 'What role is this interview for?')}>
                <TextInput value={form.role} placeholder={selectedAbility.defaultRole} onChange={(value) => updateForm('role', value)} />
                <WizardActions>
                  <button type="button" onClick={() => setStep(1)} className="border border-gray-200 px-5 py-3 text-sm font-bold text-gray-500 transition-colors hover:border-black hover:text-black dark:border-gray-800 dark:hover:border-white dark:hover:text-white">
                    {label(language, '上一题', 'Back')}
                  </button>
                  <button type="button" onClick={() => setStep(3)} className="bg-black px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black">
                    {label(language, '下一题', 'Next')}
                  </button>
                </WizardActions>
              </Question>
            )}

            {step === 3 && (
              <Question title={label(language, '薪资范围是多少？', 'What salary range?')}>
                <SalaryWheel value={form.salary || salaryOptions[0]} onChange={(value) => updateForm('salary', value)} />
                <WizardActions>
                  <button type="button" onClick={() => setStep(2)} className="border border-gray-200 px-5 py-3 text-sm font-bold text-gray-500 transition-colors hover:border-black hover:text-black dark:border-gray-800 dark:hover:border-white dark:hover:text-white">
                    {label(language, '上一题', 'Back')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!form.salary) updateForm('salary', salaryOptions[0]);
                      setIsGenerated(true);
                    }}
                    className="bg-black px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black"
                  >
                    {label(language, '确认生成', 'Generate')}
                  </button>
                </WizardActions>
              </Question>
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[96vw] pb-20">
      <div className="mb-4 flex flex-wrap justify-end gap-3">
        <button onClick={downloadImage} className="inline-flex items-center justify-center gap-2 bg-black px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black">
          <ImageDown size={18} />
          {label(language, '保存为图片', 'Save Image')}
        </button>
        <button onClick={printPdf} className="inline-flex items-center justify-center gap-2 border border-black px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
          <FileText size={18} />
          {label(language, '保存为 PDF', 'Save PDF')}
        </button>
        <button onClick={resetWizard} className="inline-flex items-center justify-center gap-2 border border-gray-200 px-4 py-3 text-sm font-bold text-gray-500 transition-colors hover:border-black hover:text-black dark:border-gray-800 dark:hover:border-white dark:hover:text-white">
          <RotateCcw size={18} />
          {label(language, '重置', 'Reset')}
        </button>
      </div>
      <ResumeCard
        language={language}
        form={form}
        contactEmail={contact.email}
        selectedAbility={selectedAbility}
        role={resolvedRole}
        salary={resolvedSalary}
      />
    </div>
  );
};

const Question = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="mb-8 text-3xl font-black leading-tight tracking-[-0.03em] text-black dark:text-white md:text-5xl">{title}</h3>
    {children}
  </div>
);

const TextInput = ({ value, placeholder, onChange }: { value: string; placeholder: string; onChange: (value: string) => void }) => (
  <input
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder={placeholder}
    className="mx-auto block w-full max-w-xl border-0 border-b-2 border-black/20 bg-transparent px-4 py-4 text-center text-xl font-black outline-none transition-colors placeholder:text-gray-300 focus:border-black dark:border-white/20 dark:focus:border-white"
  />
);

const WizardActions = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-10 flex justify-center gap-3">{children}</div>
);

const SalaryWheel = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ active: false, moved: false, startY: 0, startScrollTop: 0 });
  const scrollTimerRef = useRef<number | null>(null);

  const snapToNearest = (element: HTMLDivElement) => {
    const index = Math.max(0, Math.min(salaryOptions.length - 1, Math.round(element.scrollTop / 48)));
    onChange(salaryOptions[index]);
    element.scrollTo({ top: index * 48, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-xs">
      <div className="relative mx-auto h-56 overflow-hidden border-y border-black/20 dark:border-white/20">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-white to-white/0 dark:from-black" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-white to-white/0 dark:from-black" />
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-10 h-12 -translate-y-1/2 border-y border-black/15 dark:border-white/15" />
        <div
          className={`h-full cursor-grab select-none overflow-y-auto py-20 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            isDragging ? '' : 'snap-y snap-mandatory scroll-smooth'
          }`}
          onPointerDown={(event) => {
            if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
            setIsDragging(true);
            dragRef.current = {
              active: true,
              moved: false,
              startY: event.clientY,
              startScrollTop: event.currentTarget.scrollTop,
            };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!dragRef.current.active) return;
            const deltaY = event.clientY - dragRef.current.startY;
            if (Math.abs(deltaY) > 3) dragRef.current.moved = true;
            event.currentTarget.scrollTop = dragRef.current.startScrollTop - deltaY;
          }}
          onPointerUp={(event) => {
            dragRef.current.active = false;
            setIsDragging(false);
            event.currentTarget.releasePointerCapture(event.pointerId);
            snapToNearest(event.currentTarget);
          }}
          onPointerCancel={(event) => {
            dragRef.current.active = false;
            setIsDragging(false);
            snapToNearest(event.currentTarget);
          }}
          onScroll={(event) => {
            const index = Math.max(0, Math.min(salaryOptions.length - 1, Math.round(event.currentTarget.scrollTop / 48)));
            onChange(salaryOptions[index]);
            if (!dragRef.current.active) {
              if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
              const target = event.currentTarget;
              scrollTimerRef.current = window.setTimeout(() => snapToNearest(target), 120);
            }
          }}
        >
          {salaryOptions.map((option) => {
            const selected = value === option;
            return (
              <button
                key={option}
                type="button"
                onClick={(event) => {
                  if (!dragRef.current.moved) {
                    const index = salaryOptions.indexOf(option);
                    onChange(option);
                    event.currentTarget.parentElement?.scrollTo({ top: index * 48, behavior: 'smooth' });
                  }
                }}
                className={`block h-12 w-full snap-center text-center transition-all duration-200 ${
                  selected ? 'text-3xl font-black text-black dark:text-white' : 'text-lg font-bold text-gray-300'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ResumeCard = ({
  language,
  form,
  contactEmail,
  selectedAbility,
  role,
  salary,
}: {
  language: Language;
  form: FormState;
  contactEmail: string;
  selectedAbility: AbilityProfile;
  role: string;
  salary: string;
}) => (
  <article
    id="resume-preview-card"
    className="bg-[#f7f7f3] p-6 text-black shadow-[0_18px_70px_rgba(0,0,0,0.10)] md:p-8"
  >
    <header className="grid gap-6 border-b-2 border-black pb-6 md:grid-cols-[1fr_auto]">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-black/55">
          Tailored Resume
        </p>
        <h3 className="mt-3 text-5xl font-black leading-[0.85] tracking-[-0.06em] md:text-7xl">
          ZHUORAN<br />SONG
        </h3>
      </div>
      <div className="min-w-56 space-y-2 text-xs text-black/70">
        <InfoLine label={label(language, '邮箱', 'Email')} value={contactEmail} />
        <InfoLine label={label(language, '电话', 'Phone')} value="+86 16638843378" />
        <InfoLine label={label(language, '微信', 'WeChat')} value="BDAY23330000" />
        <InfoLine label={label(language, '所在地', 'Base')} value="中国，江苏" />
      </div>
    </header>

    <section className="grid gap-4 border-b border-black/25 py-5 md:grid-cols-3">
      <ResumeMetric label={label(language, '求职意向', 'Target Role')} value={role} />
      <ResumeMetric label={label(language, '薪资范围', 'Salary')} value={salary} />
      <ResumeMetric label={label(language, '意向城市', 'Target City')} value={resumeBase.intentionCity} />
    </section>

    <section className="grid gap-6 border-b border-black/25 py-5 lg:grid-cols-[1fr_0.92fr]">
      <div>
        <SectionTitle>{label(language, '个人简介', 'Profile')}</SectionTitle>
        <p className="text-sm leading-relaxed text-black/72">{selectedAbility.summary}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <ListBlock title={label(language, '擅长能力', 'Strengths')} items={selectedAbility.strengths} />
        <ListBlock title={label(language, '应用软件', 'Software')} items={selectedAbility.software} compact />
      </div>
    </section>

    <TwoColumnSection
      leftTitle={label(language, '工作经历', 'Work Experience')}
      leftItems={resumeBase.work}
      rightTitle={label(language, '项目经历', 'Project Experience')}
      rightItems={selectedAbility.projects}
    />

    <TwoColumnSection
      leftTitle={label(language, '教育经历', 'Education')}
      leftItems={resumeBase.education}
      rightTitle={label(language, '在校经历', 'Campus Experience')}
      rightItems={resumeBase.campus.map((item) => ({ title: item, meta: '', description: '' }))}
    />

    <section className="grid gap-6 border-b border-black/25 py-5 lg:grid-cols-2">
      <ListBlock title={label(language, '技能证书', 'Skills & Certificates')} items={resumeBase.certificates} />
      <ListBlock title={label(language, '荣誉奖项', 'Honors & Awards')} items={resumeBase.awards} />
    </section>

    <section className="pt-5">
      <SectionTitle>{selectedAbility.jd.title}</SectionTitle>
      <div className="grid gap-6 md:grid-cols-2">
        <ListBlock title={label(language, '岗位职责', 'Responsibilities')} items={selectedAbility.jd.responsibilities} />
        <ListBlock title={label(language, '任职要求', 'Requirements')} items={selectedAbility.jd.requirements} />
      </div>
    </section>
  </article>
);

const ResumeMetric = ({ label: metricLabel, value }: { label: string; value: string }) => (
  <div className="border border-black/20 bg-white/55 p-3">
    <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-black/45">{metricLabel}</p>
    <p className="mt-2 text-sm font-black leading-snug">{value}</p>
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h4 className="mb-3 font-mono text-sm font-black uppercase tracking-[0.18em] text-black/55">{children}</h4>
);

const ListBlock = ({ title, items, compact = false }: { title: string; items: string[]; compact?: boolean }) => (
  <div>
    <SectionTitle>{title}</SectionTitle>
    <ul className={`${compact ? 'flex flex-wrap gap-2' : 'space-y-2'} text-sm leading-snug`}>
      {items.map((item) => (
        <li key={item} className={compact ? 'border border-black/15 bg-white/55 px-2 py-1 text-xs font-semibold' : 'flex gap-2 text-black/74'}>
          {!compact && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-black" />}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const TwoColumnSection = ({
  leftTitle,
  leftItems,
  rightTitle,
  rightItems,
}: {
  leftTitle: string;
  leftItems: ResumeItem[];
  rightTitle: string;
  rightItems: ResumeItem[];
}) => (
  <section className="grid gap-6 border-b border-black/25 py-5 lg:grid-cols-2">
    <ResumeItemList title={leftTitle} items={leftItems} />
    <ResumeItemList title={rightTitle} items={rightItems} />
  </section>
);

const ResumeItemList = ({ title, items }: { title: string; items: ResumeItem[] }) => (
  <div>
    <SectionTitle>{title}</SectionTitle>
    <div className="space-y-4">
      {items.map((item) => (
        <div key={`${item.title}-${item.meta}`}>
          <h5 className="text-sm font-black leading-snug">{item.title}</h5>
          {item.meta && <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-black/45">{item.meta}</p>}
          {item.description && <p className="mt-2 text-sm leading-relaxed text-black/70">{item.description}</p>}
        </div>
      ))}
    </div>
  </div>
);

const InfoLine = ({ label: rowLabel, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-2 border-b border-black/15 pb-1">
    <span className="text-black/45">{rowLabel}</span>
    <span className="truncate font-semibold">{value}</span>
  </div>
);

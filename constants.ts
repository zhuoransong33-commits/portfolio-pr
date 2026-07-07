import { ProjectDisplay, Language } from './types';
import { PROJECT_DATA } from './src/data/projects';

export const CATEGORY_LABELS: Record<Language, Record<string, string>> = {
  zh: {
    All: '全部',
    Videography: '动态影像',
    'Graphics & UI': '平面交互',
    Photography: '静态摄影',
    'Environment Design': '环境 / 室内设计',
  },
  en: {
    All: 'All',
    Videography: 'Videography',
    'Graphics & UI': 'Graphics & UI',
    Photography: 'Photography',
    'Environment Design': 'Environment & Interior',
  },
};

export const PROJECTS: Record<Language, ProjectDisplay[]> = {
  zh: PROJECT_DATA.map((project) => ({
    id: project.id,
    ...project.common,
    ...project.zh,
    bilingualTitle: {
      zh: project.zh.title,
      en: project.en.title,
    },
  })),
  en: PROJECT_DATA.map((project) => ({
    id: project.id,
    ...project.common,
    ...project.en,
    bilingualTitle: {
      zh: project.zh.title,
      en: project.en.title,
    },
  })),
};

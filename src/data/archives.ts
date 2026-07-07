import { Language } from '../../types';

export interface ArchivesPageContent {
  title: string;
  description: string;
}

export const ARCHIVES_PAGE_DATA: Record<Language, ArchivesPageContent> = {
  zh: {
    title: '档案',
    description: '根据面试方向生成定制简历，可导出图片或保存为 PDF。'
  },
  en: {
    title: 'Archives',
    description: 'Generate a tailored resume for interviews and export it as an image or PDF.'
  }
};

export type Language = 'zh' | 'en';

export enum Category {
  ALL = 'All',
  VIDEO = 'Videography',
  DESIGN = 'Graphics & UI',
  PHOTO = 'Photography',
  ENVIRONMENT = 'Environment Design',
}

export interface ProjectContent {
  title: string;
  subtitle: string;
  description: string;
  role: string;
  tags: string[];
  awards?: string[];
  concept?: string;
  roleDetail?: string;
}

export interface ProjectCommon {
  category: Category | string;
  image: string;
  figmaUrl?: string;
  pdfUrl?: string;
  gallery?: string[];
  videoUrl?: string;
  bilibiliId?: string;
  externalLink?: string;
  websiteUrl?: string;
  githubUrl?: string;
  date?: string;
  year?: string;
}

export interface Project {
  id: string;
  common: ProjectCommon;
  zh: ProjectContent;
  en: ProjectContent;
}

export interface ProjectDisplay extends ProjectCommon, ProjectContent {
  id: string;
  bilingualTitle?: {
    zh: string;
    en: string;
  };
}

export interface Experience {
  id: string;
  year: string;
  title: string;
  institution: string;
  description: string;
  type: 'education' | 'work';
}

export interface CompetitionGroup {
  level: string;
  awards: string[];
}

export interface HonorsData {
  scholarships: string[];
  titles: string[];
  competitions: CompetitionGroup[];
}

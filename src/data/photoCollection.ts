import { Project } from '../../types';
import { assetPath } from '../utils/assetPath';

export const PHOTO_COLLECTION_DATA: Project[] = [
  {
    id: 'photo-collection-01',
    common: {
      category: 'photo-collection',
      image: assetPath('/works/local/photo-collection/cover.webp'),
      pdfUrl: assetPath('/works/local/photo-collection/摄影集.pdf'),
      year: '2024-2025',
      date: '2024-2025',
    },
    zh: {
      title: '2024-2025影像集',
      subtitle: 'PDF 作品集',
      description: '摄影作品与影像内容整理 PDF 预览。',
      role: '摄影 / 编辑 / 排版',
      tags: ['作品影像集', 'PDF', '作品集'],
      awards: [],
      concept: '以 PDF 形式整理的摄影与影像作品合集，适合在作品集页面中快速预览。',
      roleDetail: '负责摄影作品整理、内容编排与文件输出。',
    },
    en: {
      title: '2024-2025 Image Collection',
      subtitle: 'PDF Portfolio',
      description: 'A PDF preview of photography and image-based works.',
      role: 'Photography / Editing / Layout',
      tags: ['Image Collection', 'PDF', 'Portfolio'],
      awards: [],
      concept: 'A curated collection of photography and image-based works presented as a PDF for quick portfolio review.',
      roleDetail: 'Responsible for image selection, layout, and export.',
    },
  },
  {
    id: 'photo-collection-02',
    common: {
      category: 'photo-collection',
      image: assetPath('/works/local/photo-collection/graduation-defense-cover.webp'),
      pdfUrl: assetPath('/works/local/photo-collection/graduation-defense.pdf'),
      year: '2026',
      date: '2026',
    },
    zh: {
      title: '创意办公空间影像集',
      subtitle: 'PDF 展示文档',
      description: '创意办公空间设计毕业答辩 PDF 预览。',
      role: '设计 / 影像整理 / 文档排版',
      tags: ['创意办公空间', 'PDF', '影像集'],
      awards: [],
      concept: '以答辩展示文档形式整理毕业设计相关内容，集中呈现项目背景、设计过程与最终成果。',
      roleDetail: '负责项目内容组织、视觉材料整理、页面排版与答辩展示文件输出。',
    },
    en: {
      title: 'Creative Office Space Image Collection',
      subtitle: 'PDF Presentation',
      description: 'A PDF preview of the graduation defense presentation.',
      role: 'Design / Image Editing / Layout',
      tags: ['Graduation Defense', 'PDF', 'Image Set'],
      awards: [],
      concept: 'A presentation document organizing graduation project materials, including project context, design process, and final outcomes.',
      roleDetail: 'Responsible for content organization, visual material editing, page layout, and presentation export.',
    },
  },
];

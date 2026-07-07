// Define a shared data structure to ensure media links are always synced
import { VIDEOGRAPHY_DATA } from './videography';
import { DESIGN_DATA } from './design';
import { PHOTO_COLLECTION_DATA } from './photoCollection';

export const PROJECT_DATA = [
  ...PHOTO_COLLECTION_DATA,
  ...VIDEOGRAPHY_DATA,
  ...DESIGN_DATA
];

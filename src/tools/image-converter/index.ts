import { Photo } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
    name: translate('tools.image-converter.title'),
    path: '/image-converter',
    description: translate('tools.image-converter.description'),
    keywords: ['image', 'converter', 'heic', 'jpg', 'png', 'webp', 'avif', 'format'],
    component: () => import('./image-converter.vue'),
    icon: Photo,
    createdAt: new Date('2026-01-21'),
});

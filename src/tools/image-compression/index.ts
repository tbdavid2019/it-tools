import { LayersIntersect } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
    name: translate('tools.image-compression.title'),
    path: '/image-compression',
    description: translate('tools.image-compression.description'),
    keywords: ['image', 'compression', 'compress', 'reduce', 'size', 'optimize', 'jpeg', 'png', 'webp'],
    component: () => import('./image-compression.vue'),
    icon: LayersIntersect,
    createdAt: new Date('2026-01-21'),
});

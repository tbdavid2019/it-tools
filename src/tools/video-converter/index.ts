import { Video } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
    name: translate('tools.video-converter.title'),
    path: '/video-converter',
    description: translate('tools.video-converter.description'),
    keywords: ['video', 'converter', 'trim', 'mp4', 'webm', 'ogg', 'mov', 'avi'],
    component: () => import('./video-converter.vue'),
    icon: Video,
    createdAt: new Date('2026-01-21'),
});

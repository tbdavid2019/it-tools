import { Eraser } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
    name: translate('tools.remove-background.title'),
    path: '/remove-background',
    description: translate('tools.remove-background.description'),
    keywords: ['remove', 'background', 'ai', 'image', 'photo', 'clean', 'transparent'],
    component: () => import('./remove-background.vue'),
    icon: Eraser,
    createdAt: new Date('2026-01-21'),
});

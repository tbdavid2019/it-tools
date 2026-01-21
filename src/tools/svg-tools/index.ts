import { Vector } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
    name: translate('tools.svg-tools.title'),
    path: '/svg-tools',
    description: translate('tools.svg-tools.description'),
    keywords: ['svg', 'vector', 'image', 'edit', 'viewer', 'path', 'code', 'optimize'],
    component: () => import('./svg-tools.vue'),
    icon: Vector,
    createdAt: new Date('2026-01-21'),
});

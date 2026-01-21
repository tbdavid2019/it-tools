import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
    name: translate('tools.pdf-tools.title'),
    path: '/pdf-tools',
    description: translate('tools.pdf-tools.description'),
    keywords: ['pdf', 'merge', 'split', 'rotate', 'compress', 'combine', 'editor'],
    component: () => import('./pdf-tools.vue'),
    icon: FileText,
    createdAt: new Date('2026-01-21'),
});

import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
    name: translate('tools.color-correction.title'),
    path: '/color-correction',
    description: translate('tools.color-correction.description'),
    keywords: ['color', 'correction', 'image', 'photo', 'brightness', 'contrast', 'saturation', 'hue'],
    component: () => import('./color-correction.vue'),
    icon: Palette,
    createdAt: new Date('2026-01-21'),
});

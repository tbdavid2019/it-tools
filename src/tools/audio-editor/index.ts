import { Music } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
    name: translate('tools.audio-editor.title'),
    path: '/audio-editor',
    description: translate('tools.audio-editor.description'),
    keywords: ['audio', 'editor', 'trim', 'cut', 'mp3', 'wav', 'effect', 'fade'],
    component: () => import('./audio-editor.vue'),
    icon: Music,
    createdAt: new Date('2026-01-21'),
});

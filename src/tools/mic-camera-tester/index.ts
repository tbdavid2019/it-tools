import { Video } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
    name: translate('tools.mic-camera-tester.title'),
    path: '/mic-camera-tester',
    description: translate('tools.mic-camera-tester.description'),
    keywords: ['mic', 'microphone', 'camera', 'webcam', 'test', 'preview', 'audio', 'video'],
    component: () => import('./mic-camera-tester.vue'),
    icon: Video,
    createdAt: new Date('2026-01-21'),
});

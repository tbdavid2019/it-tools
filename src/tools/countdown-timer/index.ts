import { Alarm } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.countdown-timer.title'),
  path: '/countdown-timer',
  description: translate('tools.countdown-timer.description'),
  keywords: ['countdown', 'timer', 'clock', 'alarm'],
  component: () => import('./countdown-timer.vue'),
  icon: Alarm,
});

import { Clock } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.world-clock.title'),
  path: '/world-clock',
  description: translate('tools.world-clock.description'),
  keywords: ['world', 'clock', 'timezone', 'time', 'city'],
  component: () => import('./world-clock.vue'),
  icon: Clock,
});

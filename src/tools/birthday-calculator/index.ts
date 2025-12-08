import { Gift } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.birthday-calculator.title'),
  path: '/birthday-calculator',
  description: translate('tools.birthday-calculator.description'),
  keywords: ['birthday', 'age', 'lunar', 'zodiac'],
  component: () => import('./birthday-calculator.vue'),
  icon: Gift,
});

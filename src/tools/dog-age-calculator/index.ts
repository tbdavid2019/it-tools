import { Paw } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.dog-age-calculator.title'),
  path: '/dog-age-calculator',
  description: translate('tools.dog-age-calculator.description'),
  keywords: ['dog', 'age', 'pet'],
  component: () => import('./dog-age-calculator.vue'),
  icon: Paw,
});

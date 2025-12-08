import { Fish } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.cat-age-calculator.title'),
  path: '/cat-age-calculator',
  description: translate('tools.cat-age-calculator.description'),
  keywords: ['cat', 'age', 'pet'],
  component: () => import('./cat-age-calculator.vue'),
  icon: Fish,
});

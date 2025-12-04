import { ArrowsLeftRight } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.tongwen-converter.title'),
  path: '/tongwen-converter',
  description: translate('tools.tongwen-converter.description'),
  keywords: ['tongwen', 'converter', 'simplified', 'traditional', 'chinese'],
  component: () => import('./tongwen-converter.vue'),
  icon: ArrowsLeftRight,
});

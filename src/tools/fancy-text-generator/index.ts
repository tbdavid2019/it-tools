import { Typography } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.fancy-text-generator.title'),
  path: '/fancy-text',
  description: translate('tools.fancy-text-generator.description'),
  keywords: ['fancy', 'font', 'unicode', 'text', 'instagram'],
  component: () => import('./fancy-text-generator.vue'),
  icon: Typography,
});

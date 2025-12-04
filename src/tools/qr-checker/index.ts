import { QrCode } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.qr-checker.title'),
  path: '/qr-checker',
  description: translate('tools.qr-checker.description'),
  keywords: ['qr', 'scan', 'decode', 'image', 'camera'],
  component: () => import('./qr-checker.vue'),
  icon: QrCode,
});

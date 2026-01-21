import { Scan } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
    name: translate('tools.barcode-scanner.title'),
    path: '/barcode-scanner',
    description: translate('tools.barcode-scanner.description'),
    keywords: ['barcode', 'scanner', 'reader', 'camera', 'ean', 'upc', 'code128'],
    component: () => import('./barcode-scanner.vue'),
    icon: Scan,
    createdAt: new Date('2026-01-21'),
});

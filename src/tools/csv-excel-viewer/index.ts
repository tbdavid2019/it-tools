import { Table } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
    name: translate('tools.csv-excel-viewer.title'),
    path: '/csv-excel-viewer',
    description: translate('tools.csv-excel-viewer.description'),
    keywords: ['csv', 'excel', 'xlsx', 'xls', 'viewer', 'table', 'data', 'spreadsheet'],
    component: () => import('./csv-excel-viewer.vue'),
    icon: Table,
    createdAt: new Date('2026-01-21'),
});

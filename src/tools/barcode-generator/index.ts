import { Barcode } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Barcode Generator',
  path: '/barcode-generator',
  description: 'Advanced barcode generator supporting PDF417, Code 128, QR Code, Data Matrix and many more with full customization.',
  keywords: ['barcode', 'generator', 'bwip-js', 'pdf417', 'qrcode', 'datamatrix', 'ean13'],
  component: () => import('./barcode-generator.vue'),
  icon: Barcode,
  createdAt: new Date('2025-12-31'),
});
import { defineThemes } from '../theme/theme.models';

export const { useTheme } = defineThemes({
  dark: {
    backgroundColor: 'rgba(35, 35, 35, 0.7)',
    borderColor: 'rgba(40, 40, 40, 0.5)',
  },
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderColor: 'rgba(239, 239, 245, 0.5)',
  },
});

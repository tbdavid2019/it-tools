export type PetSize = 'small' | 'medium' | 'large';

export const baseGrowthPoints = [
  { months: 0, humanMonths: 0 },
  { months: 1, humanMonths: 6 }, // 6 months human
  { months: 3, humanMonths: 48 }, // 4 years human
  { months: 6, humanMonths: 108 }, // 9 years human
  { months: 12, humanMonths: 180 }, // 15 years human
  { months: 24, humanMonths: 288 }, // 24 years human
];

export function normalizePetMonths(years: number | null | undefined, months: number | null | undefined) {
  const safeYears = Number.isFinite(years as number) ? Math.max(0, Number(years)) : 0;
  const safeMonths = Number.isFinite(months as number) ? Math.min(11, Math.max(0, Number(months))) : 0;
  return safeYears * 12 + safeMonths;
}

export function calculateHumanMonthsFromPetAge(totalPetMonths: number, factorAfterTwoYears: number) {
  const months = Math.max(0, totalPetMonths);

  if (months <= 24) {
    const points = baseGrowthPoints;
    for (let i = 0; i < points.length - 1; i += 1) {
      const current = points[i];
      const next = points[i + 1];
      if (months <= next.months) {
        const ratio = (months - current.months) / (next.months - current.months || 1);
        return current.humanMonths + ratio * (next.humanMonths - current.humanMonths);
      }
    }
  }

  const extraMonths = months - 24;
  return baseGrowthPoints[baseGrowthPoints.length - 1].humanMonths + extraMonths * factorAfterTwoYears;
}

export function toYearsAndMonths(humanMonths: number) {
  const rounded = Math.round(humanMonths);
  const years = Math.floor(rounded / 12);
  const months = rounded % 12;
  return { years, months };
}

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { calculateHumanMonthsFromPetAge, normalizePetMonths, toYearsAndMonths } from '../pet-age-calculator/pet-age';

const { t } = useI18n();
const years = ref<number | null>(0);
const months = ref<number | null>(0);

const result = computed(() => {
  const totalMonths = normalizePetMonths(years.value, months.value);
  const humanMonths = calculateHumanMonthsFromPetAge(totalMonths, 4);
  const breakdown = toYearsAndMonths(humanMonths);

  return {
    humanYears: breakdown.years,
    humanMonths: breakdown.months,
    humanMonthsRaw: humanMonths,
  };
});

function reset() {
  years.value = 0;
  months.value = 0;
}

function recalculate() {
  years.value = years.value ?? 0;
  months.value = months.value ?? 0;
}
</script>

<template>
  <c-card>
    <n-space vertical size="large">
      <n-form label-placement="top" label-width="auto">
        <n-form-item :label="t('tools.cat-age-calculator.fields.age')" path="age">
          <n-space>
            <n-input-number v-model:value="years" :min="0" :max="40" :precision="0" />
            <span>{{ t('tools.cat-age-calculator.units.years') }}</span>
            <n-input-number v-model:value="months" :min="0" :max="11" :precision="0" />
            <span>{{ t('tools.cat-age-calculator.units.months') }}</span>
          </n-space>
        </n-form-item>
        <n-form-item>
          <n-space>
            <c-button type="primary" @click="recalculate">{{ t('tools.cat-age-calculator.actions.calculate') }}</c-button>
            <c-button quaternary @click="reset">{{ t('tools.cat-age-calculator.actions.reset') }}</c-button>
          </n-space>
        </n-form-item>
      </n-form>

      <n-card size="small" :title="t('tools.cat-age-calculator.resultTitle')">
        <div class="result-row">
          <div class="result-value">
            {{ result.humanYears }}
            <span class="unit">{{ t('tools.cat-age-calculator.units.years') }}</span>
          </div>
          <div class="result-value">
            {{ result.humanMonths }}
            <span class="unit">{{ t('tools.cat-age-calculator.units.months') }}</span>
          </div>
        </div>
        <div class="hint">
          {{ t('tools.cat-age-calculator.subtitle', { months: result.humanMonthsRaw.toFixed(1) }) }}
        </div>
      </n-card>
    </n-space>
  </c-card>
</template>

<style scoped>
.result-row {
  display: flex;
  gap: 24px;
  align-items: baseline;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.result-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.unit {
  font-size: 14px;
  color: var(--text-color-2);
  font-weight: 500;
}

.hint {
  color: var(--text-color-3);
}
</style>

'use client';

import { Field, Select } from '@/components/ui/input';
import { LANGUAGES } from '@/constants/options';
import { usePreferencesStore } from '@/store/preferences-store';

export function PreferencesForm() {
  const { language, compactCharts, setLanguage, setCompactCharts } = usePreferencesStore();

  return (
    <div className="space-y-5">
      <Field label="Language">
        <Select value={language} onChange={(event) => setLanguage(event.target.value)}>
          {LANGUAGES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </Field>
      <label className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
        <span>
          <span className="block text-sm font-medium text-ink">Compact chart density</span>
          <span className="mt-1 block text-sm text-muted">Reduce visual height for dense operational review.</span>
        </span>
        <input
          type="checkbox"
          checked={compactCharts}
          onChange={(event) => setCompactCharts(event.target.checked)}
          className="h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
        />
      </label>
    </div>
  );
}

// utils/generateUiSchema.ts
import type { UiSchema } from '@rjsf/utils';

export function generateUiSchema(schema: any): UiSchema {
  const ui: UiSchema = {};

  Object.entries(schema.properties || {}).forEach(([key, prop]: [string, any]) => {
    const extra = prop['json_schema_extra'] || prop['x-options'] || {}; // поддержка разных имён

    // Кастомный виджет явно указан
    if (prop['ui:widget'] || extra['ui:widget']) {
      ui[key] = { 'ui:widget': prop['ui:widget'] || extra['ui:widget'] };
    }

    // Foreign key → одиночная ссылка
    if (prop['x-foreign-key'] || extra['x-foreign-key']) {
      ui[key] = {
        'ui:widget': 'ReferenceWidget',
        'ui:options': {
          foreignModel: prop['x-foreign-key'] || extra['x-foreign-key'],
          // можно добавить labelField: "name", valueField: "id" и т.д.
        }
      };
    }

    // Массив foreign key → множественный выбор
    if (prop.type === 'array' && prop.items && (prop.items['x-foreign-key'] || prop.items?.json_schema_extra?.['x-foreign-key'])) {
      ui[key] = {
        'ui:widget': 'MultiReferenceWidget',
        'ui:options': {
          foreignModel: prop.items['x-foreign-key'] || prop.items?.json_schema_extra?.['x-foreign-key'],
        }
      };
    }

    // Другие часто используемые улучшения
    if (prop.format === 'date' || prop.format === 'date-time') {
      ui[key] = { ...ui[key], 'ui:widget': 'alt-datetime' };
    }
    if (prop['ui:placeholder']) {
      (ui[key] || (ui[key] = {}) as any)['ui:placeholder'] = prop['ui:placeholder'];
    }
  });

  return ui;
}
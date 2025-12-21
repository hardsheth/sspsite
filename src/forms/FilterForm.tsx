import React, { useEffect } from 'react';
import moment from 'moment';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import DatePickerMUI from 'components/InputElements/DatePickerMUI';
import { FILTER_FIELDS } from 'utils/FilterOrderParams';

type FilterFormValues = {
  filters: {
    condition: 'include' | 'exclude';
    field: string;
    operator: string;
    value: any;
  }[];
};

const DEFAULT_VALUE_BY_TYPE: Record<string, any> = {
  text: '',
  number: '',
  select: '',
  date: null,
};

const FilterForm = () => {
  const methods = useForm<FilterFormValues>({
    defaultValues: {
      filters: [
        {
          condition: 'include',
          field: 'paymentStatus',
          operator: '=',
          value: 'pending',
        },
      ],
    },
  });

  const { register, control, handleSubmit, setValue } = methods;

  // Watch selected field
  const selectedField = useWatch({
    control,
    name: 'filters.0.field',
  });

  const fieldConfig = FILTER_FIELDS[selectedField];

  /**
   * 🔐 CRITICAL FIX
   * Reset value whenever field changes
   * Prevents invalid value types reaching DatePicker
   */
  useEffect(() => {
    if (!fieldConfig) return;

    const safeValue = DEFAULT_VALUE_BY_TYPE[fieldConfig.type];
    setValue('filters.0.value', safeValue);
  }, [selectedField, fieldConfig, setValue]);

  const onSubmit = (data: FilterFormValues) => {
    // Convert moment → ISO before API call
    const payload = {
      ...data,
      filters: data.filters.map(f => ({
        ...f,
        value: moment.isMoment(f.value)
          ? f.value.toISOString()
          : f.value,
      })),
    };

    console.log('Filter Payload:', payload);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row align-items-end g-2">

          {/* Condition */}
          <div className="col-md-2">
            <label className="form-label">Condition</label>
            <select className="form-select" {...register('filters.0.condition')}>
              <option value="include">Include</option>
              <option value="exclude">Exclude</option>
            </select>
          </div>

          {/* Field */}
          <div className="col-md-3">
            <label className="form-label">Field</label>
            <select className="form-select" {...register('filters.0.field')}>
              {Object.keys(FILTER_FIELDS).map(key => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          {/* Operator */}
          <div className="col-md-2">
            <label className="form-label">Operator</label>
            <select className="form-select" {...register('filters.0.operator')}>
              <option value="=">=</option>
              <option value="!=">!=</option>

              {fieldConfig?.type === 'number' && (
                <>
                  <option value=">">{'>'}</option>
                  <option value="<">{'<'}</option>
                  <option value=">=">{'>='}</option>
                  <option value="<=">{'<='}</option>
                </>
              )}

              {fieldConfig?.type === 'date' && (
                <>
                  <option value="before">Before</option>
                  <option value="after">After</option>
                </>
              )}

              {fieldConfig?.type === 'text' && (
                <option value="contains">Contains</option>
              )}
            </select>
          </div>

          {/* Value */}
          <div className="col-md-3">
            <label className="form-label">Value</label>

            {/* DATE */}
            {fieldConfig?.type === 'date' && (
              <DatePickerMUI
                name="filters.0.value"
                control={control}
                placeholder="Select date"
                minDate={moment('2024-01-01')}
              />
            )}

            {/* SELECT */}
            {fieldConfig?.type === 'select' && (
              <select className="form-select" {...register('filters.0.value')}>
                {fieldConfig.options.map((opt: string) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {/* TEXT / NUMBER */}
            {(fieldConfig?.type === 'text' ||
              fieldConfig?.type === 'number') && (
                <input
                  type={fieldConfig.type === 'number' ? 'number' : 'text'}
                  className="form-control"
                  {...register('filters.0.value')}
                />
              )}
          </div>
        </div>

        <div className="mt-3">
          <button type="submit" className="btn btn-primary">
            Filter
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default FilterForm;

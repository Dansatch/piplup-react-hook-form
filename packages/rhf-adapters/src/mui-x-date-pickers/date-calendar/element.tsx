import * as React from 'react';
import { DateCalendar, type DateCalendarProps, type PickerValidDate } from '@mui/x-date-pickers';
import { type Transform } from '@piplup/rhf-core';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { useMuiXDateCalendarAdapter, type UseMuiXDateCalendarAdapterProps } from './adapter';

export type MuiXDateCalendarElementProps<
  TTransformedValue extends PickerValidDate,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<DateCalendarProps, 'defaultValue' | 'maxDate' | 'minDate' | 'name' | 'value'> &
  Omit<
    UseMuiXDateCalendarAdapterProps<TTransformedValue, TFieldValues, TName>,
    | 'classes'
    | 'composeClassName'
    | 'composeHelperText'
    | 'helperText'
    | 'helperText'
    | 'onChange'
    | 'slotProps'
    | 'transform'
  > & {
    /**
     * Transformation functions for the field's input and output values.
     */
    transform?: Transform<DateCalendarProps['onChange'], TTransformedValue, TFieldValues, TName>;
  };

function MuiXDateCalendarComponent<
  TTransformedValue extends PickerValidDate,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: MuiXDateCalendarElementProps<TTransformedValue, TFieldValues, TName>,
  ref?: React.Ref<HTMLDivElement>,
): React.ReactElement {
  const {
    className,
    control,
    defaultValue,
    disabled,
    disableFuture,
    disableOnError,
    disableOnIsSubmitting,
    disablePast,
    error,
    errorParser,
    maxDate,
    messages,
    minDate,
    name,
    onBlur,
    onChange,
    required,
    rules,
    shouldDisableDate,
    shouldDisableMonth,
    shouldDisableYear,
    shouldUnregister,
    style,
    timezone,
    transform,
    ...rest
  } = props;

  // DateCalendar has no `error` or `helperText` prop, so keep them off the DOM.
  const {
    error: _error,
    helperText: _helperText,
    ...adapter
  } = useMuiXDateCalendarAdapter(
    {
      classes: undefined,
      className,
      composeClassName: false,
      composeHelperText: true,
      control,
      defaultValue,
      disabled,
      disableFuture,
      disableOnError,
      disableOnIsSubmitting,
      disablePast,
      error,
      errorParser,
      helperText: undefined,
      maxDate,
      messages,
      minDate,
      name,
      onBlur,
      onChange,
      required,
      rules,
      shouldDisableDate,
      shouldDisableMonth,
      shouldDisableYear,
      shouldUnregister,
      style,
      timezone,
      transform,
    },
    ref,
  );

  return <DateCalendar {...rest} {...adapter} />;
}

export const MuiXDateCalendarElement = React.forwardRef(
  MuiXDateCalendarComponent,
) as typeof MuiXDateCalendarComponent & { displayName?: string };

if (process.env.NODE_ENV !== 'production') {
  MuiXDateCalendarElement.displayName = 'MuiXDateCalendarElement';
}

import * as React from 'react';
import { MonthCalendar, type MonthCalendarProps, type PickerValidDate } from '@mui/x-date-pickers';
import { type Transform } from '@piplup/rhf-core';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { type UseMuiXMonthCalendarAdapterProps, useMuiXMonthCalendarAdapter } from './adapter';

export type MuiXMonthCalendarElementProps<
  TTransformedValue extends PickerValidDate,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<MonthCalendarProps, 'defaultValue' | 'maxDate' | 'minDate' | 'name' | 'value'> &
  Omit<
    UseMuiXMonthCalendarAdapterProps<TTransformedValue, TFieldValues, TName>,
    | 'classes'
    | 'composeClassName'
    | 'composeHelperText'
    | 'helperText'
    | 'onChange'
    | 'slotProps'
    | 'transform'
  > & {
    /**
     * Transformation functions for the field's input and output values.
     */
    transform?: Transform<MonthCalendarProps['onChange'], TTransformedValue, TFieldValues, TName>;
  };

function MuiXMonthCalendarComponent<
  TTransformedValue extends PickerValidDate,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: MuiXMonthCalendarElementProps<TTransformedValue, TFieldValues, TName>,
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
    shouldDisableMonth,
    shouldUnregister,
    style,
    timezone,
    transform,
    ...rest
  } = props;

  // MonthCalendar has no `error`, `helperText`, `shouldDisableDate` or `shouldDisableYear` prop,
  // so keep them off the DOM.
  const {
    error: _error,
    helperText: _helperText,
    shouldDisableDate: _shouldDisableDate,
    shouldDisableYear: _shouldDisableYear,
    ...adapter
  } = useMuiXMonthCalendarAdapter(
    {
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
      maxDate,
      messages,
      minDate,
      name,
      onBlur,
      onChange,
      required,
      rules,
      shouldDisableMonth,
      shouldUnregister,
      style,
      timezone,
      transform,
    },
    ref,
  );

  return <MonthCalendar {...rest} {...adapter} />;
}

export const MuiXMonthCalendarElement = React.forwardRef(
  MuiXMonthCalendarComponent,
) as typeof MuiXMonthCalendarComponent & { displayName?: string };

if (process.env.NODE_ENV !== 'production') {
  MuiXMonthCalendarElement.displayName = 'MuiXMonthCalendarElement';
}

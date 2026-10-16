import * as React from 'react';
import { FilledInput, type FilledInputProps } from '@mui/material';
import { type Transform } from '@piplup/rhf-core';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { type UseMuiFilledInputAdapterProps, useMuiFilledInputAdapter } from './adapter';

export interface MuiFilledInputElementProps<
  TTransformedValue,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>
  extends
    Omit<
      FilledInputProps,
      'checked' | 'defaultChecked' | 'defaultValue' | 'name' | 'style' | 'value'
    >,
    Omit<
      UseMuiFilledInputAdapterProps<TTransformedValue, TFieldValues, TName>,
      | 'classes'
      | 'composeClassName'
      | 'composeHelperText'
      | 'errorParser'
      | 'helperText'
      | 'onBlur'
      | 'onChange'
      | 'transform'
    > {
  /**
   * Transformation functions for the field's input and output values.
   */
  transform?: Transform<FilledInputProps['onChange'], TTransformedValue, TFieldValues, TName>;
}

function MuiFilledInputComponent<
  TTransformedValue,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: MuiFilledInputElementProps<TTransformedValue, TFieldValues, TName>,
  ref?: FilledInputProps['ref'],
): React.ReactElement {
  const {
    checked,
    classes,
    className,
    control,
    defaultValue,
    disabled,
    disableOnError,
    disableOnIsSubmitting,
    error,
    indeterminate,
    inputRef,
    max,
    maxLength,
    messages,
    min,
    minLength,
    name,
    onBlur,
    onChange,
    pattern,
    required,
    rules,
    shouldUnregister,
    style,
    title,
    transform,
    type,
    value,
    ...rest
  } = props;

  const {
    helperText: _helperText,
    ref: fieldInputRef,
    ...adapter
  } = useMuiFilledInputAdapter(
    {
      checked,
      classes,
      className,
      composeClassName: false,
      composeHelperText: false,
      control,
      defaultValue,
      disabled,
      disableOnError,
      disableOnIsSubmitting,
      error,
      indeterminate,
      max,
      maxLength,
      messages,
      min,
      minLength,
      name,
      onBlur,
      onChange,
      pattern,
      required,
      rules,
      shouldUnregister,
      style,
      title,
      transform,
      type,
      value,
    },
    // Merge the field ref with any user `inputRef` so React Hook Form can focus the <input>.
    inputRef,
  );

  return <FilledInput {...rest} {...adapter} inputRef={fieldInputRef} ref={ref} />;
}

export const MuiFilledInputElement = React.forwardRef(
  MuiFilledInputComponent,
) as typeof MuiFilledInputComponent & {
  displayName?: string;
};

if (process.env.NODE_ENV !== 'production') {
  MuiFilledInputElement.displayName = 'MuiFilledInputElement';
}

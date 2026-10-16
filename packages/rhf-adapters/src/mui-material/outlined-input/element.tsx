import * as React from 'react';
import { OutlinedInput, type OutlinedInputProps } from '@mui/material';
import { type Transform } from '@piplup/rhf-core';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { type UseMuiOutlinedInputAdapterProps, useMuiOutlinedInputAdapter } from './adapter';

export interface MuiOutlinedInputElementProps<
  TTransformedValue,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>
  extends
    Omit<
      OutlinedInputProps,
      'checked' | 'defaultChecked' | 'defaultValue' | 'name' | 'style' | 'value'
    >,
    Omit<
      UseMuiOutlinedInputAdapterProps<TTransformedValue, TFieldValues, TName>,
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
  transform?: Transform<OutlinedInputProps['onChange'], TTransformedValue, TFieldValues, TName>;
}

function MuiOutlinedInputComponent<
  TTransformedValue,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: MuiOutlinedInputElementProps<TTransformedValue, TFieldValues, TName>,
  ref?: OutlinedInputProps['ref'],
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
  } = useMuiOutlinedInputAdapter(
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

  return <OutlinedInput {...rest} {...adapter} inputRef={fieldInputRef} ref={ref} />;
}

export const MuiOutlinedInputElement = React.forwardRef(
  MuiOutlinedInputComponent,
) as typeof MuiOutlinedInputComponent & {
  displayName?: string;
};

if (process.env.NODE_ENV !== 'production') {
  MuiOutlinedInputElement.displayName = 'MuiOutlinedInputElement';
}

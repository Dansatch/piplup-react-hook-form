import * as React from 'react';
import { Input, type InputProps } from '@mui/material';
import { type Transform } from '@piplup/rhf-core';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { type UseMuiInputAdapterProps, useMuiInputAdapterProps } from './adapter';

export interface MuiInputElementProps<
  TTransformedValue,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>
  extends
    Omit<InputProps, 'checked' | 'defaultChecked' | 'defaultValue' | 'name' | 'style' | 'value'>,
    Omit<
      UseMuiInputAdapterProps<TTransformedValue, TFieldValues, TName>,
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
  transform?: Transform<InputProps['onChange'], TTransformedValue, TFieldValues, TName>;
}

function MuiInputComponent<
  TTransformedValue,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: MuiInputElementProps<TTransformedValue, TFieldValues, TName>,
  ref?: InputProps['ref'],
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
  } = useMuiInputAdapterProps(
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

  return <Input {...rest} {...adapter} inputRef={fieldInputRef} ref={ref} />;
}

export const MuiInputElement = React.forwardRef(MuiInputComponent) as typeof MuiInputComponent & {
  displayName?: string;
};

if (process.env.NODE_ENV !== 'production') {
  MuiInputElement.displayName = 'MuiInputElement';
}

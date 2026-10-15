import * as React from 'react';
import { InputBase, type InputBaseProps } from '@mui/material';
import { type Transform } from '@piplup/rhf-core';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { type UseMuiInputBaseAdapterProps, useMuiInputBaseAdapter } from './adapter';

export interface MuiInputBaseElementProps<
  TTransformedValue,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>
  extends
    Omit<
      InputBaseProps,
      'checked' | 'defaultChecked' | 'defaultValue' | 'name' | 'style' | 'value'
    >,
    Omit<
      UseMuiInputBaseAdapterProps<TTransformedValue, TFieldValues, TName>,
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
  transform?: Transform<InputBaseProps['onChange'], TTransformedValue, TFieldValues, TName>;
}

function MuiInputBaseComponent<
  TTransformedValue,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: MuiInputBaseElementProps<TTransformedValue, TFieldValues, TName>,
  ref?: InputBaseProps['ref'],
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
  } = useMuiInputBaseAdapter(
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

  return <InputBase {...rest} {...adapter} inputRef={fieldInputRef} ref={ref} />;
}

export const MuiInputBaseElement = React.forwardRef(
  MuiInputBaseComponent,
) as typeof MuiInputBaseComponent & {
  displayName?: string;
};

if (process.env.NODE_ENV !== 'production') {
  MuiInputBaseElement.displayName = 'MuiInputBaseElement';
}

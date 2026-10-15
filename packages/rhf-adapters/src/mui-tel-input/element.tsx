import * as React from 'react';
import { type Transform } from '@piplup/rhf-core';
import { MuiTelInput } from 'mui-tel-input';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { type UseMuiTelInputAdapterProps, useMuiTelInputAdapter } from './adapter';

type MuiTelInputProps = React.ComponentProps<typeof MuiTelInput>;

export type MuiTelInputElementProps<
  TTransformedValue extends string,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  MuiTelInputProps,
  'checked' | 'defaultChecked' | 'defaultValue' | 'name' | 'style' | 'value'
> &
  Omit<
    UseMuiTelInputAdapterProps<TTransformedValue, TFieldValues, TName>,
    'composeHelperText' | 'onBlur' | 'onChange' | 'transform'
  > & {
    /**
     * Transformation functions for the field's input and output values.
     */
    transform?: Transform<MuiTelInputProps['onChange'], TTransformedValue, TFieldValues, TName>;
  };

function MuiTelInputComponent<
  TTransformedValue extends string,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: MuiTelInputElementProps<TTransformedValue, TFieldValues, TName>,
  ref?: MuiTelInputProps['ref'],
): React.ReactElement {
  const {
    className,
    control,
    defaultValue,
    disabled,
    disableOnError,
    disableOnIsSubmitting,
    error,
    errorParser,
    helperText,
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
    ...rest
  } = props;

  // `adapter` includes `inputRef` (field ref merged with the user's) and `ref` (the forwarded ref).
  // MuiTelInput merges `inputRef` with its own, so React Hook Form can focus the <input>.
  const adapter = useMuiTelInputAdapter(
    {
      className,
      composeHelperText: true,
      control,
      defaultValue,
      disabled,
      disableOnError,
      disableOnIsSubmitting,
      error,
      errorParser,
      helperText,
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
    },
    ref,
  );

  return <MuiTelInput {...(rest as MuiTelInputProps)} {...adapter} />;
}

export const MuiTelInputElement = React.forwardRef(
  MuiTelInputComponent,
) as typeof MuiTelInputComponent & { displayName?: string };

MuiTelInputElement.displayName = 'MuiTelInputElement';

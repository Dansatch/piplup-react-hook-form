import * as React from 'react';
import { useControllerAdapter, type UseControllerAdapterProps } from '@piplup/rhf-core';
import { forkRef } from '@piplup/utils';
import { type MuiOtpInputProps } from 'mui-one-time-password-input';
import { type PathValue, type FieldPath, type FieldValues } from 'react-hook-form';

export interface UseMuiOtpInputAdapterProps<
  TTransformedValue,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<
  UseControllerAdapterProps<TTransformedValue, TFieldValues, TName>,
  'classes' | 'composeClassName' | 'internalClasses'
> {
  TextFieldsProps?: MuiOtpInputProps['TextFieldsProps'];
}

interface UseMuiOtpInputAdapterResult<
  TTransformedValue,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  RefType = unknown,
> {
  className?: string;
  disabled: boolean;
  helperText: React.ReactNode;
  name: TName;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onBlur: (...args: any[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (...args: any[]) => void;
  ref?: React.Ref<RefType>;
  required?: boolean;
  style?: React.CSSProperties;
  TextFieldsProps: MuiOtpInputProps['TextFieldsProps'];
  title?: string;
  value: TTransformedValue;
}

export function useMuiOtpInputAdapter<
  TTransformedValue,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  RefType = unknown,
>(
  props: UseMuiOtpInputAdapterProps<TTransformedValue, TFieldValues, TName>,
  ref?: React.Ref<RefType>,
): UseMuiOtpInputAdapterResult<TTransformedValue, TFieldValues, TName, RefType> {
  const { TextFieldsProps, transform, ...rest } = props;

  const internalTransform = React.useMemo<
    Exclude<
      UseControllerAdapterProps<TTransformedValue, TFieldValues, TName>['transform'],
      undefined
    >
  >(
    () => ({
      input(value: PathValue<TFieldValues, TName>) {
        return value as TTransformedValue;
      },
      output(value: TTransformedValue) {
        return value as PathValue<TFieldValues, TName>;
      },
    }),
    [],
  );

  const {
    error,
    ref: adapterRef,
    ...adapter
  } = useControllerAdapter<TTransformedValue, TFieldValues, TName>({
    ...rest,
    classes: undefined,
    composeClassName: false,
    transform: {
      ...internalTransform,
      ...transform,
    },
  });

  return {
    ...adapter,
    ref,
    TextFieldsProps(index: number) {
      const textFieldsProps =
        typeof TextFieldsProps === 'function' ? TextFieldsProps(index) : TextFieldsProps;
      return {
        ...textFieldsProps,
        error: error || !!textFieldsProps?.error,
        // React Hook Form keeps one ref per field, so attach it to the first box: focusing the
        // field on error moves the caret to the start of the code. MuiOtpInput merges this
        // `inputRef` with its own (fixed upstream in mui-one-time-password-input 3.0.1).
        ...(index === 0 && {
          inputRef: forkRef(textFieldsProps?.inputRef, adapterRef),
        }),
      };
    },
  };
}

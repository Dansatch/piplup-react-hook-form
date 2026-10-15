import {
  type Control,
  type FieldPath,
  get,
  useFormState,
  type ControllerFieldState,
  type FieldValues,
} from 'react-hook-form';

/**
 * Defines the properties for the `useFieldState` hook.
 */
export type UseFieldStateProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  /** The control object from react-hook-form. */
  control?: Control<TFieldValues>;
  /** Indicates whether the field is disabled. */
  disabled?: boolean;
  /** The name of the field. */
  name: TName;
};

/**
 * Defines the return type of the `useFieldState` hook.
 */
export type UseFieldStateReturn = ControllerFieldState & {
  /** Indicates whether the field is disabled. */
  disabled: boolean;
  /** Indicates whether the form is currently being submitted. */
  isSubmitting: boolean;
};

/**
 * Hook to get the state of a specific field in a react-hook-form.
 *
 * @see {@link https://github.com/react-hook-form/react-hook-form/blob/master/src/useController.ts#L173} for more information.
 *
 * @param props - The properties for the field state hook.
 * @returns The state of the field including its validation status, dirtiness, touched state, and errors.
 */
export function useFieldState<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: UseFieldStateProps<TFieldValues, TName>): UseFieldStateReturn {
  const { control, disabled, name } = props;

  const formState = useFormState<TFieldValues>({
    control,
    disabled,
    name,
  });

  return Object.defineProperties(
    {},
    {
      // Added `disabled` and `isSubmitting` property which is not present in `fieldState` object in react-hook-form
      disabled: {
        enumerable: true,
        get: () =>
          typeof formState.disabled === 'boolean' || typeof disabled === 'boolean'
            ? formState.disabled || disabled
            : undefined,
      },
      error: {
        enumerable: true,
        get: () => get(formState.errors, name),
      },
      invalid: {
        enumerable: true,
        get: () => !!get(formState.errors, name),
      },
      isDirty: {
        enumerable: true,
        get: () => !!get(formState.dirtyFields, name),
      },
      isSubmitting: {
        enumerable: true,
        get: () => formState.isSubmitting,
      },
      isTouched: {
        enumerable: true,
        get: () => !!get(formState.touchedFields, name),
      },
      isValidating: {
        enumerable: true,
        get: () => !!get(formState.validatingFields, name),
      },
    },
  ) as UseFieldStateReturn;
}

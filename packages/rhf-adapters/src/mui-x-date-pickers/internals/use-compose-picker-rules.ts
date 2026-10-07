import * as React from 'react';
import {
  type Validator,
  type PickersTimezone,
  type PickerValidDate,
  usePickerAdapter,
} from '@mui/x-date-pickers';

import { getMessage } from '@piplup/rhf-core';
import { type FieldPath, type FieldValues, type RegisterOptions } from 'react-hook-form';

/**
 * Customizable rules messages.
 */
export type ComposePickerRulesMessages<TPickValidDate extends null | PickerValidDate> = {
  disableFuture?: ((date: TPickValidDate) => string) | string;
  disablePast?: ((date: TPickValidDate) => string) | string;
  invalidDate?: (date: TPickValidDate) => string;
  maxDate?: ((date: TPickValidDate, maxDate?: TPickValidDate) => string) | string;
  maxTime?: ((date: TPickValidDate, maxTime?: TPickValidDate) => string) | string;
  minDate?: ((date: TPickValidDate, minDate?: TPickValidDate) => string) | string;
  minTime?: ((date: TPickValidDate, minTime?: TPickValidDate) => string) | string;
  minutesStep?: ((date: TPickValidDate, minutesStep?: number) => string) | string;
  shouldDisableDate?: ((date: TPickValidDate) => string) | string;
  shouldDisableMonth?: ((date: TPickValidDate) => string) | string;
  'shouldDisableTime-hours'?: ((date: TPickValidDate) => string) | string;
  'shouldDisableTime-minutes'?: ((date: TPickValidDate) => string) | string;
  'shouldDisableTime-seconds'?: ((date: TPickValidDate) => string) | string;
  shouldDisableYear?: ((date: TPickValidDate) => string) | string;
};

export interface UseComposePickerRules<
  TTransformedValue extends null | PickerValidDate,
  TError,
  TValidationProps extends {},
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  /**
   * Override internal error message with your own custom error message.
   */
  messages?: ComposePickerRulesMessages<TTransformedValue>;
  /**
   * Validation rules object. Refer react-hook-form documentation [here](https://www.react-hook-form.com/api/usecontroller/controller/).
   */
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'disabled' | 'setValueAs' | 'valueAsDate' | 'valueAsNumber'
  >;

  /**
   * Choose which timezone to use for the value. Example: "default", "system", "UTC", "America/New_York". If you pass values from other timezones to some props, they will be converted to this timezone before being used.
   *
   * See the [timezones documentation](https://mui.com/x/react-date-pickers/timezone/) for more details.
   */
  timezone?: PickersTimezone;
  /**
   * Props to be passed to the validator function.
   */
  validationProps: TValidationProps;
  /**
   * `validateDate`, `validateTime` or `validateDateTime` function for performing date and time related validations.
   */
  validator: Validator<TTransformedValue, TError, TValidationProps>;
}

export function useUnstableComposePickerRules<
  TTransformedValue extends null | PickerValidDate,
  TError,
  TValidationProps extends {},
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: UseComposePickerRules<TTransformedValue, TError, TValidationProps, TFieldValues, TName>) {
  const { messages, rules: rulesProp = {}, timezone, validationProps, validator } = props;

  const adapter = usePickerAdapter();

  const errorMessages: Required<NonNullable<ComposePickerRulesMessages<TTransformedValue>>> =
    React.useMemo(
      () => ({
        disableFuture: (date: TTransformedValue) =>
          getMessage(messages?.disableFuture ?? 'Future date is not allowed', date),
        disablePast: (date: TTransformedValue) =>
          getMessage(messages?.disablePast ?? 'Past date is not allowed', date),
        invalidDate: (date: TTransformedValue) =>
          getMessage(messages?.invalidDate ?? 'Date is not a valid date', date),
        maxDate: (date: TTransformedValue) =>
          getMessage(
            messages?.maxDate ?? 'Date should be earlier than the maximum allowed date',
            date,
            'maxDate' in validationProps ? validationProps.maxDate : undefined,
          ),
        maxTime: (date: TTransformedValue) =>
          getMessage(
            messages?.maxTime ?? 'Time is later than the maximum allowed time',
            date,
            'maxTime' in validationProps ? validationProps.maxTime : undefined,
          ),
        minDate: (date: TTransformedValue) =>
          getMessage(
            messages?.minDate ?? 'Date must be later than the minimum allowed date',
            date,
            'minDate' in validationProps ? validationProps.minDate : undefined,
          ),
        minTime: (date: TTransformedValue) => {
          return getMessage(
            messages?.minTime ?? 'Time is earlier than the minimum allowed time',
            date,
            'minTime' in validationProps ? validationProps.minTime : undefined,
          );
        },
        minutesStep: (date: TTransformedValue) =>
          getMessage(
            messages?.minutesStep ?? 'Minute step is not valid',
            date,
            'minutesStep' in validationProps ? validationProps.minutesStep : undefined,
          ),
        shouldDisableDate: (date: TTransformedValue) =>
          getMessage(messages?.shouldDisableDate ?? 'Date is not allowed', date),
        shouldDisableMonth: (date: TTransformedValue) =>
          getMessage(messages?.shouldDisableMonth ?? 'Month is not allowed', date),
        'shouldDisableTime-hours': (date: TTransformedValue) =>
          getMessage(messages?.['shouldDisableTime-hours'] ?? 'Hour is disabled', date),
        'shouldDisableTime-minutes': (date: TTransformedValue) =>
          getMessage(messages?.['shouldDisableTime-minutes'] ?? 'Minute is disabled', date),
        'shouldDisableTime-seconds': (date: TTransformedValue) =>
          getMessage(messages?.['shouldDisableTime-seconds'] ?? 'Second is disabled', date),
        shouldDisableYear: (date: TTransformedValue) =>
          getMessage(messages?.shouldDisableYear ?? 'Year is not allowed', date),
      }),
      [messages, validationProps],
    );

  const rules: Omit<
    RegisterOptions<TFieldValues, TName>,
    'disabled' | 'setValueAs' | 'valueAsDate' | 'valueAsNumber'
  > = { ...rulesProp };
  if (!rules.validate) {
    if (rules.validate === 'function') {
      const validateFunc = rules.validate;
      rules.validate = {
        validate: validateFunc,
      };
    }
    rules.validate = {
      ...rules.validate,
      internal: (value: TTransformedValue) => {
        if (!value) {
          return true;
        }
        const error = validator({
          adapter,
          props: validationProps,
          timezone:
            timezone ??
            (value !== null && adapter.isValid(value as NonNullable<TTransformedValue>)
              ? adapter.getTimezone(value as NonNullable<TTransformedValue>)
              : 'default'),
          value,
        });

        const messageFn =
          error &&
          Object.prototype.hasOwnProperty.call(errorMessages, error as unknown as PropertyKey)
            ? errorMessages[error as keyof typeof errorMessages]
            : null;
        const message = typeof messageFn === 'function' ? messageFn(value) : '';
        return message || undefined;
      },
    };
  }

  return rules;
}

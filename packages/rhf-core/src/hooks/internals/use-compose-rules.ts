import { type FieldPath, type FieldValues, type UseControllerProps } from 'react-hook-form';

/**
 * Type definition for customizable rule messages.
 */
export type ComposeRulesMessages = {
  /**
   * Message or function to generate a message for the `max` rule.
   * @param max - The maximum value allowed.
   * @returns The message for the `max` rule.
   */
  max?: ((max: number | string) => string) | string;

  /**
   * Message or function to generate a message for the `maxLength` rule.
   * @param maxLength - The maximum length allowed.
   * @returns The message for the `maxLength` rule.
   */
  maxLength?: ((maxLength: number) => string) | string;

  /**
   * Message or function to generate a message for the `min` rule.
   * @param min - The minimum value allowed.
   * @returns The message for the `min` rule.
   */
  min?: ((min: number | string) => string) | string;

  /**
   * Message or function to generate a message for the `minLength` rule.
   * @param minLength - The minimum length allowed.
   * @returns The message for the `minLength` rule.
   */
  minLength?: ((minLength: number) => string) | string;

  /**
   * Message or function to generate a message for the `pattern` rule.
   * @param pattern - The regular expression pattern for validation.
   * @param title - Optional title for the error message.
   * @returns The message for the `pattern` rule.
   */
  pattern?: ((pattern: RegExp, title?: string) => string) | string;

  /**
   * Message for the `required` rule.
   */
  required?: string;
};

const defaultMessages: NonNullable<ComposeRulesMessages> = {
  max: (max) => `Value must be ${max} or earlier.`,
  maxLength: (maxLength) => `Please shorten this text to ${maxLength} characters or less.`,
  min: (min) => `Value must be ${min} or later.`,
  minLength: (minLength) => `Please lengthen this text to ${minLength} characters or more`,
  pattern: (_pattern: RegExp, title?: string) =>
    ['Please match the requested format.', title].filter(Boolean).join(' '),
  required: 'Please fill out this field.',
};

/**
 * Retrieves a message based on the provided string or function.
 *
 * @param messageOrFunction - A string or function that returns a message.
 * @param values - Values to pass to the function if `messageOrFunction` is a function.
 * @returns The generated message or an empty string if not defined.
 */
export function getMessage(
  messageOrFunction:
    | ((
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...values: any
      ) => string | undefined)
    | string
    | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...values: any
): string {
  return (
    (typeof messageOrFunction === 'function' ? messageOrFunction(...values) : messageOrFunction) ||
    ''
  );
}

/**
 * Props for the `useComposeRules` hook.
 */
export type UseComposeRulesProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  /**
   * Maximum value allowed.
   */
  max?: number | string;

  /**
   * Maximum length allowed.
   */
  maxLength?: number;

  /**
   * Custom messages for validation rules.
   */
  messages?: ComposeRulesMessages;

  /**
   * Minimum value allowed.
   */
  min?: number | string;

  /**
   * Minimum length allowed.
   */
  minLength?: number;

  /**
   * Regular expression pattern for validation.
   */
  pattern?: RegExp | string;

  /**
   * Indicates if the field is required.
   */
  required?: boolean;

  /**
   * Validation rules to be used by React Hook Form.
   */
  rules?: UseControllerProps<TFieldValues, TName>['rules'];

  /**
   * Optional title for pattern messages. Some components may use it to render a tooltip
   */
  title?: string | undefined;
};

/**
 * Composes validation rules for a React Hook Form.
 *
 * @param props - The properties to compose rules from.
 * @returns The composed validation rules.
 */
export function useUnstableComposeRules<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: UseComposeRulesProps<TFieldValues, TName>) {
  const { max, maxLength, messages, min, minLength, pattern, required, title } = props;
  // Copy so the caller's rules object (often shared or memoized) is never modified.
  const rules: NonNullable<UseComposeRulesProps<TFieldValues, TName>['rules']> = { ...props.rules };

  if (!rules.required && required) {
    rules.required = messages?.required ?? defaultMessages.required;
  }

  if (!rules.minLength && minLength) {
    rules.minLength = {
      message: getMessage(messages?.minLength ?? defaultMessages?.minLength, minLength),
      value: minLength,
    };
  }

  if (!rules.maxLength && maxLength) {
    rules.maxLength = {
      message: getMessage(messages?.maxLength ?? defaultMessages?.maxLength, maxLength),
      value: maxLength,
    };
  }

  if (!rules.pattern && pattern) {
    const patternRegExp = pattern instanceof RegExp ? pattern : new RegExp(pattern);
    rules.pattern = {
      message: getMessage(messages?.pattern ?? defaultMessages?.pattern, patternRegExp, title),
      value: patternRegExp,
    };
  }

  if (rules.min === undefined && min !== undefined && min !== '') {
    rules.min = {
      message: getMessage(messages?.min ?? defaultMessages?.min, min),
      value: min,
    };
  }

  if (rules.max === undefined && max !== undefined && max !== '') {
    rules.max = {
      message: getMessage(messages?.max ?? defaultMessages?.max, max),
      value: max,
    };
  }

  return rules;
}

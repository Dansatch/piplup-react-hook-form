import * as React from 'react';
import { describe, test, expect } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { FormContainer } from '@piplup/rhf-core';
import {
  MuiFilledInputElement,
  MuiInputBaseElement,
  MuiInputElement,
  MuiOutlinedInputElement,
  MuiTextFieldElement,
} from './mui-material';
import { MuiOtpInputElement } from './mui-one-time-password-input';
import { MuiTelInputElement } from './mui-tel-input';

// React Hook Form focuses the first invalid field on submit by calling `.focus()` on the
// registered ref, so that ref has to point at the <input>, not a wrapper element.
const cases: Array<[string, (props: { name: string }) => React.ReactElement]> = [
  ['MuiTextFieldElement', (props) => <MuiTextFieldElement {...props} required />],
  ['MuiInputBaseElement', (props) => <MuiInputBaseElement {...props} required />],
  ['MuiInputElement', (props) => <MuiInputElement {...props} required />],
  ['MuiFilledInputElement', (props) => <MuiFilledInputElement {...props} required />],
  ['MuiOutlinedInputElement', (props) => <MuiOutlinedInputElement {...props} required />],
  ['MuiTelInputElement', (props) => <MuiTelInputElement {...props} required />],
  ['MuiOtpInputElement', (props) => <MuiOtpInputElement {...props} length={4} required />],
];

describe('focus on error', () => {
  test.each(cases)('%s focuses its input when submitted empty', async (_, renderField) => {
    const screen = await render(
      <FormContainer onSubmit={() => {}}>
        <button type="button">Before</button>
        {renderField({ name: 'field' })}
        <button type="submit">Submit</button>
      </FormContainer>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await expect.poll(() => document.activeElement?.tagName).toBe('INPUT');
    // For the OTP input, the field ref is attached to the first box.
    expect(document.activeElement).toBe(screen.container.querySelector('input'));
  });

  test('InputBase-based elements still forward ref to the root and inputRef to the input', async () => {
    // Callback refs: @piplup/utils <= 3.2.4 does not assign ref objects passed through forkRef.
    let root: HTMLElement | null = null;
    let input: HTMLElement | null = null;
    const rootRef = (node: HTMLDivElement | null) => {
      root = node;
    };
    const inputRef = (node: HTMLInputElement | null) => {
      input = node;
    };

    await render(
      <FormContainer onSubmit={() => {}}>
        <MuiOutlinedInputElement inputRef={inputRef} name="field" ref={rootRef} />
      </FormContainer>,
    );

    expect((root as HTMLElement | null)?.classList.contains('MuiInputBase-root')).toBe(true);
    expect((input as HTMLElement | null)?.tagName).toBe('INPUT');
  });

  test('MuiOtpInputElement keeps a user inputRef on the first box', async () => {
    let firstBox: HTMLInputElement | null = null;
    const inputRef = (node: HTMLInputElement | null) => {
      firstBox = node;
    };

    const screen = await render(
      <FormContainer onSubmit={() => {}}>
        <MuiOtpInputElement
          length={4}
          name="code"
          TextFieldsProps={(index) => (index === 0 ? { inputRef } : {})}
        />
      </FormContainer>,
    );

    expect(firstBox).toBe(screen.container.querySelector('input'));

    // Typing still works with the merged ref (the original reason inputRef was disabled).
    await userEvent.type(screen.container.querySelector('input') as HTMLInputElement, '1234');
    const values = [...screen.container.querySelectorAll('input')].map((input) => input.value);
    expect(values).toEqual(['1', '2', '3', '4']);
  });
});

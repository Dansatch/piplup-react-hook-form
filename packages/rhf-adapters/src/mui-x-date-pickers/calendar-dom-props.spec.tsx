import * as React from 'react';
import { afterEach, describe, test, expect, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormContainer } from '@piplup/rhf-core';
import { MuiXDateCalendarElement } from './date-calendar';
import { MuiXMonthCalendarElement } from './month-calendar';
import { MuiXYearCalendarElement } from './year-calendar';

// React only warns once per prop name per page, so this file renders every calendar in its
// own fresh page and checks that none of them forwards adapter-only props to the DOM.
describe('calendar elements', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('do not pass adapter-only props to the DOM', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onError = vi.fn();

    const screen = await render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FormContainer onError={onError}>
          <MuiXDateCalendarElement
            name="day"
            required
            shouldDisableDate={() => false}
            shouldDisableMonth={() => false}
            shouldDisableYear={() => false}
          />
          <MuiXMonthCalendarElement name="month" required shouldDisableMonth={() => false} />
          <MuiXYearCalendarElement name="year" required shouldDisableYear={() => false} />
          <button type="submit">Submit</button>
        </FormContainer>
      </LocalizationProvider>,
    );

    // Submitting empty required fields puts every calendar into its error state, so `error`
    // is true and `helperText` holds a message.
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await expect.poll(() => onError.mock.calls.length).toBe(1);
    // Let the error-state render commit before reading the warnings.
    await new Promise((resolve) => setTimeout(resolve, 100));

    const domPropWarnings = consoleError.mock.calls
      .map((args) => args.map(String).join(' '))
      .filter(
        (message) =>
          message.includes('React does not recognize') ||
          message.includes('non-boolean attribute') ||
          message.includes('Unknown event handler property') ||
          message.includes('Invalid value for prop'),
      );

    expect(domPropWarnings).toEqual([]);
  });
});

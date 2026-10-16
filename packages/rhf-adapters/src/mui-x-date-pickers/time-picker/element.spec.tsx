import { describe, test, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormContainer } from '@piplup/rhf-core';
import dayjs from 'dayjs';
import { useFormState } from 'react-hook-form';
import { MuiXTimePickerElement } from './element';

function TouchedState({ name }: { name: string }) {
  const { touchedFields } = useFormState();
  return <span data-testid="touched">{touchedFields[name] ? 'touched' : 'untouched'}</span>;
}

describe('MuiXTimePickerElement', () => {
  test('renders default time from defaultValues', async () => {
    const target = dayjs('2021-02-14T08:30:00.000Z');

    const screen = await render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FormContainer defaultValues={{ time: target }}>
          <MuiXTimePickerElement name="time" />
        </FormContainer>
      </LocalizationProvider>,
    );

    const field = screen.getByRole('group');
    await expect.element(field).toBeInTheDocument();
    await expect.element(field).toHaveTextContent(target.format('hh:mm A'));
  });

  test('select a time, updating the displayed time', async () => {
    const target = dayjs().hour(9).minute(30);

    const screen = await render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FormContainer>
          <MuiXTimePickerElement name="time" />
        </FormContainer>
      </LocalizationProvider>,
    );

    const chooseTime = screen.getByLabelText('Choose time');
    await userEvent.click(chooseTime);

    const selectHours = screen.getByLabelText('Select hours');
    const hour = selectHours.getByLabelText(`${target.format('h')} hours`);
    await expect.element(hour).toBeInTheDocument();
    hour.element().scrollIntoView();
    await userEvent.click(hour);

    const selectMinutes = screen.getByLabelText('Select minutes');
    const minutes = selectMinutes.getByLabelText(`${target.format('m')} minutes`);
    await expect.element(minutes).toBeInTheDocument();
    minutes.element().scrollIntoView();
    await userEvent.click(minutes);

    const selectMeridie = screen.getByLabelText('Select meridiem');
    const meridiem = selectMeridie.getByLabelText(target.format('A').toUpperCase());
    await userEvent.click(meridiem);

    const okButton = screen.getByRole('button', {
      name: /ok/i,
    });
    await userEvent.click(okButton);

    const field = screen.getByRole('group');
    await expect.element(field).toBeInTheDocument();
    await expect.element(field).toHaveTextContent(target.format('hh:mm A'));
  });

  test('shows the correct default messages for time limits', async () => {
    const screen = await render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FormContainer
          defaultValues={{
            afterMaximum: dayjs('2021-02-14T10:00:00.000Z'),
            beforeMinimum: dayjs('2021-02-14T08:00:00.000Z'),
          }}
        >
          <MuiXTimePickerElement maxTime={dayjs('2021-02-14T09:00:00.000Z')} name="afterMaximum" />
          <MuiXTimePickerElement minTime={dayjs('2021-02-14T09:00:00.000Z')} name="beforeMinimum" />
          <button type="submit">Submit</button>
        </FormContainer>
      </LocalizationProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await expect
      .element(screen.getByText('Time is later than the maximum allowed time'))
      .toBeVisible();
    await expect
      .element(screen.getByText('Time is earlier than the minimum allowed time'))
      .toBeVisible();
  });

  test('marks the field as touched when the text field loses focus', async () => {
    const onClose = vi.fn();
    const screen = await render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FormContainer>
          <MuiXTimePickerElement name="time" onClose={onClose} />
          <TouchedState name="time" />
          <button type="button">Outside</button>
        </FormContainer>
      </LocalizationProvider>,
    );

    await expect.element(screen.getByTestId('touched')).toHaveTextContent('untouched');

    await userEvent.click(screen.getByRole('spinbutton', { name: 'Hours' }));
    await userEvent.click(screen.getByRole('button', { name: 'Outside' }));

    await expect.element(screen.getByTestId('touched')).toHaveTextContent(/^touched$/);
    expect(onClose).not.toHaveBeenCalled();
  });

  test('calls onClose and marks the field as touched when the picker closes', async () => {
    const onClose = vi.fn();
    const screen = await render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FormContainer>
          <MuiXTimePickerElement name="time" onClose={onClose} />
          <TouchedState name="time" />
        </FormContainer>
      </LocalizationProvider>,
    );

    await userEvent.click(screen.getByLabelText('Choose time'));
    await expect.element(screen.getByLabelText('Select hours')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');

    await expect.poll(() => onClose.mock.calls.length).toBe(1);
    await expect.element(screen.getByTestId('touched')).toHaveTextContent(/^touched$/);
  });
});

import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { type FieldValues } from 'react-hook-form';
import {
  getMessage,
  useUnstableComposeRules as useComposeRules,
  type UseComposeRulesProps,
} from './use-compose-rules';

function Comp(props: UseComposeRulesProps<FieldValues>) {
  const r = useComposeRules(props);
  return <div data-cy="r">{JSON.stringify(r)}</div>;
}

describe('useComposeRules', () => {
  it('adds required message when required true', () => {
    const { container } = render(<Comp required />);
    expect(container.querySelector('[data-cy=r]')?.textContent).toContain('required');
  });

  it('populates minLength rule with value and message', () => {
    const { container } = render(<Comp minLength={5} />);
    expect(container.querySelector('[data-cy=r]')?.textContent).toContain('minLength');
    expect(container.querySelector('[data-cy=r]')?.textContent).toContain('5');
  });

  it('converts pattern string to RegExp and message present', () => {
    const { container } = render(<Comp pattern="^a" />);
    expect(container.querySelector('[data-cy=r]')?.textContent).toContain('pattern');
  });

  it('does not modify the rules object passed in', () => {
    const shared = { validate: () => true };
    render(<Comp maxLength={10} required rules={shared} />);
    render(<Comp rules={shared} />);
    expect(Object.keys(shared)).toEqual(['validate']);
  });

  it('does not leak composed rules between fields sharing a rules object', () => {
    const shared = {};
    render(<Comp required rules={shared} />);
    const { container } = render(<Comp rules={shared} />);
    expect(container.querySelector('[data-cy=r]')?.textContent).toBe('{}');
  });

  it('adds min and max rules when the limit is 0', () => {
    const { container } = render(<Comp max={0} min={0} />);
    const rules = JSON.parse(container.querySelector('[data-cy=r]')?.textContent ?? '{}');
    expect(rules.min.value).toBe(0);
    expect(rules.max.value).toBe(0);
  });

  it('keeps a 0 min/max passed through rules', () => {
    const { container } = render(<Comp max={10} min={5} rules={{ max: 0, min: 0 }} />);
    const rules = JSON.parse(container.querySelector('[data-cy=r]')?.textContent ?? '{}');
    expect(rules.min).toBe(0);
    expect(rules.max).toBe(0);
  });

  it('passes rule values to message functions as separate arguments', () => {
    const { container } = render(
      <Comp
        max={8}
        messages={{
          max: (max) => `max:${typeof max}:${max}`,
          pattern: (pattern, title) => `pattern:${pattern.source}:${title}`,
        }}
        pattern="^a"
        title="Starts with a"
      />,
    );
    const rules = JSON.parse(container.querySelector('[data-cy=r]')?.textContent ?? '{}');
    expect(rules.max.message).toBe('max:number:8');
    expect(rules.pattern.message).toBe('pattern:^a:Starts with a');
  });

  it('includes the title in the default pattern message', () => {
    const { container } = render(<Comp pattern="^a" title="Starts with a" />);
    const rules = JSON.parse(container.querySelector('[data-cy=r]')?.textContent ?? '{}');
    expect(rules.pattern.message).toBe('Please match the requested format. Starts with a');
  });
});

describe('getMessage', () => {
  it('returns strings as-is and calls functions with spread arguments', () => {
    expect(getMessage('Required')).toBe('Required');
    expect(getMessage((a: number, b: number) => `${a + b}`, 2, 3)).toBe('5');
    expect(getMessage(undefined)).toBe('');
  });
});

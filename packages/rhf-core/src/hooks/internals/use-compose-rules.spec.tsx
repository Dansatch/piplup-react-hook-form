import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { type FieldValues } from 'react-hook-form';
import {
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
});

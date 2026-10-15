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
});

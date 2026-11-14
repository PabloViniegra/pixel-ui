import { render, screen } from '@testing-library/react';
import type { ComponentPropsWithRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Field, useFieldControl } from './Field.js';

function Control(props: ComponentPropsWithRef<'input'>) {
  return <input {...useFieldControl(props)} />;
}

describe('Field', () => {
  it('links label and description to the control', () => {
    render(
      <Field label="Project name" description="Used in the URL." required>
        <Control />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Project name' });
    expect(input).toBeRequired();
    expect(input).toHaveAccessibleDescription('Used in the URL.');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('replaces the description with the error and marks the control invalid', () => {
    render(
      <Field label="Project name" description="Used in the URL." error="Name is taken.">
        <Control aria-describedby="extra" />
      </Field>,
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')).toMatch(/message extra$/);
    expect(screen.queryByText('Used in the URL.')).not.toBeInTheDocument();
  });

  it('announces errors through a live region but not helper text', () => {
    const { rerender } = render(
      <Field label="Name" description="Used in the URL.">
        <Control />
      </Field>,
    );
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    rerender(
      <Field label="Name" description="Used in the URL." error="Name is taken.">
        <Control />
      </Field>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Name is taken.');
  });

  it('does not mirror rich errors into the live region', () => {
    render(
      <Field
        label="Name"
        error={
          <>
            Taken. <a href="#other">Use another</a>
          </>
        }
      >
        <Control />
      </Field>,
    );
    expect(screen.getAllByRole('link', { name: 'Use another' })).toHaveLength(1);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FileUpload, formatBytes } from './FileUpload.js';

const file = (name: string, type: string, size = 10) =>
  new File([new Uint8Array(size)], name, { type });

describe('FileUpload', () => {
  it('adds picked files to the list and removes them', async () => {
    const onChange = vi.fn();
    const { container } = render(<FileUpload multiple onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    await userEvent.upload(input, [file('a.png', 'image/png'), file('b.pdf', 'application/pdf')]);
    expect(onChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ name: 'a.png' }),
      expect.objectContaining({ name: 'b.pdf' }),
    ]);
    expect(screen.getByRole('list', { name: 'Selected files' }).children).toHaveLength(2);

    await userEvent.click(screen.getByRole('button', { name: 'Remove a.png' }));
    expect(screen.queryByText('a.png')).not.toBeInTheDocument();
  });

  it('ignores a file that is already in the list', async () => {
    const onChange = vi.fn();
    const { container } = render(<FileUpload multiple onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const same = file('a.png', 'image/png');
    await userEvent.upload(input, same);
    await userEvent.upload(input, [same, file('b.png', 'image/png')]);
    expect(onChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ name: 'a.png' }),
      expect.objectContaining({ name: 'b.png' }),
    ]);
    expect(screen.getByRole('list', { name: 'Selected files' }).children).toHaveLength(2);
  });

  it('rejects dropped files by type, size and count', () => {
    const onReject = vi.fn();
    const onChange = vi.fn();
    render(
      <FileUpload
        multiple
        accept="image/*,.pdf"
        maxSize={100}
        maxFiles={1}
        onChange={onChange}
        onReject={onReject}
      />,
    );
    const zone = screen.getByText('Drop files here or browse').closest('label') as HTMLElement;
    const files = [
      file('ok.png', 'image/png'),
      file('notes.txt', 'text/plain'),
      file('huge.pdf', 'application/pdf', 500),
      file('extra.jpg', 'image/jpeg'),
    ];
    fireEvent.dragOver(zone);
    expect(zone).toHaveAttribute('data-dragging');
    fireEvent.drop(zone, { dataTransfer: { files } });

    expect(zone).not.toHaveAttribute('data-dragging');
    expect(onChange).toHaveBeenCalledWith([files[0]]);
    expect(onReject).toHaveBeenCalledWith([
      { file: files[1], reason: 'type' },
      { file: files[2], reason: 'size' },
      { file: files[3], reason: 'count' },
    ]);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('notes.txt is not an accepted file type');
    expect(alert).toHaveTextContent('huge.pdf is larger than 100 B');
    expect(alert).toHaveTextContent('extra.jpg was not added: the limit is 1 file');
    expect(zone.querySelector('input')).toHaveAttribute(
      'aria-describedby',
      alert.getAttribute('id'),
    );
  });

  it('hides the rejection message when rejectionMessage is false', () => {
    render(<FileUpload accept="image/*" rejectionMessage={false} />);
    const zone = screen.getByText('Drop files here or browse').closest('label') as HTMLElement;
    fireEvent.drop(zone, { dataTransfer: { files: [file('notes.txt', 'text/plain')] } });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('keeps focus in the component when a file is removed', async () => {
    const { container } = render(
      <FileUpload
        multiple
        defaultValue={[file('a.png', 'image/png'), file('b.png', 'image/png')]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Remove a.png' }));
    expect(screen.getByRole('button', { name: 'Remove b.png' })).toHaveFocus();
    await userEvent.click(screen.getByRole('button', { name: 'Remove b.png' }));
    expect(container.querySelector('input[type="file"]')).toHaveFocus();
  });

  it('replaces the file in single mode', async () => {
    const onChange = vi.fn();
    const { container } = render(<FileUpload onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, file('a.png', 'image/png'));
    await userEvent.upload(input, file('b.png', 'image/png'));
    expect(onChange).toHaveBeenLastCalledWith([expect.objectContaining({ name: 'b.png' })]);
  });

  it('formats sizes', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(2_400_000)).toBe('2.3 MB');
  });
});

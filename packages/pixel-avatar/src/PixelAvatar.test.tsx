import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { identicon, PixelAvatar } from './PixelAvatar.js';

describe('identicon', () => {
  it('is deterministic and ignores case and surrounding spaces', () => {
    expect(identicon(' Ada@Example.com ')).toEqual(identicon('ada@example.com'));
  });

  it('is mirrored around the vertical axis', () => {
    for (const cells of [5, 6, 7]) {
      for (const row of identicon('grace', cells).rows) {
        expect(row).toHaveLength(cells);
        expect(row).toBe([...row].reverse().join(''));
      }
    }
  });

  it('differs between nearby names', () => {
    const a = identicon('user-1');
    const b = identicon('user-2');
    expect(a.rows.join() === b.rows.join() && a.hue === b.hue).toBe(false);
  });
});

describe('PixelAvatar', () => {
  it('is an image named after the person unless marked decorative', () => {
    const { rerender } = render(<PixelAvatar name="Ada Lovelace" />);
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toBeInTheDocument();
    rerender(<PixelAvatar name="Ada Lovelace" label="" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});

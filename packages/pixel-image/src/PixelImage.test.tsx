import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PixelImage } from './PixelImage.js';

describe('PixelImage', () => {
  it('keeps the real image accessible and settles on loaded without a canvas', () => {
    // jsdom has no 2D canvas, the same path as an engine that cannot draw.
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    const onLoad = vi.fn();
    const { container } = render(
      <PixelImage
        src="/hero.png"
        alt="Dashboard preview"
        width={1200}
        height={630}
        onLoad={onLoad}
      />,
    );
    const img = screen.getByRole('img', { name: 'Dashboard preview' });
    const box = container.firstElementChild as HTMLElement;
    expect(box).toHaveAttribute('data-state', 'loading');
    expect(box.style.aspectRatio).toBe('1200 / 630');

    fireEvent.load(img);
    expect(onLoad).toHaveBeenCalledOnce();
    expect(box).toHaveAttribute('data-state', 'loaded');
  });

  it('reports errors', () => {
    const { container } = render(<PixelImage src="/missing.png" alt="" />);
    fireEvent.error(container.querySelector('img') as HTMLImageElement);
    expect(container.firstElementChild).toHaveAttribute('data-state', 'error');
  });
});

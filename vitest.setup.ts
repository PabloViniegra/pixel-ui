import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => cleanup());

// jsdom implements neither <dialog> modality nor the Popover API.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.hasAttribute('open')) return;
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}
if (!HTMLElement.prototype.showPopover) {
  HTMLElement.prototype.showPopover = () => {};
  HTMLElement.prototype.hidePopover = () => {};
}
// jsdom's UA sheet hides every [popover] because `:popover-open` never
// matches. Components mount popovers only while open, so show them all.
const popoverStyle = document.createElement('style');
popoverStyle.textContent = '[popover] { display: block !important; }';
document.head.append(popoverStyle);

'use client';

import { cx, useControllableState } from '@pablo-v/core';
import { CloseIcon, FileIcon, UploadIcon } from '@pablo-v/pixel-icons';
import {
  type ChangeEvent,
  type ComponentPropsWithRef,
  type DragEvent,
  type ReactNode,
  useId,
  useState,
} from 'react';

export type FileRejectionReason = 'type' | 'size' | 'count';

export interface FileRejection {
  file: File;
  reason: FileRejectionReason;
}

export interface FileUploadProps
  extends Omit<ComponentPropsWithRef<'div'>, 'onChange' | 'defaultValue'> {
  value?: File[];
  defaultValue?: File[];
  onChange?: (files: File[]) => void;
  /** Files refused by `accept`, `maxSize` or `maxFiles`. */
  onReject?: (rejections: FileRejection[]) => void;
  /** Same syntax as the input attribute: `image/*,.pdf`. */
  accept?: string;
  multiple?: boolean;
  /** Largest accepted file, in bytes. */
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  /** @default 'Drop files here or browse' */
  label?: ReactNode;
  /** Secondary line under the label, e.g. the accepted types. */
  hint?: ReactNode;
}

function matches(file: File, accept: string | undefined) {
  if (!accept) return true;
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return accept.split(',').some((raw) => {
    const rule = raw.trim().toLowerCase();
    if (!rule) return false;
    if (rule.startsWith('.')) return name.endsWith(rule);
    if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

const units = ['B', 'KB', 'MB', 'GB'];

export function formatBytes(bytes: number) {
  let n = bytes;
  let unit = 0;
  while (n >= 1024 && unit < units.length - 1) {
    n /= 1024;
    unit++;
  }
  return `${unit === 0 ? n : n.toFixed(n < 10 ? 1 : 0)} ${units[unit]}`;
}

const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

/**
 * Drop zone over a native file input, with the chosen files listed below.
 * Click, Enter or Space opens the picker; dropped files are validated against
 * `accept`, `maxSize` and `maxFiles`.
 */
export function FileUpload({
  value: valueProp,
  defaultValue = [],
  onChange,
  onReject,
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  disabled = false,
  label = 'Drop files here or browse',
  hint,
  className,
  ...rest
}: FileUploadProps) {
  const [files, setFiles] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange,
  });
  const [dragging, setDragging] = useState(false);
  const id = useId();

  const add = (incoming: File[]) => {
    const rejections: FileRejection[] = [];
    const accepted: File[] = [];
    const limit = multiple ? (maxFiles ?? Number.POSITIVE_INFINITY) : 1;
    const base = multiple ? files : [];
    const keys = new Set(base.map(fileKey));
    for (const file of incoming) {
      if (keys.has(fileKey(file))) continue;
      keys.add(fileKey(file));
      if (!matches(file, accept)) rejections.push({ file, reason: 'type' });
      else if (maxSize != null && file.size > maxSize) rejections.push({ file, reason: 'size' });
      else if (base.length + accepted.length >= limit) rejections.push({ file, reason: 'count' });
      else accepted.push(file);
    }
    if (accepted.length) setFiles([...base, ...accepted]);
    if (rejections.length) onReject?.(rejections);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    if (!disabled) add(Array.from(event.dataTransfer.files));
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    add(Array.from(event.target.files ?? []));
    event.target.value = '';
  };

  return (
    <div
      className={cx('pxl-file-upload', className)}
      data-disabled={disabled || undefined}
      {...rest}
    >
      <label
        className="pxl-file-upload__zone"
        data-dragging={dragging || undefined}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
        }}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="pxl-file-upload__input"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-describedby={hint != null ? `${id}-hint` : undefined}
          onChange={handleInput}
        />
        <span className="pxl-file-upload__icon" aria-hidden="true">
          <UploadIcon />
        </span>
        <span className="pxl-file-upload__label">{label}</span>
        {hint != null && (
          <span id={`${id}-hint`} className="pxl-file-upload__hint">
            {hint}
          </span>
        )}
      </label>
      {files.length > 0 && (
        <ul className="pxl-file-upload__list" aria-label="Selected files">
          {files.map((file, i) => (
            <li key={fileKey(file)} className="pxl-file-upload__file">
              <FileIcon />
              <span className="pxl-file-upload__name">{file.name}</span>
              <span className="pxl-file-upload__size">{formatBytes(file.size)}</span>
              <button
                type="button"
                className="pxl-file-upload__remove"
                aria-label={`Remove ${file.name}`}
                disabled={disabled}
                onClick={() => setFiles(files.filter((_, j) => j !== i))}
              >
                <CloseIcon />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

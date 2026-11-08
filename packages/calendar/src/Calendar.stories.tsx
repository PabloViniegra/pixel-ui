import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import pkg from '../package.json' with { type: 'json' };
import {
  Calendar,
  type CalendarRangeProps,
  type CalendarSingleProps,
  type DateRange,
} from './Calendar.js';
import { addDays, startOfDay } from './date.js';
import '@pablo-v/pixel-icons/style.css';
import './calendar.css';

const today = startOfDay(new Date());

const meta = {
  title: 'Forms/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<Date | null>(today);
    return (
      <Calendar
        {...(args as CalendarSingleProps)}
        mode="single"
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const Range: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<DateRange | null>({
      start: addDays(today, 2),
      end: addDays(today, 6),
    });
    return (
      <Calendar {...(args as CalendarRangeProps)} mode="range" value={value} onChange={setValue} />
    );
  },
};

export const Constraints: Story = {
  args: {
    min: today,
    max: addDays(today, 45),
    isDateDisabled: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
  },
};

export const Locale: Story = { args: { locale: 'es-ES' } };

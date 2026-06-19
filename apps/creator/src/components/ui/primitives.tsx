// Tiny, neutral, shadcn-shaped primitives (className-driven) so the visual design can be
// swapped later without touching product logic. Intentionally minimal.
import React from 'react'

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

export function Button({ variant = 'secondary', size = 'md', className, ...rest }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-1.5 rounded-lg font-bold transition disabled:opacity-40 disabled:cursor-not-allowed'
  const sizes = { sm: 'text-xs px-2.5 py-1.5', md: 'text-sm px-3.5 py-2' }
  const variants = {
    primary: 'bg-signal text-white hover:brightness-110',
    secondary: 'bg-surface2 text-chalk hover:bg-[#222] border border-gray-rule',
    ghost: 'text-gray-mid hover:text-chalk',
    danger: 'bg-transparent text-red-400 border border-red-900 hover:bg-red-950',
  }
  return <button className={cx(base, sizes[size], variants[variant], className)} {...rest} />
}

export function Input({ className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        'w-full rounded-lg bg-surface1 border border-gray-rule px-3 py-2 text-sm text-chalk',
        'placeholder:text-gray-hi focus:outline-none focus:border-signal',
        className,
      )}
      {...rest}
    />
  )
}

export function Textarea({ className, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cx(
        'w-full rounded-lg bg-surface1 border border-gray-rule px-3 py-2 text-sm text-chalk',
        'placeholder:text-gray-hi focus:outline-none focus:border-signal resize-y',
        className,
      )}
      {...rest}
    />
  )
}

export function Label({ className, ...rest }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cx('block text-[11px] font-bold uppercase tracking-wide text-gray-mid mb-1', className)} {...rest} />
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

export function Badge({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'signal' | 'muted' }) {
  const tones = {
    default: 'bg-surface2 text-gray-lo border-gray-rule',
    signal: 'bg-signal/15 text-signal border-signal/40',
    muted: 'bg-transparent text-gray-hi border-gray-rule',
  }
  return (
    <span className={cx('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-bold', tones[tone])}>
      {children}
    </span>
  )
}

export { cx }

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react'

type AlertVariant = 'success' | 'error' | 'warning' | 'info'

const VARIANT_STYLES: Record<
  AlertVariant,
  { container: string; iconColor: string; Icon: typeof Info }
> = {
  success: {
    container: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    iconColor: 'text-emerald-400',
    Icon: CheckCircle2,
  },
  error: {
    container: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
    iconColor: 'text-rose-400',
    Icon: AlertCircle,
  },
  warning: {
    container: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    iconColor: 'text-amber-400',
    Icon: AlertTriangle,
  },
  info: {
    container: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
    iconColor: 'text-sky-400',
    Icon: Info,
  },
}

interface AlertProps {
  type?: AlertVariant
  title?: string
  message: string
  onDismiss?: () => void
  /** Floats the alert (used for toasts) instead of rendering inline. */
  toast?: boolean
  className?: string
  /** Icon size in px. */
  iconSize?: number
  /** Adjust paddings for embedded / compact contexts. */
  compact?: boolean
}

export function Alert({
  type = 'info',
  title,
  message,
  onDismiss,
  toast = false,
  className = '',
  iconSize = 16,
  compact = false,
}: AlertProps) {
  const { container, iconColor, Icon } = VARIANT_STYLES[type]

  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 border backdrop-blur-md text-xs font-semibold ${
        compact ? 'px-3 py-2' : 'px-4 py-2.5'
      } rounded-xl ${container} ${toast ? 'animate-in slide-in-from-top-2' : ''} ${className}`}
    >
      <Icon size={iconSize} className={`shrink-0 mt-px ${iconColor}`} />
      <div className="min-w-0 flex-1">
        {title && <p className="font-extrabold">{title}</p>}
        <p className={title ? 'mt-0.5 text-[12px] opacity-90' : ''}>{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="shrink-0 ml-auto text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

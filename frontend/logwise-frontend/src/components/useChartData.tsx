import { useMemo } from 'react'

export type RangeKey = 'last-5m' | 'last-15m' | 'last-30m' | 'last-1h' | 'last-6h' | 'last-24h' | 'yesterday' | 'last-7d'

export interface Bucket {
  start: number
  label: string
  errors: number
  warnings: number
  total: number
  [severity: string]: number | string
}

const rangeConfig: Record<RangeKey, {
  buckets: number
  intervalMs: number
  tickFormat: (ts: number) => string
}> = {
  'last-5m': {
    buckets: 5,
    intervalMs: 60 * 1000,
    tickFormat: ts => new Date(ts).toLocaleTimeString('en-US', { minute: '2-digit', second: '2-digit' })
  },
  'last-15m': {
    buckets: 15,
    intervalMs: 60 * 1000,
    tickFormat: ts => new Date(ts).toLocaleTimeString('en-US', { minute: '2-digit', second: '2-digit' })
  },
  'last-30m': {
    buckets: 30,
    intervalMs: 60 * 1000,
    tickFormat: ts => new Date(ts).toLocaleTimeString('en-US', { minute: '2-digit' })
  },
  'last-1h': {
    buckets: 12,
    intervalMs: 5 * 60 * 1000,
    tickFormat: ts => new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  },
  'last-6h': {
    buckets: 12,
    intervalMs: 30 * 60 * 1000,
    tickFormat: ts => new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit' })
  },
  'last-24h': {
    buckets: 24,
    intervalMs: 60 * 60 * 1000,
    tickFormat: ts => new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit' })
  },
  yesterday: {
    buckets: 24,
    intervalMs: 60 * 60 * 1000,
    tickFormat: ts => new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit' })
  },
  'last-7d': {
    buckets: 7,
    intervalMs: 24 * 60 * 60 * 1000,
    tickFormat: ts => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

export function useChartData(
  logs: { timestamp: string; severity: string }[],
  selectedRange: RangeKey
): Bucket[] {
  return useMemo(() => {
    const cfg = rangeConfig[selectedRange]
    const now = Date.now()
    
    const buckets: Bucket[] = Array.from({ length: cfg.buckets }, (_, i) => {
      const start = now - (cfg.buckets - i) * cfg.intervalMs
      return {
        start,
        label: cfg.tickFormat(start),
        errors: 0,
        warnings: 0,
        total: 0,
        DEBUG: 0,
        INFO: 0,
        NOTICE: 0,
        WARNING: 0,
        ERROR: 0,
        CRITICAL: 0,
        ALERT: 0,
        EMERGENCY: 0
      }
    })

    logs.forEach((log) => {
      const t = new Date(log.timestamp).getTime()
      const idx = Math.floor((t - (now - cfg.buckets * cfg.intervalMs)) / cfg.intervalMs)
      
      if (idx >= 0 && idx < buckets.length) {
        buckets[idx].total++
        buckets[idx][log.severity]++
        
        if (log.severity === 'ERROR' || log.severity === 'CRITICAL') {
          buckets[idx].errors++
        } else if (log.severity === 'WARNING') {
          buckets[idx].warnings++
        }
      }
    })

    return buckets
  }, [logs, selectedRange])
}

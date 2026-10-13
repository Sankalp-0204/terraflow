import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  style?: React.CSSProperties;
  action?: React.ReactNode;
}

export function Card({ children, title, subtitle, className = '', style, action }: CardProps) {
  return (
    <div
      className={`surface ${className}`}
      style={{ padding: '20px', ...style }}
    >
      {(title || action) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: subtitle ? '4px' : '16px' }}>
          {title && (
            <div>
              <h2 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                {title}
              </h2>
              {subtitle && (
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>{subtitle}</p>
              )}
            </div>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      {title && subtitle && <div style={{ marginBottom: '16px' }} />}
      {title && !subtitle && null}
      {children}
    </div>
  );
}

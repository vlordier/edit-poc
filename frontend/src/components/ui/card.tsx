import React, { FC } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: FC<CardProps> = ({ children, ...props }) => (
  <div {...props} className={`card ${props.className || ''}`}>
    {children}
  </div>
);

export const CardHeader: FC<CardHeaderProps> = ({ children, ...props }) => (
  <div {...props} className={`card-header ${props.className || ''}`}>
    {children}
  </div>
);

export const CardContent: FC<CardContentProps> = ({ children, ...props }) => (
  <div {...props} className={`card-content ${props.className || ''}`}>
    {children}
  </div>
);

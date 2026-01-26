import { CSS_PREFIX } from '../../../constants/cssPrefix';
import classNames from 'classnames';
import React, { FC, HTMLAttributes, ReactNode } from 'react';
import './index.less';

const preCls = `${CSS_PREFIX}-icon-btn`;

export interface IButtonIconProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  size?: 'default' | 'middle' | 'small' | 'large';
  clickable?: boolean;
  disabled?: boolean;
  type?: 'primary' | 'default' | 'danger';
}

const IconButton: FC<IButtonIconProps> = ({
  size = 'default',
  disabled,
  clickable = true,
  icon,
  type = 'default',
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={classNames(
        preCls,
        `${preCls}-size--${size}`,
        clickable && `${preCls}--clickable`,
        disabled && `${preCls}--disabled`,
        `${preCls}-type-${type}`,
        className,
      )}
    >
      {icon}
    </div>
  );
};

export default IconButton;

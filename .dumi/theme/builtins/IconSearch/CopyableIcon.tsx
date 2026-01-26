import * as React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Badge, message } from 'antd';
import classNames from 'classnames';
import type { ThemeType } from './index';

export interface CopyableIconProps {
  name: string;
  isNew: boolean;
  theme: ThemeType;
  justCopied: string | null;
  onCopied: (type: string, text: string) => any;
}

const CopyableIcon: React.FC<CopyableIconProps> = ({
  name,
  isNew,
  justCopied,
  onCopied,
  theme,
}) => {
  console.log('theme', theme);
  const className = classNames({
    copied: justCopied === name,
    [theme]: !!theme,
  });
  const onCopy = (text: string, result: boolean) => {
    if (result) {
      onCopied(name, text);
    } else {
      message.error('Copy icon name failed, please try again.');
    }
  };

  return (
    <CopyToClipboard text={`<${name} />`} onCopy={onCopy}>
      <li className={className}>
        <span className="anticon-class">
          <Badge dot={isNew}>{name}</Badge>
        </span>
      </li>
    </CopyToClipboard>
  );
};

export default CopyableIcon;

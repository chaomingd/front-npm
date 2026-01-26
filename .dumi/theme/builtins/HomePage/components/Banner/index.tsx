import React from 'react';
// @ts-ignore
import { Link, useIntl } from 'dumi';

import styles from './index.module.less';

export const Banner: React.FC = () => {
  const intl = useIntl();

  return (
    <div className={styles.bannerContainer}>
      <img
        draggable={false}
        className={styles.bgImg}
        src="https://mdn.alipayobjects.com/huamei_mutawc/afts/img/A*664qTJ8PpR8AAAAAAAAAAAAADlrGAQ/original"
        alt="banner"
      />
      <div className={styles.wrap}>
        <img draggable={false} className={styles.titleImg} src="/title.png" alt="title" />
        <div className={styles.slogan}>
          {intl.formatMessage({ id: 'app.docs.site.index.banner.slogan' })}
        </div>
        <div className={styles.btn}>
          <Link to={`/guide/ant-design-laf${intl.locale === 'zh-CN' ? '-cn' : ''}`}>
            {intl.formatMessage({
              id: 'app.docs.site.index.banner.button-text',
            })}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;

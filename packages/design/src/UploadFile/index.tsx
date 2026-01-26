import { Image, Typography } from 'antd';
import classNames from 'classnames';
import React, { ReactNode, useMemo, useRef } from 'react';
import IconButton from './components/IconButton';
import './index.less';
import SlashSvg from './components/Slash';
import { CloseSvg, DeleteSvg, RarSvg, ZipSvg, TxtSvg, PdfSvg, DocSvg } from './components/SvgIcons';
import { useUploadModel } from './hooks/useUploadModel';
import { FileListItemProps, UploadFileProps } from './type';
import { getExt } from './utils/getExt';
import { isImage } from './utils/isImage';

const EXT_SVG = {
  zip: ZipSvg,
  rar: RarSvg,
  txt: TxtSvg,
  pdf: PdfSvg,
  doc: DocSvg,
  docx: DocSvg,
};

const preCls = '@chaomingd/upload-file';

interface TextBtnProps {
  children: ReactNode;
  onClick?: () => any;
}

const TextBtn = ({ children, onClick }: TextBtnProps) => {
  return (
    <div className={`${preCls}-text-btn`} onClick={onClick}>
      {children}
    </div>
  );
};

const UploadFile = (props: UploadFileProps) => {
  const {
    accepts,
    multiple,
    maxCount = 1,
    children,
    id,
    getIcon,
    acceptsJoinCharacter = '、',
  } = props;

  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const inputFileReplaceRef = useRef<HTMLInputElement | null>(null);
  const inputRelaceId = useRef<string>('');

  const { model, onDragOver, handleUploadFiles, onDeleteFileList } = useUploadModel(props);

  const { dragEnter, value: fileList } = model.useGetState();

  // input accept 属性
  const { accept, extstr } = useMemo(() => {
    if (!accepts)
      return {
        accept: '',
        extstr: '',
      };
    const exts = accepts.map((ext) => {
      if (ext[0] === '.') {
        return ext;
      }
      return `.${ext}`;
    });

    return {
      accept: exts.join(','),
      extstr: exts.map((ext) => ext.slice(1)).join(acceptsJoinCharacter),
    };
  }, [accepts, acceptsJoinCharacter]);

  const openFileDialog = () => {
    inputFileRef.current?.click();
  };

  const handleReUpload = (uid: string) => {
    inputRelaceId.current = uid;
    inputFileReplaceRef.current?.click();
  };

  const renderDragger = () => {
    return (
      <div
        onDragOver={onDragOver}
        onDrop={(e) => {
          e.preventDefault();
          handleUploadFiles(e.dataTransfer.files || []);
        }}
        className={classNames(
          `${preCls}-dragger-container`,
          fileList.length && `${preCls}-dragger-container-has-file-list`,
        )}
        onClick={openFileDialog}
      >
        {children ? (
          children
        ) : (
          <div className={`${preCls}-dragger`}>
            {dragEnter ? (
              <div className={`${preCls}-dragger-tip`}>释放鼠标</div>
            ) : (
              <div className={`${preCls}-dragger-inner`}>
                <div className={`${preCls}-dragger-top`}>
                  <TextBtn>点击上传</TextBtn>
                  <div className={`${preCls}-split`}>
                    <SlashSvg />
                  </div>
                  <div className={`${preCls}-drag-text`}>拖拽到此区域</div>
                </div>
                {extstr && <div className={`${preCls}-support-ext`}>支持扩展名：{extstr}</div>}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const getProgress = (fileListItem: FileListItemProps) => {
    if (!fileListItem.status || fileListItem.status === 'error' || fileListItem.status === 'done') {
      return '100%';
    }
    if (fileListItem.percent) {
      return `${+Math.min(fileListItem.percent, 99.9).toFixed(2)}%`;
    }
    return '0%';
  };

  const renderValidation = (fileListItem: FileListItemProps) => {
    let validateText = '';
    if (fileListItem.validationStatus === 'validating') {
      if (typeof fileListItem.validationPercent !== 'number') {
        validateText = '校验中...';
      } else {
        validateText = `校验中 ${Math.min(+fileListItem.validationPercent.toFixed(2), 99.99)}%`;
      }
    }
    if (fileListItem.validationStatus === 'error') {
      validateText = fileListItem.validationError?.message || '校验出错';
    }
    if (fileListItem.validationStatus === 'success') {
      validateText = '校验成功';
    }
    return (
      <div
        className={classNames(
          `${preCls}-file-item-validate`,
          `${preCls}-validate-status--${fileListItem.validationStatus || 'success'}`,
        )}
      >
        {validateText}
      </div>
    );
  };

  const renderIcon = (fileListItem: FileListItemProps) => {
    const ext = getExt(fileListItem.name) as keyof typeof EXT_SVG;
    if (isImage(ext, fileListItem.type || fileListItem.file?.type || '')) {
      return (
        <div className={`${preCls}-file-item-left`}>
          <Image width={66} height={66} src={fileListItem.blobUrl || fileListItem.url || ''} />
        </div>
      );
    }
    const ExtSvgIcon = EXT_SVG[ext];
    const iconNode = getIcon ? getIcon(ext, fileListItem) : null;

    return (
      (ExtSvgIcon !== undefined || iconNode) && (
        <div className={`${preCls}-file-item-left`}>
          <div className={`${preCls}-ext-svg`}>{iconNode ? iconNode : <ExtSvgIcon />}</div>
        </div>
      )
    );
  };

  const renderFileListItem = (fileListItem: FileListItemProps) => {
    const progress = getProgress(fileListItem);

    const orignalNode = (
      <div
        key={fileListItem.uid}
        className={classNames(
          `${preCls}-file-item`,
          `${preCls}-file-item-status-${fileListItem.status || 'done'}`,
        )}
      >
        {renderIcon(fileListItem)}
        <div className={`${preCls}-file-item-right`}>
          <div className={`${preCls}-file-item-header`}>
            <Typography.Text
              ellipsis={{
                tooltip: {
                  title: fileListItem.name,
                  showArrow: false,
                  // @ts-ignore
                  arrow: false,
                },
              }}
              className={`${preCls}-file-item-name`}
            >
              {fileListItem.name}
            </Typography.Text>
            <div className={`${preCls}-file-item-extra`}>
              <TextBtn
                onClick={() => {
                  handleReUpload(fileListItem.uid);
                }}
              >
                重新上传
              </TextBtn>
              <IconButton
                type={fileListItem.status === 'uploading' ? 'primary' : 'danger'}
                size="small"
                icon={
                  fileListItem.status === 'uploading' ? (
                    <CloseSvg
                      onClick={() => {
                        onDeleteFileList(fileListItem.uid);
                      }}
                    />
                  ) : (
                    <DeleteSvg
                      onClick={() => {
                        onDeleteFileList(fileListItem.uid);
                      }}
                    />
                  )
                }
                className={`${preCls}-file-item-action-btn`}
              />
            </div>
          </div>
          <div className={`${preCls}-progress`}>
            <div
              className={`${preCls}-progress-bar`}
              style={{
                width: progress,
              }}
            ></div>
          </div>
          <div className={`${preCls}-file-item-feedback`}>
            <div className={`${preCls}-file-item-percent`}>{progress}</div>
            {props.validation && renderValidation(fileListItem)}
          </div>
        </div>
      </div>
    );
    if (props.itemRender) {
      return props.itemRender({
        remove: onDeleteFileList,
        reUpload: handleReUpload,
        fileItem: fileListItem,
        orignalNode,
      });
    }
    return orignalNode;
  };

  return (
    <div
      className={preCls}
      onDrop={(e) => {
        e.preventDefault();
      }}
      id={id}
    >
      <input
        accept={accept}
        type="file"
        style={{
          display: 'none',
        }}
        multiple={multiple}
        ref={inputFileRef}
        onChange={(e) => {
          handleUploadFiles(e.target.files || []);
          e.target.value = '';
        }}
      />
      <input
        accept={accept}
        type="file"
        style={{
          display: 'none',
        }}
        ref={inputFileReplaceRef}
        onChange={(e) => {
          handleUploadFiles(e.target.files || [], {
            replace: true,
            replaceId: inputRelaceId.current,
          });
          inputRelaceId.current = '';
          e.target.value = '';
        }}
      />
      {maxCount > 0 && fileList.length < maxCount && renderDragger()}
      {fileList.map((fileListItem) => renderFileListItem(fileListItem))}
    </div>
  );
};

export default UploadFile;

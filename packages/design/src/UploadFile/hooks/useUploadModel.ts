import { useModel } from '@chaomingd/store';
import { getAntApp } from '@chaomingd/design';
import { AsyncTaskQueue, uuid } from '@chaomingd/utils';
import { message } from 'antd';
import { useMemo, useRef } from 'react';
import { FileListItemProps, UploadFileProps } from '../type';
import { formatBitString } from '../utils/formatBitString';
import { getFileInfo, validateFileTypes } from '../utils/validateFileTypes';
import { useCreation, useMemoizedFn } from 'ahooks';

export interface UploadState {
  value: FileListItemProps[];
  dragEnter: boolean;
}

export function useUploadModel(props: UploadFileProps) {
  const dragOverTimer = useRef<any>();
  const asyncTaskQueue = useCreation(() => new AsyncTaskQueue(props.uploadConcurrency || 3), []);
  const model = useModel<UploadState>({
    state: {
      value: [],
      dragEnter: false,
    },
  });

  const { maxCount = 1 } = props;

  const hasValue = 'value' in props;
  useMemo(() => {
    if (hasValue) {
      if (Array.isArray(props.value)) {
        let value = props.value;
        if (maxCount > 0 && value.length > maxCount) {
          value = value.slice(0, maxCount);
        }
        model.setState(
          {
            value,
          },
          {
            silent: true,
          },
        );
      }
    }
  }, [props.value, hasValue]);

  const handleOnChange = useMemoizedFn((files: FileListItemProps[]) => {
    model.setState(
      {
        value: files,
      },
      {
        silent: hasValue,
      },
    );
    props.onChange?.(files);
  });

  // 处理拖拽进入
  const onDragOver = (e: any) => {
    e.preventDefault();
    clearTimeout(dragOverTimer.current);
    const { dragEnter } = model.getState();
    if (!dragEnter) {
      model.setState({
        dragEnter: true,
      });
    }
    dragOverTimer.current = setTimeout(() => {
      model.setState({
        dragEnter: false,
      });
    }, 100);
  };

  // 更新单个文件列表数据
  const updateFileItemByUid = (uid: string, data: Partial<FileListItemProps>) => {
    const { value: fileList } = model.getState();
    handleOnChange(
      fileList.map((item) => {
        if (item.uid === uid) {
          return {
            ...item,
            ...data,
          };
        }
        return item;
      }),
    );
  };

  // 处理上传前校验
  const handleBeforeUpload = async (file: File) => {
    const accepts = props.accepts || [];
    const maxFileSize = props.maxFileSize || -1;
    if (accepts) {
      const { isValid } = await validateFileTypes(file, accepts);
      if (!isValid) {
        return Promise.reject(new Error(`文件格式不正确！只支持 ${accepts.join(', ')} 类型的文件`));
      }
    }
    if (maxFileSize > 0) {
      if (file.size > maxFileSize) {
        return Promise.reject(new Error(`文件大小超出 ${formatBitString(maxFileSize)}`));
      }
    }

    if (props.beforeUpload) {
      await props.beforeUpload(file);
    }
  };

  // 文件内容校验
  function handleValidation(fileListItem: FileListItemProps) {
    const validation = props.validation!;
    const onValidationProgress = (percent: number) => {
      updateFileItemByUid(fileListItem.uid, {
        validationPercent: percent,
      });
    };
    const onValidationSuccess = () => {
      updateFileItemByUid(fileListItem.uid, {
        validationStatus: 'success',
      });
    };
    const onValidationError = (e: Error) => {
      updateFileItemByUid(fileListItem.uid, {
        validationStatus: 'error',
        validationError: e,
      });
    };
    updateFileItemByUid(fileListItem.uid, {
      validationStatus: 'validating',
    });
    const controller = new AbortController();
    const abort = () => {
      controller.abort();
    };
    fileListItem.validationAbort = abort;
    const res = validation.validateRequest?.({
      onProgress: onValidationProgress,
      onError: onValidationError,
      onSuccess: onValidationSuccess,
      fileItem: fileListItem,
      axiosRequestConfig: {
        signal: controller.signal,
      },
    });
    if (res?.abort) {
      fileListItem.validationAbort = abort;
    }
  }

  // 处理上传逻辑
  const handleUploadFiles = async (
    files: ArrayLike<File>,
    options?: {
      replace: boolean;
      replaceId: string;
    },
  ) => {
    const Message = getAntApp().message || message;
    const fileListPromises: Promise<FileListItemProps | null>[] = Array.from(files).map(
      async (file) => {
        const fileInfo = await getFileInfo(file);
        const fileName = file.name;
        const newFile = new File([file], fileName, {
          type: fileInfo.mimeType,
        });
        const fileListItem: FileListItemProps = {
          name: newFile.name,
          uid: uuid(),
          status: 'uploading' as const,
          file: newFile,
          percent: 0,
          size: file.size,
          blobUrl: URL.createObjectURL(newFile),
        };

        try {
          // 上传前校验
          await handleBeforeUpload(newFile);
          return fileListItem;
        } catch (e: any) {
          console.error(e);
          Message.error(e?.message);
          return null;
        }
      },
    );

    function handleUploadFile(fileListItem: FileListItemProps) {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append(props.name || 'file', fileListItem.file!);
        if (props.data) {
          Object.keys(props.data).forEach((key) => {
            formData.append(key, props.data![key]);
          });
        }
        // 取消上传
        const controller = new AbortController();
        const abort = () => {
          controller.abort();
        };
        fileListItem.abort = abort;

        const onProgress = (event: { percent: number }) => {
          updateFileItemByUid(fileListItem.uid, {
            percent: event.percent,
          });
        };
        const onError = (e: Error, body?: any) => {
          updateFileItemByUid(fileListItem.uid, {
            status: 'error',
            response: body,
            error: e,
          });
          reject(e);
        };
        const onSuccess = (body: any) => {
          let url: string;
          if (typeof body === 'string') {
            url = body;
          } else {
            url = body?.url || '';
          }
          updateFileItemByUid(fileListItem.uid, {
            status: 'done',
            response: body,
            url,
          });
          resolve(true);

          // 开始校验文件内容
          if (props.validation) {
            handleValidation(fileListItem);
          }
        };
        updateFileItemByUid(fileListItem.uid, {
          status: 'uploading',
        });
        if (props.customRequest) {
          const customeRequestReturnValue = props.customRequest({
            onError,
            onProgress,
            signal: controller.signal,
            file: fileListItem.file!,
            fileItem: fileListItem,
            onSuccess,
          });
          if (customeRequestReturnValue?.abort) {
            fileListItem.abort = customeRequestReturnValue.abort;
          }
        } else if (props.uploadRequest) {
          props
            .uploadRequest?.(
              formData,
              {
                onUploadProgress: ({ progress }) => {
                  onProgress({
                    percent: (progress || 0) * 100,
                  });
                },
                signal: controller.signal,
              },
              fileListItem,
            )
            .then(onSuccess)
            .catch((e) => {
              console.error(e);
              onError(e, e.response?.data);
            });
        }
      });
    }

    let fileList = (await Promise.all(fileListPromises)).filter(Boolean) as FileListItemProps[];
    if (fileList.length) {
      if (options?.replace) {
        asyncTaskQueue.add(() => handleUploadFile(fileList[0]));
        asyncTaskQueue.start();
        updateFileItemByUid(options.replaceId, fileList[0]);
      } else {
        const { value: currentFileList } = model.getState();
        if (maxCount > 0) {
          const remainCount = maxCount - currentFileList.length;
          fileList = fileList.slice(0, remainCount);
        }
        fileList.forEach((fileListItem) => {
          asyncTaskQueue.add(() => handleUploadFile(fileListItem));
        });
        asyncTaskQueue.start();
        handleOnChange([...model.getState().value, ...fileList]);
      }
    }
  };

  // 删除文件
  const onDeleteFileList = (uid: string) => {
    const { value } = model.getState();
    const deleteFile = value.find((item) => item.uid === uid);
    if (deleteFile) {
      handleOnChange(value.filter((fileListItem) => fileListItem.uid !== uid));
      if (deleteFile.status === 'uploading') {
        deleteFile.abort?.();
      }
      if (deleteFile.validationStatus === 'validating') {
        deleteFile.validationAbort?.();
      }
      if (deleteFile.blobUrl) {
        URL.revokeObjectURL(deleteFile.blobUrl);
      }
      props.onRemove?.(deleteFile);
    }
  };

  return {
    model,
    onDragOver,
    handleUploadFiles,
    onDeleteFileList,
  };
}

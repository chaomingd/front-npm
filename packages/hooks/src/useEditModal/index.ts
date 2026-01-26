import { useRef } from 'react';
import { FormInstance } from 'antd';
import { useModel } from '@chaomingd/store';
import { omit } from '@chaomingd/utils';

function defaultHandler() {
  return Promise.resolve({});
}

interface IState {
  visible: boolean;
  title: string;
  loading: boolean;
  confirmLoading: boolean;
  isEdit: boolean;
  [key: string]: any;
}

interface IHandlerReturnValue<
  IFormValues extends Record<string, any> = Record<string, any>,
  IUserState extends Record<string, any> = Record<string, any>,
> {
  formValue?: Partial<IFormValues>;
  state?: Partial<IState & IUserState>;
}
interface IHandlerData<
  IFormValues extends Record<string, any> = Record<string, any>,
  IUserState extends Record<string, any> = Record<string, any>,
> {
  formValue?: Partial<IFormValues>;
  state?: Partial<IState & IUserState>;
  onSave?: (res: any, state: IState & IUserState) => void;
  onError?: (e: Error) => void;
  [key: string]: any;
}

type TPromiseValue<T> = T | Promise<T>;

interface IConfig<
  IFormValues extends Record<string, any> = Record<string, any>,
  IUserState extends Record<string, any> = Record<string, any>,
> {
  title?: string;
  hasLoading?: boolean;
  hasConfirmLoading?: boolean;
  saveService?: (formValues: IFormValues, state: IState & IUserState) => Promise<any>;
  onSaveClose?: boolean;
  onCloseResetState?: boolean;
  onClose?: () => void;
  onSave?: (res: any, state: IState & IUserState) => void;
  onAdd?: (
    data: IHandlerReturnValue<IFormValues, IUserState>,
  ) => TPromiseValue<void | undefined | IHandlerReturnValue<IFormValues, IUserState>>;
  onEdit?: (
    data: IHandlerReturnValue<IFormValues, IUserState>,
  ) => TPromiseValue<void | undefined | IHandlerReturnValue<IFormValues, IUserState>>;
  defaultState?: IUserState;
  form?: FormInstance;
}

export function useEditModal<
  IFormValues extends Record<string, any> = Record<string, any>,
  IUserState extends Record<string, any> = Record<string, any>,
>({
  onAdd = defaultHandler,
  onEdit = defaultHandler,
  title = 'Modal Title',
  saveService = defaultHandler,
  hasLoading = true,
  hasConfirmLoading = true,
  onSaveClose = true,
  onCloseResetState = true,
  onClose,
  onSave,
  defaultState,
  form,
}: IConfig<IFormValues, IUserState> = {}) {
  const formRef = useRef<FormInstance | null>(form || null);
  const originDataRef = useRef<IHandlerData<IFormValues, IUserState>>({});
  const defaultEditState = {
    visible: false,
    title,
    loading: false,
    isEdit: false,
    confirmLoading: false,
    ...defaultState,
  };
  const model = useModel<IState, object>({
    state: defaultEditState,
  });
  const state = model.useGetState();
  const createHandler = (isEdit: boolean) => {
    return (data: IHandlerData<IFormValues, IUserState>) => {
      if (model.getState().visible) {
        return;
      }
      originDataRef.current = data;
      const handler = isEdit ? onEdit : onAdd;
      const formValues: Record<string, any> = { ...(data.formValue || {}) };
      const openState: Partial<IState> = {
        ...(data.state || {}),
        visible: true,
        isEdit,
      };
      if (hasLoading) {
        openState.loading = true;
      }
      model.setState(openState);
      const newState: Partial<IState> = {
        loading: false,
      };
      Promise.resolve(handler(data as any))
        .then((returnValue) => {
          if (returnValue && returnValue.formValue) {
            Object.assign(formValues, returnValue?.formValue || {});
          }
          if (returnValue && returnValue.state) {
            Object.assign(newState, returnValue.state);
          }
        })
        .finally(() => {
          model.setState(newState);
          formRef.current?.setFieldsValue(formValues);
        });
    };
  };
  const add = createHandler(false);
  const edit = createHandler(true);
  const close = () => {
    if (onCloseResetState) {
      model.setState(omit(defaultEditState, ['title']));
    } else {
      model.setState({
        visible: false,
      });
    }
    onClose && onClose();
  };
  const afterOpenChange = (open: boolean) => {
    if (!open) {
      if (formRef.current) {
        formRef.current.resetFields();
      }
    }
  };
  const onSubmit = () => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const handleService = (values: IFormValues, state: IState & IUserState) => {
      return saveService?.(values, state).then((res) => {
        const currentState = model.getState() as IState & IUserState;
        onSaveClose && close();
        onSave && onSave(res, currentState);
        originDataRef.current.onSave && originDataRef.current.onSave(res, currentState);
        if (hasConfirmLoading) {
          model.setState({
            confirmLoading: false,
          });
        }
        return res;
      });
    };
    if (hasConfirmLoading) {
      model.setState({
        confirmLoading: true,
      });
    }
    if (formRef.current) {
      formRef.current
        ?.validateFields()
        .then((values) => {
          return handleService(values, model.getState() as IState & IUserState);
        })
        .catch((e) => {
          console.error(e);
          originDataRef.current.onError && originDataRef.current.onError(e);
          if (hasConfirmLoading) {
            model.setState({
              confirmLoading: false,
            });
          }
        });
    } else {
      handleService({} as IFormValues, model.getState() as IState & IUserState).catch((e) => {
        console.error(e);
        originDataRef.current.onError && originDataRef.current.onError(e);
        if (hasConfirmLoading) {
          model.setState({
            confirmLoading: false,
          });
        }
      });
    }
  };
  const modalProps = {
    open: state.visible,
    title: state.title,
    onCancel: close,
    onOk: onSubmit,
    confirmLoading: state.confirmLoading,
    afterOpenChange,
  };
  return {
    modalProps,
    state: state as IState & IUserState,
    originDataRef,
    formRef,
    add,
    edit,
    close,
    onSubmit,
    submit: onSubmit,
    model,
  };
}

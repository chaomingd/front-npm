import { useContext, useEffect, useMemo } from 'react';
import { CheckGroupContext } from './context';
import { useCheckGroup } from './hooks/useCheckGroup';
import { CheckGroupProps, CheckItemProps, Key } from './type';

const _CheckGroup = <K extends Key>(props: CheckGroupProps<K>) => {
  const model = useCheckGroup(props);
  const hasKeys = 'keys' in props;
  model.useGroupKeys = hasKeys;
  // model.useUpdate();
  useEffect(() => {
    if (hasKeys) {
      model.setKeys((props.keys || []) as any);
    }
  }, [props.keys, model, hasKeys]);
  const contextValue = useMemo(() => {
    return {
      model,
      props,
    };
  }, [model, props.value]);
  return (
    <CheckGroupContext.Provider value={contextValue}>{props.children}</CheckGroupContext.Provider>
  );
};

const CheckItem = <K extends Key>(props: CheckItemProps<K>) => {
  const { value, children } = props;
  const { model } = useContext(CheckGroupContext);
  const multiple = model.props.multiple;
  const useGroupKeys = model.useGroupKeys;
  const { valueMap, indeterminate } = model.useGetState();
  const isCheck = valueMap.get(value) || false;

  useMemo(() => {
    if (!useGroupKeys) {
      model.registerKey(value);
    }
    return () => {
      if (!useGroupKeys) {
        model.unRegisterKey(value);
      }
    };
  }, [model, value, useGroupKeys]);
  if (typeof children === 'function') {
    const onChange = () => {
      multiple ? model.handleToggleCheck(value) : model.handleCheckOne(value);
    };
    return children({ checked: isCheck, indeterminate, onChange });
  }
  return children;
};

const CheckAllItem = <K extends Key>(props: CheckItemProps<K>) => {
  const { children } = props;
  const { model } = useContext(CheckGroupContext);
  const { isCheckAll, indeterminate } = model.useGetState();
  if (typeof children === 'function') {
    return children({
      checked: isCheckAll,
      indeterminate,
      onChange: model.handleToggleCheckAll,
    });
  }
  return children;
};

const _component = _CheckGroup;

type Comp = typeof _component;

const CheckGroup = _component as Comp & {
  CheckItem: typeof CheckItem;
  CheckAllItem: typeof CheckAllItem;
};

CheckGroup.CheckItem = CheckItem;
CheckGroup.CheckAllItem = CheckAllItem;

export default CheckGroup;

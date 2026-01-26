import { Model } from '@chaomingd/store';
import { arrayToMap } from '@chaomingd/utils';
import { useCreation } from 'ahooks';
import type { CheckboxProps } from 'antd';
import { Checkbox as BaseCheckbox } from 'antd';
import type {
  ReactNode} from 'react';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';

export type Key = string | number | symbol;

export interface CheckBoxGroupProps {
  value?: Key[];
  onChange?: (val: Key[]) => void;
  children?: ReactNode | ReactNode[];
  keys?: Key[];
}

export interface CheckBoxGroupState {
  value: Key[];
  valueMap: Record<Key, boolean>;
  keys: Key[];
  isCheckAll: boolean;
  indeterminate: boolean;
}
export class CheckBoxGroupModel extends Model<CheckBoxGroupState> {
  keys: Key[] = [];
  timer: any;
  props: CheckBoxGroupProps = {};
  constructor() {
    super({
      autoInit: false,
      state: {
        value: [],
        valueMap: {},
        keys: [],
        isCheckAll: false,
        indeterminate: false,
      },
      computed: [
        {
          keys: ['value'],
          hander: ({ value }) => {
            return {
              valueMap: arrayToMap(value, undefined, (_: any) => true),
            };
          },
        },
        {
          keys: ['value', 'keys'],
          hander: ({ valueMap }) => {
            return this.getCheckAllInfo(valueMap);
          },
        },
      ],
    });
    this.init();
  }

  getCheckAllInfo(checkMap?: Record<Key, boolean>) {
    const { valueMap } = this.getState();
    const ckMap = checkMap || valueMap;
    const { keys } = this;
    let indeterminate = false;
    let isCheckAll = true;
    keys.forEach((k) => {
      const isCheck = ckMap[k];
      if (isCheck) {
        indeterminate = true;
      } else {
        isCheckAll = false;
      }
      return isCheck;
    });
    if (isCheckAll) {
      indeterminate = false;
    }
    return {
      isCheckAll,
      indeterminate,
    };
  }

  handleToggleCheckAll() {
    const { isCheckAll } = this.getState();
    let newKeys: Key[];
    if (isCheckAll) {
      newKeys = [];
    } else {
      newKeys = [...this.keys];
    }
    if (!('value' in this.props)) {
      this.setState({
        value: newKeys,
      });
    }
    this.props.onChange?.(newKeys);
  }

  handleToggleCheck(key: Key) {
    const { valueMap, value } = this.getState();
    const isCheck = valueMap[key];
    let newKeys = [...value];
    if (isCheck) {
      newKeys = newKeys.filter((k) => k !== key);
    } else {
      newKeys.push(key);
    }
    if (!('value' in this.props)) {
      this.setState({
        value: newKeys,
      });
    }
    this.props.onChange?.(newKeys);
  }

  registerKey(key: Key) {
    if (!this.keys.includes(key)) {
      this.keys.push(key);
    }
    this.__updateKeys();
  }
  setKeys(keys: Key[]) {
    this.keys = keys;
    this.__updateKeys();
  }
  unRegisterKey(key: Key) {
    this.keys = this.keys.filter((k) => k !== key);
    this.__updateKeys();
  }
  __updateKeys() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({
        keys: [...this.keys],
      });
    }, 10);
  }
}
export function useCheckBoxGroup(props: CheckBoxGroupProps) {
  const hasValue = 'value' in props;
  const model = useCreation(() => {
    return new CheckBoxGroupModel();
  }, []);
  model.props = props;

  useMemo(() => {
    if (hasValue) {
      // 处理外部传入的value （受控模式）
      model.setState(
        {
          value: props.value || [],
        },
        {
          silent: true,
        },
      );
    }
  }, [props.value, model, hasValue]);

  return model;
}

type CheckBoxGroupContextValue = {
  model: CheckBoxGroupModel;
  useGroupKeys: boolean;
};

export const CheckBoxGroupContext = createContext<CheckBoxGroupContextValue>({
  model: new CheckBoxGroupModel(),
  useGroupKeys: false,
});

const CheckBoxGroup = (props: CheckBoxGroupProps) => {
  const model = useCheckBoxGroup(props);
  const hasKeys = 'keys' in props;
  useEffect(() => {
    if (hasKeys) {
      model.setKeys(props.keys || []);
    }
  }, [props.keys, model, hasKeys]);

  return (
    <CheckBoxGroupContext.Provider
      value={{
        model,
        useGroupKeys: hasKeys,
      }}
    >
      {props.children}
    </CheckBoxGroupContext.Provider>
  );
};

const Checkbox = (props: CheckboxProps & { value?: Key }) => {
  const { value, ...restProps } = props;
  const { model, useGroupKeys } = useContext(CheckBoxGroupContext);
  const { valueMap } = model.useGetState(undefined, undefined, value);
  const isCheck = valueMap[value];
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
  return (
    <BaseCheckbox
      {...restProps}
      checked={isCheck}
      onChange={() => {
        model.handleToggleCheck(value);
      }}
    />
  );
};

const CheckBoxAll = (props: CheckboxProps) => {
  const { model } = useContext(CheckBoxGroupContext);
  const { isCheckAll, indeterminate } = model.useGetState();
  return (
    <BaseCheckbox
      {...props}
      checked={isCheckAll}
      indeterminate={indeterminate}
      onChange={() => {
        model.handleToggleCheckAll();
      }}
    />
  );
};

CheckBoxGroup.Checkbox = Checkbox;
CheckBoxGroup.CheckboxAll = CheckBoxAll;

export default () => {
  const [value, setValue] = React.useState<Key[]>([]);
  return (
    <div
      style={{
        color: '#000',
      }}
    >
      <div>
        选中的值：
        {value.map((v) => (
          <span key={String(v)}>{String(v)},</span>
        ))}
      </div>
      <CheckBoxGroup
        onChange={(checkedKeys) => {
          setValue(checkedKeys);
          console.log(checkedKeys);
        }}
      >
        <ul>
          <li>
            <CheckBoxGroup.Checkbox
              style={{
                color: '#000',
              }}
              value="apple"
            >
              Apple
            </CheckBoxGroup.Checkbox>
          </li>
          <li>
            <CheckBoxGroup.Checkbox
              style={{
                color: '#000',
              }}
              value="banana"
            >
              Banana
            </CheckBoxGroup.Checkbox>
          </li>
          <li>
            <CheckBoxGroup.Checkbox
              style={{
                color: '#000',
              }}
              value="orange"
            >
              Orange
            </CheckBoxGroup.Checkbox>
          </li>
          <li>
            <CheckBoxGroup.Checkbox
              style={{
                color: '#000',
              }}
              value="pear"
            >
              Pear
            </CheckBoxGroup.Checkbox>
          </li>
        </ul>
      </CheckBoxGroup>
    </div>
  );
};

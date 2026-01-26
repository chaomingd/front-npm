import { Model } from '@chaomingd/store';
import { useCreation } from 'ahooks';
import { useMemo } from 'react';
import { CheckGroupProps, CheckGroupState, Key } from '../type';

export class CheckGroupModel<K extends Key> extends Model<CheckGroupState<K>> {
  keys: K[] = [];
  timer: any;
  props: CheckGroupProps<K> = {};
  useGroupKeys = false;
  constructor() {
    super({
      autoInit: false,
      state: {
        value: [],
        valueMap: new Map(),
        keys: [],
        isCheckAll: false,
        indeterminate: false,
      },
      computed: [
        {
          keys: ['value'],
          hander: ({ value }) => {
            const m = new Map<K, boolean>();
            value.forEach((k) => {
              m.set(k, true);
            });
            return {
              valueMap: m,
            };
          },
        },
        {
          keys: ['value', 'keys'],
          hander: ({ valueMap }) => {
            return {
              ...this.getCheckAllInfo(valueMap),
            };
          },
        },
      ],
    });
    this.init();
  }

  getCheckAllInfo(checkMap?: Map<Key, boolean>) {
    const { valueMap } = this.getState();
    const ckMap = checkMap || valueMap;
    const { keys } = this;
    let indeterminate = false;
    let isCheckAll = true;
    keys.forEach((k) => {
      const isCheck = ckMap.get(k);
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

  handleToggleCheckAll = () => {
    const { isCheckAll } = this.getState();
    let newKeys: K[];
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
  };

  handleToggleCheck = (key: K) => {
    const { valueMap, value } = this.getState();
    const isCheck = valueMap.get(key);
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
  };

  handleCheckOne = (key: K) => {
    const newKeys = [key];
    if (!('value' in this.props)) {
      this.setState({
        value: newKeys,
      });
    }
    this.props.onChange?.(newKeys);
  };

  registerKey(key: K) {
    if (!this.keys.includes(key)) {
      this.keys.push(key);
    }
    this.__updateKeys();
  }
  setKeys(keys: K[]) {
    this.keys = keys;
    this.__updateKeys();
  }
  unRegisterKey(key: K) {
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
export function useCheckGroup<K extends Key>(props: CheckGroupProps<K>) {
  const hasValue = 'value' in props;
  const model = useCreation(() => {
    return new CheckGroupModel<K>();
  }, []);
  model.props = props;

  useMemo(() => {
    if (hasValue) {
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

import { createContext } from 'react';
import { CheckGroupModel } from './hooks/useCheckGroup';
import { CheckGroupProps } from './type';

type CheckGroupContextType = {
  model: CheckGroupModel<any>;
  props: CheckGroupProps<any>;
};
export const CheckGroupContext = createContext<CheckGroupContextType>({
  model: new CheckGroupModel(),
  props: {},
});

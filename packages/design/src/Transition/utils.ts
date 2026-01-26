import { TransitionProps, ETransitionStatus } from './type';

export const DEFAULT_DURATION = 300;
export function getDuration({
  duration,
  status,
}: {
  duration?: TransitionProps['duration'];
  status: ETransitionStatus;
}) {
  let dur: number;
  if (duration === undefined) {
    dur = DEFAULT_DURATION;
  } else if (typeof duration === 'number') {
    dur = duration;
  } else {
    dur = duration[status as keyof TransitionProps['duration']] ?? DEFAULT_DURATION;
  }
  return dur;
}

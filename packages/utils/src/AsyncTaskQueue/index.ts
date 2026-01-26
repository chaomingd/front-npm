type Task<T = any> = () => Promise<T>;

export class AsyncTaskQueue {
  private concurrency: number;
  private running: number = 0;
  private queue: { task: Task; resolve: (v: any) => void; reject: (e: any) => void }[] = [];
  private started: boolean = false;

  constructor(concurrency: number, initialTasks?: Task[]) {
    if (concurrency < 1) throw new Error('Concurrency must be at least 1');
    this.concurrency = concurrency;
    if (initialTasks && initialTasks.length) {
      for (const task of initialTasks) {
        this.add(task);
      }
    }
  }

  add<T>(task: Task<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.runNext();
    });
  }

  start() {
    if (!this.started) {
      this.started = true;
      this.runNext();
    }
  }

  pause() {
    this.started = false;
  }

  stop() {
    this.started = false;
    this.running = 0;
    this.queue = [];
  }

  private runNext() {
    if (!this.started) return;
    while (this.running < this.concurrency && this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) return;
      this.running++;
      item
        .task()
        .then((result) => {
          item.resolve(result);
        })
        .catch((err) => {
          item.reject(err);
        })
        .finally(() => {
          this.running--;
          this.runNext();
        });
    }
  }
}

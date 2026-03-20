export interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly logo: string;
  readonly dateRelease: string;
  readonly dateRevision: string;
}

export type UIStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UIState<T> {
  readonly data: T;
  readonly status: UIStatus;
  readonly error: string | null;
}

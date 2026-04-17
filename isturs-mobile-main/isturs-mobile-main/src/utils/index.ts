type PropsWithout<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function removeProps<T, K extends keyof T>(obj: T, props: K[]): PropsWithout<T, K> {
  return Object.keys(obj as object).reduce((acc, key) => {
    if (!props.includes(key as K)) {
      acc[key as keyof PropsWithout<T, K>] = obj[key as keyof T] as PropsWithout<T, K>[keyof PropsWithout<T, K>];
    }
    return acc;
  }, {} as PropsWithout<T, K>);
}

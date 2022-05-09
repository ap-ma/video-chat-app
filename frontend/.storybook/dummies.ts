import { MutaionLoading, MutaionReset, MutateFunction } from '../types'

export const dummyMutation = <Result, TData, TVariables>(
  name: string,
  result?: Result,
  loading?: MutaionLoading
): {
  result?: Result
  loading: MutaionLoading
  reset: MutaionReset
  mutate: MutateFunction<TData, TVariables>
} => ({
  result,
  loading: !!loading,
  reset: () => alert(`${name} Mutation - Reset`),
  mutate: () => {
    alert(`${name} Mutation - Mutate`)
    return Promise.resolve({ data: undefined, extensions: undefined, context: undefined })
  }
})

import { AuthMFAUnenrollResponse, MFAUnenrollParams } from '@supabase/supabase-js'
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { auth } from 'lib/gotrue'
import { profileKeys } from './keys'

const mfaUnenroll = async (params: MFAUnenrollParams) => {
  const { error, data } = await auth.mfa.unenroll(params)

  auth.mfa.listFactors
  if (error) throw error
  return data
}

type CustomMFAUnenrollResponse = NonNullable<AuthMFAUnenrollResponse['data']>
type CustomMFAUnenrollError = NonNullable<AuthMFAUnenrollResponse['error']>

export const useMfaUnenrollMutation = ({
  onSuccess,
  ...options
}: Omit<
  UseMutationOptions<CustomMFAUnenrollResponse, CustomMFAUnenrollError, MFAUnenrollParams>,
  'mutationFn'
> = {}) => {
  const queryClient = useQueryClient()

  return useMutation((vars) => mfaUnenroll(vars), {
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries(profileKeys.mfaFactors())
      await onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

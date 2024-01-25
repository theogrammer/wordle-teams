'use server'

import { Database } from '@/lib/database.types'
import { getSession } from '@/lib/utils'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { log } from 'next-axiom'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function upsertBoard(formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })
  const session = await getSession(supabase)
  if (!session) throw new Error('Unauthorized')

  const scoreId = formData.get('scoreId') as string
  const scoreDate = formData.get('scoreDate') as string
  const answer = formData.get('answer') as string
  const guessesInput = formData.getAll('guesses') as string[]
  const guesses = guessesInput[0].split(',').filter((g) => g !== '')
  const teamId = formData.get('teamId') as string
  const month = formData.get('month') as string

  let dailyScore

  if (!!scoreId && scoreId !== '-1') {
    const { data: newScore, error } = await supabase
      .from('daily_scores')
      .update({ answer, guesses })
      .eq('id', scoreId)
      .select('*')
      .single()

    if (error) {
      log.error('Failed to add or update board', { error })
      throw new Error('Failed to add or update board')
    }
    dailyScore = newScore
  } else {
    const { data: newScore, error } = await supabase
      .from('daily_scores')
      .insert({ answer, date: scoreDate, guesses, player_id: session.user.id })
      .select('*')
      .single()

    if (error) {
      log.error('Failed to add or update board', { error })
      throw new Error('Failed to add or update board')
    }
    dailyScore = newScore
  }

  revalidatePath('/')
  redirect(`/${teamId}/${month}`)
}
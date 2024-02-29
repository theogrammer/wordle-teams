'use client'

import { DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu'
import { format, formatISO, parseISO } from 'date-fns'
import { useRouter } from 'next/navigation'

type MonthDropdownRadioGroupProps = {
  initials: string
  teamId: number
  selectedMonth: Date
  monthOptions: Date[]
}

export default function MonthDropdownRadioGroup({
  initials,
  teamId,
  selectedMonth,
  monthOptions,
}: MonthDropdownRadioGroupProps) {
  const router = useRouter()
  const handleMonthChange = async (m: string) => {
    const newMonth = format(parseISO(m), 'yyyyMM')
    router.push(`/${initials}/${teamId}/${newMonth}`)
  }
  return (
    <DropdownMenuRadioGroup value={formatISO(selectedMonth)} onValueChange={handleMonthChange}>
      {monthOptions.map((option) => (
        <DropdownMenuRadioItem key={formatISO(option)} value={formatISO(option)}>
          {format(option, 'MMM yyyy')}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  )
}

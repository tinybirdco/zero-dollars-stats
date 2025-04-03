"use client";
import { parse, format, subDays } from 'date-fns'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DateRangePickerValue } from '@tremor/react'
import { DateFilter, dateFormat } from '../types/date-filter'

export default function useDateFilter() {
  const router = useRouter()

  //const searchParams = useSearchParams()
  const isBrowser = typeof window !== 'undefined'
  
  // Use provided search param, or window.location.search if in browser, or empty string if on server
  const searchParams = new URLSearchParams((isBrowser ? window.location.search : ''))
  
  const [dateRangePickerValue, setDateRangePickerValue] =
  useState<DateRangePickerValue>()
  
  const setDateFilter = useCallback(
    ([startDate, endDate, value]: DateRangePickerValue) => {
      const lastDays = value ?? DateFilter.Custom
      const params = new URLSearchParams(searchParams.toString())
      params.set('last_days', lastDays)

      if (lastDays === DateFilter.Custom && startDate && endDate) {
        params.set('start_date', format(startDate, dateFormat))
        params.set('end_date', format(endDate, dateFormat))
      } else {
        params.delete('start_date')
        params.delete('end_date')
      }
      router.push(`?${params.toString()}`)
    },
    [router, searchParams]
  )

  const lastDaysParam = searchParams.get('last_days') as DateFilter
  const lastDays: DateFilter =
    typeof lastDaysParam === 'string' &&
      Object.values(DateFilter).includes(lastDaysParam)
      ? lastDaysParam
      : DateFilter.Last7Days

  const { startDate, endDate } = useMemo(() => {
    const today = new Date()
    if (lastDays === DateFilter.Custom) {
      const startDateParam = searchParams.get('start_date')
      const endDateParam = searchParams.get('end_date')

      const startDate =
        startDateParam ||
        format(subDays(today, +DateFilter.Last7Days), dateFormat)
      const endDate = endDateParam || format(today, dateFormat)

      return { startDate, endDate }
    }

    const startDate = format(subDays(today, +lastDays), dateFormat)
    const endDate =
      lastDays === DateFilter.Yesterday
        ? format(subDays(today, +DateFilter.Yesterday), dateFormat)
        : format(today, dateFormat)

    return { startDate, endDate }
  }, [lastDays, searchParams])


  useEffect(() => {
    setDateRangePickerValue([
      parse(startDate, dateFormat, new Date()),
      parse(endDate, dateFormat, new Date()),
      lastDays === DateFilter.Custom ? null : lastDays,
    ])
  }, [startDate, endDate, lastDays])

  const onDateRangePickerValueChange = useCallback(
    ([startDate, endDate, value]: DateRangePickerValue) => {
      if (startDate && endDate) {
        setDateFilter([startDate, endDate, value])
      } else {
        setDateRangePickerValue([startDate, endDate, value])
      }
    },
    [setDateFilter]
  )

  return {
    startDate,
    endDate,
    dateRangePickerValue,
    onDateRangePickerValueChange,
  }
}

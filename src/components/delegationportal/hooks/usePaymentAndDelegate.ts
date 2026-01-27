/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { apiFetch } from '@/app/utils/apiFetch'

export function usePaymentAndDelegate(user: any | null, delegation: any | null) {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
  const [delegates, setDelegates] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!user || !delegation?.id) {
      setPaymentStatus(null)
      setDelegates([])
      setFetching(false)
      return
    }

    const fetchData = async () => {
      setFetching(true)

      try {
        const paymentRes = await apiFetch(`/api/payments?delegationId=${delegation.id}`)

        const { paymentStatus } = await paymentRes.json()
        setPaymentStatus(paymentStatus)

        if (paymentStatus === 'paid') {
          const delegatesRes = await apiFetch(
            `/api/teacher/delegates?delegationId=${delegation.id}`,
          )
          const delegatesData = await delegatesRes.json()
          setDelegates(delegatesData.delegates || [])
        } else {
          setDelegates([])
        }
      } catch {
        setPaymentStatus('pending')
        setDelegates([])
      } finally {
        setFetching(false)
      }
    }

    fetchData()
  }, [user, delegation?.id])

  return { paymentStatus, delegates, setDelegates, fetching, setPaymentStatus }
}

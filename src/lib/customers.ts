import type { Customer, Transaction } from '../types'
import { normalizeText, tokenize } from './filters'

export type CustomerSort = 'spent' | 'recent' | 'name'

export function buildCustomers(transactions: readonly Transaction[]): Customer[] {
  const byEmail = new Map<string, Customer>()

  for (const tx of transactions) {
    const key = tx.email.trim().toLowerCase()
    const current = byEmail.get(key)

    if (current === undefined) {
      byEmail.set(key, {
        email: tx.email,
        name: tx.customer,
        orders: 1,
        pendingOrders: tx.status === 'pending' ? 1 : 0,
        totalSpent: tx.status === 'completed' ? tx.amount : 0,
        lastOrderDate: tx.date,
      })
      continue
    }

    const isNewest = tx.date > current.lastOrderDate
    byEmail.set(key, {
      ...current,
      name: isNewest ? tx.customer : current.name,
      lastOrderDate: isNewest ? tx.date : current.lastOrderDate,
      orders: current.orders + 1,
      pendingOrders: current.pendingOrders + (tx.status === 'pending' ? 1 : 0),
      totalSpent: current.totalSpent + (tx.status === 'completed' ? tx.amount : 0),
    })
  }

  return Array.from(byEmail.values())
}

export function filterCustomers(customers: readonly Customer[], query: string): Customer[] {
  const tokens = tokenize(query)
  if (tokens.length === 0) return [...customers]
  return customers.filter((customer) => {
    const haystack = normalizeText(`${customer.name} ${customer.email}`)
    return tokens.every((token) => haystack.includes(token))
  })
}

export function sortCustomers(customers: readonly Customer[], sort: CustomerSort): Customer[] {
  const copy = [...customers]
  switch (sort) {
    case 'spent':
      return copy.sort((a, b) => b.totalSpent - a.totalSpent || a.name.localeCompare(b.name, 'en'))
    case 'recent':
      return copy.sort(
        (a, b) => b.lastOrderDate.localeCompare(a.lastOrderDate) || a.name.localeCompare(b.name, 'en'),
      )
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name, 'en'))
  }
}

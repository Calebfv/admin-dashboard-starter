import { DollarSign, Percent, Receipt, Users } from 'lucide-react'
import type { PaymentMethod, Stat, Transaction, TransactionStatus, User } from '../types'

export const CURRENT_USER: User = {
  name: 'Manager',
  email: 'manager@example.com',
  initials: 'M',
}

export const STATS: Stat[] = [
  {
    id: 'active-users',
    label: 'Active users',
    value: '12,482',
    change: 12.5,
    icon: Users,
    hint: 'vs. last month',
  },
  {
    id: 'revenue',
    label: 'Revenue',
    value: '$48,290',
    change: 8.2,
    icon: DollarSign,
    hint: 'vs. last month',
  },
  {
    id: 'conversion',
    label: 'Conversion rate',
    value: '3.24%',
    change: -0.6,
    icon: Percent,
    hint: 'vs. last month',
  },
  {
    id: 'avg-ticket',
    label: 'Average ticket',
    value: '$86.40',
    change: 2.3,
    icon: Receipt,
    hint: 'vs. last month',
  },
]

type Row = [
  id: string,
  customer: string,
  email: string,
  amount: number,
  status: TransactionStatus,
  date: string,
  method: PaymentMethod,
]

const ROWS: Row[] = [
  ['TX-1048', 'Olivia Martín', 'olivia.martin@email.com', 1999.0, 'completed', '2026-10-16', 'Card'],
  ['TX-1047', 'Jackson Lee', 'jackson.lee@email.com', 39.0, 'pending', '2026-10-16', 'PayPal'],
  ['TX-1046', 'Isabella Nguyen', 'isabella.nguyen@email.com', 299.0, 'completed', '2026-10-15', 'Card'],
  ['TX-1045', 'William Kim', 'will@email.com', 99.0, 'cancelled', '2026-10-15', 'Bank transfer'],
  ['TX-1044', 'Sofía Davis', 'sofia.davis@email.com', 39.0, 'completed', '2026-10-14', 'PayPal'],
  ['TX-1043', 'Mateo Rojas', 'mateo.rojas@email.com', 549.5, 'completed', '2026-10-14', 'Card'],
  ['TX-1042', 'Valentina Cruz', 'valentina.cruz@email.com', 120.0, 'pending', '2026-10-13', 'Bank transfer'],
  ['TX-1041', 'Lucas Fernández', 'lucas.fernandez@email.com', 780.0, 'completed', '2026-10-13', 'Card'],
  ['TX-1040', 'Camila Torres', 'camila.torres@email.com', 65.9, 'completed', '2026-10-12', 'PayPal'],
  ['TX-1039', 'Daniel Herrera', 'daniel.herrera@email.com', 1250.0, 'cancelled', '2026-10-12', 'Card'],
  ['TX-1038', 'Emma Wilson', 'emma.wilson@email.com', 215.0, 'completed', '2026-10-11', 'Card'],
  ['TX-1037', 'Noah Brown', 'noah.brown@email.com', 42.0, 'pending', '2026-10-11', 'PayPal'],
  ['TX-1036', 'Lucía Vargas', 'lucia.vargas@email.com', 399.0, 'completed', '2026-10-10', 'Bank transfer'],
  ['TX-1035', 'Andrés Mora', 'andres.mora@email.com', 89.99, 'completed', '2026-10-10', 'Card'],
  ['TX-1034', 'Mía Johnson', 'mia.johnson@email.com', 2150.0, 'completed', '2026-10-09', 'Bank transfer'],
  ['TX-1033', 'Sebastián Ruiz', 'sebastian.ruiz@email.com', 74.5, 'pending', '2026-10-09', 'Card'],
  ['TX-1032', 'Ava Thompson', 'ava.thompson@email.com', 330.0, 'completed', '2026-10-08', 'PayPal'],
  ['TX-1031', 'Diego Castillo', 'diego.castillo@email.com', 18.0, 'cancelled', '2026-10-08', 'PayPal'],
  ['TX-1030', 'Paula Jiménez', 'paula.jimenez@email.com', 960.0, 'completed', '2026-10-07', 'Card'],
  ['TX-1029', 'Liam Anderson', 'liam.anderson@email.com', 145.0, 'pending', '2026-10-07', 'Bank transfer'],
  ['TX-1028', 'Carla Salazar', 'carla.salazar@email.com', 59.0, 'completed', '2026-10-06', 'Card'],
  ['TX-1027', 'Ethan Clark', 'ethan.clark@email.com', 1420.0, 'completed', '2026-10-06', 'Bank transfer'],
  ['TX-1026', 'Marta Quesada', 'marta.quesada@email.com', 205.0, 'pending', '2026-10-05', 'PayPal'],
  ['TX-1025', 'Oliver Scott', 'oliver.scott@email.com', 88.0, 'completed', '2026-10-05', 'Card'],
]

export const TRANSACTIONS: Transaction[] = ROWS.map(
  ([id, customer, email, amount, status, date, method]) => ({
    id,
    customer,
    email,
    amount,
    status,
    date,
    method,
  }),
)

import { supabase } from "@/lib/supabase"
import OrdersClient from "./OrdersClient"

export const dynamic = 'force-dynamic'

export default async function AdminOrders() {
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      total_amount,
      status,
      created_at,
      customers (
        name,
        phone_number
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
      <OrdersClient initialOrders={orders || []} />
    </div>
  )
}

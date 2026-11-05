"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Order = {
  id: string
  total_amount: number
  status: string
  created_at: string
  customers: { name: string; phone_number: string } | { name: string; phone_number: string }[] | null
}

export default function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleConfirmPayment = async (orderId: string) => {
    if (!confirm("¿Confirmar el pago? Esto descontará el inventario.")) return

    setIsUpdating(true)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: 'completed' })
      })

      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'completed' } : o))
        router.refresh()
      } else {
        alert("Error al confirmar el pago")
      }
    } catch (_error) {
      alert("Error de conexión")
    } finally {
      setIsUpdating(false)
    }
  }

  const getCustomerField = (customerData: { name: string; phone_number: string } | { name: string; phone_number: string }[] | null, field: string) => {
    if (!customerData) return ''
    if (Array.isArray(customerData)) return (customerData[0] as Record<string, string>)?.[field]
    return (customerData as Record<string, string>)[field]
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-3 font-medium text-gray-600">Fecha</th>
              <th className="p-3 font-medium text-gray-600">Cliente</th>
              <th className="p-3 font-medium text-gray-600">Teléfono</th>
              <th className="p-3 font-medium text-gray-600">Total</th>
              <th className="p-3 font-medium text-gray-600">Estado</th>
              <th className="p-3 font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? orders.map((order) => (
              <tr className="border-b" key={order.id}>
                <td className="p-3">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="p-3">{getCustomerField(order.customers, 'name')}</td>
                <td className="p-3">{getCustomerField(order.customers, 'phone_number')}</td>
                <td className="p-3 font-bold">${order.total_amount.toFixed(2)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.status === 'completed' ? 'Pagado' : 'Pendiente'}
                  </span>
                </td>
                <td className="p-3">
                  {order.status === 'pending' && (
                    <button 
                      onClick={() => handleConfirmPayment(order.id)}
                      disabled={isUpdating}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      Confirmar Pago
                    </button>
                  )}
                </td>
              </tr>
            )) : (
              <tr className="border-b">
                <td className="p-3 text-center text-gray-500" colSpan={6}>
                  No hay ventas registradas aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

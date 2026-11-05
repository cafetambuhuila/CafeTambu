import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function ReceiptPage({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the order details from Supabase here
  // const order = await supabase.from('orders').select('*, order_items(*, products(*))').eq('id', params.id).single()
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-600 p-6 text-center text-white">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-200" />
          <h1 className="text-2xl font-bold">¡Compra Exitosa!</h1>
          <p className="opacity-90">Tu pedido ha sido registrado.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Número de Pedido</p>
            <p className="font-mono text-lg font-medium">{params.id}</p>
          </div>
          
          <div className="space-y-2 text-center text-gray-600 text-sm">
            <p>Se ha notificado al administrador sobre tu pedido.</p>
            <p>Pronto nos pondremos en contacto contigo para coordinar el envío.</p>
          </div>
          
          <Link 
            href="/"
            className="block text-center w-full bg-amber-900 text-white py-2 rounded hover:bg-amber-800 transition-colors"
          >
            Volver al Catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}

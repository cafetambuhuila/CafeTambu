"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Phone, CheckCircle, Package } from "lucide-react"
import { useRouter } from "next/navigation"

type Product = {
  id: string
  name: string
  description: string
  price: number
  stock_quantity: number
  image_url: string
}

export default function Checkout() {
  const router = useRouter()
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      // We will try to fetch from Supabase. Since it's a mock, it might fail.
      // If it fails (or returns no data), we'll fallback to initial mock data
      // so the UI still looks functional during this demonstration phase without a real DB key.
      try {
        const { supabase } = await import('@/lib/supabase')
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
        
        if (data && data.length > 0) {
          setProducts(data)
        } else {
          // Fallback data if DB is empty or mock connection
          setProducts([
            {
              id: "1",
              name: "Café Especial - Origen Colombia",
              description: "Tostado medio, notas de chocolate y caramelo.",
              price: 15.50,
              stock_quantity: 50,
              image_url: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=500&q=80"
            },
            {
              id: "2",
              name: "Café Descafeinado Premium",
              description: "Proceso natural, ideal para la noche.",
              price: 16.00,
              stock_quantity: 20,
              image_url: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=500&q=80"
            },
            {
              id: "3",
              name: "Kit Filtros Ecológicos",
              description: "Filtros reutilizables de tela orgánica.",
              price: 8.99,
              stock_quantity: 5,
              image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80"
            }
          ])
        }
      } catch (err) {
        console.error("Error fetching products", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock_quantity) }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return
    const text = cart
      .map((item) => `- ${item.quantity}x ${item.product.name} ($${(item.product.price * item.quantity).toFixed(2)})`)
      .join("%0A")
    const totalText = `%0A*Total: $${total.toFixed(2)}*`
    const message = `¡Hola! Me gustaría hacer el siguiente pedido:%0A%0A${text}${totalText}`
    window.open(`https://wa.me/573000000000?text=${message}`, "_blank")
  }

  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleWebOrder = async () => {
    if (cart.length === 0) return
    if (!customerName || !customerPhone) {
      alert("Por favor, ingresa tu nombre y teléfono para el envío y seguimiento.")
      return
    }
    
    setIsCheckingOut(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cart, 
          customerInfo: { name: customerName, phone: customerPhone } 
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Navigate to receipt (since we can't use next/navigation easily in client component without useRouter, 
        // window.location is fine for this case)
        router.push(`/receipt/${data.orderId}`)
      } else {
        alert("Hubo un error al procesar el pedido.")
      }
    } catch (error) {
      console.error(error)
      alert("Error de conexión.")
    }
  }

  if (loading) return <div className="text-center p-8">Cargando catálogo...</div>

  return (
    <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-3 gap-8">
      {/* Catalog */}
      <div className="md:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Catálogo de Productos</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 flex flex-col shadow-sm bg-white">
              <div 
                className="h-48 bg-gray-200 rounded-md mb-4 bg-cover bg-center"
                style={{ backgroundImage: `url(${product.image_url})` }}
              />
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-gray-600 text-sm flex-grow">{product.description}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="font-bold text-green-700">${product.price.toFixed(2)}</span>
                <span className="text-xs flex items-center text-gray-500">
                  <Package className="w-3 h-3 mr-1" />
                  {product.stock_quantity > 0 ? `${product.stock_quantity} disp.` : "Agotado"}
                </span>
              </div>
              
              <button
                onClick={() => addToCart(product)}
                disabled={product.stock_quantity === 0}
                className="mt-4 w-full bg-amber-800 text-white py-2 rounded-md hover:bg-amber-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Agregar al Carrito
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Shopping Cart Sidebar */}
      <div className="border rounded-lg p-4 shadow-sm bg-gray-50 h-fit sticky top-4">
        <h2 className="text-xl font-bold flex items-center mb-4">
          <ShoppingCart className="mr-2" /> Mi Pedido
        </h2>
        
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Tu carrito está vacío</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center bg-white p-2 rounded border">
                <div>
                  <p className="font-medium text-sm">{item.product.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} x ${item.product.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-500 text-xs hover:underline"
                >
                  Quitar
                </button>
              </div>
            ))}
            
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="space-y-3 mb-4 p-3 bg-gray-100 rounded-md">
                <p className="text-sm font-bold text-gray-700">Tus datos para el envío:</p>
                <input 
                  type="text" 
                  placeholder="Tu Nombre" 
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full text-sm p-2 border rounded"
                />
                <input 
                  type="tel" 
                  placeholder="Tu Teléfono (WhatsApp)" 
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full text-sm p-2 border rounded"
                />
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 flex items-center justify-center transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Pedir por WhatsApp
                </button>
                
                <button
                  onClick={handleWebOrder}
                  disabled={isCheckingOut}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isCheckingOut ? "Procesando..." : "Comprar en Web"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

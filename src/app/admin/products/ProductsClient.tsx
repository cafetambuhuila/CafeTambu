"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Product = {
  id: string
  name: string
  price: number
  stock_quantity: number
  image_url?: string
}

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const router = useRouter()

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const startEdit = (product: Product) => {
    setEditingId(product.id)
    setName(product.name)
    setPrice(product.price.toString())
    setStock(product.stock_quantity.toString())
    setImageUrl(product.image_url || "")
    setShowAddForm(true)
  }

  const resetForm = () => {
    setEditingId(null)
    setName("")
    setPrice("")
    setStock("")
    setImageUrl("")
    setShowAddForm(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !price || !stock) return

    const productData = {
      name,
      price: parseFloat(price),
      stock_quantity: parseInt(stock, 10),
      image_url: imageUrl || "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=500&q=80",
      description: "Nuevo producto"
    }

    try {
      if (editingId) {
        const res = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...productData })
        })
        if (res.ok) {
          resetForm()
          router.refresh()
        } else alert("Error al actualizar")
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        })
        if (res.ok) {
          resetForm()
          router.refresh()
        } else alert("Error al guardar")
      }
    } catch (error) {
      alert("Error de conexión")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id))
        router.refresh()
      } else {
        alert("Error al eliminar")
      }
    } catch (error) {
      alert("Error de conexión")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Productos e Inventario</h1>
        <button 
          onClick={() => showAddForm ? resetForm() : setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showAddForm ? "Cancelar" : "+ Nuevo Producto"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded shadow border mb-6 space-y-4">
          <h2 className="font-bold text-lg">{editingId ? "Editar Producto" : "Añadir Nuevo Producto"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Nombre</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Precio ($)</label>
              <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full border p-2 rounded" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Stock Actual</label>
              <input type="number" value={stock} onChange={e => setStock(e.target.value)} className="w-full border p-2 rounded" required />
            </div>
            <div>
              <label className="block text-sm mb-1">URL de Imagen (Opcional)</label>
              <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full border p-2 rounded" />
            </div>
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            {editingId ? "Actualizar Producto" : "Guardar Producto"}
          </button>
        </form>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-3 font-medium text-gray-600">ID</th>
                <th className="p-3 font-medium text-gray-600">Nombre</th>
                <th className="p-3 font-medium text-gray-600">Precio</th>
                <th className="p-3 font-medium text-gray-600">Stock Actual</th>
                <th className="p-3 font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products && products.length > 0 ? products.map((product) => (
                <tr className="border-b" key={product.id}>
                  <td className="p-3 text-sm text-gray-500 truncate max-w-[100px]">{product.id}</td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">${product.price.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`${product.stock_quantity > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-2 py-1 rounded text-sm font-medium`}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => startEdit(product)} className="text-blue-600 hover:underline text-sm">Editar</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline text-sm">Eliminar</button>
                  </td>
                </tr>
              )) : (
                <tr className="border-b">
                  <td className="p-3 text-center text-gray-500" colSpan={5}>
                    No hay productos o no hay conexión a la base de datos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

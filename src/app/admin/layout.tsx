export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="/admin" className="block px-4 py-2 rounded hover:bg-gray-800">Dashboard</a>
          <a href="/admin/orders" className="block px-4 py-2 rounded hover:bg-gray-800">Gestión de Pedidos</a>
          <a href="/admin/products" className="block px-4 py-2 rounded hover:bg-gray-800">Productos e Inventario</a>
          <a href="/admin/settings" className="block px-4 py-2 rounded hover:bg-gray-800">Configuración</a>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

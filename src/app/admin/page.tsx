import { AlertTriangle, Package, TrendingUp } from "lucide-react"
import { getInventoryProjection, InventoryProjection } from "@/lib/inventory"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  let projections: InventoryProjection[] = []
  try {
    projections = await getInventoryProjection(7)
  } catch (error) {
    console.error("Failed to load projections", error)
  }

  const totalActiveProducts = projections.length > 0 ? projections.length : 12;
  const criticalAlertsCount = projections.filter(p => p.status === 'Critical').length

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard General</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <TrendingUp className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Ventas del Mes</p>
            <p className="text-2xl font-bold">$1,245.50</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <Package className="text-green-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Productos Activos</p>
            <p className="text-2xl font-bold">{totalActiveProducts}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="bg-red-100 p-3 rounded-full mr-4">
            <AlertTriangle className="text-red-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Alertas de Inventario</p>
            <p className="text-2xl font-bold text-red-600">{criticalAlertsCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold mb-4">Proyección de Inventario Crítico</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-3 font-medium text-gray-600">Producto</th>
                <th className="p-3 font-medium text-gray-600">Stock Actual</th>
                <th className="p-3 font-medium text-gray-600">Ventas (30 días)</th>
                <th className="p-3 font-medium text-gray-600">Días Estimados Restantes</th>
                <th className="p-3 font-medium text-gray-600">Estado</th>
              </tr>
            </thead>
            <tbody>
              {projections.length > 0 ? projections.map(p => (
                <tr className="border-b" key={p.product_id}>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.stock_quantity}</td>
                  <td className="p-3">{p.total_sold_30_days}</td>
                  <td className={`p-3 font-bold ${p.status === 'Critical' ? 'text-red-600' : p.status === 'Warning' ? 'text-yellow-600' : 'text-green-600'}`}>
                    {p.estimated_days_remaining === 9999 ? 'Suficiente' : `${p.estimated_days_remaining} días`}
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      p.status === 'Critical' ? 'bg-red-100 text-red-800' : 
                      p.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr className="border-b">
                  <td className="p-3 text-center text-gray-500" colSpan={5}>
                    No hay datos de proyección disponibles o no hay conexión a la base de datos.
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

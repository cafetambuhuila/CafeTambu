"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Settings = {
  company_name: string
  logo_url: string
  low_stock_days_warning: number
  follow_up_days_interval: number
}

export default function SettingsClient({ initialSettings }: { initialSettings: Settings }) {
  const [settings, setSettings] = useState(initialSettings)
  const router = useRouter()

  const handleSave = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        alert("Configuración guardada exitosamente")
        router.refresh()
      } else {
        alert("Error al guardar la configuración")
      }
    } catch (error) {
      alert("Error de conexión")
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-6">
      
      <div>
        <h2 className="text-xl font-bold mb-4">Marca y Apariencia</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa</label>
            <input 
              type="text" 
              value={settings.company_name}
              onChange={e => setSettings({ ...settings, company_name: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL del Logo</label>
            <input 
              type="text" 
              value={settings.logo_url}
              onChange={e => setSettings({ ...settings, logo_url: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="https://ejemplo.com/logo.png"
            />
            {settings.logo_url && (
              <img src={settings.logo_url} alt="Logo Preview" className="mt-2 h-12 object-contain" />
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h2 className="text-xl font-bold mb-4">Alertas de Inventario</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Días de aviso previo para inventario bajo</label>
            <input 
              type="number" 
              value={settings.low_stock_days_warning}
              onChange={e => setSettings({ ...settings, low_stock_days_warning: parseInt(e.target.value, 10) || 1 })}
              className="w-full border border-gray-300 rounded-md p-2"
              min="1"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h2 className="text-xl font-bold mb-4">Seguimiento a Clientes</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia de mensajes de seguimiento (Días)</label>
            <input 
              type="number" 
              value={settings.follow_up_days_interval}
              onChange={e => setSettings({ ...settings, follow_up_days_interval: parseInt(e.target.value, 10) || 1 })}
              className="w-full border border-gray-300 rounded-md p-2"
              min="1"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t flex justify-end">
        <button 
          onClick={handleSave}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Guardar Configuración
        </button>
      </div>
    </div>
  )
}

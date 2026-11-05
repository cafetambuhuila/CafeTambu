import { supabase } from "@/lib/supabase"
import SettingsClient from "./SettingsClient"

export const dynamic = 'force-dynamic'

export default async function AdminSettings() {
  const { data: settings } = await supabase.from('settings').select('*').single()
  
  const defaultSettings = {
    company_name: settings?.company_name || 'Café Artesanal La Sierra',
    logo_url: settings?.logo_url || '',
    low_stock_days_warning: settings?.low_stock_days_warning || 7,
    follow_up_days_interval: settings?.follow_up_days_interval || 15
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold">Configuración de la Plataforma</h1>
      <SettingsClient initialSettings={defaultSettings} />
    </div>
  )
}

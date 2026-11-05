import { supabase } from './supabase'

export type InventoryProjection = {
  product_id: string
  name: string
  stock_quantity: number
  total_sold_30_days: number
  estimated_days_remaining: number
  status: 'Critical' | 'Warning' | 'OK'
}

export async function getInventoryProjection(warningThresholdDays: number = 7): Promise<InventoryProjection[]> {
  try {
    const { data, error } = await supabase
      .from('inventory_projection')
      .select('*')
      .order('estimated_days_remaining', { ascending: true })

    if (error) {
      console.error('Error fetching inventory projection:', error)
      return []
    }

    if (!data) return []

    return data.map((item: Record<string, unknown>) => {
      let status: 'Critical' | 'Warning' | 'OK' = 'OK'
      const estimatedDays = Number(item.estimated_days_remaining)
      
      if (estimatedDays <= warningThresholdDays) {
        status = 'Critical'
      } else if (estimatedDays <= warningThresholdDays * 2) {
        status = 'Warning'
      }

      return {
        product_id: String(item.id),
        name: String(item.name),
        stock_quantity: Number(item.stock_quantity),
        total_sold_30_days: Number(item.total_sold_30_days),
        estimated_days_remaining: estimatedDays,
        status
      }
    })
  } catch (error) {
    console.error('Failed to get inventory projection:', error)
    return []
  }
}

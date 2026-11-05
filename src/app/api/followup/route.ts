import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // 1. Get follow-up interval from settings
    const { data: settings } = await supabase.from('settings').select('follow_up_days_interval').single()
    const intervalDays = settings?.follow_up_days_interval || 15

    // 2. Find completed orders that are exactly 'intervalDays' old (for simplicity, we'll look for orders older than intervalDays)
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() - intervalDays)
    
    // In a production app, you might want to track if a follow-up was already sent.
    // For now, we will fetch customers whose last order was before the target date.
    
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, created_at, customers(name, phone_number)')
      .eq('status', 'completed')
      .lte('created_at', targetDate.toISOString())
      .order('created_at', { ascending: false })
      
    if (error) throw error

    // Deduplicate by customer
    const customersToContact = new Map()
    for (const order of orders || []) {
      const customer = Array.isArray(order.customers) ? order.customers[0] : order.customers
      if (customer && !customersToContact.has(customer.phone_number)) {
        customersToContact.set(customer.phone_number, customer)
      }
    }

    const messages = Array.from(customersToContact.values()).map(c => {
      const message = `¡Hola ${c.name}! Hace unos días compraste nuestro café. ¿Qué te ha parecido? ¿Te gustaría hacer un nuevo pedido?`
      const url = `https://wa.me/${c.phone_number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
      return {
        customer: c.name,
        whatsapp_link: url
      }
    })

    return NextResponse.json({ success: true, pendingFollowUps: messages })
  } catch (error) {
    console.error('Error generating follow-ups:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}

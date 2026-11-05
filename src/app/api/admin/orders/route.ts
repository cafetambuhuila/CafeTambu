import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json()
    
    if (!id || status !== 'completed') {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
    }

    // 1. Check current status to prevent double deduction
    const { data: order } = await supabase.from('orders').select('status').eq('id', id).single()
    if (order?.status === 'completed') {
      return NextResponse.json({ success: true }) // Already completed
    }

    // 2. Update order status
    const { error: updateError } = await supabase.from('orders').update({ status: 'completed' }).eq('id', id)
    if (updateError) throw updateError

    // 3. Deduct inventory based on order items
    const { data: orderItems } = await supabase.from('order_items').select('product_id, quantity').eq('order_id', id)
    
    if (orderItems) {
      for (const item of orderItems) {
        const { data: productData } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', item.product_id)
          .single()
        
        if (productData) {
          await supabase
            .from('products')
            .update({ stock_quantity: productData.stock_quantity - item.quantity })
            .eq('id', item.product_id)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 })
  }
}

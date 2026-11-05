import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { cart, customerInfo } = await request.json()

    // 1. Create Customer or Get Existing
    const { data: customerData } = await supabase
      .from('customers')
      .insert({
        name: customerInfo?.name || 'Cliente Web',
        phone_number: customerInfo?.phone || 'Desconocido',
      })
      .select('id')
      .single()

    const customerId = customerData?.id || 'mock-customer-id'

    // 2. Calculate Total
    const totalAmount = cart.reduce((sum: number, item: {product: {price: number}, quantity: number}) => sum + item.product.price * item.quantity, 0)

    // 3. Create Order - Status pending, waiting for payment confirmation
    const { data: orderData } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        total_amount: totalAmount,
        status: 'pending' 
      })
      .select('id')
      .single()

    const orderId = orderData?.id || 'mock-order-id'

    // 4. Create Order Items (DO NOT DEDUCT INVENTORY YET)
    for (const item of cart) {
      await supabase
        .from('order_items')
        .insert({
          order_id: orderId,
          product_id: item.product.id,
          quantity: item.quantity,
          price_at_time: item.product.price
        })
    }

    return NextResponse.json({ success: true, orderId })
  } catch (error) {
    console.error('Error processing checkout:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}

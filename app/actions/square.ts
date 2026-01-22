'use server';

import { squareClient, PREMIUM_PRICE_CENTS } from '@/lib/square';
import { createClient } from '@/lib/supabase/server';
import { randomUUID } from 'crypto';

export async function createPayment(sourceId: string, userId: string) {
  try {
    const { result } = await squareClient.paymentsApi.createPayment({
      sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: BigInt(PREMIUM_PRICE_CENTS),
        currency: 'USD',
      },
    });

    if (result.payment?.status === 'COMPLETED') {
      // Update user subscription in Supabase
      const supabase = await createClient();
      
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          status: 'active',
          plan: 'premium',
          amount: PREMIUM_PRICE_CENTS / 100,
          payment_provider: 'square',
          payment_id: result.payment.id,
          started_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('[v0] Error updating subscription:', error);
        throw new Error('Failed to update subscription');
      }

      return { success: true, paymentId: result.payment.id };
    }

    return { success: false, error: 'Payment not completed' };
  } catch (error) {
    console.error('[v0] Payment error:', error);
    return { success: false, error: 'Payment failed' };
  }
}

export async function cancelSubscription(userId: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('subscriptions')
      .update({ 
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) {
      console.error('[v0] Error cancelling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }

    return { success: true };
  } catch (error) {
    console.error('[v0] Cancellation error:', error);
    return { success: false, error: 'Cancellation failed' };
  }
}

export async function getSubscriptionStatus(userId: string) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[v0] Error fetching subscription:', error);
      throw error;
    }

    return { subscription: data };
  } catch (error) {
    console.error('[v0] Error getting subscription status:', error);
    return { subscription: null };
  }
}

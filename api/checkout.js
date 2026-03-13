// ═══════════════════════════════════════════════════════════
// STRIPE CHECKOUT — Serverless Function (Vercel)
//
// This runs on Vercel's servers, NOT in the browser.
// Your secret key is safe here — it's never exposed to users.
//
// HOW IT WORKS:
// 1. User fills out the wish form and clicks "Cast Your Wish"
// 2. Your site sends a POST request to /api/checkout
// 3. This function creates a Stripe Checkout session
// 4. It returns the Stripe checkout URL
// 5. The user is redirected to Stripe's hosted payment page
// 6. After payment, Stripe redirects back to your success page
// ═══════════════════════════════════════════════════════════

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, wish, name, tier, oracle } = req.body;

    // Validate amount
    const cents = Math.round(Number(amount) * 100);
    if (!cents || cents < 100 || cents > 100000000) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Build the description
    let description = `Cosmic Wishing Well — ${tier || 'Whisper'} Wish`;
    if (oracle) {
      description += ' + Cosmic Oracle';
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Cosmic Wishing Well',
              description: description,
              // You can add an image URL here later:
              // images: ['https://cosmicwishingwell.com/og-image.jpg'],
            },
            unit_amount: cents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.DOMAIN || 'https://cosmicwishingwell.com'}/?success=true&wish=${encodeURIComponent(wish || '')}&name=${encodeURIComponent(name || 'Anonymous')}`,
      cancel_url: `${process.env.DOMAIN || 'https://cosmicwishingwell.com'}/?canceled=true`,
      metadata: {
        wish: (wish || '').substring(0, 500),
        name: (name || 'Anonymous').substring(0, 100),
        tier: tier || 'whisper',
        oracle: oracle ? 'yes' : 'no',
      },
    });

    // Return the checkout URL
    res.status(200).json({ url: session.url });

  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: 'Payment setup failed. Please try again.' });
  }
};

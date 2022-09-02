const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { v4: uuidv4 } = require('uuid')


exports.payment = (req, res) => {
    try {
        const session = stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [{
                price: process.env.STRIPE_PRODUCT_ID,
                quantity: 1
            }],
            success_url: "http://localhost:8081/premium/success",
            cancel_url: "http://localhost:8081/premium"
        })
            .then(result => {
                // console.log(result);
                res.json({url: result.url})
        })
    } catch (e) {
        res.status(500).json({error: e.message})
    }
}


exports.createCustomer = (req, res) => {
    const id = req.params.id
    User.findById(id)
        .then(user => {
            if (!user) {
            res.send(404).send({ message: "Not found user with id" + id})
            } else {
                const product = req.body
                const indempontencyKey = uuidv4()
                return stripe.customers.create({
                    name: user.username,
                    email: user.email,
                    source: user._id
                }).then(customer => {
                    stripe.charges.create({
                        amount: product.price * 100,
                        currency: 'usd',
                        customer: customer.id,
                        receipt_email: user.email,
                        description: `Purchase of Premium `
                    }, {indempontencyKey})
                })
                    .then(response => {
                    res.send(response)
                    })
                .catch(err => console.log(err))
        }
    })
}
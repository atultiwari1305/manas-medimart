const orderModel = require('../Models/Order');
const cartModel = require('../Models/Cart');
const userModel = require('../Models/patient.js');
const medModel = require('../Models/Medicine.js');
const Pharmacist = require('../Models/Pharmacist'); 
const sendEmail = require("../Utilities/SendEmail");
const paymentIntentModel = require('../Models/PaymentIntent');
const stripe = require('stripe')(process.env.SECRETKEY);

// --------------------- Orders ---------------------
module.exports.get_orders = async (req, res) => {
    const userId = req.user._id;
    const orders = await orderModel.find({ userId }).sort({ date_added: -1 });
    res.json(orders);
}

module.exports.get_recent_order = async (req, res) => {
    const userId = req.user._id;
    try {
        const order = await orderModel.findOne({ userId }).sort({ date_added: -1 });
        res.send(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports.config = (req, res) => {
    console.log('here')
    res.send({
        publishableKey: process.env.PUBLISHABLE_KEY,
    });
}

// --------------------- Checkout ---------------------
module.exports.checkoutCredit = async (req, res) => {
    try {
        const userId = req.user._id;
        let cart = await cartModel.findOne({ userId });
        if (!cart) return res.status(400).send("You do not have items in cart");

        const paymentIntent = await stripe.paymentIntents.create({
            amount: cart.bill * 100 * (1 - cart.discount),
            currency: "usd",
            automatic_payment_methods: { enabled: true },
        });

        const intent = await paymentIntentModel.create({ intentId: paymentIntent.id });

        res.send({ clientSecret: paymentIntent.client_secret, paymentIntentId: intent._id });
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

module.exports.creditConfirm = async (req, res) => {
    try {
        const userId = req.user._id;
        let cart = await cartModel.findOne({ userId });
        if (!cart) return res.status(400).send("No items in cart");

        let user = await userModel.findById(userId);
        let address = req.body.address;
        let intentId = req.body.intentId;

        const paymentIntent = await paymentIntentModel.findByIdAndDelete(intentId);
        const pharms = await Pharmacist.find({});

        for (const item of cart.items) {
            const product = await medModel.findById(item.productId);

            if (!item.Onboard) {
                for (let p of user.Prescriptions) {
                    for (let m of p.Medicine) {
                        if (!m.Onboard && m.Quantity === item.quantity) p.Status = "Filled";
                    }
                }
            }
            await user.save();

            if (product) {
                product.Sales += item.quantity;
                if (product.Quantity === 0) {
                    for (const pharm of pharms) {
                        const notification = `${product.Name} is out of stock`;
                        pharm.Notifications.push(notification);
                        await sendEmail(pharm.Email, "Medicine Stock", `Dear ${pharm.Name},\nMedicine ${product.Name} is out of stock.`);
                        await pharm.save();
                    }
                }
                await product.save();
            }
        }

        const order = await orderModel.create({
            userId,
            items: cart.items,
            bill: cart.bill * (1 - cart.discount),
            status: 'Processing',
            address,
            payment_method: 'credit',
            paymentIntentId: paymentIntent.intentId,
        });

        await cartModel.findByIdAndDelete(cart._id);
        res.status(201).send(order);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

// Checkout Cash
module.exports.checkoutCash = async (req, res) => {
    try {
        const userId = req.user._id;
        let cart = await cartModel.findOne({ userId });
        if (!cart) return res.status(400).send("No items in cart");

        let user = await userModel.findById(userId);
        let address = req.body.address;
        const pharms = await Pharmacist.find({});

        for (const item of cart.items) {
            const product = await medModel.findById(item.productId);

            if (!item.Onboard) {
                for (let p of user.Prescriptions) {
                    for (let m of p.Medicine) {
                        if (!m.Onboard && m.Quantity === item.quantity) p.Status = "Filled";
                    }
                }
            }
            await user.save();

            if (product) {
                product.Sales += item.quantity;
                if (product.Quantity === 0) {
                    for (const pharm of pharms) {
                        const notification = `${product.Name} is out of stock`;
                        pharm.Notifications.push(notification);
                        await sendEmail(pharm.Email, "Medicine Stock", `Dear ${pharm.Name},\nMedicine ${product.Name} is out of stock.`);
                        await pharm.save();
                    }
                }
                await product.save();
            }
        }

        const order = await orderModel.create({
            userId,
            items: cart.items,
            bill: cart.bill * (1 - cart.discount),
            status: 'Processing',
            address,
            payment_method: 'cash'
        });

        await cartModel.findByIdAndDelete(cart._id);
        res.status(201).send(order);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

// Checkout Wallet
module.exports.checkoutWallet = async (req, res) => {
    try {
        const userId = req.user._id;
        let cart = await cartModel.findOne({ userId });
        if (!cart) return res.status(400).send("No items in cart");

        let user = await userModel.findById(userId);
        let address = req.body.address;
        const wallet = user.WalletBalance;

        if (wallet < cart.bill * (1 - cart.discount)) return res.status(400).send("Insufficient wallet balance");

        user.WalletBalance -= cart.bill * (1 - cart.discount);
        await user.save();

        const pharms = await Pharmacist.find({});

        for (const item of cart.items) {
            const product = await medModel.findById(item.productId);

            if (!item.Onboard) {
                for (let p of user.Prescriptions) {
                    for (let m of p.Medicine) {
                        if (!m.Onboard && m.Quantity === item.quantity) p.Status = "Filled";
                    }
                }
            }
            await user.save();

            if (product) {
                product.Sales += item.quantity;
                if (product.Quantity === 0) {
                    for (const pharm of pharms) {
                        const notification = `${product.Name} is out of stock`;
                        pharm.Notifications.push(notification);
                        await sendEmail(pharm.Email, "Medicine Stock", `Dear ${pharm.Name},\nMedicine ${product.Name} is out of stock.`);
                        await pharm.save();
                    }
                }
                await product.save();
            }
        }

        const order = await orderModel.create({
            userId,
            items: cart.items,
            bill: cart.bill * (1 - cart.discount),
            status: 'Processing',
            address,
            payment_method: 'wallet'
        });

        await cartModel.findByIdAndDelete(cart._id);
        res.status(201).send(order);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

// --------------------- Cancel Order ---------------------
module.exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.body.orderId;
        const userId = req.user._id;
        const order = await orderModel.findById(orderId);
        const user = await userModel.findById(userId);

        if (!order) return res.status(404).send("Order not found");

        if (order.payment_method === 'credit') {
            const paymentIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
            await stripe.refunds.create({ payment_intent: paymentIntent.id });
        } else if (order.payment_method === 'wallet') {
            user.WalletBalance += order.bill;
            await user.save();
        }

        const pharms = await Pharmacist.find({});

        for (const item of order.items) {
            const product = await medModel.findById(item.productId);

            if (!item.Onboard) {
                for (let p of user.Prescriptions) {
                    for (let m of p.Medicine) {
                        if (!m.Onboard && m.Quantity === item.quantity) p.Status = "Filled";
                    }
                }
            }
            await user.save();

            if (product) {
                product.Sales -= item.quantity;
                product.Quantity += item.quantity;
                await product.save();
            }
        }

        order.status = 'Cancelled';
        await order.save();
        res.status(200).send("Order cancelled successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

// --------------------- Helper for month dates ---------------------
function getMonthDateRange(monthName, year = new Date().getFullYear()) {
    const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];
    const monthIndex = monthNames.indexOf(monthName);
    if (monthIndex === -1) return null;

    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 1);
    return { startDate, endDate };
}

// --------------------- Stats & Reports ---------------------
module.exports.generateMedicineSalesReport = async (req, res) => {
    try {
        const { med, month } = req.body;
        const { startDate, endDate } = getMonthDateRange(month);
        if (!startDate) return res.status(400).send("Invalid month");

        const pipeline = [
            { $match: { date_added: { $gte: startDate, $lt: endDate }, status: { $in: ['Processing', 'Delivered'] } } },
            { $unwind: "$items" },
            { $match: { "items.name": med } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date_added" } }, sales: { $sum: "$items.quantity" } } },
            { $sort: { _id: 1 } }
        ];

        const result = await orderModel.aggregate(pipeline);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
}

module.exports.TotalStats = async (req, res) => {
    try {
        const { month } = req.body;
        const { startDate, endDate } = getMonthDateRange(month);
        if (!startDate) return res.status(400).send("Invalid month");

        const pipeline = [
            { $match: { date_added: { $gte: startDate, $lt: endDate }, status: { $in: ['Processing', 'Delivered'] } } },
            { $group: { _id: null, totalOrders: { $sum: 1 }, totalItems: { $sum: { $size: "$items" } }, totalRevenue: { $sum: "$bill" } } }
        ];

        const stats = await orderModel.aggregate(pipeline);
        res.send(stats.length ? stats : [{ totalOrders: 0, totalItems: 0, totalRevenue: 0 }]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
}

module.exports.DailyRevenue = async (req, res) => {
    try {
        const { month } = req.body;
        const { startDate, endDate } = getMonthDateRange(month);
        if (!startDate) return res.status(400).send("Invalid month");

        const pipeline = [
            { $match: { date_added: { $gte: startDate, $lt: endDate }, status: { $in: ['Processing', 'Delivered'] } } },
            { $group: { _id: { $dayOfMonth: "$date_added" }, revenue: { $sum: "$bill" } } },
            { $project: { _id: 0, day: "$_id", revenue: 1 } },
            { $sort: { day: 1 } }
        ];

        const revenue = await orderModel.aggregate(pipeline);
        res.send(revenue);
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
}

module.exports.getAllorders = async (req, res) => {
    try {
        const { month } = req.body;
        let filter = {};
        if (month) {
            const { startDate, endDate } = getMonthDateRange(month);
            if (!startDate) return res.status(400).send("Invalid month");
            filter.date_added = { $gte: startDate, $lt: endDate };
        }
        const orders = await orderModel.find(filter, { "items.image": 0 }).sort({ date_added: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
}

module.exports.ExtraStats = async (req, res) => {
    try {
        const { month } = req.body;
        const { startDate, endDate } = getMonthDateRange(month);
        if (!startDate) return res.status(400).send("Invalid month");

        const stats = {};
        stats.cashOrders = await orderModel.countDocuments({ date_added: { $gte: startDate, $lt: endDate }, payment_method: 'cash', status: { $ne: 'Cancelled' } });
        stats.creditOrders = await orderModel.countDocuments({ date_added: { $gte: startDate, $lt: endDate }, payment_method: 'credit', status: { $ne: 'Cancelled' } });
        stats.walletOrders = await orderModel.countDocuments({ date_added: { $gte: startDate, $lt: endDate }, payment_method: 'wallet', status: { $ne: 'Cancelled' } });
        stats.cancelledOrders = await orderModel.countDocuments({ date_added: { $gte: startDate, $lt: endDate }, status: 'Cancelled' });

        res.send(stats);
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
}

module.exports.MonthlyChanges = async (req, res) => {
    try {
        const monthNames = [
            "January","February","March","April","May","June",
            "July","August","September","October","November","December"
        ];

        const currentMonth = req.body.month;
        const currentMonthNum = monthNames.indexOf(currentMonth) + 1;
        if (currentMonthNum === 0) return res.status(400).send("Invalid month");

        // Current Month Stats
        const currentMonthStats = await module.exports.TotalStats({ body: { month: currentMonth } }, { send: data => data });

        // Previous Month
        const prevMonthName = currentMonthNum === 1 ? "December" : monthNames[currentMonthNum - 2];
        const prevMonthStats = await module.exports.TotalStats({ body: { month: prevMonthName } }, { send: data => data });

        const increases = {
            ordersIncrease: currentMonthStats[0].totalOrders - (prevMonthStats[0]?.totalOrders || 0),
            itemsIncrease: currentMonthStats[0].totalItems - (prevMonthStats[0]?.totalItems || 0),
            revenueIncrease: currentMonthStats[0].totalRevenue - (prevMonthStats[0]?.totalRevenue || 0)
        };

        res.json({
            currentMonth: currentMonthStats[0],
            previousMonth: prevMonthStats[0],
            increases
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
}

const express = require('express');
const fs = require('fs');
const cors = require('cors');
let app = express();


// activate json encode
app.use(express.json());

// Activate cors
app.use(cors());



app.get('/order', (req, res) => {
    let { id } = req.query;

    fs.readFile('orders.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'No se pudo obtener la orden'
            })
        } else {
            let orders = JSON.parse(data);
            let order = orders.find(order => order.id == id);

            if (!order) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se encontro la orden'
                })
            } else {
                return res.status(200).json(order)
            }
        }
    });
})

app.get('/orders', (req, res) => {
    fs.readFile('orders.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'No se pudo obtener la orden'
            })
        } else {
            let orders = JSON.parse(data);

            return res.status(200).json(orders)

        }
    });
})

app.post("/create/order", (req, res) => {
    console.log(req.body);
    let orders = [];
    fs.readFile('orders.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Order not created created'
            })
        } else {
            orders = JSON.parse(data); //now it an object
            let existOrder = orders.find(order => order.id == req.body.id);
            console.log("Exist order", existOrder);
            if (existOrder) {
                orders = orders.filter(order => order.id != req.body.id);
            }
            orders.push(req.body);
            let json = JSON.stringify(orders);//add some data
            fs.writeFile('orders.json', json, 'utf8', () => {
                res.json({
                    ok: true,
                    message: 'Order created',
                    order: req.body
                })
            }); // write it back 
        }
    });
})


app.listen(process.env.PORT || 3000, () => {
    console.log("App en vivo");
})

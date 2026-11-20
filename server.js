
const express = require('express');
const app = express();

app.use(express.json());

// In-memory array
let products = [];
let id = 1;

// POST - Add Product
app.post('/api/products', (req, res) => {
    const { name, price, category } = req.body;

    if (!name || price === undefined || !category) {
        return res.status(400).json({
            message: "Missing data"
        });
    }

    if (typeof name !== 'string' ||
        typeof category !== 'string' ||
        typeof price !== 'number' ||
        !Number.isFinite(price)) {
        return res.status(400).json({
            message: "Invalid data"
        });
    }

    const exists = products.find(
        p => p.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (exists) {
        return res.status(409).json({
            message: "Product already exists"
        });
    }

    const newProduct = {
        id: id++,
        name: name.trim(),
        price,
        category: category.trim()
    };

    products.push(newProduct);

    res.status(201).json(newProduct);
});

// GET - All Products
app.get('/api/products', (req, res) => {
    const category = req.query.category;

    if (category) {
        const filtered = products.filter(
            p => p.category.toLowerCase() === category.toLowerCase()
        );
        return res.status(200).json(filtered);
    }

    res.status(200).json(products);
});

// GET - Product by ID
app.get('/api/products/:id', (req, res) => {
    const product = products.find(
        p => p.id === Number(req.params.id)
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.status(200).json(product);
});

// PUT - Update Product
app.put('/api/products/:id', (req, res) => {
    const product = products.find(
        p => p.id === Number(req.params.id)
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const { name, price, category } = req.body;

    if (!name || price === undefined || !category) {
        return res.status(400).json({
            message: "Missing data"
        });
    }

    if (typeof name !== 'string' ||
        typeof category !== 'string' ||
        typeof price !== 'number' ||
        !Number.isFinite(price)) {
        return res.status(400).json({
            message: "Invalid data"
        });
    }

    const exists = products.find(
        p => p.id !== product.id &&
        p.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (exists) {
        return res.status(409).json({
            message: "Product already exists"
        });
    }

    product.name = name.trim();
    product.price = price;
    product.category = category.trim();

    res.status(200).json({
        message: "Product updated",
        product
    });
});

// DELETE - Delete Product
app.delete('/api/products/:id', (req, res) => {
    const index = products.findIndex(
        p => p.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    products.splice(index, 1);

    res.status(200).json({
        message: "Product deleted successfully"
    });
});

// Server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

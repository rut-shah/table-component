const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const USER_DATA = __dirname + '/../user-config.json';
const INVENTORY_DATA = __dirname + '/../inventory-data.json';

const allowedExt = [
  '.js',
  '.ico',
  '.css',
  '.png',
  '.jpg',
  '.woff2',
  '.woff',
  '.ttf',
  '.svg',
];

router.post('/api/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const userData = require(USER_DATA);

  if(userData.username === username && userData.password === password) {
    res.status(201).json({
      message: 'Authentication is successful',
      isUserValid: true
    });
  } else {
    res.status(201).json({
      message: 'Authentication is not successful',
      isUserValid: false
    });
  }
});

router.use(express.static(path.join(__dirname + '../../../dist/')));

router.get('/', (req,res) => {
  res.sendFile('index.html', { root: path.join(__dirname + '../../../dist') });
});

router.get('/api/inventoryData', (req, res) => {
  const data = require(INVENTORY_DATA);
  res.status(201).json({
    message: 'Inventory Data',
    inventory: Object.values(data)
  });
});

router.post('/api/updateStatus', (req, res) => {
  const productId = req.body.productId;
  const active = req.body.active;
  const data = require(INVENTORY_DATA);

  data[productId].active = active;

  fs.writeFile(INVENTORY_DATA, JSON.stringify(data), (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: 'Error in writing data'
      });
    } else {
      res.status(201).json({
        message: 'Data updated successfully!'
      });
    }
  });
});

router.post('/api/modifyInventory', (req, res) => {
  const newProductData = req.body.data;
  const data = require(INVENTORY_DATA);

  data[newProductData.id] = newProductData;

  fs.writeFile(INVENTORY_DATA, JSON.stringify(data), (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: 'Error in writing data'
      });
    } else {
      res.status(201).json({
        message: `Data ${req.body.status} successfully!`,
        inventory: Object.values(data)
      });
    }
  });
});

router.post('/api/deleteInventory', (req, res) => {
  const productId = req.body.productId;
  let data = require(INVENTORY_DATA);

  delete data[productId];

  fs.writeFile(INVENTORY_DATA, JSON.stringify(data), (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: 'Error in writing data'
      });
    } else {
      data = require(INVENTORY_DATA);
      res.status(201).json({
        message: 'Data deleted successfully!',
        inventory: Object.values(data)
      });
    }
  });
});

module.exports = router;
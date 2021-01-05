const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const USER_DATA = __dirname + '/../user-config.json';
const INVENTORY_DATA = __dirname + '/../inventory-data.json';

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

router.get('/', (req,res) => {
  res.sendFile(path.join(__dirname + '../../../dist/index.html'));
});

router.get('/api/inventoryData', (req, res) => {
  const data = require(INVENTORY_DATA);
  res.status(201).json({
    message: 'Inventory Data',
    inventory: Object.values(data)
  });
});

router.post('/api/updateStatus', (req, res) => {
  const index = parseInt(req.body.index);
  const newData = req.body.data;
  const data = require(INVENTORY_DATA);

  data[`product${index}`] = newData;

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

module.exports = router;
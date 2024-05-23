const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON body
app.use(bodyParser.json());

// Configuration for SQL Server connection
const config = {
  user: 'root',
  password: '',
  server: 'localhost',
  database: 'smartconnect',
  options: {
    encrypt: true // If you're using Azure SQL Database
  }
};

app.post('/addcustomer', async (req, res) => {
  try {
    const { firstName, lastName, email, mobileNumber, address, pincode } = req.body;
    await sql.connect(config);
    const result = await sql.query(`EXEC InsertCustomer @FirstName='${firstName}', @LastName='${lastName}', @Email='${email}', @MobileNumber='${mobileNumber}', @Address='${address}', @Pincode='${pincode}'`);
    await sql.close();

    res.status(200).json({ message: 'Customer details inserted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(200).json({ error: 'Failed to insert customer details.' });
  }
});

// GET method to fetch all customers
app.get('/api/customer', (req, res) => {
  const query = 'SELECT * FROM CustomerDetails';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch data from database' });
    }
    res.status(200).json({ success: true, customers: result });
  });
});

// PUT method to update a customer by ID
app.put('/api/customer/:id', (req, res) => {
  const customerId = req.params.id;
  const { firstName, lastName, email, mobileNumber, address, pincode } = req.body;

  const query = 'UPDATE CustomerDetails SET First_Name = ?, Last_Name = ?, Email = ?, Mobile_number = ?, Address = ?, Pincode = ? WHERE Customer_ID = ?';
  db.query(query, [firstName, lastName, email, mobileNumber, address, pincode, customerId], (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).json({ success: false, message: 'Failed to update data in database' });
    }
    console.log('Data updated successfully');
    res.status(200).json({ success: true, message: 'Data updated successfully' });
  });
});

// DELETE method to delete a customer by ID
app.delete('/api/customer/:id', (req, res) => {
  const customerId = req.params.id;

  const query = 'DELETE FROM CustomerDetails WHERE Customer_ID = ?';
  db.query(query, [customerId], (err, result) => {
    if (err) {
      console.error('Error deleting data:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete data from database' });
    }
    console.log('Data deleted successfully');
    res.status(200).json({ success: true, message: 'Data deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

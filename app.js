/** BizTime express application. */
const express = require("express");
const pool = require('./db');
const port = 3000


const app = express();
const ExpressError = require("./expressError")

app.use(express.json());


/** 404 handler */

/*app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

/*app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});*/


app.get('/', (req, res) => {
  res.send('plese go to the companies route!')
})



app.get('/companies', async(req, res) => {
  try {
  const result = await pool.query(`SELECT * FROM  companies`)

    res.json(result.rows)

    
  } catch (error) {
    console.log(error)
    
  }
  
})



app.post('/companies', async(req, res) => {
  
  try {
    const {code, name, description} = req.body;
    const result = await pool.query(`INSERT INTO companies(code, name, description) VALUES($1, $2, $3) RETURNING code, name, description`, [code, name, description]);

    return res.json(result.rows)

    
  } catch (error) {
    console.log(error)
  }
  


})



app.patch('/companies/:code', async(req, res) => {

  try {
    const {name, description} = req.body
    const result = pool.query(`UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description`, [name, description, req.params.code]);

    res.json((await result).rows[0])
    
  } catch (error) {
    console.log(error)
  }

})



app.delete('/companies/:code', (req, res) => {
  try {
    const {code} = req.params
    const result = pool.query(`DELETE FROM companies WHERE code=$1`, [code]);

    res.send({
      msg: "Deleted"
    })
    
  } catch (error) {
    console.log(error)
  }
 
})



app.get('/invoices', async(req, res) => {
  try {
  const result = await pool.query(`SELECT * FROM  invoices`)

    res.json(result.rows)

    
  } catch (error) {
    console.log(error)
    
  }
  
})



app.post('/invoices', async(req, res) => {

  const {comp_Code, amt, paid, paid_date} = req.body

  try {
    let result = await pool.query(`INSERT INTO invoices(comp_Code, amt, paid, paid_date) VALUES($1, $2, $3, $4) RETURNING comp_Code, amt, paid, paid_date `, [comp_Code, amt, paid, paid_date]);

    return res.json(result.rows)
    
  } catch (error) {
    console.log(error)
  }


});


app.patch('/invoices/:id', async(req, res) => {

  try {
    const {comp_Code, amt, paid, paid_date} = req.body

    let result = await pool.query(`UPDATE invoices SET comp_Code=$1, amt=$2, paid=$3, paid_date=$4 WHERE id=$5 RETURNING comp_Code, amt, paid, paid_date`,[comp_Code, amt, paid, paid_date, req.params.id]);
    return res.json(result.rows[0])
  } catch (error) {
    console.log(error)
  }


});



app.delete('/invoices/:id', async(req, res) => {
  try {
    const {id} = req.params
    const result = await pool.query(`DELETE FROM invoices WHERE id=$1`, [id]);

    res.send({
      msg: "Deleted"
    })
    
  } catch (error) {
    console.log(error)
  }
 
})



app.get('/industries', async(req, res) => {
  try {
    const result = await pool.query(`SELECT companies.code, name,
     description, invoice_id,
     industries.code FROM companies JOIN industries ON companies.code = industries.company_id`)

     res.json(result.rows)
    
  } catch (error) {
    console.log(error)
    
  }
 
})



app.post('/industries', async(req, res) => {
  try {
    const {company_id, invoice_id, code} = req.body
    const result = await pool.query(`INSERT INTO industries(company_id, invoice_id, code) VALUES($1, $2, $3) RETURNING company_id, invoice_id, code`, [company_id, invoice_id, code])
    return res.json(result.rows)
  } catch (error) {
    console.log(error)
  }
})


























app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
module.exports = app;

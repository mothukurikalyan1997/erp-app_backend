const db = require('../DB/database')

const getexpensecat = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const q = `SELECT * FROM expense_cat where company_id = ${company_id};`
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const insertexpense = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const vv = req.body;
    const values = [
      req.body.expense.date,
      req.body.expense.Choose_Partner,
      req.body.expense.expenseAccount,
      req.body.expense.amount,
      req.body.expense.taxTreatment,
      req.body.expense.actvat,
      req.body.expense.reference,
      req.body.expense.accountHolder,
      req.body.expense.behalf,
      req.body.expense.submitdate,
      req.body.expense.notes,
      company_id
       ];
    // console.log(req.body.expense.date);
    const q = "INSERT INTO expense_data (`date`,`Choose_Partner`,`expenseAccount`,`amount`,`taxTreatment`,`actvat`,`reference`,`accountHolder`,`behalf`,`submitdate`,`notes`,`company_id`) VALUES (?)"
    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const getexpensedata = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const q = `SELECT * FROM expense_data where company_id = ${company_id}`
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const removeexpense = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const v = req.params.ID;
    const q = `DELETE FROM expense_data WHERE reference = ? and company_id = ${company_id}`;
    db.query(q,[v],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const postexpcat = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

  const vv = req.body;
  const values = [
    vv.item.expensecat,
    vv.item.notes,
    vv.item.status,
    company_id
  ];
  console.log(values);
  const q = 'INSERT INTO expense_cat (`expensecat`,`notes`,`status`,`company_id`) VALUES (?)';
  db.query(q,[values],(err,data)=>{
      if(err) return res.json(err)
      return res.json(data)
  })
}

const expcatdata = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

  const q = `SELECT * FROM expense_cat where company_id = ${company_id}`;
  db.query(q,(err,data)=>{
      if(err) return res.json(err)
      return res.json(data)
  })
}

  module.exports = {getexpensecat,insertexpense,getexpensedata,removeexpense,postexpcat,expcatdata}
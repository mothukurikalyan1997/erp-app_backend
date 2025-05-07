const db = require('../DB/database')

const getbankdata = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const i = req.params.ID;
    const q = `SELECT * FROM bank where company_id = ${company_id}`
    db.query(q,[i],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const getsinglebank = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const i = req.params.id;
    const q = `SELECT * FROM bank where accountNumber= ? and company_id = ${company_id}`
    db.query(q,[i],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }
const bankupdate = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const i = req.params.id;
    const values = [
      req.body.valuee.BankName,
      req.body.valuee.accountHolder,
      req.body.valuee.accountNumber,
      req.body.valuee.IBAN,
      req.body.valuee.Openingbalance,
      req.body.valuee.Remark
     ];

    const q = "UPDATE bank SET `BankName` = ? , `accountHolder` = ? ,`accountNumber` = ? ,`IBAN` = ?,	`Openingbalance` = ?, `Remark` = ? WHERE accountNumber = ? and company_id = ?"
    db.query(q,[...values,i,company_id],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

  const insrtbank = (req, res) => {
    const email = req.headers.email;
    const role = req.headers.role;
    const company_id = req.headers.company_id;
    const token = req.headers.authorization.split(" ")[1];

    const vv = req.body;
    const values = [
        req.body.formData.BankName,
        req.body.formData.accountHolder,
        req.body.formData.accountNumber,
        req.body.formData.IBAN,
        req.body.formData.Openingbalance,
        req.body.formData.Remark,
        company_id
       ];
    // console.log(req.body.formdata.salutation);
    const q = "INSERT INTO bank (`BankName`,`accountHolder`,`accountNumber`,`IBAN`,`Openingbalance`,`Remark`,`company_id`) VALUES (?)"
    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

  module.exports = {getbankdata,getsinglebank,bankupdate,insrtbank}
const db = require('../DB/database')

const getconsumer = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const q = `SELECT * FROM consumer where company_id = ${company_id};`
     db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const postconsumer = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const vv = req.body;
    // console.log(username)
    const values = [
        req.body.formData.code,
        req.body.formData.salutation,
        req.body.formData.firstName,
        req.body.formData.lastName,
        req.body.formData.companyName,
        req.body.formData.displayName,
        req.body.formData.email,
        req.body.formData.workPhone,
        req.body.formData.mobile,
        req.body.formData.taxTreatment,
        req.body.formData.trn,
        req.body.formData.currency,
        req.body.formData.openingBalance,
        req.body.formData.paymentTerms,
        req.body.formData.Attention,
        req.body.formData.street,
        req.body.formData.City,
        req.body.formData.State,
        req.body.formData.ZIPCode,
        req.body.formData.Phone,
        req.body.formData.Remarks,
        req.body.formData.type,
        req.body.formData.bankname,
        req.body.formData.accountnumber,
        req.body.formData.iban,
        company_id
       ];
    console.log(values);
    const q = "INSERT INTO consumer (`code`,`salutation`,`firstName`,`lastName`,`companyName`,`displayName`,`email`,`workPhone`,`mobile`,`taxTreatment`,`trn`,`currency`,`openingBalance`,`paymentTerms`,`Attention`,`street`,`City`,`State`,`ZIPCode`,`Phone`,`Remarks`,`type`,`bankname`,`accountnumber`,`iban`, `company_id`) VALUES (?)"
    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

  const consumerput = (req, res) => {
    const email = req.headers.email;
    const role = req.headers.role;
    const company_id = req.headers.company_id;
    const token = req.headers.authorization.split(" ")[1];

    const vv = req.body;
    console.log(vv)
    const values = [
        req.body.valuee.salutation,
        req.body.valuee.firstName,
        req.body.valuee.lastName,
        req.body.valuee.companyName,
        req.body.valuee.displayName,
        req.body.valuee.email,
        req.body.valuee.workPhone,
        req.body.valuee.mobile,
        req.body.valuee.taxTreatment,
        req.body.valuee.trn,
        req.body.valuee.currency,
        req.body.valuee.openingBalance,
        req.body.valuee.paymentTerms,
        req.body.valuee.Attention,
        req.body.valuee.street,
        req.body.valuee.City,
        req.body.valuee.State,
        req.body.valuee.ZIPCode,
        req.body.valuee.Phone,
        req.body.valuee.Remarks,
        req.body.valuee.type,
        req.body.valuee.bankname,
        req.body.valuee.accountnumber,
        req.body.valuee.iban
       ];

    console.log(vv);
    const ID = [req.params.ID]

    const q = "UPDATE consumer SET `salutation` = ? , `firstName` = ? ,`lastName` = ? ,`companyName` = ?,	`displayName` = ?, `email` = ?, `workPhone` = ?,	`mobile` = ?, `taxTreatment` = ?,	`trn` = ?	,`currency` = ?,	`openingBalance` = ?, `paymentTerms` = ?, `Attention` = ?, `street` = ?,	`City` = ?,	`State` = ?,	`ZIPCode` = ?, `Phone` = ?, `Remarks` = ?, `type` = ?, `bankname` = ?, `accountnumber` = ?, `iban` = ? WHERE ID = ? and company_id = ?";
    db.query(q,[...values,ID,company_id],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }


const consumerdel = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const v = req.params.ID;
    console.log(v)
    const q = `DELETE FROM consumer WHERE ID = ? and company_id = ${company_id};`
    db.query(q,[v],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const consumergetedit = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const i = req.params.ID;
    const q = `SELECT * FROM consumer WHERE ID = ? and company_id = ${company_id};`
    db.query(q,[i],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

  module.exports = {getconsumer,postconsumer,consumerput,consumerdel,consumergetedit}
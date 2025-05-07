const db = require('../DB/database')

const postitem = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const vv = req.body;
    const values = [
        req.body.formData.itemcode,
        req.body.formData.itemname,
        req.body.formData.itemtype,
        req.body.formData.buyingcost,
        req.body.formData.sellingprice,
        req.body.formData.Remark,
        company_id
       ];
    const q = "INSERT INTO item (`itemcode`,`itemname`,`itemtype`,`buyingcost`,`sellingprice`,`Remark`,`company_id`) VALUES (?)"
    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const getitem = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const q = `SELECT * FROM item where company_id = ${company_id}`
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const delitem = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const v = req.params.ID;
    const q = `DELETE FROM item WHERE itemcode = ? and company_id = ${company_id};`
    db.query(q,[v],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

  module.exports = {postitem,getitem,delitem}
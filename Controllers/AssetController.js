const db = require('../DB/database')



const assetregister = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];


    const vv = req.body;
    const values = [
      vv.asset.assettype,
      vv.asset.assetduration,
      vv.asset.assetid,
      vv.asset.assetname,
      vv.asset.buydate,
      vv.asset.vendor,
      vv.asset.amount,
      company_id
    ];
    console.log(values);
    const q = 'INSERT INTO assets (`assettype`,`assetduration`,`assetid`,`assetname`,`buydate`,`vendor`,`amount`,`company_id`) VALUES (?)';
    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const getasetdata = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const v = req.params.id;
    const q = `SELECT 
    a.assettype,
    a.assetduration,
    a.assetid,
    a.assetname,
    a.buydate,
    a.vendor,
    a.amount,
    a.status,
    a.AssignedTo,
    em.empfullname
FROM assets a
LEFT JOIN employee em ON a.AssignedTo = em.EmpID
WHERE a.company_id = ${company_id}
GROUP BY 
    a.assettype,
    a.assetduration,
    a.assetid,
    a.assetname,
    a.buydate,
    a.vendor,
    a.amount,
    a.status,
    a.AssignedTo,
    em.empfullname`
    ;
    db.query(q,[v],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const getasetlog = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const v = req.params.id;
    const q = `SELECT * FROM assetslog where company_id = ${company_id};`
    db.query(q,[v],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const getsingleaset = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const v = req.params.id;
    const q = `SELECT * FROM assets WHERE assetid = ? and company_id = ${company_id};`
    db.query(q,[v],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const updateasetlogs = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const vv = req.body;
    const values = [
      vv.assign.type,
      vv.assign.assetid,
      vv.assign.assetname,
      vv.assign.assigndate,
      vv.assign.assignto,
      vv.assign.remark,
      company_id,
    ];
     
    const insertQuery = `INSERT INTO assetslog (type, assetid, assetname, logdate, empid, remark,company_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
    db.query(insertQuery, values, (err, result1) => {
      if (err) return res.status(500).json({ error: "Insert failed", details: err });
        const updateQuery = `UPDATE assets SET AssignedTo = ? WHERE assetid = ? and company_id = ?`;
  
      db.query(updateQuery, [vv.assign.assignto, vv.assign.assetid , company_id], (err, result2) => {
        if (err) return res.status(500).json({ error: "Update failed", details: err });
  
        return res.json({
          message: "Insert and update successful",
          insertResult: result1,
          updateResult: result2
        });
      });
      
      })}

const postdamageaset = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const vv = req.body;
    const values = [vv.empID,vv.empfullname,vv.deductcat,vv.date,vv.dmginv,vv.amt,vv.remark,company_id];
    const q = 'INSERT INTO emp_monthly_deduction (empID, empfullname, deductcat, date, dmginv, amt, remark,company_id) VALUES (?)';
    
    db.query(q, [values], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Insert error" });
      }
      return res.json({ message: "Deduction added successfully", result })})};
  

const damageassetdata = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    // const v = req.params.id;
    // const q = "SELECT * FROM emp_monthly_deductions WHERE assetid = ?";
    const q = `SELECT * FROM emp_monthly_deduction where company_id = ${company_id}`;
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

module.exports = {assetregister,getasetdata,getasetlog,getsingleaset,updateasetlogs,postdamageaset,damageassetdata}
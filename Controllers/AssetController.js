const db = require('../DB/database')
const multer = require('multer');
const XLSX = require('xlsx');


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
    const values = [vv.empID,vv.employeename,vv.deductcat,vv.date,vv.dmginv,vv.amt,vv.remark,company_id];
    const q = 'INSERT INTO emp_monthly_deduction (empID, empFullName, deductcat, date, dmginv, amt, remark,company_id) VALUES (?)';
    
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

    const v = req.params.id;
    // const q = "SELECT * FROM emp_monthly_deductions WHERE assetid = ?";
    const q = `SELECT * FROM emp_monthly_deduction where company_id = ${company_id} and empID = ${v}`;
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const upload = multer({ storage: multer.memoryStorage() });

const uploadasset = (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: null });

    // 🔧 Fix: Trim keys in each row
    const rows = rawRows.map(row => {
      const cleanRow = {};
      for (const key in row) {
        cleanRow[key.trim()] = row[key]; // remove leading/trailing spaces from headers
      }
      return cleanRow;
    });

    // Define columns in correct SQL order
    const columns = [
      "assettype", "assetduration", "assetid", "assetname", "buydate", "vendor",
      "amount", "status", "AssignedTo", "company_id"
    ];

    const values = rows.map(row =>
      columns.map(col => {
        let val = row[col] ?? null;

        // Handle Excel serial date values (numbers)
        if (typeof val === 'number' && col.toLowerCase().includes('date')) {
          const date = XLSX.SSF.parse_date_code(val);
          if (date) {
            const jsDate = new Date(Date.UTC(date.y, date.m - 1, date.d));
            return jsDate.toISOString().slice(0, 10);
          }
        }

        if (val instanceof Date) {
          return val.toISOString().slice(0, 10);
        }

        return val;
      })
    );

    const placeholders = values.map(() => `(${columns.map(() => '?').join(',')})`).join(',');
    const flatValues = values.flat();

    const sql = `INSERT INTO assets (${columns.join(',')}) VALUES ${placeholders}`;
    
    db.query(sql, flatValues, (err, result) => {
      if (err) {
        console.error('SQL Insert Error:', err);
        return res.status(500).send('Failed to insert data into DB.');
      }
      res.send({ message: 'Data inserted successfully.', inserted: result.affectedRows });
    });
  } catch (err) {
    console.error('Processing error:', err);
    res.status(500).send('Error processing Excel file.');
  }
}

module.exports = {assetregister,getasetdata,getasetlog,getsingleaset,updateasetlogs,postdamageaset,damageassetdata,uploadasset}
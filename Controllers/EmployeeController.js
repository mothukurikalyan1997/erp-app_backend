const db = require('../DB/database')
const multer = require('multer');
const XLSX = require('xlsx');


const postemp = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const vv = req.body.emp;
    const values =  [
      req.body.emp.empfullname,
      req.body.emp.EmpID,
      req.body.emp.mobile,
      req.body.emp.emptype,
      req.body.emp.eid,
      req.body.emp.eidexp,
      req.body.emp.email,
      req.body.emp.ppnumber,
      req.body.emp.ppexp,
      req.body.emp.nationality,
      req.body.emp.externalid,
      req.body.emp.workingcompany,
      req.body.emp.worklocation,
      req.body.emp.workcity,
      req.body.emp.locationid,
      req.body.emp.joindate,
      req.body.emp.trafficcode,
      req.body.emp.license,
      req.body.emp.licenseexp,
      req.body.emp.bankname,
      req.body.emp.bankac,
      req.body.emp.iban,
      req.body.emp.personcode,
      req.body.emp.grosssalary,
      req.body.emp.salarydistributiontype,
      req.body.emp.employementtype,
      company_id
    ];
    console.log(values);
    const q = 'INSERT INTO employee (`empfullname`,`EmpID`,`mobile`,`emptype`,`eid`,`eidexp`,`email`,`ppnumber`,`ppexp`,`nationality`,`externalid`,`workingcompany`,`worklocation`,`workcity`,`locationid`,`joindate`,`trafficcode`,`license`,`licenseexp`,`bankname`,`bankac`,`iban`,`personcode`,`grosssalary`,`salarydistributiontype`,`employementtype`,`company_id`) VALUES (?)';
    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err)
        return console.log(data)
    })
  }

const getempdata = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const q = `select 
e.EmpID,
e.externalid,
e.empfullname,
e.mobile,
e.workingcompany,
e.worklocation,
e.status,
a.Assets
from 
employee e
left join (
select 
AssignedTo,
group_concat(assetid) as Assets
from assets
group by AssignedTo) a on e.EmpID = a.AssignedTo
where company_id = ${company_id}
group by 
e.EmpID;`
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

//   Employee Actions

const getpenalty = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const v = req.params.id;
    const q = `SELECT * FROM employee WHERE EmpID = ? and company_id = ${company_id}`;
    db.query(q,[v],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const penaltyreg = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const vv = req.body;
    const values = [
      vv.penalty.EmpID,
      vv.penalty.empfullname,
      vv.penalty.penaltydate,
      vv.penalty.penaltydays,
      vv.penalty.reason,
      company_id
    ];
    console.log(values);
    const q = 'INSERT INTO penalty_register (`EmpID`,`empfullname`,`penaltydate`,`penaltydays`,`reason`,`company_id`) VALUES (?)';
    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const getpenaltyhist = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const v = req.params.id;
    const q = `SELECT * FROM penalty_register WHERE EmpID = ? and company_id = ${company_id}`;
    db.query(q,[v],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const single_Vacation_Hist = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const v = req.params.id;
    const q = `SELECT * FROM vacation_register WHERE EmpID = ? and company_id = ${company_id}`;
    db.query(q,[v],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const vacationhist = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const vv = req.body;
    const values = [
      vv.vacation.EmpID,
      vv.vacation.empfullname,
      vv.vacation.vacationstart,
      vv.vacation.vacationend,
      vv.vacation.comment,
      company_id
    ];
    console.log(values);
    // console.log(values);
    const q = 'INSERT INTO vacation_register (`EmpID`,`empfullname`,`vacationstart`,`vacationend`,`comment`,`company_id`) VALUES (?)';
    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const incidentregister = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const vv = req.body;
    const values = [
      vv.incident.EmpID,
      vv.incident.employeename,
      vv.incident.incidentdate,
      vv.incident.inctype,
      vv.incident.incidentcat,
      vv.incident.actiontype,
      vv.incident.days,
      vv.incident.reportedby,
      vv.incident.remark,
      company_id
    ];
    console.log(values);
    const q = 'INSERT INTO EmployeeIncidents (`EmpID`,`employeename`,`incidentdate`,`inctype`,`incidentcat`,`actiontype`,`days`,`reportedby`,`remark`,`company_id`) VALUES (?)';
    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const singleincidenthist = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const v = req.params.id;
    const q = `SELECT * FROM EmployeeIncidents WHERE EmpID = ? and company_id = ${company_id}`;
    db.query(q,[v],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const singleempdata = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const v = req.params.id;
    const q = `SELECT * FROM employee WHERE EmpID = ? and company_id = ${company_id}`;
    db.query(q,[v],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const deleteinc = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const v = req.params.id;
    const vb = req.params.ids;
    const q = `Delete FROM EmployeeIncidents WHERE EmpID = ? and id = ? and company_id = ${company_id}`;
    db.query(q,[v,vb],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const updateemp = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];
  const v = req.params.id;

  const values = [
    req.body.emp.empfullname || null,
    req.body.emp.EmpID || null,
    req.body.emp.mobile || null,
    req.body.emp.emptype || null,
    req.body.emp.eid || null,
    req.body.emp.eidexp || null,
    req.body.emp.email || null,
    req.body.emp.ppnumber || null,
    req.body.emp.ppexp || null,
    req.body.emp.nationality || null,
    req.body.emp.externalid || null,
    req.body.emp.workingcompany || null,
    req.body.emp.worklocation || null,
    req.body.emp.workcity || null,
    req.body.emp.locationid || null,
    req.body.emp.joindate || null,
    req.body.emp.trafficcode || null,
    req.body.emp.license || null,
    req.body.emp.licenseexp || null,
    req.body.emp.bankname || null,
    req.body.emp.bankac || null,
    req.body.emp.iban || null,
    req.body.emp.personcode || null,
    req.body.emp.grosssalary || null,
    req.body.emp.salarydistributiontype || null,
    req.body.emp.employementtype || null,
    req.body.emp.status || null,
    v, // last value for WHERE clause
    company_id // used again in WHERE
  ];

  const q = `
    UPDATE employee SET 
      empfullname = ?, EmpID = ?, mobile = ?, emptype = ?, eid = ?, eidexp = ?, 
      email = ?, ppnumber = ?, ppexp = ?, nationality = ?, externalid = ?, 
      workingcompany = ?, worklocation = ?, workcity = ?, locationid = ?, 
      joindate = ?, trafficcode = ?, license = ?, licenseexp = ?, 
      bankname = ?, bankac = ?, iban = ?, personcode = ?, 
      grosssalary = ?, salarydistributiontype = ?, employementtype = ?, status = ?
    WHERE EmpID = ? AND company_id = ?;
  `;
  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json({ message: 'Employee updated successfully', data });
  });
};

const upload = multer({ storage: multer.memoryStorage() });

const uploademployee = (req, res) => {
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
      "empfullname", "EmpID", "mobile", "emptype", "eid", "eidexp",
      "email", "ppnumber", "ppexp", "nationality", "externalid",
      "workingcompany", "worklocation", "workcity", "locationid", "joindate",
      "trafficcode", "license", "licenseexp", "bankname", "bankac", "iban",
      "personcode", "grosssalary", "salarydistributiontype",
      "employementtype", "company_id"
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

    const sql = `INSERT INTO employee (${columns.join(',')}) VALUES ${placeholders}`;
    
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

  module.exports = {postemp,getempdata,
    getpenalty,penaltyreg,getpenaltyhist,single_Vacation_Hist,vacationhist,incidentregister,
    singleincidenthist,uploademployee,deleteinc,singleempdata,updateemp
  }
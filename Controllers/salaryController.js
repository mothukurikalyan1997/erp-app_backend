const db = require('../DB/database')

const postsalary =(req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];
  
  const vv = req.body;
  
    const values = [
      vv.salary.month || null,
      vv.salary.year || null,
      vv.salary.empID || null,
      vv.salary.empname || null,
      vv.salary.presentdays || null,
      vv.salary.offdays || null,
      vv.salary.sickleave || null,
      vv.salary.totalworkingdays || null,
      vv.salary.grosssalary || null,
      vv.salary.remark || null,
      vv.salary.paid_through || null,
      company_id
    ];
    const q = 'INSERT INTO employee_payments (`month`,`year`,`empID`,`empname`,`presentdays`,`offdays`,`sickleave`,`totalworkingdays`,`grosssalary`,`remark`,`paid_through`,`company_id`) VALUES (?)';
    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const getsaltable = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const q = `SELECT 
  e.month,
  e.year,
  e.empID,
  e.empname,
  e.presentdays,
  e.offdays,
  e.sickleave,
  e.totalworkingdays,
  e.grosssalary,
  SUM(ed.amt) + SUM(ei.amount) AS Total_Deduction_Amount,
  e.grosssalary - (IFNULL(SUM(ei.amount), 0) + IFNULL(SUM(ed.amt), 0)) AS Netsalary,
  e.status
FROM 
  employee_payments e
LEFT JOIN 
  expense_items ei 
    ON e.empID = ei.EmpID
    AND e.month = ei.salary_month
    AND ei.deduct_from_employee = '1' 
LEFT JOIN 
  emp_monthly_deduction ed 
    ON e.empID = ed.empID
    AND e.month = ed.deductMonth
WHERE 
  e.company_id = ${company_id} 
GROUP BY 
  e.month,
  e.year,
  e.empID,
  e.empname,
  e.presentdays,
  e.offdays,
  e.sickleave,
  e.totalworkingdays,
  e.grosssalary,
  e.status;`;
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

// const getuniqdata = (req, res) => {
//     const id = req.params.id;
//     const month = req.params.month;
  
//     const q = `SELECT 
//     e.month,
//     e.year,
//     e.empID,
//     e.empname,
//     e.presentdays,
//     e.offdays,
//     e.sickleave,
//     e.totalworkingdays,
//     e.grosssalary,
//     ed.deductCat,
//     SUM(ed.amt) AS Deduction_Amount
//   FROM employee_payments e
//   LEFT JOIN emp_monthly_deduction ed 
//     ON e.empID = ed.empID AND e.month = ed.deductMonth
//   WHERE e.empID = ? AND e.month = ?
//   GROUP BY 
//     e.month,
//     e.year,
//     e.empID,
//     e.empname,
//     e.presentdays,
//     e.offdays,
//     e.sickleave,
//     e.totalworkingdays,
//     e.grosssalary,
//     ed.deductCat;`;
//     // const q = "SELECT * FROM EmployeePayments";
//     db.query(q,[id,month],(err,data)=>{
//         if(err) return res.json(err)
//         return res.json(data)
//     })
//   }

const empsalupdate = (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const vv = req.body;
    const values = [
        req.body.salary.month,
        req.body.salary.year,
        req.body.salary.empname,
        req.body.salary.pdays,
        req.body.salary.dayoff,
        req.body.salary.sldays,
        req.body.salary.wdays,
        req.body.salary.paidamount,
        req.body.salary.deductamount,
        req.body.salary.finalpay,
        req.body.salary.paymenttype,
        req.body.salary.paymentstatus,
        req.body.salary.paiddate,
        req.body.salary.remark,
        req.body.salary.empID,
  
       ];
    const q = `UPDATE EmployeePayments SET month = ?, year = ?, empname = ?, pdays = ?, dayoff = ?, sldays = ?, wdays = ?, paidamount = ?, deductamount = ?, finalpay = ?, paymenttype = ?, paymentstatus = ?, paiddate = ?, remark = ? WHERE empID = ? and company_id = ${company_id}`;
    db.query(q,values,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  }

const updateded = async (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

    const empid = req.body.empID;
    const month = req.body.month;
    const year = req.body.year;
    console.log(empid,month,year)
    const q1 = `UPDATE expense_items SET status = 'Paid' WHERE EmpID = ? and salary_month = ? and year = ? and deduct_from_employee = 1 and company_id = ?`;
    const q2 = `UPDATE employee_payments SET status = 'Paid' WHERE empID = ? and month = ? and year = ? and company_id = ?`;
    const q3 = `UPDATE emp_monthly_deduction SET status = 'Paid' WHERE empID = ? and deductMonth = ? and company_id = ?`;
  
    try {
      await db.promise().query(q1,[empid,month,year,company_id]);
  
      await db.promise().query(q2,[empid,month,year,company_id]);

      await db.promise().query(q3,[empid,month,company_id]);
  
      res.json({ message: 'Both tables updated successfully.' });
  
    } catch (error) {
      res.json(error)
    }
  }

  const getsaldata = (req,res)=> {
    const email = req.headers.email;
    const role = req.headers.role;
    const company_id = req.headers.company_id;
    const token = req.headers.authorization.split(" ")[1];

    const id = req.params.id;
    const month = req.params.month;
    const year = req.params.year;

    const q1 = `SELECT * from employee_payments where empID = ? and month = ? and year = ? and company_id = ${company_id}`;
    const q2 = `SELECT category,salary_month,EmpID,SUM(amount) AS fulldeduction FROM expense_items WHERE EmpID = ? AND salary_month = ? and year = ? AND deduct_from_employee = 1 and company_id = ${company_id} GROUP BY 
    category, salary_month, EmpID`;
    const q3 = `SELECT * from emp_monthly_deduction where empID = ? and deductMonth = ? and company_id = ${company_id}`;
    
    db.query(q1,[id,month,year],(err,result1)=>{
      if(err){
        return res.status(500).json({ error: 'Failed to fetch expense bill' });
      }
    db.query(q2,[id,month,year],(err,result2)=>{
      if(err){
        return res.status(500).json({ error: 'Failed to fetch expense data' });
      }
    db.query(q3,[id,month],(err,result3)=>{
      if(err){
        return res.status(500).json({ error: 'Failed to fetch request3' });
      }
      res.status(200).json({
        result1,
        result2,
        result3
      })
    })  
    })
    }
    
  )}

  module.exports = {postsalary,getsaltable,empsalupdate,updateded,
    getsaldata
  }
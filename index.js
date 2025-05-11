const express = require("express")
const sql = require ("mysql2")
const cors = require("cors")
const bodyParser = require('body-parser');
const dotENV = require('dotenv')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const db = require('./DB/database')

const PartnerRoute = require('./Routes/PartnerRoute')
const ExpenseRoute = require('./Routes/ExpenseRoutes')
const BankingRoute = require('./Routes/BankingRoutes')
const ItemRoute = require('./Routes/ItemRoutes')
const EmplyeeRoute = require('./Routes/EmployeeRoutes')
const AssetRoute = require('./Routes/AssetRoutes')
const salaryRoute = require('./Routes/SalaryRoutes')
const SignupRoute = require('./Routes/SignupRoutes')





dotENV.config();


const port = process.env.PORT || 3001;
const secret = process.env.SECRET_KEY;

const allowedOrigins = [
  'https://erp-app-frontend.vercel.app',
  'https://erp-app-frontend-fo24izlez-kalyan-mothukuris-projects.vercel.app'
];

const app = express()
app.use(express.json())
app.use(cors())

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS: ' + origin));
//     }
//   },
//   credentials: true
// }));

app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));

const nodemon = require('nodemon')



app.listen(port,()=>{
    console.log (`server is started on ${port}`)
})
 
app.use('/listen',(req,res)=>{
  res.send("<h1>welcome nani</h1>");
})


// Middleware to parse JSON request bodies


// Register Route (Signup)
// app.post("/signup", async (req, res) => {
//   const { email, password } = req.body;

//   // Check if user already exists
//   db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
//     if (err) return res.status(500).json({ message: "Database error" });
//     if (result.length > 0) {
//       return res.status(400).json({ message: "Email is already taken" });
//     }

//     // Hash password before saving to the database
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save user to database
//     db.query(
//       "INSERT INTO users (email, password) VALUES (?, ?)",
//       [email, hashedPassword],
//       (err, result) => {
//         if (err) return res.status(500).json({ message: "Failed to register" });
//         res.status(201).json({ success: true });
//       }
//     );
//   });
// });

app.use("/go",SignupRoute);
app.use('/partner',PartnerRoute);
app.use('/expense',ExpenseRoute);
app.use('/bank',BankingRoute);
app.use('/item',ItemRoute);
app.use('/emp',EmplyeeRoute);
app.use('/asset',AssetRoute);
app.use('/sal',salaryRoute);



// Login Route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Find user in database
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result[0];
    const role = user.role;
    const company_id = user.company_id;
    const email = user.email;
    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ role: user.role ,company_id:user.company_id}, secret);
    res.json({ token ,role, company_id,email});
  });
});

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token is invalid" });
    }
    req.user = user;
    next();
  });
};

// Protected Route
app.get("/dashboard", authenticateJWT, (req, res) => {
  res.json({ message: "Welcome to the ERP Dashboard", user: req.user });
});

// Logout Route (Client-side will clear token)
app.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// -----------------------------------

app.get('/', (req, res) => {
  res.json('hello kalyan')
})

// Dashboard Data

// bring photo

app.get('/dashdata', (req, res) => {
  const company_id = req.headers.company_id;
  db.query(`SELECT
  (SELECT COUNT(*) FROM employee where company_id = ${company_id}) AS employee_count,
  (SELECT COUNT(*) FROM consumer WHERE type = 'vendor' and company_id = ${company_id}) AS vendor_count,
  (SELECT COUNT(*) FROM consumer WHERE type = 'Customer' and company_id = ${company_id}) AS customer_count,
  (SELECT COUNT(*) FROM bank where company_id = ${company_id}) AS bank_count,
  (SELECT COUNT(*) FROM assets where company_id = ${company_id}) AS asset_count,
  (SELECT SUM(amount) FROM invoices where company_id = ${company_id}) AS invoice_amount,
  (SELECT SUM(amount) + SUM(vat) FROM expense_items where company_id = ${company_id}) AS expense_amount_with_vat,
  (SELECT SUM(amt) FROM emp_monthly_deduction where company_id = ${company_id}) AS deduction_amount,
  (
    (SELECT SUM(amount) FROM invoices where company_id = ${company_id}) -
    (SELECT SUM(amount) + SUM(vat) FROM expense_items where company_id = ${company_id})
  ) AS net_balance  
;`
    , (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results); // Sends [{ id, path }, ...]
  });
});

  // app.get("/expense_account", (req, res) => {
  //   const q = "SELECT * FROM expense_cat;"
  //   db.query(q,(err,data)=>{
  //       if(err) return res.json(err)
  //       return res.json(data)
  //   })
  // }) 
// app.post("/consumer", authenticateJWT,(req, res) => {
//     const vv = req.body;
//     const username = req.headers.email;
//     // console.log(username)
//     const values = [
//         req.body.formData.code,
//         req.body.formData.salutation,
//         req.body.formData.firstName,
//         req.body.formData.lastName,
//         req.body.formData.companyName,
//         req.body.formData.displayName,
//         req.body.formData.email,
//         req.body.formData.workPhone,
//         req.body.formData.mobile,
//         req.body.formData.taxTreatment,
//         req.body.formData.trn,
//         req.body.formData.currency,
//         req.body.formData.openingBalance,
//         req.body.formData.paymentTerms,
//         req.body.formData.Attention,
//         req.body.formData.street,
//         req.body.formData.City,
//         req.body.formData.State,
//         req.body.formData.ZIPCode,
//         req.body.formData.Phone,
//         req.body.formData.Remarks,
//         req.body.formData.type,
//         req.body.formData.bankname,
//         req.body.formData.accountnumber,
//         req.body.formData.iban,
//         req.headers.email
//        ];
//     console.log(values);
//     const q = "INSERT INTO consumer (`code`,`salutation`,`firstName`,`lastName`,`companyName`,`displayName`,`email`,`workPhone`,`mobile`,`taxTreatment`,`trn`,`currency`,`openingBalance`,`paymentTerms`,`Attention`,`street`,`City`,`State`,`ZIPCode`,`Phone`,`Remarks`,`type`,`bankname`,`accountnumber`,`iban`, `useremail`) VALUES (?)"
//     db.query(q,[values],(err,data)=>{
//         if(err) return res.json(err)
//         return res.json(data)
//     })
//   })

  // app.put("/edit/:ID", (req, res) => {
  //   const vv = req.body;
  //   const values = [
  //       req.body.valuee.salutation,
  //       req.body.valuee.firstName,
  //       req.body.valuee.lastName,
  //       req.body.valuee.companyName,
  //       req.body.valuee.displayName,
  //       req.body.valuee.email,
  //       req.body.valuee.workPhone,
  //       req.body.valuee.mobile,
  //       req.body.valuee.taxTreatment,
  //       req.body.valuee.trn,
  //       req.body.valuee.currency,
  //       req.body.valuee.openingBalance,
  //       req.body.valuee.paymentTerms,
  //       req.body.valuee.Attention,
  //       req.body.valuee.street,
  //       req.body.valuee.City,
  //       req.body.valuee.State,
  //       req.body.valuee.ZIPCode,
  //       req.body.valuee.Phone,
  //       req.body.valuee.Remarks,
  //       req.body.valuee.type
  //      ];
  //   const ID = [req.params.ID]
  //   const q = "UPDATE consumer SET `salutation` = ? , `firstName` = ? ,`lastName` = ? ,`companyName` = ?,	`displayName` = ?, `email` = ?, `workPhone` = ?,	`mobile` = ?, `taxTreatment` = ?,	`trn` = ?	,`currency` = ?,	`openingBalance` = ?, `paymentTerms` = ?, `Attention` = ?, `street` = ?,	`City` = ?,	`State` = ?,	`ZIPCode` = ?, `Phone` = ?, `Remarks` = ?, `type` = ? WHERE ID = ?";
  //   db.query(q,[...values,ID],(err,data)=>{
  //       if(err) return res.json(err)
  //       return res.json(data)
  //   })
  // })


  // app.delete("/consumerdelete/:ID", (req, res) => {
  //   const v = req.params.ID;
  //   const q = "DELETE FROM consumer WHERE ID = ?";
  //   db.query(q,[v],(err,data)=>{
  //       if(err) return res.json(err)
  //       return res.json(data)
  //   })
  // })


  // app.get('/consumeredit/:ID', (req, res) => {
  //   const i = req.params.ID;
  //   const q = "SELECT * FROM consumer WHERE ID = ?;"
  //   db.query(q,[i],(err,data)=>{
  //       if(err) return res.json(err)
  //       return res.json(data)
  //   })
  // })

  // app.get('/bank/data',(req, res) => {
  //   const i = req.params.ID;
  //   const q = "SELECT * FROM bank"
  //   db.query(q,[i],(err,data)=>{
  //       if(err) return res.json(err)
  //       return res.json(data)
  //   })
  // })

  // app.get('/bankedit/:id',(req, res) => {
  //   const i = req.params.id;
  //   const q = "SELECT * FROM bank where accountNumber= ?;"
  //   db.query(q,[i],(err,data)=>{
  //       if(err) return res.json(err)
  //       return res.json(data)
  //   })
  // })

  // app.put('/bankupdate/:id',(req, res) => {
  //   const i = req.params.id;
  //   const values = [
  //     req.body.valuee.BankName,
  //     req.body.valuee.accountHolder,
  //     req.body.valuee.accountNumber,
  //     req.body.valuee.IBAN,
  //     req.body.valuee.Openingbalance,
  //     req.body.valuee.Remark
  //    ];

  //   const q = "UPDATE bank SET `BankName` = ? , `accountHolder` = ? ,`accountNumber` = ? ,`IBAN` = ?,	`Openingbalance` = ?, `Remark` = ? WHERE accountNumber = ?"
  //   db.query(q,[...values,i],(err,data)=>{
  //       if(err) return res.json(err)
  //       return res.json(data)
  //   })
  // })


  // app.post("/bank", (req, res) => {
  //   const vv = req.body;
  //   const values = [
  //       req.body.formData.BankName,
  //       req.body.formData.accountHolder,
  //       req.body.formData.accountNumber,
  //       req.body.formData.IBAN,
  //       req.body.formData.Openingbalance,
  //       req.body.formData.Remark
  //      ];
  //   // console.log(req.body.formdata.salutation);
  //   const q = "INSERT INTO bank (`BankName`,`accountHolder`,`accountNumber`,`IBAN`,`Openingbalance`,`Remark`) VALUES (?)"
  //   db.query(q,[values],(err,data)=>{
  //       if(err) return res.json(err)
  //       return res.json(data)
  //   })
  // })

// Expense Account
  // app.post("/expense", (req, res) => {
  //   const vv = req.body;
  //   const values = [
  //     req.body.expense.date,
  //     req.body.expense.Choose_Partner,
  //     req.body.expense.expenseAccount,
  //     req.body.expense.amount,
  //     req.body.expense.taxTreatment,
  //     req.body.expense.actvat,
  //     req.body.expense.reference,
  //     req.body.expense.accountHolder,
  //     req.body.expense.behalf,
  //     req.body.expense.submitdate,
  //     req.body.expense.notes
  //      ];
  //   // console.log(req.body.expense.date);
  //   const q = "INSERT INTO expense_data (`date`,`Choose_Partner`,`expenseAccount`,`amount`,`taxTreatment`,`actvat`,`reference`,`accountHolder`,`behalf`,`submitdate`,`notes`) VALUES (?)"
  //   db.query(q,[values],(err,data)=>{
  //       if(err) return res.json(err)
  //       return res.json(data)
  //   })
  // })

  // app.get('/expensedata', (req, res) => {
  //   const q = "SELECT * FROM expense_data"
  //   db.query(q,(err,data)=>{
  //       if(err) return res.json(err)
  //       return res.json(data)
  //   })
  // })

  // app.delete("/expenseremove/:ID", (req, res) => {
  //   const v = req.params.ID;
  //   const q = "DELETE FROM expense_data WHERE reference = ?";
  //   db.query(q,[v],(err,data)=>{
  //       if(err) return res.json(err)
  //       return res.json(data)
  //   })
  // })

  // Item Start

  // app.post("/item", (req, res) => {
  //   const vv = req.body;
  //   const values = [
  //       req.body.formData.itemcode,
  //       req.body.formData.itemname,
  //       req.body.formData.itemtype,
  //       req.body.formData.buyingcost,
  //       req.body.formData.sellingprice,
  //       req.body.formData.Remark
  //      ];
  //   const q = "INSERT INTO item (`itemcode`,`itemname`,`itemtype`,`buyingcost`,`sellingprice`,`Remark`) VALUES (?)"
  //   db.query(q,[values],(err,data)=>{
  //       if(err) return res.json(err)
  //       return res.json(data)
  //   })
  // })
  // app.get('/itemdata', (req, res) => {
  //   const q = "SELECT * FROM item"
  //   db.query(q,(err,data)=>{
  //       if(err) return res.json(err)
  //       return res.json(data)
  //   })
  // })

  // app.delete("/itemdel/:ID", (req, res) => {
  //   const v = req.params.ID;
  //   const q = "DELETE FROM item WHERE itemcode = ?";
  //   db.query(q,[v],(err,data)=>{
  //       if(err) return res.json(err)
  //       return res.json(data)
  //   })
  // })


  // Start Selling data

  app.post("/sellingdatapost", (req, res) => {
     
    const vv = req.body;
    const values = vv.items.map(item => [
      item.itemCode,
      item.itemName,
      item.quantity,
      item.price,
      item.vat,
    ]);
    // console.log(vv);
    const q = 'INSERT INTO invoice_items (item_code, item_name, quantity, price, vat) VALUES ?';
    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  })

  app.get('/customer', (req, res) => {
    const email = req.headers.email;
    const role = req.headers.role;
    const company_id = req.headers.company_id;
    const token = req.headers.authorization.split(" ")[1];

    const q = "SELECT `displayname` FROM consumer WHERE type = 'Customer' and company_id = ?";
    db.query(q,[company_id],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  })
  app.get('/vendor', (req, res) => {
    const email = req.headers.email;
    const role = req.headers.role;
    const company_id = req.headers.company_id;
    const token = req.headers.authorization.split(" ")[1];

    const q = "SELECT `displayname` FROM consumer WHERE type = 'Vendor' and company_id = ?";
    db.query(q,[company_id],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
  })



// upload excel

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Define the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Give a unique name to the file
  }
});

const upload = multer({ storage });

// Route to handle Excel file upload and data import
app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path;

  // Read the Excel file
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Get the first sheet
  const worksheet = workbook.Sheets[sheetName];

  // Parse the sheet into JSON data
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  // Clean up the uploaded file after processing
  fs.unlinkSync(filePath);

  // Example of inserting data into the database
  // Assuming your Excel data has fields like id, name, and email
  data.forEach(item => {
    const { id, name, email } = item;

    // SQL Query to insert data into the database
    const query = 'INSERT INTO test (id, name, email) VALUES (?, ?, ?)';
    
    db.query(query, [id, name, email], (err, result) => {
      if (err) {
        console.error('Error inserting data into the database:', err);
        res.status(500).send('Error inserting data into the database');
        return;
      }
    });
  });

  res.status(200).send('Data imported successfully');
});

// ----------------

// Route to generate template Excel file
app.get('/download-template', (req, res) => {
  // Define template data (headers for the columns)
  const templateData = [
    { id: '', name: '', email: ''}, // Example row with headers
    { id: '', name: '', email: ''}
  ];

  // Create a worksheet from the template data
  const ws = XLSX.utils.json_to_sheet(templateData);

  // Create a new workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template');

  // Set the response headers to prompt a file download
  res.setHeader('Content-Disposition', 'attachment; filename=template.xlsx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

  // Generate and send the Excel file as a stream
  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
  
  // Send the buffer as the response body
  res.end(buffer)
});

// Invoice print page



// Employee register


// app.post("/employee", (req, res) => {
//   const vv = req.body.emp;
//   const values =  [
//     req.body.emp.empfullname,
//     req.body.emp.EmpID,
//     req.body.emp.mobile,
//     req.body.emp.emptype,
//     req.body.emp.eid,
//     req.body.emp.eidexp,
//     req.body.emp.email,
//     req.body.emp.ppnumber,
//     req.body.emp.ppexp,
//     req.body.emp.nationality,
//     req.body.emp.externalid,
//     req.body.emp.workingcompany,
//     req.body.emp.worklocation,
//     req.body.emp.workcity,
//     req.body.emp.locationid,
//     req.body.emp.joindate,
//     req.body.emp.trafficcode,
//     req.body.emp.license,
//     req.body.emp.licenseexp,
//     req.body.emp.bankname,
//     req.body.emp.bankac,
//     req.body.emp.iban,
//     req.body.emp.personcode,
//     req.body.emp.grosssalary,
//     req.body.emp.salarydistributiontype,
//     req.body.emp.employementtype
//   ];
//   console.log(values);
//   const q = 'INSERT INTO employee (`empfullname`,`EmpID`,`mobile`,`emptype`,`eid`,`eidexp`,`email`,`ppnumber`,`ppexp`,`nationality`,`externalid`,`workingcompany`,`worklocation`,`workcity`,`locationid`,`joindate`,`trafficcode`,`license`,`licenseexp`,`bankname`,`bankac`,`iban`,`personcode`,`grosssalary`,`salarydistributiontype`,`employementtype`) VALUES (?)';
//   db.query(q,[values],(err,data)=>{
//       if(err) return res.json(err)
//       return res.json(data)
//   })
// })

// app.get("/empdata", (req, res) => {
//   const q = "SELECT * FROM employee";
//   db.query(q,(err,data)=>{
//       if(err) return res.json(err)
//       return res.json(data)
//   })
// })


// app.post("/expensecat", (req, res) => {
//   const vv = req.body;
//   const values = [
//     vv.item.expensecat,
//     vv.item.notes,
//     vv.item.status
//   ];
//   console.log(values);
//   const q = 'INSERT INTO expense_cat (`expensecat`,`notes`,`status`) VALUES (?)';
//   db.query(q,[values],(err,data)=>{
//       if(err) return res.json(err)
//       return res.json(data)
//   })
// })

// app.get("/expensecatdata", (req, res) => {
//   const q = "SELECT * FROM expense_cat";
//   db.query(q,(err,data)=>{
//       if(err) return res.json(err)
//       return res.json(data)
//   })
// })

// Employee actions

// app.get("/employeepenalty/:id", (req, res) => {
//   const v = req.params.id;
//   const q = "SELECT * FROM employee WHERE EmpID = ?";
//   db.query(q,[v],(err,data)=>{
//       if(err) return res.json(err)
//       return res.json(data)
//   })
// })

// app.post("/Penaltyregister", (req, res) => {
//   const vv = req.body;
//   const values = [
//     vv.penalty.EmpID,
//     vv.penalty.empfullname,
//     vv.penalty.penaltydate,
//     vv.penalty.penaltydays,
//     vv.penalty.reason
//   ];
//   console.log(values);
//   const q = 'INSERT INTO penalty_register (`EmpID`,`empfullname`,`penaltydate`,`penaltydays`,`reason`) VALUES (?)';
//   db.query(q,[values],(err,data)=>{
//       if(err) return res.json(err)
//       return res.json(data)
//   })
// })

// app.get("/penaltyhistory/:id", (req, res) => {
//   const v = req.params.id;
//   const q = "SELECT * FROM penalty_register WHERE EmpID = ?";
//   db.query(q,[v],(err,data)=>{
//       if(err) return res.json(err)
//       return res.json(data)
//   })
// })

// app.get("/vacationhistory/:id", (req, res) => {
//   const v = req.params.id;
//   const q = "SELECT * FROM vacation_register WHERE EmpID = ?";
//   db.query(q,[v],(err,data)=>{
//       if(err) return res.json(err)
//       return res.json(data)
//   })
// })



// app.post("/vacationregister", (req, res) => {
//   const vv = req.body;
//   const values = [
//     vv.vacation.EmpID,
//     vv.vacation.empfullname,
//     vv.vacation.vacationstart,
//     vv.vacation.vacationend,
//     vv.vacation.comment
//   ];
//   console.log(values);
//   const q = 'INSERT INTO vacation_register (`EmpID`,`empfullname`,`vacationstart`,`vacationend`,`comment`) VALUES (?)';
//   db.query(q,[values],(err,data)=>{
//       if(err) return res.json(err)
//       return res.json(data)
//   })
// })

// Incident log API's

// app.post("/Incidentregister", (req, res) => {
//   const vv = req.body;
//   const values = [
//     vv.incident.EmpID,
//     vv.incident.employeename,
//     vv.incident.incidentdate,
//     vv.incident.inctype,
//     vv.incident.incidentcat,
//     vv.incident.actiontype,
//     vv.incident.days,
//     vv.incident.reportedby,
//     vv.incident.remark,
//   ];
//   console.log(values);
//   const q = 'INSERT INTO EmployeeIncidents (`EmpID`,`employeename`,`incidentdate`,`inctype`,`incidentcat`,`actiontype`,`days`,`reportedby`,`remark`) VALUES (?)';
//   db.query(q,[values],(err,data)=>{
//       if(err) return res.json(err)
//       return res.json(data)
//   })
// })

// app.get("/incidenthistory/:id", (req, res) => {
//   const v = req.params.id;
//   const q = "SELECT * FROM EmployeeIncidents WHERE EmpID = ?";
//   db.query(q,[v],(err,data)=>{
//       if(err) return res.json(err)
//       return res.json(data)
//   })
// })

// Asset Management

// app.post("/assetregister", (req, res) => {
//   const vv = req.body;
//   const values = [
//     vv.asset.assettype,
//     vv.asset.assetduration,
//     vv.asset.assetid,
//     vv.asset.assetname,
//     vv.asset.buydate,
//     vv.asset.vendor,
//     vv.asset.amount
//   ];
//   console.log(values);
//   const q = 'INSERT INTO assets (`assettype`,`assetduration`,`assetid`,`assetname`,`buydate`,`vendor`,`amount`) VALUES (?)';
//   db.query(q,[values],(err,data)=>{
//       if(err) return res.json(err)
//       return res.json(data)
//   })
// })

// app.get("/assetdata", (req, res) => {
//   const v = req.params.id;
//   const q = "SELECT * FROM assets";
//   db.query(q,[v],(err,data)=>{
//       if(err) return res.json(err)
//       return res.json(data)
//   })
// })
// app.get("/assetlog", (req, res) => {
//   const v = req.params.id;
//   const q = "SELECT * FROM assetslog";
//   db.query(q,[v],(err,data)=>{
//       if(err) return res.json(err)
//       return res.json(data)
//   })
// })

// app.get("/assetactions/:id", (req, res) => {
//   const v = req.params.id;
//   const q = "SELECT * FROM assets WHERE assetid = ?";
//   db.query(q,[v],(err,data)=>{
//       if(err) return res.json(err)
//       return res.json(data)
//   })
// })

// app.post("/assetlogs/:id", (req, res) => {
//   const vv = req.body;

//   const values = [
//     vv.assign.type,
//     vv.assign.assetid,
//     vv.assign.assetname,
//     vv.assign.assigndate,
//     vv.assign.assignto,
//     vv.assign.remark
//   ];
   
//   const insertQuery = `INSERT INTO assetslog (type, assetid, assetname, logdate, empid, remark)
//     VALUES (?, ?, ?, ?, ?, ?)`;

//   db.query(insertQuery, values, (err, result1) => {
//     if (err) return res.status(500).json({ error: "Insert failed", details: err });

//       const updateQuery = `UPDATE assets SET AssignedTo = ? WHERE assetid = ?`;

//     db.query(updateQuery, [vv.assign.assignto, vv.assign.assetid], (err, result2) => {
//       if (err) return res.status(500).json({ error: "Update failed", details: err });

//       return res.json({
//         message: "Insert and update successful",
//         insertResult: result1,
//         updateResult: result2
//       });
//     });
    
//     })})

    // Multer: store files in memory (no disk write)
// const uploading = multer({ storage: multer.memoryStorage() });

    // app.post("/damageasset", (req, res) => {

    //   const vv = req.body;

    //   const values = [
    //     vv.empID,
    //     vv.empfullname,
    //     vv.deductcat,
    //     vv.date,
    //     vv.dmginv,
    //     vv.amt,
    //     vv.remark
    //   ];
    //   try {
    //     db.query('SELECT status, deductMonth, empID FROM employee_payments', (err, data) => {
    //       if (err) {
    //         console.error("Database error:", err);
    //         return res.status(500).json({ error: "Database error" });
    //       }
      
    //       const isPaid = data.find(
    //         (e) => e.status === 'Paid' && e.deductMonth === 'Jan' && e.empID === '29019'
    //       );
      
    //       if (isPaid) {
    //         return res.json({ message: "Deduction already marked as paid" });
    //       }
      
    //       const values = [empID, empFullname, deductCat, date, dmgInv, amt, remark];
    //       const q = 'INSERT INTO emp_monthly_deduction (empID, empfullname, deductcat, date, dmginv, amt, remark) VALUES (?)';
      
    //       db.query(q, [values], (err, result) => {
    //         if (err) {
    //           console.error("Insert error:", err);
    //           return res.status(500).json({ error: "Insert error" });
    //         }
    //         return res.json({ message: "Deduction added successfully", result });
    //       });
    //     });
    //   } catch (err) {
    //     console.error("Unexpected error:", err);
    //     res.status(500).json({ error: "Unexpected error" });
    //   }
      
    // })
    

    // app.get("/damageassetdata", (req, res) => {
    //   const q = "SELECT * FROM emp_monthly_deduction";
    //   db.query(q,(err,data)=>{
    //       if(err) return res.json(err)
    //       return res.json(data)
    //   })
    // })
        

// salaryregister

// app.post("/salaryregister", (req, res) => {

//   const vv = req.body;

//   const values = [
//     vv.salary.month || null,
//     vv.salary.year || null,
//     vv.salary.empID || null,
//     vv.salary.empname || null,
//     vv.salary.presentdays || null,
//     vv.salary.offdays || null,
//     vv.salary.sickleave || null,
//     vv.salary.totalworkingdays || null,
//     vv.salary.grosssalary || null,
//     vv.salary.remark || null
//   ];
//   const q = 'INSERT INTO employee_payments (`month`,`year`,`empID`,`empname`,`presentdays`,`offdays`,`sickleave`,`totalworkingdays`,`grosssalary`,`remark`) VALUES (?)';
//   db.query(q,[values],(err,data)=>{
//       if(err) return res.json(err)
//       return res.json(data)
//   })
// })


// app.get("/employee/employeesaltable", (req, res) => {
//   const q = `SELECT 
// e.month,
// e.year,
//     e.empID,
//     e.empname,
//     e.presentdays,
//     e.offdays,
//     e.sickleave,
//     e.totalworkingdays,
//     e.grosssalary,
//     SUM(ed.amt) AS Deduction_Amount ,
//     e.grosssalary - IFNULL(SUM(ed.amt), 0) AS Netsalary,
//     e.status
// FROM employee_payments e
// left join emp_monthly_deduction ed ON e.empID = ed.empID
//  AND e.month = ed.deductMonth
// GROUP BY 
// e.month,
// e.year,
//     e.empID,
//     e.empname,
//     e.presentdays,
//     e.offdays,
//     e.sickleave,
//     e.totalworkingdays,
//     e.grosssalary,
//     e.status;`;
//   db.query(q,(err,data)=>{
//       if(err) return res.json(err)
//       return res.json(data)
//   })
// })

// app.get("/employee/empsaledit/:id/:month", (req, res) => {
//   const id = req.params.id;
//   const month = req.params.month;

//   const q = `SELECT 
//   e.month,
//   e.year,
//   e.empID,
//   e.empname,
//   e.presentdays,
//   e.offdays,
//   e.sickleave,
//   e.totalworkingdays,
//   e.grosssalary,
//   ed.deductCat,
//   SUM(ed.amt) AS Deduction_Amount
// FROM employee_payments e
// LEFT JOIN emp_monthly_deduction ed 
//   ON e.empID = ed.empID AND e.month = ed.deductMonth
// WHERE e.empID = ? AND e.month = ?
// GROUP BY 
//   e.month,
//   e.year,
//   e.empID,
//   e.empname,
//   e.presentdays,
//   e.offdays,
//   e.sickleave,
//   e.totalworkingdays,
//   e.grosssalary,
//   ed.deductCat;`;
//   db.query(q,[id,month],(err,data)=>{
//       if(err) return res.json(err)
//       return res.json(data)
//   })
// })

// app.put("/employee/empsalupdate/:ID", (req, res) => {
//   const vv = req.body;
//   const values = [
//       req.body.salary.month,
//       req.body.salary.year,
//       req.body.salary.empname,
//       req.body.salary.pdays,
//       req.body.salary.dayoff,
//       req.body.salary.sldays,
//       req.body.salary.wdays,
//       req.body.salary.paidamount,
//       req.body.salary.deductamount,
//       req.body.salary.finalpay,
//       req.body.salary.paymenttype,
//       req.body.salary.paymentstatus,
//       req.body.salary.paiddate,
//       req.body.salary.remark,
//       req.body.salary.empID,

//      ];
//   const q = `UPDATE EmployeePayments SET month = ?, year = ?, empname = ?, pdays = ?, dayoff = ?, sldays = ?, wdays = ?, paidamount = ?, deductamount = ?, finalpay = ?, paymenttype = ?, paymentstatus = ?, paiddate = ?, remark = ? WHERE empID = ?`;
//   db.query(q,values,(err,data)=>{
//       if(err) return res.json(err)
//       return res.json(data)
//   })
// })

// app.put("/updatesalded", async (req, res) => {
//   const empid = req.body.empID;
//   const month = req.body.month;
//   const q1 = `UPDATE emp_monthly_deduction SET status = 'Paid' WHERE empID = ? and deductMonth = ?`;
//   const q2 = `UPDATE employee_payments SET status = 'Paid' WHERE empID = ? and month = ?`;

//   try {
//     await db.promise().query(q1,[empid,month]);

//     await db.promise().query(q2,[empid,month]);

//     res.json({ message: 'Both tables updated successfully.' });

//   } catch (error) {
//     res.json(error)
//   }
// })


app.post('/invoices', (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

  const { invoice_number, customer_name, date, from_date, to_date, due_date, status, amount, items } = req.body;
  // Insert into invoices table
  const invoiceQuery = `
    INSERT INTO invoices 
    (invoice_number, customer_name, date, from_date, to_date, due_date, status, amount, paid_on,payment_account, company_id)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
  `;
  
  db.query(invoiceQuery, [
    invoice_number,
    customer_name,
    date,
    from_date,
    to_date,
    due_date,
    status,
    amount,
    null,
    null,
    company_id
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    const invoiceId = result.insertId;

    // Insert items into the invoice_items table
    const itemQuery = `
      INSERT INTO invoice_items (invoice_id, product, quantity, price, vat, total, company_id)
      VALUES ?
    `;
    const itemValues = items.map(item => [
      invoiceId, 
      item.product, 
      item.quantity, 
      item.price, 
      item.vat, 
      item.total, 
      company_id
    ]);

    db.query(itemQuery, [itemValues], (err2) => {
      if (err2) return res.status(500).json({ error: err2 });
      
      return res.json({ success: true, invoiceId });
    });
  });
});

    app.get("/get", (req, res) => {
      const email = req.headers.email;
      const role = req.headers.role;
      const company_id = req.headers.company_id;
      const token = req.headers.authorization.split(" ")[1];
      
      const q = `SELECT * FROM invoices where company_id = ${company_id} ORDER BY date DESC`;
      db.query(q,(err,data)=>{
          if(err) return res.json(err)
          return res.json(data)
      })
    })

// ✅ Get all invoices
// app.get('/get',(req, res) => {
//   try {
//     const [invoices] = db.query('SELECT * FROM invoices ORDER BY date DESC');
//     res.json(invoices);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch invoices' });
//   }
// });

// ✅ Get single invoice with items

app.get('/invoices/:id', (req, res) => {
  const company_id = parseInt(req.headers.company_id);
  const id = parseInt(req.params.id);
  const token = req.headers.authorization?.split(" ")[1] || null;


  // Combined SQL query
  const query = `SELECT * FROM invoices WHERE id = ? AND company_id = ?; SELECT * FROM invoice_items WHERE invoice_id = ? AND company_id = ?`;

  // Execute both queries in one go using callback
  db.query(query, [id, company_id, id, company_id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        error: "Database error",
        details: err.sqlMessage || err.message,
      });
    }

    // Extract results
    const invoice = results[0]?.[0]; // First SELECT, first row
    const items = results[1] || [];  // Second SELECT

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Return the invoice and its items
    res.json({ invoice, items });
  });
});



app.get('/ProfileData', async (req, res) => {
        const email = req.headers.email;
      const role = req.headers.role;
      const company_id = req.headers.company_id;
      const token = req.headers.authorization.split(" ")[1];
      
      const q = `SELECT * FROM company_profiles where company_id = ${company_id}`;
      db.query(q,(err,data)=>{
          if(err) return res.json(err)
          return res.json(data)
      })

});

// app.get('/invoices/:id', async (req, res) => {
//   try {
//     const [[invoice]] = await db.query('SELECT * FROM invoices WHERE id = ?', [req.params.id]);
//     const [items] = await db.query('SELECT * FROM invoice_items WHERE invoice_id = ?', [req.params.id]);
//     res.json({ invoice, items });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch invoice' });
//   }
// });

// ✅ Delete invoice
app.delete('/invoices/:id', (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization?.split(" ")[1];

  const query1 = `DELETE FROM invoice_items WHERE invoice_id = ? AND company_id = ?`;
  const query2 = `DELETE FROM invoices WHERE id = ? AND company_id = ?`;

  db.query(query1, [req.params.id, company_id], (err1, result1) => {
    if (err1) {
      console.error('Error deleting invoice items:', err1);
      return res.status(500).json({ error: 'Failed to delete invoice items' });
    }

    db.query(query2, [req.params.id, company_id], (err2, result2) => {
      if (err2) {
        console.error('Error deleting invoice:', err2);
        return res.status(500).json({ error: 'Failed to delete invoice' });
      }

      res.json({
        success: true,
        deletedInvoiceItems: result1.affectedRows,
        deletedInvoice: result2.affectedRows
      });
    });
  });
})

app.put('/invoices/:id', (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

  const {
    invoice_number,
    customer_name,
    date,
    from_date,
    to_date,
    due_date,
    status,
    vat_percent,
    amount,
    paid_on,
    payment_account,
  } = req.body;

  const invoiceId = req.params.id;
console.log(req.body)
  const updateInvoiceQuery = `
    UPDATE invoices SET 
      invoice_number = ?, customer_name = ?, date = ?, from_date = ?, to_date = ?, due_date = ?, 
      status = ?, amount = ?, paid_on = ?, payment_account = ?
    WHERE id = ? and company_id = ${company_id}
  `;

  db.query(updateInvoiceQuery, [
    invoice_number,
    customer_name,
    date,
    from_date,
    to_date,
    due_date,
    status,
    amount,
    paid_on,
    payment_account,
    invoiceId
  ], (err) => {
    if (err) return res.status(500).json({ error: err });

    // Optionally update items...
    return res.json({ success: true });
  });
});

// Starting New updated expense module -sufi

// API to add expense
app.post('/api/expenses', (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

  const { bill, items } = req.body;
  const billSql = `
    INSERT INTO expense_bills (pl_date, vendor, reference, exp_cat, for_whom, company_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const billValues = [
    bill.plDate,
    bill.vendor,
    bill.reference,
    bill.expcat,
    bill.forWhom,
    company_id
  ];

  db.query(billSql, billValues, (err, result) => {
    if (err) return res.status(500).send(err);
    const billId = result.insertId;

    const itemSql = `
      INSERT INTO expense_items 
      (bill_id, EmpID, category, amount, vat, bank, act_paydate, deduct_from_employee, salary_month, year, status,company_id)
      VALUES ?
    `;
    
    const itemValues = items.map(item => [
      billId,
      item.EmpID || null,
      item.category,
      item.amount,
      item.vat,
      item.bank || null,
      item.actpaydate,
      item.deduct || false,
      item.deduct ? item.salaryMonth : null,
      item.deduct ? item.year : null,
      item.deduct ? item.status : null,
      company_id
    ]);
    db.query(itemSql, [itemValues], (err2) => {
      if (err2) return res.status(500).send(err2);
      res.status(201).send({ message: 'Expense saved' });
    });
  });
});

// expense table with edit options

// Get all expenses (join expense_bills and expense_items)
app.get('/api/expenses', (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

  const query = ` SELECT 
    eb.id,
    eb.exp_cat,
    ei.category AS Sub_Cat,
    SUM(ei.amount) AS Deduct_Amount,
    SUM(ei.vat) AS VAT,
    SUM(ei.amount) + SUM(ei.vat) AS Total
FROM expense_bills eb
LEFT JOIN expense_items ei ON eb.id = ei.bill_id
where eb.company_id = ${company_id} and ei.company_id = ${company_id}
GROUP BY 
    eb.id,
    eb.exp_cat,
    ei.category;
  `;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch expenses' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Get an expense by ID with JOIN (single query)
// Get an expense by ID (Simple and clean)
app.get('/api/expenses/:id', (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

  const expenseId = req.params.id;

  // 1. Query to get the expense bill
  const billQuery = `SELECT * FROM expense_bills WHERE id = ? and company_id = ${company_id}`;
  
  db.query(billQuery, [expenseId], (err, billResults) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch expense bill' });
    }

    if (billResults.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // 2. If bill found, get its line items
    const itemsQuery = `SELECT * FROM expense_items WHERE bill_id = ? and company_id = ${company_id}`;
    db.query(itemsQuery, [expenseId], (err, itemResults) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch expense items' });
      }

      res.status(200).json({
        bill: billResults[0],
        items: itemResults,
      });
    });
  });
});

// PUT Update Expense
// -------------------------------
app.put('/api/expenses/:id', (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

  const expenseId = req.params.id;
  const { bill, items } = req.body;
  // 1. Update the expense bill
  const updateBillQuery = `
    UPDATE expense_bills
    SET pl_date = ?, vendor = ?, reference = ?, exp_cat = ?,for_whom = ?
    WHERE id = ? and company_id = ${company_id}
  `;
  const billValues = [
    bill.plDate,
    bill.vendor,
    bill.reference,
    bill.expcat,
    bill.forWhom || null,
    expenseId,
  ];

  db.query(updateBillQuery, billValues, (err, result) => {
    if (err) {
      console.error('Failed to update expense bill:', err);
      return res.status(500).json({ error: 'Error updating bill' });
    }

    // 2. Delete old items first
    const deleteQuery = `DELETE FROM expense_items WHERE bill_id = ? and company_id = ${company_id}`;
    db.query(deleteQuery, [expenseId], (err) => {
      if (err) {
        console.error('Failed to delete existing items:', err);
        return res.status(500).json({ error: 'Error deleting old items' });
      }

      // 3. Insert each item using a loop (one by one)
      const insertItemQuery = `
        INSERT INTO expense_items
        (bill_id, EmpID,category, amount, vat, bank, act_paydate,deduct_from_employee, salary_month, year, status,company_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)
      `;

      const insertNext = (index) => {
        if (index >= items.length) {
          return res.status(200).json({ message: 'Expense and items updated successfully' });
        }

        const item = items[index];
        const values = [
          expenseId,
          item.EmpID,
          item.category,
          item.amount,
          item.vat || 0,
          item.bank || '',
          item.actpaydate || '',
          item.deduct ? 1 : 0,
          item.deduct ? item.salaryMonth : null,
          item.deduct ? item.year : null,
          item.deduct ? item.status : null,
          company_id
        ];

        db.query(insertItemQuery, values, (err) => {
          if (err) {
            console.error('Failed to insert item:', err);
            return res.status(500).json({ error: 'Error inserting line item' });
          }
          insertNext(index + 1); // Continue to next item
        });
      };

      if (items.length > 0) {
        insertNext(0); // Start inserting
      } else {
        res.status(200).json({ message: 'Expense updated (no items)' });
      }
    });
  });
});
   

// Update an expense (expense_bills and optionally expense_items)
app.get('/api/expenses/:id', (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

  const expenseId = req.params.id;

  // 1. Query to get the expense bill
  const billQuery = `SELECT * FROM expense_bills WHERE id = ? and company_id = ${company_id}`;
  
  db.query(billQuery, [expenseId], (err, billResults) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch expense bill' });
    }

    if (billResults.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // 2. If bill found, get its line items
    const itemsQuery = `SELECT * FROM expense_items WHERE bill_id = ? and company_id = ${company_id}`;
    db.query(itemsQuery, [expenseId], (err, itemResults) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch expense items' });
      }

      res.status(200).json({
        bill: billResults[0],
        items: itemResults,
      });
    });
  });
});

// Delete an expense (expense_bills and related expense_items)
app.delete('/api/expenses/:id', (req, res) => {
  const email = req.headers.email;
  const role = req.headers.role;
  const company_id = req.headers.company_id;
  const token = req.headers.authorization.split(" ")[1];

  const { id } = req.params;


  // First delete items in expense_items that are associated with this bill
  const deleteItemsQuery = `DELETE FROM expense_items WHERE bill_id = ? and company_id = ${company_id}`;
  db.query(deleteItemsQuery, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Failed to delete expense items' });
      return;
    }

    // Then delete the expense bill itself
    const deleteBillQuery = `DELETE FROM expense_bills WHERE id = ? and company_id = ${company_id}`;
    db.query(deleteBillQuery, [id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Failed to delete expense bill' });
      } else {
        res.status(200).json({ message: 'Expense deleted successfully' });
      }
    });
  });
});









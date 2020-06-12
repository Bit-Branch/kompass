var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "kompass"
  });
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  })
  var sql = "INSERT INTO kompass.companies(title,address,fax,companystatus,companyyear,form,activity,officeEmployees,companyEmployees,kompassID) VALUES ?";
    console.log(values)
    con.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    })

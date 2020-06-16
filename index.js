var needle = require('needle');
var cheerio = require('cheerio');
var mysql = require('mysql');

//const searchUrl = 'https://by.kompass.com/c/%D1%83%D0%BD%D0%B8%D0%B2%D0%B5%D1%80%D1%81%D0%B0%D0%BB-%D0%B0%D0%B2%D1%82%D0%BE-%D0%BE%D0%B4%D0%BE/by062627/';
const URL = 'https://by.kompass.com/'
const companies = []
var sql = "INSERT INTO companies(title,address,fax,companystatus,companyyear,form,activity,officeEmployees,companyEmployees,kompassID) VALUES (?,?,?,?,?,?,?,?,?,?)";

needle.defaults({ open_timeout: 60000 })

var con = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "kompass"
});

class Company {
  constructor(title,
    address,
    fax,
    status,
    year,
    form,
    activity,
    officeEmployees,
    companyEmployees,
    kompassID,
    site) {
    this.title = title;
    this.address = address;
    this.fax = fax;
    this.status = status;
    this.year = year;
    this.form = form;
    this.activity = activity;
    this.officeEmployees = officeEmployees;
    this.companyEmployees = companyEmployees;
    this.kompassID = kompassID;
    this.site = site;
  }

  outputInfo() {
    console.log('title: ' + this.title + '\n' +
    'address: ' + this.address + '\n' +
    'fax: ' + this.fax + '\n' +
    'status: ' + this.status + '\n' +
    'year: ' + this.year + '\n' +
    'form: ' + this.form + '\n' +
    'activity: ' + this.activity + '\n' +
    'officeEmployees: ' + this.officeEmployees + '\n' +
    'companyEmployees: ' + this.companyEmployees + '\n' +
    'kompassID: ' + this.kompassID + '\n' +
    'site: ' + this.site + '\n'
    );
  }
};

function getCompany(searchUrl) {
  needle.get(searchUrl, function(err, res){
    if (err) throw err;
        const $ = cheerio.load(res.body);
        const title = $('#productDetailUpdateable > div.container.containerCompany > div.headerCompany.containerWhite > div > div.companyCol1.companyColumn > div.companyRow > div.companyCol1.blockNameCompany').children('h1').text().trim();
  
        const address = $('.spRight').children('span').text().trim().replace(/\s{2,}/g, ' ') + $('.spRight').text().trim().replace(/\s{2,}/g, ' ');
        const fax = $('.faxNumber').text().trim();

        const urInfo = [];

        $('#productDetailUpdateable > div.container.containerCompany > div.row.row10.companyRow > div:nth-child(2) > div > div > table > tbody > tr').each(function(i, element) {
            urInfo.push($(this).children('td').text().trim());
        });

        const status = urInfo[0];
        const year = urInfo[1];
        const form = urInfo[2];
        const activity = urInfo[3];
        const officeEmployees = urInfo[4];
        const companyEmployees = urInfo[5];
        const kompassID = urInfo[6];

        if(title != ""){
        companies.push(new Company(title,address,fax,status,year,form,activity,officeEmployees,companyEmployees,kompassID,searchUrl).outputInfo());
        //compvalues.push([title,address,fax,status,year,form,activity,officeEmployees,companyEmployees,kompassID,searchUrl]);
        con.getConnection(function(err, connection) {
          connection.query(sql, [title,address,fax,status,year,form,activity,officeEmployees,companyEmployees,kompassID], function (err, result) {
            if (err) throw err;
          })
          connection.release();
          });
      }
      });
  }

  function getCompanies(regionURL){
    needle.get(regionURL, function(err, res){
      if (err) throw err;
          const $ = cheerio.load(res.body);
        $('#resultatDivId > div[class="prod_list "] > div').each(function(i, element) {
          getCompany(encodeURI($(this).children('h2').find('a').attr('href')));
      });
      }); 
  }

  

  function getRegions(){
    con.getConnection(function(err,connection) {
      if (err) throw err;
      console.log("Connected!");
    })
    needle.get(URL, function(err, res){
      if (err) throw err;
          const $ = cheerio.load(res.body);
        $('#regions > div > div > ul > li').each(function(i, element) {
          console.log('//////////////////////////////' + encodeURI('https://by.kompass.com' + $(this).find('a').attr('href')));
          for(let j = 1; j < 20;j++){
          getCompanies(encodeURI('https://by.kompass.com' + $(this).find('a').attr('href') + 'page-' + j + '/'));
          } 
      });
      }); 
  }


getRegions()








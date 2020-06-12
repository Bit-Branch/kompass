const fetch = require('node-fetch');
const cheerio = require('cheerio');
var mysql = require('mysql');

//const searchUrl = 'https://by.kompass.com/c/%D1%83%D0%BD%D0%B8%D0%B2%D0%B5%D1%80%D1%81%D0%B0%D0%BB-%D0%B0%D0%B2%D1%82%D0%BE-%D0%BE%D0%B4%D0%BE/by062627/';
const URL = 'https://by.kompass.com/r/%D0%BC%D0%B8%D0%BD%D1%81%D0%BA%D0%B0%D1%8F-%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C/by_bymi/'
const companies = []
var values = []


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
    kompassID) {
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
    'kompassID: ' + this.kompassID + '\n'
    );
  }
};

function getCompany(searchUrl) {
    return fetch(`${searchUrl}`)
      .then(response => response.text())
      .then(body => {
        const $ = cheerio.load(body);
        const title = $('.blockNameCompany').children('h1').text().trim();
  
        const address = $('.spRight').children('span').text().trim() + $('.spRight').text().trim();
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

        companies.push(new Company(title,address,fax,status,year,form,activity,officeEmployees,companyEmployees,kompassID).outputInfo());
        values.push([title,address,fax,status,year,form,activity,officeEmployees,companyEmployees,kompassID]);
        
      });
  }

  function getCompanies(){
    return fetch(`${URL}`)
      .then(response => response.text())
      .then(body => {
        const $ = cheerio.load(body);
        $('.prod_list').each(function(i, element) {
          getCompany(encodeURI($(this).find('a').attr('href')));
      });
      }); 
  }

  function allC(){
    getCompanies();
    console.log(values)
  }

allC()







var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();


app.use(bodyParser.urlencoded({extended: true}));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "vacanties",
  password : '8337'
});

var URL = 'https://by.kompass.com/';
var results = [];

class Vacante {
  constructor(name, place, description) {
    this.name = name;
    this.place = place;
    this.description = description;
  }

  outputInfo() {
    console.log(this.name + '\n' + this.place + '\n' + this.description + '\n\n');
  }
};

var q = tress(function(url, callback){
    needle.get(url, function(err, res){
        if (err) throw err;

        // парсим DOM
        var $ = cheerio.load(res.body);

        //информация о новости
      //  if($('.b_infopost').contents().eq(2).text().trim().slice(0, -1) === 'Алексей Козлов'){
      //      results.push({
      //          title: $('h1').text(),
      //          date: $('.b_infopost>.date').text(),
       //         href: url,
       //         size: $('.newsbody').text().length
       //     });
       // }

        //список новостей
        $('.seoContent').each(function() {
          //  q.push($(this).children('h2').children('a').text());
        //  console.log($(this).children('h2').children('a').text());
        var c = URL.href;

		URL.href = $(this).value;
		console.log(URL.getElementsByTagName('td').text());

		URL.href = c;
       // results.push(new Vacante(
       // 	$(this).children('h2').children('a').text(),
       // 	$(this).children('h4').children('span').children('a').text(),
       // 	$(this).children('p').text()
       // 	)
       // 	);
        });




        //паджинатор
    //    $('.bpr_next>a').each(function() {
    //       // не забываем привести относительный адрес ссылки к абсолютному
     //       q.push(resolve(URL, $(this).attr('href')));
    //    });

        callback();
    });
}, 10); // запускаем 10 параллельных потоков

//q.drain = function(){
//    fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));
//}

q.push(URL);



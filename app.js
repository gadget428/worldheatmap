var app = require('express')();
var http = require('http').createServer(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/dat.json', function(req, res) {
    res.sendFile(__dirname + '/public/dat.json');
});
app.get('/datProv.json', function(req, res) {
    res.sendFile(__dirname + '/public/datProv.json');
});
app.get('/canadaMap', function(req, res) {
    res.sendFile(__dirname + '/public/canadaMap.html');
});




http.listen(process.env.PORT || 8888, function() {
    console.log('listening on *:8888');
});


let countries = ["U.S", "Canada", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua &amp; Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia &amp; Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre &amp; Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts &amp; Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad &amp; Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks &amp; Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];
let provinces = ["Ontario", "Nova", "B.C", "Quebec", "Alberta"];


const fs = require('fs');

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Bullmeza:password@cluster0-k94hv.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    let allData = "";
    let allDataProv = "";
    for (let i = 0; i < countries.length; i++) {
        let line = '{"Country":' + '"' + countries[i] + '",';
        client.db("HeatMap").collection(countries[i]).find().limit(100).toArray()
            .then((result) => {
                let html = '<body style = "font-size:25px; text-align: center;">'
                html += "<h1>" + countries[i] + "</h1>";
                for (var x = 0; x < result.length; x++) {
                    html += '<a href = "' + result[x]["URL"] + '">';
                    html += result[x]["Headline"]
                    html += '</a>';
                    html += "<br>";
                }
                html += "</body>"
                console.log(html);
                fs.writeFileSync('public/' + countries[i] + ".html", html);
                app.get('/' + countries[i], function(req, res) {
                    res.sendFile(__dirname + '/public/' + countries[i] + ".html");
                });
                allData = allData.concat(line + '"Articles":' + result.length + '},')
                    // console.log(allData);
                fs.writeFileSync('public/dat.json', '{"dat": [' + allData.substring(0, allData.length - 1) + "]}");
            }).catch((e) => {
                console.log(e);
            });

    }
    for (let i = 0; i < provinces.length; i++) {
        let lineProv = '{"Province":' + '"' + provinces[i] + '",';
        client.db("HeatMap").collection(provinces[i]).find().limit(500).toArray()
            .then((result) => {
                allDataProv = allDataProv.concat(lineProv + '"Articles":' + result.length + '},')
                console.log(allDataProv);
                fs.writeFileSync('public/datProv.json', '{"datProv": [' + allDataProv.substring(0, allDataProv.length - 1) + "]}");
            }).catch((e) => {
                console.log(e);
            });
    }
});

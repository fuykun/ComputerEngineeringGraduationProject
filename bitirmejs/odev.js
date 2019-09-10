var express = require('express');
var app = express();
var sunucu = app.listen('8080');
var io = require('socket.io')(sunucu); //socket
var path = require('path');

class SendDataofFront { //Önyüze yollanacak verilerin düzenli hale getirilmesi
    constructor(enterPeopleCount, quitPeopleCount, dataArray) {
        this.enterPeopleCount = enterPeopleCount;
        this.quitPeopleCount = quitPeopleCount;
        this.dataArray = dataArray;
    }
}

var myTopicName = "outTopic";

/*MQTT SETUP*/
var mqtt = require("mqtt");
var client = mqtt.connect('mqtt://localhost:1883');
client.on('connect', () => {
    console.log("mqtt bağlandı");
});
client.subscribe(myTopicName); //myTopicName="outTopic"

var minTemp = 26; //Minimum canlı sıcaklığı
var minSquare = 7; //Algılanacak minimum kare değeri
var dataArray = []; //Sıcaklık verileri
var counter = 0; //Sayaç
var enteringProcessStart = false; //Giriş işlemi başladı
var quitingProcessStart = false; //Çıkış işlemi başladı
var transitionStart = false; //Herhangi bir geçiş işlemi başladı

var enterPeopleCount = 0; //Giren Kişi Sayısı
var quitPeopleCount = 0; //Çıkan Kişi Sayısı


client.on('message', function(topic, message) {
    if (topic != myTopicName) return; //İlgilenmediğimiz konu başlığıyla mesaj gelirse direk döngüyü geçiyoruz.

    var datas = message.toString().split('|');
    for (var i = 0; i < 64; i++) {
        var msg = datas[i];
        var x = counter % 8;
        var y = Math.floor(counter / 8);
        var heat = parseFloat(msg);
        dataArray.push({ x: x, y: y, heat: heat });
        counter++;
    }

    var enterValues = new Array();
    var quitValues = new Array();

    for (var i = 0; i <= 31; i++) {
        enterValues[i] = dataArray[i]; //8x8 matrisin üstten 4x4'lük kısmını alıyoruz
    }

    for (var i = 31; i <= 63; i++) {
        quitValues[i] = dataArray[i]; //8x8 matrisin alttan 4x4'lük kısmını alıyoruz
    }

    if (enterValues != null) {
        var enteringDatas = enterValues.filter(function(data) {
            return data.heat > minTemp; //üst kısımda ki sıcaklık değerleri belirlediğimiz limitin üstünde mi kontrolü yapıyoruz
        });
    }

    if (quitValues != null) {
        var quitingDatas = quitValues.filter(function(data) {
            return data.heat > minTemp; //alt kısımda ki sıcaklık değerleri belirlediğimiz limitin üstünde mi kontrolü yapıyoruz
        });
    }

    if (transitionStart == false) {
        if (enteringDatas.length >= minSquare) { //eğer üstteki verilerde canlı tespiti yapılırsa giriş işlemi başladı diyoruz.
            enteringProcessStart = true;
            transitionStart = true;
        } else if (quitingDatas.length >= minSquare) { //eğer akttaki verilerde canlı tespiti yapılırsa çıkış işlemi başladı diyoruz.
            quitingProcessStart = true;
            transitionStart = true;
        }
    }

    if (transitionStart == true) {
        var alLDatas = dataArray.filter(function(data) {
            return data.heat > minTemp;
        });

        if (alLDatas.length < minSquare) { //ekranda canlı varlık var mı? kontrolü yapıyoruz. eğer yoksa giren veya çıkan kişi sayısını arttırıyoruz
            if (enteringProcessStart) {
                enterPeopleCount++;
                enteringProcessStart = false;
            } else if (quitingProcessStart) {
                quitPeopleCount++;
                quitingProcessStart = false;
            }
            transitionStart = false;
        }
    }

    var response1 = new SendDataofFront(enterPeopleCount, quitPeopleCount, dataArray);
    io.emit("message", response1); //Önyüze veri gönderimi
    dataArray = [];
    counter = 0;

});



app.get('/src/audio/beep.wav', function(req, res) {
    res.sendFile(path.join(__dirname + '/src/audio/beep.wav'));
});
app.get('/src/jquery.min.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/src/jquery.min.js'));
});
app.get('/src/dark_blue.min.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/src/dark_blue.min.js'));
});
app.get('/src/anychart-core.min.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/src/anychart-core.min.js'));
});
app.get('/src/anychart-heatmap.min.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/src/anychart-heatmap.min.js'));
});
app.get("/Index.html", function(request, response) {
    response.sendFile(path.join(__dirname + "/Index.html"));
});
console.log("Sunucu aktiftir.");
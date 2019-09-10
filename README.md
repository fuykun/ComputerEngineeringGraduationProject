# Bilgisayar Mühendisliği Bitirme Projesi

KONU: IOT
<br>
PROJE ADI: Kızılötesi Sensör ile Canlı Varlık Tespiti ve Uygulaması
<br>
DONANIMLAR: Nodemcu, AMG8833 IR Sensor
<br>
TEKNOLOJİLER: Arduino, Node.js, C#, MQTT, Web Sockets, Javascript

<hr>

AMG8833 üzerinden alınan 8x8 tipinde ki sıcaklık değerleri, C# yardımıyla oluşturduğumuz MQTT Server'a iletildi. MQTT Server'daki veriler, Node.js ile alınarak veri analizi yapıldı.
Sıcaklık değerlerine göre, sensörün görüş açısında ki nesnenin canlı olup olmadığı kontrolü yapıldı.
Analiz sonucu, Socket.io yardımı ile bir HTML sayfaya döndürülüp, buradan javascript ile alınarak Heatmap.js ile asenkron ve canlı olarak görselize edildi.

<hr>
<a href="https://imgbb.com/"><img src="https://i.ibb.co/RBcNKCM/amg8851.jpg" alt="amg8851" border="0"></a>
<br>
<a href="https://imgbb.com/"><img src="https://i.ibb.co/XDLVTyS/mqtt.jpg" alt="mqtt" border="0"></a><br />
<br>
<a href="https://imgbb.com/"><img src="https://i.ibb.co/VNP58F7/Screenshot-1.png" alt="Screenshot-1" border="0"></a>
<br>


<a href="https://ibb.co/vsNX8fw"><img src="https://i.ibb.co/bH4bnYW/uygulamafotosu1.png" alt="uygulamafotosu1" border="0" /></a>

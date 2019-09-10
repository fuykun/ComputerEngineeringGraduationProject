
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_AMG88xx.h>

Adafruit_AMG88xx amg;
float pixels[AMG88xx_PIXEL_ARRAY_SIZE];


const char* ssid = "Javascript";
const char* password = "gomis1905";
const char* mqtt_server = "192.168.1.101"; //localIP

//const char* ssid = "Furkan iPhone";
//const char* password = "winyoung";
//const char* mqtt_server = "172.20.10.3"; //localIP

WiFiClient espClient;
PubSubClient client(espClient); //mqtt bağlantısı için
long lastMsg = 0;
char msg[200];
int value = 0;

void setup_amg() {
  bool status;
  // default settings
  status = amg.begin();
  if (!status) {
    Serial.println("Geçerli bir AMG88xx sensörü bulunamadı, bağlantınızı kontrol edin!");
    while (1);
  }
}

void setup_wifi() {
  delay(100);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  randomSeed(micros());
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void setup_mqtt() {
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish("outTopic", "hello world");
      // ... and resubscribe
      client.subscribe("inTopic");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {

  Serial.begin(9600);
  setup_wifi(); //Wi-Fi bağlantısı
  setup_amg(); //Amg8833 sensörü bağlantısı
  setup_mqtt(); //MQTT server bağlantısı
}

void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  amg.readPixels(pixels);

  static char outstr[6];

  client.beginPublish("outTopic", 384, false);
  for (int i = 1; i <= AMG88xx_PIXEL_ARRAY_SIZE; i++) {
    dtostrf(pixels[i - 1], 4, 2, outstr);
    client.print(outstr);
    client.print("|");
  }
  client.endPublish();
  delay(200);
}

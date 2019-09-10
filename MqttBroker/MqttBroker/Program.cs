using MQTTnet.Core.Server;
using System;
using MQTTnet;
using System.Text;

namespace MqttBroker
{
    class Program
    {
        static void Main(string[] args)
        {
            //MqttNet https://github.com/chkr1011/MQTTnet
            var options = new MqttServerOptions();
            int port = new MqttServerOptions().GetDefaultEndpointPort();
            Console.WriteLine("Port: " + port);
            var server = new MqttFactory().CreateMqttServer();
            server.ApplicationMessageReceived += (s, e) =>
        {
            Mqtt cs = new Mqtt()
            {
                Dt = DateTime.Now,
                Konu = e.ApplicationMessage.Topic,
                Mesaj = Encoding.UTF8.GetString(e.ApplicationMessage.Payload),
                Retain = e.ApplicationMessage.Retain,
                obje = e.ApplicationMessage.Payload
            };
            switch (e.ApplicationMessage.QualityOfServiceLevel)
            {
                case MQTTnet.Core.Protocol.MqttQualityOfServiceLevel.AtMostOnce:
                    cs.ServisKalitesi = 0;
                    break;
                case MQTTnet.Core.Protocol.MqttQualityOfServiceLevel.AtLeastOnce:
                    cs.ServisKalitesi = 1;
                    break;
                case MQTTnet.Core.Protocol.MqttQualityOfServiceLevel.ExactlyOnce:
                    cs.ServisKalitesi = 2;
                    break;
                default:
                    break;
            }
            try
            {
                //MqttVt vt = new MqttVt();
                //vt.Ekle(cs);
                Console.WriteLine("### Mesaj alındı ###");
                Console.WriteLine($"+ Konu = {cs.Konu}");
                Console.WriteLine($"+ Mesaj = {cs.Mesaj}");
                Console.WriteLine($"+ Tarih = {cs.Dt}");
                Console.WriteLine($"+ Servis = {cs.ServisKalitesi}");
                Console.WriteLine($"+ Retain = {cs.Retain}");
                Console.WriteLine($"+ obje = {cs.obje}");
                Console.WriteLine();
            }
            catch (Exception ex)
            {
                Console.WriteLine("### HATA OLUSTU ###");
                Console.WriteLine("hata: " + ex.Message);
                throw;
            }
        };
            server.StartAsync(options);
            Console.WriteLine("Press any key to exit.");
            Console.ReadLine();
            server.StopAsync();
        }
    }
    internal class Mqtt
    {
        public int ID { get; set; }
        public object obje { get; set; }
        /// <summary>
        /// Verinin sunucuya ulaştığı zaman
        /// </summary>
        public DateTime Dt { get; set; }
        /// <summary>
        /// Client(Arduino) tan gelen veri, bilgi ve ya mesaj
        /// </summary>
        public string Mesaj { get; set; }
        /// <summary>
        /// Clienttan gelen mesajın konusu (Topic)
        /// </summary>
        public string Konu { get; set; }
        /// <summary>
        /// Mesaj teslim kalitesi
        /// </summary>
        public int ServisKalitesi { get; set; }
        /// <summary>
        /// Gelen mesajın saklanması.
        /// </summary>
        public bool Retain { get; set; }
    }
}
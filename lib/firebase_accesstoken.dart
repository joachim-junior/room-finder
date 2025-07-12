import 'package:googleapis_auth/auth_io.dart';

import 'Api/config.dart';

class FirebaseAccesstoken {
  static String firebaseMessageScope =
      "https://www.googleapis.com/auth/firebase.messaging";

  Future<String> getAccessToken() async {
    final credentials = ServiceAccountCredentials.fromJson({
      "type": "service_account",
      "project_id": "roomfinder-237",
      "private_key_id": "32a99885a680554d1073270b61e913f63016d407",
      "private_key":
          "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDStHQiaiOyorsJ\n7NKZ0azlN9Gq2eQ12DBxrY5prjWsrNAZhDwhbKpgkneMxG6lsu2uRcyjvLkNhYyH\nNA62q9Cn6mgu+dtH8tC8EDA/2iNv/DsLza1G7C3cJ4qjsvHAl9seW5gaO5duSWxo\n+/wJWEoFaeGEdiL1lMh9Vi2OXDJe5BjnS2bZTUWIGf0yw8IUXUMa7kmrfSFDTSJS\nuWa0IHCLAnE/hLZvftODS7BqZXf1OB08qhbvcdScT18aAkErR5YSYtswaFb0LVFh\nkwa7VrXmkdG8KxDnBHkGHH78Z9HoEAUdNNdZUS01ABenc3Eg39br/sGrAXq+LIlg\nPJjlpEIZAgMBAAECggEAAPCdoiZJRe6d7QAQK9GCisDit3Ed+spqAiVVKHQrT3ub\nJo/kslh5I/NC7iRt8KQd/PNrZqqVH74vuxEYs/GwPYgWGG+lJ8epo8c3/owpQ2D9\ndaEmkcli8o5I1nRpaCm7WQH5kQsnCD3miNFOqAYQGQnq7xr25hPDRQxWbJ1lsftZ\no4zTRngROKAkdbcGCz2u1B8mfTVqDrPoa22CrcBEZsTOFVK4VYlkPmjG00vI/9dT\ngyXw/E/aK6Xf20NH59WFr2jn2MnE2W0IwLViUG+MFnTIHfdyQhDexMs2o64sgerx\nEHUWfT/IkNOnsXJcesmlm+wwvOWV52ymPD2HcgMqoQKBgQD0JPchuj/RBBwdS+SJ\n1Nh6Whu/BszI/PhHd56jRTZh09qPzSR+Hrzg3hDlFVkjK0OztQtKlpu0Xuex+rzt\neGK5qipbZ3g7FHp8sVaerhixdxs3ez589dd5nMxdzaiwekpVHa3FaVXS+wVslkU+\nOHxp9RUpYZIBOfGpInvxtOB1UQKBgQDc78qg/0/HCSFxJjzOH0Drvi68E2PlirzU\nA+Uo+G65e5CB9XDgYy2z0BFb5rW8JMrKIHdulYvNd6Z4jh8pFgtSXszzryERb1FZ\nXsr5180mLWFwU6zCUkjR9kAE9kh1MdU3GOICjshcRFtEY2Tzkn4UCGdP4j1EMhwB\nBPIvZRpuSQKBgQDB1ouD8rzyNWIg/H2B1UTet6Yp37s9pGN3UojYNn5741k3LPfZ\nToxFuOoPCAkSfCovhwFlAfizl1o7m8jefeNcZ7djhN4XgiXR1HbiW3VtiRRJ04cE\nbafbfVtg6oURQLa9p2etQfmLHhPrZ8+oG+7jrVtU1Iu4f4nX8HIZsLM5UQKBgQCg\nQkfm9Is3wsXBP41Hrp/24GMiBaamsDY8S/8D8wDOBnVR72lLOmXCUqDk2rrkmIOI\njnhTfKKGDc5xEBZGRTk9LIraECSacva9Ludox0KF+ND/G5Lq+ajctBTIBKWWbOlO\nJ/x5An0PgH37Y2Ws0Iwnl9jotyDdwMNTcfUCsAG2EQKBgQCa4NiWlTMrf2ERLFfE\nxolos0HNuVc1iUDijVkMyTufqUTCBnzxjOfJUYQOP+NOAKQURhBl+Dzy8KmLjoy+\nVlQiVURzOPFbh/rleKhLHa8WaYwfx0C+1HhS+tdQGz/s0w7Xvc+ZMTy9kRWD3znt\nWmCEcKe7FkgQEoUvBgNxXFbJgQ==\n-----END PRIVATE KEY-----\n",
      "client_email":
          "firebase-adminsdk-fbsvc@roomfinder-237.iam.gserviceaccount.com",
      "client_id": "116397250797266040557",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url":
          "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url":
          "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40roomfinder-237.iam.gserviceaccount.com",
      "universe_domain": "googleapis.com"
    });

    final client =
        await clientViaServiceAccount(credentials, [firebaseMessageScope]);

    final accessToken = client.credentials.accessToken.data;
    Config.firebaseKey = accessToken;
    print("+++++++++++++++++:---- ${Config.firebaseKey}");
    return accessToken;
  }
}

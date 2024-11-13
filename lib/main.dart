import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:goproperti/firebase/auth_service.dart';
import 'package:goproperti/firebase/chat_screen.dart';
import 'package:goproperti/model/routes_helper.dart';
import 'package:goproperti/screen/home_screen.dart';
import 'package:goproperti/screen/splesh_screen.dart';
import 'package:goproperti/utils/Dark_lightmode.dart';
import 'package:goproperti/utils/localstring.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:provider/provider.dart';
import 'helpar/get_di.dart' as di;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  await Permission.storage.request();
  await Permission.phone.request();
  await getLocation();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  requestPermission();
  listenFCM();
  loadFCM();
  initializeNotifications();

  await GetStorage.init();
  await di.init();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ColorNotifire()),
        ChangeNotifierProvider(create: (_) => AuthService()),
      ],
      child: GetMaterialApp(
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
            splashColor: Colors.transparent,
            hoverColor: Colors.transparent,
            highlightColor: Colors.transparent,
            dividerColor: Colors.transparent,
            primaryColor: const Color(0xff3D5BF6),
            useMaterial3: false,
            fontFamily: "Gilroy"),
        initialRoute: Routes.initial,
        translations: LocaleString(),
        locale: const Locale('en_US', 'en_US'),
        getPages: getPages,
      ),
    );
  }
}

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {}

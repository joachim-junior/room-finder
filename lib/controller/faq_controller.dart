// ignore_for_file: avoid_print, prefer_interpolation_to_compose_strings

import 'dart:convert';

import 'package:get/get_state_manager/get_state_manager.dart';
import 'package:goproperti/Api/config.dart';
import 'package:goproperti/Api/data_store.dart';
import 'package:goproperti/model/faq_info.dart';
import 'package:http/http.dart' as http;

class FaqController extends GetxController implements GetxService {
  FaqListInfo? faqListInfo;
  bool isLoading = false;

  getFaqDataApi() async {
    try {
      Map map = {
        "uid": getData.read("UserLogin")["id"].toString(),
      };
      Uri uri = Uri.parse(Config.path + Config.faqApi);
      var response = await http.post(
        uri,
        body: jsonEncode(map),
      );
      if (response.statusCode == 200) {
        var result = jsonDecode(response.body);
        faqListInfo = FaqListInfo.fromJson(result);
      }
      isLoading = true;
      update();
    } catch (e) {
      print(e.toString());
    }
  }
}

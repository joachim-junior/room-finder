// ignore_for_file: avoid_print

import 'dart:convert';

import 'package:get/get.dart';
import 'package:goproperti/Api/config.dart';
import 'package:goproperti/Api/data_store.dart';
import 'package:goproperti/controller/dashboard_controller.dart';
import 'package:goproperti/model/add%20property%20model/subscribe_info.dart';
import 'package:goproperti/model/routes_helper.dart';
import 'package:goproperti/utils/Custom_widget.dart';
import 'package:http/http.dart' as http;

class SubscribeController extends GetxController implements GetxService {
  DashBoardController dashBoardController = Get.find();
  SubscribeInfo? subscribeInfo;
  bool isLoading = false;

  int? currentIndex;
  String price = "";
  String planId = "";

  changeSubscribe(int index) {
    currentIndex = index;
    update();
  }

  getSubscribeDetailsList() async {
    try {
      Map map = {
        "uid": getData.read("UserLogin")["id"],
      };
      Uri uri = Uri.parse(Config.path + Config.subScribeList);
      var response = await http.post(
        uri,
        body: jsonEncode(map),
      );
      if (response.statusCode == 200) {
        var result = jsonDecode(response.body);
        if (result["is_subscribe"] == 0) {
          Get.offAndToNamed(Routes.subscribeScreen);
        } else {
          Get.offAndToNamed(Routes.membershipScreen);
        }
        subscribeInfo = SubscribeInfo.fromJson(result);
      }
      isLoading = true;
      update();
    } catch (e) {
      print(e.toString());
    }
  }

  packagePurchaseApi({String? otid, String? pName}) async {
    try {
      Map map = {
        "uid": getData.read("UserLogin")["id"],
        "plan_id": planId,
        "transaction_id": otid,
        "pname": price != "0" ? pName : "Trial"
      };
      print(map.toString());
      Uri uri = Uri.parse(Config.path + Config.packagePurchase);
      var response = await http.post(
        uri,
        body: jsonEncode(map),
      );
      if (response.statusCode == 200) {
        var result = jsonDecode(response.body);
        print(result.toString());
        if (result["Result"] == "true") {
          dashBoardController.getDashBoardData();
          getSubscribeDetailsList();
          showToastMessage(result["ResponseMsg"]);
        }
      }
    } catch (e) {
      print(e.toString());
    }
  }
}

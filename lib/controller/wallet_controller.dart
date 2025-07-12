// ignore_for_file: avoid_print, prefer_interpolation_to_compose_strings, prefer_typing_uninitialized_variables

import 'dart:convert';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:goproperti/Api/config.dart';
import 'package:goproperti/Api/data_store.dart';
import 'package:goproperti/controller/homepage_controller.dart';
import 'package:goproperti/model/wallet_info.dart';
import 'package:goproperti/utils/Custom_widget.dart';
import 'package:http/http.dart' as http;

class WalletController extends GetxController implements GetxService {
  HomePageController homePageController = Get.find();

  WalletInfo? walletInfo;
  bool isLoading = false;

  TextEditingController amount = TextEditingController();

  String results = "";
  String walletMsg = "";

  String rCode = "";
  String signupcredit = "";
  String refercredit = "";
  int tex = 0;

  String? get userPhone => getData.read("UserLogin")["mobile"]?.toString();
  String? get userCountryCode => getData.read("UserLogin")["ccode"]?.toString();

  Future<Map<String, dynamic>> initiateMobileMoneyPayment({
    required String amount,
    required String phone,
    required String countryCode,
  }) async {
    try {
      final userId = getData.read("UserLogin")["id"]?.toString();
      if (userId == null) throw Exception("User not logged in");

      final response = await http
          .post(
            Uri.parse('${Config.path}fapshi_initiate.php'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'uid': userId,
              'amount': amount,
              'phone': phone,
              'country_code': countryCode,
              'purpose': 'wallet_topup',
            }),
          )
          .timeout(const Duration(seconds: 30));

      if (response.statusCode == 200) {
        final result = jsonDecode(response.body);

        if (result['status'] == 'success') {
          return {
            'status': 'success',
            'transaction_id': result['transaction_id'],
            'message': result['message'] ?? 'Payment initiated successfully'
          };
        } else {
          throw Exception(result['message'] ?? 'Payment initiation failed');
        }
      } else {
        throw Exception('HTTP Error ${response.statusCode}');
      }
    } on TimeoutException {
      throw Exception('Request timed out. Please check your connection');
    } on http.ClientException {
      throw Exception('Network error. Please check your internet connection');
    } catch (e) {
      throw Exception('Payment error: ${e.toString()}');
    }
  }

  Future<String> checkPaymentStatus(String transactionId) async {
    try {
      final response = await http
          .post(
            Uri.parse('${Config.path}fapshi_verify.php'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'transaction_id': transactionId,
            }),
          )
          .timeout(const Duration(seconds: 30));

      if (response.statusCode == 200) {
        final result = jsonDecode(response.body);
        return result['status'] ??
            'pending'; // 'completed', 'failed', 'pending'
      } else {
        throw Exception('Verification failed: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Status check error: ${e.toString()}');
    }
  }

  getWalletReportData() async {
    try {
      isLoading = false;

      Map map = {
        "uid": getData.read("UserLogin")["id"].toString(),
      };
      Uri uri = Uri.parse(Config.path + Config.walletReportApi);
      var response = await http.post(
        uri,
        body: jsonEncode(map),
      );
      if (response.statusCode == 200) {
        var result = jsonDecode(response.body);
        walletInfo = WalletInfo.fromJson(result);
      }
      isLoading = true;
      update();
    } catch (e) {
      print(e.toString());
    }
  }

  getWalletUpdateData() async {
    try {
      Map map = {
        "uid": getData.read("UserLogin")["id"].toString(),
        "wallet": amount.text,
      };
      Uri uri = Uri.parse(Config.path + Config.walletUpdateApi);
      var response = await http.post(
        uri,
        body: jsonEncode(map),
      );

      if (response.statusCode == 200) {
        var result = jsonDecode(response.body);
        results = result["Result"];
        walletMsg = result["ResponseMsg"];
        if (results == "true") {
          getWalletReportData();
          homePageController.getHomeDataApi(
            countryId: getData.read("countryId"),
          );
          Get.back();
          showToastMessage(walletMsg);
        }
      }
    } catch (e) {
      print(e.toString());
    }
  }

  getReferData() async {
    try {
      isLoading = false;
      update();
      Map map = {
        "uid": getData.read("UserLogin")["id"].toString(),
      };
      Uri uri = Uri.parse(Config.path + Config.referDataGetApi);
      var response = await http.post(
        uri,
        body: jsonEncode(map),
      );
      print(response.body.toString());
      if (response.statusCode == 200) {
        var result = jsonDecode(response.body);
        rCode = result["code"];
        signupcredit = result["signupcredit"];
        refercredit = result["refercredit"];
        tex = int.parse(result["tax"]);
      }
      isLoading = true;
      update();
    } catch (e) {
      print(e.toString());
    }
  }

  addAmount({String? price}) {
    amount.text = price ?? "";
    update();
  }
}

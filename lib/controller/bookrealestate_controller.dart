// ignore_for_file: unused_element, unused_field, unnecessary_string_interpolations, unused_local_variable, prefer_interpolation_to_compose_strings, avoid_print, non_constant_identifier_names

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:get/get.dart';
import 'package:goproperti/Api/config.dart';
import 'package:goproperti/Api/data_store.dart';
import 'package:goproperti/controller/wallet_controller.dart';
import 'package:goproperti/model/routes_helper.dart';
import 'package:goproperti/utils/Colors.dart';
import 'package:goproperti/utils/Custom_widget.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'package:syncfusion_flutter_datepicker/datepicker.dart';

class BookrealEstateController extends GetxController implements GetxService {
  WalletController walletController = Get.put(WalletController());

  int count = 1;

  DateTime selectedDate = DateTime.now();
  List<DateTime> selectedDates = [];
  String selectedDatees = '';
  String dateCount = '';

  String checkIn = '';
  String checkOut = '';

  String check_in = '';
  String check_out = '';

  String checkDateResult = "true";
  String checkDateMsg = "";

  String rangeCount = '';
  bool visible = false;
  bool chack = false;
  List days = [];

  int currentValue = 0;

  void onSelectionChanged(DateRangePickerSelectionChangedArgs args) {
    if (args.value is PickerDateRange) {
      days = [];
      checkDateResult = "true";
      checkIn = '${DateFormat('dd/MM/yyyy').format(args.value.startDate)}';
      // ignore: lines_longer_than_80_chars
      checkOut =
          '${DateFormat('dd/MM/yyyy').format(args.value.endDate ?? args.value.startDate)}';

      check_in = '${DateFormat('yyyy-MM-dd').format(args.value.startDate)}';
      check_out =
          '${DateFormat('yyyy-MM-dd').format(args.value.endDate ?? args.value.startDate)}';
      String che = checkIn.split('/').first;
      String out = checkOut.split('/').first;

      for (var i = int.parse(che); i <= int.parse(out); i++) {
        days.add(i);
      }
      visible = true;
      update();
    } else if (args.value is DateTime) {
      selectedDatees = args.value.toString();
      update();
    } else if (args.value is List<DateTime>) {
      dateCount = args.value.length.toString();
      update();
    } else {
      rangeCount = args.value.length.toString();
      update();
    }
  }

  cleanDate() {
    selectedDate = DateTime.now();
    selectedDates = [];
    selectedDatees = '';
    dateCount = '';
    checkIn = '';
    checkOut = '';
    rangeCount = '';
    visible = false;
    chack = false;
    count = 1;
    update();
  }

  bookingForSomeOne(bool? newbool) {
    chack = newbool ?? false;
    update();
  }

  changeValue(int value) {
    currentValue = value;
    update();
  }

  checkDateApi({String? pid}) async {
    try {
      Map map = {
        "pro_id": pid,
        "check_in": check_in,
        "check_out": check_out,
      };
      Uri uri = Uri.parse(Config.path + Config.checDateApi);

      var response = await http.post(
        uri,
        body: jsonEncode(map),
      );

      print(" + + + + + + + + + + ${response.body}");

      if (response.statusCode == 200) {
        var result = jsonDecode(response.body);
        checkDateResult = result["Result"];
        checkDateMsg = result["ResponseMsg"];

        if (visible == true) {
          if (checkDateResult == "true") {
            if (chack == true) {
              Get.toNamed(Routes.bookInformetionScreen);
            } else {
              Get.toNamed(Routes.reviewSummaryScreen, arguments: {
                "copAmt": 0,
                "fname": "",
                "lname": "",
                "gender": "",
                "email": "",
                "mobile": "",
                "ccode": "",
                "country": "",
                "couponCode": "",
              });
            }
          } else {
            Fluttertoast.showToast(
              msg: checkDateMsg,
              gravity: ToastGravity.BOTTOM,
              timeInSecForIosWeb: 1,
              backgroundColor: RedColor,
              textColor: Colors.white,
              fontSize: 14.0,
            );
          }
        } else {
          showToastMessage("Please select date".tr);
        }
      }
      update();
    } catch (e) {
      print(e.toString());
    }
  }

  bookApiData({
    String? pid,
    String? subtotal,
    String? total,
    String? totalDays,
    String? couAmt,
    String? wallAmt,
    String? transactionId,
    String? addNote,
    String? propPrice,
    String? bookFor,
    String? pMethodId,
    String? tex,
    String? fname,
    String? lname,
    String? gender,
    String? email,
    String? mobile,
    String? ccode,
    String? country,
    String? noGuest,
  }) async {
    try {
      Map map = {
        "prop_id": pid,
        "uid": getData.read("UserLogin")["id"].toString(),
        "check_in": check_in,
        "check_out": check_out,
        "subtotal": subtotal,
        "total": total,
        "total_day": totalDays,
        "cou_amt": couAmt,
        "wall_amt": wallAmt,
        "transaction_id": transactionId,
        "add_note": addNote ?? "",
        "prop_price": propPrice,
        "book_for": bookFor,
        "p_method_id": pMethodId,
        "tax": tex,
        "fname": fname,
        "lname": lname,
        "gender": gender,
        "email": email,
        "mobile": mobile,
        "ccode": ccode,
        "country": country,
        "noguest": noGuest,
      };
      print("---------+++++++++++${map.toString()}");
      Uri uri = Uri.parse(Config.path + Config.bookApi);
      var response = await http.post(
        uri,
        body: jsonEncode(map),
      );
      print("---------===========" + response.body);
      if (response.statusCode == 200) {
        var result = jsonDecode(response.body);
        print("---------===========" + result.toString());
        String bookresult = result["ResponseMsg"];

        showToastMessage(bookresult);
      }
      update();
    } catch (e) {
      print(e.toString());
    }
  }
}

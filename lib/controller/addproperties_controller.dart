// ignore_for_file: avoid_print, prefer_typing_uninitialized_variables, prefer_interpolation_to_compose_strings, non_constant_identifier_names

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:goproperti/Api/config.dart';
import 'package:goproperti/Api/data_store.dart';
import 'package:goproperti/controller/listofproperti_controller.dart';
import 'package:goproperti/utils/Custom_widget.dart';
import 'package:http/http.dart' as http;

class AddPropertiesController extends GetxController implements GetxService {
  ListOfPropertiController listOfPropertiController = Get.find();

  TextEditingController pTitle = TextEditingController();
  TextEditingController pNumber = TextEditingController();
  TextEditingController pAddress = TextEditingController();
  TextEditingController pPrice = TextEditingController();
  TextEditingController propertyAddress = TextEditingController();
  TextEditingController totalBeds = TextEditingController();
  TextEditingController totalBathroom = TextEditingController();
  TextEditingController pSqft = TextEditingController();
  TextEditingController pRating = TextEditingController();
  TextEditingController pGest = TextEditingController();
  TextEditingController pCityAndCountry = TextEditingController();

  String? path;
  String? base64Image;

  String countryId = "";

  String pType = "";
  String pbuySell = "";
  String status = "";

  String pImage = "";

  var selectedIndexes = [];

  var lat;
  var long;

  String eTitle = "";
  String eNumber = "";
  String eAddress = "";
  String ePrice = "";
  String ePropertyAddress = "";
  String eTotalBeds = "";
  String eTotalBathroom = "";
  String eSqft = "";
  String eRating = "";
  String eCityAndCountry = "";
  String propId = "";
  String eImage = "";
  String eGest = "";
  String buyOrRent = "";
  String Id = "";
  String pShell = "0";

  String fList = "";
  String pName = "";
  String countryName = "";

  var elat;
  var elong;

  getEditDetails({
    String? eTitle1,
    eNumber1,
    eAddress1,
    ePrice1,
    ePropertyAddress1,
    eTotalBeds1,
    eTotalBathroom1,
    eSqft1,
    eRating1,
    eCityAndCountry1,
    lat1,
    long1,
    propId1,
    eImage1,
    eGest1,
    ebuyorRent,
    isShell,
    id,
    facelity1,
    pID,
    proName1,
    countryId1,
    countryName1,
  }) {
    eTitle = eTitle1 ?? "";
    eNumber = eNumber1 ?? "";
    eAddress = eAddress1 ?? "";
    ePrice = ePrice1 ?? "";
    ePropertyAddress = ePropertyAddress1 ?? "";
    eTotalBeds = eTotalBeds1 ?? "";
    eTotalBathroom = eTotalBathroom1 ?? "";
    eSqft = eSqft1 ?? "";
    eRating = eRating1 ?? "";
    eCityAndCountry = eCityAndCountry1 ?? "";
    elat = lat1 ?? "";
    elong = long1 ?? "";
    propId = propId1 ?? "";
    eImage = eImage1 ?? "";
    eGest = eGest1 ?? "";
    buyOrRent = ebuyorRent;
    pShell = isShell;
    Id = id;
    fList = facelity1;
    pType = pID;
    pName = proName1;
    countryId = countryId1;
    countryName = countryName1;
    update();
  }

  getCurrentLatAndLong(double latitude, double longitude) {
    lat = latitude;
    long = longitude;
    update();
  }

  emptyAllDetails() {
    pTitle.text = "";
    pNumber.text = "";
    pAddress.text = "";
    pPrice.text = "";
    propertyAddress.text = "";
    totalBeds.text = "";
    totalBathroom.text = "";
    pSqft.text = "";
    pRating.text = "";
    pGest.text = "";
    pCityAndCountry.text = "";
    path = null;
    base64Image = "";
    pbuySell = "";
    status = "";
    lat = null;
    long = null;
    pImage = "";
    update();
  }

  addPropertyApi() async {
    String str = selectedIndexes.join(",");
    try {
      Map map = {
        "uid": getData.read("UserLogin")["id"],
        "status": status == "" ? "1" : status, // publish 1 /0
        "plimit": pGest.text,
        "country_id": countryId,
        "pbuysell": pbuySell == "" ? "2" : pbuySell, // buy hoy to 2 nkar 1
        "title": pTitle.text,
        "address": pAddress.text,
        "description": propertyAddress.text,
        "ccount": pAddress.text,
        "facility": str,
        "ptype": pType,
        "beds": totalBeds.text,
        "bathroom": totalBathroom.text,
        "sqft": pSqft.text,
        "rate": pRating.text,
        "latitude": lat.toString(),
        "longtitude": long.toString(),
        "mobile": pNumber.text,
        "price": pPrice.text,
        "img": base64Image,
      };
      print(":::::::::::::::" + map.toString());
      Uri uri = Uri.parse(Config.path + Config.addPropertyApi);
      var response = await http.post(
        uri,
        body: jsonEncode(map),
      );
      if (response.statusCode == 200) {
        var result = jsonDecode(response.body);
        print(result.toString());
        if (result["Result"] == "true") {
          listOfPropertiController.getPropertiList();
          showToastMessage(result["ResponseMsg"]);
          emptyAllDetails();
          Get.back();
        } else {
          showToastMessage(result["ResponseMsg"]);
        }
      }
    } catch (e) {
      print(e.toString());
    }
  }

  editPropertyApi() async {
    try {
      String str = selectedIndexes.join(",");
      Map map = {
        "uid": getData.read("UserLogin")["id"],
        "status": status == "" ? "1" : status,
        "plimit": pGest.text,
        "country_id": countryId,
        "pbuysell": pbuySell == "" ? "2" : pbuySell,
        "title": pTitle.text,
        "address": pAddress.text,
        "description": propertyAddress.text,
        "ccount": pAddress.text,
        "facility": str,
        "ptype": pType,
        "beds": totalBeds.text,
        "bathroom": totalBathroom.text,
        "sqft": pSqft.text,
        "rate": pRating.text,
        "latitude": lat.toString(),
        "longtitude": long.toString(),
        "mobile": pNumber.text,
        "price": pPrice.text,
        "img": path != null ? base64Image : "0",
        "prop_id": propId,
      };
      print(":::::::::::::::" + map.toString());
      Uri uri = Uri.parse(Config.path + Config.editPropertyApi);
      var response = await http.post(
        uri,
        body: jsonEncode(map),
      );
      if (response.statusCode == 200) {
        var result = jsonDecode(response.body);
        print(result.toString());
        if (result["Result"] == "true") {
          listOfPropertiController.getPropertiList();
          showToastMessage(result["ResponseMsg"]);
          Get.back();
        } else {
          showToastMessage(result["ResponseMsg"]);
        }
      }
    } catch (e) {
      print(e.toString());
    }
  }
}

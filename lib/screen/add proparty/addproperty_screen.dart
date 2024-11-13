// ignore_for_file: prefer_const_constructors, sort_child_properties_last, prefer_const_literals_to_create_immutables, non_constant_identifier_names, unused_element, prefer_typing_uninitialized_variables, prefer_interpolation_to_compose_strings, avoid_print, deprecated_member_use, unused_field

import 'dart:convert';
import 'dart:io';

import 'package:dotted_border/dotted_border.dart';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:get/get.dart';
import 'package:goproperti/Api/config.dart';
import 'package:goproperti/controller/addproperties_controller.dart';
import 'package:goproperti/controller/dashboard_controller.dart';
import 'package:goproperti/controller/enquiry_controller.dart';
import 'package:goproperti/controller/selectcountry_controller.dart';
import 'package:goproperti/model/fontfamily_model.dart';
import 'package:goproperti/utils/Colors.dart';
import 'package:goproperti/utils/Custom_widget.dart';
import 'package:goproperti/utils/Dark_lightmode.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AddPropertyScreen extends StatefulWidget {
  const AddPropertyScreen({super.key});

  @override
  State<AddPropertyScreen> createState() => _AddPropertyScreenState();
}

List<String> list = ["Buy", "Rent"];

List<String> propartyStatus = ["Publish", "UnPublish"];

class _AddPropertyScreenState extends State<AddPropertyScreen> {
  AddPropertiesController addPropertiesController = Get.find();
  DashBoardController dashBoardController = Get.find();
  EnquiryController enquriryController = Get.find();
  SelectCountryController selectCountryController = Get.find();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  String manegeRoute = Get.arguments["add"];

  String selectValue = list.first;
  String? selectProperty;
  String? selectCountry;
  String slectStatus = propartyStatus.first;

  bool carCheck = false;
  bool sportCheck = false;
  bool laundaryCheck = false;

  late ColorNotifire notifire;
  getdarkmodepreviousstate() async {
    final prefs = await SharedPreferences.getInstance();
    bool? previusstate = prefs.getBool("setIsDark");
    if (previusstate == null) {
      notifire.setIsDark = false;
    } else {
      notifire.setIsDark = previusstate;
    }
  }

  Future<Position> locateUser() async {
    return Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high);
  }

  @override
  void initState() {
    super.initState();
    print(".....//.......//.....//" + manegeRoute);
    if (manegeRoute == "edit") {
      setState(() {
        addPropertiesController.emptyAllDetails();
        addPropertiesController.pTitle.text = addPropertiesController.eTitle;
        addPropertiesController.pNumber.text = addPropertiesController.eNumber;
        addPropertiesController.pAddress.text =
            addPropertiesController.eAddress;
        addPropertiesController.pPrice.text = addPropertiesController.ePrice;
        addPropertiesController.propertyAddress.text =
            addPropertiesController.ePropertyAddress;
        addPropertiesController.totalBeds.text =
            addPropertiesController.eTotalBeds;
        addPropertiesController.totalBathroom.text =
            addPropertiesController.eTotalBathroom;
        addPropertiesController.pSqft.text = addPropertiesController.eSqft;
        addPropertiesController.pRating.text = addPropertiesController.eRating;
        addPropertiesController.pCityAndCountry.text =
            addPropertiesController.eCityAndCountry;
        addPropertiesController.lat = addPropertiesController.elat;
        addPropertiesController.long = addPropertiesController.elong;
        addPropertiesController.pImage = addPropertiesController.eImage;
        addPropertiesController.pGest.text = addPropertiesController.eGest;
        List list = addPropertiesController.fList.split(",");
        for (var i = 0; i < list.length; i++) {
          if (dashBoardController.facilityInfo?.facilitylist![i].title ==
              list[i]) {
            addPropertiesController.selectedIndexes
                .add(dashBoardController.facilityInfo!.facilitylist![i].id);
          }
        }
        selectProperty = addPropertiesController.pName;
        selectCountry = addPropertiesController.countryName;
        setState(() {});
      });
    } else {
      addPropertiesController.emptyAllDetails();
      addPropertiesController.selectedIndexes = [];
      addPropertiesController.pType = "";
      addPropertiesController.countryId = "";
      selectProperty = null;
      selectCountry = null;
      setState(() {});
    }
    getdarkmodepreviousstate();
  }

  @override
  Widget build(BuildContext context) {
    notifire = Provider.of<ColorNotifire>(context, listen: true);
    return Scaffold(
      backgroundColor: notifire.getfevAndSearch,
      appBar: AppBar(
        leading: IconButton(
          onPressed: () {
            Get.back();
          },
          icon: Icon(
            Icons.arrow_back,
            color: notifire.getwhiteblackcolor,
          ),
        ),
         backgroundColor: notifire.getblackwhitecolor,
        elevation: 0,
        title: Text(
          "Add Property".tr,
          style: TextStyle(
            color: notifire.getwhiteblackcolor,
            fontFamily: FontFamily.gilroyBold,
            fontSize: 16,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  physics: BouncingScrollPhysics(),
                  child: Container(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SizedBox(
                          height: 10,
                        ),
                        Padding(
                          padding: const EdgeInsets.only(left: 15),
                          child: Text(
                            "Property".tr,
                            style: TextStyle(
                              fontFamily: FontFamily.gilroyBold,
                              fontSize: 16,
                              color: notifire.getwhiteblackcolor,
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 8,
                        ),
                        Container(
                          height: 60,
                          width: Get.size.width,
                          alignment: Alignment.center,
                          margin: EdgeInsets.symmetric(horizontal: 10),
                          padding: EdgeInsets.only(left: 15, right: 15),
                          child: DropdownButton(
                            dropdownColor: notifire.getbgcolor,
                            value: selectValue,
                            icon: Image.asset(
                              'assets/images/Arrow - Down.png',
                              height: 20,
                              width: 20,
                              color: notifire.getwhiteblackcolor,
                            ),
                            isExpanded: true,
                            underline: SizedBox.shrink(),
                            items: list
                                .map<DropdownMenuItem<String>>((String value) {
                              return DropdownMenuItem<String>(
                                value: value,
                                child: Text(
                                  value,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    color: notifire.getwhiteblackcolor,
                                    fontSize: 14,
                                  ),
                                ),
                              );
                            }).toList(),
                            onChanged: (value) {
                              setState(() {
                                if (value == "Buy") {
                                  addPropertiesController.pbuySell = "2";
                                } else if (value == "Rent") {
                                  addPropertiesController.pbuySell = "1";
                                }
                                selectValue = value ?? "";
                              });
                            },
                          ),
                          decoration: BoxDecoration(
                            color: notifire.getblackwhitecolor,
                            borderRadius: BorderRadius.circular(15),
                            border: Border.all(color: notifire.getborderColor),
                          ),
                        ),
                        SizedBox(
                          height: 10,
                        ),
                        Padding(
                          padding: const EdgeInsets.only(left: 15),
                          child: Text(
                            "Select Country".tr,
                            style: TextStyle(
                              fontFamily: FontFamily.gilroyBold,
                              fontSize: 16,
                              color: notifire.getwhiteblackcolor,
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 8,
                        ),
                        GetBuilder<AddPropertiesController>(builder: (context) {
                          return Container(
                            height: 60,
                            width: Get.size.width,
                            alignment: Alignment.center,
                            margin: EdgeInsets.symmetric(horizontal: 10),
                            padding: EdgeInsets.only(left: 15, right: 15),
                            child: DropdownButton(
                              dropdownColor: notifire.getbgcolor,
                              hint: Text(
                                "Select Country".tr,
                                style: TextStyle(
                                  color: Colors.grey,
                                ),
                              ),
                              value: selectCountry,
                              icon: Image.asset(
                                'assets/images/Arrow - Down.png',
                                height: 20,
                                width: 20,
                                color: notifire.getwhiteblackcolor,
                              ),
                              isExpanded: true,
                              underline: SizedBox.shrink(),
                              items: selectCountryController.countryList
                                  .map<DropdownMenuItem<String>>(
                                      (String value) {
                                return DropdownMenuItem<String>(
                                  value: value,
                                  child: Text(
                                    value,
                                    style: TextStyle(
                                      fontFamily: FontFamily.gilroyMedium,
                                      color: notifire.getwhiteblackcolor,
                                      fontSize: 14,
                                    ),
                                  ),
                                );
                              }).toList(),
                              onChanged: (value) {
                                for (var i = 0;
                                    i <
                                        selectCountryController
                                            .countryInfo!.countryData!.length;
                                    i++) {
                                  if (value ==
                                      selectCountryController
                                          .countryInfo?.countryData![i].title) {
                                    addPropertiesController.countryId =
                                        selectCountryController.countryInfo
                                                ?.countryData![i].id ??
                                            "";
                                  }
                                }
                                print(addPropertiesController.countryId);
                                setState(() {
                                  selectCountry = value ?? "";
                                });
                              },
                            ),
                            decoration: BoxDecoration(
                              color: notifire.getblackwhitecolor,
                              borderRadius: BorderRadius.circular(15),
                              border:
                                  Border.all(color: notifire.getborderColor),
                            ),
                          );
                        }),
                        textfield(
                          type: "Property Title".tr,
                          controller: addPropertiesController.pTitle,
                          labelText: "Full Name".tr,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please Enter Property Title'.tr;
                            }
                            return null;
                          },
                        ),
                        textfield(
                          type: "Mobile Number".tr,
                          controller: addPropertiesController.pNumber,
                          labelText: "Mobile Number".tr,
                          textInputType: TextInputType.number,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please Enter Mobile Number'.tr;
                            }
                            return null;
                          },
                        ),
                        textfield(
                          type: "Address".tr,
                          controller: addPropertiesController.pAddress,
                          labelText: "Address".tr,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please Enter Your Address'.tr;
                            }
                            return null;
                          },
                        ),
                        textfield(
                          type: "Property Price".tr,
                          controller: addPropertiesController.pPrice,
                          labelText: "Price".tr,
                          textInputType: TextInputType.number,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please Enter Property Price'.tr;
                            }
                            return null;
                          },
                        ),
                        SizedBox(
                          height: 10,
                        ),
                        Padding(
                          padding: const EdgeInsets.only(left: 15),
                          child: Text(
                            "Property Description".tr,
                            style: TextStyle(
                              fontFamily: FontFamily.gilroyBold,
                              fontSize: 16,
                              color: notifire.getwhiteblackcolor,
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 8,
                        ),
                        Container(
                          margin: EdgeInsets.only(top: 5, left: 15, right: 15),
                          child: TextFormField(
                            controller: addPropertiesController.propertyAddress,
                            minLines: 5,
                            keyboardType: TextInputType.multiline,
                            maxLines: null,
                            cursorColor: notifire.getwhiteblackcolor,
                            autovalidateMode:
                                AutovalidateMode.onUserInteraction,
                            decoration: InputDecoration(
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: blueColor),
                                borderRadius: BorderRadius.circular(15),
                              ),
                              contentPadding: EdgeInsets.all(10),
                              border: InputBorder.none,
                              hintText: "Description".tr,
                              hintStyle: TextStyle(
                                fontFamily: FontFamily.gilroyMedium,
                                fontSize: 15,
                              ),
                            ),
                            style: TextStyle(
                              fontFamily: FontFamily.gilroyMedium,
                              fontSize: 16,
                              color: notifire.getwhiteblackcolor,
                            ),
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please Enter Property Description'.tr;
                              }
                              return null;
                            },
                          ),
                          decoration: BoxDecoration(
                            color: notifire.getblackwhitecolor,
                            borderRadius: BorderRadius.circular(15),
                            border: Border.all(color: notifire.getborderColor),
                          ),
                        ),
                        textfield(
                          type: "Total Beds".tr,
                          controller: addPropertiesController.totalBeds,
                          labelText: "Total Beds".tr,
                          textInputType: TextInputType.number,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please Enter Total Beds'.tr;
                            }
                            return null;
                          },
                        ),
                        textfield(
                          type: "Total Bathroom".tr,
                          controller: addPropertiesController.totalBathroom,
                          labelText: "Total Bathroom".tr,
                          textInputType: TextInputType.number,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please Enter Total Bathroom'.tr;
                            }
                            return null;
                          },
                        ),
                        textfield(
                          type: "Property Sqft.".tr,
                          controller: addPropertiesController.pSqft,
                          labelText: "Property Sqft.".tr,
                          textInputType: TextInputType.number,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please Enter Property Sqft'.tr;
                            }
                            return null;
                          },
                        ),
                        manegeRoute == "Add"
                            ? textfield(
                                type: "Property Rating".tr,
                                controller: addPropertiesController.pRating,
                                labelText: "Property Rating".tr,
                                textInputType: TextInputType.number,
                                max: 1,
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Please Enter Property Rating'.tr;
                                  }
                                  return null;
                                },
                              )
                            : textfield(
                                type: "Property Rating".tr,
                                controller: addPropertiesController.pRating,
                                labelText: "Property Rating".tr,
                                textInputType: TextInputType.number,
                                readOnly: true,
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Please Enter Property Rating'.tr;
                                  }
                                  return null;
                                },
                              ),
                        SizedBox(
                          height: 10,
                        ),
                        textfield(
                          type: "Property Total Person Allowed?".tr,
                          controller: addPropertiesController.pGest,
                          labelText: "Person limit".tr,
                          textInputType: TextInputType.number,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please Enter Property Total Person'.tr;
                            }
                            return null;
                          },
                        ),
                        SizedBox(
                          height: 10,
                        ),
                        Padding(
                          padding: const EdgeInsets.only(left: 15),
                          child: Text(
                            "Property Type".tr,
                            style: TextStyle(
                              fontFamily: FontFamily.gilroyBold,
                              fontSize: 16,
                              color: notifire.getwhiteblackcolor,
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 8,
                        ),
                        Container(
                          height: 60,
                          width: Get.size.width,
                          alignment: Alignment.center,
                          margin: EdgeInsets.symmetric(horizontal: 10),
                          padding: EdgeInsets.only(left: 15, right: 15),
                          child: DropdownButton(
                            dropdownColor: notifire.getbgcolor,
                            hint: Text(
                              "Select Property".tr,
                              style: TextStyle(color: Colors.grey),
                            ),
                            value: selectProperty,
                            icon: Image.asset(
                              'assets/images/Arrow - Down.png',
                              height: 20,
                              width: 20,
                              color: notifire.getwhiteblackcolor,
                            ),
                            underline: SizedBox.shrink(),
                            isExpanded: true,
                            items: dashBoardController.typeList
                                .map<DropdownMenuItem<String>>((String value) {
                              return DropdownMenuItem<String>(
                                value: value,
                                child: Text(
                                  value,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    color: notifire.getwhiteblackcolor,
                                    fontSize: 14,
                                  ),
                                ),
                              );
                            }).toList(),
                            onChanged: (value) {
                              for (var i = 0;
                                  i <
                                      dashBoardController
                                          .proTypeInfo!.typelist!.length;
                                  i++) {
                                if (value ==
                                    dashBoardController
                                        .proTypeInfo?.typelist![i].title) {
                                  addPropertiesController.pType =
                                      dashBoardController
                                              .proTypeInfo?.typelist![i].id ??
                                          "";
                                  print(addPropertiesController.pType);
                                }
                              }
                              setState(() {
                                selectProperty = value ?? "";
                              });
                            },
                          ),
                          decoration: BoxDecoration(
                            color: notifire.getblackwhitecolor,
                            borderRadius: BorderRadius.circular(15),
                            border: Border.all(color: notifire.getborderColor),
                          ),
                        ),
                        textfield(
                          type: "City, Country".tr,
                          controller: addPropertiesController.pCityAndCountry,
                          labelText: "City, Country".tr,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please Enter City, Country'.tr;
                            }
                            return null;
                          },
                        ),
                        SizedBox(
                          height: 10,
                        ),
                        Padding(
                          padding: const EdgeInsets.only(left: 15),
                          child: Text(
                            "Select Property Facility".tr,
                            style: TextStyle(
                              fontFamily: FontFamily.gilroyBold,
                              fontSize: 16,
                              color: notifire.getwhiteblackcolor,
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 8,
                        ),
                        GetBuilder<AddPropertiesController>(builder: (context) {
                          return ListView.builder(
                            itemCount: dashBoardController
                                .facilityInfo?.facilitylist!.length,
                            shrinkWrap: true,
                            physics: NeverScrollableScrollPhysics(),
                            itemBuilder: (context, index) {
                              return Column(
                                children: [
                                  Row(
                                    children: [
                                      SizedBox(
                                        width: 10,
                                      ),
                                      Transform.scale(
                                        scale: 1,
                                        child: Checkbox(
                                          value: addPropertiesController
                                              .selectedIndexes
                                              .contains(dashBoardController
                                                  .facilityInfo
                                                  ?.facilitylist![index]
                                                  .id),
                                          side: const BorderSide(
                                              color: Color(0xffC5CAD4)),
                                          activeColor: blueColor,
                                          shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(5),
                                          ),
                                          onChanged: (_) {
                                            if (addPropertiesController
                                                .selectedIndexes
                                                .contains(dashBoardController
                                                    .facilityInfo
                                                    ?.facilitylist![index]
                                                    .id)) {
                                              addPropertiesController
                                                  .selectedIndexes
                                                  .remove(dashBoardController
                                                      .facilityInfo
                                                      ?.facilitylist![index]
                                                      .id); // unselect
                                              setState(() {});
                                            } else {
                                              addPropertiesController
                                                  .selectedIndexes
                                                  .add(dashBoardController
                                                      .facilityInfo
                                                      ?.facilitylist![index]
                                                      .id);
                                              setState(() {}); // select
                                            }
                                          },
                                        ),
                                      ),
                                      Text(
                                        dashBoardController.facilityInfo
                                                ?.facilitylist![index].title ??
                                            "",
                                        style: TextStyle(
                                          fontFamily: FontFamily.gilroyMedium,
                                          fontSize: 17,
                                          color: notifire.getwhiteblackcolor,
                                        ),
                                      ),
                                      Spacer(),
                                      Container(
                                        height: 40,
                                        width: 40,
                                        padding: EdgeInsets.all(8),
                                        child: Image.network(
                                          "${Config.imageUrl}${dashBoardController.facilityInfo?.facilitylist![index].img ?? ""}",
                                        ),
                                        decoration: BoxDecoration(
                                          color: Color(0xFFeef4ff),
                                          shape: BoxShape.circle,
                                        ),
                                      ),
                                      SizedBox(
                                        width: 15,
                                      ),
                                    ],
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 20),
                                    child: Divider(thickness: 1),
                                  ),
                                ],
                              );
                            },
                          );
                        }),
                        SizedBox(
                          height: 10,
                        ),
                        GetBuilder<AddPropertiesController>(builder: (context) {
                          return Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Padding(
                                      padding: const EdgeInsets.only(left: 15),
                                      child: Text(
                                        "Latitude".tr,
                                        style: TextStyle(
                                          fontFamily: FontFamily.gilroyBold,
                                          fontSize: 16,
                                          color: notifire.getwhiteblackcolor,
                                        ),
                                      ),
                                    ),
                                    SizedBox(
                                      height: 10,
                                    ),
                                    Container(
                                      height: 60,
                                      margin: EdgeInsets.symmetric(
                                          horizontal: 10, vertical: 5),
                                      alignment: Alignment.center,
                                      child: Text(
                                        addPropertiesController.lat != null
                                            ? addPropertiesController.lat
                                                .toString()
                                            : "",
                                        style: TextStyle(
                                          fontFamily: FontFamily.gilroyMedium,
                                          color: notifire.getwhiteblackcolor,
                                          fontSize: 15,
                                        ),
                                      ),
                                      decoration: BoxDecoration(
                                        border: Border.all(
                                            color: notifire.getborderColor),
                                        borderRadius: BorderRadius.circular(15),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Padding(
                                      padding: const EdgeInsets.only(left: 15),
                                      child: Text(
                                        "Longitude".tr,
                                        style: TextStyle(
                                          fontFamily: FontFamily.gilroyBold,
                                          fontSize: 16,
                                          color: notifire.getwhiteblackcolor,
                                        ),
                                      ),
                                    ),
                                    SizedBox(
                                      height: 10,
                                    ),
                                    Container(
                                      height: 60,
                                      margin: EdgeInsets.symmetric(
                                          horizontal: 10, vertical: 5),
                                      alignment: Alignment.center,
                                      child: Text(
                                        addPropertiesController.long != null
                                            ? addPropertiesController.long
                                                .toString()
                                            : "",
                                        style: TextStyle(
                                          fontFamily: FontFamily.gilroyMedium,
                                          color: notifire.getwhiteblackcolor,
                                          fontSize: 15,
                                        ),
                                      ),
                                      decoration: BoxDecoration(
                                        border: Border.all(
                                            color: notifire.getborderColor),
                                        borderRadius: BorderRadius.circular(15),
                                      ),
                                    ),
                                  ],
                                ),
                              )
                            ],
                          );
                        }),
                        InkWell(
                          onTap: () async {
                            LocationPermission permission;
                            permission = await Geolocator.checkPermission();
                            permission = await Geolocator.requestPermission();
                            if (permission == LocationPermission.denied) {}
                            var currentLocation = await locateUser();
                            debugPrint('location: ${currentLocation.latitude}');
                            addPropertiesController.getCurrentLatAndLong(
                              currentLocation.latitude,
                              currentLocation.longitude,
                            );
                            print("????????????" +
                                currentLocation.latitude.toString());
                          },
                          child: Padding(
                            padding: const EdgeInsets.only(left: 15),
                            child: Row(
                              children: [
                                Image.asset(
                                  "assets/images/Navigation.png",
                                  height: 25,
                                  width: 25,
                                ),
                                SizedBox(
                                  width: 8,
                                ),
                                Text(
                                  "Click for Current Location".tr,
                                  style: TextStyle(
                                    color: notifire.getwhiteblackcolor,
                                    fontFamily: FontFamily.gilroyMedium,
                                    fontSize: 16,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 15,
                        ),
                        Padding(
                          padding: const EdgeInsets.only(left: 15),
                          child: Text(
                            "Upload Image".tr,
                            style: TextStyle(
                              fontFamily: FontFamily.gilroyBold,
                              fontSize: 16,
                              color: notifire.getwhiteblackcolor,
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 10,
                        ),
                        DottedBorder(
                          borderType: BorderType.RRect,
                          color: Color(0xff3D5BF6),
                          radius: Radius.circular(15),
                          borderPadding: EdgeInsets.symmetric(horizontal: 20),
                          child: InkWell(
                            onTap: () {
                              _openGallery(context);
                            },
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(15),
                              child: manegeRoute == "Add"
                                  ? Container(
                                      height: 80,
                                      margin:
                                          EdgeInsets.symmetric(horizontal: 20),
                                      width: Get.size.width,
                                      alignment: Alignment.center,
                                      child:
                                          addPropertiesController.path == null
                                              ? Image.asset(
                                                  "assets/images/image-upload.png",
                                                  height: 40,
                                                  width: 42,
                                                )
                                              : Image.file(
                                                  File(
                                                    addPropertiesController.path
                                                        .toString(),
                                                  ),
                                                  height: 50,
                                                  width: 50,
                                                  fit: BoxFit.cover,
                                                ),
                                      decoration: BoxDecoration(
                                        borderRadius: BorderRadius.circular(15),
                                      ),
                                    )
                                  : Container(
                                      height: 80,
                                      margin:
                                          EdgeInsets.symmetric(horizontal: 20),
                                      width: Get.size.width,
                                      alignment: Alignment.center,
                                      child: addPropertiesController.pImage ==
                                              ""
                                          ? Image.asset(
                                              "assets/images/image-upload.png",
                                              height: 40,
                                              width: 42,
                                            )
                                          : addPropertiesController.path == null
                                              ? Image.network(
                                                  "${Config.imageUrl}${addPropertiesController.pImage}",
                                                  height: 50,
                                                  width: 50,
                                                  fit: BoxFit.cover,
                                                )
                                              : Image.file(
                                                  File(
                                                    addPropertiesController.path
                                                        .toString(),
                                                  ),
                                                  height: 50,
                                                  width: 50,
                                                  fit: BoxFit.cover,
                                                ),
                                      decoration: BoxDecoration(
                                        borderRadius: BorderRadius.circular(15),
                                      ),
                                    ),
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 10,
                        ),
                        Padding(
                          padding: const EdgeInsets.only(left: 15),
                          child: Text(
                            "Property Status".tr,
                            style: TextStyle(
                              fontFamily: FontFamily.gilroyBold,
                              fontSize: 16,
                              color: notifire.getwhiteblackcolor,
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 8,
                        ),
                        Container(
                          height: 60,
                          width: Get.size.width,
                          alignment: Alignment.center,
                          margin: EdgeInsets.symmetric(horizontal: 10),
                          padding: EdgeInsets.only(left: 15, right: 15),
                          child: DropdownButton(
                            value: slectStatus,
                            icon: Image.asset('assets/images/Arrow - Down.png',
                                height: 20,
                                width: 20,
                                color: notifire.getwhiteblackcolor),
                            isExpanded: true,
                            underline: SizedBox.shrink(),
                            items: propartyStatus
                                .map<DropdownMenuItem<String>>((String value) {
                              return DropdownMenuItem<String>(
                                value: value,
                                child: Text(
                                  value,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    color: notifire.getwhiteblackcolor,
                                    fontSize: 14,
                                  ),
                                ),
                              );
                            }).toList(),
                            onChanged: (value) {
                              if (value == "Publish") {
                                addPropertiesController.status = "1";
                              } else if (value == "UnPublish") {
                                addPropertiesController.status = "0";
                              }
                              setState(() {
                                slectStatus = value ?? "";
                              });
                            },
                          ),
                          decoration: BoxDecoration(
                            color: notifire.getblackwhitecolor,
                            borderRadius: BorderRadius.circular(15),
                            border: Border.all(color: notifire.getborderColor),
                          ),
                        ),
                        SizedBox(
                          height: 20,
                        ),
                        addPropertiesController.pShell == "0"
                            ? GestButton(
                                Width: Get.size.width,
                                height: 55,
                                buttoncolor: blueColor,
                                margin: EdgeInsets.only(
                                    top: 5, left: 35, right: 35),
                                buttontext: "Update".tr,
                                style: TextStyle(
                                  fontFamily: FontFamily.gilroyBold,
                                  color: WhiteColor,
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                                onclick: () {
                                  if (_formKey.currentState?.validate() ??
                                      false) {
                                    if (selectCountry != null) {
                                      if (selectProperty != null) {
                                        if (addPropertiesController
                                            .selectedIndexes.isNotEmpty) {
                                          if (addPropertiesController.lat !=
                                                  null &&
                                              addPropertiesController.long !=
                                                  null) {
                                            if (addPropertiesController.path !=
                                                    null ||
                                                addPropertiesController
                                                        .pImage !=
                                                    "") {
                                              if (manegeRoute == "Add") {
                                                addPropertiesController
                                                    .addPropertyApi();
                                              } else if (manegeRoute ==
                                                  "edit") {
                                                addPropertiesController
                                                    .editPropertyApi();
                                              }
                                            } else {
                                              showToastMessage(
                                                  "Please Upload Image".tr);
                                            }
                                          } else {
                                            showToastMessage(
                                                "Please Add Your Property Location"
                                                    .tr);
                                          }
                                        } else {
                                          showToastMessage(
                                              "Please Select Property Facility"
                                                  .tr);
                                        }
                                      } else {
                                        showToastMessage(
                                            "Please Select Property Type".tr);
                                      }
                                    } else {
                                      showToastMessage(
                                          "Please Select Country".tr);
                                    }
                                  }
                                },
                              )
                            : SizedBox(),
                        SizedBox(
                          height: 25,
                        ),
                      ],
                    ),
                    decoration: BoxDecoration(
                      color: notifire.getblackwhitecolor,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _openGallery(BuildContext context) async {
    final pickedFile =
        await ImagePicker().pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      addPropertiesController.path = pickedFile.path;
      setState(() {});
      File imageFile = File(addPropertiesController.path.toString());
      List<int> imageBytes = imageFile.readAsBytesSync();
      addPropertiesController.base64Image = base64Encode(imageBytes);
      print("!!!!!!!!!++++++++++++${addPropertiesController.base64Image}");
      setState(() {});
    }
  }

  textfield(
      {String? type,
      labelText,
      prefixtext,
      suffix,
      Color? labelcolor,
      prefixcolor,
      floatingLabelColor,
      focusedBorderColor,
      TextDecoration? decoration,
      bool? readOnly,
      double? Width,
      int? max,
      TextEditingController? controller,
      TextInputType? textInputType,
      Function(String)? onChanged,
      String? Function(String?)? validator,
      Height}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: 10,
        ),
        Padding(
          padding: const EdgeInsets.only(left: 15),
          child: Text(
            type ?? "",
            style: TextStyle(
              fontFamily: FontFamily.gilroyBold,
              fontSize: 16,
              color: notifire.getwhiteblackcolor,
            ),
          ),
        ),
        SizedBox(
          height: 6,
        ),
        Container(
          height: Height,
          width: Width,
          margin: EdgeInsets.only(top: 5, bottom: 5, left: 12, right: 12),
          decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(15),
              color: notifire.getblackwhitecolor),
          child: TextFormField(
            controller: controller,
            onChanged: onChanged,
            cursorColor: notifire.getwhiteblackcolor,
            keyboardType: textInputType,
            autovalidateMode: AutovalidateMode.onUserInteraction,
            maxLength: max,
            readOnly: readOnly ?? false,
            style: TextStyle(
                color: notifire.getwhiteblackcolor,
                fontFamily: FontFamily.gilroyMedium,
                fontSize: 18),
            decoration: InputDecoration(
              hintText: labelText,
              hintStyle: TextStyle(
                  color: Colors.grey,
                  fontFamily: "Gilroy Medium",
                  fontSize: 16),
              focusedBorder: OutlineInputBorder(
                borderSide: BorderSide(color: blueColor),
                borderRadius: BorderRadius.circular(15),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15),
                borderSide: BorderSide(color: notifire.getborderColor),
              ),
              border: OutlineInputBorder(
                borderSide: BorderSide(color: notifire.getborderColor),
                borderRadius: BorderRadius.circular(15),
              ),
            ),
            validator: validator,
          ),
        ),
      ],
    );
  }
}

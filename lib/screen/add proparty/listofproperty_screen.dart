// ignore_for_file: sort_child_properties_last, prefer_const_constructors, prefer_const_literals_to_create_immutables, unnecessary_brace_in_string_interps, prefer_interpolation_to_compose_strings, avoid_print

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:goproperti/Api/config.dart';
import 'package:goproperti/controller/addproperties_controller.dart';
import 'package:goproperti/controller/listofproperti_controller.dart';
import 'package:goproperti/model/fontfamily_model.dart';
import 'package:goproperti/model/routes_helper.dart';
import 'package:goproperti/screen/home_screen.dart';
import 'package:goproperti/utils/Colors.dart';
import 'package:goproperti/utils/Dark_lightmode.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ListOfPropertyScreen extends StatefulWidget {
  const ListOfPropertyScreen({super.key});

  @override
  State<ListOfPropertyScreen> createState() => _ListOfPropertyScreenState();
}

class _ListOfPropertyScreenState extends State<ListOfPropertyScreen> {
  ListOfPropertiController listOfPropertiController = Get.put(ListOfPropertiController());
  AddPropertiesController addPropertiesController = Get.find();
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

  @override
  void initState() {
    super.initState();
    getdarkmodepreviousstate();
  }

  @override
  Widget build(BuildContext context) {
    notifire = Provider.of<ColorNotifire>(context, listen: true);
    return Scaffold(
      backgroundColor: notifire.getfevAndSearch,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: notifire.getblackwhitecolor,
        leading: IconButton(
          onPressed: () {
            Get.back();
          },
          icon: Icon(
            Icons.arrow_back,
            color: notifire.getwhiteblackcolor,
          ),
        ),
        centerTitle: true,
        title: Text(
          "List of Property".tr,
          style: TextStyle(
            color: notifire.getwhiteblackcolor,
            fontFamily: FontFamily.gilroyBold,
            fontSize: 16,
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.all(5),
            child: InkWell(
              onTap: () {
                addPropertiesController.buyOrRent = "";
                Get.toNamed(
                  Routes.addPropertyScreen,
                  arguments: {"add": "Add"},
                );
              },
              child: Container(
                height: 50,
                width: 50,
                child: Icon(
                  Icons.add,
                  color: WhiteColor,
                ),
                decoration: BoxDecoration(
                  color: Color(0xff3D5BF6),
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: GetBuilder<ListOfPropertiController>(builder: (context) {
                return Container(
                  padding: EdgeInsets.symmetric(horizontal: 10),
                  child: listOfPropertiController.isLodding
                      ? listOfPropertiController
                              .propListInfo!.proplist!.isNotEmpty
                          ? ListView.builder(
                    padding: EdgeInsets.only(top: 10),
                              itemCount: listOfPropertiController
                                  .propListInfo?.proplist!.length,
                              physics: BouncingScrollPhysics(),
                              itemBuilder: (context, index) {
                                print("++++++++++++++>>" +
                                    listOfPropertiController.propListInfo!
                                        .proplist![index].facilitySelect
                                        .toString());

                                return InkWell(
                                  onTap: () {
                                    addPropertiesController.getEditDetails(
                                        eTitle1: listOfPropertiController
                                            .propListInfo
                                            ?.proplist![index]
                                            .title,
                                        eNumber1: listOfPropertiController
                                            .propListInfo
                                            ?.proplist![index]
                                            .mobile,
                                        eAddress1: listOfPropertiController
                                            .propListInfo
                                            ?.proplist![index]
                                            .address,
                                        ePrice1: listOfPropertiController
                                            .propListInfo
                                            ?.proplist![index]
                                            .price,
                                        ePropertyAddress1: listOfPropertiController
                                            .propListInfo
                                            ?.proplist![index]
                                            .description,
                                        eTotalBeds1: listOfPropertiController
                                            .propListInfo?.proplist![index].beds,
                                        eTotalBathroom1: listOfPropertiController
                                            .propListInfo
                                            ?.proplist![index]
                                            .bathroom,
                                        eSqft1: listOfPropertiController
                                            .propListInfo
                                            ?.proplist![index]
                                            .sqrft,
                                        eRating1: listOfPropertiController.propListInfo?.proplist![index].rate,
                                        eCityAndCountry1: listOfPropertiController.propListInfo?.proplist![index].city,
                                        lat1: listOfPropertiController.propListInfo?.proplist![index].latitude,
                                        long1: listOfPropertiController.propListInfo?.proplist![index].longtitude,
                                        propId1: listOfPropertiController.propListInfo?.proplist![index].id,
                                        eImage1: listOfPropertiController.propListInfo?.proplist![index].image,
                                        eGest1: listOfPropertiController.propListInfo?.proplist![index].plimit ?? "",
                                        ebuyorRent: listOfPropertiController.propListInfo?.proplist![index].buyorrent ?? "",
                                        isShell: listOfPropertiController.propListInfo?.proplist![index].isSell ?? "0",
                                        id: listOfPropertiController.propListInfo?.proplist![index].id ?? "",
                                        facelity1: listOfPropertiController.propListInfo?.proplist![index].facilitySelect ?? "",
                                        pID: listOfPropertiController.propListInfo?.proplist![index].propertyTypeId ?? "",
                                        proName1: listOfPropertiController.propListInfo?.proplist![index].propertyType ?? "",
                                        countryId1: listOfPropertiController.propListInfo?.proplist![index].countryId ?? "",
                                        countryName1: listOfPropertiController.propListInfo?.proplist![index].countryTitle ?? "");
                                    print("========------->> ${listOfPropertiController.propListInfo!.proplist![index].propertyType}");
                                    print("========------->> ${listOfPropertiController.propListInfo!.proplist![index].propertyTypeId}");
                                    Get.toNamed(
                                      Routes.addPropertyScreen,
                                      arguments: {"add": "edit"},
                                    );
                                  },
                                  child: Stack(
                                    children: [
                                      Container(
                                        height: 125,
                                        width: Get.size.width,
                                        margin: EdgeInsets.all(10),
                                        child: Row(
                                          children: [
                                            Stack(
                                              children: [
                                                Container(
                                                  height: 125,
                                                  width: 110,
                                                  margin: EdgeInsets.all(10),
                                                  child: ClipRRect(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            15),
                                                    child: FadeInImage.assetNetwork(
                                                      fadeInCurve: Curves.easeInCirc,
                                                      placeholder:
                                                      "assets/images/ezgif.com-crop.gif",
                                                      height: 140,
                                                      imageErrorBuilder: (context, error, stackTrace) {
                                                        return Image.asset("assets/images/ezgif.com-crop.gif",height: 48,width: 48,fit: BoxFit.cover,);
                                                      },
                                                      image:
                                                      "${Config.imageUrl}${listOfPropertiController.propListInfo?.proplist![index].image ?? ""}",
                                                      fit: BoxFit.cover,
                                                    ),
                                                  ),
                                                  decoration: BoxDecoration(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            15),
                                                  ),
                                                ),
                                                listOfPropertiController
                                                            .propListInfo
                                                            ?.proplist![index]
                                                            .buyorrent ==
                                                        "1"
                                                    ? Positioned(
                                                        top: 15,
                                                        right: 20,
                                                        child: Container(
                                                          height: 30,
                                                          width: 45,
                                                          child: Row(
                                                            mainAxisAlignment:
                                                                MainAxisAlignment
                                                                    .center,
                                                            children: [
                                                              Container(
                                                                margin:
                                                                    const EdgeInsets
                                                                        .fromLTRB(
                                                                        0,
                                                                        0,
                                                                        3,
                                                                        0),
                                                                child:
                                                                    Image.asset(
                                                                  "assets/images/Rating.png",
                                                                  height: 12,
                                                                  width: 12,
                                                                ),
                                                              ),
                                                              Text(
                                                                "${listOfPropertiController.propListInfo?.proplist![index].rate}",
                                                                style:
                                                                    TextStyle(
                                                                  fontFamily:
                                                                      FontFamily
                                                                          .gilroyMedium,
                                                                  color:
                                                                      blueColor,
                                                                ),
                                                              )
                                                            ],
                                                          ),
                                                          decoration:
                                                              BoxDecoration(
                                                            color: Color(
                                                                0xFFedeeef),
                                                            borderRadius:
                                                                BorderRadius
                                                                    .circular(
                                                                        15),
                                                          ),
                                                        ),
                                                      )
                                                    : listOfPropertiController
                                                                .propListInfo
                                                                ?.proplist![
                                                                    index]
                                                                .isSell ==
                                                            "0"
                                                        ? Positioned(
                                                            top: 15,
                                                            right: 20,
                                                            child: Container(
                                                              height: 27,
                                                              width: 45,
                                                              alignment:
                                                                  Alignment
                                                                      .center,
                                                              child: Text(
                                                                "BUY".tr,
                                                                style:
                                                                    TextStyle(
                                                                  color:
                                                                      blueColor,
                                                                  fontWeight:
                                                                      FontWeight
                                                                          .w500,
                                                                ),
                                                              ),
                                                              decoration:
                                                                  BoxDecoration(
                                                                color: Color(
                                                                    0xFFedeeef),
                                                                borderRadius:
                                                                    BorderRadius
                                                                        .circular(
                                                                            15),
                                                              ),
                                                            ),
                                                          )
                                                        : Positioned(
                                                            top: 15,
                                                            right: 20,
                                                            child: Container(
                                                              height: 27,
                                                              width: 45,
                                                              alignment:
                                                                  Alignment
                                                                      .center,
                                                              child: Text(
                                                                "SOLD".tr,
                                                                maxLines: 1,
                                                                style:
                                                                    TextStyle(
                                                                  color: Color(
                                                                      0xFFEA1E61),
                                                                  fontWeight:
                                                                      FontWeight
                                                                          .w500,
                                                                  overflow:
                                                                      TextOverflow
                                                                          .ellipsis,
                                                                ),
                                                              ),
                                                              decoration:
                                                                  BoxDecoration(
                                                                color: Color(
                                                                    0xFFedeeef),
                                                                borderRadius:
                                                                    BorderRadius
                                                                        .circular(
                                                                            15),
                                                              ),
                                                            ),
                                                          )
                                              ],
                                            ),
                                            SizedBox(
                                              width: 8,
                                            ),
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment:
                                                    CrossAxisAlignment.start,
                                                mainAxisAlignment: MainAxisAlignment.center,
                                                children: [
                                                  Row(
                                                    children: [
                                                      Expanded(
                                                        child: Text(
                                                          listOfPropertiController
                                                                  .propListInfo
                                                                  ?.proplist![
                                                                      index]
                                                                  .title ??
                                                              "",
                                                          maxLines: 2,
                                                          style: TextStyle(
                                                            fontSize: 17,
                                                            fontFamily:
                                                                FontFamily
                                                                    .gilroyBold,
                                                            color: notifire
                                                                .getwhiteblackcolor,
                                                            overflow:
                                                                TextOverflow
                                                                    .ellipsis,
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                  SizedBox(
                                                    height: 5,
                                                  ),
                                                  Row(
                                                    children: [
                                                      Expanded(
                                                        child: Text(
                                                          listOfPropertiController
                                                                  .propListInfo
                                                                  ?.proplist![
                                                                      index]
                                                                  .city ??
                                                              "",
                                                          maxLines: 1,
                                                          style: TextStyle(
                                                            color: notifire
                                                                .getgreycolor,
                                                            fontFamily: FontFamily
                                                                .gilroyMedium,
                                                            overflow:
                                                                TextOverflow
                                                                    .ellipsis,
                                                          ),
                                                        ),
                                                      ),
                                                      SizedBox(
                                                        width: 10,
                                                      ),
                                                    ],
                                                  ),
                                                  SizedBox(
                                                    height: 5,
                                                  ),
                                                  Row(
                                                    children: [
                                                      Text(
                                                        "${currency}${listOfPropertiController.propListInfo?.proplist![index].price ?? ""}",
                                                        style: TextStyle(
                                                          fontSize: 17,
                                                          fontFamily:
                                                          FontFamily
                                                              .gilroyBold,
                                                          color:
                                                          blueColor,
                                                        ),
                                                      ),
                                                      listOfPropertiController
                                                          .propListInfo
                                                          ?.proplist![
                                                      index]
                                                          .buyorrent ==
                                                          "1"
                                                          ? Text(
                                                        "/night".tr,
                                                        style:
                                                        TextStyle(
                                                          color: notifire
                                                              .getgreycolor,
                                                          fontFamily:
                                                          FontFamily
                                                              .gilroyMedium,
                                                        ),
                                                      )
                                                          : Text(""),
                                                    ],
                                                  ),
                                                ],
                                              ),
                                            )
                                          ],
                                        ),
                                        decoration: BoxDecoration(
                                          border: Border.all(
                                              color: notifire.getborderColor),
                                          borderRadius:
                                              BorderRadius.circular(15),
                                        ),
                                      ),
                                      listOfPropertiController.propListInfo
                                                  ?.proplist![index].isSell ==
                                              "0"
                                          ? Positioned(
                                              top: 0,
                                              right: 0,
                                              child: InkWell(
                                                onTap: () {
                                                  addPropertiesController.getEditDetails(
                                                      eTitle1: listOfPropertiController
                                                          .propListInfo
                                                          ?.proplist![index]
                                                          .title,
                                                      eNumber1: listOfPropertiController
                                                          .propListInfo
                                                          ?.proplist![index]
                                                          .mobile,
                                                      eAddress1: listOfPropertiController
                                                          .propListInfo
                                                          ?.proplist![index]
                                                          .address,
                                                      ePrice1: listOfPropertiController
                                                          .propListInfo
                                                          ?.proplist![index]
                                                          .price,
                                                      ePropertyAddress1:
                                                          listOfPropertiController
                                                              .propListInfo
                                                              ?.proplist![index]
                                                              .description,
                                                      eTotalBeds1: listOfPropertiController
                                                          .propListInfo
                                                          ?.proplist![index]
                                                          .beds,
                                                      eTotalBathroom1: listOfPropertiController
                                                          .propListInfo
                                                          ?.proplist![index]
                                                          .bathroom,
                                                      eSqft1: listOfPropertiController
                                                          .propListInfo
                                                          ?.proplist![index]
                                                          .sqrft,
                                                      eRating1: listOfPropertiController
                                                          .propListInfo
                                                          ?.proplist![index]
                                                          .rate,
                                                      eCityAndCountry1:
                                                          listOfPropertiController
                                                              .propListInfo
                                                              ?.proplist![index]
                                                              .city,
                                                      lat1: listOfPropertiController
                                                          .propListInfo
                                                          ?.proplist![index]
                                                          .latitude,
                                                      long1: listOfPropertiController
                                                          .propListInfo
                                                          ?.proplist![index]
                                                          .longtitude,
                                                      propId1: listOfPropertiController.propListInfo?.proplist![index].id,
                                                      eImage1: listOfPropertiController.propListInfo?.proplist![index].image,
                                                      eGest1: listOfPropertiController.propListInfo?.proplist![index].plimit ?? "",
                                                      ebuyorRent: listOfPropertiController.propListInfo?.proplist![index].buyorrent ?? "",
                                                      isShell: listOfPropertiController.propListInfo?.proplist![index].isSell ?? "0",
                                                      id: listOfPropertiController.propListInfo?.proplist![index].id ?? "",
                                                      facelity1: listOfPropertiController.propListInfo?.proplist![index].facilitySelect ?? "",
                                                      pID: listOfPropertiController.propListInfo?.proplist![index].propertyTypeId ?? "",
                                                      proName1: listOfPropertiController.propListInfo?.proplist![index].propertyType ?? "",
                                                      countryId1: listOfPropertiController.propListInfo?.proplist![index].countryId ?? "",
                                                      countryName1: listOfPropertiController.propListInfo?.proplist![index].countryTitle ?? "");
                                                  Get.toNamed(
                                                    Routes.addPropertyScreen,
                                                    arguments: {"add": "edit"},
                                                  );
                                                },
                                                child: Container(
                                                  height: 35,
                                                  width: 35,
                                                  padding: EdgeInsets.all(9),
                                                  alignment: Alignment.center,
                                                  child: Image.asset(
                                                      "assets/images/Pen (1).png"),
                                                  decoration: BoxDecoration(
                                                    shape: BoxShape.circle,
                                                    color: Color(0xff3D5BF6),
                                                  ),
                                                ),
                                              ),
                                            )
                                          : SizedBox(),
                                    ],
                                  ),
                                );
                              },
                            )
                          : Center(
                              child: Padding(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 14, vertical: 5),
                                child: Column(
                                  children: [
                                    SizedBox(height: Get.height * 0.10),
                                    Image(
                                      image: AssetImage(
                                        "assets/images/searchDataEmpty.png",
                                      ),
                                      height: 110,
                                      width: 110,
                                    ),
                                    Center(
                                      child: SizedBox(
                                        width: Get.width * 0.80,
                                        child: Text(
                                          "Sorry, there is no any nearby \n category or data not found"
                                              .tr,
                                          textAlign: TextAlign.center,
                                          style: TextStyle(
                                            color: notifire.getgreycolor,
                                            fontFamily: FontFamily.gilroyBold,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            )
                      : Center(
                          child: CircularProgressIndicator(),
                        ),
                  decoration: BoxDecoration(
                    color: notifire.getblackwhitecolor,
                  ),
                );
              }),
            )
          ],
        ),
      ),
    );
  }
}

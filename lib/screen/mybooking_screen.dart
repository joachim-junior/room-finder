// ignore_for_file: prefer_const_constructors, unused_field, prefer_const_literals_to_create_immutables, sort_child_properties_last, avoid_print, unnecessary_brace_in_string_interps, unrelated_type_equality_checks, prefer_typing_uninitialized_variables

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:goproperti/Api/config.dart';
import 'package:goproperti/Api/data_store.dart';
import 'package:goproperti/controller/bookingdetails_controller.dart';
import 'package:goproperti/controller/homepage_controller.dart';
import 'package:goproperti/controller/mybooking_controller.dart';
import 'package:goproperti/model/fontfamily_model.dart';
import 'package:goproperti/model/routes_helper.dart';
import 'package:goproperti/screen/home_screen.dart';
import 'package:goproperti/utils/Colors.dart';
import 'package:goproperti/utils/Dark_lightmode.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class MyBookingScreen extends StatefulWidget {
  const MyBookingScreen({super.key});

  @override
  State<MyBookingScreen> createState() => _MyBookingScreenState();
}

class _MyBookingScreenState extends State<MyBookingScreen>
    with TickerProviderStateMixin {
  TabController? _tabController;

  MyBookingController myBookingController = Get.find();
  HomePageController homePageController = Get.find();
  BookingDetailsController bookingDetailsController = Get.find();

  var selectedRadioTile;
  final note = TextEditingController();
  String? rejectmsg = '';

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
    _tabController = TabController(length: 2, vsync: this);
    _tabController?.index == 0;
    if (_tabController?.index == 0) {
      myBookingController.statusWiseBook = "active";
      myBookingController.statusWiseBooking();
    }
    getdarkmodepreviousstate();
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
    _tabController?.dispose();
  }

  @override
  Widget build(BuildContext context) {
    notifire = Provider.of<ColorNotifire>(context, listen: true);
    return WillPopScope(
      onWillPop: () {
        if (getData.read("backHome") == true) {
          Get.toNamed(Routes.bottoBarScreen);
          save("backHome", false);
        } else {
          Get.back();
        }
        return Future.value(false);
      },
      child: Scaffold(
        backgroundColor: notifire.getbgcolor,
        appBar: AppBar(
          backgroundColor: notifire.getbgcolor,
          elevation: 0,
          leading: IconButton(
            onPressed: () {
              if (getData.read("backHome") == true) {
                Get.toNamed(Routes.bottoBarScreen);
                save("backHome", false);
              } else {
                Get.back();
              }
            },
            icon: Icon(
              Icons.arrow_back,
              color: notifire.getwhiteblackcolor,
            ),
          ),
          title: Text(
            "My Booking".tr,
            style: TextStyle(
              fontSize: 17,
              fontFamily: FontFamily.gilroyBold,
              color: notifire.getwhiteblackcolor,
            ),
          ),
        ),
        body: SizedBox(
          height: Get.size.height,
          width: Get.size.width,
          child: Column(
            children: [
              SizedBox(
                height: 50,
                child: TabBar(
                  controller: _tabController,
                  unselectedLabelColor: notifire.getgreycolor,
                  labelStyle: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontFamily: FontFamily.gilroyBold,
                    fontSize: 16,
                  ),
                  labelColor: blueColor,
                  onTap: (value) {
                    if (value == 0) {
                      myBookingController.statusWiseBook = "active";
                      myBookingController.statusWiseBooking();
                    } else {
                      myBookingController.statusWiseBook = "completed";
                      myBookingController.statusWiseBooking();
                    }
                  },
                  tabs: [
                    Tab(
                      text: "Active".tr,
                    ),
                    Tab(
                      text: "Completed".tr,
                    ),
                  ],
                ),
              ),
              Expanded(
                flex: 1,
                child: TabBarView(
                  controller: _tabController,
                  physics: NeverScrollableScrollPhysics(),
                  children: [
                    activeWidget(),
                    completedWidget(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget activeWidget() {
    return GetBuilder<MyBookingController>(builder: (context) {
      return RefreshIndicator(
        onRefresh: () {
          return Future.delayed(
            Duration(seconds: 2),
            () {
              myBookingController.statusWiseBooking();
            },
          );
        },
        child: SizedBox(
          height: Get.size.height,
          width: Get.size.width,
          child: myBookingController.isLoading
              ? myBookingController.statusWiseBookInfo!.statuswise!.isNotEmpty
                  ? ListView.builder(
                      itemCount: myBookingController
                          .statusWiseBookInfo?.statuswise!.length,
                      itemBuilder: (context, index) {
                        return Column(
                          children: [
                            InkWell(
                              onTap: () async {
                                await homePageController.getPropertyDetailsApi(
                                    id: myBookingController.statusWiseBookInfo
                                            ?.statuswise![index].propId ??
                                        "");
                                Get.toNamed(Routes.viewDataScreen);
                              },
                              child: Container(
                                margin: EdgeInsets.all(10),
                                child: Column(
                                  children: [
                                    Row(
                                      children: [
                                        Stack(
                                          children: [
                                            Container(
                                              height: 140,
                                              width: 130,
                                              margin: EdgeInsets.all(10),
                                              child: ClipRRect(
                                                borderRadius:
                                                    BorderRadius.circular(15),
                                                child: FadeInImage.assetNetwork(
                                                  fadeInCurve: Curves.easeInCirc,
                                                  placeholder:
                                                      "assets/images/ezgif.com-crop.gif",
                                                  height: 140,
                                                  imageErrorBuilder: (context, error, stackTrace) {
                                                  return Center(child: Image.asset("assets/images/emty.gif",fit: BoxFit.cover,height: Get.height,),);
                                                  },
                                                  image:
                                                      "${Config.imageUrl}${myBookingController.statusWiseBookInfo?.statuswise![index].propImg ?? ""}",
                                                  fit: BoxFit.cover,
                                                ),
                                              ),
                                              decoration: BoxDecoration(
                                                borderRadius:
                                                    BorderRadius.circular(15),
                                              ),
                                            ),
                                            Positioned(
                                              top: 15,
                                              right: 20,
                                              child: Container(
                                                height: 30,
                                                width: 45,
                                                child: Row(
                                                  mainAxisAlignment:
                                                      MainAxisAlignment.center,
                                                  children: [
                                                    Container(
                                                      margin:
                                                          const EdgeInsets.fromLTRB(
                                                              0, 0, 3, 0),
                                                      child: Image.asset(
                                                        "assets/images/Rating.png",
                                                        height: 12,
                                                        width: 12,
                                                      ),
                                                    ),
                                                    Text(
                                                      myBookingController
                                                              .statusWiseBookInfo
                                                              ?.statuswise![index]
                                                              .totalRate ??
                                                          "",
                                                      style: TextStyle(
                                                        fontFamily:
                                                            FontFamily.gilroyMedium,
                                                        color: blueColor,
                                                      ),
                                                    )
                                                  ],
                                                ),
                                                decoration: BoxDecoration(
                                                  color: Color(0xFFedeeef),
                                                  borderRadius:
                                                      BorderRadius.circular(15),
                                                ),
                                              ),
                                            ),
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
                                              Text(
                                                myBookingController
                                                        .statusWiseBookInfo
                                                        ?.statuswise![index]
                                                        .propTitle ??
                                                    "",
                                                maxLines: 2,
                                                style: TextStyle(
                                                  fontSize: 17,
                                                  fontFamily:
                                                      FontFamily.gilroyBold,
                                                  color:
                                                      notifire.getwhiteblackcolor,
                                                  overflow: TextOverflow.ellipsis,
                                                ),
                                              ),
                                              SizedBox(
                                                height: 15,
                                              ),
                                              Row(
                                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                children: [
                                                  Row(
                                                    children: [
                                                      Text(
                                                        "${currency}${int.parse(myBookingController.statusWiseBookInfo?.statuswise![index].propPrice ?? "") * int.parse(myBookingController.statusWiseBookInfo?.statuswise![index].totalDay ?? "")}",
                                                        style: TextStyle(
                                                          fontFamily:
                                                              FontFamily.gilroyBold,
                                                          fontSize: 20,
                                                          color: blueColor,
                                                        ),
                                                      ),
                                                      SizedBox(
                                                        width: 5,
                                                      ),
                                                      Text(
                                                        "/${myBookingController.statusWiseBookInfo?.statuswise![index].totalDay ?? ""} days",
                                                        style: TextStyle(
                                                          color: notifire.getgreycolor,
                                                          fontSize: 12,
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                ],
                                              ),
                                              SizedBox(
                                                height: 15,
                                              ),
                                              myBookingController
                                                  .statusWiseBookInfo
                                                  ?.statuswise![index]
                                                  .pMethodId !=
                                                  "2"
                                                  ? Row(
                                                mainAxisAlignment:
                                                MainAxisAlignment.start,
                                                children: [
                                                  SizedBox(
                                                    height: 10,
                                                  ),
                                                  Container(
                                                    height: 30,
                                                    width: 60,
                                                    alignment:
                                                    Alignment.center,
                                                    child: Text(
                                                      "Paid".tr,
                                                      style: TextStyle(
                                                        color: blueColor,
                                                        fontFamily: FontFamily
                                                            .gilroyMedium,
                                                      ),
                                                    ),
                                                    decoration: BoxDecoration(
                                                      border: Border.all(
                                                          color: blueColor),
                                                      borderRadius:
                                                      BorderRadius
                                                          .circular(5),
                                                    ),
                                                  ),
                                                  SizedBox(
                                                    width: 15,
                                                  ),
                                                ],
                                              )
                                                  : Row(
                                                mainAxisAlignment:
                                                MainAxisAlignment.start,
                                                children: [
                                                  SizedBox(
                                                    height: 10,
                                                  ),
                                                  Container(
                                                    height: 30,
                                                    width: 85,
                                                    alignment:
                                                    Alignment.center,
                                                    child: Text(
                                                      "UnPaid".tr,
                                                      style: TextStyle(
                                                        color: Colors.red,
                                                        fontFamily: FontFamily
                                                            .gilroyMedium,
                                                      ),
                                                    ),
                                                    decoration: BoxDecoration(
                                                      border: Border.all(
                                                          color: Colors.red),
                                                      borderRadius:
                                                      BorderRadius
                                                          .circular(5),
                                                    ),
                                                  ),
                                                  SizedBox(
                                                    width: 15,
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                    Row(
                                      children: [
                                        myBookingController.statusWiseBookInfo
                                            ?.statuswise![index].bookStatus ==
                                            "Booked"
                                            ? Expanded(
                                          child: InkWell(
                                            onTap: () {
                                              ticketCancell(
                                                myBookingController
                                                    .statusWiseBookInfo
                                                    ?.statuswise![index]
                                                    .bookId,
                                              );
                                            },
                                            child: Container(
                                              height: 40,
                                              alignment: Alignment.center,
                                              margin: EdgeInsets.all(10),
                                              child: Text(
                                                "Cancel".tr,
                                                style: TextStyle(
                                                  fontFamily:
                                                  FontFamily.gilroyMedium,
                                                  color: WhiteColor,
                                                  fontSize: 15,
                                                ),
                                              ),
                                              decoration: BoxDecoration(
                                                borderRadius:
                                                BorderRadius.circular(20),
                                                color: blueColor,
                                              ),
                                            ),
                                          ),
                                        )
                                            : Container(),
                                        Expanded(
                                          child: InkWell(
                                            onTap: () {
                                              bookingDetailsController
                                                  .getbookingDetails(
                                                bookId: myBookingController
                                                    .statusWiseBookInfo
                                                    ?.statuswise![index]
                                                    .bookId ??
                                                    "",
                                              );
                                              Get.toNamed(
                                                Routes.eReceiptScreen,
                                                arguments: {
                                                  "Completed": "Active",
                                                },
                                              );
                                            },
                                            child: Container(
                                              height: 40,
                                              alignment: Alignment.center,
                                              margin: EdgeInsets.all(10),
                                              child: Text(
                                                "E-Receipt".tr,
                                                style: TextStyle(
                                                  fontFamily: FontFamily.gilroyMedium,
                                                  color: blueColor,
                                                  fontSize: 15,
                                                ),
                                              ),
                                              decoration: BoxDecoration(
                                                borderRadius: BorderRadius.circular(20),
                                                border: Border.all(color: blueColor),
                                              ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    )
                                  ],
                                ),
                                decoration: BoxDecoration(
                                  color: notifire.getblackwhitecolor,
                                  borderRadius: BorderRadius.circular(15),
                                ),
                              ),
                            ),
                          ],
                        );
                      },
                    )
                  : Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Padding(
                            padding: const EdgeInsets.only(left: 30),
                            child: Image.asset(
                              "assets/images/bookingEmpty.png",
                              height: 110,
                              width: 100,
                            ),
                          ),
                          SizedBox(
                            height: 20,
                          ),
                          Text(
                            "Go & Book your favorite service".tr,
                            style: TextStyle(
                              color: notifire.getgreycolor,
                              fontFamily: FontFamily.gilroyBold,
                            ),
                          )
                        ],
                      ),
                    )
              : Center(
                  child: CircularProgressIndicator(),
                ),
        ),
      );
    });
  }

  Widget completedWidget() {
    return GetBuilder<MyBookingController>(builder: (context) {
      return RefreshIndicator(
        onRefresh: () {
          return Future.delayed(
            Duration(seconds: 2),
            () {
              myBookingController.statusWiseBooking();
            },
          );
        },
        child: SizedBox(
          height: Get.size.height,
          width: Get.size.width,
          child: myBookingController.isLoading
              ? myBookingController.statusWiseBookInfo!.statuswise!.isNotEmpty
                  ? ListView.builder(
                      itemCount: myBookingController
                          .statusWiseBookInfo?.statuswise!.length,
                      itemBuilder: (context, index) {
                        return Column(
                          children: [
                            InkWell(
                              onTap: () async {
                                await homePageController.getPropertyDetailsApi(
                                    id: myBookingController.statusWiseBookInfo
                                            ?.statuswise![index].propId ??
                                        "");
                                Get.toNamed(Routes.viewDataScreen);
                              },
                              child: Container(
                                height: 155,
                                margin: EdgeInsets.all(10),
                                child: Row(
                                  children: [
                                    Stack(
                                      children: [
                                        Container(
                                          height: 140,
                                          width: 130,
                                          margin: EdgeInsets.all(10),
                                          child: ClipRRect(
                                            borderRadius:
                                                BorderRadius.circular(15),
                                            child: FadeInImage.assetNetwork(
                                              fadeInCurve: Curves.easeInCirc,
                                              placeholder:
                                                  "assets/images/ezgif.com-crop.gif",
                                              height: 140,
                                              imageErrorBuilder: (context, error, stackTrace) {
                                              return Center(child: Image.asset("assets/images/emty.gif",fit: BoxFit.cover,height: Get.height,),);
                                              },
                                              image:
                                                  "${Config.imageUrl}${myBookingController.statusWiseBookInfo?.statuswise![index].propImg ?? ""}",
                                              fit: BoxFit.cover,
                                            ),
                                          ),
                                          decoration: BoxDecoration(
                                            borderRadius:
                                                BorderRadius.circular(15),
                                          ),
                                        ),
                                        Positioned(
                                          top: 15,
                                          right: 20,
                                          child: Container(
                                            height: 30,
                                            width: 45,
                                            child: Row(
                                              mainAxisAlignment:
                                                  MainAxisAlignment.center,
                                              children: [
                                                Container(
                                                  margin:
                                                      const EdgeInsets.fromLTRB(
                                                          0, 0, 3, 0),
                                                  child: Image.asset(
                                                    "assets/images/Rating.png",
                                                    height: 12,
                                                    width: 12,
                                                  ),
                                                ),
                                                Text(
                                                  myBookingController
                                                          .statusWiseBookInfo
                                                          ?.statuswise![index]
                                                          .totalRate ??
                                                      "",
                                                  style: TextStyle(
                                                    fontFamily:
                                                        FontFamily.gilroyMedium,
                                                    color: blueColor,
                                                  ),
                                                )
                                              ],
                                            ),
                                            decoration: BoxDecoration(
                                              color: Color(0xFFedeeef),
                                              borderRadius:
                                                  BorderRadius.circular(15),
                                            ),
                                          ),
                                        ),
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
                                          Text(
                                            myBookingController
                                                    .statusWiseBookInfo
                                                    ?.statuswise![index]
                                                    .propTitle ??
                                                "",
                                            maxLines: 2,
                                            style: TextStyle(
                                              fontSize: 17,
                                              fontFamily:
                                                  FontFamily.gilroyBold,
                                              color:
                                                  notifire.getwhiteblackcolor,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ),
                                          SizedBox(
                                            height: 15,
                                          ),
                                          Row(
                                            children: [
                                              Text(
                                                "${currency}${int.parse(myBookingController.statusWiseBookInfo?.statuswise![index].propPrice ?? "") * int.parse(myBookingController.statusWiseBookInfo?.statuswise![index].totalDay ?? "")}",
                                                style: TextStyle(
                                                  fontFamily:
                                                      FontFamily.gilroyBold,
                                                  fontSize: 20,
                                                  color: blueColor,
                                                ),
                                              ),
                                              SizedBox(
                                                width: 5,
                                              ),
                                              Text(
                                                "/${myBookingController.statusWiseBookInfo?.statuswise![index].totalDay ?? ""} days",
                                                style: TextStyle(
                                                  fontFamily: FontFamily.gilroyMedium,
                                                  color: notifire.getgreycolor,
                                                  fontSize: 12,
                                                ),
                                              ),
                                            ],
                                          ),
                                          SizedBox(
                                            height: 15,
                                          ),
                                          InkWell(
                                            onTap: () {
                                              bookingDetailsController
                                                  .getbookingDetails(
                                                bookId: myBookingController
                                                        .statusWiseBookInfo
                                                        ?.statuswise![index]
                                                        .bookId ??
                                                    "",
                                              );
                                              Get.toNamed(
                                                Routes.eReceiptScreen,
                                                arguments: {
                                                  "Completed": "Completed"
                                                },
                                              );
                                            },
                                            child: Container(
                                              height: 35,
                                              width: 120,
                                              alignment: Alignment.center,
                                              padding: EdgeInsets.all(8),
                                              child: Text(
                                                "E-Receipt".tr,
                                                style: TextStyle(
                                                  color: blueColor,
                                                  fontFamily:
                                                      FontFamily.gilroyMedium,
                                                ),
                                              ),
                                              decoration: BoxDecoration(
                                                border: Border.all(
                                                    color: blueColor),
                                                borderRadius:
                                                    BorderRadius.circular(5),
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                decoration: BoxDecoration(
                                  color: notifire.getblackwhitecolor,
                                  borderRadius: BorderRadius.circular(15),
                                ),
                              ),
                            ),
                          ],
                        );
                      },
                    )
                  : Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Padding(
                            padding: const EdgeInsets.only(left: 30),
                            child: Image.asset(
                              "assets/images/bookingEmpty.png",
                              height: 110,
                              width: 100,
                            ),
                          ),
                          SizedBox(
                            height: 20,
                          ),
                          Text(
                            "Go & Book your favorite service".tr,
                            style: TextStyle(
                              color: notifire.getgreycolor,
                              fontFamily: FontFamily.gilroyBold,
                            ),
                          ),
                        ],
                      ),
                    )
              : Center(
                  child: CircularProgressIndicator(),
                ),
        ),
      );
    });
  }

  ticketCancell(ticketid) {
    showModalBottomSheet(
        isDismissible: false,
        isScrollControlled: true,
        backgroundColor: notifire.getbgcolor,
        shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
        clipBehavior: Clip.antiAliasWithSaveLayer,
        context: context,
        builder: (BuildContext context) {
          return StatefulBuilder(
              builder: (BuildContext context, StateSetter setState) {
            return SingleChildScrollView(
              child: Padding(
                padding: EdgeInsets.only(
                    bottom: MediaQuery.of(context).viewInsets.bottom),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SizedBox(height: Get.height * 0.02),
                    Container(
                        height: 6,
                        width: 80,
                        decoration: BoxDecoration(
                            color: Colors.grey.shade300,
                            borderRadius: BorderRadius.circular(25))),
                    SizedBox(height: Get.height * 0.02),
                    Text(
                      "Select Reason".tr,
                      style: TextStyle(
                          fontSize: 20,
                          fontFamily: 'Gilroy Bold',
                          color: notifire.getwhiteblackcolor),
                    ),
                    SizedBox(height: Get.height * 0.02),
                    Text(
                      "Please select the reason for cancellation:".tr,
                      style: TextStyle(
                          fontSize: 16,
                          fontFamily: 'Gilroy Medium',
                          color: notifire.getwhiteblackcolor),
                    ),
                    SizedBox(height: Get.height * 0.02),
                    ListView.builder(
                      itemCount: cancelList.length,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemBuilder: (ctx, i) {
                        return RadioListTile(
                          fillColor: WidgetStateColor.resolveWith((states) =>
                              i == selectedRadioTile
                                  ? blueColor
                                  : notifire.getborderColor),
                          dense: true,
                          value: i,
                          activeColor: Color(0xFF246BFD),
                          tileColor: notifire.getdarkscolor,
                          selected: true,
                          groupValue: selectedRadioTile,
                          title: Text(
                            cancelList[i]["title"],
                            style: TextStyle(
                                fontSize: 16,
                                fontFamily: 'Gilroy Medium',
                                color: notifire.getwhiteblackcolor),
                          ),
                          onChanged: (val) {
                            setState(() {});
                            selectedRadioTile = val;
                            rejectmsg = cancelList[i]["title"];
                          },
                        );
                      },
                    ),
                    rejectmsg == "Others".tr
                        ? SizedBox(
                            height: 50,
                            width: Get.width * 0.85,
                            child: TextField(
                              controller: note,
                              decoration: InputDecoration(
                                  isDense: true,
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: const BorderRadius.all(
                                        Radius.circular(10)),
                                    borderSide:
                                        BorderSide(color: blueColor, width: 1),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: const BorderRadius.all(
                                        Radius.circular(10)),
                                    borderSide:
                                        BorderSide(color: blueColor, width: 1),
                                  ),
                                  hintText: 'Enter reason'.tr,
                                  hintStyle: TextStyle(
                                      fontFamily: 'Gilroy Medium',
                                      fontSize: Get.size.height / 55,
                                      color: Colors.grey)),
                            ),
                          )
                        : const SizedBox(),
                    SizedBox(height: Get.height * 0.02),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        SizedBox(
                          width: Get.width * 0.35,
                          height: Get.height * 0.05,
                          child: ticketbutton(
                            title: "Cancel".tr,
                            bgColor: blueColor,
                            titleColor: Colors.white,
                            ontap: () {
                              Get.back();
                            },
                          ),
                        ),
                        SizedBox(
                          width: Get.width * 0.35,
                          height: Get.height * 0.05,
                          child: ticketbutton(
                            title: "Confirm".tr,
                            bgColor: blueColor,
                            titleColor: Colors.white,
                            ontap: () {
                              myBookingController.bookingCancle(
                                bookId: ticketid,
                                reason: rejectmsg == "Others".tr
                                    ? note.text
                                    : rejectmsg,
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: Get.height * 0.04),
                  ],
                ),
              ),
            );
          });
        });
  }

  List cancelList = [
    {"id": 1, "title": "Financing fell through".tr},
    {"id": 2, "title": "Inspection issues".tr},
    {"id": 3, "title": "Change in financial situation".tr},
    {"id": 4, "title": "Title issues".tr},
    {"id": 5, "title": "Seller changes their mind".tr},
    {"id": 6, "title": "Competing offer".tr},
    {"id": 7, "title": "Personal reasons".tr},
    {"id": 8, "title": "Others".tr},
  ];

  ticketbutton({Function()? ontap, String? title, Color? bgColor, titleColor}) {
    return InkWell(
      onTap: ontap,
      child: Container(
        height: Get.height * 0.04,
        width: Get.width * 0.40,
        decoration: BoxDecoration(
            color: bgColor,
            borderRadius: (BorderRadius.circular(18)),
            border: Border.all(color: bgColor!, width: 1)),
        child: Center(
          child: Text(title!,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                  color: titleColor,
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.5,
                  fontFamily: 'Gilroy Medium')),
        ),
      ),
    );
  }
}

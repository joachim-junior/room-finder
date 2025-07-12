// ignore_for_file: prefer_const_constructors, sort_child_properties_last, prefer_const_literals_to_create_immutables, unused_local_variable, prefer_interpolation_to_compose_strings, avoid_print, use_build_context_synchronously, unused_field, non_constant_identifier_names, unused_element, deprecated_member_use, prefer_typing_uninitialized_variables
import 'dart:convert';
import 'dart:io';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:goproperti/Api/config.dart';
import 'package:goproperti/Api/data_store.dart';
import 'package:goproperti/controller/faq_controller.dart';
import 'package:goproperti/controller/login_controller.dart';
import 'package:goproperti/controller/mybooking_controller.dart';
import 'package:goproperti/controller/pagelist_controller.dart';
import 'package:goproperti/controller/selectcountry_controller.dart';
import 'package:goproperti/controller/signup_controller.dart';
import 'package:goproperti/controller/wallet_controller.dart';
import 'package:goproperti/firebase/chats_list.dart';
import 'package:goproperti/model/fontfamily_model.dart';
import 'package:goproperti/model/routes_helper.dart';
import 'package:goproperti/screen/login_screen.dart';
import 'package:goproperti/utils/Colors.dart';
import 'package:goproperti/utils/Dark_lightmode.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool isdark = false;
  LoginController loginController = Get.find();

  PageListController pageListController = Get.find();
  WalletController walletController = Get.find();
  FaqController faqController = Get.find();
  MyBookingController myBookingController = Get.find();
  SelectCountryController selectCountryController = Get.find();

  String userName = "";
  SharedPreferences? prefs;

  String? path;
  String? networkimage;
  String? base64Image;
  final ImagePicker imgpicker = ImagePicker();
  PickedFile? imageFile;
  List imageList = [];

  @override
  void initState() {
    getdarkmodepreviousstate();
    super.initState();
    getData.read("UserLogin") != null
        ? setState(() {
            userName = getData.read("UserLogin")["name"] ?? "";
            networkimage = getData.read("UserLogin")["pro_pic"] ?? "";
            getData.read("UserLogin")["pro_pic"] != "null"
                ? setState(() {
                    networkimageconvert();
                  })
                : const SizedBox();
          })
        : null;
  }

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

  networkimageconvert() {
    (() async {
      http.Response response =
          await http.get(Uri.parse(Config.imageUrl + networkimage.toString()));
      if (mounted) {
        print(response.bodyBytes);
        setState(() {
          base64Image = const Base64Encoder().convert(response.bodyBytes);
        });
      }
    })();
  }

  @override
  Widget build(BuildContext context) {
    notifire = Provider.of<ColorNotifire>(context, listen: true);
    return WillPopScope(
      onWillPop: () async {
        return false;
      },
      child: Scaffold(
        backgroundColor: notifire.getbgcolor,
        appBar: AppBar(
          backgroundColor: notifire.getbgcolor,
          elevation: 0,
          leading: Padding(
            padding: const EdgeInsets.only(top: 15, left: 14, bottom: 15),
            child: Image.asset(
              "assets/images/applogo.png",
              height: 10,
              width: 10,
            ),
          ),
          title: Text(
            "Profile".tr,
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
          child: GetBuilder<SignUpController>(builder: (context) {
            return SingleChildScrollView(
              physics: BouncingScrollPhysics(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  SizedBox(
                    height: 20,
                  ),
                  GetBuilder<LoginController>(builder: (context) {
                    return Stack(
                      children: [
                        InkWell(
                          onTap: () {
                            _openGallery(Get.context!);
                          },
                          child: SizedBox(
                            height: 120,
                            width: 120,
                            child: path == null
                                ? networkimage != ""
                                    ? ClipRRect(
                                        borderRadius: BorderRadius.circular(80),
                                        child: Image.network(
                                          "${Config.imageUrl}${networkimage ?? ""}",
                                          fit: BoxFit.cover,
                                        ),
                                      )
                                    : CircleAvatar(
                                        backgroundColor: Colors.transparent,
                                        radius: Get.height / 17,
                                        child: Image.asset(
                                          "assets/images/profile-default.png",
                                          fit: BoxFit.cover,
                                        ),
                                      )
                                : ClipRRect(
                                    borderRadius: BorderRadius.circular(80),
                                    child: Image.file(
                                      File(path.toString()),
                                      width: Get.width,
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                          ),
                        ),
                        Positioned(
                          bottom: 5,
                          right: -5,
                          child: InkWell(
                            onTap: () {
                              _openGallery(Get.context!);
                            },
                            child: Container(
                              height: 45,
                              width: 45,
                              padding: EdgeInsets.all(7),
                              child: Image.asset(
                                "assets/images/Edit.png",
                              ),
                            ),
                          ),
                        ),
                      ],
                    );
                  }),
                  SizedBox(
                    height: 10,
                  ),
                  Text(
                    userName,
                    style: TextStyle(
                      fontFamily: FontFamily.gilroyBold,
                      fontSize: 20,
                      color: notifire.getwhiteblackcolor,
                    ),
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Divider(
                      color: notifire.getborderColor,
                    ),
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  settingWidget(
                    name: "My Booking".tr,
                    imagePath: "assets/images/Calendar.png",
                    onTap: () {
                      myBookingController.statusWiseBooking();
                      Get.toNamed(Routes.mybookingScreen);
                    },
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  settingWidget(
                    name: "Wallet".tr,
                    imagePath: "assets/images/Wallet.png",
                    onTap: () {
                      Get.toNamed(Routes.walletScreen);
                    },
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  settingWidget(
                    name: "Chat".tr,
                    imagePath: "assets/images/Chat.png",
                    onTap: () {
                      Get.to(ChatList());
                    },
                  ),
                  SizedBox(
                    height: 5,
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Divider(
                      color: notifire.getborderColor,
                      thickness: 1,
                    ),
                  ),
                  SizedBox(
                    height: 5,
                  ),
                  settingWidget(
                    name: "Profile".tr,
                    imagePath: "assets/images/user.png",
                    onTap: () {
                      Get.toNamed(Routes.viewProfileScreen);
                    },
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  settingWidget(
                    name: "Notification".tr,
                    imagePath: "assets/images/Notification.png",
                    onTap: () {
                      Get.toNamed(Routes.notificationScreen);
                    },
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  SizedBox(
                    height: 40,
                    width: Get.size.width,
                    child: InkWell(
                      onTap: () {
                        selectCountryController.getCountryApi().then(
                              (value) =>
                                  Get.toNamed(Routes.selectCountryScreen),
                            );
                      },
                      child: Row(
                        children: [
                          SizedBox(
                            width: 20,
                          ),
                          Image.asset(
                            "assets/images/Locationa.png",
                            height: 35,
                            width: 30,
                            color: notifire.getwhiteblackcolor,
                          ),
                          SizedBox(
                            width: 15,
                          ),
                          Text(
                            "Country".tr,
                            style: TextStyle(
                              fontFamily: FontFamily.gilroyMedium,
                              fontSize: 16,
                              color: notifire.getwhiteblackcolor,
                            ),
                          ),
                          Spacer(),
                          Text(
                            getData.read("countryName") == ""
                                ? ""
                                : getData.read("countryName"),
                            style: TextStyle(
                              fontFamily: FontFamily.gilroyMedium,
                              fontSize: 16,
                              color: notifire.getwhiteblackcolor,
                            ),
                          ),
                          Icon(
                            Icons.arrow_forward_ios,
                            size: 17,
                            color: notifire.getwhiteblackcolor,
                          ),
                          SizedBox(
                            width: 20,
                          ),
                        ],
                      ),
                    ),
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  SizedBox(
                    height: 40,
                    width: Get.size.width,
                    child: InkWell(
                      onTap: () {
                        Get.toNamed(Routes.languageScreen);
                      },
                      child: Row(
                        children: [
                          SizedBox(
                            width: 20,
                          ),
                          Image.asset(
                            "assets/images/Help Center.png",
                            height: 35,
                            width: 30,
                            color: notifire.getwhiteblackcolor,
                          ),
                          SizedBox(
                            width: 15,
                          ),
                          Text(
                            "Language".tr,
                            style: TextStyle(
                              fontFamily: FontFamily.gilroyMedium,
                              fontSize: 16,
                              color: notifire.getwhiteblackcolor,
                            ),
                          ),
                          Spacer(),
                          Text(
                            "English(US)".tr,
                            style: TextStyle(
                              fontFamily: FontFamily.gilroyMedium,
                              fontSize: 16,
                              color: notifire.getwhiteblackcolor,
                            ),
                          ),
                          Icon(
                            Icons.arrow_forward_ios,
                            size: 17,
                            color: notifire.getwhiteblackcolor,
                          ),
                          SizedBox(
                            width: 20,
                          ),
                        ],
                      ),
                    ),
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  darkModeWidget(),
                  SizedBox(
                    height: 10,
                  ),
                  GetBuilder<PageListController>(builder: (context) {
                    return pageListController.isLodding
                        ? ListView.builder(
                            itemCount: pageListController
                                .pageListInfo?.pagelist!.length,
                            shrinkWrap: true,
                            itemExtent: 60,
                            physics: const NeverScrollableScrollPhysics(),
                            padding: EdgeInsets.zero,
                            itemBuilder: (context, index) {
                              return InkWell(
                                child: Column(
                                  children: [
                                    settingWidget(
                                      name: pageListController
                                          .pageListInfo?.pagelist![index].title,
                                      imagePath:
                                          "assets/images/documentpage.png",
                                      onTap: () {
                                        Get.toNamed(Routes.loreamScreen,
                                            arguments: {
                                              "title": pageListController
                                                  .pageListInfo
                                                  ?.pagelist![index]
                                                  .title,
                                              "discription": pageListController
                                                  .pageListInfo
                                                  ?.pagelist![index]
                                                  .description,
                                            });
                                      },
                                    ),
                                  ],
                                ),
                              );
                            },
                          )
                        : Center(
                            child: CircularProgressIndicator(),
                          );
                  }),
                  settingWidget(
                    name: "Help Center".tr,
                    imagePath: "assets/images/Help Center.png",
                    onTap: () {
                      faqController.getFaqDataApi();
                      Get.toNamed(Routes.faqScreen);
                    },
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  settingWidget(
                    name: "Invite Friends".tr,
                    imagePath: "assets/images/invite friends.png",
                    onTap: () {
                      walletController.getReferData();
                      Get.toNamed(Routes.referFriendScreen);
                    },
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  GetBuilder<PageListController>(builder: (context) {
                    return InkWell(
                      onTap: () {
                        deleteSheet();
                      },
                      child: SizedBox(
                        height: 45,
                        width: Get.size.width,
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            SizedBox(
                              width: 20,
                            ),
                            Image.asset(
                              "assets/images/Delete.png",
                              height: 30,
                              width: 25,
                              color: notifire.getwhiteblackcolor,
                            ),
                            SizedBox(
                              width: 15,
                            ),
                            Text(
                              "Delete Account".tr,
                              style: TextStyle(
                                fontFamily: FontFamily.gilroyMedium,
                                fontSize: 16,
                                color: notifire.getwhiteblackcolor,
                              ),
                            ),
                            Spacer(),
                            Icon(
                              Icons.arrow_forward_ios,
                              size: 17,
                              color: notifire.getwhiteblackcolor,
                            ),
                            SizedBox(
                              width: 20,
                            ),
                          ],
                        ),
                      ),
                    );
                  }),
                  SizedBox(
                    height: 10,
                  ),
                  InkWell(
                    onTap: () {
                      logoutSheet();
                    },
                    child: SizedBox(
                      height: 40,
                      width: Get.size.width,
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          SizedBox(
                            width: 20,
                          ),
                          Image.asset(
                            "assets/images/Logout.png",
                            height: 35,
                            width: 30,
                            color: notifire.getredcolor,
                          ),
                          SizedBox(
                            width: 15,
                          ),
                          Text(
                            "Logout".tr,
                            style: TextStyle(
                              fontFamily: FontFamily.gilroyMedium,
                              fontSize: 16,
                              color: notifire.getredcolor,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  SizedBox(
                    height: 30,
                  ),
                ],
              ),
            );
          }),
        ),
      ),
    );
  }

  Future<dynamic> tokenemty() async {
    CollectionReference collectionReference =
        FirebaseFirestore.instance.collection('users');
    collectionReference
        .doc(getData.read("UserLogin")["id"])
        .update({"token": ""});
  }

  Widget settingWidget({Function()? onTap, String? name, String? imagePath}) {
    return InkWell(
      onTap: onTap,
      child: SizedBox(
        height: 45,
        width: Get.size.width,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            SizedBox(
              width: 20,
            ),
            Image.asset(
              imagePath ?? "",
              height: 35,
              width: 30,
              color: notifire.getwhiteblackcolor,
            ),
            SizedBox(
              width: 15,
            ),
            Text(
              name ?? "",
              style: TextStyle(
                fontFamily: FontFamily.gilroyMedium,
                fontSize: 16,
                color: notifire.getwhiteblackcolor,
              ),
            ),
            Spacer(),
            Icon(
              Icons.arrow_forward_ios,
              size: 17,
              color: notifire.getwhiteblackcolor,
            ),
            SizedBox(
              width: 20,
            ),
          ],
        ),
      ),
    );
  }

  Widget darkModeWidget() {
    return SizedBox(
      height: 40,
      width: Get.size.width,
      child: Row(
        children: [
          SizedBox(
            width: 20,
          ),
          Image.asset(
            "assets/images/sun.png",
            height: 35,
            width: 30,
            color: notifire.getwhiteblackcolor,
          ),
          SizedBox(
            width: 15,
          ),
          Text(
            "Dark Mode".tr,
            style: TextStyle(
              fontFamily: FontFamily.gilroyMedium,
              fontSize: 16,
              color: notifire.getwhiteblackcolor,
            ),
          ),
          Spacer(),
          Transform.scale(
            scale: 0.7,
            child: CupertinoSwitch(
              activeColor: Darkblue,
              value: notifire.isDark,
              onChanged: (value) async {
                setState(() {
                  notifire.isDark = value;
                });
                final prefs = await SharedPreferences.getInstance();
                setState(() {
                  notifire.setIsDark = value;
                  prefs.setBool("setIsDark", value);
                });
              },
            ),
          ),
          SizedBox(
            width: 10,
          ),
        ],
      ),
    );
  }

  Future logoutSheet() {
    return Get.bottomSheet(
      Container(
        height: 220,
        width: Get.size.width,
        child: Column(
          children: [
            SizedBox(
              height: 20,
            ),
            Text(
              "Logout".tr,
              style: TextStyle(
                fontSize: 20,
                fontFamily: FontFamily.gilroyBold,
                color: RedColor,
              ),
            ),
            SizedBox(
              height: 20,
            ),
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 20,
              ),
              child: Divider(
                color: notifire.getborderColor,
              ),
            ),
            SizedBox(
              height: 10,
            ),
            Text(
              "Are you sure you want to log out?".tr,
              style: TextStyle(
                fontFamily: FontFamily.gilroyMedium,
                fontSize: 16,
                color: notifire.getwhiteblackcolor,
              ),
            ),
            SizedBox(
              height: 10,
            ),
            Row(
              children: [
                Expanded(
                  child: InkWell(
                    onTap: () {
                      Get.back();
                    },
                    child: Container(
                      height: 60,
                      margin: EdgeInsets.all(15),
                      alignment: Alignment.center,
                      child: Text(
                        "Cancle".tr,
                        style: TextStyle(
                          color: blueColor,
                          fontFamily: FontFamily.gilroyBold,
                          fontSize: 16,
                        ),
                      ),
                      decoration: BoxDecoration(
                        color: Color(0xFFeef4ff),
                        borderRadius: BorderRadius.circular(45),
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: InkWell(
                    onTap: () async {
                      final prefs = await SharedPreferences.getInstance();
                      setState(() async {
                        save('isLoginBack', true);
                        await prefs.remove('Firstuser');
                        getData.remove("UserLogin");
                        getData.remove("countryId");
                        getData.remove("countryName");
                        getData.remove("currentIndex");
                        tokenemty();

                        Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                                builder: (context) => LoginScreen()));
                      });
                    },
                    child: Container(
                      height: 60,
                      margin: EdgeInsets.all(15),
                      alignment: Alignment.center,
                      child: Text(
                        "Yes, Logout".tr,
                        style: TextStyle(
                          color: WhiteColor,
                          fontFamily: FontFamily.gilroyBold,
                          fontSize: 16,
                        ),
                      ),
                      decoration: BoxDecoration(
                        color: blueColor,
                        borderRadius: BorderRadius.circular(45),
                      ),
                    ),
                  ),
                )
              ],
            )
          ],
        ),
        decoration: BoxDecoration(
          color: notifire.getbgcolor,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(20),
            topRight: Radius.circular(20),
          ),
        ),
      ),
    );
  }

  void _openGallery(BuildContext context) async {
    final pickedFile =
        await ImagePicker().pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      path = pickedFile.path;
      setState(() {});
      File imageFile = File(path.toString());
      List<int> imageBytes = imageFile.readAsBytesSync();
      base64Image = base64Encode(imageBytes);
      loginController.updateProfileImage(base64Image);
      setState(() {});
    }
  }

  Future deleteSheet() {
    return Get.bottomSheet(
      Container(
        height: 220,
        width: Get.size.width,
        child: Column(
          children: [
            SizedBox(
              height: 20,
            ),
            Text(
              "Delete Account".tr,
              style: TextStyle(
                fontSize: 20,
                fontFamily: FontFamily.gilroyBold,
                color: RedColor,
              ),
            ),
            SizedBox(
              height: 20,
            ),
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 20,
              ),
              child: Divider(
                color: notifire.getgreycolor,
              ),
            ),
            SizedBox(
              height: 10,
            ),
            Text(
              "Are you sure you want to delete account?".tr,
              style: TextStyle(
                fontFamily: FontFamily.gilroyMedium,
                fontSize: 16,
                color: notifire.getwhiteblackcolor,
              ),
            ),
            SizedBox(
              height: 10,
            ),
            Row(
              children: [
                Expanded(
                  child: InkWell(
                    onTap: () {
                      Get.back();
                    },
                    child: Container(
                      height: 60,
                      margin: EdgeInsets.all(15),
                      alignment: Alignment.center,
                      child: Text(
                        "Cancle".tr,
                        style: TextStyle(
                          color: blueColor,
                          fontFamily: FontFamily.gilroyBold,
                          fontSize: 16,
                        ),
                      ),
                      decoration: BoxDecoration(
                        color: Color(0xFFeef4ff),
                        borderRadius: BorderRadius.circular(45),
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: InkWell(
                    onTap: () {
                      pageListController.deletAccount();
                    },
                    child: Container(
                      height: 60,
                      margin: EdgeInsets.all(15),
                      alignment: Alignment.center,
                      child: Text(
                        "Yes, Remove".tr,
                        style: TextStyle(
                          color: WhiteColor,
                          fontFamily: FontFamily.gilroyBold,
                          fontSize: 16,
                        ),
                      ),
                      decoration: BoxDecoration(
                        color: blueColor,
                        borderRadius: BorderRadius.circular(45),
                      ),
                    ),
                  ),
                )
              ],
            )
          ],
        ),
        decoration: BoxDecoration(
          color: notifire.getbgcolor,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(20),
            topRight: Radius.circular(20),
          ),
        ),
      ),
    );
  }
}

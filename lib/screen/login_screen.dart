// ignore_for_file: prefer_const_constructors, sort_child_properties_last, must_be_immutable, use_key_in_widget_constructors, unused_element, avoid_print, prefer_interpolation_to_compose_strings

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:goproperti/Api/config.dart';
import 'package:goproperti/Api/data_store.dart';
import 'package:goproperti/controller/homepage_controller.dart';
import 'package:goproperti/controller/login_controller.dart';
import 'package:goproperti/controller/selectcountry_controller.dart';
import 'package:goproperti/model/fontfamily_model.dart';
import 'package:goproperti/model/routes_helper.dart';
import 'package:goproperti/utils/Colors.dart';
import 'package:goproperti/utils/Custom_widget.dart';
import 'package:goproperti/utils/Dark_lightmode.dart';
import 'package:intl_phone_field/intl_phone_field.dart';
import 'package:onesignal_flutter/onesignal_flutter.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../controller/dashboard_controller.dart';
import '../controller/search_controller.dart';

class LoginScreen extends StatefulWidget {
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {

  LoginController loginController = Get.find();
  DashBoardController dashBoardController = Get.find();
  HomePageController homePageController = Get.find();
  SelectCountryController selectCountryController = Get.find();
  SearchPropertyController searchController = Get.find();

  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  FocusNode focusNode = FocusNode();

  String cuntryCode = "";

  late ColorNotifire notifire;

  bool isvalidate = false;

  int countrySelected = 0;

  Future getCountryData() async{
    selectCountryController.getCountryApi().then((value){
      for(int a = 0; a < selectCountryController.countryInfo!.countryData!.length; a++){
        if(selectCountryController.countryInfo?.countryData![a].dCon == "1"){
          setState(() {
            countrySelected = a;
          });
        }
      }
    });
  }

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
    loginController.number.text = "";
    loginController.password.text = "";
    getCountryData();
    selectCountryController.getCountryApi().then((value){
      for(int a = 0; a < selectCountryController.countryInfo!.countryData!.length; a++){
        if(selectCountryController.countryInfo?.countryData![a].dCon == "1"){
          setState(() {
            countrySelected = a;
          });
        }
      }
    });
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
        resizeToAvoidBottomInset: false,
        body: SafeArea(
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                InkWell(
                  onTap: () {
                    getData.read('isLoginBack')
                        ? Get.toNamed(Routes.bottoBarScreen)
                        : Get.back();
                  },
                  child: Container(
                    height: 50,
                    width: 50,
                    alignment: Alignment.center,
                    padding: EdgeInsets.all(15),
                    margin: EdgeInsets.only(left: 10),
                    child: Image.asset(
                      'assets/images/back.png',
                      color: notifire.getwhiteblackcolor,
                    ),
                    decoration: BoxDecoration(
                      color: notifire.getboxcolor,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
                SizedBox(
                  height: 20,
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 15),
                  child: Text(
                    "Let's sign you in.".tr,
                    style: TextStyle(
                      fontSize: 25,
                      fontFamily: FontFamily.gilroyBold,
                      color: notifire.getwhiteblackcolor,
                    ),
                  ),
                ),
                SizedBox(
                  height: 15,
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 15),
                  child: Text(
                    "Welcome back. You've been missed!".tr,
                    style: TextStyle(
                      fontFamily: FontFamily.gilroyMedium,
                      color: notifire.getwhiteblackcolor,
                    ),
                  ),
                ),
                SizedBox(
                  height: 20,
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 15),
                  child: IntlPhoneField(
                    disableLengthCheck: true,
                    initialCountryCode: "IN",
                    keyboardType: TextInputType.number,
                    cursorColor: notifire.getwhiteblackcolor,
                    inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                    controller: loginController.number,
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                    dropdownIcon: Icon(
                      Icons.arrow_drop_down,
                      color: notifire.getgreycolor,
                    ),
                    dropdownTextStyle: TextStyle(
                      color: notifire.getgreycolor,
                    ),
                    style: TextStyle(
                      fontFamily: FontFamily.gilroyBold,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: notifire.getwhiteblackcolor,
                    ),
                    onCountryChanged: (value) {
                      loginController.number.text = '';
                      loginController.password.text = '';
                    },
                    onChanged: (value) {
                      setState(() {
                        if (loginController.number.text.isNotEmpty) {
                          isvalidate = false;
                        } else {
                          isvalidate = true;
                        }
                      });

                      cuntryCode = value.countryCode;
                    },
                    decoration: InputDecoration(
                      helperText: null,
                      labelText: "Mobile Number".tr,
                      labelStyle: TextStyle(
                        color: notifire.getgreycolor,
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(15),
                        borderSide: BorderSide(
                          color: isvalidate ? Colors.red.shade700 : blueColor,
                        ),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: isvalidate
                              ? Colors.red.shade700
                              : notifire.getborderColor,
                        ),
                        borderRadius: BorderRadius.circular(15),
                      ),
                      border: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: isvalidate
                              ? Colors.red.shade700
                              : notifire.getborderColor,
                        ),
                        borderRadius: BorderRadius.circular(15),
                      ),
                    ),
                    invalidNumberMessage: "Please enter your mobile number".tr,
                    validator: (p0) {
                      if (loginController.number.text.isEmpty) {
                        return 'Please enter your number';
                      } else {}
                      return null;
                    },
                  ),
                ),
                SizedBox(
                  height: 20,
                ),
                GetBuilder<LoginController>(builder: (context) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 15),
                    child: TextFormField(
                      controller: loginController.password,
                      obscureText: loginController.showPassword,
                      cursorColor: notifire.getwhiteblackcolor,
                      autovalidateMode: AutovalidateMode.onUserInteraction,
                      style: TextStyle(
                        fontFamily: FontFamily.gilroyBold,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: notifire.getwhiteblackcolor,
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your password'.tr;
                        }
                        return null;
                      },
                      decoration: InputDecoration(
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                          borderSide: BorderSide(color: blueColor),
                        ),
                        border: OutlineInputBorder(
                          borderSide: BorderSide(
                            color: notifire.getborderColor,
                          ),
                          borderRadius: BorderRadius.circular(15),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(
                            color: notifire.getborderColor,
                          ),
                          borderRadius: BorderRadius.circular(15),
                        ),
                        suffixIcon: InkWell(
                          onTap: () {
                            loginController.showOfPassword();
                          },
                          child: !loginController.showPassword
                              ? Padding(
                                  padding: const EdgeInsets.all(10),
                                  child: Image.asset(
                                    "assets/images/showpassowrd.png",
                                    height: 10,
                                    width: 10,
                                    color: notifire.getgreycolor,
                                  ),
                                )
                              : Padding(
                                  padding: const EdgeInsets.all(10),
                                  child: Image.asset(
                                    "assets/images/HidePassword.png",
                                    height: 10,
                                    width: 10,
                                    color: notifire.getgreycolor,
                                  ),
                                ),
                        ),
                        prefixIcon: Padding(
                          padding: const EdgeInsets.all(10),
                          child: Image.asset(
                            "assets/images/Unlock.png",
                            height: 10,
                            width: 10,
                            color: notifire.getgreycolor,
                          ),
                        ),
                        labelText: "Password".tr,
                        labelStyle: TextStyle(
                          color: notifire.getgreycolor,
                        ),
                      ),
                    ),
                  );
                }),
                Row(
                  children: [
                    Expanded(
                      child: GetBuilder<LoginController>(builder: (context) {
                        return Row(
                          children: [
                            Theme(
                              data:
                                  ThemeData(unselectedWidgetColor: BlackColor),
                              child: Checkbox(
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(4)),
                                value: loginController.isChecked,
                                activeColor: BlackColor,
                                onChanged: (value) async {
                                  loginController.changeRememberMe(value);
                                  final prefs =
                                      await SharedPreferences.getInstance();
                                  await prefs.setBool('Remember', true);
                                },
                              ),
                            ),
                            Text(
                              "Remember me".tr,
                              style: TextStyle(
                                fontSize: 14,
                                fontFamily: "Gilroy Medium",
                                color: notifire.getwhiteblackcolor,
                              ),
                            ),
                          ],
                        );
                      }),
                    ),
                    InkWell(
                      onTap: () {
                        Get.toNamed(Routes.resetPassword);
                      },
                      child: Container(
                        margin: EdgeInsets.all(10),
                        child: Text(
                          "Forgot Password?".tr,
                          style: TextStyle(
                            fontFamily: FontFamily.gilroyBold,
                            color: blueColor,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(
                  height: 20,
                ),
                GestButton(
                  Width: Get.size.width,
                  height: 50,
                  buttoncolor: blueColor,
                  margin: EdgeInsets.only(top: 15, left: 30, right: 30),
                  buttontext: "Login".tr,
                  style: TextStyle(
                    fontFamily: FontFamily.gilroyBold,
                    color: WhiteColor,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                  onclick: () async {
                    setState(() {
                      if (loginController.number.text.isNotEmpty) {
                        isvalidate = false;
                      } else {
                        isvalidate = true;
                      }
                    });

                    _formKey.currentState?.validate();

                    if (_formKey.currentState?.validate() ?? false) {
                      initPlatformState();
                      loginController.getLoginApiData(cuntryCode, context).then((value) {

                              if (value["Result"] == "true") {
                                if(getData.read("userType") == "admin") {
                                  dashBoardController.getDashBoardData().then((value) {
                                    Get.offAndToNamed(Routes.membershipScreen);
                                  },);
                                }  else {
                              setState(() {
                                save(
                                    "countryId",
                                    selectCountryController
                                            .countryInfo
                                            ?.countryData![countrySelected].id ?? "");
                                save(
                                    "countryName", selectCountryController
                                            .countryInfo
                                            ?.countryData![countrySelected]
                                            .title ?? "");
                              });

                              selectCountryController
                                  .changeCountryIndex(countrySelected);

                              homePageController.getCatWiseData(
                                  countryId: getData.read("countryId"),
                                  cId: "0");
                              searchController.getSearchData(
                                  countryId: getData.read("countryId"));
                              homePageController.getHomeDataApi(
                                  countryId: getData.read("countryId")).then((value) {
                                Get.offAndToNamed(Routes.bottoBarScreen);
                                  },);
                            }
                          } else {
                                showToastMessage(value["ResponseMsg"]);
                              }
                      },);
                    } else {}
                  },
                ),
                SizedBox(
                  height: 20,
                ),
                Container(
                  alignment: Alignment.center,
                  child: Text(
                    "OR".tr,
                    style: TextStyle(
                      fontFamily: FontFamily.gilroyMedium,
                      color: notifire.getwhiteblackcolor,
                    ),
                  ),
                ),
                SizedBox(
                  height: 20,
                ),
                GestButton(
                  Width: Get.size.width,
                  height: 50,
                  margin: EdgeInsets.only(top: 15, left: 30, right: 30),
                  buttoncolor: notifire.getboxcolor,
                  buttontext: "Continue as a Guest".tr,
                  onclick: () {

                    setState(() {
                      save("countryId", selectCountryController.countryInfo?.countryData![countrySelected].id ?? "");
                      save("countryName", selectCountryController.countryInfo?.countryData![countrySelected].title ?? "");
                    });

                    selectCountryController.changeCountryIndex(countrySelected);
                    homePageController.getHomeDataApi(
                        countryId: getData.read("countryId"));
                    homePageController.getCatWiseData(countryId: getData.read("countryId"), cId: "0");
                    searchController.getSearchData(
                        countryId: getData.read("countryId"));
                    Get.offAndToNamed(Routes.bottoBarScreen);
                    save('isLoginBack', true);

                  },
                  style: TextStyle(
                    fontFamily: FontFamily.gilroyBold,
                    color: notifire.getwhiteblackcolor,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(
                  height: 20,
                ),
                Expanded(
                  flex: 1,
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 15),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          "Don't have an account?".tr,
                          style: TextStyle(
                            fontFamily: FontFamily.gilroyMedium,
                            color: notifire.getgreycolor,
                          ),
                        ),
                        InkWell(
                          onTap: () {
                            Get.toNamed(Routes.signUpScreen);
                          },
                          child: Text(
                            "Sign Up".tr,
                            style: TextStyle(
                              color: blueColor,
                              fontFamily: FontFamily.gilroyBold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> initPlatformState() async {
    OneSignal.shared.setAppId(Config.oneSignel);
    OneSignal.shared
        .promptUserForPushNotificationPermission()
        .then((accepted) {});
    OneSignal.shared.setPermissionObserver((OSPermissionStateChanges changes) {
      print("Accepted OSPermissionStateChanges : $changes");
    });
  }
}

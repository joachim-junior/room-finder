// ignore_for_file: prefer_const_constructors, use_key_in_widget_constructors, prefer_const_literals_to_create_immutables

import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:get/get.dart';
import 'package:goproperti/Api/data_store.dart';
import 'package:goproperti/controller/homepage_controller.dart';
import 'package:goproperti/controller/selectcountry_controller.dart';
import 'package:goproperti/model/appbaner_model.dart';
import 'package:goproperti/model/fontfamily_model.dart';
import 'package:goproperti/model/routes_helper.dart';
import 'package:goproperti/screen/login_screen.dart';
import 'package:goproperti/utils/Colors.dart';
import 'package:goproperti/utils/Custom_widget.dart';
import 'package:goproperti/utils/Dark_lightmode.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../controller/search_controller.dart';
import 'home_screen.dart';

class OnBordingScreen extends StatefulWidget {
  const OnBordingScreen({super.key});

  @override
  State<OnBordingScreen> createState() => _OnBordingScreenState();
}

class _OnBordingScreenState extends State<OnBordingScreen> {

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    getStorage();
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

  Future getStorage() async{
    final storagePermissionStatus = await Permission.storage.request();
  }

  Future getLocation() async {

    final permission = await Permission.location.request();
    // LocationPermission permission;
    // permission = await Geolocator.checkPermission();
    // permission = await Geolocator.requestPermission();
    if (permission.isDenied) {
      lat = 0.0;
      long = 0.0;
    } else {
    }
  }

  int selectIndex = 0;

  HomePageController homePageController = Get.find();
  SearchPropertyController searchController = Get.find();
  SelectCountryController selectCountryController = Get.find();

  int countrySelected = 0;
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
  Widget build(BuildContext context) {
    notifire = Provider.of<ColorNotifire>(context, listen: true);
    return Scaffold(
      backgroundColor: notifire.getbgcolor,
      body: SafeArea(
        child: SingleChildScrollView(
          physics: BouncingScrollPhysics(),
          child: SizedBox(
            height: Get.size.height,
            width: Get.size.width,
            child: Column(
              children: [
                Expanded(
                  child: Column(
                    children: [
                      Expanded(
                        child: PageView.builder(
                          itemCount: appbaner.length,
                          physics: BouncingScrollPhysics(),
                          itemBuilder: (context, index) {
                            return Container(
                              margin: EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(15),
                                image: DecorationImage(
                                  image: AssetImage(appbaner[index].image),
                                  fit: BoxFit.cover,
                                ),
                              ),
                            );
                          },
                          onPageChanged: (value) {
                            setState(() {
                              selectIndex = value;
                            });
                          },
                        ),
                      ),
                      SizedBox(
                        height: 25,
                        width: Get.size.width,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            ...List.generate(appbaner.length, (index) {
                              return Indicator(
                                isActive: selectIndex == index ? true : false,
                              );
                            }),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "The Perfect choice for".tr,
                        style: TextStyle(
                          fontSize: 22,
                          fontFamily: FontFamily.gilroyBold,
                          color: notifire.getwhiteblackcolor,
                        ),
                      ),
                      Text(
                        "your future".tr,
                        style: TextStyle(
                          fontSize: 22,
                          fontFamily: FontFamily.gilroyBold,
                          color: notifire.getwhiteblackcolor,
                        ),
                      ),
                      SizedBox(
                        height: 20,
                      ),
                      Button(
                        Width: Get.size.width,
                        buttoncolor: Darkblue,
                        buttontext: "Login With Phone Number".tr,
                        onclick: () {
                          Get.to(LoginScreen());
                          save('isLoginBack', false);
                        },
                      ),
                      SizedBox(
                        height: 10,
                      ),
                      Text(
                        "OR".tr,
                        style: TextStyle(
                          fontFamily: FontFamily.gilroyMedium,
                          color: notifire.getwhiteblackcolor,
                        ),
                      ),
                      SizedBox(
                        height: 10,
                      ),
                      GestButton(
                        Width: Get.size.width,
                        height: 50,
                        buttoncolor: notifire.getboxcolor,
                        margin: EdgeInsets.only(top: 15, left: 30, right: 30),
                        buttontext: "Continue as a Guest".tr,
                        onclick: () {
                          setState(() {
                            save("countryId", selectCountryController.countryInfo?.countryData![countrySelected].id ?? "");
                            save("countryName", selectCountryController.countryInfo?.countryData![countrySelected].title ?? "");
                          });
                            selectCountryController.changeCountryIndex(countrySelected);
                            homePageController.getHomeDataApi(
                                countryId: getData.read("countryId"));

                            searchController.getSearchData(
                                countryId: getData.read("countryId"));
                              homePageController.getCatWiseData(countryId: getData.read("countryId"), cId: "0").then((value) {
                                Get.offAndToNamed(Routes.bottoBarScreen);
                              },);
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
                        height: 15,
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
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
                              " Sign Up".tr,
                              style: TextStyle(
                                color: blueColor,
                                fontFamily: FontFamily.gilroyBold,
                              ),
                            ),
                          ),
                        ],
                      )
                    ],
                  ),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class Indicator extends StatelessWidget {
  final bool isActive;
  const Indicator({required this.isActive});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Container(
        height: 10,
        width: 10,
        decoration: BoxDecoration(
          color: isActive ? Colors.blue : Colors.grey,
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }
}

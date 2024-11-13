// ignore_for_file: sort_child_properties_last, prefer_const_constructors, unnecessary_brace_in_string_interps, unnecessary_string_interpolations

import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:get/get.dart';
import 'package:goproperti/Api/config.dart';
import 'package:goproperti/Api/data_store.dart';
import 'package:goproperti/controller/homepage_controller.dart';
import 'package:goproperti/controller/signup_controller.dart';
import 'package:goproperti/model/fontfamily_model.dart';
import 'package:goproperti/model/routes_helper.dart';
import 'package:goproperti/screen/home_screen.dart';
import 'package:goproperti/utils/Colors.dart';
import 'package:goproperti/utils/Dark_lightmode.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class OurRecommendationScreen extends StatefulWidget {
  const OurRecommendationScreen({super.key});

  @override
  State<OurRecommendationScreen> createState() =>
      _OurRecommendationScreenState();
}

class _OurRecommendationScreenState extends State<OurRecommendationScreen> {
  late ColorNotifire notifire;
  SignUpController signUpController = Get.find();
  HomePageController homePageController = Get.find();

  int ourCurrentIndex = 0;

  List facilities = [
    "assets/images/beds.svg",
    "assets/images/bath.svg",
    "assets/images/sqft.svg",
  ];

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
    homePageController.getCatWiseData(countryId: getData.read("countryId"),cId: "0");
    super.initState();
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
          leading: IconButton(
            onPressed: () {
              homePageController.getCatWiseData(countryId: getData.read("countryId"), cId: "0").then((value) {
                homePageController.catCurrentIndex = 0;
                Get.back();
              },);
            },
            icon: Icon(
              Icons.arrow_back,
              color: notifire.getwhiteblackcolor,
            ),
          ),
          title: Text(
            "Our Recommendation".tr,
            style: TextStyle(
              fontSize: 17,
              fontFamily: FontFamily.gilroyBold,
              color: notifire.getwhiteblackcolor,
            ),
          ),
        ),
        body: homePageController.isCatWise ? GetBuilder<HomePageController>(builder: (context) {
          return Column(
            children: [
              SizedBox(
                height: 55,
                child: Padding(
                  padding: const EdgeInsets.only(left: 10),
                  child: ListView.builder(
                    itemCount: homePageController
                        .homeDatatInfo?.homeData!.catlist!.length,
                    scrollDirection: Axis.horizontal,
                    itemBuilder: (context, index) {
                      return InkWell(
                        onTap: () {
                          setState(() {
                            ourCurrentIndex = index;
                          });
                          homePageController.getCatWiseData(
                            cId: homePageController
                                .homeDatatInfo?.homeData!.catlist![index].id,
                            countryId: getData.read("countryId"),
                          );
                        },
                        child: Container(
                          height: 50,
                          padding: EdgeInsets.all(8),
                          margin: EdgeInsets.only(
                              left: 5, right: 5, top: 7, bottom: 7),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              FadeInImage.assetNetwork(
                                imageErrorBuilder: (context, error, stackTrace) {
                                return Center(child: Image.asset("assets/images/emty.gif",fit: BoxFit.cover,height: Get.height,),);
                                },
                                image:
                                "${Config.imageUrl}${homePageController.homeDatatInfo?.homeData!.catlist![index].img ?? ""}",
                                color:
                               ourCurrentIndex == index
                                    ? WhiteColor
                                    : blueColor,
                                placeholder:  "assets/images/ezgif.com-crop.gif",
                              ),
                              SizedBox(
                                width: 5,
                              ),
                              Text(
                                homePageController.homeDatatInfo?.homeData
                                        !.catlist![index].title ??
                                    "",
                                style: TextStyle(
                                  fontFamily: FontFamily.gilroyBold,
                                  color: ourCurrentIndex ==
                                          index
                                      ? WhiteColor
                                      : blueColor,
                                ),
                              ),
                            ],
                          ),
                          decoration: BoxDecoration(
                            border: Border.all(color: blueColor, width: 2),
                            borderRadius: BorderRadius.circular(25),
                            color: ourCurrentIndex == index
                                ? blueColor
                                : notifire.getbgcolor,
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),
              homePageController.isCatWise
                  ? Expanded(
                      child: homePageController
                              .catWiseInfo!.propertyCat!.isNotEmpty
                          ? Padding(
                        padding: const EdgeInsets.only(left: 10, right: 10, bottom: 10),
                            child: GridView.builder(
                                itemCount: homePageController
                                    .catWiseInfo?.propertyCat!.length,
                                gridDelegate:
                                    SliverGridDelegateWithFixedCrossAxisCount(
                                  crossAxisCount: 2,
                                  mainAxisExtent: 250,
                                ),
                                itemBuilder: (context, index1) {
                                  return InkWell(
                                    onTap: () async {
                                      setState(() {
                                        homePageController.rate =
                                            homePageController.catWiseInfo
                                                    ?.propertyCat![index1].rate ??
                                                "";
                                      });
                                      homePageController.chnageObjectIndex(index1);
                                      await homePageController
                                          .getPropertyDetailsApi(
                                        id: homePageController
                                            .catWiseInfo?.propertyCat![index1].id,
                                      );
                                      Get.toNamed(
                                        Routes.viewDataScreen,
                                      );
                                    },
                                    child: Container(
                                      height: 250,
                                      margin: EdgeInsets.all(8),
                                      child: Column(
                                        children: [
                                          Stack(
                                            children: [
                                              Container(
                                                height: 140,
                                                width: Get.size.width,
                                                margin: EdgeInsets.only(right: 8,left: 8,top: 8,),
                                                child: ClipRRect(
                                                  borderRadius:
                                                      BorderRadius.circular(15),
                                                  child: FadeInImage.assetNetwork(
                                                    fadeInCurve:
                                                        Curves.easeInCirc,
                                                    placeholder:
                                                        "assets/images/ezgif.com-crop.gif",
                                                    height: 130,
                                                    width: Get.size.width,
                                                    imageErrorBuilder: (context, error, stackTrace) {
                                                    return Center(child: Image.asset("assets/images/emty.gif",fit: BoxFit.cover,height: Get.height,),);
                                                    },
                                                    image:
                                                        "${Config.imageUrl}${homePageController.catWiseInfo?.propertyCat![index1].image ?? ""}",
                                                    fit: BoxFit.cover,
                                                  ),
                                                ),
                                              ),
                                              homePageController
                                                          .catWiseInfo
                                                          ?.propertyCat![index1]
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
                                                                      0, 0, 3, 0),
                                                              child: Image.asset(
                                                                "assets/images/Rating.png",
                                                                height: 15,
                                                                width: 15,
                                                              ),
                                                            ),
                                                            Text(
                                                              "${homePageController.catWiseInfo?.propertyCat![index1].rate ?? ""}",
                                                              style: TextStyle(
                                                                fontFamily: FontFamily
                                                                    .gilroyMedium,
                                                                color: blueColor,
                                                              ),
                                                            )
                                                          ],
                                                        ),
                                                        decoration: BoxDecoration(
                                                          color:
                                                              Color(0xFFedeeef),
                                                          borderRadius:
                                                              BorderRadius
                                                                  .circular(15),
                                                        ),
                                                      ),
                                                    )
                                                  : Positioned(
                                                      top: 15,
                                                      right: 20,
                                                      child: Container(
                                                        height: 30,
                                                        width: 60,
                                                        alignment:
                                                            Alignment.center,
                                                        child: Text(
                                                          "BUY".tr,
                                                          style: TextStyle(
                                                              color: blueColor,
                                                              fontWeight:
                                                                  FontWeight
                                                                      .w600),
                                                        ),
                                                        decoration: BoxDecoration(
                                                          color:
                                                              Color(0xFFedeeef),
                                                          borderRadius:
                                                              BorderRadius
                                                                  .circular(15),
                                                        ),
                                                      ),
                                                    ),
                                            ],
                                          ),
                                          Expanded(
                                            child: Container(
                                              height: 128,
                                              width: Get.size.width,
                                              margin: EdgeInsets.all(5),
                                              child: Column(
                                                crossAxisAlignment:
                                                    CrossAxisAlignment.start,
                                                children: [
                                                  Padding(
                                                    padding:
                                                        const EdgeInsets.only(
                                                            left: 10),
                                                    child: Text(
                                                      homePageController
                                                              .catWiseInfo
                                                              ?.propertyCat![index1]
                                                              .title ??
                                                          "",
                                                      maxLines: 1,
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
                                                  Padding(
                                                    padding:
                                                        const EdgeInsets.only(
                                                            left: 10, top: 6),
                                                    child: Row(
                                                      children: [
                                                        SvgPicture.asset("assets/images/location.svg",height: 12,colorFilter: ColorFilter.mode(notifire.getwhiteblackcolor, BlendMode.srcIn),),
                                                        SizedBox(width: 2),
                                                        Flexible(
                                                          child: Text(
                                                            homePageController
                                                                    .catWiseInfo
                                                                    ?.propertyCat![index1]
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
                                                      ],
                                                    ),
                                                  ),
                                                  Padding(
                                                    padding:
                                                        const EdgeInsets.only(
                                                            left: 10),
                                                    child: Row(
                                                      children: [
                                                        Padding(
                                                          padding:
                                                              const EdgeInsets
                                                                  .only(top: 7),
                                                          child: Text(
                                                            "${currency}${homePageController.catWiseInfo?.propertyCat![index1].price ?? ""}",
                                                            style: TextStyle(
                                                              color: blueColor,
                                                              fontFamily:
                                                              FontFamily
                                                                  .gilroyBold,
                                                              fontSize: 17,
                                                            ),
                                                          ),
                                                        ),
                                                        homePageController
                                                                    .catWiseInfo
                                                                    ?.propertyCat![
                                                                        index1]
                                                                    .buyorrent ==
                                                                "1"
                                                            ? Padding(
                                                                padding:
                                                                    const EdgeInsets
                                                                        .only(
                                                                        left: 8,
                                                                        top: 7),
                                                                child: Text(
                                                                  "/night".tr,
                                                                  style:
                                                                      TextStyle(
                                                                        color: notifire
                                                                            .getgreycolor,
                                                                        fontFamily:
                                                                        FontFamily.gilroyMedium,
                                                                  ),
                                                                ),
                                                              )
                                                            : Text(""),
                                                      ],
                                                    ),
                                                  )
                                                ],
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      decoration: BoxDecoration(
                                        borderRadius: BorderRadius.circular(15),
                                        border: Border.all(
                                          color: notifire.getborderColor,
                                        ),
                                      ),
                                    ),
                                  );
                                },
                              ),
                          )
                          : Padding(
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
                  : Expanded(
                      child: Center(
                        child: CircularProgressIndicator(),
                      ),
                    ),
            ],
          );
        }) : CircularProgressIndicator(),
      ),
    );
  }
}

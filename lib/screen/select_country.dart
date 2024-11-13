// ignore_for_file: prefer_const_constructors, sort_child_properties_last, prefer_const_literals_to_create_immutables, unnecessary_string_interpolations, prefer_adjacent_string_concatenation, avoid_print

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:goproperti/Api/config.dart';
import 'package:goproperti/Api/data_store.dart';
import 'package:goproperti/controller/homepage_controller.dart';
import 'package:goproperti/controller/search_controller.dart';
import 'package:goproperti/controller/selectcountry_controller.dart';
import 'package:goproperti/model/fontfamily_model.dart';
import 'package:goproperti/model/routes_helper.dart';
import 'package:goproperti/utils/Colors.dart';
import 'package:goproperti/utils/Custom_widget.dart';
import 'package:goproperti/utils/Dark_lightmode.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SelectCountryScreen extends StatefulWidget {
  const SelectCountryScreen({super.key});

  @override
  State<SelectCountryScreen> createState() => _SelectCountryScreenState();
}

class _SelectCountryScreenState extends State<SelectCountryScreen> {

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    countrySelected = getData.read("currentIndex");
  }

  SelectCountryController selectCountryController = Get.find();
  HomePageController homePageController = Get.find();
  SearchPropertyController searchController = Get.find();

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

  int countrySelected = 0;

  @override
  Widget build(BuildContext context) {
    notifire = Provider.of<ColorNotifire>(context, listen: true);
    return Scaffold(
      backgroundColor: notifire.getbgcolor,
      appBar: AppBar(
        backgroundColor: notifire.getbgcolor,
        elevation: 0,
        leading: IconButton(
          onPressed: () {
            Get.back();
          },
          icon: Icon(
            Icons.arrow_back,
            color: notifire.getwhiteblackcolor,
          ),
        ),
        title: Text(
          "Select Country".tr,
          style: TextStyle(
            fontSize: 17,
            fontFamily: FontFamily.gilroyBold,
            color: notifire.getwhiteblackcolor,
          ),
        ),
      ),
      body: GetBuilder<SelectCountryController>(builder: (context) {
        return Stack(
          alignment: Alignment.center,
          children: [
             selectCountryController.isLoading
                ? SingleChildScrollView(
                  child: SizedBox(
                      height: Get.size.height,
                      width: Get.size.width,
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        child: GridView.builder(
                          itemCount: selectCountryController
                              .countryInfo?.countryData!.length,
                          shrinkWrap: true,
                          physics: BouncingScrollPhysics(),
                          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            mainAxisExtent: 220,
                            mainAxisSpacing: 8,
                            crossAxisSpacing: 8,
                          ),
                          itemBuilder: (context, index) {
                            return InkWell(
                              onTap: () {
                                setState(() {
                                  countrySelected = index;

                                // save(
                                //     "countryId",
                                //     selectCountryController
                                //             .countryInfo?.countryData![index].id ??
                                //         "");
                                // print("££££££££££££${getData.read("countryId")}");
                                // save(
                                //     "countryName",
                                //     selectCountryController.countryInfo
                                //             ?.countryData![index].title ??
                                //         "");
                                });
                              },
                              child: Container(
                                height: 220,
                                margin: EdgeInsets.all(5),
                                child: Column(
                                  children: [
                                    Container(
                                      height: 150,
                                      width: 150,
                                      margin: EdgeInsets.all(8),
                                      child: ClipRRect(
                                        borderRadius: BorderRadius.circular(15),
                                        child: CachedNetworkImage(
                                          imageUrl:
                                              "${Config.imageUrl}${selectCountryController.countryInfo?.countryData![index].img ?? ""}",
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                      decoration: BoxDecoration(
                                        borderRadius: BorderRadius.circular(15),
                                      ),
                                    ),
                                    SizedBox(
                                      height: 8,
                                    ),
                                    Text(
                                      "${selectCountryController.countryInfo?.countryData![index].title ?? ""}",
                                      style: TextStyle(
                                        fontSize: 17,
                                        fontFamily: FontFamily.gilroyBold,
                                        color: notifire.getwhiteblackcolor,
                                      ),
                                    ),
                                  ],
                                ),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(15),
                                  color: notifire.getblackwhitecolor,
                                  border: countrySelected == index
                                      ? Border.all(color: blueColor)
                                      : Border.all(color: notifire.getborderColor),
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                    ),
                )
                : Center(
                    child: CircularProgressIndicator(),
                  ),
            Positioned(
              bottom: 10,
              child: Container(
                height: 50,
                width: Get.size.width,
                color: Colors.transparent,
                alignment: Alignment.center,
                child: GestButton(
                  Width: Get.size.width,
                  height: 50,
                  buttoncolor: blueColor,
                  margin: EdgeInsets.only(top: 5, left: 35, right: 35),
                  buttontext: "Continue".tr,
                  style: TextStyle(
                    fontFamily: FontFamily.gilroyBold,
                    color: WhiteColor,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                  onclick: () {
                    print("££££££££££££>>>>>>>>>>>>>>>>${getData.read("countryId")}");
                    save("countryId", selectCountryController.countryInfo?.countryData![countrySelected].id ?? "");
                    save(
                          "countryName",
                          selectCountryController.countryInfo
                                  ?.countryData![countrySelected].title ??
                              "");
                    selectCountryController.changeCountryIndex(countrySelected);
                    homePageController.getHomeDataApi(
                        countryId: getData.read("countryId"));
                    homePageController.getCatWiseData(countryId: getData.read("countryId"), cId: "0");
                    searchController.getSearchData(
                        countryId: getData.read("countryId"));
                    Get.offAndToNamed(Routes.bottoBarScreen);
                  },
                ),
              ),
            )
          ],
        );
      }),
    );
  }
}

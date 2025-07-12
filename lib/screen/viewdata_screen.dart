// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables, sort_child_properties_last, use_key_in_widget_constructors, must_be_immutable, prefer_interpolation_to_compose_strings, unnecessary_brace_in_string_interps, unused_field, unused_element, avoid_print, unrelated_type_equality_checks, unnecessary_string_interpolations, avoid_unnecessary_containers, prefer_adjacent_string_concatenation
import 'dart:ui' as ui;

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:get/get.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:goproperti/Api/config.dart';
import 'package:goproperti/Api/data_store.dart';
import 'package:goproperti/controller/bookrealestate_controller.dart';
import 'package:goproperti/controller/calendar_controller.dart';
import 'package:goproperti/controller/gallery_controller.dart';
import 'package:goproperti/controller/homepage_controller.dart';
import 'package:goproperti/controller/reviewsummary_controller.dart';
//import 'package:goproperti/firebase/chat_Screen.dart';
import 'package:goproperti/model/fontfamily_model.dart';
import 'package:goproperti/model/routes_helper.dart';
import 'package:goproperti/screen/home_screen.dart';
import 'package:goproperti/screen/login_screen.dart';
import 'package:goproperti/utils/Colors.dart';
import 'package:goproperti/utils/Custom_widget.dart';
import 'package:goproperti/utils/Dark_lightmode.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:provider/provider.dart';
import 'package:readmore/readmore.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';

class ViewDataScreen extends StatefulWidget {
  @override
  State<ViewDataScreen> createState() => _ViewDataScreenState();
}

class _ViewDataScreenState extends State<ViewDataScreen> {
  late ColorNotifire notifire;
  HomePageController homePageController = Get.find();
  ReviewSummaryController reviewSummaryController = Get.find();
  BookrealEstateController bookrealEstateController = Get.find();
  GalleryController galleryController = Get.find();
  CalendarController calendarController = Get.put(CalendarController());

  int selectIndex = 0;
  getdarkmodepreviousstate() async {
    final prefs = await SharedPreferences.getInstance();
    bool? previusstate = prefs.getBool("setIsDark");
    if (previusstate == null) {
      notifire.setIsDark = false;
    } else {
      notifire.setIsDark = previusstate;
    }
  }

  Future<dynamic> isMessageAvailable(String uid) async {
    CollectionReference collectionReference =
        FirebaseFirestore.instance.collection('users');

    final value = await collectionReference.doc(uid).get();
    final data = value.data();

    if (data is Map<String, dynamic>) {
      setState(() {
        useremail = data["name"];
        fmctoken = data["token"];
      });
    } else {
      print("Document data is not a map or is null");
    }
  }

  String latitude = "";
  String longitude = "";

  late GoogleMapController mapController;
  LatLng showLocation = LatLng(27.7089427, 85.3086209);

  final List<Marker> _markers = <Marker>[];

  Future<Uint8List> getImages(String path, int width) async {
    ByteData data = await rootBundle.load(path);
    ui.Codec codec = await ui.instantiateImageCodec(data.buffer.asUint8List(),
        targetHeight: width);
    ui.FrameInfo fi = await codec.getNextFrame();
    return (await fi.image.toByteData(format: ui.ImageByteFormat.png))!
        .buffer
        .asUint8List();
  }

  String useremail = '';
  String fmctoken = '';

  loadData() async {
    final Uint8List markIcons =
        await getImages("assets/images/MapPin.png", 100);

    _markers.add(
      Marker(
        markerId: MarkerId(showLocation.toString()),
        icon: BitmapDescriptor.fromBytes(markIcons),
        position: LatLng(
          double.parse(
              homePageController.propetydetailsInfo?.propetydetails!.latitude ??
                  ""),
          double.parse(homePageController
                  .propetydetailsInfo!.propetydetails!.longtitude ??
              ""),
        ),
        infoWindow: InfoWindow(),
      ),
    );

    setState(() {});
  }

  Widget gallaryAndSeeAllWidget(String name, String buttonName) {
    return Row(
      children: [
        SizedBox(
          width: 15,
        ),
        Text(
          name,
          style: TextStyle(
            fontSize: 17,
            fontFamily: FontFamily.gilroyBold,
            color: notifire.getwhiteblackcolor,
          ),
        ),
        Spacer(),
        TextButton(
          onPressed: () {
            galleryController.getGalleryData(
                pId: homePageController.propetydetailsInfo?.propetydetails!.id);
            Get.toNamed(Routes.galleryScreen);
          },
          child: Text(
            buttonName,
            style: TextStyle(
              fontFamily: FontFamily.gilroyBold,
            ),
          ),
        ),
        SizedBox(
          width: 10,
        ),
      ],
    );
  }

  Widget reviewWidget(String name, String buttonName, Icon icon) {
    return Row(
      children: [
        SizedBox(
          width: 15,
        ),
        icon,
        Text(
          name,
          style: TextStyle(
            fontSize: 17,
            fontFamily: FontFamily.gilroyBold,
            color: notifire.getwhiteblackcolor,
          ),
        ),
        Spacer(),
        TextButton(
          onPressed: () {
            Get.toNamed(Routes.reviewScreen, arguments: {
              "list": homePageController.propetydetailsInfo?.reviewlist
            });
          },
          child: Text(
            buttonName,
            style: TextStyle(
              fontFamily: FontFamily.gilroyBold,
            ),
          ),
        ),
        SizedBox(
          width: 10,
        ),
      ],
    );
  }

  @override
  void initState() {
    super.initState();
    loadData();
    try {
      final userId =
          homePageController.propetydetailsInfo?.propetydetails?.userId;
      if (userId != null && userId.isNotEmpty) {
        isMessageAvailable(userId); // ✅ Corrected function name
      } else {
        print("User ID is null or empty.");
      }
    } catch (e) {
      print("Error in initState: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    notifire = Provider.of<ColorNotifire>(context, listen: true);
    return GetBuilder<HomePageController>(builder: (context) {
      return Scaffold(
        backgroundColor: notifire.getbgcolor,
        body: homePageController.isProperty
            ? NestedScrollView(
                headerSliverBuilder: (context, innerBoxIsScrolled) {
                  return [
                    SliverAppBar(
                      expandedHeight: 300,
                      floating: false,
                      pinned: true,
                      backgroundColor: notifire.getbgcolor,
                      leading: InkWell(
                        onTap: () {
                          Get.back();
                        },
                        child: Container(
                          height: 50,
                          width: 50,
                          alignment: Alignment.center,
                          padding: EdgeInsets.all(17),
                          child: Image.asset(
                            "assets/images/Arrow - Left.png",
                            color: blueColor,
                          ),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                      actions: [
                        GetBuilder<HomePageController>(builder: (context) {
                          return InkWell(
                            onTap: () {
                              if (getData.read("UserLogin") != null) {
                                homePageController.addFavouriteList(
                                  pid: homePageController
                                      .propetydetailsInfo!.propetydetails!.id,
                                  propertyType: homePageController
                                      .propetydetailsInfo
                                      ?.propetydetails!
                                      .propertyType,
                                );
                              }
                            },
                            child: homePageController.propetydetailsInfo
                                        ?.propetydetails!.isFavourite ==
                                    1
                                ? Container(
                                    height: 50,
                                    width: 50,
                                    alignment: Alignment.center,
                                    padding: EdgeInsets.all(14),
                                    child: Image.asset(
                                      "assets/images/Fev-Bold.png",
                                      color: blueColor,
                                    ),
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                    ),
                                  )
                                : Container(
                                    height: 50,
                                    width: 50,
                                    alignment: Alignment.center,
                                    padding: EdgeInsets.all(14),
                                    child: Image.asset(
                                      "assets/images/favorite.png",
                                      color: blueColor,
                                    ),
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                          );
                        }),
                        SizedBox(
                          width: 10,
                        ),
                      ],
                      flexibleSpace: FlexibleSpaceBar(
                        background: Stack(
                          children: [
                            SizedBox(
                              height: 470,
                              child: PageView.builder(
                                itemCount: homePageController.propetydetailsInfo
                                    ?.propetydetails!.image!.length,
                                physics: BouncingScrollPhysics(),
                                itemBuilder: (context, index) {
                                  return Container(
                                    child: FadeInImage.assetNetwork(
                                      fadeInCurve: Curves.easeInCirc,
                                      placeholder:
                                          "assets/images/ezgif.com-crop.gif",
                                      height: 470,
                                      width: Get.size.width,
                                      imageErrorBuilder:
                                          (context, error, stackTrace) {
                                        return Center(
                                          child: Image.asset(
                                            "assets/images/emty.gif",
                                            fit: BoxFit.cover,
                                            height: Get.height,
                                          ),
                                        );
                                      },
                                      image:
                                          "${Config.imageUrl}${homePageController.propetydetailsInfo?.propetydetails!.image![index].image ?? ""}",
                                      fit: BoxFit.cover,
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
                            homePageController.propetydetailsInfo!
                                        .propetydetails!.image!.length ==
                                    1
                                ? SizedBox()
                                : Positioned(
                                    bottom: 0,
                                    child: SizedBox(
                                      height: 25,
                                      width: Get.size.width,
                                      child: Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          ...List.generate(
                                              homePageController
                                                  .propetydetailsInfo!
                                                  .propetydetails!
                                                  .image!
                                                  .length, (index) {
                                            return IndicatorViewPage(
                                              isActive: selectIndex == index
                                                  ? true
                                                  : false,
                                            );
                                          }),
                                        ],
                                      ),
                                    ),
                                  ),
                            homePageController
                                        .propetydetailsInfo
                                        ?.propetydetails!
                                        .image![selectIndex]
                                        .isPanorama ==
                                    1
                                ? Positioned(
                                    bottom: 10,
                                    right: 10,
                                    child: InkWell(
                                      onTap: () {
                                        Get.toNamed(Routes.imageViewerSreen,
                                            arguments: {
                                              "img": homePageController
                                                  .propetydetailsInfo
                                                  ?.propetydetails!
                                                  .image![selectIndex]
                                                  .image,
                                            });
                                      },
                                      child: Container(
                                        height: 30,
                                        width: 70,
                                        padding: EdgeInsets.all(4),
                                        child: Image.asset(
                                            "assets/images/360.png"),
                                        decoration: BoxDecoration(
                                          borderRadius:
                                              BorderRadius.circular(8),
                                          color: BlackColor.withOpacity(0.5),
                                        ),
                                      ),
                                    ),
                                  )
                                : SizedBox(),
                          ],
                        ),
                      ),
                    ),
                  ];
                },
                body: Stack(
                  children: [
                    SizedBox(
                      height: Get.size.height,
                      width: Get.size.width,
                      child: SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Padding(
                              padding: const EdgeInsets.only(left: 15, top: 10),
                              child: Text(
                                homePageController.propetydetailsInfo
                                        ?.propetydetails!.title ??
                                    "",
                                style: TextStyle(
                                  fontSize: 22,
                                  fontFamily: FontFamily.gilroyBold,
                                  color: notifire.getwhiteblackcolor,
                                ),
                              ),
                            ),
                            SizedBox(
                              height: 10,
                            ),
                            Row(
                              children: [
                                SizedBox(
                                  width: 15,
                                ),
                                Container(
                                  height: 25,
                                  padding: EdgeInsets.all(5),
                                  child: Text(
                                    homePageController.propetydetailsInfo
                                            ?.propetydetails!.propertyTitle ??
                                        "",
                                    style: TextStyle(
                                      fontFamily: FontFamily.gilroyMedium,
                                      fontSize: 12,
                                      color: blueColor,
                                    ),
                                  ),
                                  decoration: BoxDecoration(
                                    color: Color(0xFFeef4ff),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                ),
                                SizedBox(
                                  width: 10,
                                ),
                                Image.asset(
                                  "assets/images/Rating.png",
                                  height: 20,
                                  width: 20,
                                ),
                                SizedBox(
                                  width: 7,
                                ),
                                Text(
                                  "${homePageController.propetydetailsInfo?.propetydetails!.rate ?? ""}",
                                  style: TextStyle(
                                    color: Colors.grey,
                                    fontSize: 15,
                                    fontFamily: FontFamily.gilroyMedium,
                                  ),
                                ),
                                SizedBox(
                                  width: 15,
                                ),
                              ],
                            ),
                            SizedBox(
                              height: 15,
                            ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      height: 40,
                                      width: 40,
                                      alignment: Alignment.center,
                                      child: Image.asset(
                                        "assets/images/Frame1.png",
                                        height: 20,
                                        width: 20,
                                        color: blueColor,
                                      ),
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: Color(0xFFeef4ff),
                                      ),
                                    ),
                                    SizedBox(
                                      width: 10,
                                    ),
                                    Text(
                                      "${homePageController.propetydetailsInfo?.propetydetails!.beds ?? ""} ${"Beds".tr}",
                                      style: TextStyle(
                                        fontFamily: FontFamily.gilroyMedium,
                                        fontSize: 16,
                                        color: notifire.getwhiteblackcolor,
                                      ),
                                    ),
                                  ],
                                ),
                                Row(
                                  children: [
                                    Container(
                                      height: 40,
                                      width: 40,
                                      alignment: Alignment.center,
                                      child: Image.asset(
                                        "assets/images/bath.png",
                                        height: 20,
                                        width: 20,
                                        color: blueColor,
                                      ),
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: Color(0xFFeef4ff),
                                      ),
                                    ),
                                    SizedBox(
                                      width: 10,
                                    ),
                                    Text(
                                      "${homePageController.propetydetailsInfo?.propetydetails!.bathroom ?? ""} ${"Bath".tr}",
                                      style: TextStyle(
                                        fontFamily: FontFamily.gilroyMedium,
                                        fontSize: 16,
                                        color: notifire.getwhiteblackcolor,
                                      ),
                                    ),
                                  ],
                                ),
                                Row(
                                  children: [
                                    Container(
                                      height: 40,
                                      width: 40,
                                      alignment: Alignment.center,
                                      child: Image.asset(
                                        "assets/images/sqft.png",
                                        height: 20,
                                        width: 20,
                                        color: blueColor,
                                      ),
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: Color(0xFFeef4ff),
                                      ),
                                    ),
                                    SizedBox(
                                      width: 10,
                                    ),
                                    Text(
                                      "${homePageController.propetydetailsInfo?.propetydetails!.sqrft ?? ""} ${"sqft".tr}",
                                      style: TextStyle(
                                        fontFamily: FontFamily.gilroyMedium,
                                        fontSize: 16,
                                        color: notifire.getwhiteblackcolor,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            SizedBox(
                              height: 10,
                            ),
                            Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 20),
                              child: Divider(),
                            ),
                            Padding(
                              padding: const EdgeInsets.only(left: 15, top: 10),
                              child: Text(
                                "Hosted by".tr,
                                style: TextStyle(
                                  fontSize: 17,
                                  fontFamily: FontFamily.gilroyBold,
                                  color: notifire.getwhiteblackcolor,
                                ),
                              ),
                            ),
                            SizedBox(
                              height: 10,
                            ),
                            ListTile(
                              leading: Container(
                                height: 60,
                                width: 60,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  image: DecorationImage(
                                    image: NetworkImage(
                                      "${Config.imageUrl}${homePageController.propetydetailsInfo?.propetydetails!.ownerImage}",
                                    ),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                              title: Text(
                                homePageController.propetydetailsInfo
                                        ?.propetydetails!.ownerName ??
                                    "",
                                style: TextStyle(
                                  fontSize: 17,
                                  fontFamily: FontFamily.gilroyBold,
                                  color: notifire.getwhiteblackcolor,
                                ),
                              ),
                              subtitle: Text(
                                "Partner".tr,
                                style: TextStyle(
                                  color: Colors.grey,
                                  fontFamily: FontFamily.gilroyMedium,
                                ),
                              ),
                              trailing: SizedBox(
                                width: 100,
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.end,
                                  children: [
                                    Spacer(),
                                    InkWell(
                                      onTap: () async {
                                        final contactPermission =
                                            await Permission.phone.request();

                                        if (contactPermission.isGranted) {
                                          if (getData.read("UserLogin") !=
                                              null) {
                                            var url = Uri.parse(
                                                "tel:${homePageController.propetydetailsInfo?.propetydetails!.mobile ?? ""}");
                                            if (await canLaunchUrl(url)) {
                                              await launchUrl(url);
                                            } else {
                                              throw 'Could not launch $url';
                                            }
                                          } else {
                                            Get.to(() => LoginScreen());
                                          }
                                        }
                                      },
                                      child: Image.asset(
                                        "assets/images/phone Icon.png",
                                        height: 25,
                                        width: 25,
                                        fit: BoxFit.cover,
                                        color: blueColor,
                                      ),
                                    ),
                                    // homePageController.propetydetailsInfo
                                    //             ?.propetydetails!.userId ==
                                    //         "0"
                                    //     ? SizedBox()
                                    SizedBox(
                                      width: 15,
                                    ),
                                    // homePageController.propetydetailsInfo
                                    //             ?.propetydetails!.userId ==
                                    //         "0"
                                    //     ? SizedBox()
                                    InkWell(
                                      onTap: () {
                                        if (getData.read("UserLogin") != null) {
                                          // Get.to(ChatPage(
                                          //   proPic: homePageController.propetydetailsInfo!.propetydetails!.ownerImage.toString(),
                                          //   resiverUseremail: useremail,
                                          //   resiverUserId: homePageController.propetydetailsInfo?.propetydetails!.userId ??
                                          //           "0",
                                          // ));
                                        } else {
                                          Get.to(() => LoginScreen());
                                        }
                                      },
                                      child: Image.asset(
                                        "assets/images/Chat.png",
                                        height: 28,
                                        width: 28,
                                        fit: BoxFit.cover,
                                        color: blueColor,
                                      ),
                                    ),
                                    SizedBox(
                                      width: 15,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.only(left: 15, top: 10),
                              child: Text(
                                "About this space".tr,
                                style: TextStyle(
                                  fontSize: 17,
                                  fontFamily: FontFamily.gilroyBold,
                                  color: notifire.getwhiteblackcolor,
                                ),
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.only(left: 15, top: 10),
                              child: ReadMoreText(
                                homePageController.propetydetailsInfo
                                        ?.propetydetails!.description ??
                                    "",
                                trimLines: 4,
                                colorClickableText: blueColor,
                                trimMode: TrimMode.Line,
                                trimCollapsedText: 'Read more'.tr,
                                trimExpandedText: 'Show less'.tr,
                                style: TextStyle(
                                  color: Colors.grey,
                                  fontFamily: FontFamily.gilroyMedium,
                                ),
                              ),
                            ),
                            SizedBox(
                              height: 10,
                            ),
                            Padding(
                              padding: const EdgeInsets.only(left: 15, top: 10),
                              child: Text(
                                "What this place offers".tr,
                                style: TextStyle(
                                  fontSize: 17,
                                  fontFamily: FontFamily.gilroyBold,
                                  color: notifire.getwhiteblackcolor,
                                ),
                              ),
                            ),
                            SizedBox(
                              height: 15,
                            ),
                            GridView.builder(
                              shrinkWrap: true,
                              itemCount: homePageController
                                  .propetydetailsInfo?.facility!.length,
                              physics: NeverScrollableScrollPhysics(),
                              padding: EdgeInsets.zero,
                              gridDelegate:
                                  SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 4,
                              ),
                              itemBuilder: (context, index) {
                                return Column(
                                  children: [
                                    Container(
                                      height: 60,
                                      width: 60,
                                      alignment: Alignment.center,
                                      child: FadeInImage.assetNetwork(
                                        height: 25,
                                        width: 25,
                                        color: blueColor,
                                        placeholder:
                                            "assets/images/loading2.gif",
                                        imageErrorBuilder:
                                            (context, error, stackTrace) {
                                          return Center(
                                            child: Image.asset(
                                              "assets/images/emty.gif",
                                              fit: BoxFit.cover,
                                              height: Get.height,
                                            ),
                                          );
                                        },
                                        image:
                                            "${Config.imageUrl}${homePageController.propetydetailsInfo!.facility![index].img}",
                                      ),
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: Color(0xFFeef4ff),
                                      ),
                                    ),
                                    SizedBox(
                                      height: 8,
                                    ),
                                    Text(
                                      homePageController.propetydetailsInfo
                                              ?.facility![index].title ??
                                          "",
                                      maxLines: 1,
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                        fontFamily: FontFamily.gilroyMedium,
                                        overflow: TextOverflow.ellipsis,
                                        color: notifire.getwhiteblackcolor,
                                      ),
                                    )
                                  ],
                                );
                              },
                            ),
                            homePageController
                                    .propetydetailsInfo!.gallery!.isNotEmpty
                                ? Column(
                                    children: [
                                      gallaryAndSeeAllWidget(
                                          "Gallary".tr, "See All".tr),
                                      Container(
                                        height: 110,
                                        alignment: Alignment.center,
                                        margin: EdgeInsets.only(left: 15),
                                        child: ListView.builder(
                                          itemCount: homePageController
                                              .propetydetailsInfo
                                              ?.gallery!
                                              .length,
                                          scrollDirection: Axis.horizontal,
                                          physics:
                                              NeverScrollableScrollPhysics(),
                                          itemBuilder: (context, index) {
                                            return Container(
                                              height: 110,
                                              width: 110,
                                              margin: EdgeInsets.all(5),
                                              child: ClipRRect(
                                                borderRadius:
                                                    BorderRadius.circular(10),
                                                child: FadeInImage.assetNetwork(
                                                  fadeInCurve:
                                                      Curves.easeInCirc,
                                                  placeholder:
                                                      "assets/images/ezgif.com-crop.gif",
                                                  height: 110,
                                                  imageErrorBuilder: (context,
                                                      error, stackTrace) {
                                                    return Center(
                                                      child: Image.asset(
                                                        "assets/images/emty.gif",
                                                        fit: BoxFit.cover,
                                                        height: Get.height,
                                                      ),
                                                    );
                                                  },
                                                  image:
                                                      "${Config.imageUrl}${homePageController.propetydetailsInfo?.gallery![index]}",
                                                  fit: BoxFit.cover,
                                                ),
                                              ),
                                              decoration: BoxDecoration(
                                                borderRadius:
                                                    BorderRadius.circular(10),
                                                color:
                                                    notifire.getblackwhitecolor,
                                              ),
                                            );
                                          },
                                        ),
                                      ),
                                    ],
                                  )
                                : SizedBox(),
                            Padding(
                              padding: const EdgeInsets.only(left: 15, top: 10),
                              child: Text(
                                "Location".tr,
                                style: TextStyle(
                                  fontSize: 17,
                                  fontFamily: FontFamily.gilroyBold,
                                  color: notifire.getwhiteblackcolor,
                                ),
                              ),
                            ),
                            SizedBox(
                              height: 10,
                            ),
                            Row(
                              children: [
                                SizedBox(
                                  width: 15,
                                ),
                                Image.asset(
                                  "assets/images/Location.png",
                                  height: 25,
                                  width: 25,
                                  fit: BoxFit.cover,
                                  color: blueColor,
                                ),
                                SizedBox(
                                  width: 5,
                                ),
                                Text(
                                  homePageController.propetydetailsInfo
                                          ?.propetydetails!.city ??
                                      "",
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    color: notifire.getgreycolor,
                                  ),
                                ),
                              ],
                            ),
                            Container(
                              height: 200,
                              width: Get.size.width,
                              margin: EdgeInsets.all(10),
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(15),
                                child: GoogleMap(
                                  initialCameraPosition: CameraPosition(
                                    target: LatLng(
                                      double.parse(homePageController
                                              .propetydetailsInfo
                                              ?.propetydetails!
                                              .latitude ??
                                          ""),
                                      double.parse(homePageController
                                              .propetydetailsInfo
                                              ?.propetydetails!
                                              .longtitude ??
                                          ""),
                                    ),
                                    zoom: 15.0,
                                  ),
                                  markers: Set<Marker>.of(_markers),
                                  mapType: MapType.normal,
                                  myLocationEnabled: true,
                                  compassEnabled: true,
                                  zoomGesturesEnabled: true,
                                  tiltGesturesEnabled: true,
                                  zoomControlsEnabled: true,
                                  onMapCreated: (controller) {
                                    setState(() {
                                      mapController = controller;
                                    });
                                  },
                                ),
                              ),
                              decoration: BoxDecoration(
                                color: notifire.getblackwhitecolor,
                                borderRadius: BorderRadius.circular(15),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black12,
                                    offset: const Offset(
                                      0.5,
                                      0.5,
                                    ),
                                    blurRadius: 2,
                                  ),
                                ],
                              ),
                            ),
                            homePageController
                                    .propetydetailsInfo!.reviewlist!.isNotEmpty
                                ? reviewWidget(
                                    "${homePageController.propetydetailsInfo?.propetydetails!.rate ?? ""}(${homePageController.propetydetailsInfo?.totalReview} ${"reviews".tr})",
                                    "See All".tr,
                                    Icon(
                                      Icons.star,
                                      color: yelloColor,
                                    ),
                                  )
                                : SizedBox(),
                            homePageController
                                    .propetydetailsInfo!.reviewlist!.isNotEmpty
                                ? ListView.builder(
                                    itemCount: homePageController
                                        .propetydetailsInfo?.reviewlist!.length,
                                    shrinkWrap: true,
                                    padding: EdgeInsets.zero,
                                    physics: NeverScrollableScrollPhysics(),
                                    itemBuilder: (context, index) {
                                      return InkWell(
                                        onTap: () {},
                                        child: ListTile(
                                          leading: Container(
                                            height: 60,
                                            width: 60,
                                            decoration: BoxDecoration(
                                              shape: BoxShape.circle,
                                              image: DecorationImage(
                                                image: NetworkImage(
                                                  "${Config.imageUrl}${homePageController.propetydetailsInfo?.reviewlist![index].userImg ?? ""}",
                                                ),
                                                fit: BoxFit.cover,
                                              ),
                                            ),
                                          ),
                                          title: Text(
                                            "${homePageController.propetydetailsInfo?.reviewlist![index].userTitle ?? ""}",
                                            style: TextStyle(
                                              color:
                                                  notifire.getwhiteblackcolor,
                                              fontFamily: FontFamily.gilroyBold,
                                              fontSize: 17,
                                            ),
                                          ),
                                          subtitle: Text(
                                            "${homePageController.propetydetailsInfo?.reviewlist![index].userDesc ?? ""}",
                                            textAlign: TextAlign.start,
                                            maxLines: 2,
                                            style: TextStyle(
                                              color: notifire.getgreycolor,
                                              fontFamily:
                                                  FontFamily.gilroyMedium,
                                            ),
                                          ),
                                          trailing: Container(
                                            height: 40,
                                            width: 70,
                                            child: Row(
                                              mainAxisAlignment:
                                                  MainAxisAlignment.center,
                                              children: [
                                                Icon(
                                                  Icons.star,
                                                  color: blueColor,
                                                ),
                                                SizedBox(
                                                  width: 5,
                                                ),
                                                Text(
                                                  "${homePageController.propetydetailsInfo?.reviewlist![index].userRate ?? ""}",
                                                  style: TextStyle(
                                                    fontFamily:
                                                        FontFamily.gilroyBold,
                                                    color: blueColor,
                                                  ),
                                                )
                                              ],
                                            ),
                                            decoration: BoxDecoration(
                                              border: Border.all(
                                                color: blueColor,
                                                width: 2,
                                              ),
                                              borderRadius:
                                                  BorderRadius.circular(20),
                                            ),
                                          ),
                                        ),
                                      );
                                    },
                                  )
                                : SizedBox(),
                            SizedBox(
                              height: 100,
                            ),
                          ],
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 0,
                      child: Container(
                        height: 80,
                        width: Get.size.width,
                        color: notifire.getblackwhitecolor,
                        child: Row(
                          children: [
                            Expanded(
                              flex: 1,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Padding(
                                    padding: const EdgeInsets.only(
                                        top: 10, left: 15),
                                    child: Text(
                                      "Price".tr,
                                      style: TextStyle(
                                        fontFamily: FontFamily.gilroyMedium,
                                        color: greycolor,
                                      ),
                                    ),
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.only(
                                        top: 10, left: 15),
                                    child: Row(
                                      children: [
                                        Text(
                                          "${currency}${homePageController.propetydetailsInfo?.propetydetails!.price ?? ""}",
                                          style: TextStyle(
                                            color: blueColor,
                                            fontFamily: FontFamily.gilroyBold,
                                            fontSize: 22,
                                          ),
                                        ),
                                        homePageController
                                                    .propetydetailsInfo
                                                    ?.propetydetails!
                                                    .buyorrent ==
                                                "1"
                                            ? Text(
                                                "/night".tr,
                                                style: TextStyle(
                                                  color: Colors.grey,
                                                  fontFamily:
                                                      FontFamily.gilroyMedium,
                                                ),
                                              )
                                            : Text(""),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            GetBuilder<BookrealEstateController>(
                                builder: (context) {
                              return GetBuilder<CalendarController>(
                                  builder: (context) {
                                return StatefulBuilder(
                                    builder: (context, setState) {
                                  return Expanded(
                                    child: homePageController.propetydetailsInfo
                                                ?.propetydetails!.buyorrent ==
                                            "1"
                                        ? GestButton(
                                            Width: Get.size.width,
                                            height: 70,
                                            buttoncolor: blueColor,
                                            margin: EdgeInsets.only(
                                                top: 10, right: 10, bottom: 10),
                                            buttontext: "Book".tr,
                                            onclick: () {
                                              if (getData.read("UserLogin") !=
                                                  null) {
                                                bookrealEstateController
                                                    .cleanDate();
                                                print(
                                                    ">:>:>:>:>:>:>:>:>:> PROPERTY ID : > ${homePageController.propetydetailsInfo?.propetydetails!.id}");
                                                calendarController
                                                    .calendar(homePageController
                                                        .propetydetailsInfo!
                                                        .propetydetails!
                                                        .id)
                                                    .then(
                                                  (value) {
                                                    Get.toNamed(
                                                        Routes.bookRealEstate);
                                                  },
                                                );
                                                reviewSummaryController
                                                    .getProductObject(
                                                  pim: homePageController
                                                      .propetydetailsInfo
                                                      ?.propetydetails!
                                                      .image![0]
                                                      .image,
                                                  pti: homePageController
                                                          .propetydetailsInfo
                                                          ?.propetydetails!
                                                          .title ??
                                                      "",
                                                  pci: homePageController
                                                          .propetydetailsInfo
                                                          ?.propetydetails!
                                                          .city ??
                                                      "",
                                                  pPr: homePageController
                                                      .propetydetailsInfo
                                                      ?.propetydetails!
                                                      .price,
                                                  pId: homePageController
                                                          .propetydetailsInfo
                                                          ?.propetydetails!
                                                          .id ??
                                                      "",
                                                  pLimit: homePageController
                                                          .propetydetailsInfo
                                                          ?.propetydetails!
                                                          .plimit ??
                                                      "1",
                                                );
                                              } else {
                                                showToastMessage(
                                                    "Please login and Book".tr);
                                              }
                                            },
                                            style: TextStyle(
                                              fontFamily: FontFamily.gilroyBold,
                                              color: WhiteColor,
                                              fontSize: 16,
                                            ),
                                          )
                                        : homePageController
                                                    .propetydetailsInfo
                                                    ?.propetydetails!
                                                    .isEnquiry ==
                                                1
                                            ? GestButton(
                                                Width: Get.size.width,
                                                height: 70,
                                                buttoncolor: RedColor,
                                                margin: EdgeInsets.only(
                                                    top: 10,
                                                    right: 10,
                                                    bottom: 10),
                                                buttontext: "Contacted".tr,
                                                onclick: () {
                                                  Fluttertoast.showToast(
                                                    msg:
                                                        "Enquiry Already Send!!"
                                                            .tr,
                                                    gravity:
                                                        ToastGravity.BOTTOM,
                                                    timeInSecForIosWeb: 1,
                                                    backgroundColor: RedColor,
                                                    textColor: Colors.white,
                                                    fontSize: 14.0,
                                                  );
                                                },
                                                style: TextStyle(
                                                  fontFamily:
                                                      FontFamily.gilroyBold,
                                                  color: WhiteColor,
                                                  fontSize: 16,
                                                ),
                                              )
                                            : GestButton(
                                                Width: Get.size.width,
                                                height: 70,
                                                buttoncolor: blueColor,
                                                margin: EdgeInsets.only(
                                                    top: 10,
                                                    right: 10,
                                                    bottom: 10),
                                                buttontext: "Inquiry".tr,
                                                onclick: () {
                                                  if (getData
                                                          .read("UserLogin") !=
                                                      null) {
                                                    homePageController
                                                        .enquirySetApi(
                                                      pId: homePageController
                                                          .propetydetailsInfo
                                                          ?.propetydetails!
                                                          .id,
                                                    );
                                                    Get.back();
                                                  } else {
                                                    showToastMessage(
                                                        "Please login and send enquery"
                                                            .tr);
                                                  }
                                                },
                                                style: TextStyle(
                                                  fontFamily:
                                                      FontFamily.gilroyBold,
                                                  color: WhiteColor,
                                                  fontSize: 16,
                                                ),
                                              ),
                                  );
                                });
                              });
                            })
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              )
            : Center(
                child: CircularProgressIndicator(),
              ),
      );
    });
  }
}

class IndicatorViewPage extends StatelessWidget {
  final bool isActive;
  const IndicatorViewPage({required this.isActive});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(3),
      child: Container(
        height: isActive ? 6 : 8,
        width: isActive ? 30 : 8,
        decoration: BoxDecoration(
          color: isActive ? Colors.blue : Colors.grey,
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }
}

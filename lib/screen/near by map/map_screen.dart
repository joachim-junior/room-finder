// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables, sort_child_properties_last, avoid_unnecessary_containers, sized_box_for_whitespace, unused_field, prefer_final_fields, prefer_interpolation_to_compose_strings, avoid_print, prefer_collection_literals, unnecessary_brace_in_string_interps, unnecessary_string_interpolations, unused_local_variable

import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:goproperti/Api/config.dart';
import 'package:goproperti/controller/homepage_controller.dart';
import 'package:goproperti/model/fontfamily_model.dart';
import 'package:goproperti/model/routes_helper.dart';
import 'package:goproperti/screen/home_screen.dart';
import 'package:goproperti/utils/Colors.dart';
import 'package:goproperti/utils/Dark_lightmode.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  HomePageController homePageController = Get.find();
  late GoogleMapController mapController;
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

  CameraPosition kGoogle = CameraPosition(
    target: LatLng(21.2381962, 72.8879607),
    zoom: 5,
  );

  final Set<Marker> markers = Set();

  Future<Uint8List> getImages(String path, int width) async {
    ByteData data = await rootBundle.load(path);
    ui.Codec codec = await ui.instantiateImageCodec(data.buffer.asUint8List(),
        targetHeight: width);
    ui.FrameInfo fi = await codec.getNextFrame();
    return (await fi.image.toByteData(format: ui.ImageByteFormat.png))!
        .buffer
        .asUint8List();
  }

  @override
  void initState() {
    getdarkmodepreviousstate();
    super.initState();
    getmarkers();
  }


  @override
  Widget build(BuildContext context) {
    notifire = Provider.of<ColorNotifire>(context, listen: true);
    return Scaffold(
      backgroundColor: notifire.getblackwhitecolor,
      body: GetBuilder<HomePageController>(builder: (context) {
        return SafeArea(
          child: Stack(
            children: [
              Container(
                height: Get.size.height,
                child: GoogleMap(
                  initialCameraPosition: homePageController.kGoogle,
                  gestureRecognizers: <Factory<OneSequenceGestureRecognizer>>[
                    Factory<OneSequenceGestureRecognizer>(
                      () => EagerGestureRecognizer(),
                    ),
                  ].toSet(),
                  markers: Set<Marker>.of(markers),
                  mapType: MapType.normal,
                  myLocationEnabled: false,
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
              Positioned(
                child: Padding(
                  padding: const EdgeInsets.only(top: 5, left: 5),
                  child: SizedBox(
                    height: 50,
                    child: Row(
                      children: [
                        Expanded(
                          child: InkWell(
                            onTap: () {
                              Get.toNamed(Routes.homeSearchScreen);
                            },
                            child: Container(
                              height: 45,
                              margin: EdgeInsets.only(right: 10),
                              child: Row(
                                children: [
                                  SizedBox(
                                    width: 15,
                                  ),
                                  Image.asset(
                                    "assets/images/Search.png",
                                    height: 25,
                                    width: 25,
                                  ),
                                  SizedBox(
                                    width: 8,
                                  ),
                                  Text(
                                    "Search...".tr,
                                    style: TextStyle(
                                      fontFamily: FontFamily.gilroyMedium,
                                      color: Colors.grey.shade500,
                                    ),
                                  ),
                                ],
                              ),
                              decoration: BoxDecoration(
                                color: notifire.getblackwhitecolor,
                                borderRadius: BorderRadius.circular(40),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              Positioned(
                bottom: 10,
                right: 0,
                left: 0,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 5),
                  child: SizedBox(
                    height: 140,
                    width: Get.size.width,
                    child: PageView.builder(
                      controller: homePageController.pageController,
                      itemCount: homePageController
                          .homeDatatInfo?.homeData!.featuredProperty!.length,
                      onPageChanged: (int index) {
                        mapController
                            .animateCamera(
                          CameraUpdate.newCameraPosition(
                            CameraPosition(
                              target: LatLng(
                                double.parse(homePageController
                                        .homeDatatInfo
                                        ?.homeData
                                        !.featuredProperty![index]
                                        .latitude ??
                                    "0"),
                                double.parse(homePageController
                                        .homeDatatInfo
                                        ?.homeData
                                        !.featuredProperty![index]
                                        .longtitude ??
                                    ""),
                              ),
                              zoom: 12,
                            ),
                          ),
                        )
                            .then((val) {
                          setState(() {});
                        });
                      },
                      itemBuilder: (context, index) {
                        return InkWell(
                          onTap: () async {
                            setState(() {
                              homePageController.rate = homePageController
                                      .homeDatatInfo
                                      ?.homeData
                                      !.featuredProperty![index]
                                      .rate ??
                                  "";
                            });
                            homePageController.chnageObjectIndex(index);
                            await homePageController.getPropertyDetailsApi(
                                id: homePageController.homeDatatInfo?.homeData
                                    !.featuredProperty![index].id);
                            Get.toNamed(
                              Routes.viewDataScreen,
                            );
                          },
                          child: Container(
                            height: 140,
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
                                        borderRadius: BorderRadius.circular(15),
                                        child: FadeInImage.assetNetwork(
                                          fadeInCurve: Curves.easeInCirc,
                                          placeholder:
                                              "assets/images/ezgif.com-crop.gif",
                                          height: 140,
                                          image:
                                              "${Config.imageUrl}${homePageController.homeDatatInfo?.homeData!.featuredProperty![index].image}",
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                      decoration: BoxDecoration(
                                        borderRadius: BorderRadius.circular(15),
                                      ),
                                    ),
                                    homePageController
                                                .homeDatatInfo
                                                ?.homeData
                                                !.featuredProperty![index]
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
                                                    MainAxisAlignment.center,
                                                children: [
                                                  Container(
                                                    margin: const EdgeInsets
                                                        .fromLTRB(0, 0, 3, 0),
                                                    child: Image.asset(
                                                      "assets/images/Rating.png",
                                                      height: 12,
                                                      width: 12,
                                                    ),
                                                  ),
                                                  Text(
                                                    homePageController
                                                            .homeDatatInfo
                                                            ?.homeData
                                                            !.featuredProperty![
                                                                index]
                                                            .rate
                                                            .toString() ??
                                                        "",
                                                    style: TextStyle(
                                                      fontFamily: FontFamily
                                                          .gilroyMedium,
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
                                          )
                                        : Positioned(
                                            top: 15,
                                            right: 20,
                                            child: Container(
                                              height: 30,
                                              width: 60,
                                              alignment: Alignment.center,
                                              child: Text(
                                                "BUY".tr,
                                                style: TextStyle(
                                                  color: blueColor,
                                                ),
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
                                      Row(
                                        children: [
                                          Expanded(
                                            child: Text(
                                              homePageController
                                                      .homeDatatInfo
                                                      ?.homeData
                                                      !.featuredProperty![index]
                                                      .title ??
                                                  "",
                                              maxLines: 2,
                                              style: TextStyle(
                                                fontSize: 17,
                                                fontFamily:
                                                    FontFamily.gilroyBold,
                                                color: notifire
                                                    .getwhiteblackcolor,
                                                overflow:
                                                    TextOverflow.ellipsis,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      SizedBox(height: 5,),
                                      Row(
                                        children: [
                                          Expanded(
                                            child: Text(
                                              homePageController
                                                      .homeDatatInfo
                                                      ?.homeData
                                                      !.featuredProperty![index]
                                                      .city ??
                                                  "",
                                              maxLines: 1,
                                              style: TextStyle(
                                                fontSize: 16,
                                                color: notifire.getgreycolor,
                                                fontFamily:
                                                    FontFamily.gilroyMedium,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ),
                                          ),
                                          SizedBox(
                                            width: 10,
                                          ),
                                        ],
                                      ),
                                      SizedBox(height: 6,),
                                      Row(
                                        children: [
                                          Text(
                                            "${currency}${homePageController.homeDatatInfo?.homeData!.featuredProperty![index].price}",
                                            style: TextStyle(
                                              fontSize: 17,
                                              fontFamily:
                                              FontFamily.gilroyBold,
                                              color: blueColor,
                                            ),
                                          ),
                                          homePageController
                                              .homeDatatInfo
                                              ?.homeData
                                          !.featuredProperty![
                                          index]
                                              .buyorrent ==
                                              "1"
                                              ? Text(
                                            "/night".tr,
                                            style: TextStyle(
                                              color: notifire
                                                  .getgreycolor,
                                              fontFamily: FontFamily
                                                  .gilroyMedium,
                                            ),
                                          )
                                              : SizedBox(),
                                        ],
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
                        );
                      },
                    ),
                  ),
                ),
              )
            ],
          ),
        );
      }),
    );
  }

  getmarkers() async {
    final Uint8List markIcon = await getImages("assets/images/MapPin.png", 100);
    for (var i = 0;
        i < homePageController.homeDatatInfo!.homeData!.featuredProperty!.length;
        i++) {
      markers.add(Marker(
        //add first marker
        markerId: MarkerId(i.toString()),
        position: LatLng(
          double.parse(homePageController
                  .homeDatatInfo?.homeData!.featuredProperty![i].latitude
                  .toString() ??
              "0"),
          double.parse(homePageController
                  .homeDatatInfo?.homeData!.featuredProperty![i].longtitude
                  .toString() ??
              "0"),
        ),
        icon: BitmapDescriptor.fromBytes(markIcon), //position of marker
        infoWindow: InfoWindow(
          title: homePageController
              .homeDatatInfo?.homeData!.featuredProperty![i].title,
          snippet: homePageController
              .homeDatatInfo?.homeData!.featuredProperty![i].city,
          onTap: () async {
            setState(() {
              homePageController.rate = homePageController
                      .homeDatatInfo?.homeData!.featuredProperty![i].rate ??
                  "";
            });
            homePageController.chnageObjectIndex(i);
            await homePageController.getPropertyDetailsApi(
                id: homePageController
                    .homeDatatInfo?.homeData!.featuredProperty![i].id);
            Get.toNamed(
              Routes.viewDataScreen,
            );
          },
        ),
        onTap: () {
          print(i.toString());
          homePageController.updateMapPosition(index: i);
        },
      ));
    }
  }
}

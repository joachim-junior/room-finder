// ignore_for_file: prefer_const_constructors, sort_child_properties_last, prefer_const_literals_to_create_immutables

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:goproperti/controller/notification_controller.dart';
import 'package:goproperti/model/fontfamily_model.dart';
import 'package:goproperti/utils/Colors.dart';
import 'package:goproperti/utils/Dark_lightmode.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  NotificationController notificationController = Get.find();

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
          "Notification".tr,
          style: TextStyle(
            fontSize: 17,
            fontFamily: FontFamily.gilroyBold,
            color: notifire.getwhiteblackcolor,
          ),
        ),
      ),
      body: GetBuilder<NotificationController>(builder: (context) {
        return Column(
          children: [
            Expanded(
              child: notificationController.isLoading
                  ? notificationController
                          .notificationInfo!.notificationData!.isNotEmpty
                      ? ListView.builder(
                          itemCount: notificationController
                              .notificationInfo?.notificationData!.length,
                          itemBuilder: (context, index) {
                            return Container(
                              margin: EdgeInsets.all(10),
                              child: ListTile(
                                leading: Container(
                                  height: 60,
                                  width: 60,
                                  padding: EdgeInsets.all(15),
                                  child: Image.asset(
                                    "assets/images/Notification1.png",
                                    color: blueColor,
                                  ),
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: Color(0xFFeef4ff),
                                  ),
                                ),
                                title: Text(
                                  notificationController.notificationInfo
                                          ?.notificationData![index].title ??
                                      "",
                                  style: TextStyle(
                                    fontSize: 17,
                                    fontFamily: FontFamily.gilroyBold,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                subtitle: Text(
                                  "${notificationController.notificationInfo?.notificationData![index].datetime ?? ""}",
                                  style: TextStyle(
                                    color: notifire.getgreycolor,
                                    fontFamily: FontFamily.gilroyMedium,
                                  ),
                                ),
                              ),
                              decoration: BoxDecoration(
                                color: notifire.getblackwhitecolor,
                                borderRadius: BorderRadius.circular(15),
                              ),
                            );
                          },
                        )
                      : Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Padding(
                                padding: const EdgeInsets.only(left: 30),
                                child: Image.asset(
                                  "assets/images/bookingEmpty.png",
                                  height: 120,
                                  width: 120,
                                ),
                              ),
                              SizedBox(
                                height: 20,
                              ),
                              Text(
                                "We'll let you know when we\nget news for you"
                                    .tr,
                                textAlign: TextAlign.center,
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
          ],
        );
      }),
    );
  }
}

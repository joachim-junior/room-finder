// ignore_for_file: file_names, prefer_const_constructors, prefer_const_literals_to_create_immutables, sort_child_properties_last, avoid_print, unnecessary_brace_in_string_interps, unused_local_variable, unnecessary_new

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:get/get.dart';
import 'package:goproperti/Api/data_store.dart';
import 'package:goproperti/controller/bookingdetails_controller.dart';
import 'package:goproperti/controller/bookrealestate_controller.dart';
import 'package:goproperti/controller/mybooking_controller.dart';
import 'package:goproperti/model/fontfamily_model.dart';
import 'package:goproperti/screen/home_screen.dart';
import 'package:goproperti/utils/Colors.dart';
import 'package:goproperti/utils/Custom_widget.dart';
import 'package:goproperti/utils/Dark_lightmode.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class EReceiptScreen extends StatefulWidget {
  const EReceiptScreen({super.key});

  @override
  State<EReceiptScreen> createState() => _EReceiptScreenState();
}

class _EReceiptScreenState extends State<EReceiptScreen> {
  BookrealEstateController bookrealEstateController = Get.find();
  BookingDetailsController bookingDetailsController = Get.find();
  MyBookingController myBookingController = Get.find();

  String staus = Get.arguments["Completed"];

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

  int total = 0;

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
          "E-Receipt".tr,
          style: TextStyle(
            fontSize: 17,
            fontFamily: FontFamily.gilroyBold,
            color: notifire.getwhiteblackcolor,
          ),
        ),
      ),
      body: GetBuilder<BookingDetailsController>(builder: (context) {
        String bID =
        (bookingDetailsController.bookDetailsInfo?.bookdetails!.bookId ?? "");
        String bDate =
            ("${bookingDetailsController.bookDetailsInfo?.bookdetails!.bookDate ?? ""}")
                .split(" ")
                .first;
        String fDate =
            ("${bookingDetailsController.bookDetailsInfo?.bookdetails!.checkIn ?? ""}")
                .split(" ")
                .first;
        String ldate =
            ("${bookingDetailsController.bookDetailsInfo?.bookdetails!.checkOut ?? ""}")
                .split(" ")
                .first;
        return bookingDetailsController.isLoading
            ? SizedBox(
                height: Get.size.height,
                width: Get.size.width,
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      Container(
                        height: 200,
                        margin: EdgeInsets.symmetric(horizontal: 10),
                        width: Get.size.width,
                        child: Column(
                          children: [
                            SizedBox(
                              height: 10,
                            ),
                            Row(
                              children: [
                                SizedBox(
                                  width: 20,
                                ),
                                Text(
                                  "Booking Id".tr,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                Spacer(),
                                Text(
                                  bID,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyBold,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                SizedBox(
                                  width: 20,
                                ),
                              ],
                            ),
                            SizedBox(
                              height: 20,
                            ),
                            Row(
                              children: [
                                SizedBox(
                                  width: 20,
                                ),
                                Text(
                                  "Booking Date".tr,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                Spacer(),
                                Text(
                                  bDate,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyBold,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                SizedBox(
                                  width: 20,
                                ),
                              ],
                            ),
                            SizedBox(
                              height: 20,
                            ),
                            Row(
                              children: [
                                SizedBox(
                                  width: 20,
                                ),
                                Text(
                                  "Check in".tr,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                Spacer(),
                                Text(
                                  fDate,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyBold,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                SizedBox(
                                  width: 20,
                                ),
                              ],
                            ),
                            SizedBox(
                              height: 20,
                            ),
                            Row(
                              children: [
                                SizedBox(
                                  width: 20,
                                ),
                                Text(
                                  "Check out".tr,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                Spacer(),
                                Text(
                                  ldate,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyBold,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                SizedBox(
                                  width: 20,
                                ),
                              ],
                            ),
                            SizedBox(
                              height: 20,
                            ),
                            Row(
                              children: [
                                SizedBox(
                                  width: 20,
                                ),
                                Text(
                                  "Number Of Guest".tr,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                Spacer(),
                                Text(
                                  "${bookingDetailsController.bookDetailsInfo?.bookdetails!.noguest}",
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyBold,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                SizedBox(
                                  width: 20,
                                ),
                              ],
                            ),
                          ],
                        ),
                        decoration: BoxDecoration(
                          color: notifire.getblackwhitecolor,
                          borderRadius: BorderRadius.circular(15),
                        ),
                      ),
                      SizedBox(
                        height: 20,
                      ),
                      Container(
                        width: Get.size.width,
                        margin: EdgeInsets.symmetric(horizontal: 10),
                        child: Column(
                          children: [
                            SizedBox(
                              height: 20,
                            ),
                            Row(
                              children: [
                                SizedBox(
                                  width: 20,
                                ),
                                Text(
                                  "${"Amount".tr} (${bookingDetailsController.bookDetailsInfo?.bookdetails!.totalDay ?? ""} ${"days".tr})",
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                Spacer(),
                                Text(
                                  "${currency}${(int.parse(bookingDetailsController.bookDetailsInfo?.bookdetails!.propPrice ?? "") * int.parse(bookingDetailsController.bookDetailsInfo?.bookdetails!.totalDay ?? ""))} ",
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyBold,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                SizedBox(
                                  width: 20,
                                ),
                              ],
                            ),
                            SizedBox(
                              height: 20,
                            ),
                            Row(
                              children: [
                                SizedBox(
                                  width: 20,
                                ),
                                Text(
                                  "Tax".tr,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                Spacer(),
                                Text(
                                  "${currency}${bookingDetailsController.bookDetailsInfo?.bookdetails!.tax ?? ""} ",
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyBold,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                SizedBox(
                                  width: 20,
                                ),
                              ],
                            ),
                            SizedBox(
                              height: 20,
                            ),
                            Visibility(
                              visible: bookingDetailsController.bookDetailsInfo
                                          ?.bookdetails!.couAmt ==
                                      "0"
                                  ? false
                                  : true,
                              child: Row(
                                children: [
                                  SizedBox(
                                    width: 20,
                                  ),
                                  Text(
                                    "Coupon".tr,
                                    style: TextStyle(
                                      fontFamily: FontFamily.gilroyMedium,
                                      fontSize: 15,
                                      color: notifire.getwhiteblackcolor,
                                    ),
                                  ),
                                  Spacer(),
                                  Text(
                                    "${currency}${bookingDetailsController.bookDetailsInfo?.bookdetails!.couAmt ?? ""} ",
                                    style: TextStyle(
                                      fontFamily: FontFamily.gilroyBold,
                                      fontSize: 15,
                                      color: Color(0xFF08E761),
                                    ),
                                  ),
                                  SizedBox(
                                    width: 20,
                                  ),
                                ],
                              ),
                            ),
                            SizedBox(
                              height: bookingDetailsController.bookDetailsInfo
                                  ?.bookdetails!.couAmt ==
                                  "0" ? 0 : 20,
                            ),
                            Visibility(
                              visible: bookingDetailsController.bookDetailsInfo
                                          ?.bookdetails!.wallAmt ==
                                      "0"
                                  ? false
                                  : true,
                              child: Row(
                                children: [
                                  SizedBox(
                                    width: 20,
                                  ),
                                  Text(
                                    "Wallet".tr,
                                    style: TextStyle(
                                      fontFamily: FontFamily.gilroyMedium,
                                      fontSize: 15,
                                      color: notifire.getwhiteblackcolor,
                                    ),
                                  ),
                                  Spacer(),
                                  Text(
                                    "${currency}${bookingDetailsController.bookDetailsInfo?.bookdetails!.wallAmt ?? ""}",
                                    style: TextStyle(
                                      fontFamily: FontFamily.gilroyBold,
                                      fontSize: 15,
                                      color: Color(0xFF08E761),
                                    ),
                                  ),
                                  SizedBox(
                                    width: 20,
                                  ),
                                ],
                              ),
                            ),
                            // Padding(
                            //   padding:
                            //       const EdgeInsets.symmetric(horizontal: 10),
                            //   child: Divider(),
                            // ),
                            SizedBox(
                              height: bookingDetailsController.bookDetailsInfo
                                  ?.bookdetails!.wallAmt ==
                                  "0" ? 0 : 20,
                            ),
                            Row(
                              children: [
                                SizedBox(
                                  width: 20,
                                ),
                                Text(
                                  "Total".tr,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                Spacer(),
                                Text(
                                  "${currency}${bookingDetailsController.bookDetailsInfo?.bookdetails!.total ?? ""} ",
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyBold,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                SizedBox(
                                  width: 20,
                                ),
                              ],
                            ),
                            SizedBox(
                              height: 10,
                            ),
                          ],
                        ),
                        decoration: BoxDecoration(
                          color: notifire.getblackwhitecolor,
                          borderRadius: BorderRadius.circular(15),
                        ),
                      ),
                      SizedBox(
                        height: 20,
                      ),
                      Container(
                        child: Column(
                          children: [
                            Row(
                              children: [

                              ],
                            ),
                          ],
                        ),
                        decoration: BoxDecoration(
                          color: notifire.getblackwhitecolor,
                          borderRadius: BorderRadius.circular(15),
                        ),
                      ),
                      Container(
                        margin: EdgeInsets.symmetric(horizontal: 10),
                        child: Column(
                          children: [
                            SizedBox(
                              height: 20,
                            ),
                            Row(
                              children: [
                                SizedBox(
                                  width: 20,
                                ),
                                Text(
                                  'Name'.tr,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                Spacer(),
                                bookingDetailsController.bookDetailsInfo
                                            ?.bookdetails!.fname ==
                                        ""
                                    ? Text(
                                        getData
                                            .read("UserLogin")["name"]
                                            .toString(),
                                        style: TextStyle(
                                          fontFamily: FontFamily.gilroyBold,
                                          fontSize: 15,
                                          color: notifire.getwhiteblackcolor,
                                        ),
                                      )
                                    : Text(
                                        bookingDetailsController.bookDetailsInfo
                                                ?.bookdetails!.fname ??
                                            "",
                                        style: TextStyle(
                                          fontFamily: FontFamily.gilroyBold,
                                          fontSize: 15,
                                          color: notifire.getwhiteblackcolor,
                                        ),
                                      ),
                                SizedBox(
                                  width: 20,
                                ),
                              ],
                            ),
                            SizedBox(
                              height: 20,
                            ),
                            Row(
                              children: [
                                SizedBox(
                                  width: 20,
                                ),
                                Text(
                                  'Phone Number'.tr,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                Spacer(),
                                bookingDetailsController.bookDetailsInfo
                                            ?.bookdetails!.mobile ==
                                        ""
                                    ? Text(
                                        "${getData.read("UserLogin")["ccode"]} ${getData.read("UserLogin")["mobile"]}",
                                        style: TextStyle(
                                          fontFamily: FontFamily.gilroyBold,
                                          fontSize: 15,
                                          color: notifire.getwhiteblackcolor,
                                        ),
                                      )
                                    : Text(
                                        "${bookingDetailsController.bookDetailsInfo?.bookdetails!.ccode ?? ""} ${bookingDetailsController.bookDetailsInfo?.bookdetails!.mobile ?? ""}",
                                        style: TextStyle(
                                          fontFamily: FontFamily.gilroyBold,
                                          fontSize: 15,
                                          color: notifire.getwhiteblackcolor,
                                        ),
                                      ),
                                SizedBox(
                                  width: 20,
                                ),
                              ],
                            ),
                            SizedBox(
                              height: 20,
                            ),
                            Row(
                              children: [
                                SizedBox(
                                  width: 20,
                                ),
                                Text(
                                  'Payment Title'.tr,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                Spacer(),
                                Text(
                                  bookingDetailsController.bookDetailsInfo
                                          ?.bookdetails!.paymentTitle ??
                                      "",
                                  maxLines: 1,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyBold,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                SizedBox(
                                  width: 20,
                                ),
                              ],
                            ),
                            SizedBox(
                              height: 20,
                            ),
                            bookingDetailsController.bookDetailsInfo
                                        ?.bookdetails!.transactionId !=
                                    "0"
                                ? Row(
                                    children: [
                                      SizedBox(
                                        width: 20,
                                      ),
                                      Expanded(
                                        flex: 1,
                                        child: Text(
                                          'Transaction ID'.tr,
                                          style: TextStyle(
                                            fontFamily: FontFamily.gilroyMedium,
                                            fontSize: 15,
                                            color: notifire.getwhiteblackcolor,
                                          ),
                                        ),
                                      ),
                                      Expanded(
                                        flex: 1,
                                        child: Text(
                                          bookingDetailsController
                                                  .bookDetailsInfo
                                                  ?.bookdetails
                                                  !.transactionId ??
                                              "",
                                          maxLines: 2,
                                          style: TextStyle(
                                            fontFamily: FontFamily.gilroyBold,
                                            fontSize: 15,
                                            color: notifire.getwhiteblackcolor,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                      ),
                                      InkWell(
                                        onTap: () {
                                          Clipboard.setData(
                                            new ClipboardData(
                                              text: bookingDetailsController
                                                      .bookDetailsInfo
                                                      ?.bookdetails
                                                      !.transactionId ??
                                                  "",
                                            ),
                                          );
                                          showToastMessage("Copy");
                                        },
                                        child: Image.asset(
                                          "assets/images/copy.png",
                                          height: 25,
                                          width: 25,
                                          color: blueColor,
                                        ),
                                      ),
                                      SizedBox(
                                        width: 20,
                                      ),
                                    ],
                                  )
                                : SizedBox(),
                            SizedBox(
                              height: bookingDetailsController.bookDetailsInfo
                                  ?.bookdetails!.transactionId !=
                                  "0" ? 20 : 0,
                            ),
                            Row(
                              children: [
                                SizedBox(
                                  width: 20,
                                ),
                                Text(
                                  'Payment Status'.tr,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                Spacer(),
                                staus == "Completed"
                                    ? bookingDetailsController.bookDetailsInfo
                                                    ?.bookdetails!.pMethodId !=
                                                "2" ||
                                            bookingDetailsController
                                                    .bookDetailsInfo
                                                    ?.bookdetails
                                                    !.bookStatus !=
                                                "Cancelled"
                                        ? Container(
                                            height: 30,
                                            width: 85,
                                            alignment: Alignment.center,
                                            child: Text(
                                              'Paid'.tr,
                                              style: TextStyle(
                                                fontSize: 12,
                                                fontFamily:
                                                    FontFamily.gilroyMedium,
                                                color: blueColor,
                                              ),
                                            ),
                                            decoration: BoxDecoration(
                                              border:
                                                  Border.all(color: blueColor),
                                              borderRadius:
                                                  BorderRadius.circular(5),
                                            ),
                                          )
                                        : Container(
                                            height: 30,
                                            width: 85,
                                            alignment: Alignment.center,
                                            child: Text(
                                              "UnPaid".tr,
                                              style: TextStyle(
                                                color: Colors.red,
                                                fontFamily:
                                                    FontFamily.gilroyMedium,
                                              ),
                                            ),
                                            decoration: BoxDecoration(
                                              border:
                                                  Border.all(color: Colors.red),
                                              borderRadius:
                                                  BorderRadius.circular(5),
                                            ),
                                          )
                                    : bookingDetailsController.bookDetailsInfo
                                                ?.bookdetails!.pMethodId !=
                                            "2"
                                        ? Container(
                                            height: 30,
                                            width: 85,
                                            alignment: Alignment.center,
                                            child: Text(
                                              'Paid'.tr,
                                              style: TextStyle(
                                                fontSize: 12,
                                                fontFamily:
                                                    FontFamily.gilroyMedium,
                                                color: blueColor,
                                              ),
                                            ),
                                            decoration: BoxDecoration(
                                              border:
                                                  Border.all(color: blueColor),
                                              borderRadius:
                                                  BorderRadius.circular(5),
                                            ),
                                          )
                                        : Container(
                                            height: 30,
                                            width: 85,
                                            alignment: Alignment.center,
                                            child: Text(
                                              "UnPaid".tr,
                                              style: TextStyle(
                                                color: Colors.red,
                                                fontFamily:
                                                    FontFamily.gilroyMedium,
                                              ),
                                            ),
                                            decoration: BoxDecoration(
                                              border:
                                                  Border.all(color: Colors.red),
                                              borderRadius:
                                                  BorderRadius.circular(5),
                                            ),
                                          ),
                                SizedBox(
                                  width: 20,
                                ),
                              ],
                            ),
                            SizedBox(
                              height: 20,
                            ),
                            Row(
                              children: [
                                SizedBox(
                                  width: 20,
                                ),
                                Text(
                                  'Booking Status'.tr,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                ),
                                Spacer(),
                                Text(
                                  bookingDetailsController.bookDetailsInfo
                                          ?.bookdetails!.bookStatus ??
                                      "",
                                  maxLines: 1,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyBold,
                                    fontSize: 15,
                                    color: notifire.getwhiteblackcolor,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                SizedBox(
                                  width: 20,
                                ),
                              ],
                            ),
                            SizedBox(
                              height: 20,
                            ),
                            bookingDetailsController.bookDetailsInfo?.bookdetails!.checkIntime != null
                                ? Row(
                              children: [
                                SizedBox(width: 20),
                                Text("Check In Time",style: TextStyle(
                                  fontFamily: FontFamily.gilroyMedium,
                                  fontSize: 15,
                                  color: notifire.getwhiteblackcolor,
                                ),
                                ),
                                Spacer(),
                                Text(bookingDetailsController.bookDetailsInfo
                                    ?.bookdetails!.checkIntime ??
                                    "",style: TextStyle(
                                  fontFamily: FontFamily.gilroyBold,
                                  fontSize: 15,
                                  color: notifire.getwhiteblackcolor,
                                  overflow: TextOverflow.ellipsis,
                                ),),
                                SizedBox(width: 20),
                              ],
                            )
                                : SizedBox(),
                            SizedBox(
                              height: bookingDetailsController.bookDetailsInfo?.bookdetails!.checkIntime != null ? 20 : 0,
                            ),
                            bookingDetailsController.bookDetailsInfo?.bookdetails!.checkOuttime != null
                                ? Row(
                              children: [
                                SizedBox(width: 20),
                                Text("Check Out Time",style: TextStyle(
                                  fontFamily: FontFamily.gilroyMedium,
                                  fontSize: 15,
                                  color: notifire.getwhiteblackcolor,
                                ),
                                ),
                                Spacer(),
                                Text(bookingDetailsController.bookDetailsInfo
                                    ?.bookdetails!.checkOuttime ??
                                    "",style: TextStyle(
                                  fontFamily: FontFamily.gilroyBold,
                                  fontSize: 15,
                                  color: notifire.getwhiteblackcolor,
                                  overflow: TextOverflow.ellipsis,
                                ),),
                                SizedBox(width: 20),
                              ],
                            )
                                : SizedBox(),
                            SizedBox(
                              height: bookingDetailsController.bookDetailsInfo?.bookdetails!.checkOuttime != null ? 20 : 0,
                            ),
                          ],
                        ),
                        decoration: BoxDecoration(
                          color: notifire.getblackwhitecolor,
                          borderRadius: BorderRadius.circular(15),
                        ),
                      ),
                      SizedBox(
                        height: 20,
                      ),
                      bookingDetailsController.bookDetailsInfo?.bookdetails!.addNote == "" ? SizedBox() : Container(
                        width: double.infinity,
                        margin: EdgeInsets.symmetric(horizontal: 10),
                        decoration: BoxDecoration(
                          color: notifire.getblackwhitecolor,
                          borderRadius: BorderRadius.circular(15),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text("Note:",
                                style: TextStyle(
                                  fontFamily: FontFamily.gilroyBold,
                                  fontSize: 18,
                                  color: notifire.getwhiteblackcolor,
                                ),
                              ),
                              SizedBox(height: 3),
                              Text("${bookingDetailsController.bookDetailsInfo?.bookdetails!.addNote}",
                                style: TextStyle(
                                  fontFamily: FontFamily.gilroyMedium,
                                  fontSize: 15,
                                  color: notifire.getwhiteblackcolor,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      SizedBox(
                        height: 10,
                      ),
                      bookingDetailsController
                                  .bookDetailsInfo?.bookdetails!.bookStatus ==
                              "Completed"
                          ? bookingDetailsController
                                      .bookDetailsInfo?.bookdetails!.isRate ==
                                  "0"
                              ? GestButton(
                                  Width: Get.size.width,
                                  height: 50,
                                  buttoncolor: blueColor,
                                  margin: EdgeInsets.only(
                                      top: 15, left: 30, right: 30),
                                  buttontext: "Review".tr,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyBold,
                                    color: WhiteColor,
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  onclick: () {
                                    reviewSheet();
                                  },
                                )
                              : SizedBox.shrink()
                          : SizedBox(),
                      SizedBox(
                        height: 40,
                      ),
                    ],
                  ),
                ),
              )
            : Center(
                child: CircularProgressIndicator(),
              );
      }),
    );
  }

  Future reviewSheet() {
    return Get.bottomSheet(
      isScrollControlled: true,
      GetBuilder<BookingDetailsController>(builder: (context) {
        return Container(
          height: 520,
          child: Column(
            children: [
              SizedBox(
                height: 20,
              ),
              Text(
                "Leave a Review",
                style: TextStyle(
                  fontSize: 20,
                  fontFamily: FontFamily.gilroyBold,
                  color: notifire.getwhiteblackcolor,
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
                height: 20,
              ),
              Text(
                "How was your experience",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 17,
                  fontFamily: FontFamily.gilroyBold,
                  color: notifire.getwhiteblackcolor,
                ),
              ),
              SizedBox(
                height: 20,
              ),
              RatingBar(
                initialRating: 1,
                direction: Axis.horizontal,
                allowHalfRating: true,
                itemCount: 5,
                ratingWidget: RatingWidget(
                  full: Image.asset(
                    'assets/images/starBold.png',
                    color: blueColor,
                  ),
                  half: Image.asset(
                    'assets/images/star-half.png',
                    color: blueColor,
                  ),
                  empty: Image.asset(
                    'assets/images/Star.png',
                    color: blueColor,
                  ),
                ),
                itemPadding: EdgeInsets.symmetric(horizontal: 4.0),
                onRatingUpdate: (rating) {
                  bookingDetailsController.totalRateUpdate(rating);
                },
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
                height: 20,
              ),
              Padding(
                padding: const EdgeInsets.only(top: 10, left: 15),
                child: Text(
                  "Write Your Review",
                  style: TextStyle(
                    fontSize: 17,
                    fontFamily: FontFamily.gilroyBold,
                    color: notifire.getwhiteblackcolor,
                  ),
                ),
              ),
              Container(
                margin: EdgeInsets.all(15),
                child: TextFormField(
                  controller: bookingDetailsController.ratingText,
                  minLines: 4,
                  keyboardType: TextInputType.multiline,
                  maxLines: null,
                  cursorColor: notifire.getwhiteblackcolor,
                  decoration: InputDecoration(
                    enabledBorder: OutlineInputBorder(
                      borderSide: BorderSide(
                        color: notifire.getborderColor,
                      ),
                      borderRadius: BorderRadius.circular(15),
                    ),
                    contentPadding: EdgeInsets.all(10),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(15),
                      borderSide: BorderSide(
                        color: notifire.getborderColor,
                      )
                    ),
                    border: InputBorder.none,
                    hintText: "Your review here...",
                    hintStyle: TextStyle(
                      fontFamily: FontFamily.gilroyMedium,
                      fontSize: 15,
                    ),
                  ),
                  style: TextStyle(
                    fontFamily: FontFamily.gilroyMedium,
                    fontSize: 16,
                    color: notifire.getwhiteblackcolor,
                  ),
                ),
                decoration: BoxDecoration(
                  color: notifire.getblackwhitecolor,
                  borderRadius: BorderRadius.circular(15),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                ),
                child: Divider(
                  color: notifire.getgreycolor,
                ),
              ),
              Row(
                children: [
                  Expanded(
                    child: InkWell(
                      onTap: () {
                        Get.back();
                      },
                      child: Container(
                        height: 50,
                        margin: EdgeInsets.all(15),
                        alignment: Alignment.center,
                        child: Text(
                          "Maybe Later",
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
                        bookingDetailsController.reviewUpdateApi(
                          bookId: bookingDetailsController
                              .bookDetailsInfo?.bookdetails!.bookId,
                        );
                      },
                      child: Container(
                        height: 50,
                        margin: EdgeInsets.all(15),
                        alignment: Alignment.center,
                        child: Text(
                          "Submit",
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
            color: notifire.getblackwhitecolor,
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(30),
              topRight: Radius.circular(30),
            ),
          ),
        );
      }),
    );
  }
}

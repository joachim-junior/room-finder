// ignore_for_file: prefer_const_constructors, unnecessary_new, prefer_interpolation_to_compose_strings, avoid_print, unused_field, sort_child_properties_last, prefer_const_literals_to_create_immutables, prefer_final_fields, unnecessary_string_interpolations, unnecessary_brace_in_string_interps

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:goproperti/controller/bookrealestate_controller.dart';
import 'package:goproperti/controller/homepage_controller.dart';
import 'package:goproperti/controller/reviewsummary_controller.dart';
import 'package:goproperti/controller/wallet_controller.dart';
import 'package:goproperti/model/fontfamily_model.dart';
import 'package:goproperti/utils/Colors.dart';
import 'package:goproperti/utils/Custom_widget.dart';
import 'package:goproperti/utils/Dark_lightmode.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:syncfusion_flutter_datepicker/datepicker.dart';

import '../controller/calendar_controller.dart';

class BookRealEstate extends StatefulWidget {
  const BookRealEstate({super.key});

  @override
  State<BookRealEstate> createState() => _BookRealEstateState();
}

class _BookRealEstateState extends State<BookRealEstate> {
  BookrealEstateController bookrealEstateController = Get.find();
  HomePageController homePageController = Get.find();
  ReviewSummaryController reviewSummaryController = Get.find();
  DateRangePickerController controller = DateRangePickerController();
  CalendarController calendarController = Get.find();

  WalletController walletController = Get.find();

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

  List<Duration> list = [];

  int count = 1;

  @override
  void initState() {
    super.initState();
  }

  List<String> dates = [];

  @override
  void dispose() {
    super.dispose();
    bookrealEstateController.cleanDate();
  }
  List<PickerDateRange> _generatePickerDateRanges(List<String> dates) {
    return dates.map((date) {
      DateTime parsedDate = DateTime.parse(date);
      return PickerDateRange(parsedDate, parsedDate);
    }).toList();
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
          "Book Now ${homePageController.propetydetailsInfo?.propetydetails!.title}".tr,
          style: TextStyle(
            fontSize: 17,
            fontFamily: FontFamily.gilroyBold,
            color: notifire.getwhiteblackcolor,
          ),
        ),
      ),
      body: SingleChildScrollView(
        physics: BouncingScrollPhysics(),
        child: GetBuilder<BookrealEstateController>(builder: (context) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.only(top: 10, left: 15),
                child: Text(
                  "Select Date".tr,
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
              Container(
                margin: EdgeInsets.all(10),
                child: SfDateRangePicker(
                  controller: controller,
                  onSelectionChanged:
                      bookrealEstateController.onSelectionChanged,
                  selectionMode: DateRangePickerSelectionMode.range,
                  enablePastDates: false,
                  startRangeSelectionColor: bookrealEstateController.checkDateResult == "true" ? blueColor : RedColor,
                  endRangeSelectionColor: bookrealEstateController.checkDateResult == "true" ? blueColor : RedColor,
                  headerStyle: DateRangePickerHeaderStyle(
                    textStyle: TextStyle(
                      fontFamily: FontFamily.gilroyMedium,
                      color: notifire.getwhiteblackcolor,
                    ),
                  ),
                  selectionTextStyle: TextStyle(fontFamily: FontFamily.gilroyMedium),
                  rangeTextStyle: TextStyle(color: notifire.getwhiteblackcolor, fontFamily: FontFamily.gilroyMedium),
                  monthCellStyle: DateRangePickerMonthCellStyle(
                    disabledDatesTextStyle: TextStyle(color: notifire.getgreycolor, fontFamily: FontFamily.gilroyMedium),
                    textStyle: TextStyle(color: notifire.getwhiteblackcolor, fontFamily: FontFamily.gilroyMedium),
                    blackoutDateTextStyle: TextStyle(color: Colors.red, decoration: TextDecoration.lineThrough),
                  ),
                  monthViewSettings:  DateRangePickerMonthViewSettings(
                  viewHeaderStyle: DateRangePickerViewHeaderStyle(textStyle: TextStyle(color: notifire.getwhiteblackcolor, fontFamily: FontFamily.gilroyMedium)),
                  blackoutDates: [
                    for (int i = 0; i < calendarController.selectedDate.length; i++)
                      for (int a = 0; a <= DateTime.parse(calendarController.selectedDate[i].toString()).difference(DateTime.parse(calendarController.selectedDate[i].toString())).inDays; a++)
                        DateTime.parse(calendarController.selectedDate[i].toString()).add(Duration(days: a)),
                  ]),
                  backgroundColor: notifire.getblackwhitecolor,
                  initialSelectedRange: PickerDateRange(
                    DateTime.now().subtract(
                      Duration(days: 0),
                    ),
                    DateTime.now().add(
                      const Duration(days: 0),
                    ),
                  ),
                ),
                decoration: BoxDecoration(
                  color: Color(0xFFeef4ff),
                  borderRadius: BorderRadius.circular(15),
                ),
              ),
              SizedBox(
                height: 10,
              ),
              Row(
                children: [
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.only(left: 15),
                      child: Text(
                        "Check in".tr,
                        style: TextStyle(
                          fontSize: 18,
                          fontFamily: FontFamily.gilroyBold,
                          color: notifire.getwhiteblackcolor,
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.only(left: 15),
                      child: Text(
                        "Check out".tr,
                        style: TextStyle(
                          fontSize: 18,
                          fontFamily: FontFamily.gilroyBold,
                          color: notifire.getwhiteblackcolor,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(
                height: 10,
              ),
              Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 55,
                      margin: EdgeInsets.all(8),
                      child: Row(
                        children: [
                          SizedBox(
                            width: 15,
                          ),
                          bookrealEstateController.visible
                              ? Text(
                                  bookrealEstateController.checkIn,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                )
                              : Text(
                                  "Check in".tr,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    color: notifire.getgreycolor,
                                  ),
                                ),
                          Spacer(),
                          Image.asset(
                            "assets/images/Calendar.png",
                            height: 25,
                            width: 25,
                            color: bookrealEstateController.visible
                                ? notifire.getwhiteblackcolor
                                : notifire.getgreycolor,
                          ),
                          SizedBox(
                            width: 5,
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: notifire.getblackwhitecolor,
                        borderRadius: BorderRadius.circular(15),
                        border: Border.all(color: notifire.getborderColor),
                      ),
                    ),
                  ),
                  Expanded(
                    child: Container(
                      height: 55,
                      margin: EdgeInsets.all(8),
                      alignment: Alignment.center,
                      child: Row(
                        children: [
                          SizedBox(
                            width: 15,
                          ),
                          bookrealEstateController.visible
                              ? Text(
                                  bookrealEstateController.checkOut,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    color: notifire.getwhiteblackcolor,
                                  ),
                                )
                              : Text(
                                  "Check out".tr,
                                  style: TextStyle(
                                    fontFamily: FontFamily.gilroyMedium,
                                    color: notifire.getgreycolor,
                                  ),
                                ),
                          Spacer(),
                          Image.asset(
                            "assets/images/Calendar.png",
                            height: 25,
                            width: 25,
                            color: bookrealEstateController.visible
                                ? notifire.getwhiteblackcolor
                                : notifire.getgreycolor,
                          ),
                          SizedBox(
                            width: 10,
                          ),
                        ],
                      ),
                      decoration: BoxDecoration(
                        color: notifire.getblackwhitecolor,
                        borderRadius: BorderRadius.circular(15),
                        border: Border.all(color: notifire.getborderColor),
                      ),
                    ),
                  ),
                ],
              ),
              Container(
                height: 100,
                width: Get.size.width,
                margin: EdgeInsets.all(10),
                child: Row(
                  children: [
                    Expanded(
                      flex: 2,
                      child: Container(
                        margin: EdgeInsets.all(8),
                        padding: EdgeInsets.only(left: 15),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              "Number of Guest".tr,
                              style: TextStyle(
                                color: notifire.getwhiteblackcolor,
                                fontFamily: FontFamily.gilroyBold,
                                fontSize: 17,
                              ),
                            ),
                            SizedBox(
                              height: 15,
                            ),
                            Text(
                              "${"Allowed Max".tr} ${reviewSummaryController.plimit} ${"Guest".tr}",
                              style: TextStyle(
                                color: notifire.getwhiteblackcolor,
                                fontFamily: FontFamily.gilroyMedium,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    Expanded(
                      flex: 1,
                      child: Container(
                        margin: EdgeInsets.all(5),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            SizedBox(
                              width: 10,
                            ),
                            InkWell(
                              onTap: () {
                                if (bookrealEstateController.count > 1) {
                                  setState(() {
                                    bookrealEstateController.count--;
                                  });
                                }
                              },
                              child: Container(
                                height: 30,
                                width: 30,
                                alignment: Alignment.center,
                                child: Icon(
                                  Icons.remove,
                                  color: blueColor,
                                ),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: notifire.getborderColor,
                                  ),
                                ),
                              ),
                            ),
                            Expanded(
                              child: Container(
                                alignment: Alignment.center,
                                child: Text("${bookrealEstateController.count}",
                                    style: TextStyle(
                                        color: notifire.getwhiteblackcolor)),
                              ),
                            ),
                            InkWell(
                              onTap: () {
                                if (bookrealEstateController.count <
                                    int.parse(reviewSummaryController.plimit)) {
                                  setState(() {
                                    bookrealEstateController.count++;
                                  });
                                }
                              },
                              child: Container(
                                height: 30,
                                width: 30,
                                alignment: Alignment.center,
                                child: Icon(
                                  Icons.add,
                                  color: blueColor,
                                ),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: notifire.getborderColor,
                                  ),
                                ),
                              ),
                            ),
                            SizedBox(
                              width: 10,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                decoration: BoxDecoration(
                  color: notifire.getblackwhitecolor,
                  borderRadius: BorderRadius.circular(15),
                  border: Border.all(color: notifire.getborderColor),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(top: 10, left: 15),
                child: Text(
                  "Note to Owner (optional)".tr,
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
                  controller: reviewSummaryController.note,
                  minLines: 5,
                  keyboardType: TextInputType.multiline,
                  maxLines: null,
                  cursorColor: notifire.getwhiteblackcolor,
                  decoration: InputDecoration(
                    contentPadding: EdgeInsets.all(10),
                    focusedBorder: InputBorder.none,
                    border: InputBorder.none,
                    hintText: "Notes".tr,
                    hintStyle: TextStyle(
                      fontFamily: FontFamily.gilroyMedium,
                      color: notifire.getwhiteblackcolor,
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
                  border: Border.all(color: notifire.getborderColor),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  SizedBox(
                    width: 15,
                  ),
                  Text(
                    "Booking for someone".tr,
                    style: TextStyle(
                      fontSize: 17,
                      fontFamily: FontFamily.gilroyBold,
                      color: notifire.getwhiteblackcolor,
                    ),
                  ),
                  Spacer(),
                  Transform.scale(
                    scale: 1,
                    child: Checkbox(
                      value: bookrealEstateController.chack,
                      side: const BorderSide(color: Color(0xffC5CAD4)),
                      activeColor: blueColor,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(5),
                      ),
                      onChanged: (newbool) {
                        bookrealEstateController.bookingForSomeOne(newbool);
                      },
                    ),
                  ),
                  SizedBox(
                    width: 10,
                  ),
                ],
              ),
              GestButton(
                Width: Get.size.width,
                height: 50,
                buttoncolor: blueColor,
                margin: EdgeInsets.only(top: 15, left: 30, right: 30),
                buttontext: "Continue".tr,
                style: TextStyle(
                  fontFamily: FontFamily.gilroyBold,
                  color: WhiteColor,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
                onclick: () {
                  walletController.getReferData();
                  bookrealEstateController.checkDateApi(
                    pid: reviewSummaryController.id,
                  );
                },
              ),
              SizedBox(
                height: 20,
              ),
            ],
          );
        }),
      ),
    );
  }
}

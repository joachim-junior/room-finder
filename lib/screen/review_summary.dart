import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:goproperti/Api/config.dart';
import 'package:goproperti/controller/bookrealestate_controller.dart';
import 'package:goproperti/controller/reviewsummary_controller.dart';
import 'package:goproperti/controller/wallet_controller.dart';
import 'package:goproperti/model/fontfamily_model.dart';
import 'package:goproperti/utils/Colors.dart';
import 'package:goproperti/utils/Custom_widget.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../utils/Dark_lightmode.dart';

class ReviewSummaryScreen extends StatefulWidget {
  const ReviewSummaryScreen({super.key});

  @override
  State<ReviewSummaryScreen> createState() => _ReviewSummaryScreenState();
}

class _ReviewSummaryScreenState extends State<ReviewSummaryScreen> {
  final BookrealEstateController bookController = Get.find();
  final ReviewSummaryController reviewController = Get.find();
  final WalletController walletController = Get.find();
  bool _isProcessing = false;
  late ColorNotifire notifire;
  late double price;
  late double totalPrice;
  late double taxAmount;
  late String formattedDate;

  @override
  void initState() {
    super.initState();
    _initializeData();
  }

  void _initializeData() {
    price = double.parse(reviewController.pPrice);
    totalPrice = price * bookController.days.length;
    taxAmount = totalPrice * walletController.tex / 100;
    formattedDate = DateFormat('dd/MM/yyyy').format(DateTime.now());
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
          icon: Icon(Icons.arrow_back, color: notifire.getwhiteblackcolor),
          onPressed: () => Get.back(),
        ),
        title: Text(
          "Review Summary".tr,
          style: TextStyle(
            fontSize: 17,
            fontFamily: FontFamily.gilroyBold,
            color: notifire.getwhiteblackcolor,
          ),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildPropertyCard(),
                  const SizedBox(height: 16),
                  _buildBookingDetailsCard(),
                  const SizedBox(height: 16),
                  _buildPaymentSummaryCard(),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
          _buildConfirmButton(),
        ],
      ),
    );
  }

  Widget _buildPropertyCard() {
    return Container(
      height: 140,
      margin: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: notifire.getblackwhitecolor,
        borderRadius: BorderRadius.circular(15),
      ),
      child: Row(
        children: [
          Container(
            width: 100,
            height: 100,
            margin: const EdgeInsets.all(15),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              image: DecorationImage(
                image: NetworkImage(
                    "${Config.imageUrl}${reviewController.pImage}"),
                fit: BoxFit.cover,
              ),
            ),
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  reviewController.pTitle,
                  style: TextStyle(
                    fontSize: 17,
                    fontFamily: FontFamily.gilroyBold,
                    color: notifire.getwhiteblackcolor,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  "${Config.currency}${price.toStringAsFixed(2)}/night",
                  style: TextStyle(
                    fontSize: 16,
                    fontFamily: FontFamily.gilroyMedium,
                    color: notifire.getgreycolor,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBookingDetailsCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: notifire.getblackwhitecolor,
        borderRadius: BorderRadius.circular(15),
      ),
      child: Column(
        children: [
          _buildDetailRow("Booking Date".tr, formattedDate),
          const Divider(color: Colors.grey),
          _buildDetailRow("Check in".tr, bookController.checkIn),
          const Divider(color: Colors.grey),
          _buildDetailRow("Check out".tr, bookController.checkOut),
          const Divider(color: Colors.grey),
          _buildDetailRow(
              "Number of Guest".tr, bookController.count.toString()),
        ],
      ),
    );
  }

  Widget _buildPaymentSummaryCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: notifire.getblackwhitecolor,
        borderRadius: BorderRadius.circular(15),
      ),
      child: Column(
        children: [
          _buildPriceRow(
              "${"Amount".tr} (${bookController.days.length} ${"days".tr})",
              "${Config.currency}${totalPrice.toStringAsFixed(2)}"),
          const Divider(color: Colors.grey),
          _buildPriceRow("${"Tax".tr}(${walletController.tex}%)",
              "${Config.currency}${taxAmount.toStringAsFixed(2)}"),
          const Divider(color: Colors.grey),
          _buildPriceRow("Total".tr,
              "${Config.currency}${(totalPrice + taxAmount).toStringAsFixed(2)}",
              isTotal: true),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Text(label,
              style: TextStyle(
                fontFamily: FontFamily.gilroyMedium,
                color: notifire.getwhiteblackcolor,
                fontSize: 15,
              )),
          const Spacer(),
          Text(value,
              style: TextStyle(
                fontFamily: FontFamily.gilroyBold,
                color: notifire.getwhiteblackcolor,
                fontSize: 15,
              )),
        ],
      ),
    );
  }

  Widget _buildPriceRow(String label, String value, {bool isTotal = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Text(label,
              style: TextStyle(
                fontFamily: FontFamily.gilroyMedium,
                color: notifire.getwhiteblackcolor,
                fontSize: 15,
              )),
          const Spacer(),
          Text(value,
              style: TextStyle(
                fontFamily: FontFamily.gilroyBold,
                color: isTotal ? blueColor : notifire.getwhiteblackcolor,
                fontSize: isTotal ? 16 : 15,
              )),
        ],
      ),
    );
  }

  Widget _buildConfirmButton() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: GestButton(
        Width: Get.size.width,
        height: 50,
        buttoncolor: blueColor,
        buttontext: _isProcessing ? "Processing...".tr : "Confirm Booking".tr,
        style: TextStyle(
          fontFamily: FontFamily.gilroyBold,
          color: WhiteColor,
          fontSize: 16,
        ),
        onclick: _isProcessing ? null : _confirmBooking,
      ),
    );
  }

  Future<void> _confirmBooking() async {
    setState(() => _isProcessing = true);

    try {
      // Here you would call your booking API
      await Future.delayed(const Duration(seconds: 2));

      // Show success dialog
      _showSuccessDialog();

      // Reset booking data
      bookController.count = 1;
      bookController.checkIn = '';
      bookController.checkOut = '';
      bookController.selectedDate = DateTime.now();
      bookController.selectedDates = [];
      bookController.selectedDatees = '';
    } catch (e) {
      showToastMessage("Booking failed: ${e.toString()}".tr);
    } finally {
      setState(() => _isProcessing = false);
    }
  }

  Future<void> _showSuccessDialog() {
    return Get.defaultDialog(
      title: "",
      content: Column(
        children: [
          Icon(Icons.check_circle, color: Colors.green, size: 80),
          const SizedBox(height: 20),
          Text(
            "Booking Confirmed!".tr,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            "Your booking has been successfully confirmed".tr,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 20),
          GestButton(
            Width: Get.size.width * 0.7,
            height: 45,
            buttoncolor: blueColor,
            buttontext: "View Bookings".tr,
            style: TextStyle(
              fontFamily: FontFamily.gilroyBold,
              color: WhiteColor,
              fontSize: 16,
            ),
            onclick: () {
              Get.until((route) => route.isFirst);
              // Navigate to bookings screen
            },
          ),
        ],
      ),
    );
  }
}

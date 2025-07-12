import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:goproperti/Api/config.dart';
import 'package:goproperti/controller/wallet_controller.dart';
import 'package:goproperti/utils/Colors.dart';
import 'package:goproperti/utils/Custom_widget.dart';
import 'package:provider/provider.dart';
import '../../utils/Dark_lightmode.dart';
import 'package:goproperti/model/fontfamily_model.dart';

class AddWalletScreen extends StatefulWidget {
  const AddWalletScreen({super.key});

  @override
  State<AddWalletScreen> createState() => _AddWalletScreenState();
}

class _AddWalletScreenState extends State<AddWalletScreen> {
  final WalletController walletController = Get.find();
  late ColorNotifire notifire;
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _phoneController = TextEditingController();
  bool _isProcessing = false;
  String? _transactionId;

  @override
  void initState() {
    super.initState();
    _phoneController.text = walletController.userPhone ?? '';
  }

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
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
          onPressed: () => Get.back(),
          icon: Icon(
            Icons.arrow_back,
            color: notifire.getwhiteblackcolor,
          ),
        ),
        title: Text(
          "Add Wallet Balance".tr,
          style: TextStyle(
            fontSize: 17,
            fontFamily: FontFamily.gilroyBold,
            color: notifire.getwhiteblackcolor,
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Wallet Balance Display
                _buildBalanceCard(),
                const SizedBox(height: 30),

                // Amount Input
                _buildAmountField(),
                const SizedBox(height: 20),

                // Phone Number Input
                _buildPhoneField(),
                const SizedBox(height: 30),

                // Add Funds Button
                _buildPaymentButton(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBalanceCard() {
    return Container(
      height: 150,
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(15),
        gradient: LinearGradient(
          colors: [blueColor, Colors.blue.shade300],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Current Balance".tr,
            style: TextStyle(
              fontSize: 16,
              color: WhiteColor.withOpacity(0.8),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            "${Config.currency}${walletController.walletInfo?.wallet ?? '0.00'}",
            style: TextStyle(
              fontSize: 32,
              fontFamily: FontFamily.gilroyBold,
              color: WhiteColor,
            ),
          ),
          const Spacer(),
          Text(
            "Add money to pay for bookings easily".tr,
            style: TextStyle(
              fontSize: 14,
              color: WhiteColor.withOpacity(0.8),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAmountField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Enter Amount".tr,
          style: TextStyle(
            fontSize: 16,
            color: notifire.getwhiteblackcolor,
          ),
        ),
        const SizedBox(height: 10),
        Container(
          decoration: BoxDecoration(
            color: notifire.getblackwhitecolor,
            borderRadius: BorderRadius.circular(15),
            border: Border.all(color: notifire.getborderColor),
          ),
          child: TextFormField(
            controller: walletController.amount,
            keyboardType: TextInputType.number,
            decoration: InputDecoration(
              contentPadding: EdgeInsets.all(10),
              focusedBorder: InputBorder.none,
              hintStyle: TextStyle(
                fontFamily: FontFamily.gilroyMedium,
                color: notifire.getwhiteblackcolor,
                fontSize: 15,
              ),
              hintText: "E.g. 100000",
              prefixText: "${Config.currency} ",
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            style: TextStyle(
              fontFamily: FontFamily.gilroyMedium,
              fontSize: 16,
              color: notifire.getwhiteblackcolor,
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter an amount'.tr;
              }
              if (double.tryParse(value) == null) {
                return 'Please enter a valid number'.tr;
              }
              if (double.parse(value) <= 0) {
                return 'Amount must be greater than zero'.tr;
              }
              if (double.parse(value) < 10) {
                return 'Minimum amount is ${Config.currency}10'.tr;
              }
              return null;
            },
          ),
        ),
      ],
    );
  }

  Widget _buildPhoneField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Mobile Money Phone Number".tr,
          style: TextStyle(
            fontSize: 16,
            color: notifire.getwhiteblackcolor,
          ),
        ),
        const SizedBox(height: 10),
        Container(
          decoration: BoxDecoration(
            color: notifire.getblackwhitecolor,
            borderRadius: BorderRadius.circular(15),
            border: Border.all(color: notifire.getborderColor),
          ),
          child: TextFormField(
            controller: _phoneController,
            keyboardType: TextInputType.phone,
            decoration: InputDecoration(
              contentPadding: EdgeInsets.all(10),
              focusedBorder: InputBorder.none,
              hintStyle: TextStyle(
                fontFamily: FontFamily.gilroyMedium,
                color: notifire.getwhiteblackcolor,
                fontSize: 15,
              ),
              hintText: "Enter your phone number",
              prefixText: "${walletController.userCountryCode ?? ''} ",
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            style: TextStyle(
              fontFamily: FontFamily.gilroyMedium,
              fontSize: 16,
              color: notifire.getwhiteblackcolor,
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your phone number'.tr;
              }
              if (!RegExp(r'^[0-9]{9,15}$').hasMatch(value)) {
                return 'Please enter a valid phone number'.tr;
              }
              return null;
            },
          ),
        ),
      ],
    );
  }

  Widget _buildPaymentButton() {
    return GestButton(
      Width: Get.size.width,
      height: 50,
      buttoncolor: blueColor,
      buttontext: _isProcessing ? "Processing...".tr : "Add Funds".tr,
      style: TextStyle(
        fontFamily: FontFamily.gilroyBold,
        color: WhiteColor,
        fontSize: 16,
      ),
      onclick: _isProcessing ? null : _processPayment,
    );
  }

  Future<void> _processPayment() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isProcessing = true);

    try {
      final response = await walletController.initiateMobileMoneyPayment(
        amount: walletController.amount.text,
        phone: _phoneController.text.trim(),
        countryCode: walletController.userCountryCode ?? '',
      );

      if (response['status'] == 'success') {
        _transactionId = response['transaction_id'];
        _showPaymentConfirmation(response);
      } else {
        _handlePaymentError(response['message'] ?? 'Payment initiation failed');
      }
    } catch (e) {
      _handlePaymentError(e.toString());
    } finally {
      setState(() => _isProcessing = false);
    }
  }

  void _showPaymentConfirmation(Map<String, dynamic> response) {
    Get.dialog(
      AlertDialog(
        title: Text("Confirm Payment".tr),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              "A payment request has been sent to your phone".tr,
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 20),
            Text(
              "Amount: ${Config.currency}${walletController.amount.text}",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              "Phone: +${walletController.userCountryCode} ${_phoneController.text}",
              style: TextStyle(fontSize: 16),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: Text("Cancel".tr),
          ),
          TextButton(
            onPressed: () => _verifyPaymentStatus(),
            child: Text("I've Paid".tr),
          ),
        ],
      ),
    );
  }

  Future<void> _verifyPaymentStatus() async {
    Get.back();
    setState(() => _isProcessing = true);

    try {
      bool paymentVerified = false;
      int attempts = 0;
      const maxAttempts = 5;
      const delay = Duration(seconds: 5);

      while (!paymentVerified && attempts < maxAttempts) {
        attempts++;
        await Future.delayed(delay);

        final status =
            await walletController.checkPaymentStatus(_transactionId!);

        if (status == 'completed') {
          paymentVerified = true;
          await walletController.getWalletUpdateData();
          _showPaymentSuccess();
          return;
        } else if (status == 'failed') {
          throw Exception('Payment failed or was cancelled');
        }
      }

      if (!paymentVerified) {
        throw Exception('Payment verification timeout');
      }
    } catch (e) {
      _handlePaymentError(e.toString());
    } finally {
      setState(() => _isProcessing = false);
    }
  }

  void _showPaymentSuccess() {
    Get.dialog(
      AlertDialog(
        title: Text("Payment Successful".tr),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.check_circle, color: Colors.green, size: 50),
            const SizedBox(height: 20),
            Text(
              "${Config.currency}${walletController.amount.text} has been added to your wallet",
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 10),
            Text(
              "Transaction ID: ${_transactionId!.substring(0, 8)}...",
              style: TextStyle(fontSize: 14, color: Colors.grey),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              walletController.amount.clear();
              Get.back();
              Get.back();
            },
            child: Text("Done".tr),
          ),
        ],
      ),
    );
  }

  void _handlePaymentError(String message) {
    Get.dialog(
      AlertDialog(
        title: Text("Payment Error".tr),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: Text("OK".tr),
          ),
        ],
      ),
    );
  }
}

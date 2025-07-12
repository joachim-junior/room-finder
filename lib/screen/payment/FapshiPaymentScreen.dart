// ignore_for_file: prefer_final_fields, unused_field, prefer_typing_uninitialized_variables, use_key_in_widget_constructors, prefer_interpolation_to_compose_strings, unnecessary_string_interpolations, await_only_futures, avoid_print, prefer_const_constructors, avoid_unnecessary_containers, file_names
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:goproperti/Api/config.dart';
import 'dart:convert'; // For jsonEncode/jsonDecode
import 'package:http/http.dart' as http;

class FapshiPaymentScreen extends StatefulWidget {
  final double amount;
  final String phone;
  final String bookingId;
  final String email;

  const FapshiPaymentScreen(
      {required this.amount,
      required this.phone,
      required this.bookingId,
      required this.email});

  @override
  State<FapshiPaymentScreen> createState() => _FapshiPaymentScreenState();
}

class _FapshiPaymentScreenState extends State<FapshiPaymentScreen> {
  bool isLoading = true;
  bool paymentSuccess = false;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    _initiatePayment();
  }

  _initiatePayment() async {
    try {
      final response = await http.post(
        Uri.parse('${Config.path}fapshi_initiate.php'),
        body: jsonEncode({
          'amount': widget.amount,
          'phone': widget.phone,
          'booking_id': widget.bookingId,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['status'] == 'pending') {
          // Payment initiated successfully
          setState(() {
            isLoading = false;
          });

          // You might want to implement periodic status checks here
          // or rely solely on webhooks
        } else {
          setState(() {
            errorMessage = data['message'] ?? 'Payment initiation failed';
            isLoading = false;
          });
        }
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Connection error';
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Mobile Money Payment".tr),
      ),
      body: Center(
        child: isLoading
            ? CircularProgressIndicator()
            : errorMessage != null
                ? Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(errorMessage!),
                      ElevatedButton(
                        onPressed: () => Get.back(),
                        child: Text("Go Back".tr),
                      ),
                    ],
                  )
                : Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.phone_android, size: 50, color: Colors.green),
                      SizedBox(height: 20),
                      Text(
                        "Check your phone to complete payment".tr,
                        style: TextStyle(fontSize: 18),
                      ),
                      SizedBox(height: 10),
                      Text(
                        "Amount: ${Config.currency}${widget.amount}",
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 30),
                      ElevatedButton(
                        onPressed: () {
                          // Optionally check payment status before closing
                          Get.back(result: paymentSuccess ? "success" : null);
                        },
                        child: Text("Done".tr),
                      ),
                    ],
                  ),
      ),
    );
  }
}

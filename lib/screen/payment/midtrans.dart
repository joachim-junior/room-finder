// ignore_for_file: prefer_final_fields, unused_field, prefer_typing_uninitialized_variables, use_key_in_widget_constructors, prefer_interpolation_to_compose_strings, unnecessary_string_interpolations, await_only_futures, avoid_print, prefer_const_constructors, avoid_unnecessary_containers, file_names
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:goproperti/Api/config.dart';
import 'package:goproperti/utils/Custom_widget.dart';
import 'package:webview_flutter/webview_flutter.dart';

class MidTrans extends StatefulWidget {
  final String email;
  final String totalAmount;
  final String phonNumber;

  const MidTrans(
      {required this.email,
      required this.totalAmount,
      required this.phonNumber});

  @override
  State<MidTrans> createState() => _MidTransState();
}

class _MidTransState extends State<MidTrans> {
  GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  late WebViewController _controller;
  var progress;
  String? accessToken;
  String? payerID;
  bool isLoading = true;

  @override
  Widget build(BuildContext context) {
    print(widget.email);
    print(widget.totalAmount);
    if (_scaffoldKey.currentState == null) {
      return Scaffold(
        body: SafeArea(
          child: Stack(
            children: [
              WebView(
                initialUrl:
                    "${Config.baseurl}Midtrans/index.php?name=test&email=${widget.email}&phone=${widget.phonNumber}&amt=${widget.totalAmount}",
                javascriptMode: JavascriptMode.unrestricted,
                navigationDelegate: (NavigationRequest request) async {
                  final uri = Uri.parse(request.url);
                  if (uri.queryParameters["transaction_status"] == null) {
                    accessToken = uri.queryParameters["token"];
                  } else {
                    if (uri.queryParameters["status_code"] == "200") {
                      payerID = await uri.queryParameters["order_id"];
                      Get.back(result: payerID);
                    } else {
                      Get.back();
                      showToastMessage(
                          "${uri.queryParameters["transaction_status"]}");
                    }
                  }
                  return NavigationDecision.navigate;
                },
                gestureNavigationEnabled: true,
                onWebViewCreated: (controller) {
                  _controller = controller;
                },
                onPageFinished: (finish) {
                  setState(() async {
                    isLoading = false;
                  });
                },
                onProgress: (val) {
                  progress = val;
                  setState(() {});
                },
              ),
              isLoading
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          SizedBox(
                            child: CircularProgressIndicator(),
                          ),
                          SizedBox(height: Get.height * 0.02),
                          SizedBox(
                            width: Get.width * 0.80,
                            child: Text(
                              'Please don`t press back until the transaction is complete'
                                  .tr,
                              maxLines: 2,
                              textAlign: TextAlign.center,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 15,
                                  fontWeight: FontWeight.w500,
                                  letterSpacing: 0.5),
                            ),
                          ),
                        ],
                      ),
                    )
                  : Stack(),
            ],
          ),
        ),
      );
    } else {
      return Scaffold(
        key: _scaffoldKey,
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => Get.back(),
          ),
          backgroundColor: Colors.black12,
          elevation: 0.0,
        ),
        body: Center(
          child: Container(
            child: CircularProgressIndicator(),
          ),
        ),
      );
    }
  }
}

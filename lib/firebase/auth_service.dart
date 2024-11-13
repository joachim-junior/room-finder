// ignore_for_file: avoid_print

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';

class AuthService extends ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  singInAndStoreData(
      {required String email,
      required String uid,
      required String proPicPath}) async {
    try {
      await FirebaseMessaging.instance.getToken().then((token) {
        _firestore.collection("users").doc(uid).set({
          "uid": uid,
          "name": email,
          "token": "$token",
          "isOnline": false,
          "pro_pic": proPicPath
        });
      });
    } catch (e) {
      print("+++++++ FirebaseAuthException +++++ $e");
    }
  }

  singUpAndStore(
      {required String email, required String uid, required proPicPath}) async {
    try {
      await FirebaseMessaging.instance.getToken().then((token) {
        _firestore.collection("users").doc(uid).set({
          "uid": uid,
          "name": email,
          "token": "$token",
          "isOnline": false,
          "pro_pic": proPicPath
        }, SetOptions(merge: true));
      });
    } catch (e) {
      print("+++++++ FirebaseAuthException +++++ $e");
    }
  }
}

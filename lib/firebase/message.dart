import 'package:cloud_firestore/cloud_firestore.dart';

class Message {
  final String senderId;
  final String senderName;
  final String reciverId;
  final String message;
  final Timestamp timestamp;

  Message(
      {required this.senderId,
      required this.senderName,
      required this.reciverId,
      required this.message,
      required this.timestamp});

  Map<String, dynamic> toMap() {
    return {
      'senderid': senderId,
      'senderName': senderName,
      'reciverId': reciverId,
      'message': message,
      'timestamp': timestamp,
    };
  }
}

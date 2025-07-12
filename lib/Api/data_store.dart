// lib/Api/data_store.dart
// ignore_for_file: non_constant_identifier_names

import 'package:get_storage/get_storage.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';

final getData = GetStorage();

save(Key, val) {
  final data = GetStorage();
  data.write(Key, val);
}

class DataStore extends GetxController {
  static DataStore get to => Get.find();

  final SharedPreferences _prefs;
  DataStore(this._prefs);

  dynamic read(String key) => _prefs.get(key);
  Future<void> write(String key, dynamic value) async {
    if (value is String) await _prefs.setString(key, value);
    if (value is int) await _prefs.setInt(key, value);
    if (value is bool) await _prefs.setBool(key, value);
    if (value is double) await _prefs.setDouble(key, value);
    if (value is List<String>) await _prefs.setStringList(key, value);
  }
}

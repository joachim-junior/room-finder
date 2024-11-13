// To parse this JSON data, do
//
//     final searchInfo = searchInfoFromJson(jsonString);

import 'dart:convert';

SearchInfo searchInfoFromJson(String str) =>
    SearchInfo.fromJson(json.decode(str));

String searchInfoToJson(SearchInfo data) => json.encode(data.toJson());

class SearchInfo {
  SearchInfo({
    required this.id,
    required this.title,
    required this.rate,
    required this.buyorrent,
    required this.plimit,
    required this.city,
    required this.image,
    required this.propertyType,
    required this.price,
    required this.isFavourite,
  });

  String id;
  String title;
  String rate;
  String buyorrent;
  String plimit;
  String city;
  String image;
  String propertyType;
  String price;
  int isFavourite;

  factory SearchInfo.fromJson(Map<String, dynamic> json) => SearchInfo(
        id: json["id"],
        title: json["title"],
        rate: json["rate"],
        buyorrent: json["buyorrent"],
        plimit: json["plimit"],
        city: json["city"],
        image: json["image"],
        propertyType: json["property_type"],
        price: json["price"],
        isFavourite: json["IS_FAVOURITE"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "title": title,
        "rate": rate,
        "buyorrent": buyorrent,
        "plimit": plimit,
        "city": city,
        "image": image,
        "property_type": propertyType,
        "price": price,
        "IS_FAVOURITE": isFavourite,
      };
}

// To parse this JSON data, do
//
//     final homesearchModel = homesearchModelFromJson(jsonString);

import 'dart:convert';

HomesearchModel homesearchModelFromJson(String str) => HomesearchModel.fromJson(json.decode(str));

String homesearchModelToJson(HomesearchModel data) => json.encode(data.toJson());

class HomesearchModel {
  List<SearchPropety>? searchPropety;
  String? responseCode;
  String? result;
  String? responseMsg;

  HomesearchModel({
    this.searchPropety,
    this.responseCode,
    this.result,
    this.responseMsg,
  });

  factory HomesearchModel.fromJson(Map<String, dynamic> json) => HomesearchModel(
    searchPropety: json["search_propety"] == null ? [] : List<SearchPropety>.from(json["search_propety"]!.map((x) => SearchPropety.fromJson(x))),
    responseCode: json["ResponseCode"],
    result: json["Result"],
    responseMsg: json["ResponseMsg"],
  );

  Map<String, dynamic> toJson() => {
    "search_propety": searchPropety == null ? [] : List<dynamic>.from(searchPropety!.map((x) => x.toJson())),
    "ResponseCode": responseCode,
    "Result": result,
    "ResponseMsg": responseMsg,
  };
}

class SearchPropety {
  String? id;
  String? title;
  String? rate;
  String? buyorrent;
  String? plimit;
  String? city;
  String? image;
  String? propertyType;
  String? price;
  int? isFavourite;

  SearchPropety({
    this.id,
    this.title,
    this.rate,
    this.buyorrent,
    this.plimit,
    this.city,
    this.image,
    this.propertyType,
    this.price,
    this.isFavourite,
  });

  factory SearchPropety.fromJson(Map<String, dynamic> json) => SearchPropety(
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

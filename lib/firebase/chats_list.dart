import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:goproperti/Api/config.dart';
import 'package:goproperti/Api/data_store.dart';
import 'package:goproperti/firebase/chat_screen.dart';
import 'package:goproperti/firebase/chat_service.dart';
import 'package:goproperti/model/fontfamily_model.dart';
import 'package:goproperti/utils/Dark_lightmode.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class ChatList extends StatefulWidget {
  const ChatList({super.key});

  @override
  State<ChatList> createState() => _ChatListState();
}

class _ChatListState extends State<ChatList> {
  late ColorNotifire notifire;
  TextEditingController searchController = TextEditingController();

  List searchList = [];
  List _searchIndexList = [];

  @override
  void dispose() {
    super.dispose();
    searchiteams.clear();
  }

  @override
  Widget build(BuildContext context) {
    notifire = Provider.of<ColorNotifire>(context, listen: true);

    return Scaffold(
      backgroundColor: notifire.getbgcolor,
      appBar: AppBar(
          backgroundColor: notifire.getbgcolor,
          centerTitle: true,
          elevation: 0,
          leading: BackButton(
            color: notifire.getwhiteblackcolor,
            onPressed: () {
              Get.back();
            },
          ),
          title: Text(
            "Chats",
            style: TextStyle(
              fontFamily: FontFamily.gilroyBold,
              fontSize: 18,
              color: notifire.getwhiteblackcolor,
            ),
          )),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 15),
            child: TextField(
                style: TextStyle(color: notifire.getwhiteblackcolor, fontFamily: FontFamily.gilroyMedium, fontSize: 16),
                controller: searchController,
                decoration: InputDecoration(
                    contentPadding: const EdgeInsets.all(15),
                    isDense: true,
                    hintStyle: TextStyle(color: notifire.getgreycolor),
                    hintText: "Search..",
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide(color: notifire.getborderColor)),
                    enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide(color: notifire.getborderColor)),
                    focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide(color: notifire.getborderColor)),
                    disabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide(color: notifire.getborderColor)),
                    errorBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide:
                            BorderSide(color: notifire.getborderColor))),
                onChanged: (s) {
                  _searchIndexList = [];
                  for (int i = 0; i < searchiteams.length; i++) {
                    if (searchiteams[i]["name"]
                        .toLowerCase()
                        .contains(s.toLowerCase())) {
                      final ids =
                          searchiteams.map<String>((e) => e['uid']!).toSet();

                      searchiteams.retainWhere((Map x) {
                        return ids.remove(x['uid']);
                      });

                      setState(() {});
                      _searchIndexList.add(i);
                    } else {
                      setState(() {});
                    }
                  }
                }),
          ),
          searchController.text.isEmpty
              ? Expanded(child: _buildUserList())
              : _searchIndexList.isEmpty
                  ?  Expanded(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text("User Not Found",style: TextStyle(fontFamily: FontFamily.gilroyMedium, color: notifire.getwhiteblackcolor),),
                        ],
                      ),
                    )
                  : Expanded(
                      child: ListView.builder(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        itemCount: _searchIndexList.length,
                        itemBuilder: (context, index) {
                          var result = _searchIndexList[index];
                          bool imageisemty =
                              searchiteams[result]["image"] == 'null';
                          return ListTile(
                            onTap: () {
                              Get.to(ChatPage(
                                proPic: searchiteams[result]["image"],
                                resiverUserId: searchiteams[result]["uid"],
                                resiverUseremail: searchiteams[result]["name"],
                              ));
                            },
                            subtitle: Text(searchiteams[result]["message"],
                                style: TextStyle(
                                  fontSize: 14,
                                  color: notifire.getwhiteblackcolor,
                                  fontFamily: FontFamily.gilroyLight,
                                )),
                            trailing: Text(
                                DateFormat('hh:mm a')
                                    .format(DateTime.fromMicrosecondsSinceEpoch(
                                        searchiteams[result]["timestamp"]
                                            .microsecondsSinceEpoch))
                                    .toString(),
                                style: TextStyle(
                                  fontSize: 10,
                                  color: notifire.getwhiteblackcolor,
                                  fontFamily: FontFamily.gilroyLight,
                                )),
                            leading: imageisemty
                                ? const CircleAvatar(
                                    backgroundColor: Colors.transparent,
                                    radius: 25,
                                    backgroundImage: AssetImage(
                                      "assets/images/profile-default.png",
                                    ))
                                : CircleAvatar(
                                    backgroundColor: Colors.transparent,
                                    radius: 25,
                                    backgroundImage: NetworkImage(
                                        "${Config.imageUrl}${searchiteams[result]["image"]}")),
                            title: Text(
                              searchiteams[result]["name"].toString(),
                              style:
                                  TextStyle(color: notifire.getwhiteblackcolor, fontFamily: FontFamily.gilroyMedium,),
                            ),
                          );
                        },
                      ),
                    ),
        ],
      ),
    );
  }

  Widget _buildUserList() {
    return StreamBuilder(
        stream: FirebaseFirestore.instance.collection("users").snapshots(),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return const Text("Error");
          }

          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else {
            return ListView(
              children: snapshot.data!.docs.map<Widget>((doc) {
                return _buildUserListIteam(doc, snapshot.data!.docs.length);
              }).toList(),
            );
          }
        });
  }

  ChatServices chatservices = ChatServices();

  Widget _buildUserListIteam(DocumentSnapshot document, int legth) {
    Map<String, dynamic> data = document.data()! as Map<String, dynamic>;

    List ids = [data["uid"], getData.read("UserLogin")["id"]];

    ids.sort();

    if (getData.read("UserLogin")["name"] != data["name"]) {
      return StreamBuilder(
          stream: chatservices.getMessage(
              userId: data["uid"],
              otherUserId: getData.read("UserLogin")["id"]),
          builder: (context, snapshot) {
            if (snapshot.hasError) {
              return Text("Error${snapshot.error}");
            }

            if (snapshot.connectionState == ConnectionState.waiting) {
              return const SizedBox();
            } else {
              return snapshot.data!.docs.isEmpty
                  ? const SizedBox()
                  : _buildMessageiteam(snapshot.data!.docs.last, data["name"],
                      data["uid"], data["pro_pic"].toString(), legth, snapshot);
            }
          });

    } else {
      return Container();
    }
  }

  List<Map> searchiteams = [];
  Widget _buildMessageiteam(DocumentSnapshot document, String email, String uid,
      String proPic, int legnth, var snapshot) {
    Map<String, dynamic> data = document.data() as Map<String, dynamic>;

    if (searchiteams.length < legnth - 1) {
      if (snapshot.data!.docs.isNotEmpty) {
        searchiteams.add({
          "name": email,
          "image": proPic,
          "uid": uid,
          "message": data["message"],
          "timestamp": data["timestamp"]
        });
      }
    }
    return ListTile(
        onTap: () {
          Get.to(ChatPage(
            proPic: proPic,
            resiverUserId: uid,
            resiverUseremail: email,
          ));
        },
        leading: proPic == "null"
            ? const CircleAvatar(
                backgroundColor: Colors.transparent,
                radius: 25,
                backgroundImage: AssetImage(
                  "assets/images/profile-default.png",
                ))
            : CircleAvatar(
                backgroundColor: Colors.transparent,
                radius: 25,
                backgroundImage: NetworkImage("${Config.imageUrl}$proPic")),
        title: Text(
          email,
          style: TextStyle(color: notifire.getwhiteblackcolor),
        ),
        subtitle: Text(
          data["message"],
          style: TextStyle(
            fontSize: 14,
            color: notifire.getwhiteblackcolor,
            fontFamily: FontFamily.gilroyLight,
          ),
        ),
        trailing: Text(
            DateFormat('hh:mm a')
                .format(DateTime.fromMicrosecondsSinceEpoch(
                    data["timestamp"].microsecondsSinceEpoch))
                .toString(),
            style: TextStyle(
              fontSize: 10,
              color: notifire.getwhiteblackcolor,
              fontFamily: FontFamily.gilroyLight,
            )));
  }

  Future<dynamic> isMeassageAvalable(String chatroom) async {
    CollectionReference collectionReference =
        FirebaseFirestore.instance.collection('chat_rooms');

    var data0 =
        await collectionReference.doc(chatroom).collection("message").get();

    return data0.docs.length;
  }
}

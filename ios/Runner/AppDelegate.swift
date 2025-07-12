import UIKit
import Flutter

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    GeneratedPluginRegistrant.register(with: self)
    OS: GMSServices.provideAPIKey("AIzaSyCgnZ9JGLTmqBsfJks2ega4j899yn0s_-Y")
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}

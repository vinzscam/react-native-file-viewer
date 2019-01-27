
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@class UIViewController;

@interface RNFileViewer : RCTEventEmitter <RCTBridgeModule>

+ (UIViewController*)topViewController;
+ (UIViewController*)topViewControllerWithRootViewController:(UIViewController*)viewController;

@end


#import "RNFileViewerManager.h"
#import <QuickLook/QuickLook.h>
#import <React/RCTConvert.h>

#define OPEN_EVENT @"RNFileViewerDidOpen"
#define DISMISS_EVENT @"RNFileViewerDidDismiss"

@interface File: NSObject<QLPreviewItem>

@property(readonly, nullable, nonatomic) NSURL *previewItemURL;
@property(readonly, nullable, nonatomic) NSString *previewItemTitle;

- (id)initWithPath:(NSString *)file title:(NSString *)title;

@end

@interface RNFileViewer ()<QLPreviewControllerDelegate>
@end

@implementation File

- (id)initWithPath:(NSString *)file title:(NSString *)title {
    if(self = [super init]) {
        _previewItemURL = [NSURL fileURLWithPath:file];
        _previewItemTitle = title;
    }
    return self;
}

@end

@interface CustomQLViewController: QLPreviewController<QLPreviewControllerDataSource>

@property(nonatomic, strong) File *file;
@property(nonatomic, strong) NSNumber *invocation;

@end

@implementation CustomQLViewController

- (instancetype)initWithFile:(File *)file identifier:(NSNumber *)invocation {
    if(self = [super init]) {
        _file = file;
        _invocation = invocation;
        self.dataSource = self;
    }
    return self;
}

- (BOOL)prefersStatusBarHidden {
    return UIApplication.sharedApplication.isStatusBarHidden;
}

- (NSInteger)numberOfPreviewItemsInPreviewController:(QLPreviewController *)controller{
    return 1;
}

- (id <QLPreviewItem>)previewController:(QLPreviewController *)controller previewItemAtIndex:(NSInteger)index{
    return self.file;
}

@end

@implementation RNFileViewer

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (UIViewController*)topViewController {
    UIViewController *presenterViewController = [self topViewControllerWithRootViewController:UIApplication.sharedApplication.keyWindow.rootViewController];
    return presenterViewController ? presenterViewController : UIApplication.sharedApplication.keyWindow.rootViewController;
}

+ (UIViewController*)topViewControllerWithRootViewController:(UIViewController*)viewController {
    if ([viewController isKindOfClass:[UITabBarController class]]) {
        UITabBarController* tabBarController = (UITabBarController*)viewController;
        return [self topViewControllerWithRootViewController:tabBarController.selectedViewController];
    }
    if ([viewController isKindOfClass:[UINavigationController class]]) {
        UINavigationController* navContObj = (UINavigationController*)viewController;
        return [self topViewControllerWithRootViewController:navContObj.visibleViewController];
    }
    if (viewController.presentedViewController && !viewController.presentedViewController.isBeingDismissed) {
        UIViewController* presentedViewController = viewController.presentedViewController;
        return [self topViewControllerWithRootViewController:presentedViewController];
    }
    for (UIView *view in [viewController.view subviews]) {
        id subViewController = [view nextResponder];
        if ( subViewController && [subViewController isKindOfClass:[UIViewController class]]) {
            if ([(UIViewController *)subViewController presentedViewController]  && ![subViewController presentedViewController].isBeingDismissed) {
                return [self topViewControllerWithRootViewController:[(UIViewController *)subViewController presentedViewController]];
            }
        }
    }
    return viewController;
}

- (void)previewControllerDidDismiss:(CustomQLViewController *)controller {
    [self sendEventWithName:DISMISS_EVENT body: @{@"id": controller.invocation}];
}

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
    return @[OPEN_EVENT, DISMISS_EVENT];
}

RCT_EXPORT_METHOD(open:(NSString *)path invocation:(nonnull NSNumber *)invocationId
    options:(NSDictionary *)options)
{
    NSString *displayName = [RCTConvert NSString:options[@"displayName"]];
    File *file = [[File alloc] initWithPath:path title:displayName];

    QLPreviewController *controller = [[CustomQLViewController alloc] initWithFile:file identifier:invocationId];
    controller.delegate = self;

    typeof(self) __weak weakSelf = self;
    [[RNFileViewer topViewController] presentViewController:controller animated:YES completion:^{
        [weakSelf sendEventWithName:OPEN_EVENT body: @{@"id": invocationId}];
    }];
}

@end

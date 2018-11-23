
#import "RNFileViewerManager.h"
#import <QuickLook/QuickLook.h>
#import <React/RCTConvert.h>

@interface File: NSObject<QLPreviewItem>

@property(readonly, nullable, nonatomic) NSURL *previewItemURL;
@property(readonly, nullable, nonatomic) NSString *previewItemTitle;

- (id)initWithPath:(NSString *)file title:(NSString *)title;

@end

@interface FileDelegate: NSObject<QLPreviewControllerDataSource, QLPreviewControllerDelegate>

@property(nonatomic) File *file;
@property(nonatomic) void (^dismissHandler)();

@end

@implementation FileDelegate

- (NSInteger)numberOfPreviewItemsInPreviewController:(QLPreviewController *)controller{
    return 1;
}

- (id <QLPreviewItem>)previewController:(QLPreviewController *)controller previewItemAtIndex:(NSInteger)index{
    return self.file;
}

- (void)previewControllerWillDismiss:(QLPreviewController *)controller {
    self.dismissHandler();
}

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


@interface CustomQLViewController: QLPreviewController
@end

@implementation CustomQLViewController

- (BOOL)prefersStatusBarHidden {
    return UIApplication.sharedApplication.isStatusBarHidden;
}

@end

@interface RNFileViewer ()

@property(nonatomic) NSMutableArray<FileDelegate *> *delegates;

@end

@implementation RNFileViewer

- (instancetype)init
{
    if (self = [super init])
    {
        self.delegates = [NSMutableArray new];
    }
    return self;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (UIViewController*)topViewController {
    return [self topViewControllerWithRootViewController:[UIApplication sharedApplication].keyWindow.rootViewController];
}

+ (UIViewController*)topViewControllerWithRootViewController:(UIViewController*)viewController {
    if ([viewController isKindOfClass:[UITabBarController class]]) {
        UITabBarController* tabBarController = (UITabBarController*)viewController;
        return [self topViewControllerWithRootViewController:tabBarController.selectedViewController];
    } else if ([viewController isKindOfClass:[UINavigationController class]]) {
        UINavigationController* navContObj = (UINavigationController*)viewController;
        return [self topViewControllerWithRootViewController:navContObj.visibleViewController];
    } else if (viewController.presentedViewController && !viewController.presentedViewController.isBeingDismissed) {
        UIViewController* presentedViewController = viewController.presentedViewController;
        return [self topViewControllerWithRootViewController:presentedViewController];
    }
    else {
        for (UIView *view in [viewController.view subviews])
        {
            id subViewController = [view nextResponder];
            if (subViewController && [subViewController isKindOfClass:[UIViewController class]])
            {
                if ([(UIViewController *)subViewController presentedViewController]  && ![subViewController presentedViewController].isBeingDismissed) {
                    return [self topViewControllerWithRootViewController:[(UIViewController *)subViewController presentedViewController]];
                }
            }
        }
        return viewController;
    }
}

RCT_EXPORT_MODULE()

RCT_REMAP_METHOD(open,
  path:(NSString *)path
  options:(NSDictionary *)options
  resolver:(RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject)
{
    FileDelegate *delegate = [FileDelegate new];
    NSString *displayName = [RCTConvert NSString:options[@"displayName"]];
    delegate.file = [[File alloc] initWithPath: path title:displayName];
    __weak typeof(self) weakSelf = self;
    __weak typeof(delegate) weakDelegate = delegate;
    delegate.dismissHandler = ^{
        [weakSelf.delegates removeObject:weakDelegate];
        resolve(nil);
    };
    [self.delegates addObject:delegate];

    QLPreviewController *controller = [CustomQLViewController new];
    controller.delegate = delegate;
    controller.dataSource = delegate;
    
    [[RNFileViewer topViewController] presentViewController:controller animated:YES completion:nil];
}

@end

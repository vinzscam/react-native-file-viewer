
#import "RNFileViewerManager.h"
#import <QuickLook/QuickLook.h>

@interface File: NSObject<QLPreviewItem>

@property(readonly, nullable, nonatomic) NSURL *previewItemURL;
@property(readonly, nullable, nonatomic) NSString *previewItemTitle;

- (id)initWithPath:(NSString *)file title:(NSString *)title;

@end

@interface FileDelegate: NSObject<QLPreviewControllerDataSource, QLPreviewControllerDelegate>

@property(nonatomic, strong) File *file;

@end

@implementation FileDelegate

- (NSInteger)numberOfPreviewItemsInPreviewController:(QLPreviewController *)controller{
    return 1;
}

- (id <QLPreviewItem>)previewController:(QLPreviewController *)controller previewItemAtIndex:(NSInteger)index{
    return self.file;
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

@implementation RNFileViewer

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()

RCT_REMAP_METHOD(open,
  path:(NSString *)path
  title:(NSString *)title
  resolver:(RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject)
{
    FileDelegate *delegate = [FileDelegate new];
    delegate.file = [[File alloc] initWithPath: path title:title];
    
    QLPreviewController *controller = [QLPreviewController new];
    controller.delegate = delegate;
    controller.dataSource = delegate;
    
    UIViewController *root = [[[UIApplication sharedApplication] keyWindow] rootViewController];
    [root presentViewController:controller animated:YES completion:^{ resolve(nil); }];
}

@end

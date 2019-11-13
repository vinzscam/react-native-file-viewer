using ReactNative.Bridge;
using Windows.Storage;
using Windows.System;
using System;
using Newtonsoft.Json.Linq;
using Windows.UI.Core;

namespace RNFileViewer
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNFileViewerModule : NativeModuleBase
    {
        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNFileViewer";
            }
        }

        [ReactMethod]
        public async void open(string filepath, JObject _, IPromise promise)
        {
            await Windows.ApplicationModel.Core.CoreApplication.MainView.CoreWindow.Dispatcher.RunAsync(CoreDispatcherPriority.Normal,
            async () =>
            {

                try
                {
                    var file = await StorageFile.GetFileFromPathAsync(filepath);

                    if (file != null)
                    {
                        var success = await Launcher.LaunchFileAsync(file);

                        if (success)
                        {
                            promise.Resolve(null);
                        }
                        else
                        {
                            promise.Reject(null, "File open failed.");
                        }
                    }
                    else
                    {
                        promise.Reject(null, "File not found.");
                    }
                }
                catch (Exception e)
                {
                    promise.Reject(null, filepath, e);
                }
            }
           );

        }
    }
}

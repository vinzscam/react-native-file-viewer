using ReactNative.Bridge;
using Windows.Storage;
using Windows.System;
using System;

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
        public async void open(string filepath, string _, IPromise promise)
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
            } catch (Exception e)
            {
                promise.Reject(null, filepath, e);
            }
            
        }
    }
}

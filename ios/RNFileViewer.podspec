
Pod::Spec.new do |s|
  s.name         = "RNFileViewer"
  s.version      = "1.0.1"
  s.summary      = "RNFileViewer"
  s.description  = <<-DESC
                  Native file viewer for react-native
                   DESC
  s.homepage     = "https://github.com/vinzscam/react-native-file-viewer"
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "vinz.scamporlino@gmail.com" }
  s.platform     = :ios, "9.0"
  s.source       = { :git => "https://github.com/vinzscam/react-native-file-viewer.git", :tag => "master" }
  s.source_files  = "*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end

  

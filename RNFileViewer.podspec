require 'json'
package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "RNFileViewer"
  s.version      = package['version']
  s.summary      = package["description"]
  s.homepage     = "https://github.com/vinzscam/react-native-file-viewer"
  s.license      = package["license"]
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author       = { "Vincenzo Scamporlino" => "vinz.scamporlino@gmail.com" }
  s.platform     = :ios, "9.0"
  s.source       = { :git => "https://github.com/vinzscam/react-native-file-viewer.git", :tag => 'v#{s.version}' }
  s.source_files  = "ios/*.{h,m}"
  s.requires_arc = true
  s.dependency "React-Core"
end

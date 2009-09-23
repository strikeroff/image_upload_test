ActionController::Routing::Routes.draw do |map| 
  map.root :controller=>"main"
  
  map.upload_inplace 'upload_inplace', :controller=>"main",:action=>"upload_inplace"
  map.upload "upload", :controller=>"main",:action=>"upload"

  map.connect ':controller/:action/:id'
  map.connect ':controller/:action/:id.:format'
end

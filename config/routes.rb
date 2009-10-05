ActionController::Routing::Routes.draw do |map|
  ID_SEPARATOR = /[^#{::ActionController::Routing::SEPARATORS.join}]+/
  map.root :controller=>"main"

  #map.upload_inplace 'upload_inplace', :controller=>"main",:action=>"upload_inplace"
  #map.upload "upload", :controller=>"main",:action=>"upload"

  #map.
  ############## IMage uploads ##########################
  map.new_image_upload "upload_images/upload_new", :controller=>"upload_images", :action=>"upload_new"
  map.new_image_upload_with_alias "upload_images/upload_new", :controller=>"upload_images", :action=>"upload_new"
  map.crop_image "upload_images/:id/crop", :controller=>"upload_images", :action=>"crop",
                 :requirements=>{:id=>ID_SEPARATOR}
  map.reupload_image "upload_images/:id/reupload_image", :controller=>"upload_images", :action=>"reupload_image",
                     :requirements=>{:id=>ID_SEPARATOR}

  #####################Product urls##########################


  map.resources :products
  ###########################################################

  ###########################  Test url ###########################################
  map.test_crop_image "upload_images/:id/test_crop", :controller=>"upload_images", :action=>"test_crop",
                 :requirements=>{:id=>ID_SEPARATOR}
  
  map.inplace_image "upload_images/:id", :controller=>"upload_images", :action=>"show",
                    :requirements=>{:id=>ID_SEPARATOR}
  ##########################################################################################

  map.image_upload_test "upload_images", :controller=>"upload_images", :action=>"index"
  map.connect ':controller/:action/:id'
  map.connect ':controller/:action/:id.:format'
end

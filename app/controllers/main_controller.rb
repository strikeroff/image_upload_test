class MainController < ApplicationController

  protect_from_forgery :except=>[:upload_inplace, :upload]
  include Inplace::Upload

  def index
    #@inplace_image = InplaceImage.new
    ##@uploaded_file = UploadedFile.new
    #flash[:notice] ||= "Грузи картинку"
  end

  #def upload_complete
  #  flash[:notice] ||= "Картинка загружена"
  #end

  
end

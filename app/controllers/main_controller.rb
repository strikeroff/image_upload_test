class MainController < ApplicationController

  protect_from_forgery :except=>[:upload_inplace, :upload]
  include Inplace::Upload

  def index
    @uploaded_file = UploadedFile.find(:last)||UploadedFile.new
    #@uploaded_file = UploadedFile.new
    flash[:notice] ||= "Грузи картинку"
  end

  
end

class UploadImagesController < ApplicationController

  def upload_new
    @inplace_image = InplaceImage.new(:data => params["inplace_image"]['data'])
    unless  @inplace_image.save
      return render  :action=>"index"
    else
      return render :text=>{'inplace_image_id'=>@inplace_image.id, 'original_image_url'=>@inplace_image.data.url}.to_json
    end
  end

  def crop

  end

  def reupload_image

  end

  def index
    @inplace_image ||= InplaceImage.new
  end

end

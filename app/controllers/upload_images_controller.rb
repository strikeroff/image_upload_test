class UploadImagesController < ApplicationController



  def upload_new
    #  имитируем передачу через url ибо лень писать разные формы :alias=>params[:alias]
    @inplace_image = InplaceImage.new(params["inplace_image"].merge({:alias=>params[:alias]}))
    unless  @inplace_image.save
      return render  :action=>"index"
    else
      return render :text=>{'inplace_image_id'=>@inplace_image.id, 'original_image_url'=>@inplace_image.data.url}.to_json
    end
  end

  def show
    @inplace_image = InplaceImage.find(params["id"])
  end

  def crop
    @inplace_image = InplaceImage.find(params["id"])
    @inplace_image.crop_options= {
            :style_to_crop => params["inplace_image"]["sub_type_name"],
            :crop_geometry => ActiveSupport::JSON.decode(params["inplace_image"][:crop_geometry])
    }

    @inplace_image.save
    @inplace_image.data.processors = :jcropper
    @inplace_image.data.reprocess!
  end

  def reupload_image
    @inplace_image = InplaceImage.find(params["id"])
    @inplace_image.attributes.merge!(params["inplace_image"].merge({:alias=>params[:alias]}))
    @inplace_image.data = params["inplace_image"]['data']

    Configuration.image_types[params["inplace_image"]['geometry_type']].each do |style|
      @inplace_image.data.add_style({:"#{style["name"]}" => "#{style["width"]}x#{style['height']}"})
    end     

    unless  @inplace_image.save
      return render  :action=>"index"
    else    
      return render :text=>{'inplace_image_id'=>@inplace_image.id, 'original_image_url'=>@inplace_image.data.url}.to_json
    end
  end

  def index
    @inplace_image ||= InplaceImage.new
  end

end

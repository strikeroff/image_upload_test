class InplaceImage < ActiveRecord::Base
  has_attached_file :data,
                    :url => ":class/:attachment/:id/:style/:basename.:extension",
                    :path => ":rails_root/public/images/:class/:attachment/:id/:style/:basename.:extension"
  validates_attachment_presence :data
  serialize :upload_params

  attr_accessor :geometry_type, :crop_options


  def crop_str
    unless self.crop_geometry.blank?
      crop_geometry =self.crop_options[:crop_geometry]
      x = crop_geometry[0]
      y = crop_geometry[1]
      width =  crop_geometry[2]
      height = crop_geometry[3]
      "-crop #{width}x#{height}+#{x}+#{y}"
    else
      ""
    end
  end
end

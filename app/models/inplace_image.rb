class InplaceImage < ActiveRecord::Base
  has_attached_file :data,
                    :url => ":class/:attachment/:id/:style/:basename.:extension",
                    :path => ":rails_root/public/images/:class/:attachment/:id/:style/:basename.:extension"
  validates_attachment_presence :data
  validates_presence_of :geometry_type
  #validates_length_of :geometry_type, :within => 3..20
  

  attr_accessor  :crop_options
  attr_accessor :save_data_options

  def crop_str
    return "" if self.crop_options.blank?
    crop_geometry = self.crop_options[:crop_geometry]
    x = crop_geometry[0]
    y = crop_geometry[1]
    width =  crop_geometry[2]
    height = crop_geometry[3]
    "-crop #{width}x#{height}+#{x}+#{y}"
  end
end

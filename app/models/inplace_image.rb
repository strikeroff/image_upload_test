class InplaceImage < ActiveRecord::Base
  has_attached_file :data,
                    :url => ":class/:attachment/:id/:style/:basename.:extension",
                    :path => ":rails_root/public/images/:class/:attachment/:id/:style/:basename.:extension"
  validates_attachment_presence :data
  serialize :upload_params

  def crop_str
    unless self.upload_params.blank? || self.upload_params['crop'].blank?
      x = self.upload_params['crop'][0]
      y = self.upload_params['crop'][1]
      width =  self.upload_params['crop'][2]
      height = self.upload_params['crop'][3]
      "-crop #{width}x#{height}+#{x}+#{y}"
    else
      ""
    end
  end
end

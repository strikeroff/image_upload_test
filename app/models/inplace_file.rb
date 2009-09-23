class InplaceFile < ActiveRecord::Base
   has_attached_file :data,
          :url => ":class/:attachment/:id/:basename.:extension",
          :path => ":rails_root/public/:class/:attachment/:id/:basename.:extension"
   validates_attachment_presence :data
   serialize :upload_params
end

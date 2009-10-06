class Product < ActiveRecord::Base
  #
  #include InplaceImageSupport
  has_image :thumbnail # type is :product by default
  has_image :detail, :geometry_type => :detail
  has_file :file_description, :content_types => ["application/x-rar-compressed"], :in=>120..90000


  validates_presence_of :title, :description
  validates_length_of :title, :minimum => 3
  validates_length_of :description, :minimum  => 3


end

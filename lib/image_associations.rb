module InplaceImageSupport
  def self.included(clazz)
    clazz.extend(ClassMethods)
  end
  module ClassMethods
    def has_image(name, options={})
      class_variable_set(:"@@class_images", {}) unless class_variable_defined?(:"@@class_images")
      class_images = class_variable_get(:"@@class_images")
      geometry_type   = (options[:geometry_type].blank?)? self.name.downcase : options[:geometry_type]
      class_images[name] ||={}
      class_images[name].merge!({:geometry_type=>geometry_type})
      class_variable_set(:"@@class_images", class_images)
      define_image_proxies name
    end

    def define_image_proxies(name, options={})
      class_image_options = class_variable_get(:"@@class_images")[name]
      association = <<ASSOSIATION_EVAL
        belongs_to :#{name}_original, :foreign_key => '#{name}_id', :class_name => "InplaceImage"
ASSOSIATION_EVAL

      self.class_eval do
        eval association
      end
      
      proxies = <<PROXY_EVAL
  def #{name}(options={})
      #{name}_original.data(options)
  end

  def #{name}=(data)
       self.create_#{name}_original({:geometry_type => '#{class_image_options[:geometry_type]}', :data=> data})
  end

PROXY_EVAL
      self.class_eval do
        eval proxies
      end
      #self.class_eval proxies
    end
  end
end

if Object.const_defined?("ActiveRecord")
  ActiveRecord::Base.send(:include, InplaceImageSupport)
end


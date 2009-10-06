module InplaceFileSupport
  def self.included(clazz)
    clazz.extend(ClassMethods)
  end
  module ClassMethods
    def has_file(name, options={})
      class_variable_set(:"@@class_files", {}) unless class_variable_defined?(:"@@class_files")
      class_files = class_variable_get(:"@@class_files")
      class_files[name] ||={}
      class_files[name][:validations] = [] if options[:content_types] || options[:greater_than] ||options[:less_than] ||options[:in]

      if options[:content_types]
        class_files[name][:validations]  << [:content_type, {:if=>nil,
                                                             :unless=>nil,
                                                             :message=>nil,
                                                             :content_type=>options[:content_types]}]
      end

      if options[:greater_than] ||options[:less_than] || options[:in]
        min     = options[:greater_than] || (options[:in] && options[:in].first) || 0
        max     = options[:less_than]    || (options[:in] && options[:in].last)  || (1.0/0)
        range   = (min..max)
        class_files[name][:validations] << [:size, {:range   => range,
                                                    :message => "file size must be between :min and :max bytes.",
                                                    :if      => nil,
                                                    :unless  => nil}]
      end
      
      class_variable_set(:"@@class_files", class_files)
      define_file_proxies name
    end

    def define_file_proxies(name, options={})
      class_file_options = class_variable_get(:"@@class_files")[name]
      association = <<ASSOSIATION_EVAL
        belongs_to :#{name}_original, :foreign_key => '#{name}_id', :class_name => "InplaceFile"
ASSOSIATION_EVAL

      self.class_eval do
        eval association
      end

      proxies = <<PROXY_EVAL
  def #{name}_attached?
       !#{name}_original.blank?
  end

  def #{name}(options={})
      #{name}_original.data(options)   
  end

  def #{name}=(data)
       self.create_#{name}_original({:save_data_options=> #{class_file_options.inspect},:data=> data})
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
  ActiveRecord::Base.send(:include, InplaceFileSupport)
end


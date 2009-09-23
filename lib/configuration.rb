class Configuration
  # Загрузка конфигурационных файлов в окружение Gionet::Configuration
  def self.load_configurations
    if defined? ::RAILS_ROOT
      # Для каждого найденного yaml файла в папке gionet мы производим загрузку в окружение
      Dir["#{::RAILS_ROOT}/config/project/*.yaml"].each do |config_file|
        #                config = YAML.load_file( config_file )
        #                # В случае, если корневой объект, загруженный из файла, является хэшем,
        #                # мы производим создание структуры, имена полей которой соответсвуют
        #                # ключам хэша. Все это делается в целях удобства обращения к конфигурации.
        #                if config.instance_of? Hash
        #                    attrs = []
        #                    config.each_key { |key| attrs << key.to_sym } # извлекаем имена полей
        #                    config_struct = Struct.new *attrs             # создаем структуру с этими полями
        #                    new_config = config_struct.new                # создаем объект этой структуры
        #                    config_struct.members.each do |attr_name|     # инициализируем значения полей объекта
        #                        new_config.send( "#{attr_name}=", config[attr_name] )
        #                    end
        #                    config = new_config                           # отображаем трансформацию в конфиг
        #                end
        #                attr_name = File.basename( config_file, ".yaml" )
        #                self.class_eval do
        #                    cattr_accessor attr_name.to_sym               # создаем в модуле аттрибут
        #                end
        #
        #                self.send("#{attr_name}=", config)              # сохраняем в этот аттрибут значения
        load_configuration_from_file(config_file)
      end
    end

  end

  def self.has?(config_name)
    self.method_defined? config_name
  end


  def self.load_configuration_from_file ( config_file )
    config = YAML.load_file( config_file )
    # В случае, если корневой объект, загруженный из файла, является хэшем,
    # мы производим создание структуры, имена полей которой соответсвуют
    # ключам хэша. Все это делается в целях удобства обращения к конфигурации.
    if config.instance_of? Hash
      attrs = []
      config.each_key { |key| attrs << key.to_sym } # извлекаем имена полей
      config_struct = Struct.new *attrs             # создаем структуру с этими полями
      new_config = config_struct.new                # создаем объект этой структуры
      config_struct.members.each do |attr_name|     # инициализируем значения полей объекта
        new_config.send( "#{attr_name}=", config[attr_name] )
      end
      config = new_config                           # отображаем трансформацию в конфиг
    end
    attr_name = File.basename( config_file, ".yaml" )

    self.class_eval do
      cattr_accessor attr_name.to_sym               # создаем в модуле аттрибут
    end

    self.send("#{attr_name}=", config)
  end


end


Configuration.load_configurations


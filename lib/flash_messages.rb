module FlashMessagesHelpers
   FLASH_NOTICE_KEYS = [:error, :notice, :warning]


  def flash_messages
    return unless messages = flash.keys.select{|k| FLASH_NOTICE_KEYS.include?(k)}
    formatted_messages = messages.map do |type|
      content_tag :div, :class => type.to_s do
        message_for_item(flash[type], flash["#{type}_item".to_sym])
      end
    end
    formatted_messages.join
  end

  def message_for_item(message, item = nil)
    if item.is_a?(Array)
      message % link_to(*item)
    elsif message.class.name == "ActiveRecord::Errors"
      message.full_messages.collect{|v|"<div> #{v}</div>"}.join(" ")
    else
      message % item
    end
  end
end
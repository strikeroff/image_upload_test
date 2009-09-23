class AddUploadParamsToUploadedFile < ActiveRecord::Migration
  def self.up
    add_column :uploaded_files, :upload_params, :text
  end

  def self.down
    remove_column :uploaded_files, :upload_params
  end
end

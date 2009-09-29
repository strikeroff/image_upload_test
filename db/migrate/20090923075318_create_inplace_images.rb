class CreateInplaceImages < ActiveRecord::Migration
  def self.up
    create_table :inplace_images do |t|
      t.string :data_file_name
      t.string :data_content_type
      t.integer :data_file_size
      t.datetime :data_updated_at       
      t.string :geometry_type
      t.string :alias
      t.timestamps
    end
  end

  def self.down
    drop_table :inplace_images
  end
end

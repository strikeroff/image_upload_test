class CreateProducts < ActiveRecord::Migration
  def self.up
    create_table :products do |t|
      t.string :title
      t.text :description
      t.integer :thumbnail_id
      t.integer :detail_id
      t.integer :file_description_id

      t.timestamps
    end
  end

  def self.down
    drop_table :products
  end
end

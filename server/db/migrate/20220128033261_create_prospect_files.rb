class CreateProspectFiles < ActiveRecord::Migration[6.1]
  def change
    create_table :prospect_files do |t|
      t.integer :first_name_index
      t.integer :last_name_index
      t.boolean :force
      t.boolean :has_headers
      t.references :users

      t.timestamps
    end
  end
end

class CreateProspectFiles < ActiveRecord::Migration[6.1]
  def change
    create_table :prospect_files do |t|
      t.integer :email_index
      t.integer :first_name_index
      t.integer :last_name_index
      t.boolean :force
      t.boolean :has_headers
      t.bigint :processed, default: 0
      t.bigint :row_count, default: 0
      t.boolean :finished, default: false

      t.timestamps
    end
  end
end

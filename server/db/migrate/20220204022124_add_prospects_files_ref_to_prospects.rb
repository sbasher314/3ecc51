class AddProspectsFilesRefToProspects < ActiveRecord::Migration[6.1]
  def change
    add_reference :prospects, :prospects_files, foreign_key: true
  end
end

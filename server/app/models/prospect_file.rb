class ProspectFile < ApplicationRecord
  alias_attribute :email_index, :users_id
  validates_presence_of :file, :users_id
  after_commit :count_rows, on: :create
  has_one_attached :file
end

private
  def count_rows
    rows = 0
    CSV.foreach(ActiveStorage::Blob.service.path_for(self.file.key), headers: self.has_headers, col_sep: ',') do |row|
      rows += 1
    end
    update! row_count: rows
    import_prospects
  end
  def import_prospects
    sleep 3
  end

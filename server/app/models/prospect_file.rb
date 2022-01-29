class ProspectFile < ApplicationRecord
  validates_presence_of :file, :user_id
  after_commit :count_rows, on: :create
  has_one_attached :file
end

private
  def count_rows
    rows = 0
    filepath = ActiveStorage::Blob.service.path_for(self.file.key)
    CSV.foreach(filepath, headers: self.has_headers, col_sep: ',') do |row|
      rows += 1
    end
    update! row_count: rows
    ImportProspectsJob.perform_later(filepath, self)
  end

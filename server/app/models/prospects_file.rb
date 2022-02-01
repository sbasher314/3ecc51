class ProspectsFile < ApplicationRecord
  validates_presence_of :file, :email_index, :user_id
  after_commit :count_rows, on: :create
  has_one_attached :file
end

private
  def count_rows
    max_rows = 1000000
    rows = 0
    filepath = ActiveStorage::Blob.service.path_for(self.file.key)
    CSV.foreach(filepath, headers: self.has_headers, col_sep: ',') do |row|
      rows += 1
      break if rows > max_rows
    end
    update! row_count: rows
    if row_count < max_rows
      ImportProspectsJob.perform_later(filepath, self)
    else
      self.file.purge
      self.destroy
      raise 'File contains too many rows (Limit 1,000,000)'
    end
  end

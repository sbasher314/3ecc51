class ImportProspectsJob < ApplicationJob
  queue_as :default

  def perform(filepath, prospects_file)
    row_count = prospects_file[:row_count]

    CSV.foreach(filepath, headers: prospects_file[:has_headers], col_sep: ',') do |row|

      values = {
        email: row[prospects_file[:email_index]],
        first_name: row[prospects_file[:first_name_index]],
        last_name: row[prospects_file[:last_name_index]],
        user_id: prospects_file[:user_id]
      }

      existing_prospects = Prospect.where({
        email: values[:email],
        user_id: values[:user_id]
      })

      if existing_prospects.blank?
        Prospect.create(values)
      elsif prospects_file[:force]
        existing_prospects.update(values)
      end

      processed = prospects_file.processed + 1
      finished = processed == row_count

      prospects_file.update(processed: processed, finished: finished)
      prospects_file.file.purge_later if finished

    end
  end

end

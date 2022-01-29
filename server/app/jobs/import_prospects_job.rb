class ImportProspectsJob < ApplicationJob
  queue_as :default

  def perform(filepath, prospect_file)
    created = 0
    updated = 0
    failed = 0
    skipped = 0
    row_count = prospect_file.row_count
    puts '----------------------------------',
      'starting csv import...',
      '----------------------------------'
    CSV.foreach(filepath, headers: true, col_sep: ',') do |row|
      values = {
        email: row['email'],
        first_name: row['first_name'],
        last_name: row['last_name'],
        user_id: prospect_file.user_id
      }
      existing_prospect = Prospect.find_by(email: row['email'])
      if existing_prospect.nil?
        prospect = Prospect.create(values)
        if prospect.valid?
          created += 1
        else
          failed += 1
        end
      else
        skipped += 1
      end
      processed = prospect_file.processed + 1
      if processed == row_count
        /puts '----------------------------------',
          'import complete!',
          'skipped ' << skipped.to_s << ' of ' << row_count.to_s,
          'inserted ' << created.to_s << ' of ' << row_count.to_s,
          'updated ' << updated.to_s << ' of ' << row_count.to_s,
          'failed ' << failed.to_s << ' of ' << row_count.to_s,
          '----------------------------------'/
       prospect_file.update(processed: processed, finished: true)
       prospect_file.file.purge_later
      else
        prospect_file.update(processed: processed)
      end

    end
  end
end

require 'csv'

class Api::ProspectsFilesController < ApplicationController

  def import
    safe_params = prospects_file_params

    file_is_present = !params[:file].nil?
    email_index_is_present = !params[:email_index].nil?

    if !file_is_present | !email_index_is_present
      render json: {
        'error': 'Missing required parameters',
        'required_parameters_present': {
          'file': file_is_present,
          'email_index': email_index_is_present
        }
      }, status: 400
    elsif params[:file].size() > 200000000
      render json: {'error': 'File too large'}, status: 400
    else
      uploaded = ProspectFile.create(safe_params)
      filepath = ActiveStorage::Blob.service.path_for(uploaded.file.key)
      CSV.foreach(filepath, headers: true, col_sep: ',') do |row|
        puts row['email']
      end
      render json: uploaded
    end
  end

  def prospects_file_params
    params.permit(:file, :email_index, :first_name_index, :last_name_index, :force, :has_headers)
  end

  def parse_csv(filepath)

  end
end

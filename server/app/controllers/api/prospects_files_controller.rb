require 'csv'

class Api::ProspectsFilesController < ApplicationController

  def import
    file_is_present = params[:file].present?
    email_index_is_present = params[:email_index].present?

    if not (file_is_present && email_index_is_present)
      render json: {
        error: 'Missing required parameters',
        required_parameters_present: {
          file: file_is_present,
          email_index: email_index_is_present
        }
      }, status: 400
    elsif params[:file].size() > 200000000
      render json: {error: 'File too large'}, status: 400
    else
      begin
        prospects_file = ProspectsFile.create({
          **prospects_file_params,
          user_id: @user.id})
          render json: prospects_file
      rescue => e
        render json: {error: e}, status: 400
      end
    end
  end

  def progress
    id = params[:id]
    / In theory, we may want to only allow for viewing matching @user.id entries, as it stands any authenticated user can look at any other user's upload progress and we may want to limit that /
    begin
      prospects_file = ProspectsFile.find(id)
      render json: {
        total: prospects_file.row_count,
        done: prospects_file.processed
      }
    rescue
      render json: {error: 'Prospects file with id `' << id.to_s << '` not found'}, status: 400
    end
  end

  def prospects_file_params
    params.permit(:file, :email_index, :first_name_index, :last_name_index, :force, :has_headers)
  end

end

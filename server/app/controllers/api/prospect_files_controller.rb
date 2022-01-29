require 'csv'

class Api::ProspectFilesController < ApplicationController

  def import
    file_is_present = !params[:file].nil?
    email_index_is_present = !params[:email_index].nil?

    if !file_is_present | !email_index_is_present
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
      render json: ProspectFile.create({
        **prospect_file_params,
        user_id: @user.id})
    end
  end

  def progress
    id = params[:id]
    prospect_file = ProspectFile.find(id)
    if prospect_file.nil?
      render json: {error: 'Prospect file with id `' << id.to_s << '` not found'}, status: 400
    else
      render json: {
        total: prospect_file.row_count,
        done: prospect_file.processed
    }
    end
  end

  def prospect_file_params
    params.permit(:file, :email_index, :first_name_index, :last_name_index, :force, :has_headers)
  end

end

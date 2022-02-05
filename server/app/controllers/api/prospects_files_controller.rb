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
      render json: {
        error: 'File too large - maximum file size is 200 MB'
      }, status: 413
    else
      begin
        prospects_file = ProspectsFile.create({
          **prospects_file_params,
          user_id: @user.id
        })
        render json: prospects_file
      rescue => e
        status = /limit/i.match(e.message) ? 413 : 500
        render json: {
          error: e.message
        }, status: status
      end
    end
  end

  def progress
    id = params[:id]
    begin
      prospects_file = ProspectsFile.find_by(id: id, user_id: @user.id)
      render json: {
        total: prospects_file.row_count,
        done: prospects_file.processed
      }
    rescue
      render json: {
        error: 'Prospects file with id `' << id.to_s << '` not found'
      }, status: 404
    end
  end

  def prospects_file_params
    params.permit(:file, :email_index, :first_name_index, :last_name_index, :force, :has_headers)
  end

end

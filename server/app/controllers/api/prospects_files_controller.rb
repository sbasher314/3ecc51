class Api::ProspectsFilesController < ApplicationController

  def import
    safe_params = prospects_file_params
    render json: ProspectFile.create(safe_params)
  end

  def prospects_file_params
    params.permit(:file, :email_index, :first_name_index, :last_name_index, :force, :has_headers)
  end

end

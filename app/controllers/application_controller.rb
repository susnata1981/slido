class ApplicationController < ActionController::Base

  def new_session_path(scope)
    new_user_session_path
  end

  def user_not_joined_event?
    session[:guest].blank?
  end

#  def authenticate_user!
#    debugger
#    super # just if want the default behavior
#    debugger
#    puts "authenticate_user called #{current_user}"
#    render json: {}, status:401 if current_user.nil?
#    render json: current_user
#  end

end
